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
    {
      name: 'QR-Generator',
      description: 'Generador de códigos QR ligero con UI minimalista, listo para publicar en web.',
      html_url: 'https://github.com/luiscdano/QR-Generator',
      topics: ['frontend', 'utility', 'javascript'],
      stargazers_count: 0,
      language: 'JavaScript'
    },
    {
      name: 'CmLayer',
      description: 'Este sitio: portafolio personal, IA y seguridad.',
      html_url: 'https://github.com/luiscdano/CmLayer',
      topics: ['portfolio', 'static-site'],
      stargazers_count: 0,
      language: 'HTML'
    }
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
  const endpoint = `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`;
  fetch(endpoint, { headers: { 'Accept': 'application/vnd.github+json' } })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(repos => {
      const cleaned = repos.map(r => ({
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        topics: r.topics || [],
        stargazers_count: r.stargazers_count,
        language: r.language
      }));
      const merged = [...curated];
      cleaned.forEach(r => {
        if (!merged.find(c => c.name.toLowerCase() === r.name.toLowerCase())) {
          merged.push(r);
        }
      });
      renderProjects(merged.slice(0, 8));
    })
    .catch(() => renderProjects(curated));
})();
