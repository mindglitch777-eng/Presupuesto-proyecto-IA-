"""Mezcla voz + música (la música baja ~10 dB cuando habla la voz) en un solo wav estéreo de 48 kHz.
Los efectos de sonido no van acá: los pone cada escena de Remotion en su cuadro exacto.
Uso: python3 audio/mezcla.py plan.json salida.wav
plan.json: {duracion, estilo, giro, silencio:[t0,t1]|null, voces:[{file, t}]}"""
import json, os, sys
import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import musica  # noqa: E402

SR = 48000


def main(src, dst):
    p = json.load(open(src))
    n = int(SR * p['duracion'])
    voz = np.zeros(n)
    for v in p['voces']:
        s, sr = sf.read(v['file'], dtype='float32')
        if s.ndim > 1:
            s = s.mean(axis=1)
        if sr != SR:
            s = np.interp(np.arange(int(len(s) * SR / sr)) * sr / SR, np.arange(len(s)), s)
        pk = np.max(np.abs(s)) or 1
        s = s / pk * 0.9
        i = int(SR * v['t'])
        m = max(0, min(len(s), n - i))
        voz[i:i + m] += s[:m]

    sil = p.get('silencio')
    mus = musica.render(p['estilo'], p['duracion'], giro=p.get('giro'), silencio=tuple(sil) if sil else None)[:n]
    mus = np.pad(mus, (0, n - len(mus)))
    # ducking: envolvente de la voz suavizada (ataque rápido, salida lenta) → hasta −10 dB
    e = np.abs(voz)
    k = int(SR * .05)
    e = np.convolve(e, np.ones(k) / k, mode='same')
    e = np.clip(e * 12, 0, 1)
    rel = int(SR * .25)
    e = np.maximum(e, np.convolve(e, np.ones(rel) / rel, mode='same'))  # no sube entre palabra y palabra
    gain = 1 - (1 - 10 ** (-10 / 20)) * np.clip(e, 0, 1)
    tiene_voz = np.max(np.abs(voz)) > 0
    mezcla = voz * 0.9 + mus * gain * (0.42 if tiene_voz else 0.55)
    mezcla = np.tanh(mezcla * 1.05) * 0.95
    st = np.stack([mezcla, mezcla], axis=1).astype(np.float32)
    sf.write(dst, st, SR, subtype='PCM_16')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
