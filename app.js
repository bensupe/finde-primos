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
    totalHours: $("#total-hours"),
    minutes: $("#minutes"),
    seconds: $("#seconds"),
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
    const totalHours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    els.days.textContent = String(days);
    els.totalHours.textContent = String(totalHours);
    els.minutes.textContent = pad2(minutes);
    els.seconds.textContent = pad2(seconds);

    return { totalSeconds, days, hours, totalHours, minutes, seconds };
  }

  function beforeEvent(now) {
    document.body.classList.remove("is-live", "is-complete");
    const remaining = start - now;
    const total = setCountdownValues(remaining);

    if (remaining <= 60 * 60 * 1000) {
      els.topStatus.textContent = "CONEXIÓN INMINENTE";
      els.dynamicStatus.textContent = "Casi todo listo";
      els.dynamicSubstatus.textContent = "Últimas comprobaciones. El desayuno está a punto de arrancar.";
    } else if (remaining <= 24 * 60 * 60 * 1000) {
      els.topStatus.textContent = "FALTA MUY POCO";
      els.dynamicStatus.textContent = "Recta final";
      els.dynamicSubstatus.textContent = "Preparad las consolas. El modo búnker está a punto de activarse.";
    } else if (remaining <= 7 * 24 * 60 * 60 * 1000) {
      els.topStatus.textContent = "ÚLTIMA SEMANA";
      els.dynamicStatus.textContent = "Sincronizando primos…";
      els.dynamicSubstatus.textContent = "Provisionando comida, piscina y entorno multijugador.";
    } else {
      els.topStatus.textContent = "EVENTO PROGRAMADO";
      els.dynamicStatus.textContent = "Sincronizando primos…";
      els.dynamicSubstatus.textContent = "Preparando entorno multijugador.";
    }
  }

  function duringEvent(now) {
    document.body.classList.add("is-live");
    document.body.classList.remove("is-complete");

    const elapsed = now - start;
    const total = end - start;
    const eventProgress = Math.min(100, Math.max(0, (elapsed / total) * 100));
    const remaining = setCountdownValues(end - now);

    els.topStatus.textContent = "MODO BÚNKER // ONLINE";
    els.dynamicStatus.textContent = "Finde en curso";
    els.dynamicSubstatus.textContent =
      `Sesión activa al ${eventProgress.toFixed(1)}%. No se recomienda salir de la casa.`;
  }

  function afterEvent() {
    document.body.classList.add("is-complete");
    document.body.classList.remove("is-live");

    setCountdownValues(0);

    els.topStatus.textContent = "SESSION COMPLETED";
    els.dynamicStatus.textContent = "Finde completado";
    els.dynamicSubstatus.textContent = "Pendiente de nueva fecha para la próxima edición.";
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

    els.footerClock.textContent = `Hora local ${time}`;
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


  function setupFoodMenuModal() {
    const openButton = $("#open-food-menu");
    const modal = $("#food-menu-modal");
    const closeButton = $("#close-food-menu");

    if (!openButton || !modal || !closeButton) return;

    let lastFocusedElement = null;

    const openModal = () => {
      lastFocusedElement = document.activeElement;
      modal.hidden = false;
      document.body.classList.add("modal-open");
      closeButton.focus();
    };

    const closeModal = () => {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      if (lastFocusedElement) lastFocusedElement.focus();
    };

    openButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });
  }

  setupFoodMenuModal();

  updateStaticEventData();
  tick();
  setInterval(tick, 1000);
})();
