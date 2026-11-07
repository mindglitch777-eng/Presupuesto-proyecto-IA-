# Sistema visual (reemplaza la dirección visual de CAMPANA.md)

Los guiones los escribe otra IA en el formato de abajo. Este archivo define **cómo se ve todo**.

## Estética: barbería premium, oscura y real
- **Imágenes reales a pantalla completa, siempre.** Nada de dibujitos ni de fondos vacíos. Los clips salen de Pexels (uso comercial gratis, sin atribución obligatoria) y se descargan en GitHub Actions con la API (secreto `PEXELS_API_KEY`). Si el usuario filma tomas propias, esas tienen prioridad.
- **Tratamiento de los clips:**
  - corrección de color oscura y contrastada, con negros profundos y piel cálida;
  - viñeta y grano fino;
  - push-in lento constante;
  - cambios de velocidad (rápido → lento) en los golpes.
- **Paleta:**

| Color | Código |
|---|---|
| Negro mate | `#0B0B0B` |
| Dorado | `#D4A73A` |
| Rojo alarma | `#FF2B2B` |
| Blanco | `#FFFFFF` |
| Verde (solo cuando entra plata) | `#2BFF88` |

- **Tipografía:** condensada y pesada (Anton o Bebas Neue, de Google Fonts). **Ocupa el 80–90 % del ancho**, siempre en mayúsculas y en 1 a 4 palabras por pantalla. Para remarcar algo, la palabra va en una caja roja o dorada.
- **La app:** se ve como un producto real y caro. Interfaz oscura con detalles dorados, **a pantalla completa** o en un celular realista que ocupe el 75 % del alto. Siempre aparece un dedo que toca.

## Recompensas visuales (lo que mantiene enganchado)
**Cada 1 a 2 segundos pasa algo**, alternando entre:

| Efecto | Qué es |
|---|---|
| Zoom golpe | Zoom de golpe con sacudón, sincronizado con el bajo |
| Rampa de velocidad | Cambio de velocidad en el clip |
| Corte con flash | Flash blanco o rojo de 2 cuadros |
| Congelado + círculo rojo | Cuadro congelado con círculo rojo y flecha sobre el detalle ("ESTO TE CUESTA PLATA") |
| Número que cae | Contador de plata gigante que cae y tiembla, y se pone rojo cuando pierde |
| Alarma | Viñeta roja que late, para los momentos de pérdida |
| Pantalla partida real | SIN (rojo, desaturado) / CON (dorado, color pleno), con línea divisoria y contadores corriendo |
| Rayos X | La cámara "atraviesa" el clip y aparece la pantalla de la app |
| Glitch | Separación RGB en los cambios de tema |
| Palabra por palabra | Texto que entra palabra por palabra al ritmo de la voz |

**Reglas:** nunca dos efectos iguales seguidos. El primer cuadro ya tiene movimiento, texto gigante y sonido. El giro llega con el drop de la música, y desde ahí todo pasa de rojo a dorado.

## Sonido
- Máquina de cortar como ASMR en el gancho.
- Bajo (808) en cada golpe.
- Subida antes del giro.
- Registradora y monedas cuando entra plata.
- Beat trap oscuro de fondo, generado por código.
- Voz Edge `es-CO-GonzaloNeural` a `+22%`.

## Subtítulos
Palabra por palabra, debajo del centro, blancos con la palabra activa en dorado. Nunca encima del texto grande ni en el 20 % de abajo.

## Formato del guion que tiene que entregar la otra IA
Una tabla por video con estas columnas, para que se pueda armar directo:

| seg | clip (qué buscar en Pexels, en inglés) | texto gigante (1-4 palabras) | voz | efecto (de la tabla de arriba) |
|---|---|---|---|---|
| 0.0–1.2 | `empty barber chair dark` | TU BARBERÍA SE ESTÁ MURIENDO | "Tu barbería se está muriendo." | zoom golpe + alarma |
