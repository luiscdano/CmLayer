(() => {
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // Prevent form submit (no backend yet)
  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    if(btn){ btn.textContent = 'Sent'; btn.classList.add('sent'); }
  });

  // Simple i18n toggle (en default)
  const strings = {
    en: {
      'nav.home': 'Home', 'nav.projects': 'Projects', 'nav.services': 'Services', 'nav.knowledge': 'Knowledge Hub', 'nav.voices': 'Voices & Experiences', 'nav.about': 'About', 'nav.contact': 'Contact',
      'cta.talk': 'Book a call', 'cta.projects': 'View projects',
      'hero.tags': 'Software · Cybersecurity · Generative AI',
      'hero.title': 'Engineering software, securing systems, and powering intelligence for a digital future.',
      'hero.sub': 'Architecture, development, and hardening for startups, fintech, and academic projects that need real technology, not just prototypes.',
      'hero.roadmap.label': 'In continuous build', 'hero.roadmap.title': 'Personal roadmap', 'hero.roadmap.updated': 'Updated: Jan 29, 2026'
    },
    es: {
      'nav.home': 'Inicio', 'nav.projects': 'Proyectos', 'nav.services': 'Servicios', 'nav.knowledge': 'Knowledge Hub', 'nav.voices': 'Voces & Experiencias', 'nav.about': 'Sobre mí', 'nav.contact': 'Contacto',
      'cta.talk': 'Agenda una llamada', 'cta.projects': 'Ver proyectos',
      'hero.tags': 'Software · Ciberseguridad · IA Generativa',
      'hero.title': 'Ingeniería de software, sistemas seguros e inteligencia para el futuro digital.',
      'hero.sub': 'Arquitectura, desarrollo y hardening para startups, fintech y proyectos académicos que necesitan tecnología real.',
      'hero.roadmap.label': 'En construcción continua', 'hero.roadmap.title': 'Roadmap personal', 'hero.roadmap.updated': 'Actualizado: 29 ene 2026'
    }
  };

  function applyLang(lang){
    const dict = strings[lang] || strings.en;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if(dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('.lang-switch button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    localStorage.setItem('lang', lang);
  }

  const savedLang = localStorage.getItem('lang') || 'en';
  applyLang(savedLang);
  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
})();
