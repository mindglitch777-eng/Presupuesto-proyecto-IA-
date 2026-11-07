import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { FUENTE } from './fuentes';
import { cl, COL, Rayo, Flash, Particulas } from './fx';

/** Comparación épica en pantalla partida. Las mitades entran chocando, aparece "VS" con rayos, y en `gana`
 *  la línea del medio se corre hacia la izquierda hasta que la derecha ocupa casi todo. */
export const Split: React.FC<{
  izq: React.ReactNode; der: React.ReactNode; tIzq: string; tDer: string; at?: number; gana?: number;
  colIzq?: string; colDer?: string; fondoIzq?: string; fondoDer?: string; final?: number;
}> = ({ izq, der, tIzq, tDer, at = 0, gana = 9999, colIzq = COL.rojo, colDer = COL.verde, fondoIzq = '#1a0508', fondoDer = '#03180c', final = 0.82 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 160 } });
  const g = interpolate(f, [gana, gana + 14], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.4)) });
  const mid = 540 + g * (1080 * (final - 0.5)) * -1; // la línea va hacia la izquierda: crece la derecha
  const lx = interpolate(e, [0, 1], [-560, 0]);
  const rx = interpolate(e, [0, 1], [560, 0]);
  const vs = spring({ frame: f - at - 8, fps, config: { damping: 8, stiffness: 240 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(0 0, ${mid + 60}px 0, ${mid - 60}px 100%, 0 100%)`, transform: `translateX(${lx}px)`, background: fondoIzq, filter: g > 0 ? `grayscale(${g}) brightness(${1 - g * 0.4})` : undefined }}>
        <AbsoluteFill style={{ transform: `translateX(${mid / 2 - 540}px)` }}>{izq}</AbsoluteFill>
        <Etiqueta t={tIzq} x={mid / 2} c={colIzq} at={at + 4} tachar={g} escala={1 - g * 0.55} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${mid + 60}px 0, 100% 0, 100% 100%, ${mid - 60}px 100%)`, transform: `translateX(${rx}px)`, background: fondoDer }}>
        <AbsoluteFill style={{ transform: `translateX(${(mid + 960) / 2 - 540}px)` }}>{der}</AbsoluteFill>
        <Etiqueta t={tDer} x={(mid + 960) / 2} c={colDer} at={at + 6} brilla={g} />
      </AbsoluteFill>
      {/* línea del medio: rayo permanente */}
      <Rayo x1={mid + 60} y1={0} x2={mid - 60} y2={1920} at={at + 4} dura={9999} color="#E8FBFF" grosor={8} seed={'split' + Math.floor(f / 3)} ramas={false} />
      <div style={{ position: 'absolute', left: mid, top: 700, transform: `translate(-50%,-50%) scale(${vs * (1 - g * 0.4)}) rotate(${-8 + Math.sin(f / 4) * 3}deg)`, fontFamily: FUENTE, fontWeight: 900, fontSize: 150, color: COL.amarillo, WebkitTextStroke: '10px #000', paintOrder: 'stroke', textShadow: `0 0 50px ${COL.amarillo}` }}>VS</div>
      <Flash at={at + 8} max={0.6} />
      <Flash at={gana} color={colDer} max={0.5} />
      <Particulas at={gana} x={700} y={800} n={50} colores={[colDer, '#fff', COL.amarillo]} seed="splitp" />
    </AbsoluteFill>
  );
};

const Etiqueta: React.FC<{ t: string; x: number; c: string; at: number; tachar?: number; brilla?: number; escala?: number }> = ({ t, x, c, at, tachar = 0, brilla = 0, escala = 1 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 200 } });
  return (
    <div style={{ position: 'absolute', left: x, top: 330, transform: `translate(-50%,-50%) scale(${s * (1 + brilla * 0.25) * escala}) rotate(-3deg)`, background: c, color: '#000', fontFamily: FUENTE, fontWeight: 900, fontSize: 64, padding: '10px 26px', borderRadius: 18, border: '6px solid #000', whiteSpace: 'nowrap', boxShadow: `0 10px 0 #000, 0 0 ${brilla * 60}px ${c}` }}>
      {t}
      {tachar > 0 && <div style={{ position: 'absolute', left: -10, top: '50%', height: 12, width: `${tachar * 110}%`, background: '#000', transform: 'rotate(-8deg)' }} />}
    </div>
  );
};
