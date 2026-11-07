// Campaña Silla Llena · Video 1: "Tu barbería se está muriendo" (CAMPANA.md, guion 1).
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, Sequence } from 'remotion';
import { Short, type ShortProps } from '../lib/Short';
import { useEsc, useW } from '../lib/contexto';
import { Sfx, Rafaga } from '../lib/Sfx';
import { Cam, Flash, Particulas, Confeti, Onda } from '../lib/fx';
import { cargarConfig } from '../lib/config';
import { C, FUENTE_C, FUENTE_R } from '../lib/campana/estilo';
import { TextoGrande, Rotulo, FondoColor, LluviaBilletes } from '../lib/campana/Texto';
import { Barbero, Fantasma, Impaciente, Cliente, Silla, Monitor, Balde, Billete, Logo } from '../lib/campana/Personajes';
import { CelularHeroe, LineasVelocidad, PantallaSena, PantallaQR, PantallaLista } from '../lib/campana/CelularHeroe';
import { cruzaFantasma, billeteACamara, seRompe } from '../lib/campana/transiciones';
import { zoomBlur, flashT, whipV, slide } from '../lib/transiciones';

const K = cargarConfig();
const $ = (n: number) => '$' + n.toLocaleString('es-AR');
const TY = 430; // altura del texto grande
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const Pie: React.FC = () => (
  <div style={{ position: 'absolute', left: 60, width: 840, top: 1470, textAlign: 'center', fontFamily: FUENTE_R, fontWeight: 600, fontSize: 28, color: 'rgba(17,17,17,.75)' }}>Montos de ejemplo con corte a {$(K.corte)}</div>
);

// 1 · GANCHO: el monitor de "TU BARBERÍA" se aplana. Imagen, texto y voz en el cuadro 1.
const S0: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const muere = w('muriendo');
  const t = interpolate(f, [4, muere + 6], [0, 1], cl);
  const pips = [0, 11];
  return (
    <AbsoluteFill>
      <FondoColor color={C.rojo} late />
      <Cam golpes={[...pips, muere]} fuerza={26} zoom={1 + Math.max(0, Math.sin(f / 4.5)) * 0.03}>
        <Monitor x={540} y={1290} s={1.05} estado={t < 1 ? 'cae' : 'plano'} t={t} />
      </Cam>
      <TextoGrande y={TY + 20} at={-8} texto={'TU BARBERÍA\nSE ESTÁ\n*MURIENDO*'} max={200} />
      {pips.map((p) => <Sfx key={p} s="pip" at={p} v={0.7} />)}
      <Sfx s="flatline" at={muere - 2} v={0.6} />
      <Sfx s="hit" at={muere} v={0.6} />
    </AbsoluteFill>
  );
};

// 2 · Se rompe el monitor y cae el balde con 3 agujeros.
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const cae = spring({ frame: f - 2, fps, config: { damping: 9, stiffness: 120 } });
  const tres = w('tres');
  const marca = f >= tres ? Math.min(2, Math.floor((f - tres) / 7)) : -1;
  return (
    <AbsoluteFill>
      <FondoColor color={C.celeste} />
      <Cam golpes={[14, tres]} fuerza={22} zoom={interpolate(f, [tres, tres + 30], [1, 1.08], cl)}>
        <Balde x={540} y={interpolate(cae, [0, 1], [-200, 1270])} s={1.25} nivel={0.85} marcar={marca} />
      </Cam>
      <Particulas at={0} x={540} y={700} n={36} colores={['#fff', '#cfe8ff', C.amarillo]} vel={30} grav={1.2} seed="vidrio" />
      {f < tres - 2 && <TextoGrande y={TY} at={2} texto="Y NO TE DAS CUENTA" max={120} hasta={tres - 6} />}
      <TextoGrande y={TY} at={tres} texto="*3 AGUJEROS*" max={210} entrada="zoom" />
      <Sfx s="glass" at={0} v={0.6} /><Sfx s="thud" at={14} v={0.8} /><Sfx s="drip" at={20} v={0.5} />
      {[0, 1, 2].map((k) => <Sfx key={k} s="pop" at={tres + k * 7} v={0.6} />)}
    </AbsoluteFill>
  );
};

// 3 · Agujero 1: el Fantasma sale con la plata y saluda.
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const sale = w('reserva');
  const plata = w('120000');
  const vuela = w('mes');
  const emerge = spring({ frame: f - sale, fps, config: { damping: 11, stiffness: 140 } });
  const fx = 400 + interpolate(f, [vuela, vuela + 30], [0, 700], cl);
  return (
    <AbsoluteFill>
      <FondoColor color={C.rosa} />
      <Cam golpes={[sale, plata]} fuerza={22}>
        <Balde x={640} y={1700} s={1.75} nivel={0.7} marcar={0} />
        {f >= sale - 2 && <Fantasma x={fx} y={1240 - emerge * 120} s={1.25 * emerge} billetes saluda={f > sale + 10} />}
        <LluviaBilletes at={plata} n={8} desde={[420, 1050]} hacia={[1150, 600]} seed="f1">{(i, x, y, r, o) => <Billete key={i} x={x} y={y} rot={r} o={o} w={150} />}</LluviaBilletes>
      </Cam>
      <TextoGrande y={TY} at={0} texto="EL FANTASMA" max={170} hasta={plata - 1} />
      <TextoGrande y={TY} at={plata} texto={`EL FANTASMA\n*−${$(K.corte * 12)}*`} max={170} />
      <Rotulo x={250} y={720} at={sale + 4} bg="#fff" size={44}>reserva y no viene</Rotulo>
      <Pie />
      <Sfx s="ghost" at={sale} v={0.7} /><Sfx s="laugh" at={sale + 14} v={0.35} />
      <Sfx s="hit" at={plata} v={0.6} /><Sfx s="coins" at={plata + 2} v={0.4} /><Sfx s="whoosh" at={vuela} v={0.5} />
    </AbsoluteFill>
  );
};

// 4 · Agujero 2: el Impaciente ve la fila, resopla y se tira por el agujero.
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const fila = w('fila');
  const va = w('va');
  const plata = w('240000');
  const salto = interpolate(f, [va, va + 16], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill>
      <FondoColor color={C.naranja} />
      <Cam golpes={[fila, va + 16, plata]} fuerza={22}>
        {/* la fila de 4 en el banco */}
        <div style={{ position: 'absolute', left: 40, top: 1150, width: 620, height: 34, background: '#8a5a2b', border: '7px solid #111', borderRadius: 10 }} />
        {[0, 1, 2, 3].map((i) => <Cliente key={i} x={110 + i * 150} y={1170} s={0.62} color={[C.celeste, C.verde, C.amarillo, C.rosa][i]} cara="aburrido" />)}
        <Balde x={980} y={1700} s={0.85} nivel={0.6} marcar={1} chorros={false} />
        <Impaciente x={interpolate(salto, [0, 1], [790, 980])} y={interpolate(salto, [0, 1], [1290, 1560]) - Math.sin(salto * Math.PI) * 300} s={1.2 * (1 - salto * 0.7)} rot={salto * 200} fase={f < fila ? 'reloj' : 'resopla'} />
      </Cam>
      {f >= va + 16 && <Particulas at={va + 16} x={980} y={1560} n={30} colores={[C.billete, C.amarillo, '#fff']} seed="chapuzon" />}
      <TextoGrande y={TY} at={0} texto="LA FILA" max={190} hasta={plata - 1} />
      <TextoGrande y={TY} at={plata} texto={`LA FILA\n*−${$(K.corte * 24)}*`} max={170} />
      <Pie />
      <Rafaga s="tick" at={0} n={6} cada={3} v={0.35} /><Sfx s="huff" at={fila} v={0.7} />
      <Sfx s="whoosh" at={va} v={0.5} /><Sfx s="splash" at={va + 16} v={0.6} /><Sfx s="hit" at={plata} v={0.6} />
    </AbsoluteFill>
  );
};

// 5 · Agujero 3: el cliente que se olvida (se vuelve transparente) y nadie lo llama.
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const e = useEsc();
  const w = useW();
  const nadie = w('nadie');
  const o = interpolate(f, [6, e.vozFin], [1, 0.12], cl);
  return (
    <AbsoluteFill>
      <FondoColor color={C.celeste} />
      <Cam zoom={interpolate(f, [0, e.dur], [1, 1.15])} origen="50% 65%">
        {Array.from({ length: 12 }, (_, i) => {
          const a = f / 18 + i;
          return (
            <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(a) * (300 + (i % 3) * 70) - 60, top: 980 + Math.sin(a * 1.3) * 300 - 70, width: 120, height: 140, background: '#fff', border: '6px solid #111', borderRadius: 12, transform: `rotate(${a * 40}deg)`, textAlign: 'center', fontFamily: FUENTE_C, overflow: 'hidden' }}>
              <div style={{ background: C.rojo, height: 34, borderBottom: '5px solid #111' }} />
              <div style={{ fontSize: 60 }}>{(i * 7) % 30 + 1}</div>
            </div>
          );
        })}
        <Cliente x={540} y={1250} s={1.15} color={C.violeta} o={o} cara="normal" />
        {/* su celular: sin llamadas */}
        <div style={{ position: 'absolute', left: 700, top: 980, width: 150, height: 250, background: '#fff', border: '8px solid #111', borderRadius: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `rotate(10deg)`, fontFamily: FUENTE_C }}>
          <div style={{ fontSize: 30, color: '#111' }}>llamadas</div><div style={{ fontSize: 90, color: C.rojo }}>0</div>
        </div>
      </Cam>
      <TextoGrande y={TY} at={0} texto="EL OLVIDO" max={190} hasta={nadie - 1} />
      <TextoGrande y={TY} at={nadie} texto={`EL OLVIDO\n*−${$(K.corte * 6)}*`} max={170} />
      <Pie />
      <Sfx s="paper" at={0} v={0.5} /><Sfx s="wind" at={4} v={0.4} /><Sfx s="hit" at={nadie} v={0.6} />
    </AbsoluteFill>
  );
};

// 6 · Total: el balde se vacía, la Silla llora, el Barbero se agarra la cabeza y el monitor vuelve: piiiii.
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = useEsc();
  const golpe = 3;
  const pausa = e.pausa ? e.pausa[0] : e.dur;
  const nivel = interpolate(spring({ frame: f - golpe, fps, config: { damping: 7, stiffness: 120 } }), [0, 1], [0.6, 0.06]);
  const quieto = f >= pausa;
  return (
    <AbsoluteFill style={{ filter: quieto ? 'saturate(.35)' : undefined }}>
      <FondoColor color={C.rojo} late={!quieto} />
      <Cam golpes={[golpe, golpe + 8]} fuerza={40} zoom={quieto ? 1.06 : 1}>
        <Balde x={540} y={1290} s={1.05} nivel={nivel} chorros={!quieto} />
        <Silla x={170} y={1300} s={0.62} animo="triste" llora />
        <Barbero x={900} y={1330} s={0.7} cara="desesperado" manosCabeza />
      </Cam>
      <TextoGrande y={TY} at={golpe} texto={`*−${$(K.corte * 42)}*\nPOR MES`} max={190} corre={14} />
      <Pie />
      <Sfx s="boom" at={golpe} v={0.8} /><Sfx s="sob" at={golpe + 8} v={0.6} /><Sfx s="flatline" at={golpe + 10} v={0.45} />
    </AbsoluteFill>
  );
};

// 7 · GIRO (drop): entra el Celular como superhéroe y tapa los 3 agujeros con parches.
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const entra = spring({ frame: f, fps, config: { damping: 12, stiffness: 110 } });
  const hitos = [w('sena'), w('fila'), w('lista')];
  // en cada hito: primero el celular muestra la función, después el parche pega en el balde
  const plafs = hitos.map((h, i) => h + Math.round(Math.min(26, 0.62 * ((hitos[i + 1] ?? h + 40) - h))));
  const k = hitos.filter((h) => f >= h).length - 1; // -1 = entrada del superhéroe
  const enCelu = k < 0 || f < plafs[k];
  const tapados = plafs.map((p) => f >= p);
  const rotulos = ['SEÑA', 'QR', 'LISTA'];
  const pantallas = [
    <PantallaSena key="s" monto={$(K.sena)} toque={2} ok={8} />,
    <PantallaQR key="q" ok={6} />,
    <PantallaLista key="l" toque={6} />,
  ];
  return (
    <AbsoluteFill>
      <FondoColor color={C.violeta} />
      {enCelu ? (
        <AbsoluteFill>
          <LineasVelocidad o={k < 0 ? 1 : 0.4} />
          <Cam golpes={k < 0 ? [12] : [hitos[k]]} fuerza={20}>
            <CelularHeroe x={interpolate(entra, [0, 1], [-200, 540])} y={k < 0 ? interpolate(entra, [0, 1], [2000, 1000]) : 990} s={k < 0 ? 0.9 : 1.3} rot={k < 0 ? interpolate(entra, [0, 1], [-40, -4]) : -3} capa={k < 0}>
              {k < 0 ? <div style={{ width: '100%', height: '100%', background: C.violeta, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}><div style={{ fontSize: 200 }}>💈</div><div style={{ fontFamily: FUENTE_C, fontSize: 70, color: '#fff', WebkitTextStroke: '8px #111', paintOrder: 'stroke', textAlign: 'center' }}>SILLA<br />LLENA</div></div> : <PantallaSeq at={hitos[k]}>{pantallas[k]}</PantallaSeq>}
            </CelularHeroe>
          </Cam>
          {k >= 0 && <Rotulo x={500} y={240} at={hitos[k] - 2} size={100} bg={C.amarillo}>{['SEÑA', 'FILA CON QR', 'LISTA'][k]}</Rotulo>}
          {k < 0 && <TextoGrande y={300} at={6} texto="*AHORA MIRÁ*" max={150} />}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill>
          <Cam golpes={[plafs[k]]} fuerza={34}>
            <Balde x={540} y={1330} s={1.3} nivel={0.25 + tapados.filter(Boolean).length * 0.12} tapados={tapados} rotulos={rotulos} chorros={!tapados.every(Boolean)} />
          </Cam>
          <Onda at={plafs[k]} x={[300, 540, 780][k]} y={[1090, 1220, 1090][k]} color="#fff" />
          <div style={{ position: 'absolute', left: [300, 540, 780][k], top: 760, transform: `translate(-50%,-50%) rotate(-8deg) scale(${spring({ frame: f - plafs[k], fps, config: { damping: 8, stiffness: 300 } })})`, fontFamily: FUENTE_C, fontSize: 150, color: '#fff', WebkitTextStroke: '14px #111', paintOrder: 'stroke' }}>¡PLAF!</div>
        </AbsoluteFill>
      )}
      <Flash at={0} max={0.8} />
      <Sfx s="superhero" at={0} v={0.8} />
      {hitos.map((h, i) => <React.Fragment key={i}><Sfx s="whoosh" at={h} v={0.4} /><Sfx s="plaf" at={plafs[i]} v={0.9} /><Sfx s="stamp" at={plafs[i] + 1} v={0.4} /></React.Fragment>)}
    </AbsoluteFill>
  );
};

/** Desplaza el tiempo de una pantalla del celular para que su animación arranque en `at`. */
const PantallaSeq: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => <Sequence from={at} layout="none">{children}</Sequence>;

// 8 · El balde desborda, los billetes explotan y aparece el logo. El monitor vuelve a latir.
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = useW();
  const logo = w('silla');
  const ls = spring({ frame: f - logo, fps, config: { damping: 9, stiffness: 200 } });
  return (
    <AbsoluteFill>
      <FondoColor color={C.verde} />
      <Cam golpes={[0, logo]} fuerza={22} zoom={interpolate(f, [0, 90], [1.12, 1], cl)}>
        <Balde x={540} y={1350} s={1.05} nivel={1.12} tapados={[true, true, true]} rotulos={['SEÑA', 'QR', 'LISTA']} chorros={false} />
        <Monitor x={850} y={1010} s={0.3} estado="late" />
        <Silla x={880} y={1380} s={0.55} animo="feliz" color={C.violeta} />
      </Cam>
      <LluviaBilletes at={0} n={22} desde={[540, 1000]} hacia={[540, -200]} dura={40} seed="explota">{(i, x, y, r, o) => <Billete key={i} x={x + (i % 2 ? 1 : -1) * i * 25} y={y} rot={r} o={o} w={140} />}</LluviaBilletes>
      <Confeti at={4} colores={[C.amarillo, C.violeta, '#fff', C.rosa]} />
      {f >= logo && <div style={{ transform: `scale(${ls})`, transformOrigin: '500px 420px', position: 'absolute', inset: 0 }}><Logo x={500} y={420} s={0.95} /></div>}
      <Sfx s="coins" at={0} v={0.6} /><Sfx s="cash" at={6} v={0.6} /><Sfx s="fanfare" at={logo} v={0.5} />
      <Rafaga s="pip" at={20} n={3} cada={14} v={0.3} />
    </AbsoluteFill>
  );
};

// 9 · Cierre: Comentá BARBER + 14 días gratis.
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const w = useW();
  const b = w('barber');
  const gratis = w('gratis');
  return (
    <AbsoluteFill>
      <FondoColor color={C.violeta} />
      <Barbero x={740} y={1420} s={0.78} cara="feliz" brazo={-120} />
      <Silla x={250} y={1380} s={0.5} animo="feliz" color={C.amarillo} />
      <TextoGrande y={TY} at={0} texto={'COMENTÁ\n*BARBER*'} max={210} />
      <Rotulo x={480} y={770} at={gratis - 4} bg={C.verde} size={74} rot={4}>{K.diasPrueba} DÍAS GRATIS</Rotulo>
      <Sfx s="pop" at={0} v={0.6} /><Sfx s="hit" at={b} v={0.6} /><Sfx s="doorbell" at={gratis} v={0.5} />
    </AbsoluteFill>
  );
};

export const C01: React.FC<ShortProps> = (p) => (
  <Short {...p} acento={C.amarillo} subs={{ top: 1290, size: 54, fuente: FUENTE_R }}
    escenas={[S0, S1, S2, S3, S4, S5, S6, S7, S8]}
    trans={[seRompe(), zoomBlur(1.4), cruzaFantasma(), billeteACamara(), whipV(1), undefined, flashT('#fff'), slide({ direction: 'from-bottom' })]} />
);
