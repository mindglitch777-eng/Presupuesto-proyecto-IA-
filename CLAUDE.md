# Videos para barberías — instrucciones para Claude Code

## Objetivo
Diez videos verticales (TikTok, YouTube Shorts y Reels) para validar si las barberías argentinas quieren una app de gestión. Cada video tiene que dejar claro **qué es la app y qué problema resuelve**. Todo se hace con código.

## Decisiones tomadas (no cambiarlas sin preguntar)
- **Herramienta:** Remotion 4.0.534, en `remotion/`. Se pueden sumar otras librerías de animación que mejoren el resultado.
- **Voz:** Edge TTS `es-CO-GonzaloNeural` con velocidad `+22%`. Edge da el tiempo de cada palabra, y eso se usa para los subtítulos.
- **Subtítulos:** estilo TikTok, palabra por palabra, con `@remotion/captions` (`createTikTokStyleCaptions`).
- **Estilo:** muchos colores, frases cortas y fuertes, transiciones con mucha energía (`@remotion/transitions`: slide, wipe, flip, clock-wipe, iris, zoom-blur, cross-zoom, push-cut…), animaciones con `spring`, números de plata que corren, rayos, partículas y confeti. La comparación **"SIN la app / CON la app"** en pantalla partida tiene que verse épica.
- **Música y efectos:** generados por código, sin derechos de terceros (ver `videos/engine/musica.py` y `videos/engine/sfx.py`). La música baja cuando habla la voz.
- **Render:** en GitHub Actions, porque Edge TTS necesita internet. Los MP4 terminan en `videos/render/01.mp4` … `10.mp4` y los links quedan fijos: `https://github.com/mindglitch777-eng/Presupuesto-proyecto-IA-/raw/main/videos/render/01.mp4`.
- **Formato:** 1080×1920 a 30 fps, de 25 a 40 s. Zonas seguras: nada importante en el 20 % de abajo ni en la franja derecha, que es donde TikTok pone los botones.

## Reglas de contenido
- **Español rioplatense** (voseo): "tenés", "comentá", "contame".
- **Montos:** salen de `videos/config.js` (corte $10.000, seña $2.000, mensual $10.000, fundadores $8.000, prueba 14 días). Son ejemplos y se muestran como tales; nunca prometer ganancias.
- **La app todavía es un prototipo:** el cierre es siempre "Comentá BARBER", nunca "descargala".
- **Nada de testimonios inventados** presentados como reales.
- **Lo que la app hace de verdad:** turnos online con seña por transferencia, fila virtual con QR, caja del día, ficha de cada cliente, lista de clientes que no volvieron con botón para escribirles por WhatsApp (link wa.me, sin API) y tarjeta de puntos.

## Estado actual
- **Los 10 videos están hechos en Remotion**, cada uno a medida: `remotion/src/shorts/v01.tsx` … `v10.tsx`, con su estilo propio (cine negro, chat con glitch, papel, arcade, concurso de TV, tablero de detective, montaña rusa 3D, calculadora 3D, cabeza con cajones, casting). Se registran en `remotion/src/Root.tsx` (`v01` … `v10`).
- **Guiones (los que mandan):** `remotion/shorts/NN-nombre/short.json`, con dirección completa: voz, pantalla, imagen, cámara, transición, efectos y música (`music.preset`). Siguen `docs/REGLAS-SHORTS.md` (reglas de engagement del dueño). Para leerlos: `GUIONES-VIRALES.md`, que se genera con `cd remotion && node scripts/guiones-md.mjs`.
- **Control antes del render:** `node scripts/check-short.mjs` revisa el largo del gancho, las palabras en pantalla, que no se repita la recompensa, la posición del giro, el loop y el cierre con BARBER.
- **Montos en los guiones:** `{$corte*12}` es plata y `{#diasPrueba}` es un número; salen de `videos/config.js` (ver `remotion/scripts/montos.mjs`). `prep.mjs` los copia a `remotion/public/config.json` para las escenas.
- **Herramientas compartidas** (`remotion/src/lib/`): `Short` (arma el video, transiciones, subtítulos y el empalme del loop), `Placa` (texto sincronizado con la voz, palabras clave con golpe), `Subtitulos` (estilo TikTok, se ocultan si repiten la placa), `fx` (cámara, sacudones, rayos, partículas, confeti, contador de plata…), `Celular` (pantallas de la app), `Split` (SIN/CON), `Cierre`, `tres` (3D: silla, tijera, billetes, carteles, vóxeles), `transiciones`, `Sfx`.
- **Audio** (`remotion/audio/`): `voz.py` (Edge TTS con tiempo por palabra; `VOZ_MOTOR=estimado` sin internet, en silencio, solo para armar), `musica.py` (un estilo por video, cambia en el giro y se frena antes con silencio), `sfx.py` (55 efectos sintetizados), `mezcla.py` (voz + música con ducking). Los efectos los pone cada escena con `<Sfx>` en su cuadro exacto. `render.mjs` deja el volumen final en −14 LUFS.
- **Render:** `.github/workflows/videos.yml` renderiza con Remotion (10 en paralelo, ~12 min cada uno) y sube los MP4 a `videos/render/` **en la misma rama desde la que se corrió**.
- `videos/engine/` y `videos/guiones/` son el motor viejo: quedan como referencia.

## Comandos
```bash
cd remotion && npm install
VOZ_MOTOR=estimado node scripts/prep.mjs todos   # voz/tiempos/audio (sin internet: voz estimada en silencio)
npx remotion studio                              # vista previa
node scripts/hoja.mjs 01                         # capturas de cada escena → out/01-…-hoja.jpg (--guias marca zonas seguras)
node scripts/render.mjs 01                       # video completo → ../videos/render/01.mp4 (RENDER_DIR=out/x para pruebas)
# Sin el Chrome de Remotion (por ejemplo en una nube sin internet), usar uno local:
REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell node scripts/hoja.mjs 01
```

## Commits
Si el commit no tiene que disparar el render en GitHub, agregar `[skip ci]` al mensaje.
