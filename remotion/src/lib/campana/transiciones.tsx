// Transiciones "con motivo" de la campaña: algo de la historia se lleva la escena.
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { Fantasma, BilleteSVG } from './Personajes';

type P = Record<string, unknown>;
const mk = <T extends P>(component: React.FC<TransitionPresentationComponentProps<T>>, props: T): TransitionPresentation<T> => ({ component, props });

/** El Fantasma cruza la pantalla y "arrastra" la escena: la nueva aparece detrás de él. */
const FantasmaC: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const x = interpolate(p, [0, 1], [-260, 1340]);
  if (presentationDirection === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${Math.max(0, 1080 - x)}px 0 0)` }}>{children}</AbsoluteFill>
      <Fantasma x={x} y={1250} s={2.2} billetes rot={8} />
    </AbsoluteFill>
  );
};
export const cruzaFantasma = () => mk(FantasmaC, {});

/** Un billete vuela hacia la cámara, tapa todo y deja ver la escena nueva. */
const BilleteC: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const vis = presentationDirection === 'exiting' ? p < 0.5 : p >= 0.5;
  const s = interpolate(p, [0, 0.5, 1], [0.15, 9, 22]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: vis ? 1 : 0 }}>{children}</AbsoluteFill>
      {presentationDirection === 'entering' && (
        <div style={{ position: 'absolute', left: 540, top: 900, transform: `translate(-50%,-50%) rotate(${p * 200 - 40}deg) scale(${s})`, opacity: p > 0.8 ? 0 : 1 }}>
          <svg width={180} height={100} overflow="visible"><BilleteSVG w={170} x={5} y={5} /></svg>
        </div>
      )}
    </AbsoluteFill>
  );
};
export const billeteACamara = () => mk(BilleteC, {});

/** Pantalla que se rompe en pedazos (el monitor que se quiebra). */
const RompeC: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  if (presentationDirection === 'entering') return <AbsoluteFill style={{ opacity: p > 0.35 ? 1 : 0 }}>{children}</AbsoluteFill>;
  const piezas = 6;
  return (
    <AbsoluteFill>
      {Array.from({ length: piezas * 2 }, (_, i) => {
        const col = i % 2, fila = Math.floor(i / 2);
        const dx = (col ? 1 : -1) * p * (300 + fila * 60), dy = p * p * 1600, r = (col ? 1 : -1) * p * (20 + fila * 8);
        return (
          <AbsoluteFill key={i} style={{ clipPath: `polygon(${col * 50}% ${(fila * 100) / piezas}%, ${col * 50 + 50}% ${(fila * 100) / piezas + 3}%, ${col * 50 + 50}% ${((fila + 1) * 100) / piezas}%, ${col * 50}% ${((fila + 1) * 100) / piezas - 3}%)`, transform: `translate(${dx}px, ${dy}px) rotate(${r}deg)` }}>
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
export const seRompe = () => mk(RompeC, {});
