import { projects } from "./projects.js";

const LINK_LABELS = { repo: "Código", demo: "Ver la web", article: "Artículo" };

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function renderNotFound(container) {
  container.innerHTML = `
    <p class="diario__meta">Bitácora extraviada</p>
    <h1 class="diario__title">Ruta no encontrada</h1>
    <p>Esta página del diario no corresponde a ninguna expedición registrada.</p>
    <a class="btn btn--primary diario__back" href="../index.html">Volver al campamento base</a>
  `;
}

function renderProject(container, project) {
  document.title = `${project.title} — Diario de la aventura`;

  const linkEntries = Object.entries(project.links).filter(([, url]) => url);
  let linksHtml = "";
  if (linkEntries.length) {
    const items = linkEntries
      .map(([key, url]) => {
        const label = LINK_LABELS[key] || key;
        return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
      })
      .join("");
    linksHtml = `<div class="diario__links">${items}</div>`;
  } else if (project.confidential) {
    linksHtml = `<span class="diario__nda">Expedición confidencial — NDA</span>`;
  }

  const highlightsHtml = project.highlights.length
    ? `
      <p class="diario__label">Logros de la cumbre</p>
      <ul class="diario__highlights">
        ${project.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
      </ul>
    `
    : "";

  const techHtml = `
    <p class="diario__label">Equipo de expedición</p>
    <ul class="diario__tech">
      ${project.tech.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}
    </ul>
  `;

  container.innerHTML = `
    <p class="diario__meta">${escapeHtml(project.company)} · ${project.year} · ${escapeHtml(project.category)}</p>
    <h1 class="diario__title">${escapeHtml(project.title)}</h1>

    <p class="diario__label">Rol en la expedición</p>
    <p class="diario__body">${escapeHtml(project.role)}</p>

    <p class="diario__label">Bitácora</p>
    ${project.description
      .split(/\n\s*\n/)
      .map((paragraph) => `<p class="diario__body">${escapeHtml(paragraph)}</p>`)
      .join("")}

    ${highlightsHtml}
    ${techHtml}
    ${linksHtml}

    <div class="diario__nav">
      <a class="btn btn--secondary" href="../index.html">Volver al campamento base</a>
      <a class="btn btn--secondary" href="../expediciones.html">Todas las expediciones</a>
    </div>
  `;
}

function init() {
  const container = document.getElementById("diario-content");
  if (!container) return;

  const slug = new URLSearchParams(window.location.search).get("slug");
  const project = projects.find((p) => p.slug === slug);

  if (project) {
    renderProject(container, project);
  } else {
    renderNotFound(container);
  }
}

init();
