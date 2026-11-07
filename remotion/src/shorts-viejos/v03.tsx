// 03 · "Hay un ladrón en tu barbería" — papel y cartulina; el cuaderno aparece en todas las escenas y en el giro se delata.
import React from 'react';
import { AbsoluteFill, Freeze, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { MudoCtx, EscCtx, useEsc, useTL, useW } from '../lib/contexto';
import { Placa, type TemaPlaca } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Contador, Rayos, Onda, Txt, Emoji, Silueta, Grano, Vineta, cl, COL, ent } from '../lib/fx';
import { Celular, PAgenda } from '../lib/Celular';
import { Split } from '../lib/Split';
import { Cierre } from '../lib/Cierre';
import { Lienzo3D, Billete, MAT } from '../lib/tres';
import { FUENTE, EMOJI } from '../lib/fuentes';
import { cargarConfig } from '../lib/config';
import { slide, wipe, flip, clockWipe, whip, zoomBlur, iris, pushCut } from '../lib/transiciones';

const K = cargarConfig();
const ROJO = '#D7263D';
const T: TemaPlaca = { bg: '#FFF8E7', borde: '#1a1a1a', color: '#1a1a1a', acento: ROJO, sombra: 'rgba(0,0,0,.3)' };
const CX = 175, CY = 1080; // dónde está el cuaderno "escondido" en cada escena

const Carton: React.FC<{ c?: string }> = ({ c = '#C9A97A' }) => (
  <AbsoluteFill style={{ background: c }}>
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'multiply' }}>
      <filter id="carton"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={4} /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width={1080} height={1920} filter="url(#carton)" />
    </svg>
  </AbsoluteFill>
);

/** El cuaderno culpable (2D, de cartulina). Con ojos en el giro. */
const Cuaderno: React.FC<{ x?: number; y?: number; s?: number; rot?: number; ojos?: boolean }> = ({ x = CX, y = CY, s = 1, rot = -8, ojos }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, filter: 'drop-shadow(8px 10px 0 rgba(0,0,0,.35))' }}>
      <div style={{ width: 190, height: 250, background: '#2F5DA8', borderRadius: 10, border: '5px solid #1a1a1a', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 30, top: 40, width: 130, height: 46, background: '#FFF8E7', border: '3px solid #1a1a1a', fontFamily: FUENTE, fontWeight: 900, fontSize: 22, textAlign: 'center', lineHeight: '42px' }}>TURNOS</div>
        {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: 'absolute', left: -14, top: 18 + i * 28, width: 26, height: 12, borderRadius: 6, border: '4px solid #888', background: 'transparent' }} />)}
        <div style={{ position: 'absolute', left: 110, top: 150, width: 60, height: 50, borderRadius: '50%', background: 'rgba(110,70,30,.6)' }} />
        {ojos && <div style={{ position: 'absolute', left: 40, top: 110, display: 'flex', gap: 30 }}>{[0, 1].map((k) => <div key={k} style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '4px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 16, height: 16, borderRadius: '50%', background: '#000', transform: `translate(${Math.sin(f / 5) * 6}px,0)` }} /></div>)}</div>}
      </div>
    </div>
  );
};

// 1. Gancho: linterna en la oscuridad, una mano roba del cajón
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const lx = 540 + Math.sin(f / 9) * 330, ly = 950 + Math.cos(f / 13) * 200;
  const roba = interpolate(f, [0, 30], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ WebkitMaskImage: `radial-gradient(circle 360px at ${lx}px ${ly}px, #000 55%, transparent 100%)`, maskImage: `radial-gradient(circle 360px at ${lx}px ${ly}px, #000 55%, transparent 100%)` }}>
        <Carton c="#B88E5C" />
        <div style={{ position: 'absolute', left: 120, top: 1000, width: 840, height: 260, background: '#7a5230', border: '6px solid #1a1a1a', boxShadow: '12px 12px 0 rgba(0,0,0,.4)' }} />
        <div style={{ position: 'absolute', left: 520, top: 1060, width: 320, height: 140, background: '#5c3b1f', border: '6px solid #1a1a1a', transform: `translateY(${roba * 60}px)` }} />
        <Billete2D x={680 - roba * 300} y={1080 - roba * 400} rot={roba * -40} />
        <div style={{ position: 'absolute', left: 620 - roba * 300, top: 1000 - roba * 400, fontSize: 170, fontFamily: EMOJI, transform: 'rotate(160deg)' }}>🤚</div>
        <Cuaderno x={CX + 60} y={950} />
      </AbsoluteFill>
      <Placa y={360} tema={T} max={150} />
      <Grano o={0.15} />
      <Sfx s="hit" at={w('ladron')} v={0.7} /><Sfx s="flash" at={0} v={0.3} /><Sfx s="paper" at={10} v={0.5} /><Sfx s="boom" at={w('quien')} v={0.6} />
    </AbsoluteFill>
  );
};

const Billete2D: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, width: 200, height: 96, background: '#6FBF73', border: '5px solid #1a1a1a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 44, color: '#1a1a1a', boxShadow: '6px 6px 0 rgba(0,0,0,.35)' }}>$</div>
);

// 2. Rueda de sospechosos
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const tachas = [w('cliente'), w('socio'), w('enfrente')];
  const sos = [{ n: 'CLIENTE', e: '🧔' }, { n: 'SOCIO', e: '👨‍🦲' }, { n: 'EL DE ENFRENTE', e: '😎' }];
  return (
    <AbsoluteFill>
      <Carton c="#9AA7B8" />
      {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 700 + i * 70, height: 4, background: 'rgba(0,0,0,.35)' }}><span style={{ position: 'absolute', left: 10, top: -30, fontFamily: FUENTE, fontWeight: 800, fontSize: 24 }}>{2 - i * 0.1 > 0 ? (2 - i * 0.1).toFixed(1) : ''}</span></div>)}
      <Cam golpes={tachas} fuerza={14} x={interpolate(f, [0, 90], [40, -40])}>
        {sos.map((s, i) => {
          const x = 250 + i * 290;
          return (
            <div key={i}>
              <Silueta x={x} y={1330} s={1.15} color="#1a1a1a" />
              <div style={{ position: 'absolute', left: x - 70, top: 820, fontSize: 140, fontFamily: EMOJI }}>{s.e}</div>
              <div style={{ position: 'absolute', left: x, top: 1350, transform: 'translateX(-50%)', background: '#FFF8E7', border: '4px solid #1a1a1a', fontFamily: FUENTE, fontWeight: 900, fontSize: 30, padding: '4px 12px', whiteSpace: 'nowrap' }}>{s.n}</div>
              {f >= tachas[i] && <svg width={300} height={600} style={{ position: 'absolute', left: x - 150, top: 780 }}><path d={`M20 40 L${20 + 260 * ent(f, tachas[i], tachas[i] + 5)} ${40 + 520 * ent(f, tachas[i], tachas[i] + 5)}`} stroke={ROJO} strokeWidth={26} strokeLinecap="round" /></svg>}
            </div>
          );
        })}
      </Cam>
      <Cuaderno x={CX - 40} y={CY + 120} rot={14} />
      <div style={{ position: 'absolute', left: CX - 70, top: CY + 260, background: '#FFF8E7', border: '4px solid #1a1a1a', fontFamily: FUENTE, fontWeight: 900, fontSize: 28, padding: '2px 10px' }}>#4</div>
      <Placa y={400} tema={T} />
      {tachas.map((t, i) => <React.Fragment key={i}><Sfx s="paper" at={t} v={0.6} /><Sfx s="stamp" at={t + 4} v={0.35} /></React.Fragment>)}
    </AbsoluteFill>
  );
};

// 3. La hoja con dos Martín
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const dos = w('dos');
  const lupa = interpolate(f, [0, 40], [1, 1.35], { ...cl, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Carton c="#7A5A3A" />
      <Cam zoom={lupa} origen="50% 58%">
        <div style={{ position: 'absolute', left: 130, top: 600, width: 820, height: 900, background: '#FFFDF5', border: '5px solid #1a1a1a', transform: 'rotate(-3deg)', boxShadow: '14px 14px 0 rgba(0,0,0,.35)' }}>
          {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 60 + i * 64, height: 3, background: '#9ec1e6' }} />)}
          <div style={{ position: 'absolute', left: 80, top: 0, bottom: 0, width: 3, background: '#e88' }} />
          {[['15:00', 'Nico'], ['16:00', 'Lucas ✗'], ['17:00', 'MARTÍN'], ['17:00', 'MARTÍN'], ['18:00', 'Fede']].map(([h, n], i) => {
            const marca = n === 'MARTÍN' && f >= dos;
            return <div key={i} style={{ position: 'absolute', left: 100, top: 120 + i * 128, fontFamily: '"Comic Sans MS", cursive', fontSize: 60, color: marca ? ROJO : '#233', transform: `rotate(${(random('l' + i) - 0.5) * 4}deg) scale(${marca ? interpolate(f - dos, [0, 4, 10], [1.4, 1.15, 1.1], cl) : 1})`, transformOrigin: 'left', textShadow: marca ? `0 0 20px ${ROJO}` : undefined }}>{h} {n}</div>;
          })}
          <div style={{ position: 'absolute', left: 520, top: 560, width: 220, height: 180, borderRadius: '50%', border: '18px solid rgba(110,70,30,.45)' }} />
        </div>
      </Cam>
      <div style={{ position: 'absolute', left: 560 + Math.sin(f / 8) * 30, top: 980, fontSize: 260, fontFamily: EMOJI, transform: 'rotate(-20deg)' }}>🔍</div>
      <Placa y={400} tema={T} />
      <Sfx s="whoosh" at={0} v={0.4} /><Sfx s="hit" at={dos} v={0.5} /><Sfx s="hit" at={dos + 6} v={0.5} />
    </AbsoluteFill>
  );
};

// 4. Llegan los dos, uno se va para siempre
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const choque = 16;
  const va = w('va');
  const siempre = w('siempre');
  const lx = interpolate(f, [0, choque], [-100, 420], cl), rx = interpolate(f, [0, choque], [1180, 660], cl);
  const sale = interpolate(f, [va, va + 24], [0, 1], cl);
  return (
    <AbsoluteFill>
      <Carton c="#C9A97A" />
      <div style={{ position: 'absolute', left: 300, top: 560, width: 480, height: 820, background: '#5c3b1f', border: '8px solid #1a1a1a' }} />
      <Cam golpes={[choque, siempre]} fuerza={26}>
        <Silueta x={lx} y={1380} s={1.2} color="#1a1a1a" />
        <Silueta x={rx + sale * 700} y={1380} s={1.2} color={f > w('calienta') ? ROJO : '#1a1a1a'} />
        {f > w('calienta') && f < va + 10 && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: 'absolute', left: rx - 40 + i * 20, top: 760 - ((f * 6 + i * 30) % 160), width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.7)' }} />)}
        <Txt x={540} y={760} size={90} at={choque} color="#fff">💥</Txt>
        {f >= siempre && <Emoji e="🔒" x={700} y={1000} size={240} at={siempre} />}
      </Cam>
      <Cuaderno x={CX} y={CY + 80} rot={-12} />
      <Placa y={400} tema={T} />
      <Sfx s="thud" at={choque} v={0.7} /><Sfx s="tension" at={w('calienta') - 4} v={0.3} /><Sfx s="door" at={va + 18} v={0.6} /><Sfx s="clang" at={siempre} v={0.4} />
    </AbsoluteFill>
  );
};

// 5. Se moja, se pierde, se lo lleva el socio
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const a = w('moja'), b = w('pierde'), c = w('lleva');
  const vin = f < b ? 0 : f < c ? 1 : 2;
  const t = f - [a, b, c][vin];
  return (
    <AbsoluteFill>
      <Carton c={['#7FB3D5', '#A9DFBF', '#F5CBA7'][vin]} />
      <Cam golpes={[a, b, c]} fuerza={18}>
        {vin === 0 && (<>
          <Cuaderno x={540} y={1050} s={2} rot={-6} />
          <div style={{ position: 'absolute', left: 620, top: 620, fontSize: 220, fontFamily: EMOJI, transform: `rotate(${interpolate(t, [0, 10], [0, 70], cl)}deg)` }}>🧉</div>
          <div style={{ position: 'absolute', left: 420, top: 900, width: interpolate(t, [4, 20], [0, 380], cl), height: interpolate(t, [4, 20], [0, 260], cl), borderRadius: '50%', background: 'rgba(90,120,40,.7)' }} />
        </>)}
        {vin === 1 && (<>
          <div style={{ position: 'absolute', left: 540 + t * 18, top: 1050 - t * 14, transform: `translate(-50%,-50%) rotate(${t * 18}deg)`, width: 300, height: 400, background: '#FFFDF5', border: '5px solid #1a1a1a' }} />
          {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: 'absolute', left: (t * 30 + i * 200) % 1200 - 100, top: 700 + i * 90, width: 200, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.8)' }} />)}
        </>)}
        {vin === 2 && (<>
          <Silueta x={760 - t * 10} y={1400} s={1.3} color="#1a1a1a" />
          <Cuaderno x={640 - t * 10} y={1080} s={1.2} rot={20} />
          <Txt x={760 - t * 10} y={700} size={60} at={c} color="#fff">SOCIO</Txt>
        </>)}
      </Cam>
      {vin !== 0 && vin !== 2 && <Cuaderno x={CX} y={CY + 60} s={0.8} />}
      <Placa y={400} tema={T} />
      <Sfx s="splash" at={a + 4} v={0.6} /><Sfx s="wind" at={b} v={0.5} /><Sfx s="paper" at={b + 2} v={0.4} /><Sfx s="whoosh" at={c} v={0.5} />
    </AbsoluteFill>
  );
};

// 6. Billetes con patitas: −$240.000 por año
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const w = useW();
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  const anio = w('ano');
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }} />;
  return (
    <AbsoluteFill>
      <Carton c="#C9A97A" />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1200, height: 160, background: '#8d8d8d', borderTop: '6px solid #1a1a1a' }} />
      {Array.from({ length: 24 }, (_, i) => {
        const x = 1200 - ((f * 9 + i * 95) % 1500);
        return <div key={i}><Billete2D x={x} y={1150 + Math.abs(Math.sin((f + i * 3) / 3)) * -20} s={0.6} />{[0, 1].map((k) => <div key={k} style={{ position: 'absolute', left: x - 20 + k * 30, top: 1180, width: 8, height: 40, background: '#1a1a1a', transform: `rotate(${Math.sin((f + i + k * 3) / 2) * 30}deg)`, transformOrigin: 'top' }} />)}</div>;
      })}
      <Contador desde={0} hasta={-K.corte * 24} at={w('son')} dura={Math.max(8, anio - w('son'))} y={880} size={190} color={ROJO} />
      <Cuaderno x={CX} y={CY - 380} s={0.9} rot={8} />
      <Placa y={400} tema={T} />
      <Rafaga s="tick" at={w('son')} n={8} cada={2} v={0.3} /><Sfx s="boom" at={anio} v={0.8} />
    </AbsoluteFill>
  );
};

// 7. GIRO: repaso de todas las escenas, con el cuaderno marcado; después se traga los billetes
const Repaso: React.FC<{ escena: number; frame: number; C: React.FC; cx: number; cy: number }> = ({ escena, frame, C, cx, cy }) => {
  const tl = useTL();
  return (
    <AbsoluteFill>
      <MudoCtx.Provider value>
        <Freeze frame={frame}><EscCtx.Provider value={tl.escenas[escena]}><C /></EscCtx.Provider></Freeze>
      </MudoCtx.Provider>
      <AbsoluteFill style={{ background: 'rgba(0,0,0,.35)' }} />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}><ellipse cx={cx} cy={cy} rx={170} ry={200} stroke={ROJO} strokeWidth={18} fill="none" /></svg>
    </AbsoluteFill>
  );
};

const Cuaderno3D: React.FC<{ abre: number; t: number }> = ({ abre, t }) => (
  <group rotation={[0.3, -0.4 + t * 0.2, 0]}>
    <mesh position={[0, -0.05, 0]}><boxGeometry args={[2.4, 0.08, 3.2]} /><meshStandardMaterial color="#2F5DA8" roughness={0.6} /></mesh>
    <mesh position={[0, 0.1, 0]}><boxGeometry args={[2.3, 0.24, 3.1]} /><meshStandardMaterial color="#FFFDF5" roughness={0.9} /></mesh>
    <group position={[-1.2, 0.25, 0]} rotation={[0, 0, abre]}>
      <mesh position={[1.2, 0, 0]}><boxGeometry args={[2.4, 0.08, 3.2]} /><meshStandardMaterial color="#2F5DA8" roughness={0.6} /></mesh>
      {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[0.3 + i * 0.28, -0.15, 1.55]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.1, 0.3, 4]} /><meshStandardMaterial color="#fff" /></mesh>)}
    </group>
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-1.2, 0.12, -1.4 + i * 0.35]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.14, 0.03, 8, 20]} /><meshStandardMaterial {...MAT.cromo} /></mesh>)}
  </group>
);

const S6: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const cuad = w('cuaderno');
  const cortes = [0, 7, 14, 21];
  const fin = 28;
  const reps: { esc: number; fr: number; C: React.FC; x: number; y: number }[] = [
    { esc: 0, fr: 70, C: S0, x: CX + 60, y: 950 }, { esc: 1, fr: 80, C: S1, x: CX - 40, y: CY + 120 }, { esc: 3, fr: 60, C: S3, x: CX, y: CY + 80 }, { esc: 5, fr: 50, C: S5, x: CX, y: CY - 380 },
  ];
  const k = cortes.filter((c) => f >= c).length - 1;
  const abre = 0.3 + Math.abs(Math.sin(f / 4)) * 0.9;
  return (
    <AbsoluteFill style={{ background: '#140a05' }}>
      {f < fin && <Repaso escena={reps[k].esc} frame={reps[k].fr} C={reps[k].C} cx={reps[k].x} cy={reps[k].y} />}
      {f >= fin && (
        <AbsoluteFill>
          <Rayos y={1000} color="rgba(215,38,61,.25)" vel={0.8} />
          <Cam golpes={[fin, cuad]} fuerza={34}>
            <Lienzo3D cam={[0, 4.5, 6]} mira={[0, 0.5, 0]} fov={45}>
              <ambientLight intensity={0.6} /><directionalLight position={[3, 6, 4]} intensity={3} /><pointLight position={[0, 2, 2]} intensity={30} color="#ff3040" />
              <Cuaderno3D abre={abre} t={(f - fin) / 30} />
              {Array.from({ length: 10 }, (_, i) => {
                const tt = ((f - fin) / 30 + i * 0.25) % 2.5;
                return <Billete key={i} monto="$" position={[Math.sin(i * 2) * (2.5 - tt), 3 - tt * 1.4, Math.cos(i * 2) * (2.5 - tt)]} rotation={[tt * 4, tt * 3 + i, 0]} scale={0.6 * Math.max(0.1, 1 - tt / 2.5)} />;
              })}
            </Lienzo3D>
          </Cam>
          {Array.from({ length: 16 }, (_, i) => {
            const a = (f - fin) / 10 + i;
            return <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(a) * (200 + i * 20), top: 1000 + Math.sin(a) * (300 + i * 15), width: 90, height: 120, background: '#FFFDF5', border: '3px solid #1a1a1a', transform: `rotate(${a * 60}deg)`, opacity: 0.85 }} />;
          })}
        </AbsoluteFill>
      )}
      <Placa y={360} tema={{ ...T, bg: '#fff' }} max={150} />
      <Flash at={fin} color={ROJO} max={0.6} />
      {cortes.map((c) => <Sfx key={c} s="hit" at={c} v={0.5} />)}
      <Sfx s="braam" at={fin} v={0.9} /><Sfx s="paper" at={fin + 4} v={0.6} /><Sfx s="boom" at={cuad} v={0.6} />
    </AbsoluteFill>
  );
};

// 8. App: el horario ocupado no se puede pisar
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const intento = w('nadie');
  const g = spring({ frame: f, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(160deg,#FFF1D6,#F6C28B)' }} />
      {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(i + f / 30) * 460, top: 960 + Math.sin(i * 1.7 + f / 25) * 700, width: 120, height: 120, background: ['#FFFDF5', '#9ec1e6', '#F5CBA7'][i % 3], border: '4px solid #1a1a1a', transform: `rotate(${f * 2 + i * 40}deg) scale(${g})`, clipPath: 'polygon(50% 0,100% 50%,50% 100%,0 50%)' }} />)}
      <Celular y={1000} s={1.1} rotY={interpolate(g, [0, 1], [90, -6])}>
        <PAgenda filas={[{ h: '17:00', n: 'Martín' }, { h: '17:30', n: 'Libre' }, { h: '18:00', n: 'Fede' }, { h: '18:30', n: 'Libre' }]} intento={intento} bloqueada={0} />
      </Celular>
      <Placa y={300} tema={T} />
      <Sfx s="paper" at={0} v={0.5} /><Sfx s="whoosh" at={2} v={0.4} /><Sfx s="error" at={intento} v={0.4} /><Sfx s="clang" at={intento + 2} v={0.3} />
    </AbsoluteFill>
  );
};

// 9. Cuaderno vs App
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const app = w('app');
  const casa = w('casa');
  return (
    <AbsoluteFill>
      <Split at={0} gana={app} tIzq="CUADERNO" tDer="APP" colIzq={ROJO} colDer="#2F5DA8" fondoIzq="#7A5A3A" fondoDer="#FFF1D6"
        izq={<AbsoluteFill><Cuaderno x={540} y={980} s={2.2} rot={-8} />{[0, 1].map((k) => <Silueta key={k} x={440 + k * 200} y={1400} s={0.8} color={ROJO} />)}</AbsoluteFill>}
        der={<AbsoluteFill>
          <Celular y={950} s={0.75}><PAgenda filas={[{ h: '17:00', n: 'Martín ✓' }, { h: '18:00', n: 'Fede' }]} /></Celular>
          {f >= casa && <Emoji e="🛋️" x={540} y={1380} size={200} at={casa} />}
        </AbsoluteFill>} />
      <Sfx s="zap" at={4} v={0.5} /><Sfx s="check" at={app + 4} v={0.5} /><Sfx s="pop" at={casa} v={0.5} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => <Cierre color="#2F5DA8" texto="#1a1a1a" borde="#FFF8E7" fondo={<Carton c="#E9C46A" />} confeti={['#2F5DA8', ROJO, '#fff']} sub="y te paso la app 👇" />;

export const V03: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={COL.amarillo} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]}
    trans={[slide({ direction: 'from-right' }), zoomBlur(), flip({ direction: 'from-right' }), pushCut(), clockWipe({ width: 1080, height: 1920 }), undefined, flip({ direction: 'from-bottom' }), wipe({ direction: 'from-left' }), iris({ width: 1080, height: 1920 })]} />
);
