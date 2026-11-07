# Videos para barberías

Diez videos verticales animados con código para TikTok, YouTube Shorts y Reels. Sirven para validar si las barberías quieren la app antes de construirla.

- **`GUIONES-VIRALES.md`**: los 10 guiones nuevos para leer, con gancho, giro y loop. Los guiones de verdad están en `remotion/shorts/NN-nombre/short.json`; las reglas que siguen, en `docs/REGLAS-SHORTS.md`.
- **`videos/config.js`**: precio del corte, seña, precios de la app y tu usuario. Si cambiás un valor y volvés a renderizar, los montos se recalculan.
- **`remotion/`**: los videos, hechos con Remotion.
  - Cada video tiene su propio código en `src/shorts/v01.tsx` … `v10.tsx`, con 3D, transiciones, partículas, rayos y la comparación SIN/CON la app.
  - **Voz:** Edge TTS `es-CO-GonzaloNeural` a +22 %, con subtítulos palabra por palabra.
  - **Música y efectos:** generados por código en `audio/`. La música baja cuando habla la voz y frena en silencio justo antes del giro.
- **`videos/render/`**: los MP4 terminados (1080×1920, 30 fps, −14 LUFS).
- **`GUIONES.md`** y **`videos/engine/`**: la primera versión y el motor viejo, que quedan como referencia.

## Renderizar en GitHub (recomendado)

El workflow `.github/workflows/videos.yml` renderiza los 10 videos en paralelo con la voz de Edge TTS y los sube a `videos/render/`. Se corre de dos formas:

- **Solo:** cada vez que se cambia un guion, el motor o `config.js`.
- **A mano:** desde el celular, en la pestaña **Actions** → **Renderizar videos** → **Run workflow**. Ahí se eligen los videos (por ejemplo `01,04` o `todos`), la voz y la velocidad.

Tarda unos 15 minutos. Los links de descarga son siempre los mismos: `https://github.com/mindglitch777-eng/Presupuesto-proyecto-IA-/raw/main/videos/render/01.mp4` (y así del 01 al 10).

Otras voces masculinas para probar: `es-MX-JorgeNeural`, `es-CO-GonzaloNeural`, `es-US-AlonsoNeural`.

## Renderizar en una computadora

```bash
cd remotion && npm install
pip install edge-tts numpy soundfile scipy num2words
node scripts/render.mjs 01           # video completo → videos/render/01.mp4
node scripts/hoja.mjs 01             # una captura por escena para revisar → remotion/out/01-…-hoja.jpg
```

Sin internet, `VOZ_MOTOR=estimado` arma todo con la voz en silencio y tiempos estimados. Sirve para revisar la animación.

## Al publicar

- El video ya trae voz, música y efectos. Si querés sumar un sonido en tendencia, ponelo casi al mínimo para que no tape la voz.
- Los textos quedan fuera de la franja derecha y del 20 % de abajo, que es donde TikTok pone los botones y la descripción.
- La app que aparece es un prototipo, así que el cierre siempre es "comentá BARBER" y nunca "descargala".
