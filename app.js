/*
  FINDE DE PRIMOS — CONFIGURACIÓN
  =================================
  Para preparar la edición de otro año, normalmente basta con cambiar:
  - edition
  - start
  - end
  - progressStart

  progressStart marca desde qué momento se calcula la barra de progreso.
  Idealmente debería ser el final del Finde de Primos anterior.
*/

const EVENT = {
  name: "Finde de Primos",
  edition: 2026,
  start: "2026-11-13T10:00:00+01:00",
  end: "2026-11-15T17:00:00+01:00",

  // Ajusta esta fecha si quieres que el porcentaje parta exactamente
  // del momento en que terminó el Finde de Primos 2025.
  progressStart: "2025-11-16T17:00:00+01:00"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const els = {
  days: $("#days"),
  hours: $("#hours"),
  minutes: $("#minutes"),
  seconds: $("#seconds"),
  sentence: $("#countdown-sentence"),
  progressFill: $("#progress-fill"),
  progressLabel: $("#progress-label"),
  progressTrack: $(".progress-track"),
  progressOrigin: $("#progress-origin"),
  progressDestination: $("#progress-destination"),
  topStatus: $("#top-status"),
  dynamicStatus: $("#dynamic-status"),
  dynamicSubstatus: $("#dynamic-substatus"),
  footerClock: $("#footer-clock")
};

const start = new Date(EVENT.start);
const end = new Date(EVENT.end);
const progressStart = new Date(EVENT.progressStart);

const pad2 = (value) => String(value).padStart(2, "0");
const pad3 = (value) => String(value).padStart(3, "0");

function plural(value, singular, pluralForm) {
  return value === 1 ? singular : pluralForm;
}

function formatEventDestination() {
  const month = start
    .toLocaleDateString("es-ES", { month: "short" })
    .replace(".", "")
    .toUpperCase();

  return `${pad2(start.getDate())} ${month} ${EVENT.edition} // ${pad2(start.getHours())}:${pad2(start.getMinutes())}`;
}

function updateEditionText() {
  $$("[data-edition]").forEach((el) => {
    el.textContent = EVENT.edition;
  });
  document.title = `Finde de Primos // ${EVENT.edition}`;
  els.progressDestination.textContent = formatEventDestination();
}

function setCountdownValues(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  els.days.textContent = pad3(days);
  els.hours.textContent = pad2(hours);
  els.minutes.textContent = pad2(minutes);
  els.seconds.textContent = pad2(seconds);

  return { days, hours, minutes, seconds };
}

function beforeEvent(now) {
  document.body.classList.remove("is-live", "is-complete");
  const remaining = start - now;
  const t = setCountdownValues(remaining);

  els.sentence.textContent =
    `Faltan ${t.days} ${plural(t.days, "día", "días")}, ` +
    `${t.hours} ${plural(t.hours, "hora", "horas")}, ` +
    `${t.minutes} ${plural(t.minutes, "minuto", "minutos")} y ` +
    `${t.seconds} ${plural(t.seconds, "segundo", "segundos")} para el Finde de Primos.`;

  if (remaining <= 60 * 60 * 1000) {
    els.topStatus.textContent = "CONEXIÓN INMINENTE";
    els.dynamicStatus.textContent = "T-60M // CASI ONLINE";
    els.dynamicSubstatus.textContent = "Últimas comprobaciones. El desayuno está a punto de compilar.";
  } else if (remaining <= 24 * 60 * 60 * 1000) {
    els.topStatus.textContent = "T-24H";
    els.dynamicStatus.textContent = "FINAL BUILD DEPLOYED";
    els.dynamicSubstatus.textContent = "Preparad las consolas. El modo búnker está en espera.";
  } else if (remaining <= 7 * 24 * 60 * 60 * 1000) {
    els.topStatus.textContent = "ÚLTIMA SEMANA";
    els.dynamicStatus.textContent = "SINCRONIZACIÓN FINAL";
    els.dynamicSubstatus.textContent = "Provisionando comida, piscina y entorno multijugador.";
  } else {
    els.topStatus.textContent = "EVENTO PROGRAMADO";
    els.dynamicStatus.textContent = "SINCRONIZANDO PRIMOS…";
    els.dynamicSubstatus.textContent = "Preparando entorno multijugador.";
  }
}

function duringEvent(now) {
  document.body.classList.add("is-live");
  document.body.classList.remove("is-complete");

  const elapsed = now - start;
  const total = end - start;
  const eventProgress = Math.min(100, Math.max(0, elapsed / total * 100));

  // Durante el evento, el contador muestra lo que queda de sesión.
  const t = setCountdownValues(end - now);

  els.sentence.textContent =
    `FINDE DE PRIMOS ${EVENT.edition} // ONLINE — quedan ` +
    `${t.days} ${plural(t.days, "día", "días")}, ` +
    `${t.hours} ${plural(t.hours, "hora", "horas")} y ` +
    `${t.minutes} ${plural(t.minutes, "minuto", "minutos")} de modo búnker.`;

  els.topStatus.textContent = "MODO BÚNKER // ONLINE";
  els.dynamicStatus.textContent = "TODOS LOS SISTEMAS OPERATIVOS";
  els.dynamicSubstatus.textContent = `Sesión activa al ${eventProgress.toFixed(1)}%. No se recomienda salir de la casa.`;
}

function afterEvent() {
  document.body.classList.add("is-complete");
  document.body.classList.remove("is-live");

  setCountdownValues(0);
  els.sentence.textContent = `FINDE DE PRIMOS ${EVENT.edition} // COMPLETED ✓`;
  els.topStatus.textContent = "SESSION COMPLETED";
  els.dynamicStatus.textContent = "MEMORIES SAVED SUCCESSFULLY";
  els.dynamicSubstatus.textContent = "NEXT SESSION: pendiente de nueva fecha.";
}

function updateProgress(now) {
  const total = start - progressStart;
  const elapsed = now - progressStart;
  let percentage = total > 0 ? (elapsed / total) * 100 : 0;

  if (now >= start) percentage = 100;
  percentage = Math.max(0, Math.min(100, percentage));

  els.progressFill.style.width = `${percentage}%`;
  els.progressLabel.textContent = `${percentage.toFixed(1)}%`;
  els.progressTrack.setAttribute("aria-valuenow", percentage.toFixed(1));
}

function updateLocalClock(now) {
  const time = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  els.footerClock.textContent = `LOCAL TIME ${time}`;
}

function tick() {
  const now = new Date();

  if (now < start) {
    beforeEvent(now);
  } else if (now <= end) {
    duringEvent(now);
  } else {
    afterEvent();
  }

  updateProgress(now);
  updateLocalClock(now);
}

updateEditionText();
tick();
setInterval(tick, 1000);
