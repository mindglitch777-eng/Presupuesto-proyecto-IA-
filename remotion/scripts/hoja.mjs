// Capturas para revisar un video: un cuadro por escena (o los que se pidan) y una hoja con todos juntos.
// Uso: node scripts/hoja.mjs 01 [--frames 10,200,450] [--guias] [--cada 30]
// Deja out/<id>/f<cuadro>.png y out/<id>-hoja.jpg
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { idsDe } from './prep.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const ids = idsDe(args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--guias')));
const browserExecutable = process.env.REMOTION_BROWSER || null;

const serveUrl = await bundle({ entryPoint: path.join(RAIZ, 'src/index.ts'), publicDir: path.join(RAIZ, 'public') });
for (const id of ids) {
  const comp = 'v' + id.slice(0, 2);
  const inputProps = { id, guias: args.includes('--guias') };
  const c = await selectComposition({ serveUrl, id: comp, inputProps, browserExecutable, chromiumOptions: { gl: 'swangle' } });
  const tl = c.props.timeline;
  let frames;
  if (opt('--frames')) frames = opt('--frames').split(',').map(Number);
  else if (opt('--cada')) frames = Array.from({ length: Math.floor(c.durationInFrames / +opt('--cada')) }, (_, i) => i * +opt('--cada'));
  else frames = [0, ...tl.escenas.map((e) => e.start + Math.round(e.dur * 0.6)), c.durationInFrames - 1];
  const dir = path.join(RAIZ, 'out', id);
  fs.mkdirSync(dir, { recursive: true });
  const files = [];
  for (const frame of frames) {
    const output = path.join(dir, `f${String(frame).padStart(4, '0')}.png`);
    await renderStill({ composition: c, serveUrl, output, frame, inputProps: c.props, browserExecutable, chromiumOptions: { gl: 'swangle' }, scale: 0.5 });
    files.push(output);
    process.stdout.write('.');
  }
  const cols = 6;
  const hoja = path.join(RAIZ, 'out', `${id}-hoja.jpg`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...files.flatMap((f) => ['-i', f]), '-filter_complex',
    files.map((_, i) => `[${i}:v]scale=270:480,drawtext=text='${frames[i]}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black[v${i}]`).join(';') + ';' +
    files.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${files.length}:layout=` +
    files.map((_, i) => `${(i % cols) * 270}_${Math.floor(i / cols) * 480}`).join('|') + `:fill=black`, hoja]);
  console.log(`\n${id}: ${hoja}`);
}
