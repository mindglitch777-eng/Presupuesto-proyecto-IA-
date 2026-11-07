// Personajes de la campaña, dibujados en SVG con contorno negro grueso (estilo sticker).
// Cada uno se ubica con (x, y) = punto de apoyo (los pies o la base) y escala s.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, TRAZO, FUENTE_C } from './estilo';

const K = C.negro, T = TRAZO;

/** Ubica un SVG con el ancla abajo al centro. */
export const Pos: React.FC<{ x: number; y: number; s?: number; w: number; h: number; rot?: number; flip?: boolean; o?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, s = 1, w, h, rot = 0, flip, o = 1, children, style }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible"
    style={{ position: 'absolute', left: x - w / 2, top: y - h, transform: `rotate(${rot}deg) scale(${flip ? -s : s}, ${s})`, transformOrigin: '50% 100%', opacity: o, overflow: 'visible', ...style }}>
    {children}
  </svg>
);

/** Parpadeo cada tanto (devuelve escala vertical del ojo). */
const useParpadeo = (seed = 0) => {
  const f = useCurrentFrame();
  const c = (f + seed * 17) % 70;
  return c < 3 ? 0.1 : 1;
};

const Ojo: React.FC<{ x: number; y: number; r?: number; mira?: [number, number]; esc?: number; enojo?: number; triste?: number; lado?: 1 | -1 }> = ({ x, y, r = 22, mira = [0, 0], esc = 1, enojo = 0, triste = 0, lado = 1 }) => (
  <g>
    <ellipse cx={x} cy={y} rx={r} ry={r * 1.15 * esc} fill="#fff" stroke={K} strokeWidth={T * 0.7} />
    {esc > 0.3 && <circle cx={x + mira[0] * r * 0.45} cy={y + mira[1] * r * 0.45} r={r * 0.45} fill={K} />}
    {esc > 0.3 && <circle cx={x + mira[0] * r * 0.45 + r * 0.15} cy={y + mira[1] * r * 0.45 - r * 0.18} r={r * 0.13} fill="#fff" />}
    {/* ceja */}
    <path d={`M${x - r * 1.1} ${y - r * 1.45 + lado * enojo * r * 0.5 - triste * lado * r * 0.4} L${x + r * 1.1} ${y - r * 1.45 - lado * enojo * r * 0.5 + triste * lado * r * 0.4}`} stroke={K} strokeWidth={T * 1.1} strokeLinecap="round" />
  </g>
);

export type Cara = 'feliz' | 'desesperado' | 'enojado' | 'aliviado' | 'normal';

/** EL BARBERO: gorra para atrás, barba, tatuaje y tijera. */
export const Barbero: React.FC<{ x: number; y: number; s?: number; cara?: Cara; brazo?: number; manosCabeza?: boolean; flip?: boolean; rot?: number }> = ({ x, y, s = 1, cara = 'normal', brazo = 0, manosCabeza, flip, rot }) => {
  const f = useCurrentFrame();
  const p = useParpadeo(1);
  const resp = Math.sin(f / 8) * 3;
  const enojo = cara === 'enojado' ? 1 : 0;
  const triste = cara === 'desesperado' ? 1 : 0;
  const boca = {
    feliz: 'M115 232 Q150 272 185 232 Z',
    aliviado: 'M120 238 Q150 258 180 238',
    normal: 'M125 240 L175 240',
    enojado: 'M120 250 Q150 230 180 250',
    desesperado: 'M118 255 Q150 215 182 255 Q150 245 118 255 Z',
  }[cara];
  const temblor = cara === 'desesperado' ? Math.sin(f * 2.5) * 3 : 0;
  return (
    <Pos x={x + temblor} y={y} s={s} w={300} h={560} flip={flip} rot={rot}>
      <g transform={`translate(0 ${resp})`}>
        {/* cuerpo */}
        <path d="M60 560 L70 380 Q80 320 150 318 Q220 320 230 380 L240 560 Z" fill={C.violeta} stroke={K} strokeWidth={T} strokeLinejoin="round" />
        <path d="M110 330 L150 400 L190 330" fill="none" stroke={K} strokeWidth={T * 0.7} />
        {/* delantal */}
        <path d="M95 420 L205 420 L215 560 L85 560 Z" fill={C.amarillo} stroke={K} strokeWidth={T * 0.8} />
        {/* brazo izquierdo (el de la tijera) */}
        {manosCabeza ? (
          <>
            <path d="M75 360 Q30 280 85 175" fill="none" stroke={K} strokeWidth={46} strokeLinecap="round" />
            <path d="M75 360 Q30 280 85 175" fill="none" stroke={C.piel} strokeWidth={30} strokeLinecap="round" />
            <path d="M225 360 Q270 280 215 175" fill="none" stroke={K} strokeWidth={46} strokeLinecap="round" />
            <path d="M225 360 Q270 280 215 175" fill="none" stroke={C.piel} strokeWidth={30} strokeLinecap="round" />
          </>
        ) : (
          <g transform={`rotate(${brazo} 228 350)`}>
            <path d="M228 350 L290 450" stroke={K} strokeWidth={46} strokeLinecap="round" />
            <path d="M228 350 L290 450" stroke={C.piel} strokeWidth={30} strokeLinecap="round" />
            <path d="M246 382 l14 10 m-8 6 l14 10" stroke={C.celeste} strokeWidth={6} strokeLinecap="round" />
            {/* tijera */}
            <g transform="translate(296 462) rotate(-30)">
              <ellipse cx={-14} cy={6} rx={14} ry={10} fill="none" stroke={K} strokeWidth={7} />
              <ellipse cx={14} cy={6} rx={14} ry={10} fill="none" stroke={K} strokeWidth={7} />
              <path d={`M-4 -2 L${-10 + Math.sin(f / 3) * 6} -70 M4 -2 L${10 - Math.sin(f / 3) * 6} -70`} stroke="#cfd6de" strokeWidth={10} strokeLinecap="round" />
              <path d={`M-4 -2 L${-10 + Math.sin(f / 3) * 6} -70 M4 -2 L${10 - Math.sin(f / 3) * 6} -70`} stroke={K} strokeWidth={3} fill="none" />
            </g>
          </g>
        )}
        {!manosCabeza && (
          <>
            <path d="M72 350 L40 450" stroke={K} strokeWidth={46} strokeLinecap="round" />
            <path d="M72 350 L40 450" stroke={C.piel} strokeWidth={30} strokeLinecap="round" />
          </>
        )}
        {/* cabeza */}
        <ellipse cx={150} cy={190} rx={92} ry={100} fill={C.piel} stroke={K} strokeWidth={T} />
        <ellipse cx={58} cy={200} rx={16} ry={24} fill={C.piel} stroke={K} strokeWidth={T * 0.7} />
        <ellipse cx={242} cy={200} rx={16} ry={24} fill={C.piel} stroke={K} strokeWidth={T * 0.7} />
        {/* barba */}
        <path d="M62 200 Q70 300 150 305 Q230 300 238 200 Q225 250 190 255 Q150 225 110 255 Q75 250 62 200 Z" fill={C.barba} stroke={K} strokeWidth={T * 0.8} strokeLinejoin="round" />
        <path d={boca} fill={cara === 'feliz' || cara === 'desesperado' ? '#7a1a2a' : 'none'} stroke={K} strokeWidth={T * 0.8} strokeLinejoin="round" strokeLinecap="round" />
        {/* gorra para atrás */}
        <path d="M60 160 Q70 80 150 78 Q230 80 240 160 Z" fill={C.rojo} stroke={K} strokeWidth={T} strokeLinejoin="round" />
        <path d="M60 158 Q40 168 18 150 Q30 132 70 136" fill={C.rojo} stroke={K} strokeWidth={T} strokeLinejoin="round" />
        <circle cx={150} cy={80} r={10} fill={C.rojo} stroke={K} strokeWidth={6} />
        <Ojo x={115} y={185} esc={p} enojo={enojo} triste={triste} lado={1} />
        <Ojo x={185} y={185} esc={p} enojo={enojo} triste={triste} lado={-1} />
        {cara === 'desesperado' && <path d={`M232 ${130 + (f % 30) * 2} q12 22 0 32 q-12 -10 0 -32`} fill="#7cd3ff" stroke={K} strokeWidth={5} />}
      </g>
    </Pos>
  );
};

/** EL FANTASMA: sábana con zapatillas y ojos burlones. Puede llevar billetes y saludar. */
export const Fantasma: React.FC<{ x: number; y: number; s?: number; billetes?: boolean; saluda?: boolean; flip?: boolean; o?: number; rot?: number }> = ({ x, y, s = 1, billetes, saluda, flip, o = 1, rot = 0 }) => {
  const f = useCurrentFrame();
  const flota = Math.sin(f / 6) * 10;
  const ola = Math.sin(f / 3) * 6;
  const mano = saluda ? Math.sin(f / 2.5) * 30 : 0;
  return (
    <Pos x={x} y={y + flota} s={s} w={320} h={430} flip={flip} o={o} rot={rot}>
      {/* zapatillas */}
      <path d="M95 400 q-40 0 -40 22 l80 0 q0 -22 -40 -22 Z" fill={C.rojo} stroke={K} strokeWidth={T * 0.8} />
      <path d="M200 400 q-40 0 -40 22 l80 0 q0 -22 -40 -22 Z" fill={C.rojo} stroke={K} strokeWidth={T * 0.8} />
      <path d="M58 418 h74 M163 418 h74" stroke="#fff" strokeWidth={6} />
      {/* sábana */}
      <path d={`M40 400 Q30 120 160 40 Q290 120 280 400 Q260 ${380 + ola} 240 400 Q220 ${380 - ola} 200 400 Q180 ${380 + ola} 160 400 Q140 ${380 - ola} 120 400 Q100 ${380 + ola} 80 400 Q60 ${380 - ola} 40 400 Z`} fill="#fff" stroke={K} strokeWidth={T} strokeLinejoin="round" />
      {/* brazo que saluda */}
      <g transform={`rotate(${-20 + mano} 270 230)`}><path d="M262 230 Q320 200 330 150" fill="none" stroke={K} strokeWidth={42} strokeLinecap="round" /><path d="M262 230 Q320 200 330 150" fill="none" stroke="#fff" strokeWidth={26} strokeLinecap="round" /></g>
      {/* ojos burlones (entrecerrados) */}
      <path d="M100 170 Q125 150 150 170" fill="none" stroke={K} strokeWidth={T} strokeLinecap="round" />
      <path d="M175 170 Q200 150 225 170" fill="none" stroke={K} strokeWidth={T} strokeLinecap="round" />
      <ellipse cx={125} cy={185} rx={14} ry={10} fill={K} /><ellipse cx={200} cy={185} rx={14} ry={10} fill={K} />
      {/* sonrisa con lengua */}
      <path d="M115 235 Q165 290 215 235 Z" fill="#7a1a2a" stroke={K} strokeWidth={T * 0.8} strokeLinejoin="round" />
      <path d="M150 262 Q170 290 188 258" fill={C.rosa} stroke={K} strokeWidth={5} />
      {billetes && (
        <g transform="translate(50 250) rotate(-12)">
          {[0, 1, 2].map((k) => <BilleteSVG key={k} x={k * 18} y={-k * 14} w={150} />)}
        </g>
      )}
    </Pos>
  );
};

/** Billete dibujado (para usar adentro de otros SVG). */
export const BilleteSVG: React.FC<{ x?: number; y?: number; w?: number; rot?: number }> = ({ x = 0, y = 0, w = 160, rot = 0 }) => {
  const h = w * 0.48;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={0} y={0} width={w} height={h} rx={8} fill={C.billete} stroke={K} strokeWidth={T * 0.6} />
      <rect x={w * 0.08} y={h * 0.15} width={w * 0.84} height={h * 0.7} rx={6} fill="none" stroke={C.billeteOscuro} strokeWidth={4} />
      <circle cx={w / 2} cy={h / 2} r={h * 0.28} fill={C.billeteOscuro} />
      <text x={w / 2} y={h / 2 + h * 0.16} textAnchor="middle" fontFamily={FUENTE_C} fontSize={h * 0.45} fill="#fff">$</text>
    </g>
  );
};

/** Billete suelto en la pantalla (posición absoluta). */
export const Billete: React.FC<{ x: number; y: number; w?: number; rot?: number; o?: number; rojo?: boolean }> = ({ x, y, w = 170, rot = 0, o = 1, rojo }) => (
  <svg width={w + 20} height={w * 0.48 + 20} style={{ position: 'absolute', left: x - w / 2 - 10, top: y - w * 0.24 - 10, transform: `rotate(${rot}deg)`, opacity: o, overflow: 'visible', filter: rojo ? 'hue-rotate(230deg) saturate(1.6)' : undefined }}>
    <BilleteSVG x={10} y={10} w={w} />
  </svg>
);

/** EL IMPACIENTE: mira el reloj, resopla y se va. */
export const Impaciente: React.FC<{ x: number; y: number; s?: number; fase?: 'reloj' | 'resopla' | 'salta'; flip?: boolean; rot?: number }> = ({ x, y, s = 1, fase = 'reloj', flip, rot = 0 }) => {
  const f = useCurrentFrame();
  const p = useParpadeo(3);
  const golpeteo = fase === 'reloj' ? Math.abs(Math.sin(f / 2)) * 8 : 0;
  return (
    <Pos x={x} y={y} s={s} w={260} h={520} flip={flip} rot={rot}>
      <path d="M85 520 L90 400 L170 400 L175 520" fill="#2b4c8c" stroke={K} strokeWidth={T} strokeLinejoin="round" />
      <path d="M70 410 L78 300 Q90 255 130 255 Q170 255 182 300 L190 410 Z" fill={C.naranja} stroke={K} strokeWidth={T} strokeLinejoin="round" />
      {/* brazo con reloj levantado */}
      <path d={fase === 'reloj' ? 'M180 300 L230 250 L190 225' : 'M180 300 L215 370'} fill="none" stroke={K} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
      <path d={fase === 'reloj' ? 'M180 300 L230 250 L190 225' : 'M180 300 L215 370'} fill="none" stroke={C.piel} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
      {fase === 'reloj' && <g><circle cx={205} cy={238} r={22} fill="#fff" stroke={K} strokeWidth={7} /><path d={`M205 238 L205 222 M205 238 L${205 + Math.cos(f / 3) * 12} ${238 + Math.sin(f / 3) * 12}`} stroke={C.rojo} strokeWidth={4} /></g>}
      <path d="M80 300 L45 380" stroke={K} strokeWidth={40} strokeLinecap="round" /><path d="M80 300 L45 380" stroke={C.piel} strokeWidth={24} strokeLinecap="round" />
      {/* cabeza */}
      <circle cx={130} cy={170} r={80} fill={C.piel} stroke={K} strokeWidth={T} />
      <path d="M55 150 Q60 85 130 88 Q200 85 205 150 Q180 120 130 125 Q80 120 55 150 Z" fill="#6b3a1e" stroke={K} strokeWidth={T * 0.8} />
      <Ojo x={102} y={170} r={18} esc={p} enojo={1} lado={1} mira={[0.6, -0.4]} />
      <Ojo x={160} y={170} r={18} esc={p} enojo={1} lado={-1} mira={[0.6, -0.4]} />
      <path d={fase === 'resopla' ? 'M110 215 Q130 200 150 215 Q130 230 110 215 Z' : 'M108 220 Q130 205 152 220'} fill={fase === 'resopla' ? '#7a1a2a' : 'none'} stroke={K} strokeWidth={T * 0.8} strokeLinecap="round" />
      {fase === 'resopla' && [0, 1, 2].map((k) => <ellipse key={k} cx={170 + ((f * 4 + k * 25) % 80)} cy={205 - k * 10} rx={14} ry={9} fill="#fff" stroke={K} strokeWidth={4} opacity={1 - ((f * 4 + k * 25) % 80) / 80} />)}
      {/* vapor de bronca */}
      {[0, 1].map((k) => <path key={k} d={`M${100 + k * 60} ${90 - ((f * 3 + k * 20) % 40)} q-10 -15 0 -30`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />)}
      <g transform={`translate(0 ${-golpeteo})`} />
    </Pos>
  );
};

/** Cliente genérico (para la fila o el que se olvida). */
export const Cliente: React.FC<{ x: number; y: number; s?: number; color?: string; pelo?: string; o?: number; cara?: 'normal' | 'aburrido' | 'feliz'; flip?: boolean }> = ({ x, y, s = 1, color = C.celeste, pelo = '#2a1a10', o = 1, cara = 'normal', flip }) => {
  const p = useParpadeo(Math.round(x));
  return (
    <Pos x={x} y={y} s={s} w={220} h={440} o={o} flip={flip}>
      <path d="M40 440 L50 290 Q60 240 110 240 Q160 240 170 290 L180 440 Z" fill={color} stroke={K} strokeWidth={T} strokeLinejoin="round" />
      <circle cx={110} cy={160} r={75} fill={C.piel} stroke={K} strokeWidth={T} />
      <path d="M38 150 Q40 80 110 80 Q180 80 182 150 Q150 110 110 115 Q70 110 38 150 Z" fill={pelo} stroke={K} strokeWidth={T * 0.8} />
      <Ojo x={85} y={160} r={16} esc={cara === 'aburrido' ? 0.45 : p} />
      <Ojo x={135} y={160} r={16} esc={cara === 'aburrido' ? 0.45 : p} />
      <path d={cara === 'feliz' ? 'M85 200 Q110 225 135 200' : cara === 'aburrido' ? 'M90 210 L130 205' : 'M92 205 Q110 215 128 205'} fill="none" stroke={K} strokeWidth={T * 0.8} strokeLinecap="round" />
    </Pos>
  );
};

/** LA SILLA: mascota de la marca, con ojos y boca. Triste cuando está vacía, feliz cuando está llena. */
export const Silla: React.FC<{ x: number; y: number; s?: number; animo?: 'triste' | 'feliz' | 'normal'; llora?: boolean; color?: string; rot?: number }> = ({ x, y, s = 1, animo = 'normal', llora, color = C.rojo, rot = 0 }) => {
  const f = useCurrentFrame();
  const p = useParpadeo(5);
  const salto = animo === 'feliz' ? Math.abs(Math.sin(f / 5)) * -18 : 0;
  return (
    <Pos x={x} y={y + salto} s={s} w={340} h={460} rot={rot}>
      <path d="M90 455 L250 455 L235 430 L105 430 Z" fill="#cfd6de" stroke={K} strokeWidth={T} strokeLinejoin="round" />
      <rect x={155} y={330} width={30} height={105} fill="#cfd6de" stroke={K} strokeWidth={T * 0.8} />
      {/* respaldo con cara */}
      <rect x={70} y={30} width={200} height={240} rx={40} fill={color} stroke={K} strokeWidth={T} />
      <rect x={40} y={250} width={260} height={90} rx={30} fill={color} stroke={K} strokeWidth={T} />
      <rect x={20} y={200} width={50} height={110} rx={20} fill={color} stroke={K} strokeWidth={T * 0.8} />
      <rect x={270} y={200} width={50} height={110} rx={20} fill={color} stroke={K} strokeWidth={T * 0.8} />
      <Ojo x={130} y={130} r={24} esc={p} triste={animo === 'triste' ? 1 : 0} lado={-1} mira={animo === 'triste' ? [0, 0.6] : [0, 0]} />
      <Ojo x={210} y={130} r={24} esc={p} triste={animo === 'triste' ? 1 : 0} lado={1} mira={animo === 'triste' ? [0, 0.6] : [0, 0]} />
      <path d={animo === 'feliz' ? 'M120 190 Q170 245 220 190 Z' : animo === 'triste' ? 'M125 220 Q170 180 215 220' : 'M135 205 L205 205'} fill={animo === 'feliz' ? '#7a1a2a' : 'none'} stroke={K} strokeWidth={T} strokeLinecap="round" strokeLinejoin="round" />
      {llora && [0, 1].map((k) => <path key={k} d={`M${122 + k * 88} ${160 + ((f * 5 + k * 20) % 70)} q10 18 0 26 q-10 -8 0 -26`} fill="#7cd3ff" stroke={K} strokeWidth={4} />)}
      {animo === 'feliz' && [0, 1].map((k) => <ellipse key={k} cx={100 + k * 140} cy={180} rx={18} ry={10} fill={C.rosa} opacity={0.7} />)}
    </Pos>
  );
};

/** Monitor de hospital: `linea` = 'late' (pulso) | 'cae' (se aplana) | 'plano'. */
export const Monitor: React.FC<{ x: number; y: number; s?: number; estado: 'late' | 'cae' | 'plano'; t?: number; roto?: number; color?: string; rotulo?: string }> = ({ x, y, s = 1, estado, t = 0, roto = 0, color = C.verde, rotulo = 'TU BARBERÍA' }) => {
  const f = useCurrentFrame();
  const W = 640, H = 420;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const u = i / 120;
    let yy = 0;
    const fase = (u * 3 + f / 22) % 1;
    const pulso = fase > 0.42 && fase < 0.58 ? Math.sin(((fase - 0.42) / 0.16) * Math.PI * 2) * (fase < 0.5 ? -1 : 0.5) : 0;
    const amp = estado === 'late' ? 1 : estado === 'cae' ? Math.max(0, 1 - t) * (u < 0.7 ? 1 : 0) : 0;
    yy = pulso * 110 * amp;
    pts.push(`${40 + u * (W - 80)},${H / 2 + 20 + yy}`);
  }
  return (
    <Pos x={x} y={y} s={s} w={W} h={H + 120}>
      <rect x={280} y={H} width={80} height={110} fill="#9aa6b4" stroke={K} strokeWidth={T} />
      <rect x={0} y={0} width={W} height={H} rx={40} fill="#e9eef3" stroke={K} strokeWidth={T} />
      <rect x={28} y={70} width={W - 56} height={H - 100} rx={18} fill="#0d2a26" stroke={K} strokeWidth={T * 0.7} />
      <rect x={W / 2 - 170} y={14} width={340} height={46} rx={14} fill={C.amarillo} stroke={K} strokeWidth={6} />
      <text x={W / 2} y={50} textAnchor="middle" fontFamily={FUENTE_C} fontSize={34} fill={K}>{rotulo}</text>
      <polyline points={pts.join(' ')} fill="none" stroke={estado === 'late' ? color : C.rojo} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${estado === 'late' ? color : C.rojo})` }} />
      <circle cx={W - 70} cy={110} r={14} fill={estado === 'late' ? color : (f % 10 < 5 ? C.rojo : '#5a0010')} />
      {roto > 0 && (
        <g stroke="#fff" strokeWidth={7} fill="none" opacity={Math.min(1, roto * 2)}>
          {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return <path key={i} d={`M${W / 2} ${H / 2} l${Math.cos(a) * 90 * roto} ${Math.sin(a) * 70 * roto} l${Math.cos(a + .4) * 120 * roto} ${Math.sin(a + .4) * 90 * roto}`} />; })}
        </g>
      )}
    </Pos>
  );
};

/** El balde de plata con 3 agujeros. `nivel` 0-1; `tapados` = qué agujeros tienen parche; `chorros` = salen billetes. */
export const Balde: React.FC<{ x: number; y: number; s?: number; nivel?: number; tapados?: boolean[]; chorros?: boolean; rotulos?: (string | null)[]; marcar?: number }> = ({ x, y, s = 1, nivel = 0.8, tapados = [false, false, false], chorros = true, rotulos = [null, null, null], marcar = -1 }) => {
  const f = useCurrentFrame();
  const W = 600, H = 560;
  const AG = [[160, 330], [300, 420], [440, 330]];
  const top = 130 + (1 - nivel) * 330;
  return (
    <Pos x={x} y={y} s={s} w={W} h={H}>
      <defs><clipPath id="baldeIn"><path d="M70 110 L530 110 L470 540 L130 540 Z" /></clipPath></defs>
      {/* asa */}
      <path d="M90 120 Q300 -60 510 120" fill="none" stroke={K} strokeWidth={22} /><path d="M90 120 Q300 -60 510 120" fill="none" stroke="#cfd6de" strokeWidth={10} />
      <path d="M70 110 L530 110 L470 540 L130 540 Z" fill="#b8c4d0" stroke={K} strokeWidth={T} strokeLinejoin="round" />
      {/* plata adentro */}
      <g clipPath="url(#baldeIn)">
        <rect x={60} y={top} width={480} height={500} fill={C.billete} />
        {Array.from({ length: 14 }, (_, i) => <g key={i} transform={`translate(${80 + (i % 5) * 92} ${top + 10 + Math.floor(i / 5) * 60}) rotate(${(i * 37) % 40 - 20})`}><BilleteSVG w={110} /></g>)}
        <path d={`M60 ${top} Q300 ${top - 20 + Math.sin(f / 5) * 8} 540 ${top}`} fill="none" stroke={K} strokeWidth={6} />
      </g>
      <path d="M70 110 L530 110 L470 540 L130 540 Z" fill="none" stroke={K} strokeWidth={T} strokeLinejoin="round" />
      <ellipse cx={300} cy={110} rx={232} ry={30} fill="none" stroke={K} strokeWidth={T} />
      {[200, 300, 400].map((yy) => <path key={yy} d={`M${80 + (yy - 110) * 0.14} ${yy} L${520 - (yy - 110) * 0.14} ${yy}`} stroke="#8d99a6" strokeWidth={6} />)}
      {AG.map(([ax, ay], i) => (
        <g key={i}>
          {tapados[i] ? (
            <g>
              <rect x={ax - 70} y={ay - 45} width={140} height={90} rx={14} fill={C.verde} stroke={K} strokeWidth={T * 0.8} transform={`rotate(${i % 2 ? 6 : -8} ${ax} ${ay})`} />
              <path d={`M${ax - 50} ${ay - 25} l100 50 M${ax + 50} ${ay - 25} l-100 50`} stroke="#fff" strokeWidth={8} opacity={0.7} />
              {rotulos[i] && <text x={ax} y={ay + 14} textAnchor="middle" fontFamily={FUENTE_C} fontSize={34} fill={K}>{rotulos[i]}</text>}
            </g>
          ) : (
            <g>
              <ellipse cx={ax} cy={ay} rx={44} ry={36} fill="#1a1a1a" stroke={K} strokeWidth={T * 0.6} />
              <circle cx={ax} cy={ay - 70} r={30} fill={marcar === i ? C.amarillo : '#fff'} stroke={K} strokeWidth={6} />
              <text x={ax} y={ay - 58} textAnchor="middle" fontFamily={FUENTE_C} fontSize={36} fill={K}>{i + 1}</text>
              {chorros && Array.from({ length: 4 }, (_, k) => {
                const tt = ((f + k * 7 + i * 5) % 28) / 28;
                return <g key={k} transform={`translate(${ax - 40 + (i - 1) * tt * 160} ${ay + tt * tt * 260}) rotate(${tt * 200 + k * 40})`} opacity={1 - tt * 0.6}><BilleteSVG w={80} /></g>;
              })}
            </g>
          )}
        </g>
      ))}
    </Pos>
  );
};

/** Logo de Silla Llena: sillita + nombre. */
export const Logo: React.FC<{ x: number; y: number; s?: number; frase?: boolean }> = ({ x, y, s = 1, frase = true }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: C.violeta, border: `10px solid ${K}`, borderRadius: 40, padding: '18px 40px', boxShadow: `0 14px 0 ${K}` }}>
      <svg width={110} height={120} viewBox="0 0 340 460">
        <rect x={70} y={30} width={200} height={240} rx={40} fill={C.amarillo} stroke={K} strokeWidth={22} />
        <rect x={40} y={250} width={260} height={90} rx={30} fill={C.amarillo} stroke={K} strokeWidth={22} />
        <rect x={155} y={330} width={30} height={105} fill="#fff" stroke={K} strokeWidth={18} />
        <path d="M120 170 Q170 215 220 170" fill="none" stroke={K} strokeWidth={22} strokeLinecap="round" />
      </svg>
      <div style={{ fontFamily: FUENTE_C, fontSize: 120, color: '#fff', WebkitTextStroke: `10px ${K}`, paintOrder: 'stroke', lineHeight: 1, whiteSpace: 'nowrap' }}>SILLA LLENA</div>
    </div>
    {frase && <div style={{ marginTop: 34, background: '#fff', border: `7px solid ${K}`, borderRadius: 24, padding: '10px 26px', fontFamily: FUENTE_C, fontSize: 46, color: K, textAlign: 'center', boxShadow: `0 8px 0 ${K}`, maxWidth: 820 }}>la app para que no pierdas más clientes ni plata</div>}
  </div>
);
