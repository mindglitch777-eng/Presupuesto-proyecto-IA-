# Prompt para pegar en Claude Code

Copiá lo que está debajo de la línea y pegalo en tu sesión de Claude Code sobre este repositorio.

---

Leé `CLAUDE.md`. Quiero rehacer los 10 videos para barberías con **Remotion** (ya instalado en `remotion/`), con una calidad mucho más alta que la versión actual. Ahora los videos "no dan a entender nada"; tienen que ser específicos, entrar con fuerza y verse épicos.

1. **Guiones:** usá `videos/guiones/01.js` a `05.js` como base y reescribí del 06 al 10 con el mismo estilo. Estructura de cada video:
   - gancho brutal en el primer segundo;
   - el problema con números concretos;
   - comparación "SIN la app / CON la app" en pantalla partida;
   - la app resolviéndolo en un celular animado;
   - el resultado en plata;
   - cierre con "Comentá BARBER".

   Frases cortas y fuertes, en español rioplatense.
2. **Componentes de Remotion reutilizables:**
   - fondo con degradés de colores vivos en movimiento (usá `@remotion/noise`);
   - texto que cae de golpe con contorno, y texto palabra por palabra con palabras resaltadas;
   - contador de plata con rayos y explosión de partículas;
   - comparación VS;
   - celular con las pantallas de la app (agenda, seña, reserva, fila virtual, caja, ficha, puntos, clientes que no volvieron);
   - lista con emojis, confeti y cierre con llamado a la acción.
3. **Transiciones** entre escenas con `TransitionSeries` de `@remotion/transitions`, distintas en cada corte. Sumá sacudones de cámara en los golpes y desenfoque de movimiento (`@remotion/motion-blur`) donde sume.
4. **Voz:** script de preparación que genere la voz de cada escena con Edge TTS (`es-CO-GonzaloNeural`, `+22%`, podés reutilizar `videos/engine/voz.py`). Guardá audio y tiempos de palabra en `remotion/public/`, y que la duración de cada escena se ajuste a la voz (usá `calculateMetadata`).
5. **Subtítulos** estilo TikTok sincronizados con `@remotion/captions`.
6. **Música y efectos** generados por código (reutilizá `videos/engine/musica.py` y `sfx.py`), con la música más baja cuando habla la voz.
7. **Workflow:** cambiá `.github/workflows/videos.yml` para que renderice con Remotion en GitHub Actions, los 10 en paralelo, y suba los MP4 a `videos/render/`.
8. **Revisión:** antes de dar algo por terminado, sacá capturas de los momentos con más cosas en pantalla de cada video y revisalas. Que se lea todo y que nada quede tapado por la interfaz de TikTok.

Cuando estén listos, pasame los links de descarga directa de los 10.
