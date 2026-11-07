// Control automático de un guion antes del render (reglas de docs/REGLAS-SHORTS.md).
// Uso: node scripts/check-short.mjs [carpeta-o-short.json ...]   (sin argumentos revisa todos los de shorts/)
// Frena (código 1) con errores; los avisos no frenan.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cargarConfig, expandir } from './montos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REWARDS = ['paradox', 'number', 'reveal', 'quote', 'data', 'consequence', 'twist', 'contrast', 'payoff', 'challenge', 'humor'];
const BEATS = ['hook', 'reward', 'twist', 'payoff', 'loop'];
const PALABRAS_POR_SEG = 2.9; // medido con Edge es-CO-GonzaloNeural a +22 % en los renders reales (incluye pausas).

const cfg = cargarConfig();
const palabras = (t) => t.replace(/\[\[-?\d+\]\]/g, ' m m m m ').replace(/\{\{\d+\}\}/g, ' n n ').replace(/[*¿?¡!.,:;"'()…—–-]/g, ' ').split(/\s+/).filter(Boolean);

function revisar(archivo) {
  const s = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  const err = [], warn = [];
  for (const k of ['id', 'title', 'belief_broken', 'direction', 'music', 'scenes']) if (!s[k]) err.push(`falta "${k}" arriba`);
  const sc = s.scenes || [];
  let t = 0; const inicios = [];
  sc.forEach((e, i) => {
    const n = `escena ${i + 1}`;
    for (const k of ['beat', 'reward', 'say', 'onScreen', 'visual', 'camera', 'transition', 'sfx']) if (!e[k]) err.push(`${n}: falta "${k}"`);
    if (e.beat && !BEATS.includes(e.beat)) err.push(`${n}: beat desconocido "${e.beat}"`);
    if (e.reward && !REWARDS.includes(e.reward)) err.push(`${n}: reward desconocido "${e.reward}"`);
    if (i > 0 && e.reward && e.reward === sc[i - 1].reward) err.push(`${n}: repite la recompensa "${e.reward}" de la escena anterior`);
    const dicho = expandir(e.say || '', cfg, 'voz');
    const enPantalla = expandir(e.onScreen || '', cfg, 'pantalla');
    const nPant = palabras(enPantalla).length;
    if (nPant > (e.type === 'quote' ? 10 : 6)) err.push(`${n}: ${nPant} palabras en pantalla (máx. 6): "${enPantalla.replace(/\n/g, ' / ')}"`);
    const d = palabras(dicho).length / PALABRAS_POR_SEG + 0.15 + (e.pause_after || 0);
    if (d > 4.6) warn.push(`${n}: ~${d.toFixed(1)} s (apuntar a 3-4,5 s)`);
    inicios.push(t); t += d;
    if (i === 0) {
      if (e.beat !== 'hook') err.push('la primera escena no es hook');
      const nh = palabras(dicho).length;
      if (nh > 12) err.push(`gancho hablado de ${nh} palabras (máx. 12): "${dicho}"`);
    }
  });
  const iTw = sc.findIndex((e) => e.beat === 'twist');
  let posTw = null;
  if (iTw < 0) warn.push('no hay twist');
  else {
    posTw = inicios[iTw] / t;
    if (posTw < 0.55 || posTw > 0.75) warn.push(`el twist cae al ${(posTw * 100).toFixed(0)} % (apuntar a 55-75 %)`);
    if (!(sc[iTw - 1]?.pause_after >= 0.3)) warn.push('falta el silencio (pause_after ≥ 0,3) antes del twist');
  }
  if (sc.at(-1)?.beat !== 'loop') warn.push('el final no tiene beat "loop"');
  if (!/BARBER/.test(sc.at(-1)?.say || '') && !/BARBER/.test(sc.at(-2)?.say || '')) err.push('el cierre no dice "Comentá BARBER"');
  if (/descarg/i.test(JSON.stringify(sc))) err.push('dice "descargá": la app es un prototipo');
  if (t < 25 || t > 40) warn.push(`duración estimada ${t.toFixed(1)} s (CLAUDE.md pide 25-40 s)`);
  return { s, err, warn, t, posTw };
}

const args = process.argv.slice(2);
const dir = path.join(RAIZ, 'shorts');
const archivos = (args.length ? args : fs.readdirSync(dir).sort().map((d) => path.join(dir, d)))
  .map((a) => (fs.statSync(a).isDirectory() ? path.join(a, 'short.json') : a))
  .filter((a) => fs.existsSync(a));

let fallo = false;
for (const a of archivos) {
  const { s, err, warn, t, posTw } = revisar(a);
  const tw = posTw == null ? '—' : `${(posTw * 100).toFixed(0)} %`;
  console.log(`\n${err.length ? '✗' : '✓'} ${s.id}  ·  ~${t.toFixed(1)} s  ·  ${s.scenes.length} escenas  ·  giro al ${tw}`);
  err.forEach((e) => console.log(`   ERROR  ${e}`));
  warn.forEach((w) => console.log(`   aviso  ${w}`));
  if (err.length) fallo = true;
}
process.exit(fallo ? 1 : 0);
