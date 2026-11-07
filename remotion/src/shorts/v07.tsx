// 07 · "Tu peor día no es el martes" — la semana es una montaña rusa 3D; en el giro el carrito se descarrila en el sábado.
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { useEsc, useW } from '../lib/contexto';
import { Placa, type TemaPlaca } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Contador, Rayos, Txt, Emoji, Silueta, Confeti, Onda, cl, COL, ent } from '../lib/fx';
import { Celular, PPuntos } from '../lib/Celular';
import { Cierre } from '../lib/Cierre';
import { Lienzo3D, Cartel, MAT } from '../lib/tres';
import { FUENTE, EMOJI } from '../lib/fuentes';
import { cargarConfig } from '../lib/config';
import { slide, wipe, flip, zoomBlur, iris, whipV, whip, flashT, clockWipe } from '../lib/transiciones';

const K = cargarConfig();
const AMA = '#FFE14D', MAG = '#FF2BD6', CIAN = '#2BF0FF';
const T: TemaPlaca = { bg: 'rgba(25,0,40,.9)', borde: AMA, color: '#fff', acento: AMA, sombra: 'rgba(255,225,77,.5)' };
const DIAS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const ALTOS = [2.2, 0.4, 1.4, 2.0, 3.2, 7.5, 1.2];

/** Curva de la montaña rusa: un punto por día (más altos los días con más gente). `plano` 0→1 la empareja. */
const useCurva = (plano = 0) => useMemo(() => {
  const pts: THREE.Vector3[] = [new THREE.Vector3(-16, 1, 0)];
  ALTOS.forEach((h, i) => {
    const y = h * (1 - plano) + 2.4 * plano;
    pts.push(new THREE.Vector3(-12 + i * 4, y, Math.sin(i) * 1.2));
    pts.push(new THREE.Vector3(-10 + i * 4, (y + ((ALTOS[i + 1] ?? 1.5) * (1 - plano) + 2.4 * plano)) / 2 - 0.3, Math.sin(i + 0.5) * 1.2));
  });
  pts.push(new THREE.Vector3(18, 1, 0));
  return new THREE.CatmullRomCurve3(pts);
}, [plano]);

const Via: React.FC<{ curva: THREE.CatmullRomCurve3 }> = ({ curva }) => {
  const tubo = useMemo(() => new THREE.TubeGeometry(curva, 300, 0.12, 8, false), [curva]);
  const off = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curva.getPoints(120).map((p) => p.clone().add(new THREE.Vector3(0, 0, 0.7)))), 300, 0.12, 8, false), [curva]);
  const postes = curva.getSpacedPoints(40);
  return (
    <group>
      <mesh geometry={tubo}><meshStandardMaterial color={MAG} emissive={MAG} emissiveIntensity={0.6} metalness={0.5} roughness={0.3} /></mesh>
      <mesh geometry={off}><meshStandardMaterial color={CIAN} emissive={CIAN} emissiveIntensity={0.6} metalness={0.5} roughness={0.3} /></mesh>
      {postes.map((p, i) => <mesh key={i} position={[p.x, (p.y - 3) / 2, p.z + 0.35]}><cylinderGeometry args={[0.06, 0.06, Math.max(0.1, p.y + 3), 6]} /><meshStandardMaterial color="#555" metalness={0.8} roughness={0.3} /></mesh>)}
    </group>
  );
};

const Carrito: React.FC<{ curva: THREE.CatmullRomCurve3; u: number; gente?: number; suelto?: { t: number } }> = ({ curva, u, gente = 4, suelto }) => {
  const p = curva.getPointAt(Math.min(0.999, Math.max(0, u)));
  const tg = curva.getTangentAt(Math.min(0.999, Math.max(0, u)));
  const rotZ = Math.atan2(tg.y, tg.x);
  const st = suelto?.t ?? 0;
  return (
    <group position={[p.x + st * 3, p.y + 0.45 + st * 4 - st * st * 2.5, p.z + 0.35]} rotation={[st * 3, st * 2, rotZ + st * 4]}>
      <mesh><boxGeometry args={[1.6, 0.6, 1]} /><meshStandardMaterial color={AMA} metalness={0.4} roughness={0.3} /></mesh>
      {Array.from({ length: gente }, (_, i) => (
        <group key={i} position={[-0.55 + i * 0.37 + st * (i - 1.5) * 3, 0.55 + st * (2 + i), st * (i % 2 ? 2 : -2)]} rotation={[st * 5 * i, 0, st * 6]}>
          <mesh><boxGeometry args={[0.28, 0.4, 0.28]} /><meshStandardMaterial color={['#2F6BFF', '#2BD96B', '#FF8A00', '#fff'][i % 4]} /></mesh>
          <mesh position={[0, 0.32, 0]}><sphereGeometry args={[0.14, 12, 10]} /><meshStandardMaterial color="#F2C9A0" /></mesh>
        </group>
      ))}
    </group>
  );
};

const Parque: React.FC<{ cam: [number, number, number]; mira: [number, number, number]; u: number; plano?: number; suelto?: { t: number }; fov?: number; gente?: number }> = ({ cam, mira, u, plano = 0, suelto, fov = 50, gente }) => {
  const curva = useCurva(plano);
  return (
    <Lienzo3D cam={cam} mira={mira} fov={fov} fondo="#12002a" niebla={['#12002a', 18, 55]}>
      <ambientLight intensity={0.5} /><directionalLight position={[5, 10, 8]} intensity={2} /><pointLight position={[8, 9, 4]} intensity={80} color={MAG} /><pointLight position={[-8, 5, 4]} intensity={60} color={CIAN} />
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[80, 40]} /><meshStandardMaterial color="#1a0a33" /></mesh>
      <Via curva={curva} />
      <Carrito curva={curva} u={u} suelto={suelto} gente={gente} />
      {DIAS.map((d, i) => <Cartel key={d} texto={d} w={1.6} h={0.7} size={170} bg={d === 'SÁB' ? MAG : d === 'MAR' ? '#555' : '#fff'} color={d === 'SÁB' ? '#fff' : '#000'} position={[-12 + i * 4, ALTOS[i] * (1 - plano) + 2.4 * plano + 1.4, 1.5]} emisivo={d === 'SÁB'} />)}
    </Lienzo3D>
  );
};

/** Luces de feria alrededor del borde. */
const Luces: React.FC = () => {
  const f = useCurrentFrame();
  return <>{Array.from({ length: 24 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 20 + (i % 12) * 88, top: i < 12 ? 20 : 1520, width: 26, height: 26, borderRadius: '50%', background: (Math.floor(f / 3) + i) % 3 === 0 ? AMA : '#553', boxShadow: (Math.floor(f / 3) + i) % 3 === 0 ? `0 0 20px ${AMA}` : undefined }} />)}</>;
};

// 1. Gancho: subida en el carrito
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const u = interpolate(f, [-10, 120], [0.4, 0.66], cl);
  const curva = useCurva(0);
  const p = curva.getPointAt(u);
  return (
    <AbsoluteFill>
      <Cam golpes={[w('martes')]} fuerza={16}>
        <Parque cam={[p.x - 3.5, p.y + 2.2, p.z + 6]} mira={[p.x + 3, p.y + 1.5, 0]} u={u} fov={58} />
      </Cam>
      <Luces />
      <Placa y={360} tema={T} />
      <Rafaga s="tick" at={0} n={16} cada={5} v={0.35} /><Sfx s="hit" at={w('martes')} v={0.6} /><Sfx s="riser" at={30} v={0.3} />
    </AbsoluteFill>
  );
};

// 2. Martes: un grillo y la tele
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(#2a2a30,#0d0d10)' }}>
      <Cam zoom={interpolate(f, [0, 110], [1, 1.25])} origen="45% 60%">
        <div style={{ position: 'absolute', left: 140, top: 720, width: 380, height: 300, background: '#222', border: '16px solid #555', borderRadius: 20, overflow: 'hidden' }}>
          <svg width={350} height={270}><filter id="tv"><feTurbulence baseFrequency="0.9" seed={f % 7} /></filter><rect width={350} height={270} filter="url(#tv)" /></svg>
        </div>
        <div style={{ position: 'absolute', left: 600, top: 820, width: 300, height: 480, background: '#444', borderRadius: 20 }} />
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>{Array.from({ length: 8 }, (_, i) => <line key={i} x1={900} y1={820} x2={900 - Math.cos(i / 2.5) * 260} y2={820 + Math.sin(i / 2.5) * 260} stroke="rgba(255,255,255,.4)" strokeWidth={2} />)}{[80, 150, 220].map((r) => <circle key={r} cx={900} cy={820} r={r} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth={2} strokeDasharray="4 8" />)}</svg>
        <Emoji e="🦗" x={720} y={1100 + Math.abs(Math.sin(f / 6)) * -30} size={220} at={w('grillo')} />
      </Cam>
      <Placa y={380} tema={{ ...T, borde: '#888', acento: '#aaa' }} />
      <Sfx s="cricket" at={w('grillo')} v={0.6} /><Sfx s="cricket" at={w('grillo') + 30} v={0.5} /><Sfx s="wind" at={0} v={0.3} />
    </AbsoluteFill>
  );
};

// 3. Sábado: el local explota
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const exp = w('explota');
  const infla = f < exp ? 1 + Math.sin(f / 2) * 0.02 + (f / exp) * 0.12 : 1.2;
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(#ff7a00,#c4005a)' }}>
      <Cam golpes={[exp]} fuerza={36}>
        <div style={{ position: 'absolute', left: 140, top: 640, width: 800, height: 760, transform: `scale(${infla})`, opacity: f < exp ? 1 : 0, background: '#fff3', border: '16px solid #fff', borderRadius: 40 }}>
          {Array.from({ length: 12 }, (_, i) => <Silueta key={i} x={90 + (i % 6) * 125} y={330 + Math.floor(i / 6) * 330} s={0.62} color={['#2F6BFF', '#1a1a1a', '#6C2BFF'][i % 3]} />)}
        </div>
        {f >= exp && Array.from({ length: 12 }, (_, i) => <Silueta key={i} x={540 + Math.cos(i) * (f - exp) * 20} y={1100 + Math.sin(i) * (f - exp) * 20} s={0.6} color="#1a1a1a" style={{ transform: `translate(-50%,-100%) scale(.6) rotate(${(f - exp) * (i % 2 ? 12 : -12)}deg)` }} />)}
      </Cam>
      <Particulas at={exp} x={540} y={1000} n={80} seed="exp" vel={40} />
      <Onda at={exp} x={540} y={1000} />
      <Placa y={380} tema={T} />
      <Sfx s="crowd" at={0} v={0.5} /><Sfx s="boom" at={exp} v={0.8} /><Sfx s="firework" at={exp} v={0.4} />
    </AbsoluteFill>
  );
};

// 4. El alquiler, los 7 días
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const a = w('alquiler');
  const golpes = Array.from({ length: 7 }, (_, i) => a + 4 + i * 5);
  return (
    <AbsoluteFill style={{ background: '#1a0a33' }}>
      <Cam golpes={golpes} fuerza={14}>
        {DIAS.map((d, i) => {
          const g = golpes[i];
          const y = interpolate(f, [g - 6, g], [-300, 900], { ...cl, easing: Easing.in(Easing.quad) });
          return (
            <div key={d}>
              <div style={{ position: 'absolute', left: 60 + i * 130, top: 1150, width: 110, textAlign: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 34, color: d === 'SÁB' ? MAG : '#fff' }}>{d}</div>
              {f >= g - 6 && <div style={{ position: 'absolute', left: 50 + i * 130, top: y, width: 130, height: 220, background: '#fff', border: '6px solid #000', fontFamily: FUENTE, fontWeight: 900, fontSize: 26, padding: 8, transform: `rotate(${(i % 2 ? 4 : -4)}deg)` }}>ALQUILER<div style={{ color: '#E0004D', fontSize: 40, marginTop: 30 }}>$</div></div>}
            </div>
          );
        })}
      </Cam>
      <Placa y={380} tema={T} />
      {golpes.map((g, i) => <Sfx key={i} s="stamp" at={g} v={0.45} />)}
    </AbsoluteFill>
  );
};

// 5. "Menos mal que está el sábado" (sube lento, fuegos artificiales arriba)
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const u = interpolate(f, [0, 110], [0.62, 0.71], cl);
  return (
    <AbsoluteFill>
      <Parque cam={[14, 6, 16]} mira={[7, 6, 0]} u={u} fov={50} />
      <Luces />
      {[20, 45, 70].map((a, i) => <Particulas key={i} at={a} x={300 + i * 250} y={560} n={40} seed={'fw' + i} vel={18} grav={0.4} colores={[AMA, MAG, CIAN, '#fff']} forma="circulo" tam={14} />)}
      <Placa y={360} tema={T} />
      <Rafaga s="tick" at={0} n={14} cada={7} v={0.3} />{[20, 45, 70].map((a) => <Sfx key={a} s="firework" at={a} v={0.25} />)}
    </AbsoluteFill>
  );
};

// 6. En la cima: 4 se bajan y se van — −$40.000 por sábado
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const w = useW();
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  const va = w('va');
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }} />;
  return (
    <AbsoluteFill>
      <Parque cam={[9, 9.5, 9]} mira={[8, 7, 0]} u={0.712} fov={52} gente={f > va ? 0 : 4} />
      {f > va && [0, 1, 2, 3].map((i) => <Silueta key={i} x={420 + i * 70 + (f - va) * (6 + i * 2)} y={1100} s={0.45} color="#fff" />)}
      <Contador desde={0} hasta={-K.corte * 4} at={w('cuatro')} dura={14} y={760} size={170} color={COL.rojo} sub="CADA SÁBADO" />
      <Placa y={360} tema={T} />
      <Rafaga s="door" at={va} n={4} cada={4} v={0.35} /><Sfx s="error" at={w('cuatro') + 14} v={0.5} />
    </AbsoluteFill>
  );
};

// 7. GIRO: se descarrila en el sábado
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const t = interpolate(f, [0, 110], [0, 1.2], { ...cl, easing: Easing.out(Easing.quad) });
  const ang = interpolate(f, [0, 120], [0, Math.PI], cl);
  const espanta = w('espanta');
  return (
    <AbsoluteFill>
      <Cam golpes={[0, espanta]} fuerza={34}>
        <Parque cam={[8 + t * 2 + Math.sin(ang) * 8, 9 + t * 1.5, Math.cos(ang) * 8]} mira={[8.3 + t * 3, 8 + t * 4 - t * t * 2.5, 0]} u={0.712} suelto={{ t }} fov={55} />
      </Cam>
      <Particulas at={0} x={540} y={900} n={70} colores={[AMA, MAG, '#fff']} vel={36} seed="chispas" forma="circulo" tam={12} />
      <Flash at={0} max={1} />
      <Placa y={340} tema={{ bg: '#fff', borde: '#000', color: '#000', acento: MAG }} max={140} />
      <Sfx s="clang" at={0} v={0.8} /><Sfx s="braam" at={0} v={0.9} /><Sfx s="crowd" at={4} v={0.4} /><Sfx s="hit" at={espanta} v={0.6} />
    </AbsoluteFill>
  );
};

// 8. Tarjeta de puntos: los martes, x2
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const g = spring({ frame: f, fps, config: { damping: 12 } });
  const x2 = w('dobles');
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, #5a1a8a, #12002a 70%)' }}>
      <Rayos y={1000} color="rgba(255,43,214,.15)" />
      <Celular y={1000} s={1.1} rotY={interpolate(g, [0, 1], [180, -6])}>
        <PPuntos sellos={6} desde={6} x2At={x2} />
      </Celular>
      <Txt x={820} y={760} size={160} color={MAG} at={x2} rot={10}>x2</Txt>
      <Placa y={300} tema={T} />
      <Sfx s="whoosh" at={0} v={0.5} /><Rafaga s="pop" at={6} n={6} cada={3} v={0.3} /><Sfx s="neon" at={x2} v={0.5} /><Sfx s="chime" at={x2 + 2} v={0.4} />
    </AbsoluteFill>
  );
};

// 9. La montaña se emparejó: eligen martes
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const m = w('martes');
  const plano = interpolate(f, [0, m], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const u = interpolate(f, [0, 140], [0.2, 0.75], cl);
  return (
    <AbsoluteFill>
      <Parque cam={[2, 6, 15]} mira={[2, 2.5, 0]} u={u} plano={plano} fov={58} />
      <Luces />
      <Confeti at={m} colores={[AMA, MAG, CIAN]} />
      <Placa y={360} tema={T} />
      <Sfx s="whoosh" at={0} v={0.4} /><Sfx s="fanfare" at={m} v={0.5} /><Sfx s="firework" at={m + 4} v={0.4} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => <Cierre color={AMA} fondo={<AbsoluteFill style={{ background: 'radial-gradient(circle,#4a0a6a,#12002a)' }}><Luces /></AbsoluteFill>} confeti={[AMA, MAG, CIAN]} sub="¿cuál es tu día muerto? 👇" />;

export const V07: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={AMA} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]}
    trans={[whipV(1), whip(1), flashT('#fff'), whipV(-1), zoomBlur(), undefined, flip({ direction: 'from-right' }), clockWipe({ width: 1080, height: 1920 }), iris({ width: 1080, height: 1920 })]} />
);
