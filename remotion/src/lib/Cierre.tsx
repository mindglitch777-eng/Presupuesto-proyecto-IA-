import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { useW } from './contexto';
import { FUENTE } from './fuentes';
import { Confeti, Rayos } from './fx';
import { Sfx } from './Sfx';

/** Llamado a la acción "COMENTÁ BARBER", con el estilo de cada video (colores, fondo, línea de abajo). */
export const Cierre: React.FC<{ fondo?: React.ReactNode; color: string; texto?: string; sub?: string; confeti?: string[]; rot?: number; borde?: string; y?: number }> = ({
  fondo, color, texto = '#fff', sub, confeti, rot = -4, borde = '#000', y = 840,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const b = w('barber');
  const c = w('comenta');
  const sc = spring({ frame: f - c, fps, config: { damping: 9, stiffness: 200 } });
  const sb = spring({ frame: f - b, fps, config: { damping: 7, stiffness: 240 } });
  const late = f > b + 10 ? 1 + Math.sin((f - b) / 3.5) * 0.045 : 1;
  return (
    <AbsoluteFill>
      {fondo}
      <Rayos y={y} color="rgba(255,255,255,.14)" />
      {confeti && <Confeti at={b} colores={confeti} />}
      <div style={{ position: 'absolute', left: 480, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, textAlign: 'center' }}>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 84, color: texto, WebkitTextStroke: `10px ${borde}`, paintOrder: 'stroke', transform: `scale(${sc})` }}>COMENTÁ</div>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 200, color, background: borde, padding: '0 44px', borderRadius: 34, border: `12px solid ${color}`, boxShadow: `0 0 90px ${color}, 0 16px 0 rgba(0,0,0,.5)`, letterSpacing: -4, transform: `scale(${sb * late})`, lineHeight: 1.15 }}>BARBER</div>
        {sub && <div style={{ fontFamily: FUENTE, fontWeight: 800, fontSize: 48, color: texto, marginTop: 26, WebkitTextStroke: `7px ${borde}`, paintOrder: 'stroke', transform: `scale(${sb})` }}>{sub}</div>}
      </div>
      <Sfx s="pop" at={c} v={0.5} />
      <Sfx s="hit" at={b} v={0.6} />
      <Sfx s="chime" at={b + 2} v={0.35} />
    </AbsoluteFill>
  );
};
