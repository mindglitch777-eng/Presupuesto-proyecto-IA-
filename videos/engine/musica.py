"""Beat de trap/phonk generado por código: 808, clap, hi-hats con redobles, cencerro y pad oscuro.
Todo sintetizado, sin samples ni derechos de autor de terceros."""
import numpy as np

SR = 48000
NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)  # número MIDI → Hz

# Una variante por video: tempo, tónica y patrón, para que no suenen todos iguales.
PRESETS = [
    dict(bpm=140, root=45, prog=[0, 0, -4, -2], mel=[12, 15, 19, 17, 15, 12, 10, 12]),
    dict(bpm=150, root=43, prog=[0, 3, -2, 0], mel=[12, 10, 12, 15, 12, 19, 17, 15]),
    dict(bpm=145, root=44, prog=[0, -4, -5, -2], mel=[12, 19, 15, 12, 17, 15, 12, 10]),
    dict(bpm=138, root=41, prog=[0, 0, 3, -2], mel=[12, 15, 12, 17, 19, 17, 15, 12]),
]


def _env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def _sine(f, n, f_start=None, glide=0.02):
    t = np.arange(n) / SR
    fr = np.full(n, f, dtype=float)
    if f_start:
        k = np.exp(-t / glide)
        fr = f + (f_start - f) * k
    return np.sin(2 * np.pi * np.cumsum(fr) / SR)


def _noise(n, rng):
    return rng.uniform(-1, 1, n)


def _hp(x, a=0.95):  # paso alto de un polo
    y = np.zeros_like(x)
    prev_x = prev_y = 0.0
    for i in range(len(x)):
        prev_y = a * (prev_y + x[i] - prev_x)
        prev_x = x[i]
        y[i] = prev_y
    return y


def _lp(x, k):
    return np.convolve(x, np.ones(k) / k, mode='same')


def render(duration, variant=0, seed=1):
    p = PRESETS[variant % len(PRESETS)]
    rng = np.random.default_rng(seed)
    total = int(SR * (duration + 2))
    out = np.zeros(total)
    st = 60 / p['bpm'] / 4  # duración de una semicorchea
    bar = st * 16

    # sonidos base, precalculados
    n808 = int(SR * 0.9)
    clap_n = int(SR * 0.35)
    clap = _hp(_noise(clap_n, rng), .9) * _env(clap_n, .001, .06)
    for k in (0.011, 0.022):  # el "flam" típico del clap
        i = int(SR * k)
        clap[i:] += _hp(_noise(clap_n - i, rng), .9) * _env(clap_n - i, .001, .05) * .7
    clap += _sine(190, clap_n) * _env(clap_n, .001, .03) * .5
    hat_n = int(SR * 0.05)
    hat = _hp(_noise(hat_n, rng), .6) * _env(hat_n, .0005, .012)
    ohat_n = int(SR * 0.2)
    ohat = _hp(_noise(ohat_n, rng), .6) * _env(ohat_n, .001, .07)

    def add(sig, t, g=1.0):
        i = int(SR * t)
        if i >= total:
            return
        out[i:i + len(sig)] += sig[: total - i] * g

    def bell(f, n):  # cencerro de phonk
        s = np.sign(np.sin(2 * np.pi * f * np.arange(n) / SR)) + np.sign(np.sin(2 * np.pi * f * 1.48 * np.arange(n) / SR))
        s = _hp(s, .97)
        return _lp(s, 7) * _env(n, .001, .09)

    kick_pat = [[0, 7, 10], [0, 3, 10, 14], [0, 7, 10], [0, 6, 11, 13]]
    hat_pat = [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0]
    mel_rhythm = [0, 3, 6, 8, 10, 11, 13, 14]
    b = 0
    t0 = 0.0
    while t0 < duration + bar:
        intro = b == 0
        chord = p['root'] + p['prog'][b % 4]
        # 808 con glide
        for s16 in kick_pat[b % 4]:
            f = NOTE(chord - 12 + (12 if s16 == 14 else 0))
            n = n808
            sig = np.tanh(2.2 * _sine(f, n, f_start=f * 2.6, glide=.015)) * _env(n, .002, .45)
            add(sig, t0 + s16 * st, .0 if intro and s16 > 0 else .75)
        # clap en el tiempo 3 (half-time)
        if not intro:
            add(clap, t0 + 8 * st, .55)
        # hi-hats y redoble al final de cada 2 compases
        for s16, on in enumerate(hat_pat):
            if on:
                add(hat, t0 + s16 * st, (.22 if s16 % 2 else .32) * (.5 if intro else 1))
        if b % 2 == 1:
            for k in range(8):
                add(hat, t0 + 12 * st + k * st / 2, .16 + .02 * k)
        add(ohat, t0 + 14 * st, .12)
        # melodía de cencerro
        for k, s16 in enumerate(mel_rhythm):
            note = chord + p['mel'][(k + b * 3) % len(p['mel'])]
            add(bell(NOTE(note), int(SR * .25)), t0 + s16 * st, .07)
        # pad oscuro
        n = int(SR * bar)
        tt = np.arange(n) / SR
        pad = sum(np.sin(2 * np.pi * NOTE(chord + iv) * tt + np.sin(2 * np.pi * .3 * tt)) for iv in (12, 15, 19))
        pad *= np.minimum(1, tt / .3) * np.minimum(1, (bar - tt) / .3)
        add(pad, t0, .035)
        t0 += bar
        b += 1

    out = out[: int(SR * duration)]
    # fade de entrada corto y de salida al final
    fi, fo = int(SR * .05), int(SR * .6)
    out[:fi] *= np.linspace(0, 1, fi)
    out[-fo:] *= np.linspace(1, .3, fo)
    out = np.tanh(out * 1.3)
    return out / (np.max(np.abs(out)) or 1)
