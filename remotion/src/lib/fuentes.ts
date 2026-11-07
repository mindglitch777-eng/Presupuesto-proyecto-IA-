import { loadFont } from '@remotion/fonts';
import { staticFile, delayRender, continueRender } from 'remotion';

export const FUENTE = 'Inter Display, Noto Color Emoji, sans-serif';
export const EMOJI = 'Noto Color Emoji';

let cargadas = false;
export const cargarFuentes = () => {
  if (cargadas) return;
  cargadas = true;
  const h = delayRender('fuentes');
  Promise.all([
    ...[['Black', '900'], ['ExtraBold', '800'], ['Bold', '700'], ['SemiBold', '600']].map(([n, w]) =>
      loadFont({ family: 'Inter Display', url: staticFile(`fonts/InterDisplay-${n}.otf`), weight: w })),
    loadFont({ family: 'Noto Color Emoji', url: staticFile('fonts/NotoColorEmoji.ttf') }),
    loadFont({ family: 'Lilita One', url: staticFile('fonts/LilitaOne.woff2'), weight: '400' }),
    loadFont({ family: 'Fredoka', url: staticFile('fonts/Fredoka-Bold.woff2'), weight: '700' }),
    loadFont({ family: 'Fredoka', url: staticFile('fonts/Fredoka-SemiBold.woff2'), weight: '600' }),
  ]).then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
};
