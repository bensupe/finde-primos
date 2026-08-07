/*
  FINDE DE PRIMOS — LÓGICA DE LA WEB
  ===================================
  No debería ser necesario editar este archivo para cambiar de edición.
  Las fechas viven exclusivamente en config.js.
*/

(() => {
  "use strict";

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
    footerClock: $("#footer-clock"),
    eventDateRange: $("#event-date-range"),
    eventSchedule: $("#event-schedule")
  };

  function showConfigError(message) {
    console.error(`[FINDE CONFIG] ${message}`);
    els.topStatus.textContent = "CONFIG ERROR";
    els.dynamicStatus.textContent = "ERROR DE CONFIGURACIÓN";
    els.dynamicSubstatus.textContent = message;
    els.sentence.textContent = "Revisa config.js.";
    document.body.classList.add("is-complete");
  }

  if (typeof FINDE_CONFIG === "undefined") {
    showConfigError("No se ha podido cargar FINDE_CONFIG desde config.js.");
    return;
  }

  const requiredKeys = ["edition", "previousEnd", "start", "end"];
  const missing = requiredKeys.filter((key) => !(key in FINDE_CONFIG));

  if (missing.length) {
    showConfigError(`Faltan estos campos en config.js: ${missing.join(", ")}.`);
    return;
  }

  const start = new Date(FINDE_CONFIG.start);
  const end = new Date(FINDE_CONFIG.end);
  const previousEnd = new Date(FINDE_CONFIG.previousEnd);

  if ([start, end, previousEnd].some((date) => Number.isNaN(date.getTime()))) {
    showConfigError("Hay alguna fecha con formato no válido.");
    return;
  }

  if (!(previousEnd < start && start < end)) {
    showConfigError("Las fechas deben cumplir: previousEnd < start < end.");
    return;
  }

  const pad2 = (value) => String(value).padStart(2, "0");

  function plural(value, singular, pluralForm) {
    return value === 1 ? singular : pluralForm;
  }

  function monthShort(date) {
    return date
      .toLocaleDateString("es-ES", { month: "short" })
      .replace(".", "")
      .toUpperCase();
  }

  function weekday(date) {
    const text = date.toLocaleDateString("es-ES", { weekday: "long" });
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function formatTime(date) {
    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  }

  function formatCompactDate(date, includeYear = true) {
    const base = `${pad2(date.getDate())} ${monthShort(date)}`;
    return includeYear ? `${base} ${date.getFullYear()}` : base;
  }

  function formatDateRange() {
    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth =
      sameYear &&
      start.getMonth() === end.getMonth();

    if (sameMonth) {
      return `${start.getDate()}—${end.getDate()} ${monthShort(start)} ${start.getFullYear()}`;
    }

    if (sameYear) {
      return `${start.getDate()} ${monthShort(start)} — ${end.getDate()} ${monthShort(end)} ${start.getFullYear()}`;
    }

    return `${formatCompactDate(start)} — ${formatCompactDate(end)}`;
  }

  function formatSchedule() {
    return `${weekday(start)} ${formatTime(start)} → ${weekday(end)} ${formatTime(end)}`;
  }

  function updateStaticEventData() {
    $$("[data-edition]").forEach((el) => {
      el.textContent = FINDE_CONFIG.edition;
    });

    document.title = `Finde de Primos // ${FINDE_CONFIG.edition}`;
    els.eventDateRange.textContent = formatDateRange();
    els.eventSchedule.textContent = formatSchedule();
    els.progressOrigin.textContent = `FIN ${formatCompactDate(previousEnd)}`;
    els.progressDestination.textContent = `${formatCompactDate(start)} // ${formatTime(start)}`;
  }

  function setCountdownValues(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Los días nunca llevan ceros a la izquierda.
    els.days.textContent = String(days);
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
    const eventProgress = Math.min(100, Math.max(0, (elapsed / total) * 100));
    const t = setCountdownValues(end - now);

    els.sentence.textContent =
      `FINDE DE PRIMOS ${FINDE_CONFIG.edition} // ONLINE — quedan ` +
      `${t.days} ${plural(t.days, "día", "días")}, ` +
      `${t.hours} ${plural(t.hours, "hora", "horas")} y ` +
      `${t.minutes} ${plural(t.minutes, "minuto", "minutos")} de modo búnker.`;

    els.topStatus.textContent = "MODO BÚNKER // ONLINE";
    els.dynamicStatus.textContent = "TODOS LOS SISTEMAS OPERATIVOS";
    els.dynamicSubstatus.textContent =
      `Sesión activa al ${eventProgress.toFixed(1)}%. No se recomienda salir de la casa.`;
  }

  function afterEvent() {
    document.body.classList.add("is-complete");
    document.body.classList.remove("is-live");

    setCountdownValues(0);
    els.sentence.textContent =
      `FINDE DE PRIMOS ${FINDE_CONFIG.edition} // COMPLETED ✓`;

    els.topStatus.textContent = "SESSION COMPLETED";
    els.dynamicStatus.textContent = "MEMORIES SAVED SUCCESSFULLY";
    els.dynamicSubstatus.textContent = "NEXT SESSION: pendiente de nueva fecha.";
  }

  function updateProgress(now) {
    const total = start - previousEnd;
    const elapsed = now - previousEnd;

    let percentage = (elapsed / total) * 100;
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

  updateStaticEventData();
  tick();
  setInterval(tick, 1000);
})();
