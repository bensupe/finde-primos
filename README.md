# Finde de Primos

Cuenta atrás estática para el Finde de Primos.

## Cambios v5

- Nuevo contador:
  - primera línea con los **días** en grande;
  - segunda línea con **horas totales : minutos : segundos**.
- Estilo más diferenciado entre ambas lecturas:
  - días = más visuales y protagonistas;
  - horas = más técnicas / terminal.
- Menos jerga informática en toda la interfaz.
- Se mantiene `config.js` como único archivo anual.
- Se mantiene el versionado `?v=5` para evitar problemas de caché.

## Estructura

- `config.js` — ÚNICO archivo que debería ser necesario editar cada año.
- `app.js` — lógica del contador, estados, fechas derivadas y barra de progreso.
- `index.html` — estructura de la página, sin fechas de una edición concreta.
- `styles.css` — diseño visual.
- `assets/` — imágenes e iconos.

## Configuración anual

Solo hay que editar `config.js`:

```js
const FINDE_CONFIG = {
  edition: 2026,

  previousEnd: "2025-11-16T17:00:00+01:00",
  start:       "2026-11-13T10:00:00+01:00",
  end:         "2026-11-15T17:00:00+01:00"
};
```

## Actualización anual

Cuando tengáis las fechas del siguiente año:

1. Edita `config.js`.
2. Cambia `edition`, `previousEnd`, `start` y `end`.
3. Haz commit.

No hace falta tocar `index.html`, `app.js` ni `styles.css`.
