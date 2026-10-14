import { mountScene, pointsBBox, svgEl } from "./scene-engine.js";

// Coordenadas sobre assets/img/interior-refugio.webp (viewBox 1024x559).
const SCENE_WIDTH = 1024;

const DIARIO = {
  href: "bitacora.html",
  ariaLabel: "Abrir el diario de montaña: sobre mí, experiencia, formación y contacto",
  points: "487,404 556,388 598,398 638,424 630,433 615,447 615,452 560,470 487,420",
  fullHighlight: true,
  placement: "above",
  title: "Diario de montaña",
  items: ["Sobre mí", "Experiencia", "Formación e idiomas", "Expediciones (proyectos)", "Contacto"],
};

// Marco de la ventana, en perspectiva sobre la pared derecha.
const VENTANA = {
  href: "index.html",
  ariaLabel: "Salir por la ventana: volver al campamento base",
  points: "645,44 970,26 972,302 645,290",
  fullHighlight: true,
  placement: "center",
  title: "Volver al campamento",
  items: [],
};

// Cada pieza del panel de escalada guarda una categoría de habilidades. Las zonas son trapecios
// que siguen la perspectiva del panel (borde superior y=35→77, inferior y=446→334 entre x=49 y x=540).
const GEAR = [
  {
    title: "Lenguajes",
    items: ["Python", "JavaScript", "SQL", "Bash"],
    points: "68,43 256,58 256,399 68,442",
  },
  {
    title: "Frameworks",
    items: ["Django", "Flask", "Angular", "React", "Flutter"],
    points: "258,64 378,73 378,190 258,195",
  },
  {
    title: "Liderazgo técnico",
    items: [
      "Code review",
      "Arquitectura de software",
      "Mentoring",
      "Diseño y reparto de tareas",
      "Despliegues e incidencias (Azure DevOps)",
    ],
    points: "392,68 541,80 541,188 392,195",
  },
  {
    title: "Metodologías",
    items: ["Agile", "Scrum"],
    points: "258,212 368,206 368,373 258,398",
  },
  {
    title: "Bases de datos",
    items: ["PostgreSQL", "MySQL", "MongoDB"],
    points: "369,198 419,195 419,342 369,352",
  },
  {
    title: "DevOps / Cloud",
    items: ["Docker", "Jenkins", "Azure", "Linux", "Git"],
    points: "421,224 506,217 506,330 421,348",
  },
].map((gear) => ({
  ...gear,
  fullHighlight: true,
  placement: "side",
  ariaLabel: `${gear.title}: ${gear.items.join(", ")}`,
}));

const TAG = { padX: 10, padY: 8, gap: 16, lineGap: 13, titleGap: 15, holeSpace: 8 };

function placeTag(def, item, width, height) {
  const anchorX = (item.minX + item.maxX) / 2;
  if (def.placement === "center") {
    return { x: anchorX - width / 2, y: (item.minY + item.maxY) / 2 - height / 2 };
  }
  if (def.placement === "above") {
    return {
      x: Math.max(6, Math.min(SCENE_WIDTH - width - 6, anchorX - width / 2)),
      y: item.minY - height - TAG.gap,
      holeX: anchorX,
      holeAtBottom: true,
    };
  }
  const fitsRight = item.maxX + TAG.gap + width <= SCENE_WIDTH - 6;
  return { x: fitsRight ? item.maxX + TAG.gap : item.minX - TAG.gap - width, y: Math.max(6, item.minY) };
}

function showTag(def) {
  const tag = document.getElementById("scene-tag");
  const bg = document.getElementById("scene-tag-bg");
  const hole = document.getElementById("scene-tag-hole");
  const string = document.getElementById("scene-tag-string");
  const text = document.getElementById("scene-tag-text");

  text.replaceChildren();
  text.appendChild(svgEl("tspan", { class: "tag__title", x: 0, y: 0 })).textContent = def.title;
  def.items.forEach((item, i) => {
    const tspan = svgEl("tspan", { class: "tag__item", x: 0, dy: i === 0 ? TAG.titleGap + 2 : TAG.lineGap });
    tspan.textContent = `· ${item}`;
    text.appendChild(tspan);
  });

  // La etiqueta centrada (ventana) no cuelga de nada: sin agujero ni cordel.
  const hanging = def.placement !== "center";
  const holeSpace = hanging ? TAG.holeSpace : 0;
  const box = text.getBBox();
  const width = box.width + TAG.padX * 2 + holeSpace;
  const height = box.height + TAG.padY * 2;
  const item = pointsBBox(def.points);
  const pos = placeTag(def, item, width, height);

  bg.setAttribute("x", pos.x);
  bg.setAttribute("y", pos.y);
  bg.setAttribute("width", width);
  bg.setAttribute("height", height);

  tag.classList.toggle("tag--loose", !hanging);
  if (hanging) {
    const holeX = pos.holeAtBottom ? pos.x + width / 2 : pos.x + 7;
    const holeY = pos.holeAtBottom ? pos.y + height - 6 : pos.y + 7;
    hole.setAttribute("cx", holeX);
    hole.setAttribute("cy", holeY);
    string.setAttribute("x1", (item.minX + item.maxX) / 2);
    string.setAttribute("y1", item.minY + (pos.holeAtBottom ? 4 : 6));
    string.setAttribute("x2", holeX);
    string.setAttribute("y2", holeY);
  }

  const textX = pos.x + TAG.padX + holeSpace - box.x;
  text.querySelectorAll("tspan").forEach((t) => t.setAttribute("x", textX));
  text.firstChild.setAttribute("y", pos.y + TAG.padY - box.y);

  tag.classList.add("is-visible");
}

function hideTag() {
  document.getElementById("scene-tag").classList.remove("is-visible");
}

mountScene({ hotspots: [...GEAR, DIARIO, VENTANA], onShow: showTag, onHide: hideTag, scrollFocusX: 0.45 });
