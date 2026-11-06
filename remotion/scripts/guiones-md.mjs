// Arma GUIONES-VIRALES.md (en la raíz del repo) a partir de remotion/shorts/*/short.json, para leer y aprobar.
// Uso: node scripts/guiones-md.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cargarConfig, expandir } from './montos.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SHORTS = path.resolve(AQUI, '../shorts');
const SALIDA = path.resolve(AQUI, '../../GUIONES-VIRALES.md');
const cfg = cargarConfig();
const P = (t) => expandir(t, cfg, 'pantalla');
const pant = (t) => P(t).replace(/\n/g, ' / ').replace(/\*([^*]+)\*/g, '**$1**');
const celda = (t) => String(t).replace(/\|/g, '\\|');

let md = `# 10 guiones virales para barberos (versión Remotion)

Generado desde \`remotion/shorts/*/short.json\` con \`node scripts/guiones-md.mjs\`. **No editar a mano:** se edita el JSON y se vuelve a generar.

Siguen las reglas de \`docs/REGLAS-SHORTS.md\` y de \`CLAUDE.md\`:
- gancho de 12 palabras o menos, con una pregunta abierta;
- una recompensa distinta cada 3 a 5 s;
- un giro entre el 55 % y el 75 %, con silencio antes;
- un final que empalma con el primer cuadro.

Cada video tiene su propio estilo visual. Los montos salen de \`videos/config.js\`: corte ${P('{$corte}')}, seña ${P('{$sena}')}, mensual ${P('{$mensual}')} y fundador ${P('{$fundador}')}. En la voz, **BARBER** se lee "bárber".

**Cómo leer las tablas:**
- **En pantalla:** lo que va en negrita es la palabra clave. Sale en color y dispara un golpe.
- **Beat** es el papel de la escena: gancho, recompensa, giro, payoff o loop.
- **Recompensa** es lo que recibe el espectador en esa escena: paradoja, número, revelación, contraste, desafío, etc.

`;

for (const d of fs.readdirSync(SHORTS).sort()) {
  const f = path.join(SHORTS, d, 'short.json');
  if (!fs.existsSync(f)) continue;
  const s = JSON.parse(fs.readFileSync(f, 'utf8'));
  md += `---\n\n## ${s.id.slice(0, 2)}. "${s.title}"\n\n`;
  md += `- **Qué muestra de la app:** ${s.feature}\n- **Creencia que rompe:** ${s.belief_broken}\n`;
  md += `- **Concepto:** ${P(s.direction.concept)}\n- **Estilo:** ${s.direction.look}\n- **Ritmo:** ${s.direction.pacing}\n- **Loop:** ${s.direction.loop}\n`;
  md += `- **Música:** ${s.music.style} (${s.music.tempo})\n`;
  if (s.fiction) md += `- **Ficción:** sí. Los personajes son de ejemplo y no se presentan como casos reales.\n`;
  md += `\n| # | Beat · recompensa | Voz | En pantalla | Imagen |\n|---|---|---|---|---|\n`;
  s.scenes.forEach((e, i) => {
    const pausa = e.pause_after ? ` *(silencio ${e.pause_after} s)*` : '';
    md += `| ${i + 1} | ${e.beat} · ${e.reward} | ${celda(P(e.say))}${pausa} | ${celda(pant(e.onScreen))} | ${celda(P(e.visual))} |\n`;
  });
  const k = s.packaging;
  md += `\n**Título:** ${k.title} · **Portada:** ${k.cover} · **Leyenda:** ${P(k.caption)} · **Hashtags:** ${k.hashtags.join(' ')} · **Comentario fijado:** ${k.pinned}\n\n`;
}
fs.writeFileSync(SALIDA, md);
console.log('escrito', path.relative(process.cwd(), SALIDA));
