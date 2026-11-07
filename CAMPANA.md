# Campaña "SILLA LLENA": 10 guiones + dirección visual

> Versión 3. Reemplaza los guiones anteriores. Primero se aprueba esto; después se anima.

## Por qué no funcionaron los videos anteriores

Revisé cuadro por cuadro los videos que armó Claude Code:

1. **No se entiende de qué se trata.** Recién a la mitad aparece que es una app, y nunca tiene nombre ni una frase que la explique.
2. **Fondos negros y grises.** Hay cuadros enteros en negro y todo se ve apagado: en el feed de TikTok se pasa de largo.
3. **No hay personajes ni emociones.** Son sillas 3D abstractas y textos sueltos. Nadie se ríe, nadie se enoja y no hay historia.
4. **Los textos se pisan** ("CORTE TE", "TULINKY") y compiten con los subtítulos.
5. **Cada video tiene el mismo formato** (frase, número, VS, celular, cierre), y a los tres segundos ya sabés todo lo que viene.

Lo que cambia ahora:
- **Un concepto de campaña**, con nombre y personajes.
- **Un formato distinto por video:** tier list, tutorial irónico, videojuego, ticket de supermercado, objeto que habla, test, POV del cliente, carrera entre dos barberías.
- **Colores planos saturados** en lugar de negro.
- **Una sola idea por pantalla.**

---

## El concepto: SILLA LLENA

**Nombre de trabajo de la app:** *Silla Llena* (vos decidís el definitivo).
**La idea que repiten los 10 videos:** *la silla vacía es plata que se va.*
**La frase que explica la app en 3 segundos:**

> **"Silla Llena: la app que llena tu agenda y no deja que se te escape un peso."**

Todos los videos dicen en los primeros 2 segundos a quién le hablan ("si tenés barbería…"), y en algún momento muestran el logo con esa frase. Así, aunque alguien vea uno solo, entiende qué es.

---

## Dirección visual (biblia de estilo)

### Estética
**Dibujo animado 2D con mucha actitud:** personajes ilustrados con contorno negro grueso, tipo sticker, sobre **fondos de un solo color muy saturado** que cambian en cada escena. La referencia es la mezcla entre las animaciones de Duolingo y una miniatura de MrBeast: simple, gorda, colorida y expresiva. **Nunca fondo negro ni gris**, salvo un instante buscado para un contraste dramático.

| Uso | Color |
|---|---|
| Pérdida, problema | Rojo `#FF2D55` |
| Solución, plata que entra | Verde lima `#2BFF88` |
| Llamado de atención, cajas de texto | Amarillo `#FFD60A` |
| Marca Silla Llena | Violeta `#7B5CFF` |
| Fondos de apoyo | Celeste `#2EC5FF` · Rosa `#FF6BD6` · Naranja `#FF8A00` |

### Personajes (se repiten en toda la campaña)
- **El Barbero:** gorra para atrás, barba, tatuaje en el brazo y tijera en la mano. Tiene caras de feliz, desesperado, enojado y aliviado.
- **El Fantasma:** el que reserva y no viene. Una sábana blanca con zapatillas y ojos burlones, que se va flotando con los billetes. Es el "villano" de la campaña.
- **El Impaciente:** mira el reloj, ve la fila y se va resoplando.
- **La Silla:** la silla de barbero con ojos y boca, mascota de la marca. Está triste cuando está vacía y feliz cuando está llena.
- **El Celular de Silla Llena:** entra siempre "como superhéroe", con brillo y un sonido característico.

Se dibujan como componentes SVG en Remotion, con partes que se mueven (ojos, boca, brazos). Así se animan expresiones sin necesitar archivos externos.

### Texto en pantalla
- **Una idea por pantalla y máximo 5 palabras.** Tamaño gigante (140–220 px) en el centro.
- **Subtítulos de la voz** en otra zona (debajo del centro), más chicos y **nunca encima del texto principal**.
- Fuente gruesa y redonda con contorno negro. Las palabras clave van en caja amarilla.

### Movimiento ("dopamina")
- **Algo nuevo cada 0,7 a 1,5 segundos.** Nada queda quieto.
- **Transiciones con motivo, no al azar:** el fantasma atraviesa la pantalla y se lleva la escena, un billete vuela hacia la cámara y la tapa, la puerta se cierra y pasa a la escena siguiente.
- **Golpes de cámara** (zoom y sacudón) sincronizados con los golpes del beat.
- **La plata es física:** billetes que vuelan, se caen o se queman, y monedas que llueven, además del contador gigante.
- **Celular grande:** ocupa el 70 % del ancho, con un dedo que toca, una acción por plano y un cartel que dice qué es.

### Sonido
- Beat con un "drop" en el momento de la solución.
- Un efecto para **cada** acción: registradora, "uuuh" del fantasma, campanita de la puerta, sello, "game over", trombón triste y "level up".

### Reglas de todos los videos
1. **Gancho en el primer segundo:** la imagen ya en movimiento y una frase que rompe el esquema.
2. **A quién le habla, en los primeros 2 segundos.**
3. **Una promesa que se cumple al final** ("el primero te va a doler", "mirá lo que pasa a las 20:00").
4. **El problema contado con personajes y plata**, no con datos sueltos.
5. **Cada solución mostrada en la app.**
6. **Logo + frase de Silla Llena.**
7. **Cierre:** "Comentá BARBER" + "14 días gratis".
8. **Duración de 30 a 38 s.** Nada importante en el 20 % de abajo ni en la franja derecha.

> Los montos son ejemplos con corte a $10.000 (sale de `videos/config.js`) y se aclaran en chico al pie.

### Opcional (lo que más sube la calidad)
Sumar **2 o 3 tomas reales filmadas con tu celular** en una barbería de Santo Tomé: la silla vacía, la tijera, la puerta. Las animaciones van encima. Mezclar lo real con el dibujo hace que no parezca publicidad y genera mucha más confianza.

---

## Los 10 guiones

### 1. "Tu barbería es un balde pinchado"
**Formato:** metáfora visual. Es el video madre: explica el producto entero.
**Duración:** ~35 s · **Colores:** celeste → rojo → violeta → verde

| Seg. | Qué se ve | Qué dice la voz | Texto grande |
|---|---|---|---|
| 0–2 | Un balde gigante con el cartel "TU BARBERÍA". Le llueven billetes por arriba, pero chorrean plata por **3 agujeros**. | "Si tenés barbería, tenés un balde pinchado." | **TU BARBERÍA ESTÁ PINCHADA** |
| 2–4 | Zoom a los agujeros, que se encienden en rojo uno por uno: 1, 2, 3. | "Y pierde plata por tres agujeros." | **3 AGUJEROS** |
| 4–9 | **Agujero 1:** el Fantasma sale por el agujero con billetes en los brazos y saluda burlón. Contador rojo. | "Uno: el que reserva y no viene. Ciento veinte mil pesos por mes." | **EL FANTASMA −$120.000** |
| 9–14 | **Agujero 2:** el Impaciente mira la fila de 4, resopla y se tira por el agujero. | "Dos: el que ve la fila y se va. Doscientos cuarenta mil." | **LA FILA −$240.000** |
| 14–18 | **Agujero 3:** un cliente se vuelve transparente mientras vuelan hojas de calendario. | "Tres: el que dejó de venir y nadie lo llamó." | **EL OLVIDO −$60.000** |
| 18–21 | El nivel de plata del balde baja de golpe, sacudón y la Silla llora al lado. | "Cuatrocientos veinte mil pesos por mes." | **−$420.000 / MES** |
| 21–28 | **El giro:** suena el drop, entra el Celular volando como superhéroe y tira 3 parches que tapan los agujeros con un "¡PLAF!": **Seña** · **QR de fila** · **Lista de clientes**. | "Ahora mirá. Seña para el fantasma. Fila con QR. Y la lista de los que no volvieron." | (rótulo de cada parche) |
| 28–31 | El balde se llena hasta desbordar, los billetes explotan como confeti y aparece el logo. | "Silla Llena. La app que tapa los tres agujeros." | **SILLA LLENA** |
| 31–35 | Cierre. | "Comentá bárber y probala catorce días gratis." | **COMENTÁ BARBER** |

**Momento épico:** los tres parches tapando los agujeros con el drop del beat.

---

### 2. "Misma cuadra, dos barberías"
**Formato:** carrera en pantalla partida. **Duración:** ~36 s

| Seg. | Qué se ve | Voz | Texto |
|---|---|---|---|
| 0–2 | Pantalla partida: dos barberías idénticas en la misma vereda, **A** (roja) y **B** (verde). | "Misma cuadra. Mismo precio." | **MISMA CUADRA. MISMO PRECIO.** |
| 2–4 | Dos contadores de plata en $0. Arriba, un reloj marca SÁBADO 9:00. | "Una gana el doble. Mirá por qué." | **UNA GANA EL DOBLE** |
| 4–9 | **9:00:** en A, el Fantasma no aparece y el contador no se mueve. En B, el cliente llega porque dejó seña: **+$10.000**. | "Nueve de la mañana. A, le clavaron. B: el cliente pagó seña y vino." | — |
| 9–14 | **11:00:** en A hay 4 en la fila y dos se van. En B, la gente escanea el QR, se va a tomar algo y vuelve. | "Once. A pierde dos en la fila. B, nadie se va." | — |
| 14–19 | **15:00:** el barbero de A contesta WhatsApp con la tijera en la mano. En B, las reservas entran solas con notificaciones verdes. | "A las tres, A contesta mensajes. B, corta." | — |
| 19–24 | **18:00:** en A, un cliente pide "como la otra vez" y el barbero transpira. En B, abre la ficha: "lo de siempre". | "Seis de la tarde. A no se acuerda del corte. B tiene la ficha." | — |
| 24–28 | **20:00:** cierre. Contador A **$90.000**; contador B **$170.000**. Trofeo para B, nube de lluvia sobre A. | "Cierre: noventa mil contra ciento setenta mil." | **$90.000 vs $170.000** |
| 28–32 | El techo de B se abre y aparece el Celular con el logo. | "La diferencia es esta: Silla Llena." | **LA DIFERENCIA: SILLA LLENA** |
| 32–36 | Cierre. | "¿Vos sos A o B? Comentá bárber." | **¿SOS A O B?** |

**Momento épico:** los dos contadores corriendo a la par y separándose.

---

### 3. "El ticket que nadie te imprime"
**Formato:** ticket de supermercado gigante. **Duración:** ~30 s

| Seg. | Qué se ve | Voz | Texto |
|---|---|---|---|
| 0–2 | Ruido de impresora: desde arriba baja un ticket que dice **"LO QUE PERDISTE ESTE MES"**. | "Barbero: este es el ticket que nadie te imprime." | (el ticket) |
| 2–12 | Se imprime renglón por renglón, con un "ka-chunk" en cada uno: **12 turnos fantasma ..... $120.000** · **24 se fueron de la fila ..... $240.000** · **3 clientes que no volvieron ..... $60.000** · **60 h contestando WhatsApp ..... incalculable**. La cámara baja siguiendo el ticket. | La voz lee cada renglón con ritmo. | — |
| 12–15 | **TOTAL: $420.000**. El ticket es tan largo que se cae al piso y se sigue enrollando (gag). | "Total: cuatrocientos veinte mil pesos. Por mes." | **TOTAL $420.000** |
| 15–19 | Se imprime un ticket chiquito: **"SILLA LLENA — 1 mes ..... $10.000"**. | "Y este es el otro ticket." | — |
| 19–23 | **La comparación:** los dos tickets lado a lado, el gigante ocupando toda la pantalla y el chiquito de un centímetro. Zoom out épico. | "Diez mil pesos. Lo que sale un corte." | **1 CORTE** |
| 23–26 | Un sello rojo golpea el ticket gigante: **"CANCELADO"**. | "Con un solo turno que no se pierda, ya está pagada." | **SE PAGA CON 1 CORTE** |
| 26–30 | Cierre. | "Comentá bárber y te la paso." | **COMENTÁ BARBER** |

**Momento épico:** el ticket gigante al lado del ticket chiquito.

---

### 4. "Si tu silla hablara"
**Formato:** objeto que habla (rompe el esquema enseguida). **Duración:** ~32 s

| Seg. | Qué se ve | Voz (de la Silla, un poco más grave) | Texto |
|---|---|---|---|
| 0–2 | Una silla de barbero quieta… y de golpe **abre los ojos y mira a cámara**. | "Ey. Sí, vos. Soy tu silla." | **SOY TU SILLA.** |
| 2–4 | Se cruza de brazos (tiene apoyabrazos). | "Y estoy harta." | **Y ESTOY HARTA.** |
| 4–9 | Pasan siluetas de fantasmas al lado sin sentarse. | "El sábado me dejaron plantada tres veces." | **PLANTADA x3** |
| 9–13 | Le crecen telarañas y suena un grillo. | "El martes no se sentó nadie en todo el día." | **MARTES: 0** |
| 13–16 | Un cliente la mira, ve la fila y se va. | "Y el pibe de la fila se fue sin probarme." | — |
| 16–21 | La Silla saca una calculadora. | "¿Sabés cuánto vale cada hora que estoy vacía? Veinte mil pesos. Hoy estuve vacía cinco horas." | **−$100.000 HOY** |
| 21–27 | Saca un celular con el logo. Íconos que aparecen: seña, QR, puntos dobles. | "Instalá esto. Seña para los fantasmas, fila con QR y puntos dobles los martes." | **SILLA LLENA** |
| 27–29 | Alguien se sienta, la Silla suspira feliz y aparecen corazones. | "Ahhh. Así sí." | — |
| 29–32 | Cierre. | "Quiero estar llena. Comentá bárber." | **COMENTÁ BARBER** |

**Momento épico:** la silla abriendo los ojos en el primer segundo.

---

### 5. "Tier list: los clientes que te funden"
**Formato:** tier list, muy compartible ("etiquetá a un barbero"). **Duración:** ~38 s

| Seg. | Qué se ve | Voz | Texto |
|---|---|---|---|
| 0–2 | La grilla clásica S, A, B, C, D, con colores. | "Tier list de clientes que te funden la barbería." | **CLIENTES QUE TE FUNDEN** |
| 2–3 | — | "El primero te va a doler." | — |
| 3–8 | **D:** cae una tarjeta con el personaje que pregunta "¿cuánto sale?" diez veces. Debajo, en verde: **"Precios en tu link"**. | "D: el que pregunta cuánto sale diez veces." | — |
| 8–13 | **C:** "¿me hacés lugar?" a las 23:50. → **"Reserva solo, a cualquier hora"**. | "C: el que te escribe a las doce de la noche." | — |
| 13–18 | **B:** "Hacémelo como la otra vez". → **"Ficha de cada cliente"**. | "B: el 'como la otra vez'." | — |
| 18–23 | **A:** el Impaciente que ve la fila y se va. → **"Fila con QR"**. | "A: el que ve la fila y se va." | — |
| 23–28 | **S, el peor:** cae el Fantasma con explosión y sacudón. → **"Seña obligatoria"**. | "Y en la S… el fantasma. Reserva y no viene." | **EL FANTASMA** |
| 28–32 | Cadena de sellos **"RESUELTO"** sobre las 5 tarjetas, uno por golpe de beat. | "Una app. Cinco problemas resueltos. Silla Llena." | **1 APP = 5 RESUELTOS** |
| 32–38 | Cierre. | "¿Cuál te toca más? Comentá, y poné bárber para probarla." | **¿CUÁL TE TOCA?** |

**Momento épico:** el Fantasma cayendo en la S y la cadena de sellos.

---

### 6. "Tutorial: cómo perder 5 millones por año"
**Formato:** tutorial irónico (con un rebobinado VHS en el medio). **Duración:** ~34 s

| Seg. | Qué se ve | Voz | Texto |
|---|---|---|---|
| 0–2 | Pantalla de tutorial falso con miniatura, título y barra de reproducción: **"CÓMO PERDER $5.000.000 POR AÑO (FÁCIL)"**. | "Tutorial para barberos: cómo perder cinco millones por año. Facilísimo." | **TUTORIAL** |
| 2–6 | **PASO 1** (sticker): turno por WhatsApp sin seña. Aparece el Fantasma. Tilde verde irónico. | "Paso uno: dá turnos por WhatsApp y no pidas seña." | **PASO 1** |
| 6–10 | **PASO 2:** cuaderno con mancha de café y dos Martín a la misma hora. | "Paso dos: anotalos en un cuaderno." | **PASO 2** |
| 10–14 | **PASO 3:** el teléfono del cliente que no volvió, sin mensajes. | "Paso tres: nunca le escribas al que dejó de venir." | **PASO 3** |
| 14–17 | **PASO 4:** cajón con billetes desordenados. | "Paso cuatro: no anotes cuánto entra." | **PASO 4** |
| 17–20 | Una barra de "pérdida" llega al 100 %. Confeti gris y trombón triste. | "¡Felicitaciones! Perdiste más de cinco millones." | **¡FELICITACIONES! −$5.040.000** |
| 20–22 | **Rayón de disco:** la imagen se rebobina con efecto VHS. | "O… hacé exactamente lo contrario." | **⏪ REBOBINANDO** |
| 22–30 | Los 4 pasos al revés, 2 segundos cada uno, en verde, con la pantalla de la app: seña · agenda · lista de clientes · caja. | "Seña. Agenda que no se pisa. Lista de los que no volvieron. Caja al día." | **SILLA LLENA** |
| 30–34 | Cierre. | "Comentá bárber y te la paso." | **COMENTÁ BARBER** |

**Momento épico:** el rebobinado VHS que da vuelta el tutorial.

---

### 7. "Barbero vs. el Sábado" (videojuego)
**Formato:** videojuego retro pixelado. **Duración:** ~36 s

| Seg. | Qué se ve | Voz | Texto |
|---|---|---|---|
| 0–2 | Pantalla arcade: **"PLAYER 1: VOS — BOSS: EL SÁBADO — FIGHT!"**, con sonido de fichín. | "Barbero, nivel uno: el sábado." | **FIGHT!** |
| 2–5 | El Barbero pixelado, con la barra de vida **$** llena. | "Tu barra de vida es tu plata." | — |
| 5–9 | Ataque del **Fantasma**: "−$10.000" y la barra baja. | "Primer enemigo: el fantasma." | **−$10.000** |
| 9–13 | Ataque de **La Fila Eterna**: tres se van, "−$30.000". | "Segundo: la fila eterna." | **−$30.000** |
| 13–17 | Bombardeo de **WhatsApp x47**: globitos que caen como misiles. | "Tercero: cuarenta y siete mensajes." | — |
| 17–19 | La barra casi vacía y **"GAME OVER?"** titilando. | "Te quedás sin vida…" | **GAME OVER?** |
| 19–22 | Cae una caja brillante: **"POWER-UP: SILLA LLENA"**. El Barbero la agarra y se transforma (aura dorada). | "…hasta que agarrás el power-up." | **POWER-UP** |
| 22–29 | Combo: el escudo de seña bloquea al Fantasma (**BLOCKED**), un portal QR se traga la fila y un muro de reservas automáticas frena los mensajes. La barra se recarga y llueven monedas. | "Seña: bloqueado. Fila con QR: bloqueado. Reservas solas: bloqueado." | **BLOCKED x3** |
| 29–32 | **"LEVEL COMPLETE"** y el puntaje sube. | "Nivel superado." | **LEVEL COMPLETE** |
| 32–36 | Cierre. | "Comentá bárber y desbloqueá el power-up catorce días gratis." | **COMENTÁ BARBER** |

**Momento épico:** la transformación con el power-up y los tres "BLOCKED" seguidos.

---

### 8. "Test: ¿tu barbería pierde plata?"
**Formato:** test interactivo de 5 preguntas (genera muchos comentarios). **Duración:** ~32 s

| Seg. | Qué se ve | Voz | Texto |
|---|---|---|---|
| 0–2 | Pantalla de test con un **termómetro de plata perdida** vacío al costado. | "Si tenés barbería, respondé en tu cabeza." | **TEST: 5 PREGUNTAS** |
| 2–4 | — | "Si decís tres veces sí, estás perdiendo plata." | **3 SÍ = PROBLEMA** |
| 4–8 | **1.** "¿Te clavaron un turno esta semana?" Botones SÍ y NO gigantes, cuenta regresiva de 2 s, y el termómetro sube. | Lee la pregunta. | — |
| 8–12 | **2.** "¿Contestaste WhatsApp con la tijera en la mano?" | — | — |
| 12–16 | **3.** "¿Alguien vio la fila y se fue?" | — | — |
| 16–20 | **4.** "¿Hay un cliente fijo que hace un mes no viene?" | — | — |
| 20–24 | **5.** "¿Sabés EXACTO cuánto ganaste el mes pasado?" (si dice **no**, también suma). | — | — |
| 24–27 | El termómetro explota: **"3 O MÁS: ESTÁS PERDIENDO PLATA TODOS LOS MESES"**. | "Si sacaste tres o más, estás perdiendo plata todos los meses." | **🔴 RESULTADO** |
| 27–30 | Cada pregunta se vuelve verde, una por una, con la función que la resuelve. Logo. | "Silla Llena resuelve las cinco." | **SILLA LLENA** |
| 30–32 | Cierre. | "Comentá cuántos sí sacaste, y bárber para probarla." | **¿CUÁNTOS SÍ?** |

**Momento épico:** el termómetro que explota.

---

### 9. "Son las 23:47 y quiero cortarme"
**Formato:** POV del cliente, con dos líneas de tiempo. **Duración:** ~32 s

| Seg. | Qué se ve | Voz | Texto |
|---|---|---|---|
| 0–2 | Pieza a oscuras, la luz del celu en la cara y un reloj **23:47**. | "Son las doce menos trece. Tu cliente quiere cortarse mañana." | **POV: TU CLIENTE, 23:47** |
| 2–4 | La pantalla se parte: arriba **"SIN APP"** (rojo), abajo **"CON SILLA LLENA"** (verde). | "Mirá lo que pasa en cada barbería." | — |
| 4–12 | **Arriba:** escribe "¿tenés turno mañana?" y queda en visto, el reloj corre (23:55, 00:40) y el cliente se duerme. A la mañana le escribe a otra barbería, que le contesta con un link. → **"PERDISTE UN CLIENTE MIENTRAS DORMÍAS"**. | "En una, escribe, nadie contesta, y a la mañana se va a otro lado." | **PERDISTE UN CLIENTE** |
| 12–20 | **Abajo:** abre el link, toca día, hora y seña, con un cronómetro que marca **00:09**. "¡Listo! Mañana 10:30". | "En la otra, reserva en nueve segundos. Con seña y todo." | **9 SEGUNDOS** |
| 20–24 | El barbero de abajo duerme tranquilo y le llega una notificación: **"Nuevo turno: Juan 10:30 · seña $2.000 ✓"**, con sonido de moneda. | "Y vos ni te enteraste: estabas durmiendo." | — |
| 24–28 | Las dos mitades se juntan y aparece el logo. | "Tu barbería atiende aunque duermas. Silla Llena." | **ATIENDE AUNQUE DUERMAS** |
| 28–32 | Cierre. | "Comentá bárber." | **COMENTÁ BARBER** |

**Momento épico:** el cronómetro de 9 segundos al lado del "visto" que nunca se contesta.

---

### 10. "Le voy a dar esto gratis a 5 barberías"
**Formato:** el fundador hablando de frente. Es el mejor lugar para una toma real tuya, aunque sean solo tus manos con el celular. **Duración:** ~35 s

| Seg. | Qué se ve | Voz | Texto |
|---|---|---|---|
| 0–2 | Cinco sillas vacías en fila, con un spot de luz encima. | "Le voy a dar esto gratis a cinco barberías." | **GRATIS A 5 BARBERÍAS** |
| 2–5 | — | "No soy una empresa. Soy un pibe de Corrientes que hace apps." | **NO SOY UNA EMPRESA** |
| 5–8 | — | "Y armé una para barberías." | **SILLA LLENA** |
| 8–18 | Recorrido rápido por la app, 2 s por función y con cartel grande: **Turnos con seña · Fila con QR · Caja del día · Ficha del cliente · Clientes que no volvieron**. | Nombra cada una. | (cartel de cada función) |
| 18–26 | La oferta se arma como una tarjeta: **14 días gratis** → **después $8.000/mes, congelado 6 meses** → **si no te sirve, no pagás nada**. | Lee la oferta. | (la oferta) |
| 26–30 | Las 5 sillas se van iluminando una por una. | "Son solo cinco lugares." | **5 LUGARES** |
| 30–35 | Cierre. | "Comentá bárber y te escribo yo, personalmente." | **TE ESCRIBO YO** |

**Momento épico:** las 5 sillas que se encienden.

---

## Orden de publicación sugerido
**Semana 1:** 1 (balde) · 5 (tier list) · 9 (23:47) · 3 (ticket) · 10 (fundador)
**Semana 2:** 2 (A vs B) · 7 (videojuego) · 4 (silla que habla) · 6 (tutorial) · 8 (test)

El video 1 va primero porque explica todo el producto. El 10 cierra la primera semana, cuando ya hay gente que vio los otros.

## Lo que hay que decidir antes de animar
1. **El nombre:** ¿*Silla Llena* u otro?
2. **Estética:** ¿solo dibujo animado, o dibujo + 2 o 3 tomas reales filmadas con tu celular?
3. **Con cuál arrancamos:** conviene hacer **un solo video completo** (sugiero el 1) hasta que te guste, y recién ahí los otros nueve con el mismo nivel.
