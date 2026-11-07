// Renderiza uno o más videos completos: voz + línea de tiempo (prep), video (Remotion) y volumen final (−14 LUFS).
// Uso: node scripts/render.mjs 01 [02 …] | todos   [--sin-prep]
// Deja el MP4 en ../videos/render/NN.mp4 (o en RENDER_DIR, para pruebas locales)
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { idsDe, prep } from './prep.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const ids = idsDe(args.filter((a) => !a.startsWith('--')));
const browserExecutable = process.env.REMOTION_BROWSER || null;
const concurrency = Number(process.env.CONCURRENCIA || Math.max(1, Math.min(8, os.cpus().length)));

if (!args.includes('--sin-prep')) for (const id of ids) prep(id);
const serveUrl = await bundle({ entryPoint: path.join(RAIZ, 'src/index.ts'), publicDir: path.join(RAIZ, 'public') });
fs.mkdirSync(path.join(RAIZ, 'out'), { recursive: true });
const destino = path.resolve(RAIZ, process.env.RENDER_DIR || '../videos/render');
fs.mkdirSync(destino, { recursive: true });

for (const id of ids) {
  const t0 = Date.now();
  const inputProps = { id };
  const composition = await selectComposition({ serveUrl, id: 'v' + id.slice(0, 2), inputProps, browserExecutable, chromiumOptions: { gl: 'swangle' } });
  const crudo = path.join(RAIZ, 'out', `${id}-crudo.mp4`);
  let ultimo = -1;
  await renderMedia({
    composition, serveUrl, codec: 'h264', outputLocation: crudo, inputProps: composition.props, browserExecutable,
    chromiumOptions: { gl: 'swangle' }, concurrency, crf: 18, pixelFormat: 'yuv420p', audioCodec: 'aac', audioBitrate: '256k',
    timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== ultimo) { ultimo = p; process.stdout.write(`${id} ${p * 10}% `); } },
  });
  // volumen final: −14 LUFS integrado, pico real ≤ −1,5 dBTP, 48 kHz (dos pasadas de loudnorm)
  let m;
  try {
    const err = execFileSync('bash', ['-c', `ffmpeg -hide_banner -i "${crudo}" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | tail -n 12`]).toString();
    m = JSON.parse(err.slice(err.indexOf('{')));
  } catch { m = null; }
  const filtro = m
    ? `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`
    : 'loudnorm=I=-14:TP=-1.5:LRA=11';
  const final = path.join(destino, `${id.slice(0, 2)}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', crudo, '-c:v', 'copy', '-af', filtro, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', final]);
  console.log(`\n${id}: ${final} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
