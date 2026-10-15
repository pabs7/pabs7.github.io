// Google Analytics con consentimiento previo (RGPD / LSSI): no se carga nada ni se crea ninguna
// cookie hasta que el visitante pulsa "Aceptar". La elección se guarda en localStorage y se puede
// cambiar en cookies.html.

const GA_ID = ""; // ID de medición de GA4, p. ej. "G-ABC123XYZ". Vacío = analítica desactivada.
const STORAGE_KEY = "consentimiento-analitica";
const COOKIES_PAGE = new URL("../cookies.html", import.meta.url).href;

const UI_TEXT = {
  message: "Uso cookies de Google Analytics para saber cuántas personas visitan el portfolio. Solo se activan si aceptas.",
  more: "Más información",
  accept: "Aceptar",
  reject: "Rechazar",
};

export const CONSENT = { accepted: "aceptada", rejected: "rechazada" };

export function isAnalyticsConfigured() {
  return Boolean(GA_ID);
}

export function readConsent() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function saveConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch (error) {
    // Sin almacenamiento (modo privado, etc.) se volverá a preguntar en la próxima visita.
  }
}

function loadAnalytics() {
  window[`ga-disable-${GA_ID}`] = false;
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

function disableAnalytics() {
  window[`ga-disable-${GA_ID}`] = true;
  const names = document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n.startsWith("_ga"));
  const domains = ["", location.hostname, `.${location.hostname}`];
  names.forEach((name) => {
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    });
  });
}

export function setConsent(accepted) {
  if (!GA_ID) return;
  saveConsent(accepted ? CONSENT.accepted : CONSENT.rejected);
  if (accepted) loadAnalytics();
  else disableAnalytics();
}

function showBanner() {
  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Consentimiento de cookies");

  const text = document.createElement("p");
  text.className = "cookie-banner__text";
  text.textContent = `${UI_TEXT.message} `;
  const link = document.createElement("a");
  link.href = COOKIES_PAGE;
  link.textContent = UI_TEXT.more;
  text.appendChild(link);

  const actions = document.createElement("div");
  actions.className = "cookie-banner__actions";
  [
    [UI_TEXT.reject, false],
    [UI_TEXT.accept, true],
  ].forEach(([label, accepted]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn cookie-banner__btn";
    button.textContent = label;
    button.addEventListener("click", () => {
      setConsent(accepted);
      banner.remove();
    });
    actions.appendChild(button);
  });

  banner.append(text, actions);
  document.body.appendChild(banner);
}

if (GA_ID) {
  const consent = readConsent();
  if (consent === CONSENT.accepted) loadAnalytics();
  else if (consent === null && !location.pathname.endsWith("/cookies.html")) showBanner();
}
