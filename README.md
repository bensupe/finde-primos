# Finde de Primos

Cuenta atrás estática para el Finde de Primos.

## Cambios v5.1

- Días colocados a la izquierda.
- Cerdo colocado en el centro.
- Horas totales colocadas a la derecha.
- Nueva imagen del cerdo, más ajustada.
- Se mantiene el contador en dos lecturas:
  - días
  - horas totales : minutos : segundos
- Se mantiene `config.js` como único archivo anual.
- Se usa `?v=5.1` para evitar problemas de caché.

## Estructura

- `config.js` — único archivo que debería ser necesario editar cada año.
- `app.js` — lógica.
- `index.html` — estructura.
- `styles.css` — diseño.
- `assets/` — imágenes e iconos.
