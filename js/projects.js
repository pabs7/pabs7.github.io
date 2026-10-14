// Datos de los proyectos del portfolio. Edita este archivo para añadir, quitar
// o actualizar proyectos: el HTML y el renderizado no necesitan tocarse.

export const projects = [
  {
    slug: "presa",
    title: "Presa",
    summary: "Plataforma para rocódromos: reservas con aforo, cuotas y las vías del muro en una app.",
    description:
      "Presa es una plataforma para rocódromos que funcionan con cuota mensual. Cada club la usa con " +
      "sus propios datos, y los socios tienen una app para reservar plaza y estar al día del club. " +
      "Ahora mismo ya funciona con un club real.\n\n" +
      "Incluye reservas por franjas con control de aforo por espacio y lista de espera, gestión de " +
      "cuotas, noticias, encuestas y muros de escalada sobre los que los socios dibujan sus propias " +
      "vías. Cada club tiene su panel de administración, y un panel global sirve para dar de alta y " +
      "gestionar los clubes.\n\n" +
      "Es un solo producto que se licencia a varios clubes: comparten aplicación y backend, pero los " +
      "datos de cada club viven aislados en su propio esquema de base de datos (django-tenants).\n\n" +
      "Backend en Django y Django REST Framework sobre PostgreSQL, con Celery y Redis para tareas en " +
      "segundo plano y autenticación JWT. Frontend en React, TypeScript y Vite como PWA instalable, " +
      "con empaquetado previsto para App Store y Google Play mediante Capacitor. Se despliega con " +
      "Docker Compose, nginx y Dokploy: preproducción en un servidor propio y producción en un VPS " +
      "de OVH. CI en GitHub Actions con pytest, Vitest, Ruff y pruebas E2E con Playwright.",
    role: "Creador",
    company: "Proyecto personal",
    year: 2026,
    category: "fullstack",
    tech: [
      "Python",
      "Django",
      "Django REST Framework",
      "PostgreSQL",
      "django-tenants",
      "Celery",
      "Redis",
      "JWT",
      "React",
      "TypeScript",
      "Vite",
      "PWA",
      "Docker Compose",
      "nginx",
      "Dokploy",
      "GitHub Actions",
      "pytest",
      "Vitest",
      "Ruff",
      "Playwright",
    ],
    highlights: [
      "En producción con un club real",
      "Multi-club: los datos de cada club aislados en su propio esquema",
    ],
    links: {
      repo: "",
      demo: "https://57-129-174-126.sslip.io/",
      article: "",
    },
    image: "",
    featured: true,
    confidential: false,
  },
  {
    slug: "telemetria-fotovoltaica",
    title: "Sistema de telemetría fotovoltaica",
    summary: "Ingesta y procesamiento de datos de plantas solares en tiempo real.",
    description:
      "Diseño y desarrollo del backend responsable de recibir, validar y procesar la telemetría " +
      "de plantas fotovoltaicas, optimizando el pipeline de datos para reducir drásticamente los " +
      "tiempos de procesamiento y permitir monitorización casi en tiempo real.",
    role: "Diseño de arquitectura y desarrollo backend",
    company: "Solfium",
    year: 2024,
    category: "backend",
    tech: ["Python", "Django", "PostgreSQL", "Docker"],
    highlights: ["Reducción del 35% en tiempos de procesamiento"],
    links: {
      repo: "",
      demo: "",
      article: "",
    },
    image: "",
    featured: true,
    confidential: true,
  },
  {
    slug: "plataforma-microservicios",
    title: "Plataforma de microservicios Django + Angular/React Native",
    summary: "Arquitectura de microservicios full stack desplegada con Docker.",
    description:
      "Definición de la arquitectura de microservicios y desarrollo full stack combinando APIs REST " +
      "en Django con clientes en Angular y React Native, coordinando despliegues con Docker y " +
      "liderando el reparto de tareas entre el equipo backend y frontend.",
    role: "Liderazgo técnico y desarrollo full stack",
    company: "Solfium",
    year: 2023,
    category: "fullstack",
    tech: ["Python", "Django", "Angular", "React Native", "Docker"],
    highlights: [],
    links: {
      repo: "",
      demo: "",
      article: "",
    },
    image: "",
    featured: true,
    confidential: true,
  },
  {
    slug: "api-inverters-mock",
    title: "Simulador de API de inversores solares",
    summary: "Mock de la API de Hoymiles para desarrollar y probar sin inversores reales.",
    description:
      "Proyecto personal pensado para facilitar el trabajo del equipo de Solfium: un servidor Django " +
      "que imita la API de Hoymiles S-Miles Cloud. Una aplicación se conecta a él cambiando solo la " +
      "URL base, así que se puede desarrollar y probar la integración sin depender de inversores ni " +
      "plantas reales.\n\n" +
      "Por debajo hay un motor físico de planta solar que calcula la producción con curva horaria, " +
      "estacionalidad y meteorología diaria, con aleatoriedad determinista para que los datos sean " +
      "reproducibles. Un patrón Adapter traduce ese motor al formato de cada fabricante, con los " +
      "mapeos declarados en YAML: Hoymiles está implementado y la arquitectura está preparada para " +
      "otros como Growatt o Solis.\n\n" +
      "Replica también el comportamiento de la API real: autenticación por API key, permisos por " +
      "estación, rate limiting y latencia artificial. Incluye tests unitarios y de integración y una " +
      "colección de Postman.",
    role: "Creador",
    company: "Proyecto personal",
    year: 2026,
    category: "backend",
    tech: ["Python", "Django", "Django REST Framework", "PyYAML", "Postman"],
    highlights: ["Sustituye a la API real cambiando solo la URL base"],
    links: {
      repo: "",
      demo: "",
      article: "",
    },
    image: "",
    featured: true,
    confidential: false,
  },
  {
    slug: "comunicacion-radares-trafico",
    title: "Comunicación con radares de tráfico",
    summary: "Sistema embebido en Python para transmisión de datos en tiempo real vía Bluetooth.",
    description:
      "Desarrollo de software embebido en Python para la comunicación con radares de tráfico, " +
      "incluyendo transmisión de datos en tiempo real por Bluetooth y mejora de la validación y " +
      "envío de paquetes para reducir pérdidas en condiciones reales de operación.",
    role: "Python Developer",
    company: "Grupo Tecnologías del Tráfico",
    year: 2022,
    category: "embedded",
    tech: ["Python", "Bluetooth"],
    highlights: ["Reducción del 25% en pérdida de paquetes"],
    links: {
      repo: "",
      demo: "",
      article: "",
    },
    image: "",
    featured: false,
    confidential: true,
  },
  {
    slug: "puntos-acceso-wifi-openwrt",
    title: "Software para puntos de acceso Wi-Fi sobre OpenWRT",
    summary: "Automatización de compilación y despliegue de software embebido.",
    description:
      "Desarrollo de software embebido para puntos de acceso Wi-Fi basados en OpenWRT y " +
      "automatización de los procesos de compilación y despliegue mediante scripts en Bash y " +
      "Python, reduciendo significativamente los tiempos de entrega.",
    role: "Embedded Linux Developer",
    company: "Bc-techs",
    year: 2021,
    category: "embedded",
    tech: ["Bash", "Python", "Linux", "OpenWRT"],
    highlights: ["Reducción del 25% en tiempos de compilación y despliegue"],
    links: {
      repo: "",
      demo: "",
      article: "",
    },
    image: "",
    featured: false,
    confidential: true,
  },
  {
    slug: "este-portfolio",
    title: "Este portfolio",
    summary: "Mi web personal: HTML, CSS y JavaScript vanilla, sin frameworks.",
    description:
      "Portfolio personal construido con HTML, CSS y JavaScript vanilla, sin frameworks ni build " +
      "step, pensado para publicarse directamente en GitHub Pages. Incluye tema claro/oscuro, " +
      "filtrado de proyectos y un sistema de datos editable sin tocar el HTML.",
    role: "Diseño y desarrollo",
    company: "Proyecto personal",
    year: 2026,
    category: "personal",
    tech: ["HTML", "CSS", "JavaScript"],
    highlights: [],
    links: {
      repo: "https://github.com/pabs7/pabs7.github.io",
      demo: "",
      article: "",
    },
    image: "",
    featured: false,
    confidential: false,
  },
];
