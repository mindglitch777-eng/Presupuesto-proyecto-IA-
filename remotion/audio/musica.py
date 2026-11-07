"""Música generada por código, un estilo por video, que sigue la estructura del guion:
- antes del giro: modo "pre" (tensión, menor);
- 0,3-0,5 s antes del giro: la música se frena (tape stop) y queda en silencio;
- desde el giro: modo "post" (más brillante, mayor), con otra instrumentación.
Todo sintetizado con numpy: sin samples ni derechos de terceros."""
import numpy as np

SR = 48000
rng = np.random.default_rng(3)
NOTE = lambda n: 440.0 * 2 ** ((n - 69) / 12)
ESCALAS = {'menor': [0, 2, 3, 5, 7, 8, 10], 'mayor': [0, 2, 4, 5, 7, 9, 11], 'dorica': [0, 2, 3, 5, 7, 9, 10]}


def T(n):
    return np.arange(n) / SR


def env(n, a, r):
    t = T(n)
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)


def osc(f, n, kind='sine', f0=None, glide=.02, ph=0.0):
    t = T(n)
    fr = np.full(n, float(f)) if f0 is None else f + (f0 - f) * np.exp(-t / glide)
    p = 2 * np.pi * np.cumsum(fr) / SR + ph
    if kind == 'square':
        return np.sign(np.sin(p))
    if kind == 'saw':
        return 2 * ((p / (2 * np.pi)) % 1) - 1
    if kind == 'tri':
        return 2 / np.pi * np.arcsin(np.sin(p))
    return np.sin(p)


def smooth(x, k):
    k = max(1, int(k))
    return np.convolve(x, np.ones(k) / k, mode='same')


def hpf(x, k=8):
    return x - smooth(x, k)


def noise(n):
    return rng.uniform(-1, 1, n)


def karplus(f, n, damp=.995):
    p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p)
    reps = n // p + 2
    out = np.empty(reps * p)
    for r in range(reps):  # vectorizado por período
        out[r * p:(r + 1) * p] = buf
        buf = damp * .5 * (buf + np.roll(buf, -1))
    return out[:n]


def fm(f, n, ratio, idx, r):
    t = T(n)
    e = np.exp(-t / r)
    return np.sin(2 * np.pi * f * t + idx * e * np.sin(2 * np.pi * f * ratio * t)) * e


# ---------- instrumentos (devuelven una nota de n muestras) ----------

def kick808(n, f=50):
    return np.tanh(2.0 * osc(f, n, f0=f * 3, glide=.02)) * env(n, .002, .4)


def kick(n):
    return np.tanh(1.8 * osc(55, n, f0=160, glide=.015)) * env(n, .001, .12)


def snare(n):
    return (hpf(noise(n), 4) * .8 + osc(190, n) * .4) * env(n, .001, .07)


def brush(n):
    return hpf(noise(n), 3) * env(n, .01, .09) * .5


def clap(n):
    s = hpf(noise(n), 4) * env(n, .001, .05)
    for k in (.011, .022):
        i = int(SR * k)
        s[i:] += hpf(noise(n - i), 4) * env(n - i, .001, .05) * .7
    return s


def hat(n):
    return hpf(noise(n), 2) * env(n, .0005, .012)


def ohat(n):
    return hpf(noise(n), 2) * env(n, .001, .08)


def rim(n):
    return (osc(1700, n) * .5 + hpf(noise(n), 2) * .5) * env(n, .0005, .012)


def tom(n, f=90):
    return osc(f, n, f0=f * 1.6, glide=.03) * env(n, .002, .25)


def chipnoise(n):
    return np.sign(noise(n)) * env(n, .001, .05) * .5


def bass(kind, f, n):
    if kind == '808':
        return np.tanh(2.5 * osc(f, n, f0=f * 1.5, glide=.03)) * env(n, .003, .5)
    if kind == 'walk':
        return (osc(f, n) + .3 * osc(2 * f, n)) * env(n, .005, .25)
    if kind == 'pizz':
        return karplus(f, n, .99) * 1.2
    if kind == 'square':
        return smooth(osc(f, n, 'square'), 3) * env(n, .002, .3) * .6
    if kind == 'pulse':
        return smooth(osc(f, n, 'saw') + osc(f * 1.005, n, 'saw'), 12) * env(n, .003, .15) * .7
    if kind == 'sub':
        return osc(f, n) * env(n, .01, .6)
    return osc(f, n) * env(n, .005, .3)


def lead(kind, f, n):
    if kind == 'square':
        return smooth(osc(f, n, 'square'), 2) * env(n, .002, .25) * .35
    if kind == 'saw':
        return smooth(osc(f, n, 'saw') + osc(f * 1.01, n, 'saw'), 3) * env(n, .003, .18) * .3
    if kind == 'bell':
        return fm(f, n, 3.5, 2.2, .35) * .5
    if kind == 'marimba':
        return fm(f, n, 4.0, 1.4, .12) * .7
    if kind == 'organ':
        return sum(osc(f * h, n) / h for h in (1, 2, 3, 4)) * np.minimum(1, T(n) / .01) * np.exp(-T(n) / .5) * .35
    if kind == 'pizz':
        return karplus(f, n, .985) * .7
    if kind == 'pluck':
        return karplus(f, n, .996) * .7
    if kind == 'brass':
        s = sum(osc(f * h, n, 'saw') / h for h in (1, 2))
        return smooth(s, 4) * np.minimum(1, T(n) / .03) * np.exp(-T(n) / .4) * .3
    if kind == 'sax':
        t = T(n)
        s = smooth(osc(f, n, 'square') * (1 + .02 * np.sin(2 * np.pi * 5 * t)), 10)
        return s * np.minimum(1, t / .05) * np.exp(-t / .5) * .35
    if kind == 'cowbell':
        s = np.sign(np.sin(2 * np.pi * f * T(n))) + np.sign(np.sin(2 * np.pi * f * 1.48 * T(n)))
        return smooth(hpf(s, 30), 5) * env(n, .001, .09) * .4
    if kind == 'piano':
        return (fm(f, n, 1.0, .8, .6) + .3 * fm(2 * f, n, 1, .3, .3)) * .5
    return osc(f, n) * env(n, .005, .3) * .4


def pad(kind, freqs, n):
    t = T(n)
    if kind == 'drone':
        s = sum(osc(f / 2, n) for f in freqs[:1]) + .3 * osc(freqs[0], n)
    elif kind == 'choir':
        s = sum(smooth(osc(f, n, 'saw') * (1 + .006 * np.sin(2 * np.pi * 5 * t)), 25) for f in freqs)
    elif kind == 'strings':
        s = sum(smooth(osc(f, n, 'saw') + osc(f * 1.004, n, 'saw'), 30) for f in freqs)
    else:
        s = sum(smooth(osc(f, n, 'saw'), 40) for f in freqs)
    return s * np.minimum(1, t / .25) * np.minimum(1, (n / SR - t) / .25) * .12


# ---------- estilos ----------
# drums: 16 pasos por compás. "x" = golpe fuerte, "o" = suave, "." = nada.
P = lambda s: [{'x': 1.0, 'o': .5, '.': 0}[c] for c in s.replace(' ', '')]

ESTILOS = {
    # campaña Silla Llena: tensión con pulso de monitor; en el giro, drop con todo
    'drop': dict(bpm=128, root=50,
                 pre=dict(escala='menor', prog=[0, 0, 5, 3], bajo='808', bajo_pat=P('x.......x..x....'),
                          kick=P('x.......x.......'), clap=P('....x.......x...'), hat=P('x.x.x.x.x.x.x.xx'),
                          lead='pluck', lead_pat=P('x..x..x...x..x..'), mel=[0, 3, 4, 3, 7, 4], pad='strings'),
                 post=dict(escala='mayor', prog=[0, 4, 5, 3], bajo='808', bajo_pat=P('x..x..x.x..x..x.'),
                           kick=P('x...x...x...x...'), clap=P('....x.......x...'), hat=P('xxxxxxxxxxxxxxxx'), ohat=P('..x...x...x...x.'),
                           lead='saw', lead_pat=P('x.xx.x.xx.x.xx.x'), mel=[7, 9, 11, 9, 14, 11, 9, 7], pad='saw')),
    'noir': dict(bpm=90, root=50, swing=.18,
                 pre=dict(escala='menor', prog=[0, 3, 5, 4], bajo='walk', bajo_pat=P('x...x...x...x...'),
                          kick=P('x.........x.....'), snare=None, brush=P('....x.......x...'), hat=P('x..ox..ox..ox..o'),
                          lead='sax', lead_pat=P('x.....o...x.....'), mel=[4, 6, 7, 6, 4, 2], pad='drone'),
                 post=dict(escala='mayor', prog=[0, 5, 3, 4], bajo='808', bajo_pat=P('x......x..x.....'),
                           kick=P('x......x..x.....'), clap=P('........x.......'), hat=P('xoxoxoxoxxxoxoxo'),
                           lead='bell', lead_pat=P('x..x..x...x..x..'), mel=[7, 9, 11, 9, 7, 4], pad='strings')),
    'hyperpop': dict(bpm=150, root=49,
                     pre=dict(escala='menor', prog=[0, 5, 3, 6], bajo='808', bajo_pat=P('x..x..x...x..x..'),
                              kick=P('x...x...x...x...'), clap=P('....x.......x...'), hat=P('xxxxxxxxxxxxxxxx'),
                              lead='saw', lead_pat=P('xxxxxxxxxxxxxxxx'), mel=[0, 2, 4, 7, 4, 2, 7, 9], pad='saw'),
                     post=dict(escala='mayor', prog=[0, 4, 5, 3], bajo='sub', bajo_pat=P('x.......x.......'),
                               kick=P('x.........x.....'), snare=P('........x.......'), hat=P('o.o.o.o.o.o.o.o.'),
                               lead='bell', lead_pat=P('x...x...x.x.....'), mel=[4, 7, 9, 7, 11, 9], pad='saw')),
    'suspenso': dict(bpm=100, root=48,
                     pre=dict(escala='menor', prog=[0, 0, 5, 4], bajo='pizz', bajo_pat=P('x.x.x.x.x.x.x.x.'),
                              tom=P('x.......x.......'), rim=P('..o...o...o...o.'),
                              lead='pizz', lead_pat=P('x.x...x.x.x.....'), mel=[7, 6, 4, 3, 4, 2], pad='strings'),
                     post=dict(escala='mayor', prog=[0, 3, 4, 0], bajo='pizz', bajo_pat=P('x...x...x...x...'),
                               kick=P('x.......x.......'), clap=P('....x.......x...'), hat=P('..x...x...x...x.'),
                               lead='pizz', lead_pat=P('x.xx..x.x.xx....'), mel=[0, 2, 4, 7, 4, 2], pad='strings')),
    'chiptune': dict(bpm=132, root=52,
                     pre=dict(escala='menor', prog=[0, 5, 3, 4], bajo='square', bajo_pat=P('x.x.x.x.x.x.x.x.'),
                              kick=P('x.......x.......'), chip=P('....x.......x...'), hat=None,
                              lead='square', lead_pat=P('x.xxx.x.x.xxx.x.'), mel=[0, 2, 4, 2, 7, 4, 2, 0], pad=None),
                     post=dict(escala='mayor', prog=[0, 3, 4, 4], bajo='square', bajo_pat=P('xxxxxxxxxxxxxxxx'),
                               kick=P('x...x...x...x...'), chip=P('....x.......x...'),
                               lead='square', lead_pat=P('xxxxxxxxxxxxxxxx'), mel=[7, 9, 11, 14, 11, 9], pad=None)),
    'concurso': dict(bpm=120, root=55,
                     pre=dict(escala='dorica', prog=[0, 3, 0, 4], bajo='walk', bajo_pat=P('x...x...x...x...'),
                              kick=P('x.......x.......'), snare=P('....x.......x...'), hat=P('x.x.x.x.x.x.x.x.'),
                              lead='brass', lead_pat=P('x..x..x.....x...'), mel=[4, 4, 6, 7, 6, 4], pad=None),
                     post=dict(escala='mayor', prog=[0, 4, 5, 3], bajo='walk', bajo_pat=P('x.x.x.x.x.x.x.x.'),
                               kick=P('x...x...x...x...'), snare=P('....x.......x...'), clap=P('....x.......x...'), hat=P('xxxxxxxxxxxxxxxx'),
                               lead='brass', lead_pat=P('x.x.x...x.x.x...'), mel=[7, 9, 11, 14, 11, 9], pad='strings')),
    'thriller': dict(bpm=95, root=45,
                     pre=dict(escala='menor', prog=[0, 0, 5, 6], bajo='pulse', bajo_pat=P('xxxxxxxxxxxxxxxx'),
                              kick=P('x.......x.......'), rim=P('....o.......o...'), hat=None,
                              lead='bell', lead_pat=P('x...............'), mel=[7, 8, 7, 3], pad='strings'),
                     post=dict(escala='mayor', prog=[0, 5, 3, 4], bajo='sub', bajo_pat=P('x.......x.......'),
                               kick=P('x.......x.......'), rim=P('....x.......x...'), hat=P('..o...o...o...o.'),
                               lead='pluck', lead_pat=P('x.xx.x.xx.x.x.x.'), mel=[0, 2, 4, 7, 9, 7, 4, 2], pad='strings')),
    'feria': dict(bpm=124, root=53,
                  pre=dict(escala='menor', prog=[0, 3, 4, 0], bajo='pulse', bajo_pat=P('..x...x...x...x.'),
                           kick=P('x...x...x...x...'), clap=P('....x.......x...'), ohat=P('..x...x...x...x.'),
                           lead='organ', lead_pat=P('x.xx.x.x.xx.x...'), mel=[0, 4, 2, 4, 7, 4, 2, 0], pad=None),
                  post=dict(escala='mayor', prog=[0, 4, 5, 3], bajo='pulse', bajo_pat=P('..x...x...x...x.'),
                            kick=P('x...x...x...x...'), clap=P('....x.......x...'), ohat=P('..x...x...x...x.'), hat=P('x.x.x.x.x.x.x.x.'),
                            lead='organ', lead_pat=P('x.xxx.x.x.xxx.x.'), mel=[7, 9, 11, 9, 7, 4, 7, 9], pad='saw')),
    'industrial': dict(bpm=140, root=46,
                       pre=dict(escala='menor', prog=[0, 0, 5, 6], bajo='808', bajo_pat=P('x......x..x...x.'),
                                kick=P('x......x..x.....'), clap=P('........x.......'), hat=P('x.x.x.x.xxx.x.x.'),
                                lead='cowbell', lead_pat=P('x..x..x...x..x..'), mel=[7, 10, 8, 7, 5, 7], pad='drone'),
                       post=dict(escala='mayor', prog=[0, 5, 3, 4], bajo='808', bajo_pat=P('x......x..x.....'),
                                 kick=P('x......x..x.....'), clap=P('........x.......'), hat=P('xxxxxxxxxxxxxxxx'),
                                 lead='cowbell', lead_pat=P('x..x..x...x..x..'), mel=[7, 9, 11, 9, 7, 4], pad='strings')),
    'comedia': dict(bpm=112, root=55,
                    pre=dict(escala='menor', prog=[0, 3, 4, 4], bajo='pizz', bajo_pat=P('x...x...x...x...'),
                             kick=P('x.......x.......'), rim=P('....x.......x...'), hat=None,
                             lead='marimba', lead_pat=P('x.xxx.x.x.xxx.x.'), mel=[0, 2, 3, 2, 4, 3, 2, 0], pad=None),
                    post=dict(escala='mayor', prog=[0, 5, 3, 4], bajo='walk', bajo_pat=P('x..x..x...x..x..'),
                              kick=P('x.......x.......'), snare=P('....x.......x...'), hat=P('x.x.x.x.x.x.x.x.'),
                              lead='marimba', lead_pat=P('x...x.x...x.x...'), mel=[4, 7, 9, 7, 4, 2], pad='saw')),
    'epico': dict(bpm=140, root=48,
                  pre=dict(escala='menor', prog=[0, 5, 3, 6], bajo='808', bajo_pat=P('x.........x.....'),
                           kick=P('x.........x.....'), clap=P('........x.......'), hat=P('x.x.x.x.x.xxx.x.'),
                           lead='brass', lead_pat=P('x.......x.......'), mel=[0, 3, 4, 3], pad='choir'),
                  post=dict(escala='mayor', prog=[0, 4, 5, 3], bajo='808', bajo_pat=P('x.........x.....'),
                            kick=P('x.........x.....'), clap=P('........x.......'), hat=P('xxxxxxxxxxxxxxxx'),
                            lead='piano', lead_pat=P('x...x...x...x...'), mel=[4, 7, 9, 11, 9, 7], pad='choir')),
}


def nota(root, escala, grado, octava=0):
    esc = ESCALAS[escala]
    o, g = divmod(grado, 7)
    return root + 12 * (o + octava) + esc[g]


def render(estilo, duracion, giro=None, silencio=None):
    """giro: segundo en que cambia de 'pre' a 'post'. silencio: (t0, t1) sin música."""
    E = ESTILOS[estilo]
    n_total = int(SR * (duracion + 3))
    out = np.zeros(n_total)
    st = 60 / E['bpm'] / 4
    bar = st * 16
    swing = E.get('swing', 0)

    def add(sig, t, g):
        i = int(SR * t)
        if 0 <= i < n_total and g:
            m = min(len(sig), n_total - i)
            out[i:i + m] += sig[:m] * g

    t0, b = 0.0, 0
    while t0 < duracion + bar:
        modo = 'post' if giro is not None and t0 + bar / 2 >= giro else 'pre'
        S = E[modo]
        acorde = S['prog'][b % len(S['prog'])]
        for k in range(16):
            t = t0 + k * st + (swing * st if k % 2 else 0)
            # batería
            for nombre, fn, g, dur in [('kick', kick, .9, .3), ('snare', snare, .55, .2), ('clap', clap, .5, .25),
                                       ('hat', hat, .18, .05), ('ohat', ohat, .15, .15), ('rim', rim, .25, .05),
                                       ('brush', brush, .45, .15), ('tom', tom, .6, .4), ('chip', chipnoise, .4, .1)]:
                pat = S.get(nombre)
                if pat and pat[k]:
                    if nombre == 'kick' and S.get('bajo') == '808':
                        add(kick808(int(SR * .35), NOTE(nota(E['root'], S['escala'], acorde, -2))), t, .8 * pat[k])
                    else:
                        add(fn(int(SR * dur)), t, g * pat[k])
            # bajo
            bp = S.get('bajo_pat')
            if bp and bp[k]:
                f = NOTE(nota(E['root'], S['escala'], acorde, -1 if S['bajo'] != '808' else -2))
                if S['bajo'] == 'walk':
                    f = NOTE(nota(E['root'], S['escala'], acorde + [0, 2, 4, 5][(k // 4) % 4], -1))
                add(bass(S['bajo'], f, int(SR * min(.6, st * 4))), t, .55 * bp[k])
            # melodía
            lp_ = S.get('lead_pat')
            if lp_ and lp_[k]:
                idx = (b * 5 + k) % len(S['mel'])
                f = NOTE(nota(E['root'], S['escala'], acorde + S['mel'][idx], 1))
                add(lead(S['lead'], f, int(SR * min(.5, st * 3))), t, .5 * lp_[k])
        if S.get('pad'):
            fr = [NOTE(nota(E['root'], S['escala'], acorde + d)) for d in (0, 2, 4)]
            add(pad(S['pad'], fr, int(SR * bar)), t0, 1.0)
        t0 += bar
        b += 1

    out = out[:int(SR * duracion)]
    out = np.tanh(out * 1.2)
    if silencio:
        a, z = int(SR * silencio[0]), int(SR * silencio[1])
        # tape stop en los 0,35 s antes del silencio: la música baja de tono y se frena
        ts = int(SR * .35)
        s0 = max(0, a - ts)
        seg = out[s0:a].copy()
        if len(seg):
            pos = np.cumsum(np.linspace(1, 0.05, len(seg)))
            pos = np.clip(pos, 0, len(seg) - 1)
            out[s0:a] = np.interp(pos, np.arange(len(seg)), seg) * np.linspace(1, 0, len(seg))
        out[a:z] = 0
        f = int(SR * .02)
        out[z:z + f] *= np.linspace(0, 1, len(out[z:z + f]))
    fi = int(SR * .01)
    out[:fi] *= np.linspace(0, 1, fi)
    return out / (np.max(np.abs(out)) or 1)
