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
- **Guiones nuevos (los que mandan):** `remotion/shorts/NN-nombre/short.json`, uno por video, con dirección completa: voz, pantalla, imagen, cámara, transición, efectos y música. Siguen `docs/REGLAS-SHORTS.md` (reglas de engagement del dueño). Para leerlos: `GUIONES-VIRALES.md`, que se genera con `cd remotion && node scripts/guiones-md.mjs`.
- **Control antes del render:** `cd remotion && node scripts/check-short.mjs` revisa el largo del gancho, las palabras en pantalla, que no se repita la recompensa, la posición del giro, el loop y el cierre con BARBER.
- **Montos en los guiones:** `{$corte*12}` es plata y `{#diasPrueba}` es un número; salen de `videos/config.js` (ver `remotion/scripts/montos.mjs`).
- **Cada video es a medida:** se reutilizan herramientas (voz, subtítulos, cámara, efectos, 3D), nunca escenas fijas.
- `GUIONES.md` tiene la primera versión de los 10 guiones.
- `videos/guiones/01.js` a `05.js` son la versión nueva, más fuerte, escrita para el motor viejo con plantillas (`videos/engine/plantillas.js`). Sirven como texto base para Remotion. Del 06 al 10 hay que reescribirlos con el mismo estilo.
- `videos/engine/` es el motor viejo (canvas + Playwright). Queda como referencia; los videos nuevos se hacen en Remotion.
- `remotion/` es la base del proyecto Remotion: dependencias, `remotion.config.ts` y una composición de prueba. Ya renderiza.
- `.github/workflows/videos.yml` renderiza con el motor viejo. Hay que cambiarlo para que use Remotion.
- `videos/engine/voz.py` ya genera la voz con Edge y el tiempo de cada palabra. Se puede reutilizar.

## Comandos
```bash
cd remotion && npm install
npx remotion studio                 # vista previa
npx remotion still Test out/a.png   # captura de un cuadro
# Sin el Chrome de Remotion (por ejemplo en una nube sin internet), usar uno local:
REMOTION_BROWSER=/ruta/a/chrome npx remotion still Test out/a.png
```

## Commits
Si el commit no tiene que disparar el render en GitHub, agregar `[skip ci]` al mensaje.
