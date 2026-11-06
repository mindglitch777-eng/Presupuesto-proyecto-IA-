// Uso: node videos/engine/render.mjs 01 [--frames 0,45,120]  (con --frames solo saca capturas de prueba)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const id = process.argv[2];
const fi = process.argv.indexOf('--frames');
const testFrames = fi > 0 ? process.argv[fi + 1].split(',').map(Number) : null;
const out = path.resolve(here, '../out');
const work = path.join(out, 'tmp-' + id);
fs.mkdirSync(work, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + path.join(here, 'stage.html') + '?v=' + id);
await page.waitForFunction(() => window.READY);
await page.evaluate(async () => {
  await document.fonts.load('900 100px "Inter Display"');
  await document.fonts.load('800 100px "Inter Display"');
  await document.fonts.load('600 40px "Inter Display"');
  await document.fonts.load('100px "Noto Color Emoji"', '💈');
});
const def = await page.evaluate(() => ({ frames: DEF.frames, duration: DEF.duration, sfx: DEF.sfxAll, title: DEF.title,
  scenes: DEF.scenes.map(s => ({ f0: s.f0, frames: s.frames })) }));

const grab = f => page.evaluate(f => { renderFrame(f); return document.getElementById('c').toDataURL('image/jpeg', .92).split(',')[1]; }, f);

if (process.argv.includes('--sheet')) { // un cuadro al 75 % de cada escena, todos en una hoja
  const fs2 = [];
  for (const [i, s] of def.scenes.entries()) {
    const p = path.join(work, `sh${i}.jpg`); fs2.push(p);
    fs.writeFileSync(p, Buffer.from(await grab(s.f0 + Math.floor(s.frames * .75)), 'base64'));
  }
  const cols = Math.min(7, fs2.length), rows = Math.ceil(fs2.length / cols);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-pattern_type', 'sequence', '-i', path.join(work, 'sh%d.jpg'),
    '-vf', `scale=300:-1,tile=${cols}x${rows}:padding=6`, '-frames:v', '1', path.join(out, `${id}-sheet.jpg`)]);
  console.log('hoja lista'); await browser.close(); process.exit(0);
}
if (testFrames) {
  for (const f of testFrames) fs.writeFileSync(path.join(out, `${id}-f${f}.jpg`), Buffer.from(await grab(f), 'base64'));
  console.log('capturas listas', testFrames.join(','));
  await browser.close(); process.exit(0);
}

const list = [];
for (let i = 0; i < def.scenes.length; i++) {
  const s = def.scenes[i], tmp = path.join(work, `s${String(i).padStart(2, '0')}.part.mp4`), fin = tmp.replace('.part', '');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', tmp]);
  const done = new Promise((res, rej) => ff.on('exit', c => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
  for (let f = s.f0; f < s.f0 + s.frames; f++) {
    const buf = Buffer.from(await grab(f), 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await done; fs.renameSync(tmp, fin); list.push(fin);
  process.stdout.write(`escena ${i + 1}/${def.scenes.length}\r`);
}
await browser.close();

fs.writeFileSync(path.join(work, 'list.txt'), list.map(f => `file '${f}'`).join('\n'));
fs.writeFileSync(path.join(work, 'sfx.json'), JSON.stringify({ duration: def.duration, events: def.sfx }));
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(work, 'list.txt'), '-c', 'copy', path.join(work, 'video.mp4')]);
execFileSync('python3', [path.join(here, 'sfx.py'), path.join(work, 'sfx.json'), path.join(work, 'sfx.wav')]);
const final = path.join(out, `${id}.mp4`), tmpFinal = path.join(out, `${id}.part.mp4`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(work, 'video.mp4'), '-i', path.join(work, 'sfx.wav'),
  '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', tmpFinal]);
fs.renameSync(tmpFinal, final);
fs.rmSync(work, { recursive: true, force: true });
console.log(`\nlisto: ${final} (${def.duration.toFixed(1)} s)`);
