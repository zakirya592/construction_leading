(function () {
  const API = "https://construction-roan-seven.vercel.app/api/public/landing-page";
  const ORDER = [
    "header",
    "hero",
    "about",
    "visison-and-mission",
    "our-goals",
    "services",
    "landscape",
    "testimonials",
    "contact",
    "footer"
  ];

  const ICONS = {
    studio: '<svg class="info-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6.2-5.4 6.2-10.1a6.2 6.2 0 1 0-12.4 0C5.8 15.6 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10.8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    phone: '<svg class="info-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 4.7h2.2l1.1 2.9-1.5 1a11.6 11.6 0 0 0 5.4 5.4l1-1.5 2.9 1.1v2.2c0 .8-.6 1.4-1.4 1.3A14.4 14.4 0 0 1 6.9 6.1c-.1-.8.5-1.4 1.3-1.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    email: '<svg class="info-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m4.2 7.2 7.8 5.6 7.8-5.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    hours: '<svg class="info-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4.5l3 1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cleanHtml(html) {
    return String(html || "")
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/\u00a0/g, " ");
  }

  function rich(html) {
    const body = cleanHtml(html).trim();
    return body ? '<div class="rich">' + body + "</div>" : "";
  }

  function active(section) {
    return !!(section && section.isActive === true);
  }

  function textOf(html) {
    const node = document.createElement("div");
    node.innerHTML = cleanHtml(html);
    return (node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function plain(html) {
    return cleanHtml(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  const ABOUT_ICONS = [
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6.5 19.5c.8-3 2.8-4.5 5.5-4.5s4.7 1.5 5.5 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6.5v5.2c0 3.8-2.6 6.6-7 8.3-4.4-1.7-7-4.5-7-8.3V6.5L12 3.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4.5l3 1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 14H4L12 4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'
  ];

  function iconFor(type) {
    const key = String(type || "").toLowerCase();
    if (key === "phone") return ICONS.phone;
    if (key === "email") return ICONS.email;
    if (key === "hours") return ICONS.hours;
    return ICONS.studio;
  }

  function contactValue(item) {
    const value = String(item.value || "").trim();
    const type = String(item.type || "").toLowerCase();
    if (type === "email") return '<a href="mailto:' + esc(value) + '">' + esc(value) + "</a>";
    if (type === "phone") return '<a href="tel:' + esc(value.replace(/[^\d+]/g, "")) + '">' + esc(value) + "</a>";
    return esc(value);
  }

  function logoMarkup(url, label) {
    if (url) return '<img class="logo-img" src="' + esc(url) + '" alt="' + esc(label) + '">';
    const word = label.split(" ").slice(0, 2).join(" ") || "Home";
    return '<span class="logo-mark">' + esc(word.slice(0, 1)) + '</span><span class="logo-word">' + esc(word) + "</span>";
  }

  function renderHeader(section, logo, label) {
    const links = (section.items || [])
      .filter(function (item) { return item && item.label && item.link; })
      .map(function (item) {
        return '<a href="' + esc(item.link) + '">' + esc(item.label) + "</a>";
      })
      .join("");
    const button = section.button && section.button.text
      ? '<a class="btn header-cta" href="' + esc(section.button.link || "#contact") + '">' + esc(section.button.text) + "</a>"
      : "";
    return (
      '<div class="bar">' +
        '<a class="logo" href="#home" aria-label="' + esc(label) + ' home">' + logoMarkup(logo, label) + "</a>" +
        '<nav class="nav" id="site-nav" aria-label="Primary">' + links + "</nav>" +
        '<div class="header-actions">' + button +
          '<button class="menu-btn" id="menu-btn" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="site-nav"><span></span><span></span></button>' +
        "</div>" +
      "</div>"
    );
  }

  function renderHero(section) {
    const image = section.image
      ? '<div class="hero-media"><img src="' + esc(section.image) + '" alt=""></div><div class="hero-shade"></div>'
      : "";
    const button = section.button && section.button.text
      ? '<a class="btn" href="' + esc(section.button.link || "#contact") + '">' + esc(section.button.text) + ' <span aria-hidden="true">&rarr;</span></a>'
      : "";
    return (
      '<section class="hero hero-panel" id="home">' +
        image +
        '<div class="wrap hero-inner">' +
          '<div class="hero-copy">' +
            (section.subtitle ? '<p class="eyebrow"><i></i> ' + esc(section.subtitle) + "</p>" : "") +
            (section.title ? "<h1>" + esc(section.title) + "</h1>" : "") +
            rich(section.description) +
            (button ? '<div class="hero-actions">' + button + "</div>" : "") +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function renderAbout(section) {
    const items = (section.items || []).filter(function (item) {
      return item && (item.title || item.value || item.description);
    });
    const stat = items.filter(function (item) { return String(item.value || "").trim(); })[0];
    const statLabel = stat ? (plain(stat.description) || stat.title || "") : "";
    const badge = stat
      ? '<figcaption class="about-stat"><strong>' + esc(String(stat.value).trim()) + "</strong>" +
        (statLabel ? "<span>" + esc(statLabel) + "</span>" : "") + "</figcaption>"
      : "";
    const image = section.image
      ? '<figure class="about-photo reveal"><div class="about-frame"><img src="' + esc(section.image) + '" alt="' + esc(section.title || "About") + '"></div>' + badge + "</figure>"
      : "";
    const cards = items.map(function (item, index) {
      return (
        '<article class="pillar">' +
          '<span class="pillar-icon">' + ABOUT_ICONS[index % ABOUT_ICONS.length] + "</span>" +
          (item.title ? "<h3>" + esc(item.title) + "</h3>" : "") +
          (item.description ? rich(item.description) : "") +
        "</article>"
      );
    }).join("");
    return (
      '<section class="section about" id="about">' +
        '<div class="wrap about-grid">' +
          image +
          '<div class="about-copy">' +
            (section.subtitle ? '<p class="kicker reveal">' + esc(section.subtitle) + "</p>" : "") +
            (section.title ? '<h2 class="reveal">' + esc(section.title) + "</h2>" : "") +
            '<div class="reveal">' + rich(section.description) + "</div>" +
            (cards ? '<div class="pillars stagger">' + cards + "</div>" : "") +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function renderVision(section) {
    const cards = (section.items || []).map(function (item, index) {
      return (
        "<article class=\"vision-card\">" +
          '<span class="num">' + String(index + 1).padStart(2, "0") + "</span>" +
          "<h3>" + esc(item.title || "") + "</h3>" +
          rich(item.description) +
        "</article>"
      );
    }).join("");
    return (
      '<section class="section vision" id="vision">' +
        '<div class="wrap">' +
          '<div class="section-head reveal">' +
            "<div>" +
              (section.subtitle ? '<p class="kicker">' + esc(section.subtitle) + "</p>" : "") +
              (section.title ? "<h2>" + esc(section.title) + "</h2>" : "") +
            "</div>" +
            (section.description ? '<div class="lede">' + rich(section.description) + "</div>" : "") +
          "</div>" +
          '<div class="vision-grid stagger">' + cards + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function renderGoals(section) {
    const image = section.image
      ? '<figure class="goals-photo reveal"><img src="' + esc(section.image) + '" alt="' + esc(section.title || "Our goals") + '"></figure>'
      : "";
    return (
      '<section class="section goals" id="ourgoal">' +
        '<div class="wrap about-grid">' +
          '<div class="about-copy">' +
            (section.subtitle ? '<p class="kicker reveal">' + esc(section.subtitle) + "</p>" : "") +
            (section.title ? '<h2 class="reveal">' + esc(section.title) + "</h2>" : "") +
            '<div class="reveal">' + rich(section.description) + "</div>" +
          "</div>" +
          image +
        "</div>" +
      "</section>"
    );
  }

  function renderServices(section) {
    const cards = (section.items || []).map(function (item) {
      return (
        '<article class="service">' +
          '<div class="service-top"><span class="num">' + esc(item.number || "") + "</span></div>" +
          "<h3>" + esc(item.title || "") + "</h3>" +
          rich(item.description) +
          '<a class="more" href="#contact" data-service="' + esc(item.title || "") + '">Discuss this <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
        "</article>"
      );
    }).join("");
    return (
      '<section class="section services" id="services">' +
        '<div class="wrap">' +
          '<div class="section-head reveal">' +
            "<div>" +
              (section.subtitle ? '<p class="kicker">' + esc(section.subtitle) + "</p>" : '<p class="kicker">Services</p>') +
              (section.title ? "<h2>" + esc(section.title) + "</h2>" : "") +
            "</div>" +
            (section.description ? '<div class="lede">' + rich(section.description) + "</div>" : "") +
          "</div>" +
          '<div class="service-grid stagger">' + cards + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function renderLandscape(section) {
    const cards = (section.items || []).filter(function (item) { return item && item.image; }).map(function (item, index) {
      return (
        '<figure class="landscape-card">' +
          '<span class="landscape-ring"><img src="' + esc(item.image) + '" alt="' + esc(item.title || "") + '"></span>' +
          "<figcaption><span class=\"num\">" + String(index + 1).padStart(2, "0") + "</span>" +
          (item.title ? "<strong>" + esc(item.title) + "</strong>" : "") +
          "</figcaption>" +
        "</figure>"
      );
    }).join("");
    const button = section.button && section.button.text
      ? '<a class="btn" href="' + esc(section.button.link || "#contact") + '">' + esc(section.button.text) + "</a>"
      : "";
    return (
      '<section class="section landscape" id="landscape">' +
        '<div class="wrap landscape-layout">' +
          '<div class="landscape-copy reveal">' +
            (section.subtitle ? '<p class="kicker">' + esc(section.subtitle) + "</p>" : "") +
            (section.title ? "<h2>" + esc(section.title) + "</h2>" : "") +
            (section.description ? '<div class="lede">' + rich(section.description) + "</div>" : "") +
            (button ? '<div class="hero-actions">' + button + "</div>" : "") +
          "</div>" +
          (cards ? '<div class="landscape-grid stagger">' + cards + "</div>" : "") +
        "</div>" +
      "</section>"
    );
  }

  function renderClients(section) {
    const items = (section.items || []).filter(function (item) {
      return item && (item.image || item.company || item.name);
    });
    const list = items.map(function (item) {
      const name = item.company || item.name || "";
      const mark = item.image
        ? '<img class="client-mark" src="' + esc(item.image) + '" alt="">'
        : '<span class="client-mark client-fallback" aria-hidden="true">' + esc(name.slice(0, 1)) + "</span>";
      return "<li>" + mark + "<strong>" + esc(name) + "</strong></li>";
    }).join("");
    const track = list
      ? '<div class="logo-slider" aria-label="Client companies"><div class="logo-track"><ul class="logo-set">' + list + '</ul><ul class="logo-set" aria-hidden="true">' + list + "</ul></div></div>"
      : "";
    return (
      '<section class="section voices" id="client">' +
        '<div class="wrap">' +
          '<div class="section-head reveal">' +
            "<div>" +
              (section.subtitle ? '<p class="kicker">' + esc(section.subtitle) + "</p>" : '<p class="kicker">Clients</p>') +
              (section.title ? "<h2>" + esc(section.title) + "</h2>" : "") +
            "</div>" +
          "</div>" +
        "</div>" +
        track +
      "</section>"
    );
  }

  function renderContact(section, services) {
    const settings = section.settings || {};
    const items = (section.items || []).filter(function (item) { return item && item.value; });
    const info = items.map(function (item) {
      return "<li>" + iconFor(item.type) + "<div><span>" + esc(item.label || item.type || "") + "</span><p>" + contactValue(item) + "</p></div></li>";
    }).join("");
    const address = settings.address || "";
    const map = address
      ? '<div class="map-frame"><iframe title="Map showing ' + esc(address) + '" src="https://maps.google.com/maps?q=' + encodeURIComponent(address) + '&z=14&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><a class="map-link" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address) + '" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></div>'
      : "";
    const options = ((services && services.items) || [])
      .filter(function (item) { return item && item.title; })
      .map(function (item) { return "<option>" + esc(item.title) + "</option>"; })
      .join("");
    return (
      '<section class="section contact" id="contact">' +
        '<div class="wrap">' +
          '<div class="section-head reveal">' +
            "<div>" +
              '<p class="kicker">Contact</p>' +
              "<h2>" + esc(section.title || "Contact") + "</h2>" +
            "</div>" +
            (section.description ? '<div class="lede">' + rich(section.description) + "</div>" : "") +
          "</div>" +
          '<div class="contact-grid">' +
            '<div class="contact-info reveal"><ul class="info-list">' + info + "</ul>" + map + "</div>" +
            '<div class="inquiry reveal">' +
              '<p class="kicker">' + esc(settings.email || "Inquiry") + "</p>" +
              "<h3>Project Inquiry</h3>" +
              '<p class="form-note" id="form-note">Tell us about your project. We respond within one business day.</p>' +
              '<form id="inquiry-form" novalidate>' +
                '<div class="form-grid">' +
                  '<label class="field"><span>Full name</span><input type="text" name="name" autocomplete="name" required></label>' +
                  '<label class="field"><span>Email</span><input type="email" name="email" autocomplete="email" required></label>' +
                  '<label class="field"><span>Phone</span><input type="tel" name="phone" autocomplete="tel"></label>' +
                  '<label class="field"><span>Project type</span><select name="type" id="project-type"><option value="" selected>Select a type</option>' + options + "</select></label>" +
                  '<label class="field full"><span>Message</span><textarea name="message" rows="5" required></textarea></label>' +
                "</div>" +
                '<p class="form-error" id="form-error" hidden>Please add your name, a valid email, and a short note about the project.</p>' +
                '<button class="btn" type="submit">Send Inquiry <span aria-hidden="true">&rarr;</span></button>' +
              "</form>" +
              '<div class="form-success" id="form-success" hidden>' +
                '<h3>Thank you, <span id="thanks-name"></span>.</h3>' +
                '<p id="thanks-detail">We have your inquiry and will reply within one business day.</p>' +
                '<button class="btn" type="button" id="reset-form">Send another inquiry</button>' +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function renderFooter(section, logo, label) {
    const groups = [];
    const index = {};
    (section.items || []).forEach(function (item) {
      if (!item || !item.label || !item.link) return;
      const name = item.group || "Links";
      if (!index[name]) {
        index[name] = { name: name, links: [] };
        groups.push(index[name]);
      }
      index[name].links.push(item);
    });
    const columns = groups.map(function (group) {
      const links = group.links.map(function (item) {
        return '<li><a href="' + esc(item.link) + '">' + esc(item.label) + "</a></li>";
      }).join("");
      return "<div><p class=\"footer-label\">" + esc(group.name) + "</p><ul>" + links + "</ul></div>";
    }).join("");
    const copyright = (section.settings && section.settings.copyright) || "";
    return (
      '<div class="wrap footer-grid">' +
        "<div>" +
          '<a class="logo" href="#home" aria-label="' + esc(label) + ' home">' + logoMarkup(logo, label) + "</a>" +
          (section.description ? '<div class="footer-note">' + rich(section.description) + "</div>" : "") +
        "</div>" +
        columns +
      "</div>" +
      '<div class="wrap footer-base"><p>' + esc(copyright) + "</p></div>"
    );
  }

  function renderExtra(section) {
    const id = String(section.sectionKey || "section").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "section";
    const cards = (section.items || []).filter(Boolean).map(function (item) {
      const title = item.title || item.name || item.label || "";
      const meta = item.category || item.position || "";
      const body = item.description || item.message || "";
      const image = item.image
        ? '<img src="' + esc(item.image) + '" alt="' + esc(title) + '">'
        : "";
      const link = item.link
        ? '<a class="more" href="' + esc(item.link) + '">View <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>'
        : "";
      if (!title && !body && !image) return "";
      return (
        '<article class="extra-card">' +
          image +
          '<div class="extra-copy">' +
            (meta ? '<p class="tag">' + esc(meta) + "</p>" : "") +
            (title ? "<h3>" + esc(title) + "</h3>" : "") +
            (body ? rich(body) : "") +
            link +
          "</div>" +
        "</article>"
      );
    }).join("");
    const button = section.button && section.button.text
      ? '<div class="hero-actions"><a class="btn" href="' + esc(section.button.link || "#contact") + '">' + esc(section.button.text) + "</a></div>"
      : "";
    const kicker = section.subtitle || section.sectionName || "";
    if (!section.title && !section.description && !section.image && !cards && !button) return "";
    return (
      '<section class="section extra" id="' + esc(id) + '">' +
        '<div class="wrap">' +
          '<div class="section-head reveal">' +
            "<div>" +
              (kicker ? '<p class="kicker">' + esc(kicker) + "</p>" : "") +
              (section.title ? "<h2>" + esc(section.title) + "</h2>" : "") +
            "</div>" +
            (section.description ? '<div class="lede">' + rich(section.description) + "</div>" : "") +
          "</div>" +
          (section.image
            ? '<figure class="extra-hero reveal"><img src="' + esc(section.image) + '" alt="' + esc(section.title || kicker) + '"></figure>'
            : "") +
          (cards ? '<div class="extra-grid stagger">' + cards + "</div>" : "") +
          button +
        "</div>" +
      "</section>"
    );
  }

  function mount(sections) {
    const about = sections.about;
    const label = (about && about.title) || "Al Tamayuz";
    const logo = (sections.header && sections.header.settings && sections.header.settings.logo)
      || (sections.footer && sections.footer.settings && sections.footer.settings.logo)
      || "";
    const header = document.getElementById("header");
    const main = document.getElementById("main");
    const footer = document.getElementById("footer");
    const parts = [];
    const extras = Object.keys(sections)
      .filter(function (key) { return ORDER.indexOf(key) === -1 && active(sections[key]); })
      .map(function (key) { return sections[key]; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

    ORDER.forEach(function (key) {
      if (key === "contact") {
        extras.forEach(function (section) {
          const html = renderExtra(section);
          if (html) parts.push(html);
        });
      }
      const section = sections[key];
      if (!active(section)) return;
      if (key === "header") header.innerHTML = renderHeader(section, logo, label);
      else if (key === "hero") parts.push(renderHero(section));
      else if (key === "about") parts.push(renderAbout(section));
      else if (key === "visison-and-mission") parts.push(renderVision(section));
      else if (key === "our-goals") parts.push(renderGoals(section));
      else if (key === "services") parts.push(renderServices(section));
      else if (key === "landscape") parts.push(renderLandscape(section));
      else if (key === "testimonials") parts.push(renderClients(section));
      else if (key === "contact") parts.push(renderContact(section, sections.services));
      else if (key === "footer") {
        footer.hidden = false;
        footer.innerHTML = renderFooter(section, logo, label);
      }
    });

    if (!active(sections.header)) header.hidden = true;
    if (!active(sections.footer)) footer.hidden = true;
    main.innerHTML = parts.join("");

    const summary = textOf(about && about.description) || textOf(sections.hero && sections.hero.description);
    document.title = label;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && summary) meta.setAttribute("content", summary.slice(0, 180));
  }

  const loaderShownAt = Date.now();

  function hideLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;
    const wait = Math.max(0, 500 - (Date.now() - loaderShownAt));
    window.setTimeout(function () {
      loader.classList.add("is-done");
      loader.setAttribute("aria-busy", "false");
      window.setTimeout(function () { loader.remove(); }, 520);
    }, wait);
  }

  function showError() {
    const loader = document.getElementById("loader");
    if (!loader) return;
    loader.classList.add("is-error");
    loader.setAttribute("aria-busy", "false");
    loader.innerHTML =
      '<p class="loader-label">Could not load</p>' +
      '<p class="loader-note">Please check your connection and try again.</p>' +
      '<button class="btn" type="button" id="loader-retry">Try again</button>';
    document.getElementById("loader-retry").addEventListener("click", function () {
      window.location.reload();
    });
  }

  fetch(API)
    .then(function (response) {
      if (!response.ok) throw new Error("Request failed");
      return response.json();
    })
    .then(function (payload) {
      if (!payload || payload.status !== true || !Array.isArray(payload.data)) throw new Error("Unexpected response");
      const sections = {};
      payload.data.forEach(function (section) {
        if (section && section.sectionKey && active(section)) sections[section.sectionKey] = section;
      });
      mount(sections);
      hideLoader();
      if (window.initSite) window.initSite();
    })
    .catch(function () {
      showError();
      if (window.initSite) window.initSite();
    });
})();
