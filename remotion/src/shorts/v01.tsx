// 01 · "Hay algo peor que un mal corte" — cine negro en blanco y negro con rojo; silla 3D que estalla en el giro.
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { useEsc, useW } from '../lib/contexto';
import { Placa } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Grano, Vineta, Particulas, Contador, Rayo, Rayos, Confeti, Onda, Txt, Silueta, Fondo, cl, COL, ent } from '../lib/fx';
import { Celular, PReserva, PChat } from '../lib/Celular';
import { Split } from '../lib/Split';
import { Lienzo3D, SillaBarbero, Tijera, Billete, Cartel, Estallido, MAT } from '../lib/tres';
import { FUENTE } from '../lib/fuentes';
import { flashT, wipe, slide, zoomBlur, spin, pushCut, whip } from '../lib/transiciones';
import { cargarConfig } from '../lib/config';

const K = cargarConfig();
const ROJO = '#FF1E3C';
const NOIR = 'grayscale(1) contrast(1.25) brightness(.95)';

/** Luz de persiana: franjas de luz en diagonal que se mueven lento. */
const Persiana: React.FC<{ o?: number; color?: string }> = ({ o = 0.55, color = '255,255,255' }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: `repeating-linear-gradient(-28deg, rgba(${color},${o * 0.32}) 0 70px, rgba(0,0,0,${o}) 70px 150px)`, backgroundPosition: `${f * 0.6}px 0`, mixBlendMode: 'overlay', pointerEvents: 'none' }} />;
};

const Humo: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + Math.sin(f / 40) * 20}% ${70 + Math.cos(f / 50) * 10}%, rgba(255,255,255,.12), transparent 60%)`, pointerEvents: 'none' }} />;
};

// ---------- 1. Gancho ----------
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const pega = 12;
  const tijY = interpolate(f, [0, pega], [7, 0.9], { ...cl, easing: Easing.in(Easing.quad) });
  const camZ = interpolate(f, [0, w('sabados')], [10, 6.2], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: '#050505' }}>
      <AbsoluteFill style={{ filter: NOIR }}>
        <Cam golpes={[pega, w('peor'), w('sabados')]} fuerza={30}>
          <Lienzo3D cam={[Math.sin(f / 50) * 1.2, 2.6, camZ]} mira={[0, 1.4, 0]} fov={42}>
            <ambientLight intensity={0.15} />
            <spotLight position={[2, 8, 4]} angle={0.5} penumbra={0.6} intensity={500} />
            <directionalLight position={[-4, 3, 5]} intensity={2.5} />
            <directionalLight position={[3, 2, -4]} intensity={4} color="#ffffff" />
            <SillaBarbero rotation={[0, f * 0.035 + 0.6, 0]} />
            <Tijera abre={0.25} position={[1.5, tijY, 0.9]} rotation={[0.1, 0.4, Math.PI + 0.15]} scale={0.55} />
            <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[8, 48]} /><meshStandardMaterial color="#222" roughness={0.6} metalness={0.2} /></mesh>
          </Lienzo3D>
        </Cam>
        <Persiana />
        <Humo />
      </AbsoluteFill>
      <Particulas at={pega} x={700} y={1180} n={26} colores={['#fff', '#FFD27A']} vel={22} grav={1.6} tam={10} seed="chispa" dura={22} forma="circulo" />
      <Placa y={330} tema={{ bg: 'rgba(0,0,0,.85)', borde: '#fff', color: '#fff', acento: ROJO }} max={128} />
      <Vineta o={0.85} />
      <Grano o={0.22} />
      <Sfx s="clang" at={pega} v={0.5} />
      <Sfx s="boom" at={w('peor')} v={0.8} />
      <Sfx s="hit" at={w('sabados')} v={0.5} />
    </AbsoluteFill>
  );
};

// ---------- 2. Escena del crimen ----------
const Reloj: React.FC<{ traba: number }> = ({ traba }) => {
  const f = useCurrentFrame();
  const jit = f > traba ? Math.sin(f * 2.3) * 3 : 0;
  return (
    <svg width={620} height={620} viewBox="-110 -110 220 220" style={{ position: 'absolute', left: 230, top: 600 }}>
      <circle r={100} fill="#f2f2f2" stroke="#111" strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-3} y={-92} width={6} height={16} fill="#111" transform={`rotate(${i * 30})`} />)}
      <rect x={-5} y={-58} width={10} height={60} fill="#111" transform={`rotate(${300})`} rx={4} />
      <rect x={-3} y={-82} width={6} height={84} fill="#111" transform={`rotate(${f < traba ? f * 6 : 0 + jit})`} rx={3} />
      <rect x={-1.5} y={-88} width={3} height={96} fill={ROJO} transform={`rotate(${f < traba ? f * 12 : jit * 4})`} />
      <circle r={7} fill="#111" />
    </svg>
  );
};

const Cinta: React.FC<{ y: number; rot: number; at: number }> = ({ y, rot, at }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [at, at + 8], [-1400, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: 'absolute', left: -200 + x, top: y, width: 1500, height: 90, background: '#FFD60A', transform: `rotate(${rot}deg)`, display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,.6)' }}>
      <div style={{ whiteSpace: 'nowrap', fontFamily: FUENTE, fontWeight: 900, fontSize: 52, color: '#000', letterSpacing: 4, transform: `translateX(${-f * 6}px)` }}>{'NO PASAR · TURNO PERDIDO · '.repeat(8)}</div>
    </div>
  );
};

const S1: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const c1 = 26, c2 = 52;
  const golpe = w('clavaron');
  return (
    <AbsoluteFill style={{ background: '#070707' }}>
      <Cam golpes={[golpe]} fuerza={34} zoom={f >= golpe ? interpolate(f, [golpe, golpe + 6], [1.25, 1.1], cl) : 1}>
        {f < c1 && <AbsoluteFill style={{ filter: NOIR, background: '#1a1a1a' }}><Reloj traba={14} /><Persiana o={0.4} /></AbsoluteFill>}
        {f >= c1 && f < c2 && <AbsoluteFill style={{ background: '#0c0c0c' }}><Cinta y={820} rot={-12} at={c1} /><Cinta y={1020} rot={9} at={c1 + 4} /></AbsoluteFill>}
        {f >= c2 && (
          <AbsoluteFill>
            <AbsoluteFill style={{ filter: NOIR }}>
              <Lienzo3D cam={[3.6, 3.2, 6.5]} mira={[0, 1.3, 0]} fov={40}>
                <ambientLight intensity={0.2} />
                <spotLight position={[0, 9, 2]} angle={0.45} penumbra={0.5} intensity={500} />
                <directionalLight position={[4, 3, 5]} intensity={2.5} />
                <SillaBarbero rotation={[0, -0.5, 0]} />
                <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[9, 48]} /><meshStandardMaterial color="#1c1c1c" /></mesh>
              </Lienzo3D>
              <Persiana o={0.45} />
            </AbsoluteFill>
            <Cinta y={1150} rot={-6} at={c2} />
            <svg width={300} height={420} style={{ position: 'absolute', left: 420, top: 640, opacity: 0.85 }}><path d="M150 30 a55 55 0 1 1 -0.1 0 M60 380 L70 180 Q80 130 150 130 Q220 130 230 180 L240 380" stroke="#fff" strokeWidth={8} fill="none" strokeDasharray="18 10" /></svg>
          </AbsoluteFill>
        )}
      </Cam>
      <Placa y={330} tema={{ bg: 'rgba(0,0,0,.85)', borde: '#fff', color: '#fff', acento: ROJO }} />
      <Flash at={c1} /><Flash at={c2} />
      <Flash at={golpe} color={ROJO} max={0.5} />
      <Vineta o={0.8} /><Grano o={0.22} />
      <Rafaga s="tick" at={2} n={6} cada={2} v={0.4} />
      <Sfx s="flash" at={c1} v={0.5} /><Sfx s="flash" at={c2} v={0.5} />
      <Sfx s="hit" at={golpe} v={0.7} />
    </AbsoluteFill>
  );
};

// ---------- 3. Doble tilde azul ----------
const Rodadora: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0) return null;
  const x = interpolate(t, [0, 40], [-200, 1300]);
  const y = 1260 - Math.abs(Math.sin(t / 5)) * 90;
  return (
    <svg width={180} height={180} viewBox="-50 -50 100 100" style={{ position: 'absolute', left: x, top: y, transform: `rotate(${t * 25}deg)` }}>
      {Array.from({ length: 14 }, (_, i) => <ellipse key={i} rx={42} ry={18 + (i % 4) * 5} fill="none" stroke="#a88a5a" strokeWidth={3} transform={`rotate(${i * 26})`} />)}
    </svg>
  );
};

const TildeAzul: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 8, stiffness: 220 } });
  return <div style={{ position: 'absolute', left: 640, top: 760, transform: `translate(-50%,-50%) scale(${s}) rotate(-8deg)`, fontFamily: FUENTE, fontWeight: 900, fontSize: 210, color: '#34B7F1', WebkitTextStroke: '10px #000', paintOrder: 'stroke', textShadow: '0 0 40px #34B7F1', letterSpacing: -40 }}>✓✓</div>;
};

const S2: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const nada = w('nada');
  const zoom = interpolate(f, [nada - 2, nada + 8], [1.45, 0.92], { ...cl, easing: Easing.out(Easing.cubic) });
  const puntos = [10, 30, 50].some((a) => f >= a && f < a + 12);
  return (
    <AbsoluteFill style={{ background: '#0c0c0c' }}>
      <AbsoluteFill style={{ filter: 'grayscale(.85) contrast(1.15)' }}>
        <Cam zoom={zoom} origen="50% 55%">
          <Celular y={1010} s={1.18} rotY={-6}>
            <PChat nombre="Cliente sábado 10:00" msgs={[{ t: 'Hola! Te espero a las 10 💈', yo: true, at: -10 }, { t: '¿Venís?', yo: true, at: 2 }]} />
            {puntos && <div style={{ position: 'absolute', left: 30, top: 420, background: '#fff', borderRadius: 18, padding: '14px 22px', fontSize: 40, letterSpacing: 6 }}>• • •</div>}
          </Celular>
        </Cam>
        <Persiana o={0.3} />
      </AbsoluteFill>
      <TildeAzul at={w('tilde')} />
      <Rodadora at={nada - 6} />
      <Placa y={330} tema={{ bg: 'rgba(0,0,0,.85)', borde: '#fff', color: '#fff', acento: ROJO }} />
      <Vineta o={0.8} /><Grano o={0.2} />
      <Sfx s="ding" at={2} v={0.5} />
      {[10, 30, 50].map((a) => <Sfx key={a} s="pop" at={a} v={0.3} />)}
      <Sfx s="wind" at={nada - 8} v={0.5} />
    </AbsoluteFill>
  );
};

// ---------- 4. −$10.000 volando ----------
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: '#080808' }}>
      <Cam golpes={[34]} fuerza={26}>
        <AbsoluteFill style={{ filter: 'grayscale(1) contrast(1.2)' }}>
          <Lienzo3D cam={[0, 1.5, 7]} mira={[0, 1.5, 0]} fov={45}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 5]} intensity={2} />
            <SillaBarbero position={[-1.5, -1.6, -2]} rotation={[0, 0.7, 0]} scale={0.9} />
          </Lienzo3D>
          <Persiana o={0.35} />
        </AbsoluteFill>
        <Lienzo3D cam={[0, 1.5, 7]} mira={[0, 1.5, 0]} fov={45} style={{ mixBlendMode: 'normal' }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 5, 5]} intensity={2.5} />
          <Billete monto={`$${(K.corte / 1000).toFixed(0)}.000`} color="#E0283C" position={[-1.2 + t * 4.5, 0.2 + t * 3.2 + Math.sin(t * 9) * 0.2, 1 - t]} rotation={[t * 3, t * 5, t * 2]} scale={1.3} />
        </Lienzo3D>
      </Cam>
      <Contador desde={0} hasta={-K.corte} at={8} dura={24} y={1020} size={230} color={ROJO} />
      <Rayo x1={120} y1={760} x2={960} y2={1180} at={34} dura={12} color="#ffd0d6" seed="r1" />
      <Rayo x1={980} y1={720} x2={140} y2={1120} at={36} dura={10} color="#ffd0d6" seed="r2" />
      <Placa y={330} tema={{ bg: 'rgba(0,0,0,.85)', borde: ROJO, color: '#fff', acento: ROJO }} />
      <Vineta o={0.8} /><Grano o={0.2} />
      <Sfx s="whoosh" at={2} v={0.6} />
      <Rafaga s="tick" at={8} n={10} cada={2} v={0.35} />
      <Sfx s="error" at={32} v={0.6} /><Sfx s="zap" at={34} v={0.5} />
    </AbsoluteFill>
  );
};

// ---------- 5. Rechazaste al que sí venía ----------
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const si = w('si');
  const cierra = 34;
  const sello = w('venia');
  const tilt = f < si ? -9 : interpolate(f, [si, si + 6], [-9, 0], cl);
  const puerta = interpolate(f, [cierra, cierra + 8], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
  const sx = interpolate(f, [cierra + 8, cierra + 40], [540, 1300], cl);
  const s = spring({ frame: f - sello, fps, config: { damping: 9, stiffness: 300 } });
  return (
    <AbsoluteFill style={{ background: '#2a2016' }}>
      <Cam rot={tilt} golpes={[cierra + 8, sello]} fuerza={22}>
        <AbsoluteFill style={{ filter: 'sepia(.9) contrast(1.1) brightness(.9)' }}>
          <AbsoluteFill style={{ background: 'linear-gradient(#5a4632,#2b2117)' }} />
          {/* marco de la puerta y vereda */}
          <div style={{ position: 'absolute', left: 250, top: 560, width: 580, height: 880, background: '#d9c9a8', border: '26px solid #3b2a1a' }} />
          <Silueta x={sx} y={1430} s={1.25} color="#1b140d" />
          <div style={{ position: 'absolute', left: 250, top: 560, width: 580, height: 880, transformOrigin: '0 50%', transform: `perspective(1400px) rotateY(${(1 - puerta) * -78}deg)`, background: 'linear-gradient(90deg,#6b4a2c,#4a321d)', border: '26px solid #3b2a1a' }}>
            <div style={{ position: 'absolute', right: 40, top: 420, width: 30, height: 30, borderRadius: '50%', background: '#c9a24a' }} />
          </div>
          <Txt x={540} y={500} size={70} color="#f5e6c8" at={0}>9:00</Txt>
          {/* vos, negando con la cabeza */}
          <Silueta x={170} y={1500} s={1.4} color="#0d0905" style={{ transform: `translate(-50%,-100%) scale(1.4) rotate(${Math.sin(f / 3) * 4}deg)` }} />
          <Persiana o={0.3} />
        </AbsoluteFill>
      </Cam>
      {f >= sello && (
        <div style={{ position: 'absolute', left: 540, top: 980, transform: `translate(-50%,-50%) rotate(-14deg) scale(${3 - 2 * s})`, opacity: Math.min(1, s * 2), border: `14px solid ${ROJO}`, color: ROJO, fontFamily: FUENTE, fontWeight: 900, fontSize: 120, padding: '6px 34px', borderRadius: 18, letterSpacing: 6, background: 'rgba(255,255,255,.08)' }}>RECHAZADO</div>
      )}
      <Placa y={330} tema={{ bg: 'rgba(0,0,0,.85)', borde: '#fff', color: '#fff', acento: ROJO }} />
      <Vineta o={0.75} /><Grano o={0.25} />
      <Sfx s="door" at={cierra + 6} v={0.7} />
      <Sfx s="stamp" at={sello} v={0.8} />
    </AbsoluteFill>
  );
};

// ---------- 6. 144 sillas: $1.440.000 por año ----------
const CUERO_MURO = { color: '#5a5a66', metalness: 0.2, roughness: 0.3 };
const SillaSimple: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.9, 0.18, 0.8]} /><meshStandardMaterial {...CUERO_MURO} /></mesh>
    <mesh position={[0, 1.05, -0.36]}><boxGeometry args={[0.85, 1.0, 0.14]} /><meshStandardMaterial {...CUERO_MURO} /></mesh>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.08, 0.3, 0.42, 10]} /><meshStandardMaterial {...MAT.cromo} /></mesh>
  </group>
);

const Grietas: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0) return null;
  const L = interpolate(t, [0, 5], [0, 1], cl);
  const lines = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + random('gr' + i);
    let x = 540, y = 1000, d = `M${x},${y}`;
    for (let k = 0; k < 6; k++) { x += Math.cos(a + (random('g' + i + k) - 0.5)) * 110 * L; y += Math.sin(a + (random('h' + i + k) - 0.5)) * 110 * L; d += ` L${x},${y}`; }
    return d;
  });
  return <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>{lines.map((d, i) => <path key={i} d={d} stroke="#fff" strokeWidth={5} fill="none" opacity={0.9} />)}</svg>;
};

const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const w = useW();
  const anio = w('ano');
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  const filas = Math.min(12, Math.floor(f / 2.5) + 1);
  const camZ = interpolate(f, [0, pausa], [5, 16], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const camY = interpolate(f, [0, pausa], [3, 10], cl);
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }} />;
  return (
    <AbsoluteFill style={{ background: '#050505' }}>
      <Cam golpes={[anio]} fuerza={36}>
        <AbsoluteFill style={{ filter: 'grayscale(1) contrast(1.3) brightness(1.3)' }}>
          <Lienzo3D cam={[0, camY, camZ]} mira={[0, -1.5, -8]} fov={55} niebla={['#050505', 14, 50]} fondo="#050505">
            <ambientLight intensity={0.35} />
            <directionalLight position={[2, 8, 6]} intensity={4} />
            <pointLight position={[0, 3, 2]} intensity={40} color="#ff2040" />
            {Array.from({ length: filas }, (_, r) => Array.from({ length: 12 }, (_, c) => <SillaSimple key={r + '-' + c} position={[(c - 5.5) * 1.5, 0, -r * 1.6]} />))}
          </Lienzo3D>
        </AbsoluteFill>
      </Cam>
      <Contador desde={-K.corte * 12} hasta={-K.corte * 144} at={4} dura={Math.max(10, anio - 4)} y={1000} size={170} color={ROJO} />
      <Grietas at={anio} />
      <Flash at={anio} color={ROJO} max={0.45} />
      <Placa y={330} tema={{ bg: 'rgba(0,0,0,.85)', borde: ROJO, color: '#fff', acento: ROJO }} />
      <Vineta o={0.85} /><Grano o={0.22} />
      <Rafaga s="tick" at={4} n={Math.max(4, Math.floor((anio - 4) / 2))} cada={2} v={0.35} />
      <Sfx s="boom" at={anio} v={0.9} /><Sfx s="glass" at={anio} v={0.4} />
    </AbsoluteFill>
  );
};

// ---------- 7. GIRO: la silla estalla, adentro un $0 ----------
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const t = interpolate(f, [0, 70], [0, 1.4], { ...cl, easing: Easing.out(Easing.cubic) });
  const ang = interpolate(f, [0, 110], [0, Math.PI * 1.1], { ...cl, easing: Easing.inOut(Easing.sin) });
  const sube = interpolate(f, [6, 40], [0.6, 2.2], { ...cl, easing: Easing.out(Easing.back(1.6)) });
  const gratis = w('gratis');
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Rayos y={850} color="rgba(255,30,60,.22)" vel={0.6} />
      <Cam golpes={[0, gratis]} fuerza={40}>
        <Lienzo3D cam={[Math.sin(ang) * 7, 2.6, Math.cos(ang) * 7]} mira={[0, 1.6, 0]} fov={44}>
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 2, 0]} intensity={60 * Math.min(1, f / 4)} color="#ff3b5c" />
          <directionalLight position={[3, 6, 4]} intensity={2.4} />
          {f < 2 ? <SillaBarbero /> : <Estallido t={t} n={70} seed="silla" radio={0.9} />}
          <group position={[0, sube, 0]} rotation={[0, f * 0.08, Math.sin(f / 9) * 0.15]}>
            <Cartel texto="$0" w={1.7} h={2.1} bg="#FF1E3C" color="#fff" size={300} grosor={0.08} emisivo />
            <mesh position={[0, 1.15, 0]}><torusGeometry args={[0.16, 0.04, 12, 30]} /><meshStandardMaterial {...MAT.oro} /></mesh>
          </group>
        </Lienzo3D>
      </Cam>
      <Onda at={0} x={540} y={900} color={ROJO} max={1100} dura={22} />
      <Particulas at={0} x={540} y={950} n={60} colores={['#fff', ROJO, '#bbb']} vel={34} grav={0.6} seed="vidrio" dura={45} />
      <Flash at={0} max={1} dura={10} />
      <Flash at={gratis} color={ROJO} max={0.5} />
      <Placa y={330} tema={{ bg: '#fff', borde: '#000', color: '#000', acento: ROJO }} max={140} rot={-3} />
      <Vineta o={0.7} />
      <Sfx s="glass" at={0} v={0.9} /><Sfx s="braam" at={0} v={0.9} />
      <Sfx s="whoosh" at={30} v={0.4} /><Sfx s="hit" at={gratis} v={0.7} />
    </AbsoluteFill>
  );
};

// ---------- 8. Aparece la seña (el mundo pasa a color) ----------
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const cae = spring({ frame: f, fps, config: { damping: 14, stiffness: 90 } });
  const color = ent(f, 0, 14);
  const toque = w('reserva'), sena = w('deja'), ok = w('sena', 0) + 8;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ filter: `grayscale(${1 - color})` }}>
        <Fondo colores={[COL.violeta, '#00C2FF', COL.verde, COL.magenta]} base="#120626" />
        <Rayos y={1000} color="rgba(255,255,255,.12)" />
      </AbsoluteFill>
      <Cam golpes={[Math.round(14)]} fuerza={18} zoom={interpolate(f, [ok, ok + 20], [1, 1.06], cl)}>
        <Celular y={interpolate(cae, [0, 1], [-700, 1010])} rotY={interpolate(cae, [0, 1], [540, -8])} rotX={interpolate(cae, [0, 1], [40, 6])} s={1.22}>
          <PReserva toque={toque} sena={sena} ok={ok} montoSena={K.sena} />
        </Celular>
      </Cam>
      <Particulas at={ok} x={540} y={1100} n={40} colores={[COL.verde, '#fff', COL.amarillo]} seed="ok" />
      <Placa y={300} tema="verde" />
      <Sfx s="whoosh" at={0} v={0.6} /><Sfx s="thud" at={14} v={0.5} />
      <Sfx s="pop" at={toque} v={0.5} /><Sfx s="ding" at={sena} v={0.45} /><Sfx s="check" at={ok} v={0.6} />
    </AbsoluteFill>
  );
};

// ---------- 9. SIN seña vs CON seña ----------
const Lado: React.FC<{ ocupada: boolean }> = ({ ocupada }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Lienzo3D cam={[0, 2.4, 7.5]} mira={[0, 1.4, 0]} fov={40}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 6, 4]} intensity={2.4} />
        <SillaBarbero rotation={[0, ocupada ? -0.5 + f * 0.01 : 0.5, 0]} cuero={ocupada ? { color: '#5B21FF', metalness: 0.2, roughness: 0.35 } : MAT.cuero} />
      </Lienzo3D>
      {ocupada && <Silueta x={540} y={1080} s={0.95} color="#14002e" />}
    </AbsoluteFill>
  );
};

const S8: React.FC = () => {
  const w = useW();
  const viene = w('viene');
  const tuya = w('tuya');
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Split at={0} gana={viene} tIzq="SIN SEÑA" tDer="CON SEÑA" fondoIzq="#111" fondoDer="#1d0b47"
        izq={<AbsoluteFill style={{ filter: NOIR }}><Lado ocupada={false} /><Contador desde={0} hasta={-K.corte} at={10} y={1040} size={110} color={ROJO} /></AbsoluteFill>}
        der={<AbsoluteFill><Lado ocupada /><Contador desde={0} hasta={K.sena} at={tuya} y={1040} size={120} color={COL.verde} /></AbsoluteFill>} />
      <Confeti at={viene} />
      <Sfx s="zap" at={4} v={0.6} /><Sfx s="hit" at={8} v={0.5} />
      <Sfx s="fanfare" at={viene} v={0.4} /><Sfx s="cash" at={tuya} v={0.7} />
    </AbsoluteFill>
  );
};

// ---------- 10. Cierre: Comentá BARBER (y vuelve al principio) ----------
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const b = w('barber');
  const late = 1 + Math.sin((f - b) / 4) * 0.05;
  const s = spring({ frame: f - b, fps, config: { damping: 8, stiffness: 220 } });
  const apaga = ent(f, w('corte') - 4, w('corte') + 10);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ opacity: 1 - apaga }}>
        <Fondo colores={[COL.verde, COL.violeta, '#00C2FF']} base="#04140b" />
        <Rayos y={850} color="rgba(255,255,255,.15)" />
        <Confeti at={b} colores={[COL.verde, '#fff', COL.amarillo]} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 490, top: 850, transform: `translate(-50%,-50%) scale(${s * late}) rotate(-4deg)`, opacity: 1 - apaga }}>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 70, color: '#fff', textAlign: 'center', WebkitTextStroke: '8px #000', paintOrder: 'stroke' }}>COMENTÁ</div>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 210, color: COL.verde, background: '#000', padding: '0 40px', borderRadius: 30, border: `10px solid ${COL.verde}`, boxShadow: `0 0 80px ${COL.verde}`, letterSpacing: -4 }}>BARBER</div>
        <div style={{ fontFamily: FUENTE, fontWeight: 800, fontSize: 46, color: '#fff', textAlign: 'center', marginTop: 24, WebkitTextStroke: '6px #000', paintOrder: 'stroke' }}>y probala gratis {K.diasPrueba} días 👇</div>
      </div>
      <Sfx s="pop" at={b} v={0.6} /><Sfx s="chime" at={b + 2} v={0.4} />
      <Sfx s="whoosh_rev" at={w('corte') - 6} v={0.5} />
    </AbsoluteFill>
  );
};

export const V01: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={ROJO} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]}
    trans={[wipe({ direction: 'from-top-left' }), flashT(), slide({ direction: 'from-right' }), zoomBlur(), pushCut({ flashColor: ROJO }), undefined, spin(), wipe({ direction: 'from-bottom' }), whip(1)]} />
);
