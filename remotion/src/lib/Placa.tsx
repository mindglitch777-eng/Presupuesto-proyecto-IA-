import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { cuadroDe, norm, useEsc } from './contexto';
import { FUENTE } from './fuentes';

export type TemaPlaca = { bg: string; borde: string; color: string; acento: string; sombra?: string; trazo?: string };
export const TEMAS: Record<string, TemaPlaca> = {
  oscura: { bg: 'rgba(8,8,14,.88)', borde: '#ffffff', color: '#ffffff', acento: '#FFD60A' },
  roja: { bg: 'rgba(14,4,6,.9)', borde: '#ff2d55', color: '#ffffff', acento: '#ff2d55' },
  verde: { bg: 'rgba(3,18,10,.9)', borde: '#2BFF88', color: '#ffffff', acento: '#2BFF88' },
  clara: { bg: '#ffffff', borde: '#0b0b12', color: '#0b0b12', acento: '#7B2FFF' },
  amarilla: { bg: '#FFD60A', borde: '#0b0b12', color: '#0b0b12', acento: '#E0004D' },
  neon: { bg: 'rgba(10,0,25,.88)', borde: '#00F0FF', color: '#ffffff', acento: '#FF2BD6' },
  papel: { bg: '#FFF8E7', borde: '#1a1a1a', color: '#1a1a1a', acento: '#D7263D' },
};

type Token = { t: string; clave: boolean; linea: number; f: number };

/** Reparte el momento de aparición de cada palabra del texto en pantalla según cuándo la dice la voz. */
export function tokensSincronizados(texto: string, e: ReturnType<typeof useEsc>, desde?: number): Token[] {
  const lineas = texto.split('\n');
  const toks: Token[] = [];
  lineas.forEach((l, li) => {
    // "*MAL CORTE*" marca varias palabras como clave
    let clave = false;
    for (const raw of l.split(/\s+/).filter(Boolean)) {
      const abre = raw.startsWith('*');
      const cierra = raw.endsWith('*') && (raw.length > 1 || !abre);
      if (abre) clave = true;
      toks.push({ t: raw.replace(/\*/g, ''), clave, linea: li, f: -1 });
      if (cierra) clave = false;
    }
  });
  let wi = 0;
  for (const tk of toks) {
    const p = norm(tk.t);
    if (!p) continue;
    for (let j = wi; j < e.words.length; j++) {
      if (e.words[j].n === p || (p.length >= 4 && e.words[j].n.startsWith(p.slice(0, 5)))) { tk.f = e.words[j].f; wi = j + 1; break; }
    }
  }
  // las que no coinciden (números, montos…) se ubican entre sus vecinas
  const base = desde ?? Math.max(0, e.vozDesde - 1);
  for (let i = 0; i < toks.length; i++) {
    if (toks[i].f >= 0) continue;
    const prev = i > 0 ? toks[i - 1].f : base;
    let next = -1;
    for (let j = i + 1; j < toks.length; j++) if (toks[j].f >= 0) { next = toks[j].f; break; }
    toks[i].f = next >= 0 ? Math.round((prev + next) / 2) : prev + 4;
  }
  if (desde !== undefined) toks.forEach((t, i) => { t.f = Math.max(desde + i * 2, t.f); });
  // nunca antes de la anterior
  for (let i = 1; i < toks.length; i++) toks[i].f = Math.max(toks[i].f, toks[i - 1].f);
  return toks;
}

export const Placa: React.FC<{
  texto?: string; y?: number; x?: number; ancho?: number; max?: number; tema?: keyof typeof TEMAS | TemaPlaca;
  rot?: number; desde?: number; hasta?: number; todo?: boolean; style?: React.CSSProperties; pad?: number;
}> = ({ texto, y = 380, x = 490, ancho = 860, max = 130, tema = 'oscura', rot = -2, desde, hasta, todo = false, style, pad = 34 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = useEsc();
  const T = typeof tema === 'string' ? TEMAS[tema] : tema;
  const txt = texto ?? e.onScreen;
  const toks = tokensSincronizados(txt, e, todo ? (desde ?? 0) : desde);
  if (todo) toks.forEach((t, i) => { t.f = (desde ?? 0) + i; });
  const lineas = txt.split('\n').map((l) => l.replace(/\*/g, ''));
  const largo = Math.max(...lineas.map((l) => l.length));
  const size = Math.min(max, ((ancho - pad * 2) * 0.95) / (largo * 0.66));
  const f0 = toks[0]?.f ?? 0;
  const ent = spring({ frame: f - f0, fps, config: { damping: 11, stiffness: 180 } });
  const salida = hasta !== undefined ? interpolate(f, [hasta, hasta + 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  if (f < f0) return null;
  return (
    <div style={{
      position: 'absolute', left: x - ancho / 2, top: y, width: ancho, transform: `translateY(-50%) rotate(${rot}deg) scale(${0.6 + 0.4 * ent})`,
      opacity: Math.min(1, ent * 2) * salida, display: 'flex', justifyContent: 'center', ...style,
    }}>
      <div style={{
        background: T.bg, border: `7px solid ${T.borde}`, borderRadius: 28, padding: `${pad * 0.6}px ${pad}px`,
        boxShadow: `0 18px 0 rgba(0,0,0,.45), 0 0 60px ${T.sombra ?? 'rgba(0,0,0,.4)'}`, textAlign: 'center',
      }}>
        {lineas.map((_, li) => (
          <div key={li} style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: size, lineHeight: 1.04, color: T.color, whiteSpace: 'nowrap', letterSpacing: -1 }}>
            {toks.filter((t) => t.linea === li).map((t, k) => {
              const s = spring({ frame: f - t.f, fps, config: { damping: 9, stiffness: 260 } });
              const vis = f >= t.f;
              const golpe = t.clave ? interpolate(f - t.f, [0, 4, 12], [1.6, 1.22, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
              return (
                <span key={k} style={{
                  display: 'inline-block', marginRight: '0.24em', opacity: vis ? 1 : 0,
                  transform: `translateY(${(1 - s) * 40}px) scale(${(0.5 + 0.5 * s) * golpe})`,
                  color: t.clave ? T.acento : T.color,
                  textShadow: t.clave ? `0 0 ${interpolate(f - t.f, [0, 15], [40, 14], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}px ${T.acento}` : undefined,
                  WebkitTextStroke: T.trazo ? `3px ${T.trazo}` : undefined,
                }}>{t.t}</span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Momento (cuadro) en que aparece la palabra clave principal de la placa: sirve para disparar golpes. */
export const useClave = (texto?: string) => {
  const e = useEsc();
  const toks = tokensSincronizados(texto ?? e.onScreen, e);
  return toks.find((t) => t.clave)?.f ?? cuadroDe(e, '', 0);
};
