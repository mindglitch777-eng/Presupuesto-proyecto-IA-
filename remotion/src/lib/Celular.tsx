import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FUENTE, EMOJI } from './fuentes';
import { cl, pesos, COL } from './fx';

export const SW = 470, SH = 980; // tamaño de la pantalla
const VIOLETA = '#6C2BFF';

/** Celular genérico (sin marca) con perspectiva 3D. La pantalla es lo que va adentro. */
export const Celular: React.FC<{ x?: number; y?: number; s?: number; rotY?: number; rotX?: number; rotZ?: number; children?: React.ReactNode; brillo?: boolean; sombra?: boolean }> = ({
  x = 540, y = 820, s = 1, rotY = 0, rotX = 0, rotZ = 0, children, brillo = true, sombra = true,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: x, top: y, perspective: 2200, transform: 'translate(-50%,-50%)' }}>
      <div style={{
        width: SW + 36, height: SH + 36, borderRadius: 74, background: 'linear-gradient(145deg,#3a3a46,#121218 40%,#2a2a34)',
        transform: `scale(${s}) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`, transformStyle: 'preserve-3d',
        boxShadow: sombra ? '0 60px 120px rgba(0,0,0,.6), inset 0 0 0 3px #555' : undefined, padding: 18, position: 'relative',
      }}>
        <div style={{ width: SW, height: SH, borderRadius: 58, overflow: 'hidden', background: '#F4F2FA', position: 'relative' }}>
          {children}
          <div style={{ position: 'absolute', top: 14, left: SW / 2 - 60, width: 120, height: 34, borderRadius: 20, background: '#0b0b0f' }} />
          {brillo && <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${115 + Math.sin(f / 20) * 10}deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.22) 45%, rgba(255,255,255,0) 60%)`, pointerEvents: 'none' }} />}
        </div>
      </div>
    </div>
  );
};

const Barra: React.FC<{ titulo: string; color?: string }> = ({ titulo, color = VIOLETA }) => (
  <div style={{ background: color, color: '#fff', padding: '64px 28px 22px', fontFamily: FUENTE, fontWeight: 800, fontSize: 34, display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ fontFamily: EMOJI, fontSize: 34 }}>💈</span>{titulo}
  </div>
);

const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 220 } });
  if (f < at) return null;
  return <div style={{ transform: `scale(${s})`, opacity: Math.min(1, s * 2), ...style }}>{children}</div>;
};

/** Dedo que toca: círculo con onda en (x, y) de la pantalla, en el cuadro `at`. */
export const Toque: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -8 || t > 16) return null;
  const llega = interpolate(t, [-8, 0], [0, 1], cl);
  const r = interpolate(t, [0, 14], [30, 90], cl);
  return (
    <>
      <div style={{ position: 'absolute', left: x - 36, top: y - 36 + (1 - llega) * 120, width: 72, height: 72, borderRadius: '50%', background: 'rgba(30,30,40,.35)', border: '4px solid rgba(255,255,255,.9)', opacity: t > 8 ? 0 : 1 }} />
      {t >= 0 && <div style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `6px solid ${VIOLETA}`, opacity: 1 - t / 14 }} />}
    </>
  );
};

const card: React.CSSProperties = { background: '#fff', borderRadius: 22, margin: '14px 20px', padding: '18px 22px', boxShadow: '0 4px 14px rgba(40,20,90,.1)', fontFamily: FUENTE, fontWeight: 700, color: '#1b1530' };

/** Reserva: grilla de horarios; en `toque` se elige uno, en `sena` aparece la seña y en `ok` la confirmación. */
export const PReserva: React.FC<{ dia?: string; horas?: string[]; elegida?: number; toque?: number; sena?: number; ok?: number; montoSena?: number; ocupadas?: number[] }> = ({
  dia = 'Sábado', horas = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '16:00', '16:30', '17:00', '17:30', '18:30'], elegida = 2, toque = 20, sena = 999, ok = 999, montoSena = 2000, ocupadas = [1, 4, 7],
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: SW, height: SH, background: '#F4F2FA' }}>
      <Barra titulo="Reservá tu turno" />
      <div style={{ ...card, fontSize: 30, display: 'flex', gap: 10 }}>{['Jue', 'Vie', 'Sáb', 'Dom'].map((d, i) => (
        <div key={d} style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 14, background: d.startsWith(dia.slice(0, 2)) ? VIOLETA : '#EEE9FF', color: d.startsWith(dia.slice(0, 2)) ? '#fff' : '#3b2a7a' }}>{d}</div>
      ))}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, margin: '6px 20px' }}>
        {horas.map((h, i) => {
          const sel = i === elegida && f >= toque;
          const occ = ocupadas.includes(i);
          return <div key={h} style={{ fontFamily: FUENTE, fontWeight: 800, fontSize: 30, textAlign: 'center', padding: '18px 0', borderRadius: 16, background: sel ? VIOLETA : occ ? '#E4E1EC' : '#fff', color: sel ? '#fff' : occ ? '#A9A3BC' : '#2a1d63', textDecoration: occ ? 'line-through' : undefined, boxShadow: sel ? `0 0 0 6px ${COL.amarillo}` : '0 3px 8px rgba(40,20,90,.08)', transform: `scale(${sel ? 1.06 : 1})` }}>{h}</div>;
        })}
      </div>
      <Pop at={sena} style={{ ...card, background: '#1b1530', color: '#fff', fontSize: 30, marginTop: 22 }}>
        <div style={{ opacity: .7, fontSize: 24 }}>Para confirmar:</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: COL.amarillo }}>Seña {pesos(montoSena)}</div>
        <div style={{ fontSize: 24, opacity: .8 }}>por transferencia · alias</div>
      </Pop>
      <Pop at={ok} style={{ ...card, background: '#13C46B', color: '#fff', fontSize: 36, textAlign: 'center', fontWeight: 900 }}>✓ Turno confirmado</Pop>
      <Toque x={SW / 2} y={elegida >= 0 ? 330 + Math.floor(elegida / 3) * 86 : 0} at={toque} />
    </div>
  );
};

/** Agenda del día con un horario bloqueado (no se puede pisar). */
export const PAgenda: React.FC<{ filas: { h: string; n: string }[]; intento?: number; bloqueada?: number }> = ({ filas, intento = 999, bloqueada = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: SW, height: SH, background: '#F4F2FA' }}>
      <Barra titulo="Agenda · Sábado" />
      {filas.map((r, i) => {
        const b = i === bloqueada && f >= intento;
        const sh = b ? Math.sin((f - intento) * 1.8) * Math.max(0, 10 - (f - intento)) : 0;
        return (
          <div key={i} style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, transform: `translateX(${sh}px)`, background: b ? '#ECEAF2' : '#fff' }}>
            <div style={{ fontWeight: 900, color: VIOLETA, width: 110 }}>{r.h}</div>
            <div style={{ flex: 1 }}>{r.n}</div>
            {b && <div style={{ fontFamily: EMOJI, fontSize: 34 }}>🔒</div>}
          </div>
        );
      })}
      {f >= intento && <Pop at={intento} style={{ ...card, background: '#FFE3E8', color: '#C4002B', fontSize: 28, textAlign: 'center' }}>Ese horario ya está ocupado</Pop>}
    </div>
  );
};

/** Fila virtual: posición que baja. */
export const PFila: React.FC<{ pasos: number[]; minutos?: number[] }> = ({ pasos, minutos = [25, 12, 0] }) => {
  const f = useCurrentFrame();
  const k = pasos.filter((p) => f >= p).length; // 0 → 3º, 1 → 2º, 2 → te toca
  const pos = [3, 2, 1][Math.min(k, 2)];
  const toca = k >= 2;
  const s = interpolate(f - (pasos[Math.max(0, k - 1)] ?? 0), [0, 4, 10], [1.3, 1.1, 1], cl);
  return (
    <div style={{ width: SW, height: SH, background: toca ? '#13C46B' : '#F4F2FA' }}>
      <Barra titulo="Fila virtual" color={toca ? '#0E9F57' : VIOLETA} />
      <div style={{ textAlign: 'center', marginTop: 90, fontFamily: FUENTE, color: toca ? '#fff' : '#1b1530' }}>
        <div style={{ fontSize: 40, fontWeight: 700 }}>{toca ? '¡Es tu turno!' : 'Vas'}</div>
        <div style={{ fontSize: toca ? 150 : 260, fontWeight: 900, lineHeight: 1, transform: `scale(${s})`, color: toca ? '#fff' : VIOLETA }}>{toca ? 'TE TOCA' : `${pos}º`}</div>
        {!toca && <div style={{ fontSize: 40, fontWeight: 800, marginTop: 20 }}>faltan ~{minutos[Math.min(k, 2)]} min</div>}
        <div style={{ margin: '50px 60px 0', height: 22, borderRadius: 11, background: toca ? 'rgba(255,255,255,.4)' : '#E2DBFF' }}>
          <div style={{ width: `${[25, 60, 100][Math.min(k, 2)]}%`, height: '100%', borderRadius: 11, background: toca ? '#fff' : VIOLETA }} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 600, marginTop: 30, opacity: .7 }}>Te avisamos cuando falte poco</div>
      </div>
    </div>
  );
};

/** Caja del día: cada toque suma una fila. */
export const PCaja: React.FC<{ filas: { t: string; m: number; at: number }[]; cierre?: number; barras?: number[] }> = ({ filas, cierre = 999, barras = [3, 5, 2, 4, 6, 9, 12] }) => {
  const f = useCurrentFrame();
  const total = filas.filter((r) => f >= r.at).reduce((a, r) => a + r.m, 0);
  return (
    <div style={{ width: SW, height: SH, background: '#F4F2FA' }}>
      <Barra titulo="Caja del día" />
      {f < cierre ? (
        <>
          <div style={{ display: 'flex', gap: 12, margin: '16px 20px' }}>
            {['+ Efectivo', '+ Transf.'].map((b) => <div key={b} style={{ flex: 1, background: VIOLETA, color: '#fff', borderRadius: 18, padding: '20px 0', textAlign: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 30 }}>{b}</div>)}
          </div>
          {filas.map((r, i) => <Pop key={i} at={r.at} style={{ ...card, display: 'flex', justifyContent: 'space-between', fontSize: 25 }}><span>✂️ {r.t}</span><b style={{ color: '#0E9F57' }}>{pesos(r.m)}</b></Pop>)}
          <div style={{ ...card, background: '#1b1530', color: '#fff', display: 'flex', justifyContent: 'space-between', fontSize: 34, position: 'absolute', bottom: 30, left: 0, right: 0 }}><span>Total</span><b style={{ color: COL.verde }}>{pesos(total)}</b></div>
        </>
      ) : (
        <Pop at={cierre} style={{ padding: 20 }}>
          <div style={{ ...card, fontSize: 30 }}>Cortes hoy: <b>{filas.length}</b></div>
          <div style={{ ...card, fontSize: 30 }}>Total: <b style={{ color: '#0E9F57' }}>{pesos(total)}</b></div>
          <div style={{ ...card, height: 360, display: 'flex', alignItems: 'flex-end', gap: 14, paddingTop: 30 }}>
            {barras.map((b, i) => {
              const h = interpolate(f - cierre - i * 2, [0, 12], [0, b * 24], cl);
              return <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 20 }}><div style={{ height: h, background: i === 5 ? COL.amarillo : i === 1 ? '#FF6B8A' : VIOLETA, borderRadius: 8 }} />{'LMMJVSD'[i]}</div>;
            })}
          </div>
        </Pop>
      )}
    </div>
  );
};

/** Ficha de un cliente. */
export const PFicha: React.FC<{ nombre: string; lineas: { t: string; at: number; resalta?: boolean }[] }> = ({ nombre, lineas }) => (
  <div style={{ width: SW, height: SH, background: '#F4F2FA' }}>
    <Barra titulo="Clientes" />
    <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 18 }}>
      <div style={{ width: 96, height: 96, borderRadius: '50%', background: VIOLETA, color: '#fff', fontSize: 48, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{nombre[0]}</div>
      <div><div style={{ fontSize: 40, fontWeight: 900 }}>{nombre}</div><div style={{ fontSize: 24, opacity: .6 }}>Último corte: hace 15 días</div></div>
    </div>
    {lineas.map((l, i) => <Pop key={i} at={l.at} style={{ ...card, fontSize: 32, background: l.resalta ? '#FFF6CC' : '#fff', borderLeft: `10px solid ${l.resalta ? COL.amarillo : VIOLETA}` }}>{l.t}</Pop>)}
  </div>
);

/** Tarjeta de puntos con sellos y día de puntos dobles. */
export const PPuntos: React.FC<{ sellos: number; x2At?: number; desde?: number }> = ({ sellos, x2At = 999, desde = 0 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: SW, height: SH, background: '#F4F2FA' }}>
      <Barra titulo="Tarjeta de puntos" />
      <div style={{ ...card, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, padding: 24 }}>
        {Array.from({ length: 10 }, (_, i) => {
          const on = i < sellos && f >= desde + i * 3;
          return <div key={i} style={{ aspectRatio: '1', borderRadius: '50%', border: `4px dashed ${on ? VIOLETA : '#CFC7EA'}`, background: on ? VIOLETA : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, transform: `scale(${on ? interpolate(f - desde - i * 3, [0, 4, 8], [1.5, .9, 1], cl) : 1})` }}>{on ? '✂️' : ''}</div>;
        })}
      </div>
      <div style={{ ...card, fontSize: 30, textAlign: 'center' }}>Al 10º, <b>el siguiente es gratis</b></div>
      <div style={{ display: 'flex', gap: 8, margin: '10px 20px' }}>
        {['L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => {
          const x2 = i === 1 && f >= x2At;
          return <div key={i} style={{ flex: 1, textAlign: 'center', borderRadius: 14, padding: '16px 0', fontFamily: FUENTE, fontWeight: 900, fontSize: x2 ? 30 : 28, background: x2 ? COL.magenta : '#fff', color: x2 ? '#fff' : '#3b2a7a', boxShadow: x2 ? `0 0 ${20 + Math.sin(f / 3) * 10}px ${COL.magenta}` : undefined }}>{x2 ? 'x2' : d}</div>;
        })}
      </div>
      <div style={{ margin: '30px auto', width: 220, height: 220, background: 'repeating-conic-gradient(#1b1530 0 25%, #fff 0 50%) 0 0/44px 44px', borderRadius: 16, border: '10px solid #fff', boxShadow: '0 6px 20px rgba(0,0,0,.15)' }} />
    </div>
  );
};

/** Lista de clientes que no volvieron, con botón para escribirles. */
export const PNoVolvieron: React.FC<{ filas: { n: string; d: number; at: number }[]; toque?: number }> = ({ filas, toque = 999 }) => (
  <div style={{ width: SW, height: SH, background: '#F4F2FA' }}>
    <Barra titulo="Hace rato que no vienen" />
    {filas.map((r, i) => (
      <Pop key={i} at={r.at} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#E2DBFF', color: VIOLETA, fontWeight: 900, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.n[0]}</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 32, fontWeight: 900 }}>{r.n}</div><div style={{ fontSize: 26, color: '#E0004D', fontWeight: 800 }}>{r.d} días</div></div>
        <div style={{ background: '#13C46B', color: '#fff', borderRadius: 16, padding: '14px 18px', fontSize: 26, fontWeight: 900 }}>Escribir</div>
      </Pop>
    ))}
    <Toque x={SW - 80} y={64 + 70 + 60} at={toque} />
  </div>
);

/** Chat genérico (verde, sin logo). */
export const PChat: React.FC<{ nombre: string; msgs: { t: string; yo?: boolean; at: number }[] }> = ({ nombre, msgs }) => (
  <div style={{ width: SW, height: SH, background: '#ECE5DD' }}>
    <div style={{ background: '#0E7A5F', color: '#fff', padding: '64px 24px 20px', fontFamily: FUENTE, fontWeight: 800, fontSize: 34 }}>← {nombre}</div>
    {msgs.map((m, i) => (
      <Pop key={i} at={m.at} style={{ display: 'flex', justifyContent: m.yo ? 'flex-end' : 'flex-start', margin: '12px 18px' }}>
        <div style={{ maxWidth: 380, background: m.yo ? '#DCF8C6' : '#fff', borderRadius: 20, padding: '16px 20px', fontFamily: FUENTE, fontWeight: 700, fontSize: 36, color: '#111', boxShadow: '0 2px 4px rgba(0,0,0,.1)' }}>{m.t}{m.yo && <span style={{ color: '#34B7F1', fontSize: 28, marginLeft: 8, fontWeight: 900 }}>✓✓</span>}</div>
      </Pop>
    ))}
  </div>
);
