(() => {
  const apiBase = (window.CMLAYER_API_BASE || "").replace(/\/+$/, "");
  const apiUrl = (path) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${apiBase}${normalized}`;
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

  const fetchJson = async (path) => {
    try {
      const response = await fetch(apiUrl(path), {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const setActiveLangButtons = (lang) => {
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  };

  const applyLang = (lang, dict) => {
    state.lang = lang;
    state.i18n = dict || {};
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (state.i18n[key]) {
        el.textContent = state.i18n[key];
      }
    });
    setActiveLangButtons(lang);
    localStorage.setItem("lang", lang);
  };

  const initI18n = async () => {
    const savedLang = localStorage.getItem("lang") || "en";
    const dict = await fetchJson(`/api/i18n/${savedLang}`);
    if (dict) {
      applyLang(savedLang, dict);
      return;
    }
    const fallback = await fetchJson("/api/i18n/en");
    if (fallback) {
      applyLang("en", fallback);
    }
  };

  const initLangSwitch = () => {
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const lang = btn.dataset.lang || "en";
        const dict = await fetchJson(`/api/i18n/${lang}`);
        if (dict) {
          applyLang(lang, dict);
        }
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

  const renderProjects = async () => {
    const container = document.querySelector("[data-projects]");
    if (!container) return;

    const payload = await fetchJson("/api/projects");
    const items = payload?.items || [];

    if (!items.length) {
      container.innerHTML = `<article class="case"><div><p class="muted">${escapeHtml(
        t("projects.empty", "No projects yet.")
      )}</p></div></article>`;
      return;
    }

    const cards = items
      .map((item) => {
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
              .map(
                (entry) =>
                  `<strong>${escapeHtml(entry.label)}:</strong> ${escapeHtml(entry.value)}`
              )
              .join(" · ")
          : "";
        const metaBlock = meta
          ? `<p class="tiny muted">${meta}</p>`
          : "";
        const topics = Array.isArray(item.topics)
          ? `<div class="topics">${item.topics
              .map((topic) => `<span>${escapeHtml(topic)}</span>`)
              .join("")}</div>`
          : "";
        const actions = Array.isArray(item.actions)
          ? `<div class="case-actions">${item.actions
              .map((action) => {
                const style = action.style === "primary" ? "primary" : "ghost";
                return `<a class="btn ${style}" href="${escapeHtml(
                  action.url
                )}" target="_blank" rel="noreferrer">${escapeHtml(action.label)}</a>`;
              })
              .join("")}</div>`
          : "";
        const statusNote = item.statusNote
          ? `<p class="tiny muted">${escapeHtml(item.statusNote)}</p>`
          : "";
        const image = item.image
          ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(
              item.imageAlt || item.title || ""
            )}">`
          : `<span class="muted">${escapeHtml(t("projects.noimage", "No image"))}</span>`;

        return `
          <article class="case">
            <div>
              <p class="label">${label}</p>
              <h3>${title}</h3>
              ${badge}
              <p class="muted">${description}</p>
              ${metaBlock}
              ${topics}
              ${actions}
              ${statusNote}
            </div>
            <div class="case-media">${image}</div>
          </article>
        `;
      })
      .join("");

    container.innerHTML = cards;
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
          <a class="btn ghost" href="/changelog/">${escapeHtml(
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
    const type = form.querySelector('[name="type"]')?.value?.trim() || "";
    const topic = form.querySelector('[name="topic"]')?.value?.trim() || "";
    const consent = Boolean(form.querySelector('[name="consent"]')?.checked);
    const source = form.dataset.source || window.location.pathname || "website";

    const metaLines = [];
    if (type) metaLines.push(`Type: ${type}`);
    if (topic) metaLines.push(`Topic: ${topic}`);
    if (context) metaLines.push(`Context: ${context}`);

    const baseMessage = messageField || comment || "";
    const metaBlock = metaLines.join(" · ");
    const message = metaBlock
      ? baseMessage
        ? `${metaBlock}\n\n${baseMessage}`
        : metaBlock
      : baseMessage;

    return {
      name,
      email: email || undefined,
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
          updateButton(submitBtn, t("form.sent", "Sent"), false);
          return;
        }
        if (!payload.message) {
          status.textContent = t("form.required", "Please complete required fields.");
          updateButton(submitBtn, t("form.sent", "Sent"), false);
          return;
        }

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
          form.reset();
          updateButton(submitBtn, t("form.sent", "Sent"), false);
        } catch (error) {
          status.textContent = t("form.error", "Could not send. Try again.");
          updateButton(
            submitBtn,
            submitBtn?.dataset.defaultText || t("form.sent", "Sent"),
            false
          );
        }
      });
    });

  };

  const init = async () => {
    initNav();
    initForms();
    await initI18n();
    initLangSwitch();
    await Promise.all([renderProjects(), renderServices(), renderKnowledge(), renderStatus()]);
  };

  init();
})();
