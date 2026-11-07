// 09 · "Hacémelo como la otra vez" — adentro de la cabeza hay miles de cajones; en el giro, el video te toma examen.
import React from 'react';
import { AbsoluteFill, Freeze, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { noise2D } from '@remotion/noise';
import { Short, type ShortProps } from '../lib/Short';
import { EscCtx, MudoCtx, useEsc, useTL, useW } from '../lib/contexto';
import { Placa, type TemaPlaca } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Contador, Rayos, Txt, Emoji, Silueta, Glitch, Vineta, cl, COL, ent } from '../lib/fx';
import { Celular, PFicha } from '../lib/Celular';
import { Cierre } from '../lib/Cierre';
import { Lienzo3D } from '../lib/tres';
import { FUENTE, EMOJI } from '../lib/fuentes';
import { cargarConfig } from '../lib/config';
import { zoomBlur, slide, wipe, flip, iris, pushCut, glitchT, flashT, spin } from '../lib/transiciones';

const K = cargarConfig();
const VIO = '#8B5CFF', AZUL = '#3D7BFF', AMA = '#FFD23F';
const T: TemaPlaca = { bg: '#fff', borde: '#14102a', color: '#14102a', acento: VIO, sombra: 'rgba(139,92,255,.5)' };
const TOscura: TemaPlaca = { bg: 'rgba(14,10,30,.9)', borde: AMA, color: '#fff', acento: AMA };

/** Cara de barbero en estilo cómic, con gota de sudor. */
const Cara: React.FC<{ panico?: number }> = ({ panico = 0 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={760} height={760} viewBox="0 0 400 400" style={{ position: 'absolute', left: 160, top: 640 }}>
      <circle cx={200} cy={210} r={150} fill="#F2C9A0" stroke="#14102a" strokeWidth={8} />
      <path d="M60 170 Q80 40 200 40 Q330 40 340 170 Q300 110 200 110 Q100 110 60 170 Z" fill="#2a1a10" stroke="#14102a" strokeWidth={8} />
      <circle cx={145} cy={200} r={30} fill="#fff" stroke="#14102a" strokeWidth={6} /><circle cx={255} cy={200} r={30} fill="#fff" stroke="#14102a" strokeWidth={6} />
      <circle cx={145 + Math.sin(f / 2) * 6 * panico} cy={200} r={8} fill="#14102a" /><circle cx={255 + Math.sin(f / 2) * 6 * panico} cy={200} r={8} fill="#14102a" />
      <path d="M160 290 Q200 280 240 290" stroke="#14102a" strokeWidth={8} fill="none" />
      <path d="M150 300 L250 300" stroke="#14102a" strokeWidth={0} />
      <path d={`M330 ${120 + (f % 30)} q14 24 0 34 q-14 -10 0 -34`} fill="#7cd3ff" stroke="#14102a" strokeWidth={4} />
    </svg>
  );
};

const Globo: React.FC<{ texto: string; at?: number; x?: number; y?: number }> = ({ texto, at = 0, x = 540, y = 600 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(-4deg)`, background: '#fff', border: '8px solid #14102a', borderRadius: 50, padding: '26px 40px', fontFamily: FUENTE, fontWeight: 900, fontSize: 64, color: '#14102a', whiteSpace: 'nowrap', boxShadow: '12px 12px 0 rgba(0,0,0,.35)' }}>
      {texto}
      <div style={{ position: 'absolute', left: 80, bottom: -46, width: 0, height: 0, borderLeft: '26px solid transparent', borderRight: '26px solid transparent', borderTop: '46px solid #14102a' }} />
    </div>
  );
};

// 1. Gancho
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 60%, #6a3dff, #1a0a4a 70%)' }}>
      <Rayos y={1000} color="rgba(255,255,255,.1)" />
      <Cam golpes={[2, w('idea')]} fuerza={22} zoom={interpolate(f, [0, 100], [1, 1.25])} origen="50% 62%">
        <Cara panico={f > w('idea') ? 1 : 0} />
      </Cam>
      <Globo texto="¡Como la otra vez!" at={-4} x={500} y={560} />
      <Placa y={300} tema={T} max={120} hasta={0} />
      <Sfx s="pop" at={0} v={0.7} /><Sfx s="hit" at={2} v={0.5} /><Sfx s="tick" at={w('idea')} v={0.6} /><Sfx s="boing" at={w('era')} v={0.4} />
    </AbsoluteFill>
  );
};

// 2. Adentro de la cabeza: miles de cajones
const Pasillo: React.FC<{ z: number; abrir?: number; giro?: number }> = ({ z, abrir = 1, giro = 0 }) => {
  const f = useCurrentFrame();
  const cajones: React.ReactElement[] = [];
  for (const lado of [-1, 1]) for (let fila = 0; fila < 7; fila++) for (let k = 0; k < 18; k++) {
    const sale = Math.max(0, noise2D('c' + lado + fila, k * 0.7, f * 0.08)) * 0.8 * abrir;
    cajones.push(
      <group key={`${lado}-${fila}-${k}`} position={[lado * (2.2 - sale), -2.4 + fila * 0.8, -k * 1.1]} rotation={[0, (lado * Math.PI) / 2, 0]}>
        <mesh><boxGeometry args={[1, 0.7, 0.3]} /><meshStandardMaterial color={['#6b4a2c', '#7a5534', '#5c3d22'][(fila + k) % 3]} roughness={0.7} /></mesh>
        <mesh position={[0, 0, 0.17]}><boxGeometry args={[0.3, 0.08, 0.06]} /><meshStandardMaterial color="#d9b25a" metalness={0.8} roughness={0.3} /></mesh>
      </group>,
    );
  }
  return (
    <group position={[0, 0, z]} rotation={[0, 0, giro]}>
      {cajones}
      <mesh position={[0, -2.9, -9]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5, 24]} /><meshStandardMaterial color="#2a1a40" /></mesh>
    </group>
  );
};

const S1: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  return (
    <AbsoluteFill style={{ background: '#0a0618' }}>
      <Lienzo3D cam={[0, 0.2, 4]} mira={[0, 0, -10]} fov={70} fondo="#0a0618" niebla={['#0a0618', 4, 20]}>
        <ambientLight intensity={0.4} /><pointLight position={[0, 1.5, 2]} intensity={40} color="#9cc8ff" /><pointLight position={[0, 1, -8]} intensity={30} color={VIO} />
        <Pasillo z={f * 0.12} />
      </Lienzo3D>
      {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 540 + Math.sin(i * 7 + f / 10) * 420, top: ((f * (8 + (i % 4) * 3) + i * 140) % 1500) + 300, width: 70, height: 90, background: '#fff', border: '3px solid #14102a', transform: `rotate(${f * 6 + i * 30}deg)`, opacity: 0.8 }} />)}
      <Placa y={330} tema={TOscura} />
      <Rafaga s="drawer" at={4} n={8} cada={11} v={0.35} /><Sfx s="paper" at={w('ficha')} v={0.5} />
    </AbsoluteFill>
  );
};

// 3. Flashback: la tarjeta con el 2 (y se quema)
const Tarjeta: React.FC<{ quema?: number }> = ({ quema = 0 }) => (
  <div style={{ position: 'absolute', left: 140, top: 700, width: 800, height: 470, background: '#FFF8E7', border: '8px solid #14102a', borderRadius: 18, transform: 'rotate(-3deg)', padding: 30, boxShadow: '14px 14px 0 rgba(0,0,0,.35)', WebkitMaskImage: `linear-gradient(0deg, transparent ${quema * 100}%, #000 ${quema * 100 + 8}%)`, maskImage: `linear-gradient(0deg, transparent ${quema * 100}%, #000 ${quema * 100 + 8}%)` }}>
    <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 46, color: '#14102a' }}>LUCAS</div>
    <div style={{ fontFamily: FUENTE, fontWeight: 800, fontSize: 44, color: '#14102a', marginTop: 16 }}>Degradé bajo</div>
    <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 44, color: '#14102a', display: 'flex', alignItems: 'center', gap: 20 }}><span style={{ fontSize: 150, color: '#E0004D', lineHeight: 1 }}>2</span> al costado</div>
    <div style={{ fontFamily: FUENTE, fontWeight: 800, fontSize: 44, color: '#14102a' }}>Tijera arriba</div>
  </div>
);

const S2: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const quema = interpolate(f, [e.vozFin - 6, e.dur], [0, 1.1], cl);
  return (
    <AbsoluteFill style={{ background: '#3a2a1a' }}>
      <AbsoluteFill style={{ filter: 'sepia(.85)' }}>
        <Silueta x={300} y={1450} s={1.4} color="#1a120a" />
        <Tarjeta quema={quema} />
      </AbsoluteFill>
      {quema > 0 && <Particulas at={e.vozFin - 6} x={540} y={1150} n={40} colores={['#ff8a00', '#ffd23f', '#555']} grav={-0.6} seed="ceniza" vel={10} />}
      <Vineta o={0.8} />
      <Placa y={360} tema={T} />
      <Sfx s="rewind" at={0} v={0.4} /><Sfx s="snip" at={20} v={0.4} />
    </AbsoluteFill>
  );
};

// 4. Le errás por medio número… y no vuelve
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const raja = w('vuelve') - 4;
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(#1a1440,#0a0618)' }}>
      <Cam golpes={[raja, raja + 14]} fuerza={22}>
        {/* nuca con un escalón feo en el degradé */}
        <svg width={700} height={760} viewBox="0 0 350 380" style={{ position: 'absolute', left: 190, top: 600 }}>
          <path d="M40 200 Q40 40 175 40 Q310 40 310 200 L300 330 Q175 380 50 330 Z" fill="#F2C9A0" stroke="#14102a" strokeWidth={6} />
          <path d="M40 200 Q40 40 175 40 Q310 40 310 200 L310 150 L40 150 Z" fill="#2a1a10" />
          <rect x={40} y={150} width={270} height={40} fill="#4a3424" />
          <rect x={40} y={190} width={270} height={18} fill="#14102a" opacity={0.85} />
          <path d="M40 208 L310 208" stroke="#E0004D" strokeWidth={4} strokeDasharray="10 8" />
        </svg>
        <div style={{ position: 'absolute', left: 780, top: 760 + Math.sin(f / 2) * 8, fontSize: 200, fontFamily: EMOJI, transform: 'rotate(-30deg)' }}>🪒</div>
        {f > raja && <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}><path d="M300 520 L420 800 L360 1000 L520 1250 L470 1480" stroke="#fff" strokeWidth={8} fill="none" /></svg>}
      </Cam>
      {f > raja + 14 && <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: ent(f, raja + 14, raja + 22) * 0.7 }} />}
      <Placa y={360} tema={TOscura} />
      <Sfx s="glass" at={raja} v={0.6} /><Sfx s="door" at={raja + 14} v={0.7} />
    </AbsoluteFill>
  );
};

// 5. Peines que llueven: $240.000 por año
const Peine: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <svg width={200} height={70} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${r}deg)` }}><rect x={0} y={0} width={200} height={26} rx={8} fill="#222" />{Array.from({ length: 18 }, (_, i) => <rect key={i} x={6 + i * 11} y={24} width={6} height={44} fill="#222" />)}</svg>
);
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle, #3a1a5a, #0a0618)' }}>
      {Array.from({ length: 24 }, (_, i) => <Peine key={i} x={random('px' + i) * 900} y={-200 + ((f * (14 + (i % 5) * 3) + i * 90) % 1900)} r={f * (i % 2 ? 6 : -6) + i * 30} />)}
      <Contador desde={0} hasta={-K.corte * 24} at={w('quince') + 4} dura={20} y={1000} size={180} color="#FF2A5A" sub="POR AÑO · POR MEDIO NÚMERO" />
      <Placa y={360} tema={TOscura} />
      <Rafaga s="tick" at={w('quince') + 4} n={10} cada={2} v={0.3} /><Sfx s="hit" at={w('quince') + 24} v={0.6} />
    </AbsoluteFill>
  );
};

// 6. Nadie se acuerda de todo (todo gira; se congela con un cronómetro)
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }}><Txt x={540} y={900} size={220} at={pausa}>⏱️</Txt></AbsoluteFill>;
  return (
    <AbsoluteFill style={{ background: '#0a0618' }}>
      <Lienzo3D cam={[0, 0.2, 4]} mira={[0, 0, -10]} fov={70} fondo="#0a0618" niebla={['#0a0618', 4, 20]}>
        <ambientLight intensity={0.4} /><pointLight position={[0, 1.5, 2]} intensity={40} color="#9cc8ff" /><pointLight position={[0, 1, -8]} intensity={30} color={VIO} />
        <Pasillo z={4 + f * 0.05} giro={f * 0.04} abrir={2} />
      </Lienzo3D>
      <Placa y={360} tema={TOscura} />
      <Sfx s="wind" at={0} v={0.4} /><Rafaga s="drawer" at={4} n={5} cada={14} v={0.3} />
    </AbsoluteFill>
  );
};

// 7. GIRO: examen al espectador; rebobina y marca el 2
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tl = useTL();
  const w = useW();
  const pregunta = w('numero');
  const rebobina = w('era', 1) - 10;
  const dos = w('dos');
  const quedan = Math.max(0, 2 - Math.floor((f - pregunta) / 15));
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {f < rebobina ? (
        <AbsoluteFill style={{ background: `repeating-linear-gradient(0deg, #f3f0ff 0 60px, #fff 60px 120px)` }}>
          <div style={{ position: 'absolute', left: 60, top: 640, width: 840, textAlign: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 52, color: '#14102a' }}>EXAMEN · ¿qué número le iba al costado?</div>
          <div style={{ position: 'absolute', left: 90, top: 760, display: 'flex', gap: 40 }}>
            {['1', '2', '3'].map((n, i) => <div key={n} style={{ width: 240, height: 240, borderRadius: 30, border: '10px solid #14102a', background: [AZUL, VIO, '#FF4D8D'][i], color: '#fff', fontFamily: FUENTE, fontWeight: 900, fontSize: 170, textAlign: 'center', lineHeight: '230px', transform: `scale(${spring({ frame: f - pregunta - i * 3, fps, config: { damping: 9 } })})`, boxShadow: '10px 10px 0 #14102a' }}>{n}</div>)}
          </div>
          {f >= pregunta && <Txt x={540} y={1130} size={140} color="#E0004D" at={pregunta}>⏱ {quedan}</Txt>}
        </AbsoluteFill>
      ) : (
        <Glitch activo={f < rebobina + 8} fuerza={1.5}>
          <AbsoluteFill>
            <MudoCtx.Provider value>
              <Freeze frame={40}><EscCtx.Provider value={tl.escenas[2]}><S2 /></EscCtx.Provider></Freeze>
            </MudoCtx.Provider>
            <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}><circle cx={228} cy={955} r={interpolate(f, [dos, dos + 6], [0, 120], cl)} stroke="#E0004D" strokeWidth={18} fill="none" /></svg>
            {f < rebobina + 10 && <div style={{ position: 'absolute', left: 60, top: 60, fontFamily: FUENTE, fontWeight: 900, fontSize: 70, color: '#fff', textShadow: '0 0 20px #000' }}>◀◀ 10 SEGUNDOS</div>}
          </AbsoluteFill>
        </Glitch>
      )}
      <Placa y={330} tema={{ bg: '#14102a', borde: AMA, color: '#fff', acento: AMA }} max={140} hasta={rebobina - 2} />
      <Flash at={0} max={1} />
      <Sfx s="braam" at={0} v={0.8} /><Rafaga s="clock" at={pregunta} n={2} cada={15} v={0.5} /><Sfx s="rewind" at={rebobina} v={0.8} /><Sfx s="hit" at={dos} v={0.8} />
    </AbsoluteFill>
  );
};

// 8. La ficha de Lucas
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const g = spring({ frame: f, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${VIO}, #1a0a4a)` }}>
      <Rayos y={1000} color="rgba(255,255,255,.12)" />
      <Celular y={1010} s={1.1} rotY={interpolate(g, [0, 1], [-80, -6])}>
        <PFicha nombre="Lucas" lineas={[{ t: 'Degradé bajo', at: w('degrade') }, { t: '2 al costado', at: w('dos'), resalta: true }, { t: 'Tijera arriba', at: w('tijera') }, { t: 'Barba perfilada', at: w('tijera') + 12 }]} />
      </Celular>
      <Placa y={300} tema={T} />
      <Sfx s="whoosh" at={0} v={0.5} />{['degrade', 'dos', 'tijera'].map((k) => <Sfx key={k} s="pop" at={w(k)} v={0.5} />)}
    </AbsoluteFill>
  );
};

// 9. Hasta anotás que es de Boca (y el corte queda perfecto)
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const boca = w('boca');
  const brillo = w('river') + 8;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${VIO}, #1a0a4a)` }}>
      <Celular y={1010} s={1.1} rotY={6}>
        <PFicha nombre="Lucas" lineas={[{ t: 'Degradé bajo', at: -1 }, { t: '2 al costado', at: -1 }, { t: 'Tijera arriba', at: -1 }, { t: '⚽ Hincha de Boca', at: boca, resalta: true }, { t: '🚫 No hablarle de River', at: w('river'), resalta: true }]} />
      </Celular>
      {f >= brillo && <Particulas at={brillo} x={540} y={900} n={40} colores={[AMA, '#fff']} seed="brillo" forma="estrella" />}
      <Placa y={300} tema={T} />
      <Sfx s="pop" at={boca} v={0.6} /><Sfx s="laugh" at={w('river') + 4} v={0.5} /><Sfx s="chime" at={brillo} v={0.5} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => <Cierre color={VIO} fondo={<AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 60%, #6a3dff, #1a0a4a 70%)' }} />} confeti={[VIO, AMA, '#fff']} sub="¿te pasó? contame 👇" />;

export const V09: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={AMA} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]}
    trans={[zoomBlur(1.5), flashT('#fff'), glitchT(), slide({ direction: 'from-top' }), spin(), undefined, zoomBlur(), wipe({ direction: 'from-bottom' }), iris({ width: 1080, height: 1920 })]} />
);
