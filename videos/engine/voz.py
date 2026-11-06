"""Genera la narración de cada escena con una voz local (sin internet ni costo por uso).
Uso: python3 voz.py entrada.json carpeta_salida  → imprime JSON con la duración de cada archivo.
Los montos van marcados como [[12345]] y se leen en palabras: "doce mil trescientos cuarenta y cinco pesos".
Los números sueltos van como {{14}} y se leen sin "pesos"."""
import glob, json, os, re, sys
import numpy as np
import sherpa_onnx
import soundfile as sf
from num2words import num2words

HERE = os.path.dirname(os.path.abspath(__file__))
VOZ = os.environ.get('VOZ', 'vits-piper-es_MX-claude-high')  # alternativas: vits-piper-es_AR-daniela-high, vits-piper-es_MX-ald-medium
VEL = float(os.environ.get('VOZ_VELOCIDAD', '1.1'))


def palabras(t):
    t = re.sub(r'\[\[(-?\d+)\]\]', lambda m: num2words(abs(int(m.group(1))), lang='es') + ' pesos', t)
    t = re.sub(r'\{\{(\d+)\}\}', lambda m: num2words(int(m.group(1)), lang='es'), t)
    return t.replace('un millón', 'un millón').replace(' de pesos', ' pesos')


def main(src, outdir):
    items = json.load(open(src))
    m = os.path.join(HERE, '..', 'voces', VOZ)
    cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=glob.glob(m + '/*.onnx')[0], tokens=m + '/tokens.txt',
                                                   data_dir=m + '/espeak-ng-data'), num_threads=2))
    tts = sherpa_onnx.OfflineTts(cfg)
    os.makedirs(outdir, exist_ok=True)
    res = []
    for i, text in enumerate(items):
        if not text:
            res.append(None)
            continue
        a = tts.generate(palabras(text), sid=0, speed=VEL)
        s = np.array(a.samples, dtype=np.float32)
        nz = np.where(np.abs(s) > 0.01)[0]  # recortar silencios de las puntas
        if len(nz):
            s = s[max(0, nz[0] - 200): nz[-1] + 1200]
        f = os.path.join(outdir, f'vo{i:02d}.wav')
        sf.write(f, s, a.sample_rate)
        res.append({'file': f, 'dur': len(s) / a.sample_rate})
    print(json.dumps(res))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
