import React from 'react';
import { AbsoluteFill, Freeze, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { TransitionSeries, linearTiming, type TransitionPresentation } from '@remotion/transitions';
import { EscCtx, MudoCtx, TLCtx, type Timeline } from './contexto';
import { Subtitulos, type EstiloSubs } from './Subtitulos';
import { cargarFuentes } from './fuentes';
import { slide } from './transiciones';

export type ShortProps = { timeline: Timeline; guias?: boolean };

/** Arma un video: audio (voz + música), escenas con sus transiciones, subtítulos y el empalme del loop
 *  (los últimos cuadros se funden con el cuadro 0, sin subtítulos ni destellos). */
export const Short: React.FC<ShortProps & {
  escenas: React.FC[]; trans?: (TransitionPresentation<any> | undefined)[]; acento?: string; subtitulos?: boolean; empalme?: number; subs?: EstiloSubs;
}> = ({ timeline: tl, escenas, trans = [], acento, subtitulos = true, empalme = 8, guias, subs }) => {
  cargarFuentes();
  const f = useCurrentFrame();
  const Hook = escenas[0];
  return (
    <TLCtx.Provider value={tl}>
      <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
        <Html5Audio src={staticFile(`shorts/${tl.id}/audio.wav`)} />
        <TransitionSeries>
          {tl.escenas.flatMap((e, i) => {
            const C = escenas[i];
            const out = [
              <TransitionSeries.Sequence key={'s' + i} durationInFrames={e.dur} name={`${i + 1} ${e.beat}`}>
                <EscCtx.Provider value={e}><C /></EscCtx.Provider>
              </TransitionSeries.Sequence>,
            ];
            if (e.trans > 0 && i < tl.escenas.length - 1)
              out.push(<TransitionSeries.Transition key={'t' + i} presentation={trans[i] ?? slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: e.trans })} />);
            return out;
          })}
        </TransitionSeries>
        {subtitulos && <Subtitulos acento={acento} ocultarFinal={empalme} {...subs} />}
        <Sequence from={tl.total - empalme} name="empalme loop">
          <AbsoluteFill style={{ opacity: interpolate(f, [tl.total - empalme, tl.total - 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <MudoCtx.Provider value>
              <Freeze frame={0}>
                <EscCtx.Provider value={tl.escenas[0]}><Hook /></EscCtx.Provider>
              </Freeze>
            </MudoCtx.Provider>
          </AbsoluteFill>
        </Sequence>
        {guias && <Guias />}
      </AbsoluteFill>
    </TLCtx.Provider>
  );
};

/** Zonas seguras (solo para revisar): abajo de y=1450 y franja derecha los tapa la interfaz; 1180-1330 es de los subtítulos. */
export const Guias: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1450, bottom: 0, background: 'rgba(255,0,0,.28)' }} />
    <div style={{ position: 'absolute', right: 0, width: 120, top: 0, bottom: 0, background: 'rgba(255,0,0,.28)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1180, height: 150, border: '4px dashed rgba(0,255,255,.8)' }} />
  </AbsoluteFill>
);
