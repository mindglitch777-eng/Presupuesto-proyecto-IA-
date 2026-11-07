// 04 · "3 se fueron en 10 minutos" — la barbería es un videojuego arcade de 8 bits; en el giro el mundo se vuelve 3D de vóxeles.
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { useEsc, useW } from '../lib/contexto';
import { Placa, type TemaPlaca } from '../lib/Placa';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Rayo, Rayos, Txt, Emoji, Glitch, cl, COL, ent } from '../lib/fx';
import { Celular, PFila } from '../lib/Celular';
import { Split } from '../lib/Split';
import { Cierre } from '../lib/Cierre';
import { Lienzo3D, Voxeles, SIGNO } from '../lib/tres';
import { FUENTE, EMOJI } from '../lib/fuentes';
import { cargarConfig } from '../lib/config';
import { slide, wipe, clockWipe, glitchT, zoomBlur, flashT, whip, iris } from '../lib/transiciones';

const K = cargarConfig();
const CIAN = '#00F0FF', MAG = '#FF2BD6', AMA = '#FFE600';
const T: TemaPlaca = { bg: '#120032', borde: CIAN, color: '#fff', acento: AMA, sombra: 'rgba(0,240,255,.5)' };

/** Sprite de pixel art a partir de un dibujo (cada letra es un color). */
const PAL: Record<string, string> = { k: '#111', s: '#F2B48C', h: '#5A3418', r: '#E03A3A', b: '#2F6BFF', w: '#fff', y: AMA, g: '#2BD96B', m: MAG, c: CIAN, o: '#FF8A00' };
const PERSONA = ['..hhhh..', '.hhhhhh.', '.ssssss.', '.skssks.', '.ssssss.', '..ssss..', '.bbbbbb.', 'bbbbbbbb', 'sbbbbbbs', 'sbbbbbbs', '.bbbbbb.', '.kk..kk.', '.kk..kk.'];
const Sprite: React.FC<{ x: number; y: number; px?: number; dibujo?: string[]; tinte?: Record<string, string>; flip?: boolean; paso?: number }> = ({ x, y, px = 14, dibujo = PERSONA, tinte = {}, flip, paso = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-100%) scaleX(${flip ? -1 : 1})`, display: 'grid', gridTemplateColumns: `repeat(${dibujo[0].length}, ${px}px)` }}>
    {dibujo.flatMap((fila, j) => [...fila].map((c, i) => {
      const dy = j >= dibujo.length - 2 ? ((i < 4) === (paso % 2 === 0) ? -px * 0.5 : 0) : 0;
      return <div key={j + '-' + i} style={{ width: px, height: px, background: c === '.' ? 'transparent' : (tinte[c] ?? PAL[c]), transform: `translateY(${dy}px)` }} />;
    }))}
  </div>
);

const Escenario: React.FC<{ children?: React.ReactNode; vidas?: number; puntos?: number }> = ({ children, vidas = 3, puntos = 0 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(#1a0a4a 0%, #3b1170 55%, #0d0628 55%)' }}>
      {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: 'absolute', left: (random('st' + i) * 1080 + f * (i % 3)) % 1080, top: random('sy' + i) * 900, width: 6, height: 6, background: '#fff', opacity: (f + i) % 20 < 10 ? 1 : 0.3 }} />)}
      <AbsoluteFill style={{ transform: 'translateY(200px) scale(1.18)', transformOrigin: '540px 1056px' }}>
        <div style={{ position: 'absolute', left: -200, right: -200, top: 1056, height: 20, background: `repeating-linear-gradient(90deg, ${MAG} 0 40px, ${CIAN} 40px 80px)` }} />
        <div style={{ position: 'absolute', left: -200, right: -200, top: 1076, height: 400, background: 'repeating-linear-gradient(90deg, #1a0d40 0 80px, #140a33 80px 160px)' }} />
        {children}
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 50, top: 70, display: 'flex', gap: 14 }}>{[0, 1, 2].map((i) => <div key={i} style={{ fontSize: 60, fontFamily: EMOJI, opacity: i < vidas ? 1 : 0.2, filter: i < vidas ? undefined : 'grayscale(1)' }}>❤️</div>)}</div>
      <div style={{ position: 'absolute', right: 150, top: 80, fontFamily: FUENTE, fontWeight: 900, fontSize: 52, color: puntos < 0 ? COL.rojo : AMA, letterSpacing: 4 }}>{(puntos < 0 ? '−$' : '$') + Math.abs(puntos).toLocaleString('es-AR')}</div>
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(transparent 0 4px, rgba(0,0,0,.25) 4px 8px)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

const Puerta: React.FC<{ x?: number }> = ({ x = 860 }) => (
  <div style={{ position: 'absolute', left: x - 110, top: 760, width: 220, height: 300, background: '#6b3d12', border: `12px solid ${AMA}`, boxShadow: `0 0 30px ${AMA}` }}><div style={{ position: 'absolute', right: 20, top: 140, width: 22, height: 22, background: AMA }} /></div>
);

const Banco: React.FC<{ n?: number; rojos?: number; x?: number }> = ({ n = 4, rojos = 0, x = 120 }) => (
  <>
    <div style={{ position: 'absolute', left: x - 20, top: 980, width: 4 * 120 + 40, height: 40, background: '#8a5a2b', border: '6px solid #111' }} />
    {Array.from({ length: n }, (_, i) => <Sprite key={i} x={x + 60 + i * 120} y={1000} px={11} tinte={i < rojos ? { s: '#FF5A5A', b: '#B0002A' } : { b: ['#2F6BFF', '#2BD96B', '#FF8A00', MAG][i % 4] }} />)}
  </>
);

const GameOver: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at || f > at + 26) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 8, stiffness: 260 } });
  return <div style={{ position: 'absolute', left: 540, top: 700, transform: `translate(-50%,-50%) scale(${s})`, fontFamily: FUENTE, fontWeight: 900, fontSize: 130, color: COL.rojo, WebkitTextStroke: '8px #fff', paintOrder: 'stroke', letterSpacing: 6, textShadow: `8px 8px 0 #000`, whiteSpace: 'nowrap' }}>GAME OVER</div>;
};

/** Un cliente que entra, ve la fila, se marea y se va. */
const Visita: React.FC<{ at: number; dura?: number }> = ({ at, dura = 34 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dura + 10) return null;
  const entra = interpolate(t, [0, dura * 0.35], [1000, 700], cl);
  const vuelve = interpolate(t, [dura * 0.6, dura], [0, 600], cl);
  const mira = t > dura * 0.35 && t < dura * 0.6;
  return (
    <>
      <Sprite x={entra + vuelve} y={1060} px={15} flip={t > dura * 0.6 ? false : true} paso={Math.floor(t / 3)} />
      {mira && <div style={{ position: 'absolute', left: entra - 30, top: 820, fontSize: 70, fontFamily: EMOJI }}>😵‍💫</div>}
    </>
  );
};

// 1. Gancho
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  return (
    <AbsoluteFill>
      <Cam golpes={[w('tres'), w('precio')]} fuerza={18}>
        <Escenario vidas={3}>
          <Puerta />
          <Banco />
          <Visita at={-8} dura={46} />
          <Txt x={540} y={600} size={90} color={AMA} at={0}>{`00:${String(Math.min(59, Math.floor(f / 2))).padStart(2, '0')}`}</Txt>
        </Escenario>
      </Cam>
      <Placa y={370} tema={T} />
      <Sfx s="bit_coin" at={0} v={0.5} /><Sfx s="hit" at={w('tres')} v={0.5} /><Sfx s="bit_select" at={w('precio')} v={0.5} />
    </AbsoluteFill>
  );
};

// 2. Entra, ve la fila, media vuelta
const S1: React.FC = () => {
  const w = useW();
  const go = w('vuelta');
  return (
    <AbsoluteFill>
      <Cam golpes={[go]} fuerza={22}>
        <Escenario vidas={useCurrentFrame() > go ? 2 : 3}>
          <Puerta /><Banco /><Visita at={0} dura={go} />
          <GameOver at={go} />
          <Particulas at={go} x={190} y={110} n={20} colores={[COL.rojo, '#fff']} seed="vida1" />
        </Escenario>
      </Cam>
      <Placa y={380} tema={T} />
      <Sfx s="bit_select" at={4} v={0.4} /><Sfx s="boing" at={Math.round(go * 0.4)} v={0.3} /><Sfx s="bit_over" at={go} v={0.6} />
    </AbsoluteFill>
  );
};

// 3. Y este, y este: −$30.000
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const a = w('este', 0), b = w('este', 1);
  const vidas = f > b + 14 ? 0 : f > a + 14 ? 1 : 2;
  const pts = Math.round(interpolate(f, [a, b + 30], [-K.corte, -K.corte * 3], cl));
  return (
    <AbsoluteFill>
      <Cam golpes={[a + 14, b + 14]} fuerza={26}>
        <Escenario vidas={vidas} puntos={pts}>
          <Puerta /><Banco /><Visita at={a - 4} dura={18} /><Visita at={b - 4} dura={18} />
          <Txt x={540} y={700} size={170} color={COL.rojo} at={b + 16}>{'−$' + (K.corte * 3).toLocaleString('es-AR')}</Txt>
          {f > b + 30 && <Txt x={540} y={880} size={60} color="#fff" at={b + 30}>CONTINUE? {9 - Math.floor((f - b - 30) / 6)}</Txt>}
        </Escenario>
      </Cam>
      <Placa y={380} tema={T} />
      <Sfx s="bit_over" at={a + 14} v={0.4} /><Sfx s="bit_over" at={b + 14} v={0.5} /><Sfx s="error" at={b + 16} v={0.5} />
    </AbsoluteFill>
  );
};

// 4. Los que se quedan miran el reloj
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const reloj = w('reloj');
  const calienta = w('calientan');
  const rojos = Math.min(4, Math.max(0, Math.floor((f - calienta) / 4) + 1));
  const s = interpolate(f, [reloj, reloj + 30], [1, 1.8], cl);
  return (
    <AbsoluteFill>
      <Escenario vidas={0} puntos={-K.corte * 3}>
        <Banco rojos={f >= calienta ? rojos : 0} />
        <div style={{ position: 'absolute', left: 540, top: 600, transform: `translate(-50%,-50%) scale(${s})`, width: 220, height: 220, borderRadius: '50%', background: '#fff', border: '14px solid #111' }}>
          <div style={{ position: 'absolute', left: 103, top: 30, width: 14, height: 80, background: '#111', transformOrigin: '50% 100%', transform: `rotate(${f * 12}deg)` }} />
          <div style={{ position: 'absolute', left: 105, top: 60, width: 10, height: 50, background: COL.rojo, transformOrigin: '50% 100%', transform: `rotate(${f}deg)` }} />
        </div>
        {f >= calienta && Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 170 + i * 120, top: 830 - ((f * 5 + i * 20) % 80), width: 22, height: 22, background: '#ddd', opacity: 0.8 }} />)}
      </Escenario>
      <Placa y={380} tema={T} />
      <Rafaga s="tick" at={0} n={10} cada={6} v={0.35} /><Sfx s="tension" at={calienta} v={0.3} />
    </AbsoluteFill>
  );
};

// 5. ¿Es el precio? (menú: engaño)
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const pre = w('precio'), enf = w('enfrente');
  const sel = f >= enf ? 1 : 0;
  const elegido = w('vos');
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: '#05021a' }} />
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(transparent 0 4px, rgba(0,0,0,.35) 4px 8px)' }} />
      <div style={{ position: 'absolute', left: 140, top: 640, width: 800, border: `10px solid ${CIAN}`, background: '#0b0640', padding: 40, boxShadow: `0 0 50px ${CIAN}` }}>
        <div style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 50, color: AMA, marginBottom: 30 }}>¿POR QUÉ SE VAN?</div>
        {['EL PRECIO', 'EL DE ENFRENTE'].map((o, i) => (
          <div key={o} style={{ fontFamily: FUENTE, fontWeight: 900, fontSize: 64, color: '#fff', margin: '18px 0', opacity: f >= (i ? enf : pre) ? 1 : 0.3, background: f >= elegido && i === 0 ? MAG : 'transparent', padding: '4px 10px' }}>
            <span style={{ color: AMA, opacity: sel === i && (f % 10 < 6) ? 1 : 0 }}>▶ </span>{o}
          </div>
        ))}
      </div>
      <Placa y={380} tema={T} />
      <Sfx s="bit_select" at={pre} v={0.5} /><Sfx s="bit_select" at={enf} v={0.5} /><Sfx s="bit_coin" at={elegido} v={0.5} />
    </AbsoluteFill>
  );
};

// 6. Bajás el precio y se siguen yendo (se cuelga el juego)
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const w = useW();
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  const baja = w('bajas');
  const yendo = w('yendo');
  if (f >= pausa) return <AbsoluteFill style={{ background: '#000' }} />;
  const colgado = f > yendo + 4;
  return (
    <AbsoluteFill>
      <Glitch activo={colgado} fuerza={1.4}>
        <Escenario vidas={0} puntos={-K.corte * 4}>
          <Puerta /><Banco />
          <div style={{ position: 'absolute', left: 540, top: interpolate(f, [baja, baja + 14], [-200, 640], { ...cl, easing: Easing.bounce }), transform: 'translateX(-50%)', background: AMA, color: '#000', fontFamily: FUENTE, fontWeight: 900, fontSize: 64, padding: '10px 26px', border: '8px solid #000' }}>OFERTA ⬇</div>
          <Visita at={yendo - 16} dura={20} />
        </Escenario>
      </Glitch>
      <Placa y={380} tema={T} />
      <Sfx s="bit_power" at={baja} v={0.5} /><Sfx s="bit_over" at={yendo} v={0.5} /><Sfx s="glitch" at={yendo + 4} v={0.6} />
    </AbsoluteFill>
  );
};

// 7. GIRO: el mundo se rompe y se vuelve 3D de vóxeles; un "?" sobre cada cabeza
const PersonaVox: React.FC<{ x: number; color: string }> = ({ x, color }) => (
  <group position={[x, 0, 0]}>
    <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.7, 1, 0.5]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[0, 1.3, 0]}><boxGeometry args={[0.55, 0.55, 0.55]} /><meshStandardMaterial color="#F2B48C" /></mesh>
    <mesh position={[0, 1.62, 0]}><boxGeometry args={[0.58, 0.14, 0.58]} /><meshStandardMaterial color="#5A3418" /></mesh>
  </group>
);

const S6: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const t = f / 30;
  const ang = interpolate(f, [0, 120], [-0.9, 0.7], { ...cl, easing: Easing.inOut(Easing.sin) });
  const alto = interpolate(f, [0, 120], [1.5, 5], cl);
  const falta = w('cuanto');
  return (
    <AbsoluteFill style={{ background: '#0b0420' }}>
      <Glitch activo={f < 8} fuerza={2}>
        <Cam golpes={[0, falta]} fuerza={30}>
          <Lienzo3D cam={[Math.sin(ang) * 11, alto, Math.cos(ang) * 11]} mira={[0, 1.9, 0]} fov={48} fondo="#0b0420">
            <ambientLight intensity={0.6} /><directionalLight position={[4, 8, 6]} intensity={2.5} /><pointLight position={[0, 4, 3]} intensity={40} color={MAG} />
            <mesh position={[0, -0.05, 0]}><boxGeometry args={[12, 0.1, 6]} /><meshStandardMaterial color="#2a1060" /></mesh>
            <mesh position={[0, 0.3, -0.2]}><boxGeometry args={[5.6, 0.25, 1]} /><meshStandardMaterial color="#8a5a2b" /></mesh>
            {[-2.1, -0.7, 0.7, 2.1].map((x, i) => (
              <group key={i}>
                <PersonaVox x={x} color={['#2F6BFF', '#2BD96B', '#FF8A00', MAG][i]} />
                <Voxeles dibujo={SIGNO} color={AMA} tam={0.13} position={[x, 2.6 + Math.sin(t * 3 + i) * 0.15, 0]} rotation={[0, t * 2 + i, 0]} t={Math.min(1, (f - i * 4) / 20)} emisivo={0.8} />
              </group>
            ))}
          </Lienzo3D>
        </Cam>
      </Glitch>
      <Rayo x1={200} y1={560} x2={880} y2={640} at={20} dura={10} color={AMA} seed="q1" />
      <Rayo x1={180} y1={700} x2={900} y2={560} at={falta} dura={12} color={CIAN} seed="q2" />
      <Txt x={540} y={1080} size={110} color={AMA} at={falta} style={{ letterSpacing: 8 }}>??:??</Txt>
      <Placa y={360} tema={{ bg: '#fff', borde: '#000', color: '#000', acento: MAG }} max={140} />
      <Flash at={0} max={1} />
      <Sfx s="glitch" at={0} v={0.7} /><Sfx s="braam" at={2} v={0.9} /><Sfx s="zap" at={20} v={0.4} /><Sfx s="clock" at={falta} v={0.6} />
    </AbsoluteFill>
  );
};

// 8. QR en la puerta: escanean y se van a tomar un café
const QR: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <div style={{ width: 230 * s, height: 230 * s, background: '#fff', padding: 14 * s, display: 'grid', gridTemplateColumns: 'repeat(11,1fr)', boxShadow: `0 0 40px ${AMA}` }}>
    {Array.from({ length: 121 }, (_, i) => { const x = i % 11, y = Math.floor(i / 11); const esq = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7); return <div key={i} style={{ background: esq || random('qr' + i) > 0.5 ? '#000' : '#fff' }} />; })}
  </div>
);

const S7: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const esc = w('escanean'), anota = w('anotan'), van = w('van');
  const x = interpolate(f, [0, esc], [1100, 760], cl) - interpolate(f, [van, van + 40], [0, 900], cl);
  return (
    <AbsoluteFill>
      <Cam zoom={interpolate(f, [0, esc], [1.3, 1], cl)} origen="80% 50%">
        <Escenario vidas={3}>
          <Puerta />
          <div style={{ position: 'absolute', left: 755, top: 790 }}><QR s={0.9} /></div>
          <Sprite x={x} y={1060} px={15} flip={f < van} paso={Math.floor(f / 3)} />
          {f >= anota && f < van + 10 && <Txt x={740} y={720} size={70} color="#2BD96B" at={anota}>ANOTADO ✓</Txt>}
          {f >= van && <div style={{ position: 'absolute', left: x + 50, top: 900, fontSize: 80, fontFamily: EMOJI }}>☕</div>}
        </Escenario>
      </Cam>
      <Placa y={380} tema={T} />
      <Sfx s="bit_power" at={esc} v={0.5} /><Sfx s="bit_coin" at={anota} v={0.6} /><Sfx s="whoosh" at={van} v={0.4} />
    </AbsoluteFill>
  );
};

// 9. Fila virtual: 3º → 2º → te toca
const S8: React.FC = () => {
  const w = useW();
  const pasos = [w('segundo'), w('toca')];
  return (
    <AbsoluteFill>
      <Escenario vidas={3} />
      <Celular y={1000} s={1.1} rotY={-8}><PFila pasos={pasos} /></Celular>
      <Particulas at={pasos[1]} x={540} y={900} n={50} colores={[AMA, CIAN, MAG]} seed="toca" forma="estrella" />
      <Placa y={300} tema={T} />
      <Sfx s="bit_select" at={w('tercero')} v={0.5} /><Sfx s="bit_select" at={pasos[0]} v={0.6} /><Sfx s="bit_power" at={pasos[1]} v={0.6} />
    </AbsoluteFill>
  );
};

// 10. Banco lleno/caja vacía vs banco vacío/caja llena
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const llena = w('llena');
  return (
    <AbsoluteFill>
      <Split at={0} gana={llena} tIzq="FILA" tDer="FILA VIRTUAL" colIzq={COL.rojo} colDer={AMA} fondoIzq="#1a0a2a" fondoDer="#0b2a3a"
        izq={<AbsoluteFill><Banco rojos={4} x={360} /><Txt x={540} y={1180} size={90} at={0}>🕸️</Txt></AbsoluteFill>}
        der={<AbsoluteFill><div style={{ position: 'absolute', left: 340, top: 980, width: 400, height: 40, background: '#8a5a2b', border: '6px solid #111' }} />
          <Txt x={540} y={760} size={130} color={AMA} at={llena}>LEVEL UP!</Txt>
          {f >= llena && Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: 'absolute', left: 540 + (random('m' + i) - 0.5) * 500, top: 1100 - ((f - llena) * (6 + (i % 5))) % 500, width: 30, height: 30, borderRadius: '50%', background: AMA, border: '4px solid #B8860B' }} />)}
        </AbsoluteFill>} />
      <Sfx s="zap" at={2} v={0.5} /><Sfx s="bit_power" at={llena} v={0.6} /><Sfx s="cash" at={llena + 6} v={0.6} />
    </AbsoluteFill>
  );
};

const S10: React.FC = () => <Cierre color={AMA} fondo={<Escenario vidas={3} />} confeti={[AMA, CIAN, MAG]} sub="PRESS START ▶" />;

export const V04: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={AMA} escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]}
    trans={[glitchT(), slide({ direction: 'from-right' }), clockWipe({ width: 1080, height: 1920 }), wipe({ direction: 'from-left' }), glitchT(), undefined, zoomBlur(), slide({ direction: 'from-bottom' }), wipe({ direction: 'from-right' }), iris({ width: 1080, height: 1920 })]} />
);
