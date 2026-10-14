import { projects } from "./projects.js";
import { mountScene } from "./scene-engine.js";
import { PEAKS, SIERRA } from "./sierra.js";

const COTA_HEIGHT = 64;
const COTA_MIN_TOP = -170;

// Cabaña (tejado, chimenea, porche y escalones) + excursionista, perro y hoguera.
const REFUGIO = {
  apex: [990, 404],
  fullHighlight: true,
  points:
    "873,492 940,404 1041,404 1041,395 1067,395 1067,405 1131,488 1122,492 1122,556 1150,565 1172,572 " +
    "1172,622 1100,622 1050,628 1018,628 1016,575 940,580 900,580 871,560 872,534",
  href: "refugio.html",
  title: "Refugio",
  subtitle: "Sobre mí, experiencia y habilidades",
  ariaLabel: "Entrar al refugio: sobre mí, experiencia, habilidades, formación y contacto",
};

function buildHotspots() {
  const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
  const byRank = [...PEAKS].sort((a, b) => a.rank - b.rank);
  if (ordered.length > byRank.length) {
    console.warn(`Hay ${ordered.length} proyectos y solo ${byRank.length} picos en la escena.`);
  }
  const assignment = new Map(byRank.map((peak, i) => [peak, ordered[i]]));

  // Las cumbres sin proyecto quedan reservadas para futuros proyectos: no son interactivas.
  const peaks = PEAKS.filter((peak) => assignment.get(peak)).map((peak) => {
    const project = assignment.get(peak);
    return {
      points: peak.points,
      apex: peak.apex,
      href: `projects/diario.html?slug=${encodeURIComponent(project.slug)}`,
      ariaLabel: `Proyecto: ${project.title} — ${project.company}, ${project.year}`,
      title: project.title,
      subtitle: `${project.company} · ${project.year}`,
    };
  });

  return [...peaks, REFUGIO];
}

function showCota({ apex, title, subtitle }) {
  const cota = document.getElementById("scene-cota");
  const line = document.getElementById("scene-cota-line");
  const vertex = document.getElementById("scene-cota-vertex");
  const bg = document.getElementById("scene-cota-bg");
  const titleEl = document.getElementById("scene-cota-title");
  const subEl = document.getElementById("scene-cota-sub");

  const [x, y] = apex;
  const top = Math.max(COTA_MIN_TOP, y - COTA_HEIGHT);

  line.setAttribute("x1", x);
  line.setAttribute("y1", y);
  line.setAttribute("x2", x);
  line.setAttribute("y2", top);
  vertex.setAttribute("points", `${x},${y - 7} ${x - 5},${y + 2} ${x + 5},${y + 2}`);

  titleEl.textContent = title;
  subEl.textContent = subtitle;
  titleEl.setAttribute("x", 0);
  titleEl.setAttribute("y", 0);
  subEl.setAttribute("x", 0);
  subEl.setAttribute("dy", 16);

  const box = titleEl.parentNode.getBBox();
  const padX = 8;
  const padY = 5;
  const width = box.width + padX * 2;
  const height = box.height + padY * 2;
  const gap = 6;
  const boxX = x + gap + width <= SIERRA.width - 4 ? x + gap : x - gap - width;
  const boxY = top - 2;

  bg.setAttribute("x", boxX);
  bg.setAttribute("y", boxY);
  bg.setAttribute("width", width);
  bg.setAttribute("height", height);
  const textX = boxX + padX - box.x;
  titleEl.setAttribute("x", textX);
  titleEl.setAttribute("y", boxY + padY - box.y);
  subEl.setAttribute("x", textX);

  cota.classList.remove("is-visible");
  // Fuerza el reinicio de la animación de crecimiento al cambiar de pico.
  void cota.getBoundingClientRect();
  cota.classList.add("is-visible");
}

function hideCota() {
  document.getElementById("scene-cota").classList.remove("is-visible");
}

mountScene({ hotspots: buildHotspots(), onShow: showCota, onHide: hideCota, scrollFocusX: 0.62 });
