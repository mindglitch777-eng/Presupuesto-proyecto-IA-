// 06 · "Juan desapareció hace 63 días" — tablero de detective con hilos rojos; en el giro los hilos apuntan a un espejo.
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { useEsc, useW } from '../lib/contexto';
import { Placa, type TemaPlaca } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Contador, Rayos, Txt, Emoji, Silueta, Grano, Vineta, cl, COL, ent } from '../lib/fx';
import { Celular, PNoVolvieron, PChat } from '../lib/Celular';
import { Split } from '../lib/Split';
import { Cierre } from '../lib/Cierre';
import { FUENTE, EMOJI } from '../lib/fuentes';
import { cargarConfig } from '../lib/config';
import { slide, wipe, flip, zoomBlur, iris, pushCut, whip, flashT } from '../lib/transiciones';

const K = cargarConfig();
const ROJO = '#E3262E', OCRE = '#E8C07D', VERDE = '#25D366';
const T: TemaPlaca = { bg: '#F5ECD7', borde: '#1a1208', color: '#1a1208', acento: ROJO, sombra: 'rgba(0,0,0,.5)' };

const Corcho: React.FC<{ luz?: [number, number] }> = ({ luz = [540, 800] }) => (
  <AbsoluteFill style={{ background: '#9B6B3D' }}>
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.5, mixBlendMode: 'multiply' }}>
      <filter id="corcho"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves={3} seed={9} /><feColorMatrix type="matrix" values="0 0 0 0 .35  0 0 0 0 .2  0 0 0 0 .08  0 0 0 1.4 -.3" /></filter>
      <rect width={1080} height={1920} filter="url(#corcho)" />
    </svg>
    <AbsoluteFill style={{ background: `radial-gradient(circle 700px at ${luz[0]}px ${luz[1]}px, rgba(255,230,170,.35), rgba(0,0,0,.75) 80%)` }} />
  </AbsoluteFill>
);

/** Cartel de "BUSCADO" con foto y chinche. */
const Buscado: React.FC<{ x: number; y: number; nombre: string; at?: number; s?: number; rot?: number; sello?: number; color?: string }> = ({ x, y, nombre, at = 0, s = 1, rot = -3, sello, color = '#4a6fa5' }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cae = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 200 } });
  if (f < at - 6) return null;
  const ss = sello !== undefined ? spring({ frame: f - sello, fps, config: { damping: 9, stiffness: 300 } }) : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translateY(${(1 - cae) * -300}px) rotate(${rot + (1 - cae) * 20}deg) scale(${s})`, filter: 'drop-shadow(10px 14px 0 rgba(0,0,0,.45))' }}>
      <div style={{ width: 300, height: 400, background: '#F5ECD7', padding: 18, fontFamily: FUENTE, textAlign: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 48, color: '#1a1208', letterSpacing: 2 }}>BUSCADO</div>
        <div style={{ width: 264, height: 220, background: color, margin: '8px 0', position: 'relative', overflow: 'hidden' }}>
          <svg width={264} height={220}><circle cx={132} cy={90} r={50} fill="#F2C9A0" /><path d="M82 70 Q132 10 182 70 L182 60 Q132 20 82 60 Z" fill="#3a2414" /><path d="M40 220 Q50 150 132 150 Q214 150 224 220 Z" fill="#1a1208" /></svg>
        </div>
        <div style={{ fontWeight: 900, fontSize: 46, color: ROJO }}>{nombre}</div>
      </div>
      <div style={{ position: 'absolute', left: 140, top: -14, width: 28, height: 28, borderRadius: '50%', background: ROJO, boxShadow: '0 4px 0 #700' }} />
      {sello !== undefined && f >= sello && <div style={{ position: 'absolute', left: 150, top: 200, transform: `translate(-50%,-50%) rotate(-18deg) scale(${3 - 2 * ss})`, opacity: Math.min(1, ss * 2), border: `10px solid ${VERDE}`, color: VERDE, fontFamily: FUENTE, fontWeight: 900, fontSize: 50, padding: '4px 14px', background: 'rgba(255,255,255,.85)', whiteSpace: 'nowrap' }}>ENCONTRADO</div>}
    </div>
  );
};

const Hilo: React.FC<{ x1: number; y1: number; x2: number; y2: number; at: number; dura?: number; vibra?: number }> = ({ x1, y1, x2, y2, at, dura = 10, vibra = 0 }) => {
  const f = useCurrentFrame();
  const u = ent(f, at, at + dura);
  if (u <= 0) return null;
  const mx = (x1 + x2) / 2 + Math.sin(f * 1.3) * vibra, my = (y1 + y2) / 2 + 30 + Math.cos(f * 1.1) * vibra;
  const ex = x1 + (x2 - x1) * u, ey = y1 + (y2 - y1) * u;
  return <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><path d={`M${x1},${y1} Q${mx},${my} ${ex},${ey}`} stroke={ROJO} strokeWidth={7} fill="none" style={{ filter: 'drop-shadow(0 4px 2px rgba(0,0,0,.5))' }} /></svg>;
};

// 1. Gancho
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const dias = Math.round(interpolate(f, [4, w('dias')], [0, 63], cl));
  return (
    <AbsoluteFill>
      <Cam golpes={[6, w('donde')]} fuerza={20} zoom={interpolate(f, [0, 100], [1.05, 1.2])}>
        <Corcho luz={[540, 900]} />
        <Buscado x={540} y={940} nombre="JUAN" at={-2} s={1.5} />
        <div style={{ position: 'absolute', left: 540, top: 1310, transform: 'translate(-50%,-50%)', background: '#1a1208', color: OCRE, fontFamily: FUENTE, fontWeight: 900, fontSize: 64, padding: '8px 28px', border: `4px solid ${OCRE}` }}>{dias} DÍAS</div>
      </Cam>
      <Placa y={360} tema={T} />
      <Vineta o={0.6} /><Grano o={0.12} />
      <Sfx s="pin" at={6} v={0.8} /><Sfx s="typewriter" at={w('sesenta')} v={0.5} /><Sfx s="hit" at={w('donde')} v={0.6} />
    </AbsoluteFill>
  );
};

// 2. Expediente: venía cada 15 días (y se corta)
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const dias = Math.floor(interpolate(f, [0, 80], [0, 70], cl));
  return (
    <AbsoluteFill>
      <Corcho />
      <div style={{ position: 'absolute', left: 90, top: 580, width: 900, height: 820, background: OCRE, borderRadius: 10, boxShadow: '14px 14px 0 rgba(0,0,0,.4)', padding: 40 }}>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 44, color: '#1a1208' }}>EXPEDIENTE · JUAN · DEGRADÉ BAJO</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10, marginTop: 30 }}>
          {Array.from({ length: 70 }, (_, i) => {
            const on = i < dias;
            const marca = on && [0, 15, 30].includes(i);
            return <div key={i} style={{ height: 64, borderRadius: 8, background: !on ? 'rgba(0,0,0,.08)' : marca ? VERDE : i > 30 ? '#b9a27a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontFamily: EMOJI }}>{marca ? '✂️' : ''}</div>;
          })}
        </div>
      </div>
      <Placa y={380} tema={T} />
      {[0, 15, 30].map((d) => <Sfx key={d} s="snip" at={Math.round((d / 70) * 80)} v={0.6} />)}
      <Sfx s="paper" at={0} v={0.5} />
    </AbsoluteFill>
  );
};

// 3. Bolsitas de evidencia vacías
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const ts = [w('quejo'), w('resena'), w('emoji')];
  const items = [['QUEJA', '—'], ['RESEÑA', '—'], ['EMOJI', '😢']];
  return (
    <AbsoluteFill>
      <Corcho />
      {items.map(([n, v], i) => {
        if (f < ts[i]) return null;
        const desinfla = i === 2 ? interpolate(f, [w('nada'), w('nada') + 10], [1, 0.2], cl) : 1;
        return (
          <div key={n} style={{ position: 'absolute', left: 180 + i * 360 - 90, top: 760 + (i % 2) * 140, width: 280, height: 380, background: 'rgba(230,240,255,.55)', border: '4px solid rgba(255,255,255,.9)', borderRadius: 12, transform: `rotate(${(i - 1) * 6}deg)`, boxShadow: '8px 10px 0 rgba(0,0,0,.35)' }}>
            <div style={{ background: ROJO, color: '#fff', fontFamily: FUENTE, fontWeight: 900, fontSize: 30, padding: 8, textAlign: 'center' }}>EVIDENCIA</div>
            <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 40, textAlign: 'center', marginTop: 20, color: '#1a1208' }}>{n}</div>
            <div style={{ fontSize: 120, textAlign: 'center', fontFamily: EMOJI, transform: `scale(${desinfla})`, color: '#1a1208', fontWeight: 900 }}>{v}</div>
          </div>
        );
      })}
      <Placa y={380} tema={T} />
      {ts.map((t, i) => <Sfx key={i} s="flash" at={t} v={0.5} />)}
      <Sfx s="sad_horn" at={w('nada')} v={0.3} />
    </AbsoluteFill>
  );
};

// 4. 24 tijeritas clavadas: $240.000
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const monto = w('cortes') + 6;
  return (
    <AbsoluteFill>
      <Corcho />
      {Array.from({ length: 24 }, (_, i) => {
        const at = 4 + i * 1.6;
        if (f < at) return null;
        return <div key={i} style={{ position: 'absolute', left: 170 + (i % 6) * 150, top: 620 + Math.floor(i / 6) * 120, fontSize: 80, fontFamily: EMOJI, transform: `translate(-50%,-50%) scale(${interpolate(f - at, [0, 3, 6], [1.8, 0.9, 1], cl)}) rotate(${(random('t' + i) - 0.5) * 40}deg)` }}>✂️</div>;
      })}
      <Contador desde={0} hasta={-K.corte * 24} at={monto} dura={14} y={1150} size={170} color={ROJO} sub="POR AÑO · UN SOLO CLIENTE" />
      <Placa y={380} tema={T} />
      <Rafaga s="pin" at={4} n={24} cada={1.6} v={0.25} /><Sfx s="hit" at={monto + 14} v={0.6} />
    </AbsoluteFill>
  );
};

// 5. No hay un Juan: hay cinco
const POS = [[540, 900], [240, 760], [840, 760], [240, 1160], [840, 1160]];
const NOMBRES = ['JUAN', 'LUCAS', 'NICO', 'FEDE', 'TOMI'];
const COLS = ['#4a6fa5', '#7a4aa5', '#4aa57a', '#a5714a', '#a54a5c'];
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const cinco = w('cinco');
  return (
    <AbsoluteFill>
      <Cam golpes={[cinco]} fuerza={24} zoom={interpolate(f, [0, 100], [1.25, 0.95], cl)}>
        <Corcho />
        {POS.slice(1).map(([x, y], i) => <Hilo key={i} x1={540} y1={760} x2={x} y2={y - 190} at={cinco + 6 + i * 3} />)}
        {POS.map(([x, y], i) => <Buscado key={i} x={x} y={y} nombre={NOMBRES[i]} at={i === 0 ? -10 : cinco + i * 3 - 3} s={i === 0 ? 0.95 : 0.8} rot={(i % 2 ? 4 : -4)} color={COLS[i]} />)}
      </Cam>
      <Placa y={330} tema={T} />
      {[1, 2, 3, 4].map((i) => <Sfx key={i} s="pin" at={cinco + i * 3} v={0.6} />)}
      <Sfx s="tension" at={cinco + 6} v={0.4} />
    </AbsoluteFill>
  );
};

// 6. $1.200.000 y el hilo apunta a la barbería de enfrente (engaño)
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const w = useW();
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  const enf = w('enfrente');
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }} />;
  return (
    <AbsoluteFill>
      <Corcho />
      <div style={{ position: 'absolute', left: 620, top: 1020, width: 340, height: 250, background: '#222', border: '14px solid #F5ECD7', transform: 'rotate(5deg)', boxShadow: '10px 10px 0 rgba(0,0,0,.4)' }}>
        <div style={{ margin: 20, background: '#c33', color: '#fff', fontFamily: FUENTE, fontWeight: 900, fontSize: 34, textAlign: 'center', padding: 8 }}>BARBERÍA DE ENFRENTE</div>
        <div style={{ fontSize: 90, textAlign: 'center', fontFamily: EMOJI }}>💈</div>
      </div>
      <Hilo x1={300} y1={700} x2={780} y2={1040} at={enf - 4} dura={6} vibra={8} />
      <Contador desde={-K.corte * 24} hasta={-K.corte * 120} at={2} dura={Math.max(10, w('ano') - 2)} y={780} size={160} color={ROJO} />
      <Placa y={380} tema={T} />
      <Rafaga s="tick" at={2} n={8} cada={2} v={0.3} /><Sfx s="boom" at={w('ano')} v={0.8} /><Sfx s="whoosh" at={enf - 4} v={0.5} />
    </AbsoluteFill>
  );
};

// 7. GIRO: los hilos se sueltan y apuntan al espejo; del otro lado, vos con el celu sin escribir
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const gira = interpolate(f, [8, 40], [0, 180], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const escribio = w('escribio');
  const espejo = gira > 90;
  return (
    <AbsoluteFill style={{ background: '#050302' }}>
      <AbsoluteFill style={{ perspective: 1600 }}>
        <AbsoluteFill style={{ transform: `rotateY(${gira}deg)`, transformStyle: 'preserve-3d' }}>
          <AbsoluteFill style={{ backfaceVisibility: 'hidden' }}>
            <Corcho />
            {POS.map(([x, y], i) => <Buscado key={i} x={x} y={y} nombre={NOMBRES[i]} at={-20} s={0.8} rot={i % 2 ? 4 : -4} color={COLS[i]} />)}
          </AbsoluteFill>
          <AbsoluteFill style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'radial-gradient(circle at 50% 45%, #2a1a0c, #000 70%)' }}>
            <div style={{ position: 'absolute', left: 190, top: 560, width: 700, height: 900, borderRadius: 350, background: 'linear-gradient(135deg,#cfd8dc,#7a8a92 50%,#dfe7ea)', border: '24px solid #8a6a2a', overflow: 'hidden', boxShadow: '0 0 80px rgba(255,200,120,.4)' }}>
              <Silueta x={350} y={940} s={1.9} color="#1b1b1b" />
              <div style={{ position: 'absolute', left: 380, top: 560, width: 110, height: 190, background: '#111', border: '6px solid #444', borderRadius: 18, transform: 'rotate(-12deg)' }}><div style={{ margin: 8, height: 160, background: '#9cf', opacity: 0.6, borderRadius: 10 }} /></div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* los hilos, vivos, convergen al espejo */}
      {espejo && POS.map(([x, y], i) => <Hilo key={i} x1={[60, 1020, 60, 1020, 540][i]} y1={[500, 500, 1500, 1500, 1700][i]} x2={540} y2={1000} at={42 + i * 2} dura={8} vibra={10} />)}
      {/* la lámpara te apunta */}
      <AbsoluteFill style={{ background: `radial-gradient(circle ${interpolate(f, [escribio - 6, escribio + 4], [200, 900], cl)}px at 540px 1000px, rgba(255,240,200,.35), transparent 70%)`, opacity: espejo ? 1 : 0 }} />
      <Placa y={330} tema={{ ...T, bg: '#fff' }} max={150} />
      <Flash at={40} color="#ffe9b0" max={0.7} />
      <Sfx s="braam" at={0} v={0.9} /><Sfx s="whoosh" at={10} v={0.6} /><Sfx s="tension" at={42} v={0.5} /><Sfx s="choir" at={44} v={0.4} /><Sfx s="hit" at={escribio} v={0.6} />
    </AbsoluteFill>
  );
};

// 8. La lista: Juan 63 días, Lucas 41… y un botón
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const g = spring({ frame: f, fps, config: { damping: 13 } });
  const ts = [w('juan'), w('lucas'), w('lucas') + 10];
  return (
    <AbsoluteFill>
      <Corcho luz={[540, 1000]} />
      <Celular y={interpolate(g, [0, 1], [2200, 1000])} s={1.1} rotY={-6}>
        <PNoVolvieron filas={[{ n: 'Juan', d: 63, at: ts[0] }, { n: 'Lucas', d: 41, at: ts[1] }, { n: 'Nico', d: 35, at: ts[2] }]} toque={w('boton') + 6} />
      </Celular>
      <Placa y={300} tema={T} />
      <Sfx s="whoosh" at={0} v={0.5} />{ts.map((t, i) => <Sfx key={i} s="pop" at={t} v={0.5} />)}<Sfx s="pop" at={w('boton') + 6} v={0.6} />
    </AbsoluteFill>
  );
};

// 9. Un toque: el mensaje sale y el cartel pasa a ENCONTRADO
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const envia = w('turno') + 4;
  const sello = w('mensaje');
  const fase2 = w('recuerdo') - 4;
  return (
    <AbsoluteFill>
      <Corcho luz={[540, 1000]} />
      {f < fase2 ? (
        <Celular y={1000} s={1.1} rotY={6}>
          <PChat nombre="Juan" msgs={[{ t: '¿Juan, te guardo un turno el jueves? 💈', yo: true, at: envia }]} />
        </Celular>
      ) : (
        <Split at={fase2} gana={sello} tIzq="SIN LISTA" tDer="CON LISTA" colIzq={ROJO} colDer={VERDE} fondoIzq="#3a2a1a" fondoDer="#0d2a16"
          izq={<AbsoluteFill style={{ filter: 'sepia(1)' }}><Buscado x={540} y={1000} nombre="JUAN" at={-20} s={1.1} /></AbsoluteFill>}
          der={<AbsoluteFill><Buscado x={540} y={1000} nombre="JUAN" at={-20} s={1.1} sello={sello} /></AbsoluteFill>} />
      )}
      <Placa y={300} tema={T} hasta={fase2 - 2} />
      <Sfx s="whoosh" at={envia} v={0.5} /><Sfx s="ding" at={envia + 2} v={0.5} /><Sfx s="zap" at={fase2} v={0.5} /><Sfx s="stamp" at={sello} v={0.8} /><Sfx s="pluck" at={sello + 4} v={0.5} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => <Cierre color={VERDE} fondo={<Corcho />} confeti={[VERDE, ROJO, OCRE]} sub="¿cuántos Juanes tenés? 👇" />;

export const V06: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={OCRE} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]}
    trans={[flip({ direction: 'from-right' }), flashT('#fff'), zoomBlur(), pushCut(), whip(1), undefined, slide({ direction: 'from-bottom' }), zoomBlur(), iris({ width: 1080, height: 1920 })]} />
);
