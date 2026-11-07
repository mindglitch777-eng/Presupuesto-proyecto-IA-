import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { noise2D, noise3D } from '@remotion/noise';
import { FUENTE, EMOJI } from './fuentes';

export const W = 1080, H = 1920;
export const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const ent = (f: number, a: number, b: number, ease = Easing.out(Easing.cubic)) => interpolate(f, [a, b], [0, 1], { ...cl, easing: ease });
export const pesos = (n: number) => (n < 0 ? '−' : '') + '$' + Math.round(Math.abs(n)).toLocaleString('es-AR');
export const COL = {
  rojo: '#FF2D55', verde: '#2BFF88', amarillo: '#FFD60A', violeta: '#7B2FFF', cian: '#00E5FF', magenta: '#FF2BD6',
  naranja: '#FF7A00', blanco: '#FFFFFF', negro: '#08080E', azul: '#2F6BFF', oro: '#FFC93C',
};

/** Sacudón de cámara: en cada cuadro de `golpes` arranca un temblor que decae. */
export const useShake = (golpes: number[], fuerza = 28, dura = 12) => {
  const f = useCurrentFrame();
  let dx = 0, dy = 0, r = 0;
  for (const g of golpes) {
    const t = f - g;
    if (t < 0 || t > dura) continue;
    const a = fuerza * Math.pow(1 - t / dura, 2);
    dx += noise2D('sx' + g, t * 0.9, 0) * a;
    dy += noise2D('sy' + g, t * 0.9, 1) * a;
    r += noise2D('sr' + g, t * 0.7, 2) * a * 0.04;
  }
  return { dx, dy, r };
};

/** Cámara: zoom, paneo, rotación y sacudones sobre lo que tenga adentro. */
export const Cam: React.FC<{ children: React.ReactNode; golpes?: number[]; fuerza?: number; zoom?: number; x?: number; y?: number; rot?: number; origen?: string; blur?: number }> = ({
  children, golpes = [], fuerza = 28, zoom = 1, x = 0, y = 0, rot = 0, origen = '50% 45%', blur = 0,
}) => {
  const s = useShake(golpes, fuerza);
  return (
    <AbsoluteFill style={{ transform: `translate(${x + s.dx}px, ${y + s.dy}px) rotate(${rot + s.r}deg) scale(${zoom})`, transformOrigin: origen, filter: blur ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{ at: number; color?: string; dura?: number; max?: number }> = ({ at, color = '#fff', dura = 8, max = 0.85 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + dura], [0, max, 0], cl);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: 'screen' }} />;
};

/** Rayo eléctrico entre dos puntos, con titileo y brillo. */
export const Rayo: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; dura?: number; color?: string; grosor?: number; seed?: string; ramas?: boolean }> = ({
  x1, y1, x2, y2, at, dura = 14, color = '#BFF3FF', grosor = 10, seed = 'r', ramas = true,
}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dura) return null;
  const k = Math.floor(t / 2);
  const pts: [number, number][] = [];
  const N = 14;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const jit = i === 0 || i === N ? 0 : (random(seed + k + i) - 0.5) * 120;
    const nx = -(y2 - y1), ny = x2 - x1, L = Math.hypot(nx, ny) || 1;
    pts.push([x1 + (x2 - x1) * u + (nx / L) * jit, y1 + (y2 - y1) * u + (ny / L) * jit]);
  }
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const rama = ramas ? pts.slice(3, 11).filter((_, i) => random(seed + 'b' + k + i) > 0.6).map((p, i) => {
    const a = random(seed + 'a' + i + k) * Math.PI * 2;
    return `M${p[0]},${p[1]} L${p[0] + Math.cos(a) * 90},${p[1] + Math.sin(a) * 90} L${p[0] + Math.cos(a + 0.5) * 160},${p[1] + Math.sin(a + 0.5) * 160}`;
  }).join(' ') : '';
  const o = (t % 3 === 2 ? 0.5 : 1) * interpolate(t, [dura - 4, dura], [1, 0], cl);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: o }}>
      <path d={d + ' ' + rama} stroke={color} strokeWidth={grosor * 3.5} fill="none" opacity={0.35} style={{ filter: 'blur(14px)' }} />
      <path d={d + ' ' + rama} stroke={color} strokeWidth={grosor} fill="none" strokeLinejoin="round" />
      <path d={d} stroke="#fff" strokeWidth={grosor * 0.4} fill="none" />
    </svg>
  );
};

/** Explosión de partículas (o emojis) desde un punto. */
export const Particulas: React.FC<{ at: number; x: number; y: number; n?: number; colores?: string[]; vel?: number; grav?: number; tam?: number; seed?: string; emoji?: string; dura?: number; forma?: 'circulo' | 'rect' | 'estrella' }> = ({
  at, x, y, n = 40, colores = [COL.amarillo, COL.rojo, COL.cian, COL.verde, COL.magenta], vel = 28, grav = 1.1, tam = 22, seed = 'p', emoji, dura = 40, forma = 'rect',
}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dura) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: n }, (_, i) => {
        const a = random(seed + i) * Math.PI * 2;
        const v = vel * (0.4 + random(seed + 'v' + i));
        const px = x + Math.cos(a) * v * t * (1 - t / (dura * 2.2));
        const py = y + Math.sin(a) * v * t * (1 - t / (dura * 2.2)) + grav * t * t * 0.5;
        const o = interpolate(t, [dura * 0.6, dura], [1, 0], cl);
        const s = tam * (0.5 + random(seed + 's' + i));
        const rot = t * 20 * (random(seed + 'r' + i) - 0.5);
        if (emoji) return <div key={i} style={{ position: 'absolute', left: px, top: py, fontSize: s * 2, fontFamily: EMOJI, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg)` }}>{emoji}</div>;
        return <div key={i} style={{
          position: 'absolute', left: px, top: py, width: s, height: forma === 'rect' ? s * 0.6 : s, background: colores[i % colores.length], opacity: o,
          borderRadius: forma === 'circulo' ? '50%' : 3, transform: `translate(-50%,-50%) rotate(${rot}rad)`,
          clipPath: forma === 'estrella' ? 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' : undefined,
        }} />;
      })}
    </AbsoluteFill>
  );
};

/** Lluvia de confeti desde arriba. */
export const Confeti: React.FC<{ at: number; n?: number; colores?: string[]; dura?: number; seed?: string }> = ({ at, n = 90, colores = [COL.amarillo, COL.verde, COL.cian, COL.magenta, COL.violeta, '#fff'], dura = 90, seed = 'c' }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dura) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: n }, (_, i) => {
        const x0 = random(seed + i) * W;
        const vy = 14 + random(seed + 'y' + i) * 16;
        const y = -60 - random(seed + 'd' + i) * 500 + vy * t;
        const x = x0 + Math.sin(t * 0.15 + i) * 40;
        const rot = t * (8 + random(seed + 'r' + i) * 12) + i * 30;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 22, height: 12, background: colores[i % colores.length], transform: `rotate(${rot}deg) rotateX(${rot * 2}deg)`, borderRadius: 2 }} />;
      })}
    </AbsoluteFill>
  );
};

/** Anillo de onda expansiva. */
export const Onda: React.FC<{ at: number; x: number; y: number; color?: string; dura?: number; max?: number }> = ({ at, x, y, color = '#fff', dura = 18, max = 900 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dura) return null;
  const r = interpolate(t, [0, dura], [40, max], { easing: Easing.out(Easing.cubic) });
  return <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `${interpolate(t, [0, dura], [26, 2])}px solid ${color}`, opacity: interpolate(t, [0, dura], [0.9, 0]) }} />;
};

/** Grano de película. */
export const Grano: React.FC<{ o?: number }> = ({ o = 0.18 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: o, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width={W} height={H}>
        <filter id={`g${f % 6}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 6} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={W} height={H} filter={`url(#g${f % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vineta: React.FC<{ o?: number; color?: string }> = ({ o = 0.7, color = '0,0,0' }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(${color},0) 45%, rgba(${color},${o}) 100%)`, pointerEvents: 'none' }} />
);

/** Fondo de manchas de color que se mueven con ruido. */
export const Fondo: React.FC<{ colores: string[]; base?: string; vel?: number; seed?: string; o?: number }> = ({ colores, base = '#0a0a12', vel = 0.006, seed = 'f', o = 0.85 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: base, overflow: 'hidden' }}>
      {colores.map((c, i) => {
        const x = 540 + noise3D(seed, i * 3.1, 0, f * vel) * 650;
        const y = 960 + noise3D(seed, i * 3.1, 9, f * vel) * 1000;
        const r = 520 + noise3D(seed, i, 5, f * vel) * 160;
        return <div key={i} style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${c} 0%, transparent 68%)`, opacity: o }} />;
      })}
    </AbsoluteFill>
  );
};

/** Rayos de luz que giran desde el centro (para revelaciones). */
export const Rayos: React.FC<{ x?: number; y?: number; color?: string; n?: number; o?: number; vel?: number }> = ({ x = 540, y = 900, color = 'rgba(255,255,255,.18)', n = 14, o = 1, vel = 0.4 }) => {
  const f = useCurrentFrame();
  const stops = Array.from({ length: n }, (_, i) => `${color} ${(i * 360) / n}deg ${(i * 360) / n + 360 / n / 2}deg, transparent ${(i * 360) / n + 360 / n / 2}deg ${((i + 1) * 360) / n}deg`).join(',');
  return <div style={{ position: 'absolute', left: x - 1600, top: y - 1600, width: 3200, height: 3200, background: `conic-gradient(from ${f * vel}deg, ${stops})`, opacity: o, borderRadius: '50%', maskImage: 'radial-gradient(circle, black 10%, transparent 60%)' }} />;
};

/** Desfase RGB y cortes horizontales sobre lo que tenga adentro, mientras `activo`. */
export const Glitch: React.FC<{ children: React.ReactNode; activo: boolean; fuerza?: number }> = ({ children, activo, fuerza = 1 }) => {
  const f = useCurrentFrame();
  if (!activo) return <>{children}</>;
  const dx = (random('gx' + f) - 0.5) * 50 * fuerza;
  const cortes = Array.from({ length: 5 }, (_, i) => ({ y: random('gy' + f + i) * H, h: 20 + random('gh' + f + i) * 120, dx: (random('gd' + f + i) - 0.5) * 160 * fuerza }));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${dx}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${dx + 14 * fuerza}px)`, mixBlendMode: 'screen', opacity: 0.6, filter: 'sepia(1) saturate(8) hue-rotate(-50deg)' }}>{children}</AbsoluteFill>
      {cortes.map((c, i) => (
        <AbsoluteFill key={i} style={{ clipPath: `inset(${c.y}px 0 ${H - c.y - c.h}px 0)`, transform: `translateX(${c.dx}px)`, filter: 'hue-rotate(90deg) saturate(3)' }}>{children}</AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

/** Número de plata que corre de `desde` a `hasta`, con color según el signo. */
export const Contador: React.FC<{ desde: number; hasta: number; at: number; dura?: number; x?: number; y?: number; size?: number; color?: string; signo?: boolean; tiembla?: boolean; sub?: string }> = ({
  desde, hasta, at, dura = 24, x = 540, y = 900, size = 190, color, signo = true, tiembla = true, sub,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const u = interpolate(f, [at, at + dura], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const v = desde + (hasta - desde) * u;
  const c = color ?? (hasta < 0 ? COL.rojo : COL.verde);
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 200 } });
  const fin = f - (at + dura);
  const golpe = fin >= 0 ? interpolate(fin, [0, 3, 10], [1, 1.18, 1], cl) : 1;
  const jit = tiembla && fin >= 0 && fin < 14 ? (random('ct' + f) - 0.5) * 16 * (1 - fin / 14) : 0;
  const txt = signo ? (v < 0 ? '−' : hasta > 0 && desde >= 0 ? '+' : '') + '$' + Math.round(Math.abs(v)).toLocaleString('es-AR') : pesos(v);
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translateX(${jit}px) scale(${s * golpe})`, textAlign: 'center' }}>
      <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: size, color: c, letterSpacing: -4, whiteSpace: 'nowrap', WebkitTextStroke: `${Math.max(4, size / 28)}px #000`, paintOrder: 'stroke', textShadow: `0 0 40px ${c}, 0 12px 0 #000` }}>{txt}</div>
      {sub && <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: size * 0.26, color: '#fff', marginTop: -size * 0.05, letterSpacing: 2, WebkitTextStroke: '3px #000', paintOrder: 'stroke' }}>{sub}</div>}
    </div>
  );
};

/** Texto suelto grande con contorno (para carteles dentro de la escena, no la placa principal). */
export const Txt: React.FC<{ children: React.ReactNode; x?: number; y?: number; size?: number; color?: string; rot?: number; at?: number; trazo?: string; style?: React.CSSProperties }> = ({
  children, x = 540, y = 900, size = 80, color = '#fff', rot = 0, at = 0, trazo = '#000', style,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 220 } });
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: FUENTE, fontWeight: 900, fontSize: size, color, whiteSpace: 'nowrap', WebkitTextStroke: `${Math.max(3, size / 16)}px ${trazo}`, paintOrder: 'stroke', textAlign: 'center', lineHeight: 1, ...style }}>{children}</div>;
};

export const Emoji: React.FC<{ e: string; x: number; y: number; size?: number; at?: number; rot?: number; style?: React.CSSProperties }> = ({ e, x, y, size = 120, at = 0, rot = 0, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 200 } });
  return <div style={{ position: 'absolute', left: x, top: y, fontSize: size, fontFamily: EMOJI, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, lineHeight: 1, ...style }}>{e}</div>;
};

/** Persona en silueta (cabeza + cuerpo), para clientes. */
export const Silueta: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, s = 1, color = '#fff', flip, style, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-100%) scale(${flip ? -s : s},${s})`, transformOrigin: '50% 100%', ...style }}>
    <svg width={220} height={420} viewBox="0 0 220 420">
      <circle cx={110} cy={70} r={58} fill={color} />
      <path d="M20 420 L28 220 Q34 140 110 140 Q186 140 192 220 L200 420 Z" fill={color} />
    </svg>
    {children}
  </div>
);
