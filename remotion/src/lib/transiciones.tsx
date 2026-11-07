import React from 'react';
import { AbsoluteFill, interpolate, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
export { slide } from '@remotion/transitions/slide';
export { wipe } from '@remotion/transitions/wipe';
export { flip } from '@remotion/transitions/flip';
export { clockWipe } from '@remotion/transitions/clock-wipe';
export { iris } from '@remotion/transitions/iris';
export { fade } from '@remotion/transitions/fade';
export { pushCut } from '@remotion/transitions/push-cut';

type P = Record<string, unknown>;
const mk = <T extends P>(component: React.FC<TransitionPresentationComponentProps<T>>, props: T): TransitionPresentation<T> => ({ component, props });

/** Zoom con desenfoque: la escena que sale se acerca y se borra, la que entra viene de lejos. */
const ZoomBlurC: React.FC<TransitionPresentationComponentProps<{ fuerza: number }>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const sale = presentationDirection === 'exiting';
  const s = sale ? 1 + p * 1.6 * passedProps.fuerza : 0.4 + 0.6 * p;
  const b = sale ? p * 40 : (1 - p) * 40;
  return <AbsoluteFill style={{ transform: `scale(${s})`, filter: `blur(${b}px) brightness(${1 + (sale ? p : 1 - p) * 0.8})`, opacity: sale ? 1 - p * 0.4 : Math.min(1, p * 3) }}>{children}</AbsoluteFill>;
};
export const zoomBlur = (fuerza = 1) => mk(ZoomBlurC, { fuerza });

/** Latigazo: paneo rapidísimo con desenfoque horizontal. */
const WhipC: React.FC<TransitionPresentationComponentProps<{ dir: number }>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const sale = presentationDirection === 'exiting';
  const x = (sale ? -p : 1 - p) * 1080 * passedProps.dir;
  const b = Math.sin(p * Math.PI) * 30;
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: `blur(${b}px)` }}>{children}</AbsoluteFill>;
};
export const whip = (dir: 1 | -1 = 1) => mk(WhipC, { dir });

/** Latigazo vertical (la cámara cae o sube). */
const WhipVC: React.FC<TransitionPresentationComponentProps<{ dir: number }>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const sale = presentationDirection === 'exiting';
  const y = (sale ? -p : 1 - p) * 1920 * passedProps.dir;
  return <AbsoluteFill style={{ transform: `translateY(${y}px)`, filter: `blur(${Math.sin(p * Math.PI) * 28}px)` }}>{children}</AbsoluteFill>;
};
export const whipV = (dir: 1 | -1 = 1) => mk(WhipVC, { dir });

/** Glitch: cortes RGB y saltos. */
const GlitchC: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const sale = presentationDirection === 'exiting';
  const k = Math.floor(p * 12);
  const vis = sale ? p < 0.5 || random('gt' + k) > 0.6 : p > 0.5 || random('gt' + k) > 0.6;
  const dx = (random('gtx' + k) - 0.5) * 140 * Math.sin(p * Math.PI);
  return <AbsoluteFill style={{ opacity: vis ? 1 : 0, transform: `translateX(${dx}px) skewX(${dx / 20}deg)`, filter: `hue-rotate(${dx * 2}deg) saturate(${1 + Math.sin(p * Math.PI) * 3})` }}>{children}</AbsoluteFill>;
};
export const glitchT = () => mk(GlitchC, {});

/** Flash blanco: corta en el punto más brillante. */
const FlashC: React.FC<TransitionPresentationComponentProps<{ color: string }>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const sale = presentationDirection === 'exiting';
  const vis = sale ? p < 0.5 : p >= 0.5;
  const o = 1 - Math.abs(p - 0.5) * 2;
  return (
    <AbsoluteFill style={{ opacity: vis ? 1 : 0 }}>
      {children}
      <AbsoluteFill style={{ background: passedProps.color, opacity: o }} />
    </AbsoluteFill>
  );
};
export const flashT = (color = '#fff') => mk(FlashC, { color });

/** La escena nueva entra girando en 3D, como una carta. */
const SpinC: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const sale = presentationDirection === 'exiting';
  const r = sale ? interpolate(p, [0, 1], [0, 90]) : interpolate(p, [0, 1], [-90, 0]);
  const vis = sale ? p < 0.5 : p >= 0.5;
  return <AbsoluteFill style={{ perspective: 1800 }}><AbsoluteFill style={{ transform: `rotateY(${r}deg) scale(${1 - Math.sin(p * Math.PI) * 0.25})`, opacity: vis ? 1 : 0 }}>{children}</AbsoluteFill></AbsoluteFill>;
};
export const spin = () => mk(SpinC, {});

/** Corte seco (sin transición visible). */
const CorteC: React.FC<TransitionPresentationComponentProps<P>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const sale = presentationDirection === 'exiting';
  return <AbsoluteFill style={{ opacity: (sale ? p < 0.5 : p >= 0.5) ? 1 : 0 }}>{children}</AbsoluteFill>;
};
export const corte = () => mk(CorteC, {});
