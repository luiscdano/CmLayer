(() => {
  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  // Projects from GitHub + curated fallbacks
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  const username = 'luiscdano';

  const curated = [
    { name: 'CmLayer', description: 'Plataforma base para software, IA, automatización y ciberseguridad.', html_url: 'https://github.com/luiscdano/CmLayer', topics: ['portfolio', 'platform', 'security'], language: 'HTML' },
    { name: 'GrupoDiCed', description: 'Ecosistema empresarial para ingeniería digital y soluciones inteligentes.', html_url: 'https://github.com/luiscdano/GrupoDiCed', topics: ['architecture', 'cloud', 'api'], language: 'TypeScript' },
    { name: 'Proyectos-ITLA', description: 'Portafolio académico y técnico con prácticas de arquitectura y APIs.', html_url: 'https://github.com/luiscdano/Proyectos-ITLA', topics: ['academic', 'api', 'web'], language: 'C#' },
    { name: 'PersonalProjects', description: 'Laboratorio de innovación: APIs, distribuidos, DevOps e IA.', html_url: 'https://github.com/luiscdano/PersonalProjects', topics: ['lab', 'devops', 'ai'], language: 'Python' },
    { name: 'LoggerMantenimientoApp', description: 'Sistema de mantenimiento con arquitectura por capas y patrón Singleton.', html_url: 'https://github.com/luiscdano/LoggerMantenimientoApp', topics: ['maintenance', 'architecture'], language: 'C#' },
    { name: 'MascotasAPI', description: 'API RESTful con frontend JS y documentación OpenAPI/Swagger.', html_url: 'https://github.com/luiscdano/MascotasAPI', topics: ['rest', 'swagger', 'frontend'], language: 'C#' },
    { name: 'ColeccionDePeliculas', description: 'Plataforma ASP.NET + JS con CRUD y base relacional.', html_url: 'https://github.com/luiscdano/ColeccionDePeliculas', topics: ['aspnet', 'crud', 'db'], language: 'C#' },
    { name: 'Total_Asignaciones', description: 'Portafolio web de proyectos frontend/backend y prácticas académicas.', html_url: 'https://github.com/luiscdano/Total_Asignaciones', topics: ['web', 'portfolio'], language: 'JavaScript' }
  ];

  const renderProjects = list => {
    projectsGrid.innerHTML = '';
    if (!list.length) {
      projectsGrid.innerHTML = '<p class="muted">No pude cargar proyectos ahora. Vuelve a intentar.</p>';
      return;
    }
    list.forEach(repo => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p class="muted">${repo.description || 'Repositorio sin descripción'}</p>
        <div class="topics">${(repo.topics || []).slice(0, 4).map(t => `<span>${t}</span>`).join('')}</div>
        <div class="stats">
          <span>★ ${repo.stargazers_count || 0}</span>
          ${repo.language ? `<span>${repo.language}</span>` : ''}
        </div>
        <a class="btn ghost" href="${repo.html_url}" target="_blank" rel="noreferrer">Ver en GitHub</a>
      `;
      projectsGrid.appendChild(card);
    });
  };

  // Try to load from GitHub API
  const endpoint = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
  fetch(endpoint, { headers: { 'Accept': 'application/vnd.github+json' } })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(repos => {
      const repoMap = new Map();
      repos.forEach(r => repoMap.set(r.name.toLowerCase(), {
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        topics: r.topics || [],
        stargazers_count: r.stargazers_count,
        language: r.language
      }));
      const merged = curated.map(c => {
        const found = repoMap.get(c.name.toLowerCase());
        return found ? { ...c, ...found } : c;
      });
      renderProjects(merged);
    })
    .catch(() => renderProjects(curated));
})();
