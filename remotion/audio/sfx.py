"""Paleta de efectos de sonido, todos sintetizados con numpy (sin samples ni derechos de terceros).
Uso: python3 audio/sfx.py public/sfx   → escribe un .wav por efecto (48 kHz, mono).
Las escenas de Remotion los ponen en el cuadro exacto con <Sfx s="boom" />."""
import os, sys
import numpy as np
import soundfile as sf

SR = 48000
rng = np.random.default_rng(11)


def T(d):
    return np.arange(int(SR * d)) / SR


def env(d, a=0.002, r=0.2):
    t = T(d)
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)


def sweep(f0, f1, d, kind='sine', curve='exp'):
    n = int(SR * d)
    f = np.geomspace(max(f0, 1), max(f1, 1), n) if curve == 'exp' else np.linspace(f0, f1, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    if kind == 'square':
        return np.sign(np.sin(ph))
    if kind == 'saw':
        return 2 * ((ph / (2 * np.pi)) % 1) - 1
    if kind == 'tri':
        return 2 / np.pi * np.arcsin(np.sin(ph))
    return np.sin(ph)


def tone(f, d, kind='sine'):
    return sweep(f, f, d, kind, 'lin')


def noise(d):
    return rng.uniform(-1, 1, int(SR * d))


def lp(x, cutoff):
    """Paso bajo de un polo (cutoff en Hz)."""
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def hp(x, cutoff):
    return x - lp(x, cutoff)


def bp(x, lo, hi):
    return lp(hp(x, lo), hi)


def fast_lp(x, k):
    k = max(1, int(k))
    return np.convolve(x, np.ones(k) / k, mode='same')


def pad(x, d):
    out = np.zeros(int(SR * d))
    out[:min(len(x), len(out))] = x[:len(out)]
    return out


def at(base, x, t, g=1.0):
    i = int(SR * t)
    if i < len(base):
        n = min(len(x), len(base) - i)
        base[i:i + n] += x[:n] * g
    return base


def reverb(x, d=1.2, mix=0.3):
    out = np.concatenate([x, np.zeros(int(SR * d))])
    wet = np.zeros_like(out)
    for k, (dl, g) in enumerate([(0.029, .5), (0.037, .45), (0.041, .42), (0.053, .38), (0.067, .33), (0.079, .3)]):
        n = int(SR * dl)
        buf = out.copy()
        for rep in range(1, int(d / dl)):
            sh = n * rep
            if sh >= len(out):
                break
            wet[sh:] += buf[:len(out) - sh] * (g ** rep) * .35
    return out * (1 - mix) + fast_lp(wet, 6) * mix


def karplus(f, d, damp=0.996):
    n = int(SR * d)
    p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = damp * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out


def fm(fc, ratio, idx, d, r=0.6):
    t = T(d)
    e = np.exp(-t / r)
    return np.sin(2 * np.pi * fc * t + idx * e * np.sin(2 * np.pi * fc * ratio * t)) * e


# ---------------- recetas ----------------

def boom():
    s = sweep(85, 30, 1.4) * env(1.4, .002, .45) + fast_lp(noise(1.4), 30) * env(1.4, .001, .12) * .7
    return np.tanh(s * 1.6)


def hit():
    s = sweep(160, 45, .55) * env(.55, .001, .13)
    s[:int(SR * .012)] += noise(.012) * .7
    return np.tanh(s * 1.4)


def braam():
    t = T(2.6)
    s = sum(np.sign(np.sin(2 * np.pi * f * t + .3 * np.sin(2 * np.pi * 3 * t))) * g for f, g in [(43.6, 1), (87.3, .6), (65.4, .5), (130.8, .25)])
    s = fast_lp(s, 18) * np.minimum(1, t / .04) * np.exp(-t / 1.1)
    return reverb(np.tanh(s * 1.2), 1.4, .3)


def whoosh():
    n = noise(.55)
    s = bp(n, 300, 1800) * np.sin(np.pi * np.clip(T(.55) / .55, 0, 1)) ** 2
    return s * 2.2


def whoosh_rev():
    return whoosh()[::-1]


def swish():  # latigazo corto
    s = bp(noise(.22), 1200, 6000) * np.sin(np.pi * T(.22) / .22) ** 3
    return s * 2.5


def riser():
    d = 2.0
    t = T(d)
    s = bp(noise(d), 500, 7000) * (t / d) ** 2 * .7 + sweep(200, 1600, d, 'saw') * (t / d) ** 2 * .25
    return s


def glass():
    out = np.zeros(int(SR * 1.3))
    for k in range(70):
        f = rng.uniform(2500, 9000)
        g = tone(f, .25) * env(.25, .0005, rng.uniform(.02, .09)) * rng.uniform(.2, .6)
        at(out, g, rng.uniform(0, .35) ** 1.6)
    at(out, hp(noise(.3), 2000) * env(.3, .001, .05), 0, 1.2)
    at(out, hit() * .6, 0)
    return out


def tick():
    return (bp(noise(.03), 2500, 5000) * 1.5 + tone(3200, .03) * .4) * env(.03, .0005, .006)


def clock():  # tic-tac de reloj de pared
    out = np.zeros(int(SR * 1.0))
    at(out, tick(), 0)
    at(out, bp(noise(.03), 1500, 3000) * env(.03, .0005, .006) * 1.4, .5)
    return out


def coin():
    s = fm(1318, 3.5, 2, .9, .35) * .6 + fm(1976, 3.5, 1.5, .9, .3) * .4
    s[:int(SR * .08)] *= .8
    return s


def cash():
    out = np.zeros(int(SR * 1.2))
    at(out, bp(noise(.08), 1500, 6000) * env(.08, .001, .02), 0, 1.2)
    at(out, fm(2093, 3.0, 2.5, 1.1, .4), .07, .8)
    at(out, fm(2637, 3.0, 2.0, 1.0, .35), .11, .5)
    return out


def check():
    out = np.zeros(int(SR * .6))
    at(out, tone(880, .25, 'tri') * env(.25, .002, .08), 0, .7)
    at(out, tone(1318, .4, 'tri') * env(.4, .002, .15), .08, .8)
    return out


def error():
    out = np.zeros(int(SR * .6))
    for k, f in enumerate([300, 220]):
        at(out, fast_lp(tone(f, .22, 'square'), 6) * env(.22, .002, .12), k * .14, .6)
    return out


def pop():
    return sweep(450, 1500, .09) * env(.09, .001, .03)


def ding():  # notificación
    out = np.zeros(int(SR * .8))
    at(out, fm(1568, 2, 1.2, .6, .25), 0, .6)
    at(out, fm(2093, 2, 1.0, .6, .3), .09, .6)
    return out


def vibrate():
    t = T(.5)
    s = np.sin(2 * np.pi * 160 * t) * (np.sin(2 * np.pi * 20 * t) > 0) * np.minimum(1, t / .01)
    s = np.concatenate([s, np.zeros(int(SR * .08)), s * .9])
    return np.tanh(s * 2) * .7


def stamp():
    out = hit() * .9
    at(out, bp(noise(.12), 800, 4000) * env(.12, .001, .03), 0, .8)
    return out


def flash():  # flash de cámara de fotos
    out = np.zeros(int(SR * 1.0))
    at(out, bp(noise(.04), 2000, 8000) * env(.04, .0005, .01), 0, 1.0)
    at(out, sweep(3000, 9000, .7, 'sine') * env(.7, .3, .2) * .08, .02)
    at(out, hp(noise(.1), 3000) * env(.1, .001, .03), .02, .5)
    return out


def typewriter():
    out = np.zeros(int(SR * .9))
    for k in range(6):
        at(out, bp(noise(.03), 1500, 6000) * env(.03, .0005, .008) * 1.6, k * .09 + rng.uniform(0, .02))
    at(out, fm(2800, 2.1, 1, .5, .2) * .5, .6)
    return out


def door():
    out = np.zeros(int(SR * 1.0))
    at(out, sweep(110, 50, .6) * env(.6, .001, .15), 0, 1)
    at(out, fast_lp(noise(.3), 10) * env(.3, .001, .06), 0, .9)
    at(out, bp(noise(.06), 1000, 3000) * env(.06, .001, .02), .15, .4)
    return np.tanh(out * 1.3)


def heartbeat():
    out = np.zeros(int(SR * .9))
    b = sweep(70, 40, .18) * env(.18, .003, .06)
    at(out, b, 0, 1)
    at(out, b, .24, .65)
    return np.tanh(out * 1.6)


def tape_stop():
    t = T(.7)
    f = 220 * np.exp(-t * 4)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 2)
    return fast_lp(s, 30) * .6


def rewind():
    out = np.zeros(int(SR * 1.0))
    t = T(1.0)
    chirps = np.sin(2 * np.pi * np.cumsum(800 + 600 * np.sin(2 * np.pi * 9 * t)) / SR)
    out += chirps * .25 * np.minimum(1, t / .05) * np.minimum(1, (1 - t) / .05)
    out += bp(noise(1.0), 1000, 5000) * .25
    return out


def glitch():
    out = []
    for k in range(9):
        d = .02 + .025 * (k % 3)
        f = 180 + 1100 * ((k * 37) % 7) / 7
        seg = np.sign(np.sin(2 * np.pi * f * T(d))) * .4 + noise(d) * .4
        out.append(np.round(seg * 3) / 3)
    return np.concatenate(out) * .8


def zap():  # rayo
    d = .7
    s = noise(d) * (rng.uniform(0, 1, int(SR * d)) > .55)
    s = hp(s, 800) * env(d, .001, .18) * 1.2
    out = np.zeros(int(SR * 1.2))
    at(out, s, 0)
    at(out, sweep(120, 40, .8) * env(.8, .001, .3) * .8, .02)
    return np.tanh(out * 1.5)


def crowd():
    d = 1.6
    s = sum(bp(noise(d), rng.uniform(300, 600), rng.uniform(900, 1600)) * (0.6 + .4 * np.sin(2 * np.pi * rng.uniform(1, 4) * T(d))) for _ in range(5))
    return s * np.minimum(1, T(d) / .2) * np.minimum(1, (d - T(d)) / .4) * .8


def laugh():  # risa de público sintética (pulsos de "ja")
    out = np.zeros(int(SR * 1.4))
    for k in range(7):
        t0 = k * .16 + rng.uniform(0, .03)
        d = .12
        f = 240 + 40 * (k % 3) - 10 * k
        v = (tone(f, d, 'saw') * .5 + noise(d) * .2)
        v = bp(v, 500, 2500) * np.sin(np.pi * T(d) / d)
        at(out, v * (1 - k * .08), t0, 1.4)
    return out


def buzzer():
    s = fast_lp(tone(110, .8, 'square') + tone(116, .8, 'square'), 4) * env(.8, .005, 2) * .5
    s[-int(SR * .05):] *= np.linspace(1, 0, int(SR * .05))
    return s


def choir():
    d = 2.5
    t = T(d)
    s = np.zeros(len(t))
    for f in (220, 277.2, 329.6, 440):
        vib = 1 + .006 * np.sin(2 * np.pi * 5 * t)
        s += sweep(f, f, d, 'saw', 'lin') * .2 * vib
    s = bp(s, 300, 1400)
    return reverb(s * np.minimum(1, t / .5) * np.minimum(1, (d - t) / .8), 1.2, .4)


def pluck():
    return karplus(220, 1.4) * .8


def paper():
    d = .35
    s = bp(noise(d), 1000, 7000) * (rng.uniform(0, 1, int(SR * d)) > .3) * np.sin(np.pi * T(d) / d)
    return s * 1.2


def clang():
    s = sum(fm(f, 1.41, 3, 1.5, .5) * g for f, g in [(320, 1), (507, .6), (811, .4)])
    return s * .5


def boing():
    t = T(.6)
    f = 300 + 150 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * .8


def bit_coin():
    out = np.zeros(int(SR * .4))
    at(out, tone(988, .07, 'square') * .3, 0)
    at(out, tone(1319, .28, 'square') * env(.28, .001, .12) * .3, .07)
    return out


def bit_over():
    out = np.zeros(int(SR * 1.3))
    for k, f in enumerate([523, 415, 349, 262]):
        at(out, tone(f, .25, 'square') * env(.25, .002, .2) * .3, k * .22)
    return out


def bit_power():
    s = np.concatenate([tone(f, .045, 'square') for f in [262, 330, 392, 523, 659, 784, 1047]]) * .3
    return s


def bit_select():
    return tone(1760, .06, 'square') * env(.06, .001, .03) * .3


def neon():
    t = T(.9)
    s = (np.sign(np.sin(2 * np.pi * 120 * t)) * .2 + bp(noise(.9), 2000, 6000) * .3 * (rng.uniform(0, 1, len(t)) > .8))
    return s * np.minimum(1, t / .02) * np.exp(-t / .5)


def snip():
    out = np.zeros(int(SR * .4))
    for k in range(2):
        at(out, bp(noise(.04), 3000, 9000) * env(.04, .0005, .01) * 1.5 + tone(4200, .04) * env(.04, .0005, .01) * .3, k * .13)
    return out


def squish():
    d = .4
    t = T(d)
    s = lp(noise(d), 900) * np.sin(2 * np.pi * (6 + 20 * t) * t) * np.sin(np.pi * t / d)
    return s * 3


def wind():
    d = 2.0
    s = bp(noise(d), 200, 900) * (0.5 + 0.5 * np.sin(2 * np.pi * .7 * T(d)))
    return s * np.minimum(1, T(d) / .4) * np.minimum(1, (d - T(d)) / .5) * 1.5


def cricket():
    out = np.zeros(int(SR * 1.2))
    for k in range(3):
        for j in range(4):
            at(out, tone(4400, .018) * env(.018, .001, .006), k * .32 + j * .03, .5)
    return out


def firework():
    out = np.zeros(int(SR * 1.6))
    at(out, sweep(400, 1800, .5, 'sine') * .15 * np.linspace(.2, 1, int(SR * .5)), 0)
    at(out, boom() * .5, .5)
    for k in range(40):
        at(out, bp(noise(.03), 2000, 8000) * env(.03, .001, .01) * .5, .55 + rng.uniform(0, .8))
    return out


def applause():
    d = 2.2
    s = np.zeros(int(SR * d))
    for k in range(260):
        at(s, bp(noise(.02), 800, 5000) * env(.02, .0005, .006), rng.uniform(0, d - .1), rng.uniform(.3, .8))
    return s * np.minimum(1, T(d) / .15) * np.minimum(1, (d - T(d)) / .6)


def drawer():
    out = np.zeros(int(SR * .5))
    at(out, lp(noise(.25), 1200) * np.sin(np.pi * T(.25) / .25) * .9, 0)
    at(out, hit() * .5, .24)
    return out


def pin():  # chinche que se clava
    out = np.zeros(int(SR * .4))
    at(out, bp(noise(.02), 2000, 6000) * env(.02, .0005, .005) * 1.5, 0)
    at(out, sweep(400, 120, .1) * env(.1, .001, .03) * .7, 0)
    return out


def fanfare():
    out = np.zeros(int(SR * 1.8))
    for k, (f, t0, d) in enumerate([(523, 0, .14), (659, .15, .14), (784, .3, .14), (1047, .45, 1.1)]):
        v = sum(tone(f * h, d, 'saw') / h for h in (1, 2, 3))
        at(out, bp(v, 300, 3000) * env(d, .01, d * .8) * .5, t0)
    return out


def sad_horn():
    out = np.zeros(int(SR * 1.6))
    for k, f in enumerate([392, 370, 349, 330]):
        d = .3 if k < 3 else .9
        v = bp(tone(f, d, 'saw') * (1 + .03 * np.sin(2 * np.pi * 6 * T(d))), 200, 1800)
        at(out, v * np.minimum(1, T(d) / .03) * .5, k * .3)
    return out


def rumble():
    d = 2.0
    return fast_lp(noise(d), 120) * 6 * np.minimum(1, T(d) / .3) * np.minimum(1, (d - T(d)) / .6)


def ice():
    out = np.zeros(int(SR * .8))
    for k in range(25):
        at(out, bp(noise(.02), 1500, 7000) * env(.02, .0005, .008), rng.uniform(0, .5) ** 1.3, rng.uniform(.4, 1))
    return out


def chime():
    out = np.zeros(int(SR * 2))
    for k, f in enumerate([1568, 1976, 2349, 3136]):
        at(out, fm(f, 2.76, 1.2, 1.6, .5) * .3, k * .06)
    return out


def tension():  # cuerdas que se tensan (hilos rojos)
    d = 1.4
    t = T(d)
    s = sweep(180, 420, d, 'saw') * .3 + sweep(182, 424, d, 'saw') * .3
    return bp(s, 200, 2500) * np.minimum(1, t / .1) * np.minimum(1, (d - t) / .2)


def thud():
    return np.tanh(sweep(70, 40, .3) * env(.3, .001, .08) * 2) * .9


def splash():
    out = np.zeros(int(SR * .9))
    for k in range(60):
        at(out, bp(noise(.03), 600, 4000) * env(.03, .001, .01), rng.uniform(0, .4) ** 1.5, rng.uniform(.2, .7))
    return out


def pip():  # bip de monitor de hospital
    return tone(1046, .12) * env(.12, .002, .2) * np.minimum(1, (0.12 - T(.12)) / .01) * .7


def flatline():  # piiiiii del monitor
    d = 1.6
    return tone(1046, d) * np.minimum(1, T(d) / .01) * np.minimum(1, (d - T(d)) / .05) * .55


def ghost():  # "uuuuh" burlón del fantasma
    d = 1.1
    t = T(d)
    f = 330 * (1 + .25 * np.sin(2 * np.pi * 1.2 * t)) * (1 - .2 * t / d)
    s = np.sin(2 * np.pi * np.cumsum(f * (1 + .02 * np.sin(2 * np.pi * 6 * t))) / SR)
    s = s + .3 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR)
    return reverb(s * np.minimum(1, t / .15) * np.minimum(1, (d - t) / .3) * .6, .8, .3)


def plaf():  # parche que pega
    out = np.zeros(int(SR * .6))
    at(out, lp(noise(.12), 1500) * env(.12, .001, .04) * 1.5, 0)
    at(out, sweep(180, 60, .3) * env(.3, .001, .08), 0, 1)
    return np.tanh(out * 1.6)


def superhero():  # entrada del celular: subida + brillo
    out = np.zeros(int(SR * 1.6))
    at(out, sweep(300, 2400, .7, 'saw') * np.linspace(.05, .5, int(SR * .7)) * .4, 0)
    at(out, bp(noise(.7), 800, 6000) * np.linspace(.1, 1, int(SR * .7)) * .5, 0)
    at(out, chime(), .65, 1)
    at(out, hit(), .65, .7)
    return out


def huff():  # resoplido
    d = .5
    return bp(noise(d), 300, 1800) * np.sin(np.pi * np.clip(T(d) / d, 0, 1)) ** 2 * 1.4


def doorbell():  # campanita de la puerta
    out = np.zeros(int(SR * 1.4))
    at(out, fm(2637, 3.0, 1.5, 1.2, .5) * .6, 0)
    at(out, fm(2093, 3.0, 1.5, 1.2, .5) * .6, .12)
    return out


def coins():  # lluvia de monedas
    out = np.zeros(int(SR * 1.6))
    for k in range(18):
        at(out, fm(rng.uniform(1800, 3200), 3.5, 2, .4, .12) * .5, rng.uniform(0, 1.0))
    return out


def drip():  # chorrito de plata que se escapa
    out = np.zeros(int(SR * 1.0))
    for k in range(5):
        at(out, sweep(900, 1600, .06) * env(.06, .001, .02) * .6, k * .17)
    return out


def sob():  # llanto de la silla (sollozo corto)
    out = np.zeros(int(SR * 1.2))
    for k in range(3):
        d = .25
        f = 520 - k * 40
        v = np.sin(2 * np.pi * np.cumsum(np.linspace(f, f * .7, int(SR * d))) / SR) * np.sin(np.pi * T(d) / d)
        at(out, v * .5, k * .3)
    return out


PALETA = {k: v for k, v in dict(globals()).items() if callable(v) and v.__module__ == __name__ and k not in (
    'T', 'env', 'sweep', 'tone', 'noise', 'lp', 'hp', 'bp', 'fast_lp', 'pad', 'at', 'reverb', 'karplus', 'fm', 'main')}


def main(outdir):
    os.makedirs(outdir, exist_ok=True)
    for name, fn in PALETA.items():
        s = np.asarray(fn(), dtype=np.float64)
        s = s / (np.max(np.abs(s)) or 1) * 0.89  # pico −1 dBFS
        fo = min(len(s), int(SR * .01))
        s[-fo:] *= np.linspace(1, 0, fo)
        sf.write(os.path.join(outdir, f'{name}.wav'), s.astype(np.float32), SR, subtype='PCM_16')
    print(' '.join(sorted(PALETA)))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'public/sfx')
