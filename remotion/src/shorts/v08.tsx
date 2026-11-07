// 08 · "Si sos barbero, este video te va a doler" — calculadora 3D monstruo que crece; en el giro, una balanza: todo contra un corte.
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { useEsc, useW } from '../lib/contexto';
import { Placa, type TemaPlaca } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Contador, Rayo, Rayos, Txt, Emoji, Silueta, Onda, cl, COL, ent, pesos } from '../lib/fx';
import { Celular, PReserva, PFila, PNoVolvieron } from '../lib/Celular';
import { Split } from '../lib/Split';
import { Cierre } from '../lib/Cierre';
import { Lienzo3D, Cartel, Tijera, Estallido, SillaBarbero, MAT } from '../lib/tres';
import { FUENTE, EMOJI } from '../lib/fuentes';
import { cargarConfig } from '../lib/config';
import { slide, wipe, zoomBlur, iris, pushCut, whipV, flashT, spin, glitchT } from '../lib/transiciones';

const K = cargarConfig();
const AMA = '#FFD000', ROJO = '#FF2A2A';
const T: TemaPlaca = { bg: 'rgba(10,10,10,.92)', borde: AMA, color: '#fff', acento: AMA, sombra: 'rgba(255,208,0,.4)' };
const TR: TemaPlaca = { ...T, borde: ROJO, acento: ROJO };

/** Fondo industrial: franjas de peligro y balizas que giran. */
const Galpon: React.FC<{ alarma?: boolean }> = ({ alarma = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#0c0c0e' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 60, background: `repeating-linear-gradient(45deg, ${AMA} 0 40px, #111 40px 80px)` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1480, height: 60, background: `repeating-linear-gradient(45deg, ${AMA} 0 40px, #111 40px 80px)` }} />
      {alarma && [180, 900].map((x, i) => <div key={i} style={{ position: 'absolute', left: x - 700, top: 120 - 700, width: 1400, height: 1400, background: `conic-gradient(from ${f * 14 + i * 180}deg, rgba(255,42,42,.35) 0deg 30deg, transparent 30deg 360deg)`, borderRadius: '50%' }} />)}
    </AbsoluteFill>
  );
};

/** Calculadora 3D: cuerpo, pantalla con el número y teclado. `escala` crece con cada cuenta. */
const Calculadora: React.FC<{ numero: string; escala?: number; apretada?: number; rot?: number }> = ({ numero, escala = 1, apretada = -1, rot = 0 }) => (
  <group scale={escala} rotation={[-0.35, rot, 0]}>
    <mesh><boxGeometry args={[3, 4.4, 0.5]} /><meshStandardMaterial color="#2a2a30" metalness={0.3} roughness={0.4} /></mesh>
    <Cartel texto={numero} w={2.6} h={1} bg="#1a0505" color={ROJO} size={110} position={[0, 1.4, 0.28]} grosor={0.04} emisivo />
    {Array.from({ length: 16 }, (_, i) => {
      const x = (i % 4) - 1.5, y = -Math.floor(i / 4);
      const baja = i === apretada ? -0.12 : 0;
      return <mesh key={i} position={[x * 0.62, 0.35 + y * 0.6, 0.3 + baja]}><boxGeometry args={[0.5, 0.48, 0.18]} /><meshStandardMaterial color={i % 4 === 3 ? '#FF8A00' : i === 15 ? AMA : '#e8e8ee'} roughness={0.5} /></mesh>;
    })}
  </group>
);

// 1. Gancho: la pantalla se rompe como un vidrio
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const doler = w('doler');
  const lineas = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + random('c' + i) * 0.4;
    let x = 540, y = 960, d = `M${x},${y}`;
    const L = interpolate(f, [-8, 10 + i], [0, 1], cl);
    for (let k = 0; k < 7; k++) { x += Math.cos(a + (random('k' + i + k) - 0.5) * 0.8) * 120 * L; y += Math.sin(a + (random('j' + i + k) - 0.5) * 0.8) * 120 * L; d += ` L${x},${y}`; }
    return d;
  });
  return (
    <AbsoluteFill>
      <Galpon />
      <Cam golpes={[0, 6, doler]} fuerza={34}>
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {lineas.map((d, i) => <path key={i} d={d} stroke="#fff" strokeWidth={6} fill="none" opacity={0.9} />)}
          <circle cx={540} cy={960} r={interpolate(f, [-4, 8], [20, 60], cl)} fill="rgba(255,255,255,.9)" />
        </svg>
      </Cam>
      <Particulas at={-6} x={540} y={960} n={40} colores={['#fff', '#cde']} vel={30} grav={0.8} seed="vidrio0" dura={40} />
      <Placa y={380} tema={TR} max={150} />
      <Sfx s="glass" at={0} v={0.8} /><Sfx s="boom" at={doler} v={0.8} /><Sfx s="pop" at={w('cuenta')} v={0.5} />
    </AbsoluteFill>
  );
};

const Escena3D: React.FC<{ numero: string; escala: number; apretada?: number; children?: React.ReactNode; cam?: [number, number, number] }> = ({ numero, escala, apretada, children, cam = [0, 1, 11] }) => {
  const f = useCurrentFrame();
  return (
    <Lienzo3D cam={cam} mira={[0, 0, 0]} fov={45}>
      <ambientLight intensity={0.5} /><directionalLight position={[3, 6, 8]} intensity={3} /><pointLight position={[-4, 2, 4]} intensity={60} color={ROJO} />
      <group position={[0, -0.6, 0]} rotation={[0, Math.sin(f / 30) * 0.15, 0]}><Calculadora numero={numero} escala={escala} apretada={apretada} /></group>
      {children}
    </Lienzo3D>
  );
};

// 2. Te clavan dos por semana: dos sillas caen sobre las teclas
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const caen = [w('clavan'), w('dos') + 4];
  return (
    <AbsoluteFill>
      <Galpon />
      <Cam golpes={caen} fuerza={24}>
        <Escena3D numero="0" escala={0.9} apretada={f >= caen[1] ? 5 : f >= caen[0] ? 6 : -1}>
          {caen.map((c, i) => <SillaBarbero key={i} position={[-0.9 + i * 1.8, interpolate(f, [c - 10, c], [8, 0.8], { ...cl, easing: Easing.in(Easing.quad) }), 1.2]} rotation={[0.3, i ? -0.6 : 0.6, 0]} scale={0.45} />)}
        </Escena3D>
      </Cam>
      <Placa y={380} tema={T} />
      {caen.map((c, i) => <Sfx key={i} s="thud" at={c} v={0.8} />)}
    </AbsoluteFill>
  );
};

// 3. $80.000 por mes
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [2, 24], [0, K.corte * 8], cl));
  return (
    <AbsoluteFill>
      <Galpon />
      <Cam golpes={[24]} fuerza={22}><Escena3D numero={'-' + v.toLocaleString('es-AR')} escala={1.05} apretada={f % 6 < 3 ? Math.floor(f / 6) % 16 : -1} /></Cam>
      <Placa y={360} tema={TR} />
      <Rafaga s="tick" at={2} n={10} cada={2} v={0.35} /><Sfx s="error" at={24} v={0.6} />
    </AbsoluteFill>
  );
};

// 4. Uno de la fila por día: $240.000 más (cinta transportadora)
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const mas = w('mas');
  const v = Math.round(interpolate(f, [mas - 20, mas + 4], [K.corte * 8, K.corte * 32], cl));
  return (
    <AbsoluteFill>
      <Galpon />
      <Cam golpes={[mas + 4]} fuerza={26}>
        <Escena3D numero={'-' + v.toLocaleString('es-AR')} escala={1.3} cam={[0, 1.5, 13]} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1300, height: 50, background: `repeating-linear-gradient(90deg, #555 0 30px, #333 30px 60px)`, backgroundPosition: `${-f * 12}px 0` }} />
        {Array.from({ length: 8 }, (_, i) => <Silueta key={i} x={((f * 12 + i * 160) % 1400) - 160} y={1300} s={0.5} color="#ddd" />)}
      </Cam>
      <Placa y={360} tema={TR} />
      <Sfx s="rumble" at={0} v={0.3} /><Rafaga s="tick" at={mas - 20} n={10} cada={2} v={0.3} /><Sfx s="clang" at={mas + 4} v={0.5} />
    </AbsoluteFill>
  );
};

// 5. Tres que no volvieron: $60.000 (la calculadora rompe el techo)
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const golpes = [w('tres'), w('tres') + 5, w('tres') + 10];
  const v = Math.round(interpolate(f, [golpes[0], golpes[2] + 10], [K.corte * 32, K.corte * 38], cl));
  return (
    <AbsoluteFill>
      <Galpon />
      <Cam golpes={golpes} fuerza={22} y={interpolate(f, [0, 90], [0, 140])}>
        <Escena3D numero={'-' + v.toLocaleString('es-AR')} escala={interpolate(f, [0, 90], [1.5, 1.9], cl)} cam={[0, 1.5, 13]} />
        {golpes.map((g, i) => f >= g - 6 && <div key={i} style={{ position: 'absolute', left: 200 + i * 240, top: interpolate(f, [g - 6, g], [-200, 1150 - i * 30], cl), background: '#fff', border: '6px solid #000', fontFamily: FUENTE, fontWeight: 900, fontSize: 40, padding: '8px 14px', transform: `rotate(${(i - 1) * 8}deg)` }}>NO VOLVIÓ</div>)}
      </Cam>
      {f > golpes[2] && <Particulas at={golpes[2] + 4} x={540} y={80} n={50} colores={['#888', '#bbb', AMA]} seed="techo" vel={20} />}
      <Placa y={360} tema={TR} />
      {golpes.map((g, i) => <Sfx key={i} s="stamp" at={g} v={0.6} />)}<Sfx s="rumble" at={golpes[2] + 4} v={0.5} />
    </AbsoluteFill>
  );
};

// 6. Total: $380.000 por mes (y la alarma se corta)
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const w = useW();
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  const total = w('total');
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }} />;
  return (
    <AbsoluteFill>
      <Galpon />
      <Cam golpes={[total + 2]} fuerza={40}>
        <Escena3D numero={'-' + (K.corte * 38).toLocaleString('es-AR')} escala={2.4} cam={[0, 2.5, 15]} />
      </Cam>
      <Rayo x1={60} y1={1180} x2={1020} y2={1180} at={total} dura={14} color={AMA} seed="raya" />
      <Contador desde={0} hasta={-K.corte * 38} at={total} dura={12} y={1080} size={170} color={ROJO} sub="POR MES" />
      <div style={{ position: 'absolute', left: 140 + f * 3, top: 1320, background: '#DCF8C6', border: '4px solid #000', borderRadius: 20, padding: '6px 16px', fontFamily: FUENTE, fontWeight: 800, fontSize: 30, opacity: f > w('whatsapp') ? 1 : 0 }}>¿tenés turno? 💬</div>
      <Placa y={360} tema={TR} />
      <Sfx s="zap" at={total} v={0.6} /><Sfx s="boom" at={total + 2} v={0.9} /><Sfx s="tape_stop" at={pausa - 18} v={0.4} />
    </AbsoluteFill>
  );
};

// 7. GIRO: la balanza. Todo eso contra… un corte.
const Balanza: React.FC<{ incl: number; t: number }> = ({ incl, t }) => (
  <group position={[0, -1.2, 0]}>
    <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.12, 0.18, 3.2, 20]} /><meshStandardMaterial {...MAT.oro} /></mesh>
    <mesh position={[0, 0, 0]}><cylinderGeometry args={[1, 1.2, 0.25, 32]} /><meshStandardMaterial {...MAT.oro} /></mesh>
    <group position={[0, 3.2, 0]} rotation={[0, 0, incl]}>
      <mesh><boxGeometry args={[6, 0.14, 0.2]} /><meshStandardMaterial {...MAT.oro} /></mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 2.8, 0, 0]} rotation={[0, 0, -incl]}>
          <mesh position={[0, -1.1, 0]}><cylinderGeometry args={[0.01, 0.01, 2.2, 4]} /><meshStandardMaterial color="#ccc" /></mesh>
          <mesh position={[0, -2.2, 0]}><cylinderGeometry args={[1.1, 0.9, 0.12, 32]} /><meshStandardMaterial {...MAT.oro} /></mesh>
          {s < 0 && Array.from({ length: 14 }, (_, i) => <mesh key={i} position={[(i % 4 - 1.5) * 0.4, -1.95 + Math.floor(i / 4) * 0.32, (i % 2) * 0.3 - 0.15]} rotation={[0, i, 0]}><boxGeometry args={[0.55, 0.28, 0.3]} /><meshStandardMaterial color={ROJO} /></mesh>)}
          {s > 0 && <Tijera abre={0.4} position={[0, -1.4, 0]} rotation={[0, t * 2, Math.PI / 2]} scale={0.35} />}
        </group>
      ))}
    </group>
  </group>
);

const S6: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const corte = w('corte');
  const incl = f < corte ? 0.45 : 0.45 * Math.cos((f - corte) / 4) * Math.exp(-(f - corte) / 14);
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, #2a2200, #000 70%)' }}>
      <Rayos y={950} color="rgba(255,208,0,.16)" vel={0.7} />
      <Cam golpes={[0, corte]} fuerza={34}>
        <Lienzo3D cam={[Math.sin(t * 0.4) * 3, 3, 17]} mira={[0, 1.2, 0]} fov={45}>
          <ambientLight intensity={0.6} /><directionalLight position={[3, 6, 8]} intensity={3} /><pointLight position={[0, 4, 4]} intensity={60} color={AMA} />
          <Balanza incl={incl} t={t} />
          <group position={[0, 2, -3]}><Estallido t={Math.min(1.6, f / 25)} n={50} mat={{ color: '#e8e8ee', roughness: 0.5 }} seed="teclas" radio={1.5} tam={0.4} /></group>
        </Lienzo3D>
      </Cam>
      <Txt x={250} y={760} size={64} color={ROJO} at={6}>{pesos(-K.corte * 38)}</Txt>
      <Txt x={830} y={760} size={64} color={AMA} at={corte}>1 CORTE</Txt>
      <Flash at={0} max={1} /><Flash at={corte} color={AMA} max={0.5} />
      <Placa y={360} tema={{ bg: '#fff', borde: '#000', color: '#000', acento: '#E0A800' }} max={150} />
      <Sfx s="glass" at={0} v={0.6} /><Sfx s="braam" at={0} v={0.9} /><Sfx s="clang" at={corte} v={0.8} /><Sfx s="choir" at={corte + 4} v={0.4} />
    </AbsoluteFill>
  );
};

// 8. $10.000 por mes: seña, fila virtual y los que no volvieron
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const p1 = w('sena'), p2 = w('fila'), p3 = w('volvieron');
  const k = f < p2 ? 0 : f < p3 ? 1 : 2;
  const g = spring({ frame: f - [0, p2, p3][k], fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Galpon alarma={false} />
      <Rayos y={1000} color="rgba(255,208,0,.12)" />
      <Celular y={1030} s={1.0} rotY={interpolate(g, [0, 1], [70, -6])}>
        {k === 0 && <PReserva toque={-1} sena={0} montoSena={K.sena} />}
        {k === 1 && <PFila pasos={[999]} />}
        {k === 2 && <PNoVolvieron filas={[{ n: 'Juan', d: 63, at: -1 }, { n: 'Lucas', d: 41, at: -1 }]} />}
      </Celular>
      <div style={{ position: 'absolute', left: 780, top: 640, transform: `rotate(12deg) scale(${spring({ frame: f - 2, fps, config: { damping: 9 } })})`, background: AMA, color: '#000', fontFamily: FUENTE, fontWeight: 900, fontSize: 56, padding: '10px 20px', border: '6px solid #000', borderRadius: 14 }}>{pesos(K.mensual)}<div style={{ fontSize: 28 }}>por mes</div></div>
      <Placa y={300} tema={T} />
      <Sfx s="cash" at={2} v={0.6} />{[p1, p2, p3].map((p, i) => <Sfx key={i} s="whoosh" at={p} v={0.4} />)}
    </AbsoluteFill>
  );
};

// 9. Un corte y está pagada
const S8: React.FC = () => {
  const w = useW();
  const pag = w('pagada');
  return (
    <AbsoluteFill>
      <Split at={0} gana={pag} tIzq="PERDÉS" tDer="1 CORTE" colIzq={ROJO} colDer={AMA} fondoIzq="#1a0505" fondoDer="#1a1600"
        izq={<AbsoluteFill><Txt x={540} y={900} size={110} color={ROJO} at={4}>{pesos(-K.corte * 38)}</Txt><Txt x={540} y={1030} size={50} color="#fff" at={8}>POR MES</Txt></AbsoluteFill>}
        der={<AbsoluteFill><Emoji e="✂️" x={540} y={900} size={260} at={4} /><Txt x={540} y={1120} size={150} color={COL.verde} at={pag}>✓</Txt></AbsoluteFill>} />
      <Sfx s="zap" at={4} v={0.5} /><Sfx s="check" at={pag} v={0.7} /><Sfx s="cash" at={pag + 4} v={0.5} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => (
  <AbsoluteFill>
    <Cierre color={AMA} fondo={<Galpon alarma={false} />} confeti={[AMA, '#fff', ROJO]} sub="y pasame tus números 👇" />
    <div style={{ position: 'absolute', left: 60, top: 1160, width: 840, textAlign: 'center', fontFamily: FUENTE, fontWeight: 700, fontSize: 30, color: '#bbb' }}>Ejemplo con corte a {pesos(K.corte)}</div>
  </AbsoluteFill>
);

export const V08: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={AMA} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]}
    trans={[whipV(1), zoomBlur(), slide({ direction: 'from-right' }), whipV(-1), glitchT(), undefined, spin(), wipe({ direction: 'from-right' }), iris({ width: 1080, height: 1920 })]} />
);
