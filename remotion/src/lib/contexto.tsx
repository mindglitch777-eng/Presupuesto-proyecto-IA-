import React, { createContext, useContext } from 'react';

export type Palabra = { w: string; n: string; f: number; fin: number };
export type Escena = {
  i: number; beat: string; reward: string; say: string; onScreen: string;
  start: number; dur: number; trans: number; vozDesde: number; vozFin: number;
  pausa: [number, number] | null; words: Palabra[]; vozFile: string;
};
export type Timeline = { id: string; fps: number; total: number; motor: string; giro: number | null; silencio: [number, number] | null; escenas: Escena[] };

export const TLCtx = createContext<Timeline | null>(null);
export const EscCtx = createContext<Escena | null>(null);
export const MudoCtx = createContext(false); // true en la copia congelada del loop: sin efectos de sonido

export const useTL = () => useContext(TLCtx)!;
export const useEsc = () => useContext(EscCtx)!;
export const useMudo = () => useContext(MudoCtx);

export const norm = (w: string) => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9ñ]/g, '');

/** Cuadro (relativo a la escena) en que la voz dice una palabra. Busca por prefijo; si no la encuentra
 *  (voz estimada, número leído en letras…), la ubica según su posición en el texto. */
export function cuadroDe(e: Escena, palabra: string, nth = 0): number {
  const p = norm(palabra);
  let k = 0;
  for (const w of e.words) {
    if (w.n === p || (p.length >= 3 && w.n.startsWith(p))) {
      if (k === nth) return w.f;
      k++;
    }
  }
  const ws = e.say.split(/\s+/).map(norm);
  let idx = -1;
  k = 0;
  ws.forEach((w, i) => { if (idx < 0 && (w === p || (p.length >= 3 && w.startsWith(p)))) { if (k === nth) idx = i; k++; } });
  const r = idx < 0 ? 0.5 : idx / Math.max(1, ws.length);
  return Math.round(e.vozDesde + r * (e.vozFin - e.vozDesde));
}

/** Hook: w('peor') → cuadro de la palabra. */
export const useW = () => {
  const e = useEsc();
  return (palabra: string, nth = 0) => cuadroDe(e, palabra, nth);
};

export const Escenario: React.FC<{ e: Escena; children: React.ReactNode }> = ({ e, children }) => (
  <EscCtx.Provider value={e}>{children}</EscCtx.Provider>
);
