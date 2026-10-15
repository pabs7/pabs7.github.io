// Motor común de las escenas interactivas (campamento y refugio): una ilustración de fondo
// dentro de un SVG, con zonas (polígonos) que al pasar el ratón, recibir el foco o tocarlas
// oscurecen el resto de la escena. Cada página decide qué etiqueta dibujar con onShow/onHide.

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

  let active = null;

  function activate(entry) {
    active = entry;
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

  // Ratón → hover; teclado → foco; táctil → el primer toque muestra la zona y el segundo navega.
  // Los navegadores táctiles emulan eventos de ratón y foco al tocar, así que se filtran por tipo.
  let lastPointer = "mouse";
  document.addEventListener("pointerdown", (event) => { lastPointer = event.pointerType; }, true);
  document.addEventListener("keydown", (event) => {
    lastPointer = "keyboard";
    if (event.key === "Escape") activate(null);
  }, true);

  nodes.forEach((entry) => {
    const { node } = entry;
    node.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") activate(entry); });
    node.addEventListener("pointerleave", (event) => { if (event.pointerType === "mouse") activate(null); });
    node.addEventListener("focus", () => { if (lastPointer === "keyboard") activate(entry); });
    node.addEventListener("blur", () => { if (lastPointer === "keyboard") activate(null); });
    node.addEventListener("click", (event) => {
      if (lastPointer === "mouse" || lastPointer === "keyboard") return;
      if (active !== entry) {
        event.preventDefault();
        activate(entry);
      }
    });
  });

  // Tocar fuera de cualquier zona cierra la que esté abierta.
  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" && active && !event.target.closest(".hotspot")) activate(null);
  });

  if (viewport.scrollWidth > viewport.clientWidth) {
    viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) * scrollFocusX;
    showSwipeHint(viewport);
  }
}

function showSwipeHint(viewport) {
  const hint = document.createElement("p");
  hint.className = "scene__hint";
  hint.setAttribute("aria-hidden", "true");
  hint.textContent = "← Desliza para explorar →";
  viewport.parentElement.appendChild(hint);
  // El encuadre inicial también dispara "scroll": se espera a que pase antes de escuchar al usuario.
  setTimeout(() => {
    viewport.addEventListener("scroll", () => hint.classList.add("is-hidden"), { once: true, passive: true });
  }, 400);
}
