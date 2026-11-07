import React from 'react';
import { Html5Audio, Sequence, staticFile } from 'remotion';
import { useMudo } from './contexto';

export type SonidoId =
  | 'applause' | 'bit_coin' | 'bit_over' | 'bit_power' | 'bit_select' | 'boing' | 'boom' | 'braam' | 'buzzer' | 'cash' | 'check'
  | 'chime' | 'choir' | 'clang' | 'clock' | 'coin' | 'cricket' | 'crowd' | 'ding' | 'door' | 'drawer' | 'error' | 'fanfare'
  | 'firework' | 'flash' | 'glass' | 'glitch' | 'heartbeat' | 'hit' | 'ice' | 'laugh' | 'neon' | 'paper' | 'pin' | 'pluck' | 'pop'
  | 'rewind' | 'riser' | 'rumble' | 'sad_horn' | 'snip' | 'splash' | 'squish' | 'stamp' | 'swish' | 'tape_stop' | 'tension'
  | 'thud' | 'tick' | 'typewriter' | 'vibrate' | 'whoosh' | 'whoosh_rev' | 'wind' | 'zap';

/** Efecto de sonido en el cuadro `at` de la escena. */
export const Sfx: React.FC<{ s: SonidoId; at: number; v?: number }> = ({ s, at, v = 0.6 }) => {
  if (useMudo()) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} layout="none" name={`sfx ${s}`}>
      <Html5Audio src={staticFile(`sfx/${s}.wav`)} volume={v} />
    </Sequence>
  );
};

/** Varios efectos iguales seguidos: rafaga('tick', 10, 12, 3) = 12 tics desde el cuadro 10, cada 3 cuadros. */
export const Rafaga: React.FC<{ s: SonidoId; at: number; n: number; cada: number; v?: number }> = ({ s, at, n, cada, v = 0.4 }) => (
  <>{Array.from({ length: n }, (_, k) => <Sfx key={k} s={s} at={at + k * cada} v={v} />)}</>
);
