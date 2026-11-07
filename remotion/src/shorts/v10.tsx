// 10 · "Busco 5 barberías" — convocatoria tipo casting con 5 sillones dorados; en el giro se cae la "publicidad".
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { useEsc, useW } from '../lib/contexto';
import { Placa, type TemaPlaca } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Rayos, Txt, Emoji, Silueta, Onda, cl, COL, ent, pesos } from '../lib/fx';
import { Celular, PReserva, PFila, PCaja, PFicha } from '../lib/Celular';
import { Split } from '../lib/Split';
import { Cierre } from '../lib/Cierre';
import { Lienzo3D, SillaBarbero, Voxeles, SIGNO, MAT } from '../lib/tres';
import { FUENTE, EMOJI } from '../lib/fuentes';
import { cargarConfig } from '../lib/config';
import { slide, wipe, flip, zoomBlur, iris, whip, flashT, spin, clockWipe } from '../lib/transiciones';

const K = cargarConfig();
const ORO = '#FFC93C', CALIDA = '#FFB86B';
const T: TemaPlaca = { bg: 'rgba(8,6,2,.9)', borde: ORO, color: '#fff', acento: ORO, sombra: 'rgba(255,201,60,.5)' };

/** Escenario con 5 sillones dorados; `luces` = cuántos reflectores prendidos. */
const Escenario: React.FC<{ luces?: number; cam?: [number, number, number]; mira?: [number, number, number]; unaLuz?: boolean; children?: React.ReactNode; dorado?: boolean }> = ({ luces = 5, cam = [0, 3, 13], mira = [0, 1.2, 0], unaLuz, children, dorado = true }) => {
  const f = useCurrentFrame();
  return (
    <Lienzo3D cam={cam} mira={mira} fov={45} fondo="#050403" niebla={['#050403', 12, 30]}>
      <ambientLight intensity={unaLuz ? 0.05 : 0.15} />
      {Array.from({ length: 5 }, (_, i) => {
        const on = unaLuz ? i === 2 : i < luces;
        const x = (i - 2) * 2.6;
        return (
          <group key={i}>
            {on && <pointLight position={[x, 4.5, 2]} intensity={unaLuz ? 70 : 45} distance={9} color={unaLuz ? CALIDA : '#fff'} />}
            {on && <mesh position={[x, 4.5, 0.6]} rotation={[0.07, 0, 0]}><coneGeometry args={[1.6, 9, 32, 1, true]} /><meshBasicMaterial color={unaLuz ? CALIDA : '#fff8e0'} transparent opacity={0.08} depthWrite={false} /></mesh>}
            <SillaBarbero position={[x, 0, 0]} rotation={[0, Math.sin(f / 40 + i) * 0.2, 0]} scale={0.75} cuero={dorado ? { color: '#7a5414', metalness: 0.55, roughness: 0.3 } : MAT.cuero} metal={MAT.oro} />
          </group>
        );
      })}
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[40, 30]} /><meshStandardMaterial color="#141008" metalness={0.6} roughness={0.25} /></mesh>
      {children}
    </Lienzo3D>
  );
};

const Humo: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + Math.sin(f / 50) * 15}% 70%, rgba(255,240,210,.12), transparent 60%)`, pointerEvents: 'none' }} />;
};

// 1. Gancho: los reflectores se prenden uno por uno
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const luces = Math.min(5, Math.floor((f + 6) / 6) + 1);
  const x = interpolate(f, [0, 100], [-4, 1], cl);
  return (
    <AbsoluteFill>
      <Cam golpes={[w('venderles')]} fuerza={18}>
        <Escenario luces={luces} cam={[x, 2.6, 11]} mira={[x * 0.5, 1.2, 0]} />
      </Cam>
      <Humo />
      <Placa y={360} tema={T} />
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={i} s="thud" at={Math.max(0, i * 6 - 6)} v={0.4} />)}
      <Sfx s="boom" at={w('venderles')} v={0.6} /><Sfx s="hit" at={w('para', 1)} v={0.5} />
    </AbsoluteFill>
  );
};

// 2. Soy de Corrientes y armo aplicaciones
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const s = spring({ frame: f - 2, fps, config: { damping: 11 } });
  const apps = w('aplicaciones');
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 55%, #1a3a2a, #050403 70%)' }}>
      <Rayos y={980} color="rgba(255,201,60,.12)" />
      {[0, 1, 2].map((k) => <div key={k} style={{ position: 'absolute', left: 540 - 140 - k * 90 - ((f * 3) % 90), top: 980 - 140 - k * 90 - ((f * 3) % 90), width: 280 + k * 180 + ((f * 6) % 180), height: 280 + k * 180 + ((f * 6) % 180), borderRadius: '50%', border: `4px solid rgba(43,255,136,${0.5 - k * 0.15})` }} />)}
      <Emoji e="📍" x={540} y={900} size={240} at={2} />
      <div style={{ position: 'absolute', left: 540, top: 1110, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: FUENTE, fontWeight: 900, fontSize: 64, color: '#fff', letterSpacing: 4 }}>CORRIENTES</div>
      {f >= apps && <Txt x={540} y={700} size={110} color={COL.verde} at={apps}>{'</>'}</Txt>}
      <Placa y={360} tema={T} />
      <Sfx s="whoosh" at={0} v={0.5} /><Sfx s="ding" at={4} v={0.4} /><Sfx s="typewriter" at={apps} v={0.5} />
    </AbsoluteFill>
  );
};

/** Cartel de neón (apagado o prendido). */
const Neon: React.FC<{ texto: string; y: number; on: boolean; color: string; icono: string }> = ({ texto, y, on, color, icono }) => {
  const f = useCurrentFrame();
  const parpadeo = on && (f % 37 === 0) ? 0.4 : 1;
  return (
    <div style={{ position: 'absolute', left: 90, top: y, width: 800, height: 170, border: `8px solid ${on ? color : '#333'}`, borderRadius: 30, display: 'flex', alignItems: 'center', gap: 30, padding: '0 30px', boxShadow: on ? `0 0 40px ${color}, inset 0 0 30px ${color}` : undefined, opacity: parpadeo }}>
      <div style={{ fontSize: 90, fontFamily: EMOJI, filter: on ? undefined : 'grayscale(1) brightness(.4)' }}>{icono}</div>
      <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 64, color: on ? '#fff' : '#333', textShadow: on ? `0 0 20px ${color}` : undefined, whiteSpace: 'nowrap' }}>{texto}</div>
    </div>
  );
};
const NEONES = [{ t: 'TE CLAVAN', c: '#FF2A5A', i: '🪑' }, { t: 'MENSAJES', c: '#2BFF88', i: '💬' }, { t: '¿CUÁNTO GANO?', c: '#2BD4FF', i: '💸' }];

// 3. Seguro te suena (neones apagados)
const S2: React.FC = () => (
  <AbsoluteFill style={{ background: '#08060a' }}>
    {NEONES.map((n, i) => <Neon key={i} texto={n.t} y={640 + i * 220} on={false} color={n.c} icono={n.i} />)}
    <Placa y={360} tema={T} />
    <Sfx s="neon" at={10} v={0.3} />
  </AbsoluteFill>
);

// 4. Te clavan · mensajes · no sabés cuánto ganás (se prenden de golpe)
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const ts = [w('clavan'), w('mensajes'), w('ganas')];
  return (
    <AbsoluteFill style={{ background: '#08060a' }}>
      <Cam golpes={ts} fuerza={22}>
        {NEONES.map((n, i) => <Neon key={i} texto={n.t} y={640 + i * 220} on={f >= ts[i]} color={n.c} icono={n.i} />)}
      </Cam>
      {ts.map((t, i) => <Particulas key={i} at={t} x={820} y={720 + i * 220} n={20} colores={[NEONES[i].c, '#fff']} seed={'ch' + i} tam={10} forma="circulo" dura={20} />)}
      <Placa y={360} tema={T} />
      {ts.map((t, i) => <React.Fragment key={i}><Sfx s="zap" at={t} v={0.45} /><Sfx s="hit" at={t} v={0.4} /></React.Fragment>)}
    </AbsoluteFill>
  );
};

// 5. Así que armé esto (recorrido por la app)
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const ts = [w('turnos'), w('fila'), w('caja'), w('ficha')];
  const k = Math.max(0, ts.filter((t) => f >= t).length - 1);
  const cae = spring({ frame: f, fps, config: { damping: 13, stiffness: 90 } });
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 55%, #3a2a08, #050403 70%)' }}>
      <Rayos y={1000} color="rgba(255,201,60,.14)" />
      <Celular y={interpolate(cae, [0, 1], [-600, 1010])} s={1.05} rotY={interpolate(cae, [0, 1], [360, -6]) + Math.sin(f / 15) * 6}>
        {k === 0 && <PReserva toque={-1} sena={-1} montoSena={K.sena} />}
        {k === 1 && <PFila pasos={[999]} />}
        {k === 2 && <PCaja filas={[{ t: 'Corte', m: K.corte, at: -1 }, { t: 'Corte', m: K.corte, at: -1 }]} />}
        {k === 3 && <PFicha nombre="Lucas" lineas={[{ t: 'Degradé bajo', at: -1 }, { t: '2 al costado', at: -1 }]} />}
      </Celular>
      <Placa y={300} tema={T} />
      <Sfx s="whoosh" at={0} v={0.5} />{ts.map((t, i) => <Sfx key={i} s="swish" at={t} v={0.5} />)}
    </AbsoluteFill>
  );
};

// 6. "Y acá viene la oferta…" (publicidad exagerada; después el disco se raya)
const Oferta: React.FC<{ y?: number; rot?: number; o?: number }> = ({ y = 980, rot = -6, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 540, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${1 + Math.sin(f / 3) * 0.04})`, opacity: o }}>
      <div style={{ background: 'linear-gradient(135deg,#FF2A5A,#FF8A00)', border: '12px solid #fff', borderRadius: 40, padding: '40px 60px', textAlign: 'center', boxShadow: '0 0 80px #FF8A00' }}>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 130, color: '#fff', WebkitTextStroke: '6px #000', paintOrder: 'stroke' }}>¡OFERTA!</div>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 70, color: '#fff', textDecoration: 'line-through' }}>$99.999</div>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 60, color: '#FFE600' }}>¡APROVECHÁ YA!</div>
      </div>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 300 + Math.cos(i + f / 8) * 420, top: 220 + Math.sin(i + f / 8) * 300, fontSize: 70, fontFamily: EMOJI }}>⭐</div>)}
    </div>
  );
};
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }} />;
  return (
    <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 4}deg at 50% 52%, #FFE600 0 15deg, #FF2A5A 15deg 30deg)` }}>
      <Oferta />
      <Placa y={300} tema={T} />
      <Sfx s="fanfare" at={2} v={0.5} /><Sfx s="applause" at={10} v={0.3} /><Sfx s="tape_stop" at={pausa - 18} v={0.6} />
    </AbsoluteFill>
  );
};

// 7. GIRO: el cartel se cae y se rompe; una sola luz cálida sobre un sillón; los pedazos forman un "?"
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const cae = interpolate(f, [0, 24], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
  const rompe = 24;
  const falta = w('falta');
  return (
    <AbsoluteFill style={{ background: '#030202' }}>
      {f >= rompe && (
        <AbsoluteFill style={{ opacity: ent(f, rompe, rompe + 20) }}>
          <Escenario unaLuz cam={[0, 3.2, interpolate(f, [rompe, 140], [13, 9], cl)]} mira={[0, 1.6, 0]}>
            <Voxeles dibujo={SIGNO} color={ORO} tam={0.2} position={[0, 3.5, 0]} rotation={[0, f / 25, 0]} t={Math.min(1, (f - rompe) / 40)} emisivo={0.5} />
          </Escenario>
          <Humo />
        </AbsoluteFill>
      )}
      {f < rompe + 2 && <Oferta y={980 + cae * 520} rot={-6 + cae * 30} />}
      <Particulas at={rompe} x={540} y={1450} n={90} colores={[ORO, '#FF2A5A', '#FF8A00', '#fff']} vel={30} grav={0.9} seed="oferta" dura={50} />
      <Placa y={330} tema={T} max={150} />
      <Sfx s="whoosh" at={2} v={0.5} /><Sfx s="glass" at={rompe} v={0.8} /><Sfx s="pluck" at={rompe + 10} v={0.5} /><Sfx s="choir" at={falta - 10} v={0.4} />
    </AbsoluteFill>
  );
};

// 8. 14 días gratis
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const n = Math.min(K.diasPrueba, Math.floor(interpolate(f, [w('prueban'), w('dias')], [0, K.diasPrueba], cl)));
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 55%, #3a2a08, #050403 70%)' }}>
      <Rayos y={980} color="rgba(255,201,60,.15)" />
      {Array.from({ length: n }, (_, i) => {
        const t = f - (w('prueban') + (i * (w('dias') - w('prueban'))) / K.diasPrueba);
        return <div key={i} style={{ position: 'absolute', left: 540 + t * (i % 2 ? 14 : -14), top: 960 - t * 16 + t * t * 0.6, width: 300, height: 280, background: '#fff', border: '6px solid #000', transform: `translate(-50%,-50%) rotate(${t * 9 * (i % 2 ? 1 : -1)}deg)`, opacity: Math.max(0, 1 - t / 30) }} />;
      })}
      <div style={{ position: 'absolute', left: 340, top: 760, width: 400, height: 440, background: '#fff', border: '10px solid #000', borderRadius: 24, textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ background: '#FF2A5A', height: 90, fontFamily: FUENTE, fontWeight: 900, fontSize: 50, color: '#fff', lineHeight: '90px' }}>DÍA</div>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 220, color: '#000' }}>{n}</div>
      </div>
      <Placa y={360} tema={T} />
      <Rafaga s="paper" at={w('prueban')} n={7} cada={3} v={0.3} /><Sfx s="hit" at={w('dias')} v={0.6} />
    </AbsoluteFill>
  );
};

// 9. $8.000 congelado 6 meses… o nada
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const nada = w('nada');
  return (
    <AbsoluteFill>
      <Split at={0} gana={9999} tIzq="SI TE SIRVE" tDer="SI NO" colIzq={ORO} colDer={COL.verde} fondoIzq="#0a1a2a" fondoDer="#03180c"
        izq={<AbsoluteFill>
          <Txt x={540} y={880} size={130} color={ORO} at={w('sirve')}>{pesos(K.fundador)}</Txt>
          <Txt x={540} y={990} size={44} color="#fff" at={w('mes')}>POR MES</Txt>
          {f >= w('congelado') && <div style={{ position: 'absolute', left: 540, top: 1120, transform: 'translate(-50%,-50%) rotate(-4deg)', background: 'rgba(170,230,255,.85)', border: '6px solid #fff', borderRadius: 20, padding: '10px 20px', fontFamily: FUENTE, fontWeight: 900, fontSize: 38, color: '#0a3a5a', whiteSpace: 'nowrap' }}>🧊 CONGELADO 6 MESES</div>}
        </AbsoluteFill>}
        der={<AbsoluteFill>{f >= nada && <Txt x={540} y={900} size={190} color={COL.verde} at={nada}>$0</Txt>}{f >= nada && <Txt x={540} y={1060} size={120} color={COL.verde} at={nada + 4}>✓</Txt>}</AbsoluteFill>} />
      <Sfx s="zap" at={4} v={0.5} /><Sfx s="cash" at={w('sirve')} v={0.5} /><Sfx s="ice" at={w('congelado')} v={0.7} /><Sfx s="check" at={nada} v={0.6} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => (
  <Cierre color={ORO} fondo={<AbsoluteFill><Escenario luces={5} cam={[0, 2.2, 14]} mira={[0, 0.5, 0]} /><AbsoluteFill style={{ background: 'rgba(0,0,0,.35)' }} /></AbsoluteFill>} confeti={[ORO, '#fff', CALIDA]} sub="quedan 5 lugares 👇" />
);

export const V10: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={ORO} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]}
    trans={[whip(1), clockWipe({ width: 1080, height: 1920 }), flashT('#fff'), zoomBlur(), spin(), undefined, iris({ width: 1080, height: 1920 }), wipe({ direction: 'from-right' }), slide({ direction: 'from-bottom' })]} />
);
