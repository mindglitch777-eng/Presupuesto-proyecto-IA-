# Videos para barberías

Diez videos verticales animados con código para TikTok, YouTube Shorts y Reels. Sirven para validar si las barberías quieren la app antes de construirla.

- **`GUIONES.md`**: los 10 guiones escena por escena, con las reglas de retención y el orden de publicación.
- **`videos/config.js`**: precio del corte, seña, precios de la app y tu usuario. Si cambiás un valor y volvés a renderizar, los montos se recalculan.
- **`videos/guiones/01.js` … `10.js`**: cada video, escena por escena.
- **`videos/engine/`**: el motor. Dibuja cada cuadro en un canvas, lo captura con Playwright y lo codifica con ffmpeg. Encima suma:
  - **Voz:** `voz.py` usa Edge TTS, con la voz masculina argentina `es-AR-TomasNeural` por defecto. Si no hay internet, cae a una voz Piper local. Los montos se leen en palabras.
  - **Música:** `musica.py` genera un beat de trap/phonk distinto para cada video. Es todo sintetizado, sin samples de terceros.
  - **Efectos:** `sfx.py` los sintetiza y mezcla todo, con la música que baja cuando habla la voz.
- **`videos/render/`**: los MP4 terminados (1080×1920, 30 fps).

## Renderizar en GitHub (recomendado)

El workflow `.github/workflows/videos.yml` renderiza los 10 videos en paralelo con la voz de Edge TTS y los sube a `videos/render/`. Se corre de dos formas:

- **Solo:** cada vez que se cambia un guion, el motor o `config.js`.
- **A mano:** desde el celular, en la pestaña **Actions** → **Renderizar videos** → **Run workflow**. Ahí se eligen los videos (por ejemplo `01,04` o `todos`), la voz y la velocidad.

Tarda unos 5 minutos. Los links de descarga son siempre los mismos: `https://github.com/mindglitch777-eng/Presupuesto-proyecto-IA-/raw/main/videos/render/01.mp4` (y así del 01 al 10).

Otras voces masculinas para probar: `es-MX-JorgeNeural`, `es-CO-GonzaloNeural`, `es-US-AlonsoNeural`.

## Renderizar en una computadora

```bash
cd videos
node engine/render.mjs 01            # video completo → out/01.mp4
node engine/render.mjs 01 --sheet    # un cuadro por escena para revisar → out/01-sheet.jpg
```

Hace falta Node con Playwright, ffmpeg y Python. La primera vez, `sh videos/engine/setup_voz.sh` descarga las voces y las dependencias. Cada video tarda alrededor de un minuto y medio.

- **Otra voz:** `VOZ=vits-piper-es_AR-daniela-high node engine/render.mjs 01` usa la voz argentina femenina. Es más regional, pero se entiende menos.
- **Velocidad:** se cambia con `VOZ_VELOCIDAD=1.0`.
- **Sin voz o sin música:** `--sin-voz` o `--sin-musica`.

## Al publicar

- El video ya trae voz, música y efectos. Si querés sumar un sonido en tendencia, ponelo casi al mínimo para que no tape la voz.
- Los textos quedan fuera de la franja derecha y del 20 % de abajo, que es donde TikTok pone los botones y la descripción.
- La app que aparece es un prototipo, así que el cierre siempre es "comentá BARBER" y nunca "descargala".
