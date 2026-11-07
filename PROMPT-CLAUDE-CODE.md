# Prompt para pegar en Claude Code

---

Leé `CLAUDE.md` y `VISUAL.md`. La estética de dibujo animado queda descartada.

1. **Clips:** armá en Remotion el sistema visual de `VISUAL.md`. Un script de GitHub Actions baja los clips de Pexels con la API (secreto `PEXELS_API_KEY`) según los términos de búsqueda del guion, y los procesa con el color oscuro, la viñeta, el grano y el push-in.
2. **Componentes:** uno por cada efecto de la tabla "Recompensas visuales" (zoom golpe, rampa de velocidad, corte con flash, congelado con círculo rojo, número que cae, alarma, pantalla partida real, rayos X a la app, glitch, palabra por palabra). Sumá la interfaz de la app Silla Llena (oscura, dorada, a pantalla completa) y los subtítulos.
3. **Formato de guion:** el video se tiene que poder armar desde una tabla de guion con el formato de `VISUAL.md` (seg, clip, texto, voz, efecto), así cada guion nuevo se pega y se renderiza.
4. **Prueba:** hacé solo el gancho de 8 segundos de "Tu barbería se está muriendo", con 4 o 5 recompensas visuales distintas, texto gigante a pantalla completa y el sonido de la máquina de cortar. Renderizalo en Actions y pasame el link.

Antes de entregar, revisá capturas: que la pantalla esté siempre llena, que nada parezca infantil y que pase algo cada 1 o 2 segundos.
