# Videos para barberías — instrucciones para Claude Code

## LO MÁS IMPORTANTE
**`CAMPANA.md` es la fuente de verdad:** los 10 guiones, la REGLA N.º 1 del gancho y la dirección visual. Todo lo que contradiga ese archivo queda viejo. Los guiones de `GUIONES.md` y `videos/guiones/` NO se usan más.

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
- **`CAMPANA.md`:** versión aprobada. Nombre de la app: **Silla Llena**. Estética: dibujo animado 2D tipo sticker, con personajes en SVG y fondos de un color saturado; nada de fondos negros ni grises.
- **La versión anterior en Remotion,** en la rama `ccr-2a2eeb48-jv57ra`, fue rechazada: no se entendía de qué se trataba, era oscura, no tenía personajes y los textos se pisaban. Se puede reutilizar código técnico de ahí (voz, audio, workflow), pero no el estilo.
- **`remotion/`:** la base del proyecto en `main`.
- **`videos/engine/`:** `voz.py` (Edge TTS + tiempos por palabra), `musica.py` y `sfx.py` se pueden reutilizar.
- **`.github/workflows/videos.yml`:** hay que hacer que renderice con Remotion.

## Forma de trabajo
1. **Primero un solo video completo** (el 1, "Tu barbería se está muriendo"). Antes de seguir, el usuario lo tiene que aprobar.
2. **Antes de entregar,** sacar capturas de cada escena y revisarlas contra la REGLA N.º 1 y la dirección visual de `CAMPANA.md`.

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

## Herramientas técnicas que ya existen (rama `ccr-2a2eeb48-jv57ra`)
- `remotion/audio/`: voz Edge con tiempo por palabra (`voz.py`, con `VOZ_MOTOR=estimado` para armar sin internet), música por estilo con silencio y "drop" en el giro (`musica.py`), efectos sintetizados (`sfx.py`) y mezcla con ducking (`mezcla.py`).
- `remotion/scripts/`: `prep.mjs` (voz, línea de tiempo y audio), `render.mjs` (video completo a −14 LUFS), `hoja.mjs` (capturas para revisar) y `check-short.mjs`.
- Los guiones de la campaña van en `remotion/shorts/NN-nombre/short.json`. Los de la versión rechazada están en `remotion/shorts-viejos/`.
- El workflow `videos.yml` renderiza con Remotion y sube los MP4 a la misma rama desde la que se corrió.
