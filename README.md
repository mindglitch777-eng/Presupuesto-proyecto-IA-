# Videos para barberías

Diez videos verticales animados con código para TikTok, YouTube Shorts y Reels. Sirven para validar si las barberías quieren la app antes de construirla.

- **`GUIONES.md`**: los 10 guiones escena por escena, con las reglas de retención y el orden de publicación.
- **`videos/config.js`**: precio del corte, seña, precios de la app y tu usuario. Si cambiás un valor y volvés a renderizar, los montos se recalculan.
- **`videos/guiones/01.js` … `10.js`**: cada video, escena por escena.
- **`videos/engine/`**: el motor. Dibuja cada cuadro en un canvas, lo captura con Playwright, lo codifica con ffmpeg y sintetiza los efectos de sonido sin archivos externos.
- **`videos/render/`**: los MP4 terminados (1080×1920, 30 fps).

## Renderizar

```bash
cd videos
node engine/render.mjs 01            # video completo → out/01.mp4
node engine/render.mjs 01 --sheet    # un cuadro por escena para revisar → out/01-sheet.jpg
```

Hace falta Node con Playwright, ffmpeg y Python con numpy. Cada video tarda alrededor de un minuto en renderizarse.

## Al publicar

- Agregá un sonido en tendencia desde la app a volumen bajo, entre 10 % y 20 %: los efectos del video ya marcan el ritmo.
- Los textos quedan fuera de la franja derecha y del 20 % de abajo, que es donde TikTok pone los botones y la descripción.
- La app que aparece es un prototipo, así que el cierre siempre es "comentá BARBER" y nunca "descargala".
