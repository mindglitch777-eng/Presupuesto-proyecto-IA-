// 02 · "8 cortes, 47 mensajes" — chat que se vuelve loco (hyperpop + glitch). Giro: el video se delata.
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { useEsc, useW } from '../lib/contexto';
import { Placa, type TemaPlaca } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Rayos, Onda, Txt, Emoji, Silueta, Fondo, Glitch, Vineta, cl, COL, ent } from '../lib/fx';
import { Celular, PReserva } from '../lib/Celular';
import { Split } from '../lib/Split';
import { Cierre } from '../lib/Cierre';
import { Lienzo3D, Tijera, Cartel } from '../lib/tres';
import { FUENTE, EMOJI } from '../lib/fuentes';
import { glitchT, whipV, zoomBlur, flashT, slide, wipe, spin, iris } from '../lib/transiciones';

const NEON = '#39FF14';
const T: TemaPlaca = { bg: 'rgba(5,5,10,.9)', borde: NEON, color: '#fff', acento: NEON, sombra: 'rgba(57,255,20,.4)' };
const PREG = ['¿Tenés turno?', '¿A qué hora?', '¿Y mañana?', '¿Y pasado?', '¿Cuánto sale?', '¿Hay lugar hoy?', '¿Estás?', '¿Me guardás uno?', '¿Y a las 6?', 'Holaaa', '¿Abrís el lunes?', '???'];

/** Notificación falsa arriba de todo (las que el video "confiesa" en el giro). */
const Notif: React.FC<{ at: number; texto: string; marca?: boolean; fija?: boolean }> = ({ at, texto, marca, fija }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (!fija && (t < 0 || t > 50)) return null;
  const y = fija ? 0 : interpolate(t, [0, 6, 40, 50], [-200, 40, 40, -200], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: 'absolute', left: 60, top: y, width: 840, background: 'rgba(245,245,250,.96)', borderRadius: 34, padding: '22px 28px', display: 'flex', gap: 20, alignItems: 'center', boxShadow: '0 20px 50px rgba(0,0,0,.5)', outline: marca ? `10px solid ${COL.rojo}` : undefined }}>
      <div style={{ width: 70, height: 70, borderRadius: 18, background: '#1FAF5A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontFamily: EMOJI }}>💬</div>
      <div style={{ fontFamily: FUENTE }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: '#666' }}>MENSAJES · ahora</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#111' }}>{texto}</div>
      </div>
    </div>
  );
};

/** Globo de chat 2D. */
const Globo: React.FC<{ texto: string; x: number; y: number; rot?: number; s?: number; verde?: boolean; o?: number }> = ({ texto, x, y, rot = 0, s = 1, verde, o = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, background: verde ? '#DCF8C6' : '#fff', color: '#111', fontFamily: FUENTE, fontWeight: 800, fontSize: 46, padding: '18px 30px', borderRadius: 30, whiteSpace: 'nowrap', boxShadow: '0 10px 0 rgba(0,0,0,.35)', border: '4px solid #111', opacity: o }}>{texto}</div>
);

/** Lluvia de globos que caen y se apilan. */
const Lluvia: React.FC<{ n: number; cada?: number; desde?: number; piso?: number; seed?: string }> = ({ n, cada = 4, desde = 0, piso = 1450, seed = 'll' }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const t = f - desde - i * cada;
        if (t < 0) return null;
        const x = 160 + random(seed + i) * 700;
        const destino = piso - (i % 9) * 70 - Math.floor(i / 9) * 30;
        const y = Math.min(destino, -100 + 0.9 * t * t + 20 * t);
        const rot = (random(seed + 'r' + i) - 0.5) * 30;
        return <Globo key={i} texto={PREG[i % PREG.length]} x={x} y={y} rot={rot} s={0.9} />;
      })}
    </>
  );
};

const FondoPop: React.FC = () => <Fondo colores={[COL.magenta, NEON, '#00E5FF', COL.violeta]} base="#0a0014" vel={0.02} />;

// 1. Gancho
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const sec = w('secretario');
  const n47 = w('cuarenta');
  return (
    <AbsoluteFill>
      <FondoPop />
      <Cam golpes={[n47, sec]} fuerza={30}>
        <Lienzo3D cam={[0, 0, 9]} mira={[0, 0, 0]} fov={50}>
          <ambientLight intensity={0.8} /><directionalLight position={[2, 4, 6]} intensity={2.5} />
          {Array.from({ length: 16 }, (_, i) => {
            const t = (f + 40 - i * 5) / 30;
            const y = 7 - t * t * 4.5;
            return <Cartel key={i} texto={PREG[i % PREG.length]} w={2.6} h={0.8} size={62} bg={i % 3 ? '#fff' : '#DCF8C6'} color="#111" position={[(random('x' + i) - 0.5) * 6, Math.max(-6 + (i % 5) * 0.8, y), (random('z' + i) - 0.5) * 3]} rotation={[0.3 * Math.sin(t + i), 0.5 * Math.cos(t * 2 + i), (random('r' + i) - 0.5) * 0.8]} grosor={0.25} />;
          })}
        </Lienzo3D>
      </Cam>
      {f >= sec && <Emoji e="👔" x={540} y={1000} size={360} at={sec} />}
      <Placa y={360} tema={T} />
      <Glitch activo={f % 23 < 2} fuerza={0.6}><AbsoluteFill /></Glitch>
      <Sfx s="vibrate" at={0} v={0.6} /><Sfx s="hit" at={n47} v={0.7} /><Sfx s="ding" at={sec} v={0.6} /><Sfx s="boing" at={sec} v={0.4} />
    </AbsoluteFill>
  );
};

// 2. Preguntas que caen
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const corte = [0, 18, 36, 54];
  return (
    <AbsoluteFill>
      <FondoPop />
      <Cam golpes={corte} fuerza={14} rot={Math.sin(f / 9) * 2}>
        <Lluvia n={22} cada={3} />
        <div style={{ position: 'absolute', left: 540, top: 1350, transform: 'translate(-50%,-50%) rotate(-30deg)', fontSize: 200, fontFamily: EMOJI }}>✂️</div>
      </Cam>
      <Notif at={30} texto="¿Hay lugar hoy?" />
      <Placa y={420} tema={T} max={150} />
      {corte.map((c, i) => <Sfx key={i} s="ding" at={c + 2} v={0.35 + i * 0.05} />)}
      <Sfx s="paper" at={e.dur - 20} v={0.4} />
    </AbsoluteFill>
  );
};

// 3. Mano con gel: el celu se escapa
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const cae = w('escapa');
  const t = Math.max(0, f - cae);
  return (
    <AbsoluteFill>
      <FondoPop />
      <Cam golpes={[cae + 18]} fuerza={30}>
        <Celular x={540 + t * 4} y={980 + t * t * 0.9} rotZ={t * 9} rotY={t * 6} s={0.9}>
          <AbsoluteFill style={{ background: '#ECE5DD' }}><Globo texto="¿Tenés turno?" x={200} y={300} s={0.8} /><Globo texto="¿A qué hora?" x={240} y={420} s={0.8} /></AbsoluteFill>
        </Celular>
        <div style={{ position: 'absolute', left: 420, top: 1010, fontSize: 330, fontFamily: EMOJI, transform: `rotate(${-20 + Math.sin(f / 5) * 6}deg)` }}>🤚</div>
        {Array.from({ length: 7 }, (_, i) => {
          const y = 1000 + ((f * 6 + i * 70) % 400);
          return <div key={i} style={{ position: 'absolute', left: 470 + i * 28, top: y, width: 26, height: 40, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'rgba(120,230,255,.85)', border: '3px solid #fff' }} />;
        })}
      </Cam>
      <Notif at={8} texto="¿Cuánto sale?" />
      <Placa y={420} tema={T} />
      <Sfx s="squish" at={6} v={0.6} /><Sfx s="whoosh" at={cae} v={0.6} /><Sfx s="thud" at={cae + 18} v={0.7} /><Sfx s="ding" at={10} v={0.4} />
    </AbsoluteFill>
  );
};

// 4. Reloj de arena de globos: 60 horas
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const sesenta = w('sesenta');
  const h = Math.round(interpolate(f, [4, sesenta + 6], [0, 60], cl));
  const lleno = interpolate(f, [0, sesenta + 6], [0.1, 1], cl);
  const rompe = w('contestando') + 6;
  return (
    <AbsoluteFill>
      <FondoPop />
      <Cam golpes={[sesenta + 6, rompe]} fuerza={26} rot={f > w('contestando') ? 8 : 0}>
        <svg width={700} height={900} viewBox="0 0 700 900" style={{ position: 'absolute', left: 190, top: 560 }}>
          <defs><clipPath id="abajo"><path d="M350 450 L80 820 L620 820 Z" /></clipPath><clipPath id="arriba"><path d="M80 80 L620 80 L350 450 Z" /></clipPath></defs>
          <path d="M60 60 L640 60 L370 450 L640 840 L60 840 L330 450 Z" fill="rgba(255,255,255,.08)" stroke="#fff" strokeWidth={14} strokeLinejoin="round" />
          <g clipPath="url(#arriba)">{Array.from({ length: 30 }, (_, i) => <rect key={i} x={80 + (i % 6) * 90} y={80 + Math.floor(i / 6) * 70 + lleno * 380} width={80} height={54} rx={20} fill={i % 2 ? '#fff' : '#DCF8C6'} stroke="#111" strokeWidth={4} />)}</g>
          <g clipPath="url(#abajo)">{Array.from({ length: 30 }, (_, i) => <rect key={i} x={80 + (i % 6) * 90} y={820 - 60 - Math.floor(i / 6) * 70} width={80} height={54} rx={20} fill={i % 2 ? '#fff' : '#DCF8C6'} stroke="#111" strokeWidth={4} opacity={i / 30 < lleno ? 1 : 0} />)}</g>
          <rect x={20} y={20} width={660} height={40} rx={12} fill="#FF2BD6" /><rect x={20} y={840} width={660} height={40} rx={12} fill="#FF2BD6" />
        </svg>
        <Txt x={540} y={1010} size={150} color={NEON} at={4}>{h} h</Txt>
      </Cam>
      {f > rompe && <Particulas at={rompe} x={540} y={1000} n={50} colores={['#fff', '#DCF8C6', NEON]} seed="arena" />}
      <Placa y={380} tema={T} />
      <Rafaga s="tick" at={4} n={Math.max(4, Math.floor(sesenta / 2))} cada={2} v={0.35} /><Sfx s="hit" at={sesenta + 6} v={0.6} /><Sfx s="glass" at={rompe} v={0.5} />
    </AbsoluteFill>
  );
};

// 5. El de la silla te mira por el espejo, con media cabeza
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const media = w('media');
  const raja = w('hecha') + 4;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(#20063a,#06010d)' }} />
      <Cam zoom={interpolate(f, [0, 120], [1, 1.25])} origen="50% 48%">
        <div style={{ position: 'absolute', left: 180, top: 560, width: 720, height: 820, borderRadius: 360, background: 'radial-gradient(circle at 40% 30%, #9fd8ff, #3a6c9a 70%)', border: '26px solid #d4af37', overflow: 'hidden', boxShadow: '0 0 80px rgba(255,201,60,.4)' }}>
          {/* cara con media cabeza rapada */}
          <svg width={720} height={820} viewBox="0 0 720 820">
            <ellipse cx={360} cy={420} rx={190} ry={230} fill="#e2a77f" />
            <path d="M170 380 Q180 170 360 160 L360 330 Q260 300 190 400 Z" fill="#2b1a0f" />
            <path d="M360 160 Q540 170 550 380 Q500 310 360 330 Z" fill="#b8805f" opacity={0.6} />
            <ellipse cx={290} cy={420} rx={24} ry={16} fill="#111" /><ellipse cx={430} cy={420} rx={24} ry={16} fill="#111" />
            <path d={`M250 ${370 - (f > media ? 18 : 0)} L330 380`} stroke="#2b1a0f" strokeWidth={14} strokeLinecap="round" />
            <path d="M390 380 L470 370" stroke="#2b1a0f" strokeWidth={14} strokeLinecap="round" />
            <path d="M310 540 L410 540" stroke="#7a3b2a" strokeWidth={12} strokeLinecap="round" />
            <path d="M120 820 Q140 640 360 640 Q580 640 600 820 Z" fill="#fff" />
          </svg>
          {f > raja && <svg width={720} height={820} style={{ position: 'absolute', inset: 0 }}><path d="M500 0 L440 220 L520 380 L430 600 L480 820" stroke="#fff" strokeWidth={6} fill="none" /></svg>}
        </div>
      </Cam>
      <Globo texto="¿Mañana a las 5?" x={540} y={1000} s={1.1} rot={-6} o={interpolate(f, [10, 16], [0, 1], cl)} />
      <Notif at={4} texto="¿Estás?" />
      <Placa y={400} tema={T} />
      <Sfx s="ding" at={6} v={0.4} /><Sfx s="tick" at={media} v={0.5} /><Sfx s="glass" at={raja} v={0.5} />
    </AbsoluteFill>
  );
};

// 6. Ya reservó en otra (y se congela)
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const w = useW();
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  const rompe = w('reservo');
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }}><div style={{ position: 'absolute', left: 60, top: 60, color: '#fff', fontFamily: FUENTE, fontSize: 60, fontWeight: 900 }}>❚❚</div></AbsoluteFill>;
  return (
    <AbsoluteFill>
      <FondoPop />
      <Cam x={interpolate(f, [rompe, rompe + 10], [0, -260], { ...cl, easing: Easing.out(Easing.cubic) })}>
        {f < rompe + 2 ? <Globo texto="ya fue, gracias" x={540} y={980} s={1.5} /> : <Particulas at={rompe + 2} x={540} y={980} n={40} colores={['#fff', '#ddd']} seed="rompe" forma="rect" tam={30} />}
        <div style={{ position: 'absolute', left: 860, top: 700, width: 520, height: 640, background: '#14142a', border: '20px solid #ddd', borderRadius: 10 }}>
          <div style={{ margin: 30, background: '#FF2BD6', color: '#fff', fontFamily: FUENTE, fontWeight: 900, fontSize: 56, textAlign: 'center', padding: 10, borderRadius: 10, boxShadow: '0 0 40px #FF2BD6' }}>BARBERÍA</div>
          <Silueta x={260} y={600} s={0.9} color="#000" style={{ transform: `translate(-50%,-100%) scale(.9) translateX(${interpolate(f, [rompe, rompe + 40], [-80, 80], cl)}px)` }} />
        </div>
      </Cam>
      <Notif at={2} texto="Nuevo mensaje" />
      <Placa y={420} tema={{ ...T, acento: COL.rojo, borde: COL.rojo }} />
      <Sfx s="glass" at={rompe + 2} v={0.6} /><Sfx s="error" at={rompe + 4} v={0.5} /><Sfx s="tape_stop" at={pausa - 18} v={0.5} />
    </AbsoluteFill>
  );
};

// 7. GIRO: el video se delata
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const tres = w('notificaciones');
  const del = w('video');
  const sale = w('distrajeron');
  const marcas = [tres, tres + 8, tres + 16];
  const zoom = interpolate(f, [sale - 4, sale + 30], [1, 0.36], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const notifs = ['¿Hay lugar hoy?', '¿Cuánto sale?', '¿Estás?'];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* barbero real que sostiene el celu (aparece al alejarse) */}
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, #3b1d5c, #070010 70%)', opacity: ent(f, sale, sale + 20) }}>
        <Silueta x={540} y={1920} s={3} color="#0e0618" />
        <div style={{ position: 'absolute', left: 560, top: 1240, fontSize: 280, fontFamily: EMOJI, transform: 'rotate(-10deg)' }}>🤚</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateY(${(1 - zoom) * -300}px)`, transformOrigin: '50% 55%', borderRadius: (1 - zoom) * 160, overflow: 'hidden', border: zoom < 0.98 ? `${(1 - zoom) * 40}px solid #222` : undefined }}>
        <Glitch activo={f < 14 || (f > del - 3 && f < del + 4)} fuerza={1.2}>
          <AbsoluteFill style={{ background: 'repeating-linear-gradient(#111 0 6px, #1b1b26 6px 12px)' }} />
          <Rayos y={900} color="rgba(255,43,214,.15)" />
          {notifs.map((n, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, top: 640 + i * 220, width: 1080, height: 200 }}>
              <Notif at={0} fija texto={n} marca={f >= marcas[i]} />
              {f >= marcas[i] && <Txt x={960} y={90} size={110} color="#fff" at={marcas[i]} style={{ background: COL.rojo, borderRadius: 60, padding: '0 34px' }}>{i + 1}</Txt>}
            </div>
          ))}
        </Glitch>
        <div style={{ position: 'absolute', left: 50, top: 40, color: '#fff', fontFamily: FUENTE, fontWeight: 900, fontSize: 64, opacity: f < 16 ? 1 : 0 }}>◀◀ REBOBINANDO</div>
      </AbsoluteFill>
      <Placa y={330} tema={{ bg: '#fff', borde: '#000', color: '#000', acento: COL.rojo }} max={150} rot={-3} />
      <Flash at={del} color={COL.rojo} max={0.5} />
      <Sfx s="rewind" at={0} v={0.7} />
      {marcas.map((m, i) => <Sfx key={i} s="hit" at={m} v={0.6} />)}
      <Sfx s="braam" at={sale} v={0.8} />
    </AbsoluteFill>
  );
};

// 8. El link: el cliente elige solo
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const toque = w('elige');
  const ok = w('solo') + 6;
  const g = spring({ frame: f, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(160deg,#6C2BFF,#1b0b4a)' }} />
      <Rayos y={950} color="rgba(255,255,255,.12)" />
      <div style={{ position: 'absolute', left: 540, top: 560, transform: `translate(-50%,-50%) scale(${g})`, background: '#fff', color: '#6C2BFF', fontFamily: FUENTE, fontWeight: 900, fontSize: 44, padding: '14px 30px', borderRadius: 40 }}>🔗 tubarberia.link/turnos</div>
      <Celular y={1050} s={1.05} rotY={interpolate(g, [0, 1], [-60, -8])}>
        <PReserva dia="Jueves" elegida={10} toque={toque} ok={ok} ocupadas={[0, 3, 5]} />
      </Celular>
      <Particulas at={ok} x={540} y={1100} n={40} colores={[NEON, '#fff', COL.amarillo]} seed="ok2" />
      <Placa y={310} tema={{ bg: '#fff', borde: '#000', color: '#000', acento: '#6C2BFF' }} />
      <Sfx s="whoosh" at={0} v={0.5} /><Sfx s="pop" at={toque} v={0.5} /><Sfx s="check" at={ok} v={0.6} />
    </AbsoluteFill>
  );
};

// 9. 47 vs 3
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const con = w('con');
  const tij = w('tijera');
  const n = Math.round(interpolate(f, [con, con + 18], [47, 3], cl));
  return (
    <AbsoluteFill>
      <Split at={0} gana={con} tIzq="SIN LINK" tDer="CON LINK" fondoIzq="#1a0014" fondoDer="#06200e" colDer={NEON}
        izq={<AbsoluteFill><Lluvia n={26} cada={1} piso={1250} seed="izq" /><Txt x={540} y={760} size={220} color={COL.rojo} at={4}>47</Txt></AbsoluteFill>}
        der={<AbsoluteFill>
          <Globo texto="¿Tenés turno?" x={540} y={1080} s={0.8} /><Globo texto="Reservé ✓" x={540} y={1180} s={0.8} verde />
          <Txt x={540} y={760} size={220} color={NEON} at={con}>{n}</Txt>
          {f >= tij && <div style={{ position: 'absolute', left: 540, top: 960, transform: `translate(-50%,-50%) rotate(${f * 4}deg)`, fontSize: 200, fontFamily: EMOJI }}>✂️</div>}
        </AbsoluteFill>} />
      <Sfx s="zap" at={4} v={0.6} /><Sfx s="tape_stop" at={con} v={0.3} /><Sfx s="fanfare" at={con + 18} v={0.4} /><Sfx s="snip" at={tij} v={0.7} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => <Cierre color={NEON} fondo={<FondoPop />} confeti={[NEON, COL.magenta, '#fff']} sub="y te paso el link 👇" />;

export const V02: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={NEON} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]}
    trans={[wipe({ direction: 'from-top' }), glitchT(), whipV(1), iris({ width: 1080, height: 1920 }), glitchT(), undefined, flashT('#fff'), wipe({ direction: 'from-right' }), zoomBlur()]} />
);
