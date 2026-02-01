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
      'nav.home': 'Inicio', 'nav.projects': 'Proyectos', 'nav.services': 'Servicios', 'nav.knowledge': 'Centro de Conocimiento', 'nav.voices': 'Voces y Experiencias', 'nav.about': 'Sobre', 'nav.contact': 'Contacto',
      'cta.talk': 'Agenda una llamada', 'cta.projects': 'Ver proyectos',
      'hero.tags': 'Software · Ciberseguridad · IA Generativa',
      'hero.title': 'Ingeniería de software, sistemas seguros e inteligencia para el futuro digital.',
      'hero.sub': 'Arquitectura, desarrollo y hardening para startups, fintech y proyectos académicos que necesitan tecnología real.',
      'hero.roadmap.label': 'En construcción continua', 'hero.roadmap.title': 'Roadmap personal', 'hero.roadmap.updated': 'Actualizado: 29 ene 2026'
    }
  };

  // Projects page specific strings
  strings.en['projects.hero.title'] = 'From concept to deployment';
  strings.en['projects.hero.sub'] = 'Designing, securing, and scaling real-world digital systems across software, security, and AI.';
  strings.en['projects.cta.featured'] = 'View Featured Systems';
  strings.en['projects.hero.sub2'] = 'Building systems, skills, and engineering mindset in public.';
  strings.en['projects.position.eyebrow'] = 'Engineering in Progress';
  strings.en['projects.position.title'] = 'Positioning Statement';
  strings.en['projects.position.p1'] = 'This page documents my journey as a junior software engineer building real systems with a long-term, senior-level mindset. Every project here represents learning, experimentation, and structured growth across software development, cybersecurity, and generative AI.';
  strings.en['projects.position.p2'] = 'Principle: I don’t claim mastery. I design for it.';
  strings.en['projects.position.p3'] = 'This makes clear: I’m not selling seniority, but I do build with a professional vision.';
  strings.en['projects.lanes.eyebrow'] = 'Three Lanes';
  strings.en['projects.lanes.title'] = 'Learning Domains';
  strings.en['projects.lanes.software.title'] = 'Software Systems';
  strings.en['projects.lanes.software.desc'] = 'Learning to design systems, not just write code. Focus on architecture, modularity, clean structure, and reproducible workflows.';
  strings.en['projects.lanes.secure.title'] = 'Secure Platforms';
  strings.en['projects.lanes.secure.desc'] = 'Learning to build with security from day one: auth, access control, visibility, and safe deployment as design steps.';
  strings.en['projects.lanes.ai.title'] = 'AI-Driven Solutions';
  strings.en['projects.lanes.ai.desc'] = 'Learning how AI augments systems and people: generative and automation layers for productivity and understanding.';
  strings.en['projects.featured.eyebrow'] = 'Learning Projects';
  strings.en['projects.featured.title'] = 'Active Systems';
  strings.en['projects.featured.sub'] = 'Projects as structured learning environments, not finished products.';
  strings.en['projects.cmlayer.label'] = 'Technology Learning Framework';
  strings.en['projects.cmlayer.desc'] = 'Modular environment for testing system structure, development pipelines, and service organization.';
  strings.en['projects.cmlayer.status'] = 'Status: Active Learning';
  strings.en['projects.bank.label'] = 'Secure Systems Playground';
  strings.en['projects.bank.desc'] = 'Financial-domain simulation to practice authentication, secure APIs, deployment workflows, and design patterns.';
  strings.en['projects.bank.status'] = 'Status: Experimental';
  strings.en['projects.diced.label'] = 'Business Systems Sandbox';
  strings.en['projects.diced.desc'] = 'Platform to explore digital business systems, service structuring, and web integration.';
  strings.en['projects.diced.status'] = 'Status: Experimental';
  strings.en['projects.itla.label'] = 'Academic Engineering Portfolio';
  strings.en['projects.itla.desc'] = 'Collection focused on programming patterns, data handling, APIs, and architecture fundamentals.';
  strings.en['projects.itla.status'] = 'Status: Academic';
  strings.en['projects.personal.label'] = 'Innovation & Experimentation Lab';
  strings.en['projects.personal.desc'] = 'Small prototypes to test ideas, tools, and new technologies in low-risk, high-learning settings.';
  strings.en['projects.personal.status'] = 'Status: Ongoing';
  strings.en['projects.github.eyebrow'] = 'Public Code';
  strings.en['projects.github.title'] = 'Learning in the open';
  strings.en['projects.github.sub'] = 'Direct link to active repos showing evolution through commits, refactors, experimentation.';
  strings.en['projects.github.find.title'] = 'What you’ll find';
  strings.en['projects.github.find.desc'] = 'Active repositories, languages and tools, update frequency, structure over time.';
  strings.en['projects.github.philosophy.title'] = 'Philosophy';
  strings.en['projects.github.philosophy.desc'] = 'Progress is more valuable than perfection.';
  strings.en['projects.mindset.eyebrow'] = 'Engineering Mindset';
  strings.en['projects.mindset.title'] = 'How I think about building systems';
  strings.en['projects.mindset.software.title'] = 'Software Development';
  strings.en['projects.mindset.software.desc'] = 'Every project is a system: structure, docs, and long-term improvement, even for small apps.';
  strings.en['projects.mindset.security.title'] = 'Cybersecurity';
  strings.en['projects.mindset.security.desc'] = 'Understand how systems fail: access, visibility, and control as part of responsible design.';
  strings.en['projects.mindset.ai.title'] = 'Generative AI';
  strings.en['projects.mindset.ai.desc'] = 'AI as assistant for learning, automation, and system understanding.';
  strings.en['projects.mindset.core'] = 'Core Belief: good engineers grow in public, document thinking, and improve with every iteration.';
  strings.en['projects.lifecycle.eyebrow'] = 'Learning Lifecycle';
  strings.en['projects.lifecycle.title'] = 'How I build';
  strings.en['projects.lifecycle.problem.title'] = 'Problem';
  strings.en['projects.lifecycle.problem.desc'] = 'Define what I’m trying to learn, not just build.';
  strings.en['projects.lifecycle.arch.title'] = 'Architecture';
  strings.en['projects.lifecycle.arch.desc'] = 'Sketch structure, components, and flow before code.';
  strings.en['projects.lifecycle.stack.title'] = 'Stack';
  strings.en['projects.lifecycle.stack.desc'] = 'Choose tech that teaches industry standards and best practices.';
  strings.en['projects.lifecycle.outcome.title'] = 'Outcome';
  strings.en['projects.lifecycle.outcome.desc'] = 'Working systems with docs and repos for review and improvement.';
  strings.en['projects.lifecycle.lessons.title'] = 'Lessons';
  strings.en['projects.lifecycle.lessons.desc'] = 'Reflect on mistakes, refactors, and design changes for next iteration.';
  strings.en['projects.stack.eyebrow'] = 'Tech Stack — Learning & Practice (2026)';
  strings.en['projects.stack.title'] = 'Languages & Tools';
  strings.en['projects.stack.lang.title'] = 'Languages I study and use';
  strings.en['projects.stack.lang.desc'] = 'Python · JavaScript · TypeScript · Java · C# · SQL · Go · Rust';
  strings.en['projects.stack.tools.title'] = 'Tools & platforms I practice with';
  strings.en['projects.stack.tools.desc'] = 'GitHub · VS Code · Docker · CI/CD · Linux · Cloud · API testing · Databases · AI dev tools';
  strings.en['projects.growth.eyebrow'] = 'Growth Indicators';
  strings.en['projects.growth.title'] = 'Tracking progress over time';
  strings.en['projects.growth.milestones.title'] = 'Learning milestones';
  strings.en['projects.growth.milestones.desc'] = 'Systems designed and documented; repos maintained/refactored; domains explored (software, security, AI); academic & independent projects completed.';
  strings.en['projects.final.eyebrow'] = 'Final Message';
  strings.en['projects.final.title'] = 'Building the engineer I want to become.';
  strings.en['projects.final.sub'] = 'CmLayer is my public workspace for learning, experimentation, and long-term system thinking.';
  strings.en['projects.final.contact'] = 'Contact';
  strings.en['projects.final.follow'] = 'Follow Progress';
  strings.en['projects.final.collab'] = 'Collaborate';
  strings.es['projects.hero.title'] = 'Del concepto al despliegue';
  strings.es['projects.hero.sub'] = 'Diseñando, asegurando y escalando sistemas digitales reales en software, seguridad e IA.';
  strings.es['projects.cta.featured'] = 'Ver sistemas destacados';
  strings.es['projects.hero.sub2'] = 'Construyendo sistemas, habilidades y mentalidad de ingeniería en público.';
  strings.es['projects.position.eyebrow'] = 'Ingeniería en progreso';
  strings.es['projects.position.title'] = 'Declaración de posicionamiento';
  strings.es['projects.position.p1'] = 'Esta página documenta mi camino como ingeniero de software junior construyendo sistemas reales con mentalidad de largo plazo. Cada proyecto representa aprendizaje, experimentación y crecimiento estructurado en desarrollo de software, ciberseguridad e IA generativa.';
  strings.es['projects.position.p2'] = 'Principio: no afirmo maestría. Diseño para alcanzarla.';
  strings.es['projects.position.p3'] = 'Queda claro: no vendo seniority, pero sí una visión profesional.';
  strings.es['projects.lanes.eyebrow'] = 'Tres líneas';
  strings.es['projects.lanes.title'] = 'Dominios de aprendizaje';
  strings.es['projects.lanes.software.title'] = 'Software Systems';
  strings.es['projects.lanes.software.desc'] = 'Aprender a diseñar sistemas, no solo código: arquitectura, modularidad, estructura limpia y flujos reproducibles.';
  strings.es['projects.lanes.secure.title'] = 'Secure Platforms';
  strings.es['projects.lanes.secure.desc'] = 'Aprender a construir con seguridad desde el día uno: auth, control de acceso, visibilidad y despliegue seguro.';
  strings.es['projects.lanes.ai.title'] = 'AI-Driven Solutions';
  strings.es['projects.lanes.ai.desc'] = 'Aprender cómo la IA potencia sistemas y personas: capas generativas y de automatización.';
  strings.es['projects.featured.eyebrow'] = 'Proyectos de aprendizaje';
  strings.es['projects.featured.title'] = 'Sistemas activos';
  strings.es['projects.featured.sub'] = 'Proyectos como entornos de aprendizaje estructurado, no productos terminados.';
  strings.es['projects.cmlayer.label'] = 'Marco de aprendizaje tecnológico';
  strings.es['projects.cmlayer.desc'] = 'Entorno modular para probar estructura, pipelines y organización de servicios.';
  strings.es['projects.cmlayer.status'] = 'Estatus: Aprendizaje activo';
  strings.es['projects.bank.label'] = 'Laboratorio de sistemas seguros';
  strings.es['projects.bank.desc'] = 'Simulación financiera para practicar autenticación, APIs seguras, despliegues y patrones.';
  strings.es['projects.bank.status'] = 'Estatus: Experimental';
  strings.es['projects.diced.label'] = 'Sandbox de sistemas de negocio';
  strings.es['projects.diced.desc'] = 'Plataforma para explorar sistemas de negocio, servicios y web.';
  strings.es['projects.diced.status'] = 'Estatus: Experimental';
  strings.es['projects.itla.label'] = 'Portafolio académico de ingeniería';
  strings.es['projects.itla.desc'] = 'Colección centrada en patrones, datos, APIs y fundamentos de arquitectura.';
  strings.es['projects.itla.status'] = 'Estatus: Académico';
  strings.es['projects.personal.label'] = 'Laboratorio de innovación y experimentación';
  strings.es['projects.personal.desc'] = 'Pequeños prototipos para probar ideas, herramientas y tecnologías con alto aprendizaje.';
  strings.es['projects.personal.status'] = 'Estatus: En curso';
  strings.es['projects.github.eyebrow'] = 'Código público';
  strings.es['projects.github.title'] = 'Aprendiendo en abierto';
  strings.es['projects.github.sub'] = 'Enlace directo a repos activos mostrando evolución con commits, refactors y experimentos.';
  strings.es['projects.github.find.title'] = 'Qué encontrarás';
  strings.es['projects.github.find.desc'] = 'Repos activos, lenguajes y herramientas, frecuencia de actualización, estructura en el tiempo.';
  strings.es['projects.github.philosophy.title'] = 'Filosofía';
  strings.es['projects.github.philosophy.desc'] = 'El progreso vale más que la perfección.';
  strings.es['projects.mindset.eyebrow'] = 'Mentalidad de ingeniería';
  strings.es['projects.mindset.title'] = 'Cómo pienso al construir sistemas';
  strings.es['projects.mindset.software.title'] = 'Desarrollo de software';
  strings.es['projects.mindset.software.desc'] = 'Cada proyecto es un sistema: estructura, documentación y mejora continua, incluso en apps pequeñas.';
  strings.es['projects.mindset.security.title'] = 'Ciberseguridad';
  strings.es['projects.mindset.security.desc'] = 'Entender cómo fallan los sistemas: acceso, visibilidad y control como diseño responsable.';
  strings.es['projects.mindset.ai.title'] = 'IA generativa';
  strings.es['projects.mindset.ai.desc'] = 'IA como asistente para aprender, automatizar y entender sistemas.';
  strings.es['projects.mindset.core'] = 'Creencia: los buenos ingenieros crecen en público, documentan su pensamiento y mejoran cada iteración.';
  strings.es['projects.lifecycle.eyebrow'] = 'Ciclo de aprendizaje';
  strings.es['projects.lifecycle.title'] = 'Cómo construyo';
  strings.es['projects.lifecycle.problem.title'] = 'Problema';
  strings.es['projects.lifecycle.problem.desc'] = 'Defino qué quiero aprender, no solo qué construir.';
  strings.es['projects.lifecycle.arch.title'] = 'Arquitectura';
  strings.es['projects.lifecycle.arch.desc'] = 'Dibujo estructura, componentes y flujo antes de codificar.';
  strings.es['projects.lifecycle.stack.title'] = 'Stack';
  strings.es['projects.lifecycle.stack.desc'] = 'Elijo tecnologías que enseñen estándares y buenas prácticas.';
  strings.es['projects.lifecycle.outcome.title'] = 'Resultado';
  strings.es['projects.lifecycle.outcome.desc'] = 'Sistemas funcionales con docs y repos para revisar y mejorar.';
  strings.es['projects.lifecycle.lessons.title'] = 'Lecciones';
  strings.es['projects.lifecycle.lessons.desc'] = 'Reflexiono sobre errores, refactors y cambios de diseño para la siguiente iteración.';
  strings.es['projects.stack.eyebrow'] = 'Tech Stack — Aprendizaje y práctica (2026)';
  strings.es['projects.stack.title'] = 'Lenguajes y herramientas';
  strings.es['projects.stack.lang.title'] = 'Lenguajes que estudio y uso';
  strings.es['projects.stack.lang.desc'] = 'Python · JavaScript · TypeScript · Java · C# · SQL · Go · Rust';
  strings.es['projects.stack.tools.title'] = 'Herramientas y plataformas que practico';
  strings.es['projects.stack.tools.desc'] = 'GitHub · VS Code · Docker · CI/CD · Linux · Cloud · Tests de API · Bases de datos · Herramientas de IA';
  strings.es['projects.growth.eyebrow'] = 'Indicadores de crecimiento';
  strings.es['projects.growth.title'] = 'Seguimiento del progreso en el tiempo';
  strings.es['projects.growth.milestones.title'] = 'Hitos de aprendizaje';
  strings.es['projects.growth.milestones.desc'] = 'Sistemas diseñados y documentados; repos mantenidos/refactorizados; dominios explorados (software, seguridad, IA); proyectos académicos e independientes completados.';
  strings.es['projects.final.eyebrow'] = 'Mensaje final';
  strings.es['projects.final.title'] = 'Construyendo el ingeniero que quiero ser.';
  strings.es['projects.final.sub'] = 'CmLayer es mi espacio público para aprender, experimentar y pensar sistemas a largo plazo.';
  strings.es['projects.final.contact'] = 'Contacto';
  strings.es['projects.final.follow'] = 'Seguir progreso';
  strings.es['projects.final.collab'] = 'Colaborar';

  // Services page
  strings.en['services.hero.eyebrow'] = 'CmLayer — Services';
  strings.en['services.hero.title'] = 'What I build, how I help, and how I grow systems';
  strings.en['services.hero.sub'] = 'Practical engineering services grounded in learning, structure, and long-term system thinking.';
  strings.en['services.hero.cta1'] = 'Start a Project';
  strings.en['services.hero.cta2'] = 'Explore Capabilities';
  strings.en['services.position.eyebrow'] = 'Services Positioning';
  strings.en['services.position.title'] = 'Engineering Services in Progress';
  strings.en['services.position.desc'] = 'I provide structured, transparent, and evolving technical services focused on building, securing, and improving digital systems while continuously expanding my engineering capabilities.';
  strings.en['services.domains.eyebrow'] = 'Service Domains';
  strings.en['services.domains.title'] = 'Aligned with Projects';
  strings.en['services.domains.software.title'] = 'Software Development';
  strings.en['services.domains.software.desc'] = 'Designing and building functional digital systems from concept to deployment.';
  strings.en['services.domains.software.how'] = 'How I work: clean architecture, documentation, and reproducibility over speed.';
  strings.en['services.domains.cyber.title'] = 'Cybersecurity Foundations';
  strings.en['services.domains.cyber.desc'] = 'Building safer systems through design and visibility.';
  strings.en['services.domains.cyber.how'] = 'How I work: every system is a potential attack surface; prevention is designed in.';
  strings.en['services.domains.ai.title'] = 'Generative AI & Automation';
  strings.en['services.domains.ai.desc'] = 'Using intelligence to assist systems and users.';
  strings.en['services.domains.ai.how'] = 'How I work: practical, explainable, and safe AI; no black-box shortcuts.';
  strings.en['services.models.eyebrow'] = 'Service Models';
  strings.en['services.models.title'] = 'How I work with others';
  strings.en['services.models.learning.title'] = 'Learning-Based Projects';
  strings.en['services.models.learning.desc'] = 'For academic teams, startups, and individuals who want to build while learning.';
  strings.en['services.models.learning.best'] = 'Best for: students, early-stage ideas, prototypes.';
  strings.en['services.models.proto.title'] = 'System Prototyping';
  strings.en['services.models.proto.desc'] = 'Structured development of functional systems to validate architecture, workflows, and UX.';
  strings.en['services.models.proto.best'] = 'Best for: MVPs and technical validation.';
  strings.en['services.models.support.title'] = 'Technical Support & Improvement';
  strings.en['services.models.support.desc'] = 'Helping existing systems become cleaner, safer, and more structured.';
  strings.en['services.models.support.best'] = 'Best for: refactoring, documentation, system reviews.';
  strings.en['services.delivery.eyebrow'] = 'Delivery Framework';
  strings.en['services.delivery.title'] = 'Professional junior mindset';
  strings.en['services.delivery.discover.title'] = 'Discover';
  strings.en['services.delivery.discover.desc'] = 'Understand problem, constraints, and learning objectives.';
  strings.en['services.delivery.design.title'] = 'Design';
  strings.en['services.delivery.design.desc'] = 'Sketch architecture, components, and security boundaries.';
  strings.en['services.delivery.build.title'] = 'Build';
  strings.en['services.delivery.build.desc'] = 'Develop features, structure code, and document decisions.';
  strings.en['services.delivery.review.title'] = 'Review';
  strings.en['services.delivery.review.desc'] = 'Test, refactor, improve clarity and resilience.';
  strings.en['services.delivery.evolve.title'] = 'Evolve';
  strings.en['services.delivery.evolve.desc'] = 'Iterate from feedback and new technical goals.';
  strings.en['services.tech.eyebrow'] = 'Technology Scope';
  strings.en['services.tech.title'] = 'Tools and platforms I work with';
  strings.en['services.tech.lang.title'] = 'Languages';
  strings.en['services.tech.lang.desc'] = 'Python · JavaScript · TypeScript · Java · C# · SQL';
  strings.en['services.tech.tools.title'] = 'Platforms & Tools';
  strings.en['services.tech.tools.desc'] = 'GitHub · VS Code · Docker · Linux · Cloud · API Testing · Databases · AI Tools';
  strings.en['services.transparency.eyebrow'] = 'Transparency';
  strings.en['services.transparency.title'] = 'My current level';
  strings.en['services.transparency.desc'] = 'I work as a junior engineer with a structured, growth-oriented mindset. Projects follow professional standards, documentation, and architectural thinking, even while solutions evolve.';
  strings.en['services.transparency.expect'] = 'Expect: Clear communication · Documented systems · Learning-driven improvement · Long-term technical vision.';
  strings.en['services.use.eyebrow'] = 'Use Cases';
  strings.en['services.use.title'] = 'Where these services fit';
  strings.en['services.use.academic.title'] = 'Academic Systems';
  strings.en['services.use.academic.desc'] = 'Student platforms, CRUD systems, APIs, architecture-based projects.';
  strings.en['services.use.business.title'] = 'Business Platforms';
  strings.en['services.use.business.desc'] = 'Web systems, internal tools, service-based digital platforms.';
  strings.en['services.use.ai.title'] = 'AI-Assisted Tools';
  strings.en['services.use.ai.desc'] = 'Automation scripts, learning copilots, smart interfaces.';
  strings.en['services.growth.eyebrow'] = 'Growth Roadmap';
  strings.en['services.growth.title'] = 'How services will evolve';
  strings.en['services.growth.item1'] = 'Advanced security architecture';
  strings.en['services.growth.item2'] = 'Cloud-native deployments';
  strings.en['services.growth.item3'] = 'AI-driven system intelligence';
  strings.en['services.growth.item4'] = 'Performance and scalability optimization';
  strings.en['services.growth.desc'] = 'Roadmap reflects ongoing engineering development and future service expansion.';
  strings.en['services.final.eyebrow'] = 'Call to Action';
  strings.en['services.final.title'] = 'Build, learn, and improve together';
  strings.en['services.final.sub'] = 'Whether it’s a prototype, academic system, or growing platform, CmLayer services evolve with the systems and the people behind them.';
  strings.en['services.final.contact'] = 'Contact';
  strings.en['services.final.collab'] = 'Collaborate';
  strings.en['services.final.start'] = 'Start a Project';

  strings.es['services.hero.eyebrow'] = 'CmLayer — Servicios';
  strings.es['services.hero.title'] = 'Qué construyo, cómo ayudo y cómo hago crecer sistemas';
  strings.es['services.hero.sub'] = 'Servicios de ingeniería prácticos, basados en aprendizaje, estructura y pensamiento de sistemas a largo plazo.';
  strings.es['services.hero.cta1'] = 'Iniciar un proyecto';
  strings.es['services.hero.cta2'] = 'Explorar capacidades';
  strings.es['services.position.eyebrow'] = 'Posicionamiento de servicios';
  strings.es['services.position.title'] = 'Servicios de ingeniería en progreso';
  strings.es['services.position.desc'] = 'Ofrezco servicios técnicos estructurados, transparentes y en evolución, centrados en construir, asegurar y mejorar sistemas digitales mientras expando mis capacidades de ingeniería.';
  strings.es['services.domains.eyebrow'] = 'Dominios de servicio';
  strings.es['services.domains.title'] = 'Alineados con Projects';
  strings.es['services.domains.software.title'] = 'Desarrollo de software';
  strings.es['services.domains.software.desc'] = 'Diseño y construcción de sistemas digitales funcionales desde el concepto al despliegue.';
  strings.es['services.domains.software.how'] = 'Cómo trabajo: arquitectura limpia, documentación y reproducibilidad por encima de la velocidad.';
  strings.es['services.domains.cyber.title'] = 'Fundamentos de ciberseguridad';
  strings.es['services.domains.cyber.desc'] = 'Construir sistemas más seguros mediante diseño y visibilidad.';
  strings.es['services.domains.cyber.how'] = 'Cómo trabajo: todo sistema es una superficie de ataque; la prevención se diseña desde el inicio.';
  strings.es['services.domains.ai.title'] = 'IA generativa y automatización';
  strings.es['services.domains.ai.desc'] = 'Usar inteligencia para ayudar a sistemas y usuarios.';
  strings.es['services.domains.ai.how'] = 'Cómo trabajo: IA práctica, explicable y segura; sin cajas negras.';
  strings.es['services.models.eyebrow'] = 'Modelos de servicio';
  strings.es['services.models.title'] = 'Cómo trabajo con otros';
  strings.es['services.models.learning.title'] = 'Proyectos basados en aprendizaje';
  strings.es['services.models.learning.desc'] = 'Para equipos académicos, startups e individuos que quieren construir mientras aprenden.';
  strings.es['services.models.learning.best'] = 'Ideal para: estudiantes, ideas tempranas, prototipos.';
  strings.es['services.models.proto.title'] = 'Prototipado de sistemas';
  strings.es['services.models.proto.desc'] = 'Desarrollo estructurado de sistemas funcionales para validar arquitectura, flujos y UX.';
  strings.es['services.models.proto.best'] = 'Ideal para: MVP y validación técnica.';
  strings.es['services.models.support.title'] = 'Soporte técnico y mejora';
  strings.es['services.models.support.desc'] = 'Ayudar a que sistemas existentes sean más limpios, seguros y estructurados.';
  strings.es['services.models.support.best'] = 'Ideal para: refactor, documentación, revisiones de sistema.';
  strings.es['services.delivery.eyebrow'] = 'Marco de entrega';
  strings.es['services.delivery.title'] = 'Mentalidad junior profesional';
  strings.es['services.delivery.discover.title'] = 'Descubrir';
  strings.es['services.delivery.discover.desc'] = 'Entender problema, restricciones y objetivos de aprendizaje.';
  strings.es['services.delivery.design.title'] = 'Diseñar';
  strings.es['services.delivery.design.desc'] = 'Bocetar arquitectura, componentes y límites de seguridad.';
  strings.es['services.delivery.build.title'] = 'Construir';
  strings.es['services.delivery.build.desc'] = 'Desarrollar features, estructurar código y documentar decisiones.';
  strings.es['services.delivery.review.title'] = 'Revisar';
  strings.es['services.delivery.review.desc'] = 'Probar, refactorizar, mejorar claridad y resiliencia.';
  strings.es['services.delivery.evolve.title'] = 'Evolucionar';
  strings.es['services.delivery.evolve.desc'] = 'Iterar con feedback y nuevas metas técnicas.';
  strings.es['services.tech.eyebrow'] = 'Alcance tecnológico';
  strings.es['services.tech.title'] = 'Herramientas y plataformas con las que trabajo';
  strings.es['services.tech.lang.title'] = 'Lenguajes';
  strings.es['services.tech.lang.desc'] = 'Python · JavaScript · TypeScript · Java · C# · SQL';
  strings.es['services.tech.tools.title'] = 'Plataformas y herramientas';
  strings.es['services.tech.tools.desc'] = 'GitHub · VS Code · Docker · Linux · Cloud · Tests de API · Bases de datos · Herramientas de IA';
  strings.es['services.transparency.eyebrow'] = 'Transparencia';
  strings.es['services.transparency.title'] = 'Mi nivel actual';
  strings.es['services.transparency.desc'] = 'Trabajo como ingeniero junior con mentalidad de crecimiento estructurado. Los proyectos siguen estándares profesionales, documentación y pensamiento arquitectónico, incluso mientras evolucionan.';
  strings.es['services.transparency.expect'] = 'Espera: Comunicación clara · Sistemas documentados · Mejora basada en aprendizaje · Visión técnica a largo plazo.';
  strings.es['services.use.eyebrow'] = 'Casos de uso';
  strings.es['services.use.title'] = 'Dónde encajan estos servicios';
  strings.es['services.use.academic.title'] = 'Sistemas académicos';
  strings.es['services.use.academic.desc'] = 'Plataformas estudiantiles, CRUD, APIs y proyectos basados en arquitectura.';
  strings.es['services.use.business.title'] = 'Plataformas de negocio';
  strings.es['services.use.business.desc'] = 'Sistemas web, herramientas internas y plataformas de servicios digitales.';
  strings.es['services.use.ai.title'] = 'Herramientas asistidas por IA';
  strings.es['services.use.ai.desc'] = 'Scripts de automatización, copilotos de aprendizaje, interfaces inteligentes.';
  strings.es['services.growth.eyebrow'] = 'Hoja de ruta de crecimiento';
  strings.es['services.growth.title'] = 'Cómo evolucionarán los servicios';
  strings.es['services.growth.item1'] = 'Arquitectura de seguridad avanzada';
  strings.es['services.growth.item2'] = 'Despliegues cloud-native';
  strings.es['services.growth.item3'] = 'Inteligencia de sistema impulsada por IA';
  strings.es['services.growth.item4'] = 'Optimización de performance y escalabilidad';
  strings.es['services.growth.desc'] = 'La hoja de ruta refleja el desarrollo de ingeniería en curso y la expansión futura de servicios.';
  strings.es['services.final.eyebrow'] = 'Llamado a la acción';
  strings.es['services.final.title'] = 'Construir, aprender y mejorar juntos';
  strings.es['services.final.sub'] = 'Sea prototipo, sistema académico o plataforma en crecimiento, los servicios CmLayer evolucionan con los sistemas y las personas detrás de ellos.';
  strings.es['services.final.contact'] = 'Contacto';
  strings.es['services.final.collab'] = 'Colaborar';
  strings.es['services.final.start'] = 'Iniciar un proyecto';

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

  // Active nav highlight by path
  const path = window.location.pathname.replace(/\/+$/,'');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/+$/,'');
    if (href && href !== '' && path === href) {
      a.classList.add('active');
    } else if (href === '' || href === '/') {
      if (path === '') a.classList.add('active');
    }
  });
})();
