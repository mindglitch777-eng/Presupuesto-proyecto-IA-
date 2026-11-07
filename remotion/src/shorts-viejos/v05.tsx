// 05 · "¿Cuánto ganaste el mes pasado?" — concurso de TV donde el concursante sos vos; en el giro, rayos X al cajón.
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { useEsc, useW } from '../lib/contexto';
import { Placa, type TemaPlaca } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Contador, Rayos, Txt, Emoji, Silueta, Confeti, Onda, cl, COL } from '../lib/fx';
import { Celular, PCaja } from '../lib/Celular';
import { Split } from '../lib/Split';
import { Cierre } from '../lib/Cierre';
import { Lienzo3D, Billete } from '../lib/tres';
import { FUENTE, EMOJI } from '../lib/fuentes';
import { cargarConfig } from '../lib/config';
import { zoomBlur, slide, wipe, flip, iris, pushCut, spin, flashT } from '../lib/transiciones';

const K = cargarConfig();
const ORO = '#FFC93C', MAG = '#FF2B8A', AZ = '#2F6BFF', XR = '#7CF7FF';
const T: TemaPlaca = { bg: 'rgba(20,6,40,.9)', borde: ORO, color: '#fff', acento: ORO, sombra: 'rgba(255,201,60,.5)' };

/** Estudio de TV: luces que corren, piso brillante, público. */
const Estudio: React.FC<{ apagado?: number; children?: React.ReactNode }> = ({ apagado = 0, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 30%, #3b1170, #0b0320 70%)' }}>
      <Rayos y={300} color="rgba(255,201,60,.13)" vel={0.8} />
      {Array.from({ length: 22 }, (_, i) => {
        const on = (Math.floor(f / 3) + i) % 4 === 0 && i / 22 >= apagado;
        return <div key={i} style={{ position: 'absolute', left: 30 + i * 47, top: 1300, width: 30, height: 30, borderRadius: '50%', background: on ? ORO : '#4a3a20', boxShadow: on ? `0 0 26px ${ORO}` : undefined }} />;
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1340, bottom: 0, background: 'linear-gradient(#2a0a50,#05010f)' }} />
      {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: 'absolute', left: i * 80 - 10, top: 1380 + (i % 2) * 20, width: 90, height: 90, borderRadius: '50% 50% 0 0', background: '#120428' }} />)}
      {children}
      <AbsoluteFill style={{ background: '#000', opacity: apagado, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

const Atril: React.FC<{ boton?: boolean; y?: number }> = ({ boton, y = 1100 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 540, top: y, transform: 'translate(-50%,-50%)' }}>
      <div style={{ width: 420, height: 60, borderRadius: '50%', background: boton ? '#ff1e3c' : '#b0002a', margin: '0 auto -30px', boxShadow: boton ? '0 0 40px #ff1e3c' : undefined }} />
      <div style={{ width: 520, height: 300, background: `linear-gradient(90deg, ${MAG}, ${AZ})`, clipPath: 'polygon(8% 0, 92% 0, 100% 100%, 0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 70, color: '#fff', textShadow: '0 6px 0 #000' }}>VOS</div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'space-around' }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: (f + i * 3) % 12 < 6 ? ORO : '#555' }} />)}</div>
    </div>
  );
};

// 1. Gancho: tenés 3 segundos
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const bajada = interpolate(f, [0, 20], [-500, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  const tres = w('tres');
  return (
    <AbsoluteFill>
      <Estudio>
        <Cam y={bajada} golpes={[w('mirar'), tres]} fuerza={18}>
          <Atril />
          <div style={{ position: 'absolute', left: 540, top: 820, transform: `translate(-50%,-50%) scale(${f >= tres ? 1.15 : 1})`, width: 260, height: 260, borderRadius: '50%', background: '#000', border: `14px solid ${ORO}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE, fontWeight: 900, fontSize: 170, color: ORO, boxShadow: `0 0 60px ${ORO}` }}>3</div>
        </Cam>
      </Estudio>
      <Placa y={360} tema={T} />
      <Sfx s="fanfare" at={0} v={0.5} /><Sfx s="hit" at={w('mirar')} v={0.6} /><Sfx s="clock" at={tres} v={0.5} />
    </AbsoluteFill>
  );
};

// 2. 3 · 2 · 1
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const ts = [w('tres'), w('dos'), w('uno')];
  const k = ts.filter((t) => f >= t).length - 1;
  if (k < 0) return <Estudio />;
  const s = spring({ frame: f - ts[k], fps, config: { damping: 9, stiffness: 240 } });
  return (
    <AbsoluteFill>
      <Estudio>
        <Cam golpes={ts} fuerza={24} zoom={1 + k * 0.12}>
          <div style={{ position: 'absolute', left: 540, top: 900, transform: `translate(-50%,-50%) scale(${(3.2 - 2.2 * s)}) rotate(${(1 - s) * 30}deg)`, fontFamily: FUENTE, fontWeight: 900, fontSize: 620, color: [ORO, MAG, '#FF1E3C'][k], WebkitTextStroke: '18px #000', paintOrder: 'stroke', textShadow: `0 0 80px ${[ORO, MAG, '#FF1E3C'][k]}` }}>{3 - k}</div>
        </Cam>
      </Estudio>
      {ts.map((t, i) => <Sfx key={i} s="clock" at={t} v={0.5 + i * 0.1} />)}
    </AbsoluteFill>
  );
};

// 3. Chicharra: ¿más o menos?
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const cruz = w('menos');
  return (
    <AbsoluteFill>
      <Estudio>
        <AbsoluteFill style={{ background: `rgba(255,0,40,${f < 10 ? 0.4 : 0.1})` }} />
        <Atril boton />
        <div style={{ position: 'absolute', left: 540, top: 800, transform: 'translate(-50%,-50%) rotate(-3deg)', background: '#fff', border: '10px solid #000', fontFamily: FUENTE, fontWeight: 900, fontSize: 100, padding: '10px 40px', color: '#000' }}>MÁS O MENOS</div>
        {f >= cruz && <Txt x={540} y={800} size={420} color="#FF1E3C" at={cruz}>✗</Txt>}
        {f >= cruz && <Emoji e="🤣" x={180} y={1400} size={120} at={cruz + 2} />}
        {f >= cruz && <Emoji e="😂" x={900} y={1420} size={120} at={cruz + 5} />}
      </Estudio>
      <Placa y={380} tema={T} />
      <Sfx s="buzzer" at={0} v={0.6} /><Sfx s="laugh" at={cruz + 2} v={0.6} />
    </AbsoluteFill>
  );
};

// 4. Ruleta: efectivo, transferencia, billetera… de memoria
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const frena = w('memoria');
  const giro = interpolate(f, [0, frena], [0, 1440 + 315], { ...cl, easing: Easing.out(Easing.cubic) });
  const sec = ['EFECTIVO', 'TRANSF.', 'BILLETERA', '¿?'];
  const cols = [ORO, AZ, MAG, '#2BD96B'];
  return (
    <AbsoluteFill>
      <Estudio>
        <div style={{ position: 'absolute', left: 540, top: 920, transform: `translate(-50%,-50%) rotate(${giro}deg)`, width: 760, height: 760, borderRadius: '50%', border: '16px solid #fff', background: `conic-gradient(${cols.map((c, i) => `${c} ${i * 90}deg ${(i + 1) * 90}deg`).join(',')})`, boxShadow: `0 0 70px ${ORO}` }}>
          {sec.map((t, i) => <div key={t} style={{ position: 'absolute', left: 380, top: 380, transform: `rotate(${i * 90 + 45}deg) translate(0,-230px) rotate(0deg)`, transformOrigin: '0 0', fontFamily: FUENTE, fontWeight: 900, fontSize: 52, color: '#000', whiteSpace: 'nowrap', marginLeft: -100 }}>{t}</div>)}
        </div>
        <div style={{ position: 'absolute', left: 510, top: 500, width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderTop: '70px solid #fff' }} />
        {f >= frena && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 540 + (random('pp' + i) - 0.5) * 700, top: 900 - (f - frena) * (4 + i % 4), width: 60, height: 40, background: '#fff', border: '3px solid #000', transform: `rotate(${(f - frena) * 10 + i * 20}deg)`, opacity: Math.max(0, 1 - (f - frena) / 40) }} />)}
      </Estudio>
      <Placa y={360} tema={T} />
      <Rafaga s="tick" at={0} n={Math.max(4, Math.floor(frena / 3))} cada={3} v={0.35} /><Sfx s="paper" at={frena} v={0.6} />
    </AbsoluteFill>
  );
};

// 5. Pagás el alquiler: ¿dónde está la plata? (sale una polilla)
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const cae = w('alquiler');
  const abre = w('plata');
  const y = interpolate(f, [cae - 6, cae + 4], [-600, 520], { ...cl, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill>
      <Estudio>
        <Cam golpes={[cae + 4]} fuerza={30}>
          <div style={{ position: 'absolute', left: 260, top: 1000, width: 560, height: 260, background: '#5c3b1f', border: '10px solid #2a1a0a' }}>
            <div style={{ position: 'absolute', left: 60, top: 40 + interpolate(f, [abre, abre + 8], [0, 120], cl), width: 440, height: 160, background: '#7a5230', border: '8px solid #2a1a0a' }} />
          </div>
          <div style={{ position: 'absolute', left: 300, top: y, width: 480, height: 560, background: '#fff', border: '8px solid #000', transform: 'rotate(-6deg)', padding: 30, fontFamily: FUENTE }}>
            <div style={{ fontWeight: 900, fontSize: 62 }}>ALQUILER</div>
            <div style={{ fontWeight: 900, fontSize: 90, color: '#E0004D', marginTop: 40 }}>VENCE HOY</div>
          </div>
          {f >= abre && <Emoji e="🦋" x={540 + Math.sin((f - abre) / 4) * 120} y={1100 - (f - abre) * 12} size={140} at={abre} />}
        </Cam>
      </Estudio>
      <Placa y={360} tema={T} />
      <Sfx s="boom" at={cae + 4} v={0.7} /><Sfx s="drawer" at={abre} v={0.6} /><Sfx s="wind" at={abre + 4} v={0.3} />
    </AbsoluteFill>
  );
};

// 6. $300.000 por mes y apagón
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const w = useW();
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  const mes = w('mes');
  const ap = interpolate(f, [mes + 4, pausa], [0, 1], cl);
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }} />;
  return (
    <AbsoluteFill>
      <Estudio apagado={ap}>
        <div style={{ position: 'absolute', left: 120, top: 640, width: 840, height: 500, background: '#000', border: `16px solid ${ORO}`, borderRadius: 20 }} />
        <Contador desde={0} hasta={-K.corte * 30} at={w('dia')} dura={Math.max(8, mes - w('dia'))} y={890} size={150} color="#FF1E3C" sub="POR MES SIN ANOTAR" />
      </Estudio>
      <Placa y={380} tema={T} />
      <Rafaga s="tick" at={w('dia')} n={8} cada={2} v={0.3} /><Sfx s="hit" at={mes} v={0.7} /><Rafaga s="thud" at={mes + 4} n={4} cada={4} v={0.25} />
    </AbsoluteFill>
  );
};

// 7. GIRO: rayos X al cajón — se ven los agujeros por donde se escapa la plata
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const t = f / 30;
  const escapo = w('escapo');
  const camY = interpolate(f, [0, 120], [2.6, 0.2], { ...cl, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: '#00060a' }}>
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(transparent 0 3px, rgba(124,247,255,.06) 3px 6px)' }} />
      <Cam golpes={[0, escapo]} fuerza={26}>
        <Lienzo3D cam={[3.8, camY, 7.5]} mira={[0, -1.4, 0]} fov={50} entorno={false}>
          <ambientLight intensity={1} />
          {/* cajón translúcido */}
          <mesh><boxGeometry args={[4, 1.2, 2.6]} /><meshBasicMaterial color={XR} wireframe /></mesh>
          <mesh><boxGeometry args={[4, 1.2, 2.6]} /><meshBasicMaterial color={XR} transparent opacity={0.12} /></mesh>
          {/* agujeros en el fondo */}
          {[[-1, 0.5], [0.6, -0.4], [1.3, 0.7]].map(([x, z], i) => <mesh key={i} position={[x, -0.6, z]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.18, 0.32, 24]} /><meshBasicMaterial color="#FF1E3C" /></mesh>)}
          {Array.from({ length: 18 }, (_, i) => {
            const h = [[-1, 0.5], [0.6, -0.4], [1.3, 0.7]][i % 3];
            const tt = (t * 0.9 + i * 0.37) % 3;
            return <group key={i} position={[h[0], -0.6 - tt * 1.6, h[1]]} rotation={[tt * 2, i, tt]}><mesh><boxGeometry args={[0.7, 0.02, 0.34]} /><meshBasicMaterial color={XR} transparent opacity={Math.max(0, 0.9 - tt * 0.3)} /></mesh></group>;
          })}
        </Lienzo3D>
      </Cam>
      {/* barra de escaneo */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 500 + ((f * 18) % 1000), height: 14, background: XR, boxShadow: `0 0 60px ${XR}`, opacity: 0.8 }} />
      <Placa y={360} tema={{ bg: '#001318', borde: XR, color: '#fff', acento: XR }} max={140} />
      <Flash at={0} color={XR} max={0.8} />
      <Sfx s="braam" at={0} v={0.9} /><Sfx s="heartbeat" at={10} v={0.6} /><Sfx s="heartbeat" at={40} v={0.6} /><Sfx s="heartbeat" at={70} v={0.6} /><Sfx s="rumble" at={escapo} v={0.5} />
    </AbsoluteFill>
  );
};

// 8. Caja del día: cada corte, un toque
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const a = w('toque'), b = w('efectivo'), c = w('transferencia'), d = w('anotado');
  const g = spring({ frame: f, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill>
      <Estudio />
      <Celular y={1000} s={1.1} rotY={interpolate(g, [0, 1], [-90, -6])}>
        <PCaja filas={[{ t: 'Corte · Efectivo', m: K.corte, at: a }, { t: 'Corte · Transf.', m: K.corte, at: b }, { t: 'Barba · Efectivo', m: K.corte / 2, at: c }, { t: 'Corte · Transf.', m: K.corte, at: d }]} />
      </Celular>
      <Placa y={300} tema={T} />
      {[a, b, c, d].map((t, i) => <Sfx key={i} s="coin" at={t} v={0.45} />)}
    </AbsoluteFill>
  );
};

// 9. Al cerrar: qué día rinde (y el premio)
const S8: React.FC = () => {
  const w = useW();
  const cierre = w('cerrar');
  const mano = w('mano');
  return (
    <AbsoluteFill>
      <Estudio>
        <Confeti at={mano} colores={[ORO, MAG, '#fff', AZ]} />
      </Estudio>
      <Celular y={1000} s={1.1} rotY={6}>
        <PCaja filas={[{ t: 'Corte', m: K.corte, at: -1 }, { t: 'Corte', m: K.corte, at: -1 }, { t: 'Barba', m: K.corte / 2, at: -1 }]} cierre={cierre} />
      </Celular>
      <Placa y={300} tema={T} />
      <Sfx s="whoosh" at={cierre} v={0.4} /><Rafaga s="pop" at={cierre + 4} n={7} cada={2} v={0.3} /><Sfx s="applause" at={mano} v={0.5} /><Sfx s="fanfare" at={mano} v={0.5} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => <Cierre color={ORO} fondo={<Estudio />} confeti={[ORO, MAG, AZ]} sub="y te la paso 👇" />;

export const V05: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={ORO} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9]}
    trans={[zoomBlur(), flashT('#FF1E3C'), wipe({ direction: 'from-left' }), spin(), pushCut(), undefined, flip({ direction: 'from-top' }), slide({ direction: 'from-bottom' }), iris({ width: 1080, height: 1920 })]} />
);
