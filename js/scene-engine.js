// Motor común de las escenas interactivas (campamento y refugio): una ilustración de fondo
// dentro de un SVG, con zonas (polígonos) que al pasar el ratón o recibir el foco oscurecen
// el resto de la escena. Cada página decide qué etiqueta dibujar con onShow/onHide.

const SVG_NS = "http://www.w3.org/2000/svg";

export function svgEl(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  return node;
}

export function pointsBBox(points) {
  const coords = points.trim().split(/\s+/).map((p) => p.split(",").map(Number));
  const xs = coords.map((c) => c[0]);
  const ys = coords.map((c) => c[1]);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

/**
 * hotspots: [{ points, ariaLabel, href?, fullHighlight?, ...datos de la página }]
 * - con href → enlace; sin href → elemento enfocable que muestra información sin navegar.
 */
export function mountScene({ hotspots, onShow, onHide, scrollFocusX = 0.5 }) {
  const art = document.getElementById("scene-art");
  const group = document.getElementById("scene-hotspots");
  const hole = document.getElementById("scene-spot-hole");
  const viewport = document.getElementById("scene-viewport");

  const nodes = hotspots.map((def) => {
    let node;
    if (def.href) {
      node = svgEl("a", { href: def.href, class: "hotspot", "aria-label": def.ariaLabel });
    } else {
      node = svgEl("g", { class: "hotspot hotspot--info", tabindex: "0", role: "button", "aria-label": def.ariaLabel });
    }
    node.appendChild(svgEl("polygon", { points: def.points, class: "hotspot__shape" }));
    group.appendChild(node);
    return { node, def };
  });

  function activate(entry) {
    nodes.forEach((n) => n.node.classList.toggle("is-active", n === entry));
    if (entry) {
      hole.setAttribute("points", entry.def.points);
      // Las zonas grandes (picos) se difuminan hacia abajo; los objetos se iluminan enteros.
      hole.setAttribute("fill", entry.def.fullHighlight ? "black" : "url(#scene-spot-fade)");
      art.classList.add("is-focusing");
      onShow(entry.def);
    } else {
      art.classList.remove("is-focusing");
      onHide();
    }
  }

  nodes.forEach((entry) => {
    entry.node.addEventListener("mouseenter", () => activate(entry));
    entry.node.addEventListener("mouseleave", () => activate(null));
    entry.node.addEventListener("focus", () => activate(entry));
    entry.node.addEventListener("blur", () => activate(null));
  });

  if (viewport.scrollWidth > viewport.clientWidth) {
    viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) * scrollFocusX;
  }
}
