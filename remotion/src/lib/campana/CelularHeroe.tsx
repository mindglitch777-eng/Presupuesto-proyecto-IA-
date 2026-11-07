// El Celular de Silla Llena: entra siempre como superhéroe (capa, brillo, líneas de velocidad).
// Las pantallas son simples y grandes: una acción por plano, que se lea en el celular del que mira.
import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, random } from 'remotion';
import { C, FUENTE_C, FUENTE_R } from './estilo';

const K = C.negro;
export const PW = 470, PH = 980;

export const CelularHeroe: React.FC<{ x?: number; y?: number; s?: number; rot?: number; capa?: boolean; brillo?: boolean; children?: React.ReactNode; ojos?: boolean }> = ({ x = 540, y = 900, s = 1, rot = 0, capa = true, brillo = true, children, ojos }) => {
  const f = useCurrentFrame();
  const ola = Math.sin(f / 3) * 30;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})` }}>
      {brillo && <div style={{ position: 'absolute', left: -260, top: -160, width: 1000, height: 1340, background: `radial-gradient(circle, rgba(255,255,255,.55), rgba(255,214,10,.25) 35%, transparent 65%)`, transform: `scale(${1 + Math.sin(f / 4) * 0.05})` }} />}
      {capa && (
        <svg width={700} height={900} viewBox="0 0 700 900" style={{ position: 'absolute', left: -120, top: 120, overflow: 'visible' }}>
          <path d={`M140 40 Q350 0 560 40 L${640 + ola} 820 Q350 ${760 - ola} ${60 - ola} 820 Z`} fill={C.rojo} stroke={K} strokeWidth={14} strokeLinejoin="round" />
        </svg>
      )}
      <div style={{ position: 'relative', width: PW + 40, height: PH + 40, borderRadius: 74, background: K, padding: 20, boxShadow: `0 24px 0 rgba(0,0,0,.35)`, border: `6px solid ${K}` }}>
        <div style={{ width: PW, height: PH, borderRadius: 56, overflow: 'hidden', background: '#F5F2FF', position: 'relative' }}>
          {children}
          <div style={{ position: 'absolute', top: 14, left: PW / 2 - 60, width: 120, height: 34, borderRadius: 20, background: K }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${115 + Math.sin(f / 15) * 10}deg, transparent 35%, rgba(255,255,255,.35) 47%, transparent 58%)` }} />
        </div>
        {ojos && <div style={{ position: 'absolute', top: -70, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 60 }}>{[0, 1].map((k) => <div key={k} style={{ width: 70, height: 70, borderRadius: '50%', background: '#fff', border: `8px solid ${K}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 26, height: 26, borderRadius: '50%', background: K }} /></div>)}</div>}
      </div>
    </div>
  );
};

/** Líneas de velocidad (entrada de superhéroe). */
export const LineasVelocidad: React.FC<{ o?: number; color?: string }> = ({ o = 1, color = '#fff' }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: o }}>
      {Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2 + random('lv' + i);
        const r1 = 500 + ((f * 40 + i * 70) % 500), r2 = r1 + 260;
        return <line key={i} x1={540 + Math.cos(a) * r1} y1={900 + Math.sin(a) * r1} x2={540 + Math.cos(a) * r2} y2={900 + Math.sin(a) * r2} stroke={color} strokeWidth={10} strokeLinecap="round" opacity={0.7} />;
      })}
    </svg>
  );
};

const Barra: React.FC<{ titulo: string; color?: string }> = ({ titulo, color = C.violeta }) => (
  <div style={{ background: color, color: '#fff', padding: '70px 26px 22px', fontFamily: FUENTE_C, fontSize: 40, display: 'flex', alignItems: 'center', gap: 12, borderBottom: `6px solid ${K}` }}>💈 {titulo}</div>
);

const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 240 } });
  return <div style={{ transform: `scale(${s})`, ...style }}>{children}</div>;
};

const tarjeta: React.CSSProperties = { background: '#fff', border: `6px solid ${K}`, borderRadius: 26, margin: '18px 22px', padding: '20px 24px', fontFamily: FUENTE_R, fontWeight: 700, color: K, boxShadow: `0 8px 0 ${K}` };

/** Dedo que toca la pantalla en (x, y) en el cuadro `at`. */
export const Dedo: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -10 || t > 18) return null;
  const llega = interpolate(t, [-10, 0], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <>
      <div style={{ position: 'absolute', left: x - 10, top: y - 10 + (1 - llega) * 220, fontSize: 130, transform: 'rotate(-20deg)', opacity: t > 12 ? 0 : 1 }}>👆</div>
      {t >= 0 && <div style={{ position: 'absolute', left: x - 20 - t * 4, top: y - 20 - t * 4, width: 40 + t * 8, height: 40 + t * 8, borderRadius: '50%', border: `6px solid ${C.violeta}`, opacity: 1 - t / 18 }} />}
    </>
  );
};

/** Seña: turno reservado, seña pagada. */
export const PantallaSena: React.FC<{ toque?: number; ok?: number; monto: string }> = ({ toque = 8, ok = 16, monto }) => (
  <div style={{ width: PW, height: PH }}>
    <Barra titulo="Reservá tu turno" />
    <div style={{ ...tarjeta, fontSize: 40 }}>Sábado <b style={{ color: C.violeta }}>10:00</b></div>
    <div style={{ ...tarjeta, background: C.amarillo, fontSize: 36 }}>Seña<div style={{ fontFamily: FUENTE_C, fontSize: 92 }}>{monto}</div>por alias</div>
    <Pop at={ok} style={{ ...tarjeta, background: C.verde, fontSize: 46, textAlign: 'center', fontFamily: FUENTE_C }}>✓ SEÑA PAGADA</Pop>
    <Dedo x={PW - 150} y={560} at={toque} />
  </div>
);

/** Fila con QR: se anotan con el celu y vuelven cuando les toca. */
export const PantallaQR: React.FC<{ ok?: number }> = ({ ok = 14 }) => (
  <div style={{ width: PW, height: PH }}>
    <Barra titulo="Fila virtual" />
    <div style={{ margin: '24px auto', width: 230, height: 230, padding: 14, background: '#fff', border: `8px solid ${K}`, borderRadius: 20, display: 'grid', gridTemplateColumns: 'repeat(11,1fr)' }}>
      {Array.from({ length: 121 }, (_, i) => { const x = i % 11, y = Math.floor(i / 11); const esq = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7); return <div key={i} style={{ background: esq || random('qr' + i) > 0.5 ? K : '#fff' }} />; })}
    </div>
    <Pop at={ok} style={{ ...tarjeta, background: C.verde, textAlign: 'center' }}><div style={{ fontSize: 34 }}>Te anotaste. Vas</div><div style={{ fontFamily: FUENTE_C, fontSize: 110, lineHeight: 1 }}>2º</div><div style={{ fontSize: 30 }}>te avisamos cuando te toca</div></Pop>
  </div>
);

/** Lista de los que dejaron de venir, con botón de WhatsApp. */
export const PantallaLista: React.FC<{ toque?: number; filas?: { n: string; d: number }[] }> = ({ toque = 12, filas = [{ n: 'Juan', d: 45 }, { n: 'Lucas', d: 38 }, { n: 'Nico', d: 31 }] }) => (
  <div style={{ width: PW, height: PH }}>
    <Barra titulo="Dejaron de venir" color={C.rojo} />
    {filas.map((r, i) => (
      <Pop key={r.n} at={i * 3} style={{ ...tarjeta, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}><div style={{ fontFamily: FUENTE_C, fontSize: 46 }}>{r.n}</div><div style={{ fontSize: 30, color: C.rojo }}>{r.d} días sin venir</div></div>
        <div style={{ background: '#25D366', border: `5px solid ${K}`, borderRadius: 18, padding: '10px 14px', fontFamily: FUENTE_C, fontSize: 30, color: '#fff' }}>Escribir</div>
      </Pop>
    ))}
    <Dedo x={PW - 120} y={200} at={toque} />
  </div>
);
