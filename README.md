# Finde de Primos

Web estática para la cuenta atrás y la información del **Finde de Primos**.

La página está pensada como un pequeño punto de encuentro para el evento: muestra el tiempo restante hasta la próxima edición, el progreso desde el finde anterior, las fechas y horarios, información del modo búnker, actividades habituales y el menú del fin de semana.

## Estructura

- `index.html` — estructura y contenido de la página.
- `styles.css` — diseño, responsive y estilos visuales.
- `app.js` — lógica del contador, estados y comportamiento interactivo.
- `config.js` — configuración de la edición y fechas.
- `assets/` — imágenes e iconos utilizados por la web.

## Actualizar la próxima edición

Las fechas se gestionan desde `config.js`.

```js
const FINDE_CONFIG = {
  edition: 2026,

  previousEnd: "2025-11-16T17:00:00+01:00",
  start:       "2026-11-13T10:00:00+01:00",
  end:         "2026-11-15T17:00:00+01:00"
};
```

Campos:

- `edition` — año o número de la edición mostrada.
- `previousEnd` — final de la edición anterior; se utiliza como punto inicial de la barra de progreso.
- `start` — inicio de la próxima edición.
- `end` — final de la próxima edición.

Al actualizar estos valores, el resto de fechas, textos derivados, cuenta atrás y porcentaje se recalculan automáticamente.

## Publicación

La web está preparada para publicarse como sitio estático mediante **GitHub Pages**.

No necesita servidor propio ni base de datos para su funcionamiento actual.
