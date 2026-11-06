"""Genera la narración de cada escena.
Uso: python3 voz.py entrada.json carpeta_salida  → imprime JSON con la duración de cada archivo.

Motores (variable VOZ_MOTOR):
  edge  (por defecto si está instalado edge-tts) → voces neuronales de Microsoft Edge, gratis, necesitan internet.
        Funciona en GitHub Actions. Voz: VOZ_EDGE (por defecto es-CO-GonzaloNeural, masculina colombiana).
        Velocidad: VOZ_RATE (por defecto +22%). Tono: VOZ_PITCH (por ejemplo -2Hz).
  piper → voz local sin internet (más robótica). Voz: VOZ, velocidad: VOZ_VELOCIDAD.

Los montos van marcados como [[12345]] y se leen en palabras: "doce mil trescientos cuarenta y cinco pesos".
Los números sueltos van como {{14}} y se leen sin "pesos"."""
import asyncio, glob, json, os, re, subprocess, sys, time
import numpy as np
import soundfile as sf
from num2words import num2words

HERE = os.path.dirname(os.path.abspath(__file__))
try:
    import edge_tts  # noqa: F401
    _HAS_EDGE = True
except ImportError:
    _HAS_EDGE = False
MOTOR = os.environ.get('VOZ_MOTOR', 'edge' if _HAS_EDGE else 'piper')


def palabras(t):
    t = re.sub(r'\[\[(-?\d+)\]\]', lambda m: num2words(abs(int(m.group(1))), lang='es') + ' pesos', t)
    t = re.sub(r'\{\{(\d+)\}\}', lambda m: num2words(int(m.group(1)), lang='es'), t)
    return t


def recortar(s, sr, devolver_inicio=False):
    nz = np.where(np.abs(s) > 0.01)[0]  # saca los silencios de las puntas
    i0 = 0
    if len(nz):
        i0 = max(0, nz[0] - int(sr * .01))
        s = s[i0: nz[-1] + int(sr * .05)]
    return (s, i0 / sr) if devolver_inicio else s


def gen_edge(texts, outdir):
    import edge_tts
    voice = os.environ.get('VOZ_EDGE', 'es-CO-GonzaloNeural')
    rate = os.environ.get('VOZ_RATE', '+22%')
    pitch = os.environ.get('VOZ_PITCH', '+0Hz')

    async def one(text, mp3):
        # se pide el audio y el tiempo de cada palabra (para los subtítulos)
        try:
            com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary='WordBoundary')
        except TypeError:  # versiones viejas de edge-tts ya mandan las palabras por defecto
            com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        words = []
        with open(mp3, 'wb') as f:
            async for ch in com.stream():
                if ch['type'] == 'audio':
                    f.write(ch['data'])
                elif ch['type'] == 'WordBoundary':
                    words.append({'w': ch['text'], 't': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7})
        return words

    res = []
    for i, text in enumerate(texts):
        if not text:
            res.append(None)
            continue
        mp3, wav = os.path.join(outdir, f'vo{i:02d}.mp3'), os.path.join(outdir, f'vo{i:02d}.wav')
        for intento in range(4):  # el servicio a veces corta: reintentar
            try:
                words = asyncio.run(one(palabras(text), mp3))
                break
            except Exception as e:
                if intento == 3:
                    raise
                print(f'reintento {intento + 1}: {e}', file=sys.stderr)
                time.sleep(2 + intento * 3)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '24000', wav], check=True)
        s, sr = sf.read(wav, dtype='float32')
        s, t0 = recortar(s, sr, devolver_inicio=True)
        sf.write(wav, s, sr)
        dur = len(s) / sr
        words = [{**w, 't': max(0, w['t'] - t0)} for w in words] or repartir(palabras(text), dur)
        res.append({'file': wav, 'dur': dur, 'words': words})
    return res


def repartir(text, dur):
    """Si el motor no da el tiempo de cada palabra, se reparten según su largo."""
    ws = text.split()
    total = sum(len(w) + 2 for w in ws) or 1
    out, t = [], 0.0
    for w in ws:
        d = dur * (len(w) + 2) / total
        out.append({'w': w, 't': t, 'd': d * .9})
        t += d
    return out


def gen_piper(texts, outdir):
    import sherpa_onnx
    m = os.path.join(HERE, '..', 'voces', os.environ.get('VOZ', 'vits-piper-es_MX-claude-high'))
    cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=glob.glob(m + '/*.onnx')[0], tokens=m + '/tokens.txt',
                                                   data_dir=m + '/espeak-ng-data'), num_threads=2))
    tts = sherpa_onnx.OfflineTts(cfg)
    vel = float(os.environ.get('VOZ_VELOCIDAD', '1.1'))
    res = []
    for i, text in enumerate(texts):
        if not text:
            res.append(None)
            continue
        a = tts.generate(palabras(text), sid=0, speed=vel)
        s = recortar(np.array(a.samples, dtype=np.float32), a.sample_rate)
        f = os.path.join(outdir, f'vo{i:02d}.wav')
        sf.write(f, s, a.sample_rate)
        dur = len(s) / a.sample_rate
        res.append({'file': f, 'dur': dur, 'words': repartir(palabras(text), dur)})
    return res


def main(src, outdir):
    texts = json.load(open(src))
    os.makedirs(outdir, exist_ok=True)
    res = gen_edge(texts, outdir) if MOTOR == 'edge' else gen_piper(texts, outdir)
    print(json.dumps(res))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
