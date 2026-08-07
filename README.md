# Finde de Primos

Cuenta atrás estática para el Finde de Primos.

## Arquitectura

- `config.js` — ÚNICO archivo que debería ser necesario editar cada año.
- `app.js` — lógica del contador, estados, fechas derivadas y barra de progreso.
- `index.html` — estructura de la página, sin fechas de una edición concreta.
- `styles.css` — diseño visual.
- `assets/` — imágenes e iconos.

## Cambios v4

- Foto real del salón como fondo general.
- Paneles algo más transparentes.
- Cuenta atrás de mayor tamaño.
- Los días se muestran sin ceros a la izquierda (`97`, no `097`).
- Nuevo cerdo integrado a la derecha de la cuenta atrás.
- Eliminado el antiguo `pig.svg`.
- Los recursos se cargan con `?v=4` para evitar que el navegador use archivos viejos en caché.

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

### Campos

- `edition`: edición mostrada.
- `previousEnd`: final de la edición anterior; marca el 0% de la barra.
- `start`: inicio de la próxima edición.
- `end`: final de la próxima edición.

La web genera automáticamente el rango de fechas, los días de la semana, las horas,
el título de la pestaña, la cuenta atrás, el porcentaje y los estados.

## Actualización anual

Cuando tengáis las fechas del siguiente año:

1. Edita `config.js`.
2. Cambia `edition`, `previousEnd`, `start` y `end`.
3. Haz commit.

No hace falta tocar `index.html`, `app.js` ni `styles.css`.
