// Prepara un video para Remotion: voz de cada escena (Edge TTS), línea de tiempo y audio (voz + música).
// Uso: node scripts/prep.mjs 01 [02 …] | todos
// Escribe public/shorts/<id>/{timeline.json, audio.wav, voz/*.wav}. Con VOZ_MOTOR=estimado no necesita internet.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { cargarConfig, expandir } from './montos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 30;
const PAD_IN = 0.12;   // aire antes de que hable la voz en cada escena
const PAD_OUT = 0.32;  // aire después (cubre la transición)
const TRANS = 10;      // cuadros de cada transición (0 después de un silencio: corte seco)
const COLA = 0.6;      // segundos extra al final para el empalme del loop

export function idsDe(args) {
  const todos = fs.readdirSync(path.join(RAIZ, 'shorts')).filter((d) => /^\d\d-/.test(d)).sort();
  if (!args.length || args[0] === 'todos') return todos;
  return args.map((a) => todos.find((d) => d.startsWith(a.padStart(2, '0'))) || a);
}

/** Junta las palabras de un monto leído en letras ("un millón … pesos") en un solo token "$1.440.000". */
function juntarMontos(words, montos) {
  let ws = words.map((w) => ({ ...w }));
  for (const m of montos || []) {
    const objetivo = m.hablado.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i + objetivo.length <= ws.length; i++) {
      if (objetivo.every((o, k) => norm(ws[i + k].w) === o)) {
        const ult = ws[i + objetivo.length - 1];
        const punt = (ult.w.match(/[.,!?…:]+$/) || [''])[0];
        ws.splice(i, objetivo.length, { w: m.ver + punt, t: ws[i].t, d: ult.t + ult.d - ws[i].t });
        break;
      }
    }
  }
  return ws;
}

const norm = (w) => w.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9ñ]/g, '');

export function prep(id) {
  const cfg = cargarConfig();
  fs.writeFileSync(path.join(RAIZ, 'public/config.json'), JSON.stringify(cfg, null, 1));
  const s = JSON.parse(fs.readFileSync(path.join(RAIZ, 'shorts', id, 'short.json'), 'utf8'));
  const out = path.join(RAIZ, 'public/shorts', id);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(path.join(out, 'voz'), { recursive: true });
  if (!fs.existsSync(path.join(RAIZ, 'public/sfx/boom.wav'))) execFileSync('python3', [path.join(RAIZ, 'audio/sfx.py'), path.join(RAIZ, 'public/sfx')]);

  const textos = s.scenes.map((e) => expandir(e.say, cfg, 'voz'));
  fs.writeFileSync(path.join(out, 'textos.json'), JSON.stringify(textos));
  const voces = JSON.parse(execFileSync('python3', [path.join(RAIZ, 'audio/voz.py'), path.join(out, 'textos.json'), path.join(out, 'voz')], { maxBuffer: 1 << 26 }).toString().trim().split('\n').pop());

  const escenas = [];
  let start = 0;
  s.scenes.forEach((e, i) => {
    const v = voces[i];
    const pausa = e.pause_after || 0;
    const ultima = i === s.scenes.length - 1;
    const padIn = i === 0 ? 0.05 : PAD_IN;
    const dur = Math.ceil((padIn + v.dur + PAD_OUT + pausa + (ultima ? COLA : 0)) * FPS);
    const trans = ultima ? 0 : pausa ? 0 : TRANS;
    escenas.push({
      i, beat: e.beat, reward: e.reward,
      say: expandir(e.say, cfg, 'pantalla'),
      onScreen: expandir(e.onScreen, cfg, 'pantalla'),
      start, dur, trans,
      vozDesde: Math.round(padIn * FPS),       // cuadro (relativo a la escena) en que arranca la voz
      vozFin: Math.round((padIn + v.dur) * FPS),
      pausa: pausa ? [Math.round((padIn + v.dur + PAD_OUT) * FPS), dur] : null,
      words: juntarMontos(v.words, v.montos).map((w) => ({
        w: /^b[aá]rber$/i.test(w.w.replace(/[^\wáéíóú]/g, '')) ? w.w.replace(/b[aá]rber/i, 'BARBER') : w.w,
        n: norm(w.w),
        f: Math.round((padIn + w.t) * FPS),     // cuadro relativo a la escena
        fin: Math.round((padIn + w.t + w.d) * FPS),
      })),
      vozFile: path.relative(path.join(RAIZ, 'public'), v.file),
    });
    start += dur - trans;
  });
  const total = escenas.at(-1).start + escenas.at(-1).dur;

  const iGiro = s.scenes.findIndex((e) => e.beat === 'twist');
  const giro = iGiro >= 0 ? escenas[iGiro].start / FPS : null;
  const prev = iGiro > 0 ? escenas[iGiro - 1] : null;
  const silencio = prev?.pausa ? [(prev.start + prev.pausa[0]) / FPS, escenas[iGiro].start / FPS] : null;

  const plan = {
    duracion: total / FPS, estilo: s.music.preset, giro, silencio,
    voces: escenas.map((e, i) => ({ file: voces[i].file, t: (e.start + e.vozDesde) / FPS })),
  };
  fs.writeFileSync(path.join(out, 'plan.json'), JSON.stringify(plan));
  execFileSync('python3', [path.join(RAIZ, 'audio/mezcla.py'), path.join(out, 'plan.json'), path.join(out, 'audio.wav')]);

  const timeline = { id, fps: FPS, total, motor: process.env.VOZ_MOTOR || 'edge', giro, silencio, escenas };
  fs.writeFileSync(path.join(out, 'timeline.json'), JSON.stringify(timeline, null, 1));
  console.log(`${id}: ${(total / FPS).toFixed(1)} s, ${escenas.length} escenas, giro al ${giro ? ((giro * FPS / total) * 100).toFixed(0) : '—'} %`);
  return timeline;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const id of idsDe(process.argv.slice(2))) prep(id);
}
