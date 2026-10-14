import { projects } from "./projects.js";

const list = document.getElementById("expediciones-list");

const ordered = [...projects].sort((a, b) => b.year - a.year);

ordered.forEach((project) => {
  const item = document.createElement("li");
  item.className = "expedicion";

  const link = document.createElement("a");
  link.className = "expedicion__link";
  link.href = `projects/diario.html?slug=${encodeURIComponent(project.slug)}`;

  const title = document.createElement("span");
  title.className = "expedicion__title";
  title.textContent = project.title;

  const meta = document.createElement("span");
  meta.className = "expedicion__meta";
  meta.textContent = [project.company, project.year, project.confidential ? "confidencial" : null]
    .filter(Boolean)
    .join(" · ");

  link.append(title, meta);

  const summary = document.createElement("p");
  summary.className = "expedicion__summary";
  summary.textContent = project.summary;

  item.append(link, summary);
  list.appendChild(item);
});
