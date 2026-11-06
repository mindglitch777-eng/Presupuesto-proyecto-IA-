"""Sintetiza los efectos de sonido de un video a partir de la lista de eventos (sin archivos externos)."""
import json, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e


def tone(f0, f1, dur, kind="sine"):
    n = int(SR * dur)
    f = np.linspace(f0, f1, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    if kind == "square":
        return np.sign(np.sin(ph))
    if kind == "tri":
        return 2 / np.pi * np.arcsin(np.sin(ph))
    return np.sin(ph)


def noise(dur):
    return rng.uniform(-1, 1, int(SR * dur))


def lowpass(x, k):
    # promedio móvil simple como filtro
    return np.convolve(x, np.ones(k) / k, mode="same")


def hit():
    n = int(SR * 0.5)
    s = tone(140, 40, 0.5) * env(n, 0.001, 0.12) * 1.0
    s[: int(SR * 0.01)] += noise(0.01) * 0.6
    return s


def boom():
    n = int(SR * 1.2)
    s = tone(90, 28, 1.2) * env(n, 0.002, 0.35)
    s += lowpass(noise(1.2), 40) * env(n, 0.001, 0.15) * 0.8
    return s


def pop():
    n = int(SR * 0.09)
    return tone(500, 1400, 0.09) * env(n, 0.001, 0.03) * 0.7


def tick():
    n = int(SR * 0.03)
    return (tone(2200, 2000, 0.03) * 0.5 + noise(0.03) * 0.3) * env(n, 0.0005, 0.006)


def whoosh():
    dur = 0.4
    n = int(SR * dur)
    x = noise(dur)
    k = np.linspace(60, 6, n).astype(int)
    y = np.array([0.0] * n)
    c = np.cumsum(np.insert(x, 0, 0))
    idx = np.arange(n)
    lo = np.maximum(0, idx - k)
    y = (c[idx + 1] - c[lo]) / (idx + 1 - lo)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return y * e * 3.0


def error():
    a = tone(220, 220, 0.12, "square") * env(int(SR * 0.12), 0.002, 0.08)
    b = tone(160, 160, 0.22, "square") * env(int(SR * 0.22), 0.002, 0.12)
    return np.concatenate([a, b]) * 0.22


def cash():
    dur = 0.9
    n = int(SR * dur)
    s = (tone(2093, 2093, dur) + 0.6 * tone(3136, 3136, dur) + 0.3 * tone(4186, 4186, dur)) * env(n, 0.001, 0.25) * 0.35
    s[: int(SR * 0.05)] += noise(0.05) * env(int(SR * 0.05), 0.001, 0.015) * 0.6
    return s


def check():
    a = tone(880, 880, 0.1, "tri") * env(int(SR * 0.1), 0.002, 0.06)
    b = tone(1320, 1320, 0.25, "tri") * env(int(SR * 0.25), 0.002, 0.12)
    return np.concatenate([a, b]) * 0.5


def rise():
    dur = 0.8
    n = int(SR * dur)
    s = tone(300, 1500, dur, "tri") * np.linspace(0, 1, n) ** 2 * 0.3
    return s


def buzz():
    dur = 0.5
    n = int(SR * dur)
    am = (np.sin(2 * np.pi * 18 * np.arange(n) / SR) > 0).astype(float)
    return tone(160, 160, dur, "square") * am * 0.18 * env(n, 0.01, 0.4)


def door():
    n = int(SR * 0.4)
    return (tone(110, 60, 0.4) * env(n, 0.001, 0.08) + lowpass(noise(0.4), 20) * env(n, 0.001, 0.05)) * 0.9


def glass():
    dur = 0.6
    n = int(SR * dur)
    s = noise(dur) * env(n, 0.001, 0.12) * 0.5
    for f in (3100, 4700, 6200):
        s += tone(f, f * 0.98, dur) * env(n, 0.001, 0.2) * 0.12
    return s


def snip():
    a = noise(0.04) * env(int(SR * 0.04), 0.0005, 0.01)
    gap = np.zeros(int(SR * 0.08))
    return np.concatenate([a, gap, a]) * 0.6


def cricket():
    out = []
    for _ in range(3):
        n = int(SR * 0.05)
        out.append(tone(4500, 4500, 0.05) * env(n, 0.003, 0.02) * 0.25)
        out.append(np.zeros(int(SR * 0.04)))
    out.append(np.zeros(int(SR * 0.3)))
    return np.concatenate(out * 2)


def crowd():
    dur = 1.5
    return lowpass(noise(dur), 30) * np.sin(np.linspace(0, np.pi, int(SR * dur))) * 0.6


SFX = dict(hit=hit, boom=boom, pop=pop, tick=tick, whoosh=whoosh, error=error, cash=cash, check=check,
           rise=rise, buzz=buzz, door=door, glass=glass, snip=snip, cricket=cricket, crowd=crowd)


def main(src, dst):
    d = json.load(open(src))
    total = np.zeros(int(SR * (d["duration"] + 1.5)))
    for ev in d["events"]:
        typ = ev["type"]
        if typ.startswith("ticks"):  # "ticks:8:0.1" = 8 tics cada 0,1 s
            _, n, gap = typ.split(":")
            for k in range(int(n)):
                s = tick()
                i = int(SR * (ev["t"] + k * float(gap)))
                total[i:i + len(s)] += s[: len(total) - i] * ev.get("vol", 1)
            continue
        s = SFX[typ]() * ev.get("vol", 1)
        i = int(SR * ev["t"])
        if i >= len(total):
            continue
        total[i:i + len(s)] += s[: len(total) - i]
    total = total[: int(SR * d["duration"])]
    peak = np.max(np.abs(total)) or 1
    total = np.tanh(total / peak * 1.4) * 0.85  # compresión suave
    pcm = (total * 32767).astype(np.int16)
    st = np.stack([pcm, pcm], axis=1)
    with wave.open(dst, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(st.tobytes())


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
