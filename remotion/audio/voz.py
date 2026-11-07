"""Voz de cada escena con Edge TTS y el tiempo de cada palabra (para subtítulos y sincronía).
Uso: python3 audio/voz.py textos.json carpeta_salida   → imprime JSON [{file, dur, words:[{w,t,d}]}].

VOZ_MOTOR:
  edge      (por defecto) es-CO-GonzaloNeural a +22 % (VOZ_EDGE, VOZ_RATE, VOZ_PITCH). Necesita internet: se usa en GitHub Actions.
  estimado  sin internet: audio en silencio con tiempos estimados. Sirve solo para armar y revisar la animación.

En los textos: [[12345]] se lee "doce mil trescientos cuarenta y cinco pesos" y {{14}} se lee "catorce"."""
import asyncio, json, os, re, subprocess, sys, time
import numpy as np
import soundfile as sf
from num2words import num2words

MOTOR = os.environ.get('VOZ_MOTOR', 'edge')
SR_OUT = 48000


def montos(t):
    """Lo que se dice y lo que se muestra de cada monto, para juntar las palabras en un solo subtítulo."""
    out = []
    for m in re.finditer(r'\[\[(-?\d+)\]\]', t):
        n = abs(int(m.group(1)))
        out.append({'hablado': num2words(n, lang='es') + ' pesos', 'ver': '$' + f'{n:,}'.replace(',', '.')})
    for m in re.finditer(r'\{\{(\d+)\}\}', t):
        out.append({'hablado': num2words(int(m.group(1)), lang='es'), 'ver': m.group(1)})
    return out


def hablado(t):
    t = re.sub(r'\[\[(-?\d+)\]\]', lambda m: num2words(abs(int(m.group(1))), lang='es') + ' pesos', t)
    t = re.sub(r'\{\{(\d+)\}\}', lambda m: num2words(int(m.group(1)), lang='es'), t)
    t = re.sub(r'\bBARBER\b', 'bárber', t)
    t = t.replace('WhatsApp', 'guasap').replace('QR', 'cu erre')
    return t


def recortar(s, sr):
    nz = np.where(np.abs(s) > 0.01)[0]
    if not len(nz):
        return s, 0.0
    i0 = max(0, nz[0] - int(sr * .01))
    return s[i0: nz[-1] + int(sr * .06)], i0 / sr


def repartir(text, dur):
    ws = text.split()
    total = sum(len(w) + 2 for w in ws) or 1
    out, t = [], 0.0
    for w in ws:
        d = dur * (len(w) + 2) / total
        out.append({'w': w, 't': round(t, 3), 'd': round(d * .9, 3)})
        t += d
    return out


def gen_edge(text, base):
    import edge_tts
    voice = os.environ.get('VOZ_EDGE', 'es-CO-GonzaloNeural')
    rate = os.environ.get('VOZ_RATE', '+22%')
    pitch = os.environ.get('VOZ_PITCH', '+0Hz')

    async def one(mp3):
        try:
            com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary='WordBoundary')
        except TypeError:
            com = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        words = []
        with open(mp3, 'wb') as f:
            async for ch in com.stream():
                if ch['type'] == 'audio':
                    f.write(ch['data'])
                elif ch['type'] == 'WordBoundary':
                    words.append({'w': ch['text'], 't': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7})
        return words

    mp3, wav = base + '.mp3', base + '.wav'
    for intento in range(5):
        try:
            words = asyncio.run(one(mp3))
            break
        except Exception as e:
            if intento == 4:
                raise
            print(f'reintento {intento + 1}: {e}', file=sys.stderr)
            time.sleep(2 + intento * 3)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', str(SR_OUT), wav], check=True)
    s, sr = sf.read(wav, dtype='float32')
    s, t0 = recortar(s, sr)
    sf.write(wav, s, sr)
    dur = len(s) / sr
    words = [{'w': w['w'], 't': round(max(0, w['t'] - t0), 3), 'd': round(w['d'], 3)} for w in words] or repartir(text, dur)
    return {'file': wav, 'dur': round(dur, 3), 'words': words}


def gen_estimado(text, base):
    ws = text.split()
    pausas = len(re.findall(r'[.,?!…:]', text))
    dur = len(ws) * 0.255 + pausas * 0.16 + 0.1
    wav = base + '.wav'
    sf.write(wav, np.zeros(int(SR_OUT * dur), dtype=np.float32), SR_OUT)
    return {'file': wav, 'dur': round(dur, 3), 'words': repartir(text, dur)}


def main(src, outdir):
    texts = json.load(open(src))
    os.makedirs(outdir, exist_ok=True)
    gen = gen_edge if MOTOR == 'edge' else gen_estimado
    res = [{**gen(hablado(t), os.path.join(outdir, f'{i:02d}')), 'montos': montos(t)} for i, t in enumerate(texts)]
    print(json.dumps(res, ensure_ascii=False))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
