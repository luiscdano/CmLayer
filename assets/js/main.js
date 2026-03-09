(() => {
  const apiBase = (window.CMLAYER_API_BASE || "").replace(/\/+$/, "");
  const apiUrl = (path) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${apiBase}${normalized}`;
  };

  const getLocalFallbackPath = (path) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const i18nMatch = normalized.match(/^\/api\/i18n\/(es|en)$/);
    if (i18nMatch) {
      return `/data/i18n/${i18nMatch[1]}.json`;
    }
    return "";
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const state = {
    lang: "en",
    i18n: {}
  };

  const t = (key, fallback) => state.i18n[key] || fallback || "";
  const trackEvent = (name, params = {}) => {
    if (typeof window.cmlayerTrack === "function") {
      window.cmlayerTrack(name, params);
    }
  };

  const fetchJson = async (path) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const fallbackPath = getLocalFallbackPath(normalized);
    const candidates = [apiUrl(normalized)];
    if (fallbackPath) {
      candidates.push(fallbackPath);
    }

    for (const endpoint of candidates) {
      try {
        const response = await fetch(endpoint, {
          headers: { Accept: "application/json" }
        });
        if (!response.ok) {
          continue;
        }
        return await response.json();
      } catch (error) {
        continue;
      }
    }

    return null;
  };

  const setActiveLangButtons = (lang) => {
    document.querySelectorAll(".lang-switch [data-lang]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  };

  const applyLang = (lang, dict) => {
    state.lang = lang;
    state.i18n = dict || {};
    document.documentElement.lang = lang;
    document.body?.setAttribute("data-lang", lang);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (state.i18n[key]) {
        el.textContent = state.i18n[key];
      }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (state.i18n[key]) {
        el.setAttribute("placeholder", state.i18n[key]);
      }
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (state.i18n[key]) {
        el.setAttribute("aria-label", state.i18n[key]);
      }
    });
    setActiveLangButtons(lang);
    localStorage.setItem("lang", lang);
  };

  const initI18n = async () => {
    const defaultLang = "es";
    const savedLang = localStorage.getItem("lang") || defaultLang;
    const candidates = [...new Set([savedLang, defaultLang, "en"])];

    for (const lang of candidates) {
      const dict = await fetchJson(`/api/i18n/${lang}`);
      if (dict) {
        applyLang(lang, dict);
        return;
      }
    }
  };

  const initLangSwitch = () => {
    document.querySelectorAll(".lang-switch").forEach((switcher) => {
      const trigger = switcher.querySelector(".lang-world");
      const langButtons = Array.from(switcher.querySelectorAll("[data-lang]"));
      if (!langButtons.length) return;

      const closeOptions = () => {
        switcher.classList.remove("open");
        if (trigger) {
          trigger.setAttribute("aria-expanded", "false");
        }
      };

      if (trigger) {
        trigger.addEventListener("click", (event) => {
          event.stopPropagation();
          const nextState = !switcher.classList.contains("open");
          switcher.classList.toggle("open", nextState);
          trigger.setAttribute("aria-expanded", nextState ? "true" : "false");
        });

        document.addEventListener("click", (event) => {
          if (!switcher.contains(event.target)) {
            closeOptions();
          }
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            closeOptions();
          }
        });
      }

      langButtons.forEach((btn) => {
        btn.addEventListener("click", async (event) => {
          event.stopPropagation();
          const lang = btn.dataset.lang || "es";
          const dict = await fetchJson(`/api/i18n/${lang}`);
          if (dict) {
            applyLang(lang, dict);
            await refreshDynamicSections();
            closeOptions();
          }
        });
      });
    });
  };

  const formatUptime = (seconds) => {
    if (!Number.isFinite(seconds)) return "—";
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${mins % 60}m`;
    if (mins > 0) return `${mins}m`;
    return `${seconds}s`;
  };

  const formatTimestamp = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value || "—";
    return date.toLocaleString();
  };

  const getProjectMetaValue = (item, keyFragment) => {
    if (!Array.isArray(item?.meta)) return "";
    const key = String(keyFragment || "").toLowerCase();
    const found = item.meta.find((entry) =>
      String(entry?.label || "").toLowerCase().includes(key)
    );
    return found?.value ? String(found.value) : "";
  };

  const createProjectActionSet = (item) => {
    const sourceActions = Array.isArray(item?.actions) ? item.actions : [];
    const repository = sourceActions.find((action) =>
      /repo/i.test(String(action?.label || ""))
    );
    const nonRepo = sourceActions.filter(
      (action) => !/repo/i.test(String(action?.label || ""))
    );
    const view =
      nonRepo.find(
        (action) =>
          action?.style === "primary" ||
          /(site|web|demo|project|view|ver)/i.test(String(action?.label || ""))
      ) || nonRepo[0];

    const actions = [];
    if (view?.url) {
      actions.push({
        type: "view",
        style: "primary",
        label: t("projects.card.action.view", "Ver proyecto"),
        url: view.url
      });
    }
    actions.push({
      type: "architecture",
      style: "ghost",
      label: t("projects.card.action.arch", "Arquitectura"),
      url: "#project-blueprint"
    });
    if (repository?.url) {
      actions.push({
        type: "repository",
        style: "ghost",
        label: t("projects.card.action.repo", "Repositorio"),
        url: repository.url
      });
    }
    return actions;
  };

  const buildProjectDiagram = (item) => {
    const projectName = escapeHtml(item?.title || t("projects.blueprint.project", "Proyecto"));
    return `
      <p class="diagram-project">${projectName}</p>
      <div class="diagram-layers">
        <div class="diagram-node">${escapeHtml(t("projects.blueprint.diagram.client", "Cliente"))}</div>
        <div class="diagram-arrow">→</div>
        <div class="diagram-node">${escapeHtml(t("projects.blueprint.diagram.api", "API / Servicios"))}</div>
        <div class="diagram-arrow">→</div>
        <div class="diagram-node">${escapeHtml(t("projects.blueprint.diagram.data", "Datos / Observabilidad"))}</div>
      </div>
    `;
  };

  const renderProjectBlueprint = (item) => {
    const root = document.querySelector("[data-project-blueprint]");
    if (!root || !item) return;

    const titleEl = root.querySelector("[data-blueprint-name]");
    const descriptionEl = root.querySelector("[data-blueprint-description]");
    const statusEl = root.querySelector("[data-blueprint-status]");
    const architectureEl = root.querySelector("[data-blueprint-architecture]");
    const techEl = root.querySelector("[data-blueprint-technologies]");
    const featuresEl = root.querySelector("[data-blueprint-features]");
    const challengesEl = root.querySelector("[data-blueprint-challenges]");
    const diagramEl = root.querySelector("[data-blueprint-diagram]");

    const statusValue = getProjectMetaValue(item, "status");
    const problemValue = getProjectMetaValue(item, "problem");
    const architectureValue =
      getProjectMetaValue(item, "architecture") ||
      getProjectMetaValue(item, "outcome") ||
      t(
        "projects.blueprint.arch.fallback",
        "Arquitectura modular por capas con enfoque en seguridad, trazabilidad y escalabilidad."
      );
    const outcomeValue = getProjectMetaValue(item, "outcome");

    const technologies =
      Array.isArray(item.techStack) && item.techStack.length
        ? item.techStack
        : Array.isArray(item.topics) && item.topics.length
          ? item.topics
          : [t("projects.blueprint.tech.fallback", "Stack en definición")];
    const features =
      Array.isArray(item.features) && item.features.length
        ? item.features
        : Array.isArray(item.topics) && item.topics.length
          ? item.topics.slice(0, 4).map((topic) => `${t("projects.blueprint.feature.prefix", "Capa")}: ${topic}`)
          : [t("projects.blueprint.features.fallback", "Funcionalidades en documentación")];
    const challenges =
      Array.isArray(item.challenges) && item.challenges.length
        ? item.challenges
        : [
            problemValue ||
              t(
                "projects.blueprint.challenges.fallback",
                "Definir alcance técnico, riesgos y controles de implementación."
              ),
            outcomeValue
              ? `${t("projects.blueprint.challenges.outcome", "Resultado actual")}: ${outcomeValue}`
              : ""
          ].filter(Boolean);

    if (titleEl) titleEl.textContent = item.title || t("projects.blueprint.project", "Proyecto");
    if (descriptionEl) {
      descriptionEl.textContent =
        item.description || t("projects.blueprint.description.fallback", "Descripción técnica en proceso.");
    }
    if (statusEl) {
      statusEl.textContent = statusValue
        ? `${t("projects.blueprint.status", "Estado")}: ${statusValue}`
        : t("projects.blueprint.status.default", "Estado: Activo");
    }
    if (architectureEl) architectureEl.textContent = architectureValue;
    if (diagramEl) diagramEl.innerHTML = buildProjectDiagram(item);
    if (techEl) {
      techEl.innerHTML = technologies
        .map((technology) => `<li>${escapeHtml(technology)}</li>`)
        .join("");
    }
    if (featuresEl) {
      featuresEl.innerHTML = features
        .map((feature) => `<li>${escapeHtml(feature)}</li>`)
        .join("");
    }
    if (challengesEl) {
      challengesEl.innerHTML = challenges
        .map((challenge) => `<li>${escapeHtml(challenge)}</li>`)
        .join("");
    }
  };

  const initProjectBlueprint = (container, items) => {
    const root = document.querySelector("[data-project-blueprint]");
    if (!root || !container || !Array.isArray(items) || !items.length) return;

    const byId = new Map(
      items.map((item, index) => [
        String(item?.id || `project-${index + 1}`),
        item
      ])
    );

    const setActiveCard = (projectId) => {
      container.querySelectorAll(".project-card").forEach((card) => {
        card.classList.toggle("active", card.dataset.projectId === projectId);
      });
    };

    const selectProject = (projectId, updateUrl = false) => {
      const selected = byId.get(String(projectId)) || items[0];
      if (!selected) return;
      const selectedId = String(selected?.id || "");

      renderProjectBlueprint(selected);
      setActiveCard(selectedId);

      if (updateUrl && selectedId) {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("focus", selectedId);
        window.history.replaceState(
          {},
          "",
          `${nextUrl.pathname}?${nextUrl.searchParams.toString()}#project-blueprint`
        );
      }
    };

    container.querySelectorAll("[data-project-architecture]").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        const projectId = trigger.getAttribute("data-project-architecture");
        selectProject(projectId, true);
        document
          .getElementById("project-blueprint")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    const requestedFocus = new URLSearchParams(window.location.search).get("focus");
    const initialId = requestedFocus && byId.has(requestedFocus)
      ? requestedFocus
      : String(items[0]?.id || `project-1`);
    selectProject(initialId, false);
  };

  const renderProjects = async () => {
    const container = document.querySelector("[data-projects]");
    if (!container) return;

    const payload = await fetchJson("/api/projects");
    const items = payload?.items || [];

    if (!items.length) {
      container.innerHTML = `<article class="case project-card"><div><p class="muted">${escapeHtml(
        t("projects.empty", "No projects yet.")
      )}</p></div></article>`;
      return;
    }

    const cards = items
      .map((item, index) => {
        const projectId = String(item?.id || `project-${index + 1}`);
        const label = escapeHtml(item.label || "");
        const title = escapeHtml(item.title || "");
        const description = escapeHtml(item.description || "");
        const badge = item.badge
          ? `<span class="badge ${escapeHtml(item.badge.variant || "")}">${escapeHtml(
              item.badge.text
            )}</span>`
          : "";
        const meta = Array.isArray(item.meta)
          ? item.meta
              .slice(0, 2)
              .map(
                (entry) =>
                  `<strong>${escapeHtml(entry.label)}:</strong> ${escapeHtml(entry.value)}`
              )
              .join(" · ")
          : "";
        const metaBlock = meta
          ? `<p class="project-meta-line">${meta}</p>`
          : "";
        const topics = Array.isArray(item.topics) && item.topics.length
          ? `<div class="project-stack">${item.topics
              .map((topic) => `<span>${escapeHtml(topic)}</span>`)
              .join("")}</div>`
          : "";
        const actionSet = createProjectActionSet(item);
        const actions = actionSet.length
          ? `<div class="project-actions">${actionSet
              .map((action) => {
                if (action.type === "architecture") {
                  return `<a class="btn ghost" href="#project-blueprint" data-project-architecture="${escapeHtml(
                    projectId
                  )}">${escapeHtml(action.label)}</a>`;
                }
                const style = action.style === "primary" ? "primary" : "ghost";
                const target = /^https?:\/\//i.test(action.url || "")
                  ? ` target="_blank" rel="noreferrer"`
                  : "";
                return `<a class="btn ${style}" href="${escapeHtml(
                  action.url
                )}"${target}>${escapeHtml(action.label)}</a>`;
              })
              .join("")}</div>`
          : "";
        const statusNote = item.statusNote
          ? `<p class="project-meta-line">${escapeHtml(item.statusNote)}</p>`
          : "";

        return `
          <article class="case project-card" data-project-id="${escapeHtml(
            projectId
          )}" style="--card-index:${index}">
            <div>
              <p class="project-label">${label}</p>
              <h3>${title}</h3>
              ${badge}
              <p class="project-description">${description}</p>
              ${metaBlock}
              ${topics}
              ${actions}
              ${statusNote}
            </div>
          </article>
        `;
      })
      .join("");

    container.innerHTML = cards;
    initProjectBlueprint(container, items);
  };

  const renderServices = async () => {
    const container = document.querySelector("[data-services]");
    if (!container) return;

    const payload = await fetchJson("/api/services");
    const items = payload?.items || [];

    if (!items.length) {
      container.innerHTML = `<article class="service-card"><p class="muted">${escapeHtml(
        t("services.empty", "No services yet.")
      )}</p></article>`;
      return;
    }

    container.innerHTML = items
      .map((item) => {
        const bullets = Array.isArray(item.bullets)
          ? `<ul>${item.bullets
              .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
              .join("")}</ul>`
          : "";
        const how = item.how
          ? `<p class="muted">${escapeHtml(item.how)}</p>`
          : "";

        return `
          <article class="service-card">
            <h3>${escapeHtml(item.title || "")}</h3>
            <p class="muted">${escapeHtml(item.description || "")}</p>
            ${bullets}
            ${how}
          </article>
        `;
      })
      .join("");
  };

  const renderKnowledge = async () => {
    const container = document.querySelector("[data-knowledge]");
    if (!container) return;

    const payload = await fetchJson("/api/knowledge");
    const items = payload?.items || [];

    if (!items.length) {
      container.innerHTML = `<article class="cover-card"><p class="muted">${escapeHtml(
        t("kh.empty", "No knowledge items yet.")
      )}</p></article>`;
      return;
    }

    const categoryLabel = t("kh.library.category.label", "Category");

    container.innerHTML = items
      .map((item) => {
        const cover = item.coverImage
          ? `<img class="cover-img" src="${escapeHtml(
              item.coverImage
            )}" alt="${escapeHtml(item.coverAlt || item.title || "")}" loading="lazy" />`
          : `<div class="cover"><div class="cover-meta">${escapeHtml(
              item.category || ""
            )}</div><div class="cover-title">${escapeHtml(
              item.title || ""
            )}</div><div class="cover-brand">CmLayer</div></div>`;

        return `
          <article class="cover-card">
            ${cover}
            <h3>${escapeHtml(item.title || "")}</h3>
            <p class="muted">${escapeHtml(categoryLabel)}: ${escapeHtml(
          item.category || ""
        )}</p>
            <p class="tiny">${escapeHtml(item.summary || "")}</p>
            <p class="tiny">${escapeHtml(item.comment || "")}</p>
            <p class="tiny">${escapeHtml(item.project || "")}</p>
            <div class="case-actions">
              <a class="btn primary" href="${escapeHtml(
                item.link
              )}">${escapeHtml(item.linkLabel || "Explore")}</a>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const renderVoices = async () => {
    const containers = document.querySelectorAll("[data-voices]");
    if (!containers.length) return;

    const payload = await fetchJson("/api/voices");
    const items = payload?.items || [];

    const html = items.length
      ? items
          .map((item) => {
            const name = escapeHtml(item.name || t("voices.anonymous", "Anonymous"));
            const context = item.context
              ? ` · ${escapeHtml(item.context)}`
              : "";
            const message = escapeHtml(item.message || "");
            return `
              <figure class="testimonial">
                <blockquote>${message}</blockquote>
                <cite>— ${name}${context}</cite>
              </figure>
            `;
          })
          .join("")
      : `<p class="muted">${escapeHtml(t("voices.empty", "No voices yet."))}</p>`;

    containers.forEach((container) => {
      container.innerHTML = html;
    });
  };

  const renderStatus = async () => {
    const metrics = document.querySelector("[data-status-metrics]");
    const release = document.querySelector("[data-status-release]");
    if (!metrics && !release) return;

    const payload = await fetchJson("/api/status");
    if (!payload) {
      if (metrics) {
        metrics.innerHTML = `<article class="value-card"><p class="muted">${escapeHtml(
          t("status.error", "Status unavailable.")
        )}</p></article>`;
      }
      if (release) {
        release.innerHTML = `<p class="muted">${escapeHtml(
          t("status.release.empty", "No releases yet.")
        )}</p>`;
      }
      return;
    }

    const health = payload.health || {};
    const ok = Boolean(health.ok);

    if (metrics) {
      const badgeClass = ok ? "production" : "pilot";
      metrics.innerHTML = [
        `<article class="value-card"><h3>${escapeHtml(
          t("status.metrics.state", "State")
        )}</h3><p class="muted"><span class="badge ${badgeClass}">${escapeHtml(
          ok ? t("status.ok", "Operational") : t("status.down", "Degraded")
        )}</span></p></article>`,
        `<article class="value-card"><h3>${escapeHtml(
          t("status.metrics.updated", "Last check")
        )}</h3><p class="muted">${escapeHtml(
          formatTimestamp(health.timestamp)
        )}</p></article>`,
        `<article class="value-card"><h3>${escapeHtml(
          t("status.metrics.uptime", "Uptime")
        )}</h3><p class="muted">${escapeHtml(
          formatUptime(health.uptimeSeconds)
        )}</p></article>`
      ].join("");
    }

    if (release) {
      if (payload.latestRelease) {
        const latest = payload.latestRelease;
        const title = escapeHtml(latest.title || t("status.release.title", "Latest release"));
        const summary = escapeHtml(latest.summary || "");
        const date = escapeHtml(latest.date || "");
        release.innerHTML = `
          <h3>${title}</h3>
          <p class="muted">${summary}</p>
          <p class="tiny muted">${escapeHtml(t("status.release.date", "Date"))}: ${date}</p>
          <a class="btn ghost" href="/voices-experiences/changelog/">${escapeHtml(
            t("status.release.link", "View changelog")
          )}</a>
        `;
      } else {
        release.innerHTML = `<p class="muted">${escapeHtml(
          t("status.release.empty", "No releases yet.")
        )}</p>`;
      }
    }
  };

  const refreshDynamicSections = async () =>
    Promise.all([
      renderProjects(),
      renderServices(),
      renderKnowledge(),
      renderStatus(),
      renderVoices()
    ]);

  const initNav = () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    navToggle?.addEventListener("click", () => navLinks?.classList.toggle("open"));
    navLinks?.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );

    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = a.getAttribute("href").replace(/\/+$/, "");
      if (href && href !== "" && path === href) {
        a.classList.add("active");
      } else if (href === "" || href === "/") {
        if (path === "/") a.classList.add("active");
      }
    });
  };

  const initTracking = () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      if (!link.classList.contains("btn") && link.dataset.track !== "true") return;

      const href = link.getAttribute("href") || "";
      const label = link.dataset.trackLabel || link.textContent?.trim() || "CTA";
      const isExternal =
        /^https?:\/\//i.test(href) && !href.includes(window.location.host);

      trackEvent(isExternal ? "outbound_click" : "cta_click", {
        label,
        href,
        location: window.location.pathname
      });
    });
  };

  const ensureFormStatus = (form) => {
    let status = form.querySelector("[data-form-status]");
    if (!status) {
      status = document.createElement("p");
      status.className = "tiny muted form-status";
      status.setAttribute("data-form-status", "");
      form.appendChild(status);
    }
    return status;
  };

  const updateButton = (button, label, disabled) => {
    if (!button) return;
    if (!button.dataset.defaultText) {
      button.dataset.defaultText = button.textContent || "";
    }
    button.textContent = label;
    button.disabled = Boolean(disabled);
  };

  const buildFeedbackPayload = (form) => {
    const name = form.querySelector('[name="name"]')?.value?.trim() || "";
    const email = form.querySelector('[name="email"]')?.value?.trim() || "";
    const messageField = form.querySelector('[name="message"]')?.value?.trim() || "";
    const context = form.querySelector('[name="context"]')?.value?.trim() || "";
    const comment = form.querySelector('[name="comment"]')?.value?.trim() || "";
    const budget = form.querySelector('[name="budget"]')?.value?.trim() || "";
    const timeline = form.querySelector('[name="timeline"]')?.value?.trim() || "";
    const type = form.querySelector('[name="type"]')?.value?.trim() || "";
    const topic = form.querySelector('[name="topic"]')?.value?.trim() || "";
    const consent = Boolean(form.querySelector('[name="consent"]')?.checked);
    const source = form.dataset.source || window.location.pathname || "website";

    const message = messageField || comment || "";

    return {
      name,
      email: email || undefined,
      type: type || undefined,
      topic: topic || undefined,
      context: context || undefined,
      budget: budget || undefined,
      timeline: timeline || undefined,
      message,
      consent,
      source
    };
  };

  const initForms = () => {
    document.querySelectorAll("[data-feedback-form]").forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = ensureFormStatus(form);
        const submitBtn = form.querySelector("button[type=\"submit\"]");
        status.textContent = "";

        const payload = buildFeedbackPayload(form);
        if (!payload.consent) {
          status.textContent = t("form.consent", "Consent is required.");
          trackEvent("form_error", { reason: "consent", source: payload.source });
          updateButton(submitBtn, t("form.sent", "Sent"), false);
          return;
        }
        if (!payload.message) {
          status.textContent = t("form.required", "Please complete required fields.");
          trackEvent("form_error", { reason: "required", source: payload.source });
          updateButton(submitBtn, t("form.sent", "Sent"), false);
          return;
        }

        trackEvent("form_submit", {
          source: payload.source,
          type: payload.type,
          topic: payload.topic
        });

        updateButton(submitBtn, t("form.sending", "Sending..."), true);

        try {
          const response = await fetch(apiUrl("/api/feedback"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
          }
          status.textContent = t("form.success", "Thanks! Feedback received.");
          trackEvent("form_success", {
            source: payload.source,
            type: payload.type,
            topic: payload.topic
          });
          form.reset();
          updateButton(submitBtn, t("form.sent", "Sent"), false);
        } catch (error) {
          status.textContent = t("form.error", "Could not send. Try again.");
          trackEvent("form_error", { reason: "network", source: payload.source });
          updateButton(
            submitBtn,
            submitBtn?.dataset.defaultText || t("form.sent", "Sent"),
            false
          );
        }
      });
    });

  };

  const initProjectMorePanels = () => {
    const buttons = Array.from(
      document.querySelectorAll("[data-project-more-target]")
    );
    if (!buttons.length) return;

    const closeAllPanels = () => {
      buttons.forEach((button) => {
        const panelId = button.dataset.projectMoreTarget;
        const panel = panelId ? document.getElementById(panelId) : null;
        if (panel) {
          panel.hidden = true;
          panel.setAttribute("aria-hidden", "true");
        }
        button.setAttribute("aria-expanded", "false");
        button.classList.remove("active");
      });
      document.body.classList.remove("projects-more-open");
    };

    const openButtonPanel = (button) => {
      const panelId = button.dataset.projectMoreTarget;
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;
      closeAllPanels();
      panel.hidden = false;
      panel.setAttribute("aria-hidden", "false");
      button.setAttribute("aria-expanded", "true");
      button.classList.add("active");
      document.body.classList.add("projects-more-open");
    };

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openButtonPanel(button);
      });
    });

    buttons.forEach((button) => {
      const panelId = button.dataset.projectMoreTarget;
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;
      panel.addEventListener("click", (event) => {
        const content = panel.querySelector(".projects-more-panel-inner");
        if (!content || !content.contains(event.target)) {
          closeAllPanels();
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAllPanels();
      }
    });
  };

  const init = async () => {
    initNav();
    initTracking();
    initForms();
    initProjectMorePanels();
    await initI18n();
    initLangSwitch();
    await refreshDynamicSections();
  };

  init();
})();
