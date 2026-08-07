# Finde de Primos

Cuenta atrás estática para el Finde de Primos.

## Estructura

- `index.html` — contenido de la página
- `styles.css` — diseño visual
- `app.js` — fechas, contador, estados y barra de progreso
- `assets/salon.jpg` — foto de fondo
- `assets/favicon.svg` — icono de la pestaña

## Fechas actuales

- Inicio: 13/11/2026 a las 10:00
- Fin: 15/11/2026 a las 17:00

## Cambiar al año siguiente

Edita únicamente el bloque `EVENT` al principio de `app.js`:

```js
const EVENT = {
  name: "Finde de Primos",
  edition: 2027,
  start: "2027-11-12T10:00:00+01:00",
  end: "2027-11-14T17:00:00+01:00",
  progressStart: "2026-11-15T17:00:00+01:00"
};
```

`progressStart` debería ser el final de la edición anterior para que la barra mida el avance exacto entre un Finde de Primos y el siguiente.

## Publicar con GitHub Pages

1. Sube todos estos archivos manteniendo la estructura de carpetas.
2. En el repositorio: **Settings → Pages**.
3. En **Build and deployment**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
4. Guarda los cambios.

Para la organización `bensupe` y el repositorio `finde-primos`, la URL será:

`https://bensupe.github.io/finde-primos/`
