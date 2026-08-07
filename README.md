# Finde de Primos

Cuenta atrás estática para el Finde de Primos.

## Arquitectura v3

La web separa completamente **configuración**, **lógica**, **diseño** y **contenido HTML**:

- `config.js` — ÚNICO archivo que debería ser necesario editar cada año.
- `app.js` — lógica del contador, estados, fechas derivadas y barra de progreso.
- `index.html` — estructura de la página, sin fechas de una edición concreta.
- `styles.css` — diseño visual.
- `assets/` — imágenes e iconos.

## Configuración actual

Toda la información dependiente de fechas está aquí:

```js
const FINDE_CONFIG = {
  edition: 2026,

  previousEnd: "2025-11-16T17:00:00+01:00",
  start:       "2026-11-13T10:00:00+01:00",
  end:         "2026-11-15T17:00:00+01:00"
};
```

### Qué significa cada campo

- `edition`: edición que se mostrará en la web.
- `previousEnd`: final del Finde de Primos anterior. Se usa como 0% de la barra de progreso.
- `start`: momento exacto en el que empieza la próxima edición.
- `end`: momento exacto en el que termina.

## Actualizar la web para 2027

Cuando tengáis las fechas de 2027:

1. Abre `config.js`.
2. Cambia `edition`.
3. Pon en `previousEnd` el final de la edición 2026.
4. Cambia `start`.
5. Cambia `end`.
6. Haz commit.

No hace falta modificar `index.html`, `app.js` ni `styles.css`.

Ejemplo:

```js
const FINDE_CONFIG = {
  edition: 2027,

  previousEnd: "2026-11-15T17:00:00+01:00",
  start:       "2027-11-12T10:00:00+01:00",
  end:         "2027-11-14T17:00:00+01:00"
};
```

## Datos que se generan automáticamente

A partir de `config.js`, `app.js` calcula y muestra:

- año/edición;
- rango de fechas;
- día de la semana;
- horas de inicio y final;
- título de la pestaña;
- cuenta atrás;
- textos antes/durante/después del evento;
- origen y destino de la barra;
- porcentaje transcurrido entre una edición y la siguiente.

También comprueba que se cumpla:

`previousEnd < start < end`

Si las fechas son inválidas, la web muestra un error de configuración y también lo registra en la consola del navegador.
