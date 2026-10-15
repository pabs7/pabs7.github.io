# Portfolio — Pablo José Cortés Santos

Portfolio de **Tech Lead Backend / Full Stack Developer** (Python, Django, Angular, Docker), contado como
una expedición de montaña en pixel art. Publicado en **https://pabs7.github.io**.

HTML, CSS y JavaScript vanilla: sin frameworks, sin dependencias y sin paso de build.

## Recorrido

- **Campamento base** (`index.html`): un valle a pantalla completa. Cada cumbre es un proyecto; al pasar
  por encima se oscurece el resto del paisaje y aparece su cota con el nombre. El refugio lleva al interior.
- **Refugio** (`refugio.html`): el panel de material de escalada guarda las habilidades (cuerdas →
  lenguajes, mosquetones → frameworks…), el diario de la mesa abre la trayectoria y la ventana devuelve al
  campamento.
- **Diario de montaña**: `bitacora.html` (sobre mí, experiencia, formación, contacto y CV) y
  `expediciones.html` (lista de todos los proyectos).
- **Diario de cada proyecto**: `projects/diario.html?slug=<slug>`, una única plantilla que se rellena con
  los datos del proyecto.

## Añadir un proyecto

Todo sale de [`js/projects.js`](js/projects.js): añade un objeto al array y el proyecto aparece a la vez
como cumbre en la escena, en la lista de expediciones y con su propio diario. Los proyectos `featured`
ocupan las cumbres más grandes; las cumbres sin proyecto quedan reservadas y no son seleccionables.

## Ver en local

Las escenas usan módulos ES, que los navegadores no cargan desde `file://`, así que hay que servir la
carpeta:

```bash
python -m http.server 8000
```

y abrir `http://localhost:8000`.

## Estructura

```
index.html, refugio.html            Escenas interactivas a pantalla completa
bitacora.html, expediciones.html    Diario de montaña
projects/diario.html                Plantilla del diario de cada proyecto
cookies.html                        Política de cookies y cambio de consentimiento
404.html
css/styles.css                      Estilos globales (variables en :root)
js/
  projects.js                       Datos de los proyectos
  scene-engine.js                   Motor común de las escenas (zonas, oscurecido, foco)
  scene.js                          Campamento: picos → proyectos y cotas
  sierra.js                         Zonas de los picos (generado por tools/picos.py)
  refugio.js                        Interior: material de escalada → habilidades
  diario.js, expediciones.js        Render del diario de proyecto y de la lista
  analytics.js                      Google Analytics, solo tras aceptar el banner de cookies
assets/img/                         Ilustraciones optimizadas (WebP)
assets/cv/                          CV descargable
tools/                              Scripts de Python (Pillow) para regenerar zonas y cielo
```

Las ilustraciones se generaron con Gemini y se usan como base. La capa interactiva es propia:
`tools/picos.py` detecta el horizonte y los picos de `fondo-sierra.webp` y genera `js/sierra.js`, y
`tools/cielo.py` genera la franja de cielo extra. Solo hay que volver a ejecutarlos si cambia la ilustración.

## Despliegue

GitHub Pages desde la rama `main`, carpeta raíz (*Settings → Pages → Deploy from a branch*). Cada push a
`main` se publica en uno o dos minutos. El archivo `.nojekyll` hace que Pages sirva los archivos tal cual.
