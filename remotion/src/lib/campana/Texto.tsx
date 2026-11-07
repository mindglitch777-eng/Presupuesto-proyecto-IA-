// Texto gigante de la campaña: redondo, contorno negro grueso, palabra clave en caja amarilla.
// Aparece COMPLETO de golpe (no palabra por palabra): una idea por pantalla.
import React from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { useEsc } from '../contexto';
import { C, FUENTE_C } from './estilo';

const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Si una palabra es un monto ("−$120.000"), corre desde 0 hasta el valor. */
const montoCorriendo = (t: string, u: number) => {
  const m = t.match(/^([−-]?)\$([\d.]+)(.*)$/);
  if (!m) return t;
  const n = Number(m[2].replace(/\./g, ''));
  return `${m[1]}$${Math.round(n * u).toLocaleString('es-AR')}${m[3]}`;
};

export const TextoGrande: React.FC<{
  texto?: string; y?: number; at?: number; hasta?: number; max?: number; ancho?: number; color?: string; caja?: string; rot?: number;
  corre?: number; x?: number; entrada?: 'golpe' | 'cae' | 'zoom';
}> = ({ texto, y = 520, at = 0, hasta, max = 200, ancho = 900, color = '#fff', caja = C.amarillo, rot = -3, corre = 18, x = 500, entrada = 'golpe' }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = useEsc();
  const txt = texto ?? e.onScreen;
  if (f < at) return null;
  const lineas = txt.split('\n');
  const limpio = lineas.map((l) => l.replace(/\*/g, ''));
  const largo = Math.max(...limpio.map((l) => l.length));
  const size = Math.min(max, (ancho * 0.96) / (largo * 0.57));
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 230, mass: 0.8 } });
  const escala = entrada === 'zoom' ? interpolate(s, [0, 1], [3, 1]) : entrada === 'cae' ? 1 : interpolate(s, [0, 1], [1.5, 1]);
  const dy = entrada === 'cae' ? interpolate(s, [0, 1], [-700, 0]) : 0;
  const sale = hasta !== undefined ? interpolate(f, [hasta, hasta + 5], [1, 0], cl) : 1;
  const u = interpolate(f - at, [0, corre], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const vibra = f - at < 10 ? (random('tv' + f) - 0.5) * 10 * (1 - (f - at) / 10) : 0;
  return (
    <div style={{ position: 'absolute', left: x - ancho / 2, width: ancho, top: y, transform: `translate(${vibra}px, calc(-50% + ${dy}px)) rotate(${rot}deg) scale(${escala * sale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.06, opacity: Math.min(1, s * 3) * sale }}>
      {lineas.map((l, i) => {
        const partes = l.split(/(\*[^*]+\*)/).filter(Boolean);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: size * 0.2, whiteSpace: 'nowrap' }}>
            {partes.map((p, k) => {
              const clave = p.startsWith('*');
              const t = montoCorriendo(p.replace(/\*/g, '').trim(), u);
              if (!t) return null;
              const st: React.CSSProperties = { fontFamily: FUENTE_C, fontSize: size, lineHeight: 1.02, color: clave ? '#111' : color, WebkitTextStroke: clave ? undefined : `${Math.max(10, size * 0.085)}px #111`, paintOrder: 'stroke', textShadow: clave ? undefined : `0 ${size * 0.06}px 0 #111`, letterSpacing: 1 };
              return clave
                ? <span key={k} style={{ ...st, background: caja, border: '9px solid #111', borderRadius: size * 0.16, padding: `0 ${size * 0.14}px`, boxShadow: `0 ${size * 0.06}px 0 #111`, transform: `rotate(${i % 2 ? 2 : -1}deg)` }}>{t}</span>
                : <span key={k} style={st}>{t}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Cartelito tipo sticker (rótulos, etiquetas de función). */
export const Rotulo: React.FC<{ children: React.ReactNode; x: number; y: number; at?: number; bg?: string; color?: string; size?: number; rot?: number }> = ({ children, x, y, at = 0, bg = C.amarillo, color = '#111', size = 64, rot = -4 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 260 } });
  return <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, background: bg, color, border: '8px solid #111', borderRadius: 22, padding: `${size * 0.08}px ${size * 0.35}px`, fontFamily: FUENTE_C, fontSize: size, whiteSpace: 'nowrap', boxShadow: '0 10px 0 #111' }}>{children}</div>;
};

/** Fondo de un solo color saturado con rayos suaves y puntitos de trama (estilo historieta). */
export const FondoColor: React.FC<{ color: string; late?: boolean; rayos?: boolean }> = ({ color, late, rayos = true }) => {
  const f = useCurrentFrame();
  const pulso = late ? 1 + Math.max(0, Math.sin(f / 4.5)) * 0.18 : 1;
  return (
    <AbsoluteFill style={{ background: color, filter: `brightness(${pulso})` }}>
      {rayos && <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.3}deg at 50% 45%, rgba(255,255,255,.13) 0deg 9deg, rgba(255,255,255,0) 9deg 18deg)` }} />}
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,.13) 3px, transparent 3.5px)', backgroundSize: '34px 34px', maskImage: 'linear-gradient(transparent 55%, #000)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(255,255,255,.18), transparent 65%)' }} />
    </AbsoluteFill>
  );
};

/** Billetes que vuelan por la pantalla (de un punto a otro), para que la plata se vea física. */
export const LluviaBilletes: React.FC<{ at: number; n?: number; desde?: [number, number]; hacia?: [number, number]; dura?: number; seed?: string; children?: (i: number, x: number, y: number, rot: number, o: number) => React.ReactNode }> = ({ at, n = 10, desde = [540, 900], hacia = [1200, 300], dura = 30, seed = 'lb', children }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const t = (f - at - i * 2) / dura;
        if (t < 0 || t > 1) return null;
        const x = desde[0] + (hacia[0] - desde[0]) * t + Math.sin(t * 6 + i) * 60;
        const y = desde[1] + (hacia[1] - desde[1]) * t - Math.sin(t * Math.PI) * (100 + random(seed + i) * 200);
        return <React.Fragment key={i}>{children?.(i, x, y, t * 500 * (random(seed + 'r' + i) - 0.5), 1 - t * 0.3)}</React.Fragment>;
      })}
    </>
  );
};
