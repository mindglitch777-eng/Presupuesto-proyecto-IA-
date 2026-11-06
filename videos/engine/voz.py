"""Genera la narración de cada escena.
Uso: python3 voz.py entrada.json carpeta_salida  → imprime JSON con la duración de cada archivo.

Motores (variable VOZ_MOTOR):
  edge  (por defecto si está instalado edge-tts) → voces neuronales de Microsoft Edge, gratis, necesitan internet.
        Funciona en GitHub Actions. Voz: VOZ_EDGE (por defecto es-AR-TomasNeural, masculina argentina).
        Velocidad: VOZ_RATE (por ejemplo +10%). Tono: VOZ_PITCH (por ejemplo -2Hz).
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


def recortar(s, sr):
    nz = np.where(np.abs(s) > 0.01)[0]  # saca los silencios de las puntas
    if len(nz):
        s = s[max(0, nz[0] - int(sr * .01)): nz[-1] + int(sr * .05)]
    return s


def gen_edge(texts, outdir):
    import edge_tts
    voice = os.environ.get('VOZ_EDGE', 'es-AR-TomasNeural')
    rate = os.environ.get('VOZ_RATE', '+10%')
    pitch = os.environ.get('VOZ_PITCH', '+0Hz')

    async def one(text, mp3):
        await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(mp3)

    res = []
    for i, text in enumerate(texts):
        if not text:
            res.append(None)
            continue
        mp3, wav = os.path.join(outdir, f'vo{i:02d}.mp3'), os.path.join(outdir, f'vo{i:02d}.wav')
        for intento in range(4):  # el servicio a veces corta: reintentar
            try:
                asyncio.run(one(palabras(text), mp3))
                break
            except Exception as e:
                if intento == 3:
                    raise
                print(f'reintento {intento + 1}: {e}', file=sys.stderr)
                time.sleep(2 + intento * 3)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '24000', wav], check=True)
        s, sr = sf.read(wav, dtype='float32')
        s = recortar(s, sr)
        sf.write(wav, s, sr)
        res.append({'file': wav, 'dur': len(s) / sr})
    return res


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
        res.append({'file': f, 'dur': len(s) / a.sample_rate})
    return res


def main(src, outdir):
    texts = json.load(open(src))
    os.makedirs(outdir, exist_ok=True)
    res = gen_edge(texts, outdir) if MOTOR == 'edge' else gen_piper(texts, outdir)
    print(json.dumps(res))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
