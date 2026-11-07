import React, { useMemo } from 'react';
import { createTikTokStyleCaptions, type Caption } from '@remotion/captions';
import { interpolate, useCurrentFrame } from 'remotion';
import { norm, useTL } from './contexto';
import { FUENTE } from './fuentes';

/** Subtítulos estilo TikTok (bloques de ~3 palabras, la que suena resaltada) en la franja y=1180-1330.
 *  Se ocultan cuando el 60 % de sus palabras ya está escrito en pantalla, y en los últimos cuadros (empalme del loop). */
export const Subtitulos: React.FC<{ acento?: string; ocultarFinal?: number }> = ({ acento = '#FFD60A', ocultarFinal = 8 }) => {
  const tl = useTL();
  const f = useCurrentFrame();
  const fps = tl.fps;
  const { pages, escenaDe } = useMemo(() => {
    const caps: Caption[] = [];
    for (const e of tl.escenas) for (const w of e.words) {
      const a = ((e.start + w.f) / fps) * 1000;
      caps.push({ text: ' ' + w.w, startMs: a, endMs: Math.max(a + 80, ((e.start + w.fin) / fps) * 1000), timestampMs: a, confidence: 1 });
    }
    const { pages } = createTikTokStyleCaptions({ captions: caps, combineTokensWithinMilliseconds: 750 });
    const escenaDe = (ms: number) => [...tl.escenas].reverse().find((e) => (e.start / fps) * 1000 <= ms + 1) ?? tl.escenas[0];
    return { pages, escenaDe };
  }, [tl, fps]);
  if (f > tl.total - ocultarFinal) return null;
  const ms = (f / fps) * 1000;
  const page = pages.find((p, i) => ms >= p.startMs && ms < Math.min(p.startMs + p.durationMs + 250, pages[i + 1]?.startMs ?? Infinity));
  if (!page) return null;
  const e = escenaDe(page.startMs);
  const enPantalla = new Set(e.onScreen.split(/\s+/).map(norm).filter(Boolean));
  const ws = page.tokens.map((t) => norm(t.text)).filter(Boolean);
  if (ws.length && ws.filter((w) => enPantalla.has(w)).length / ws.length >= 0.6) return null;
  const local = ms - page.startMs;
  const entra = interpolate(local, [0, 90], [0.85, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 60, width: 840, top: 1180, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', transform: `scale(${entra})` }}>
      {page.tokens.map((t, i) => {
        const activo = ms >= t.fromMs && ms < t.toMs + 60;
        return (
          <span key={i} style={{
            fontFamily: FUENTE, fontWeight: 900, fontSize: 64, lineHeight: 1.05, margin: '0 10px', textTransform: 'uppercase',
            color: activo ? acento : '#fff', WebkitTextStroke: '12px #000', paintOrder: 'stroke', display: 'inline-block',
            transform: `scale(${activo ? 1.12 : 1}) rotate(${activo ? -2 : 0}deg)`, textShadow: '0 6px 0 #000',
          }}>{t.text.trim()}</span>
        );
      })}
    </div>
  );
};
