(function () {
  window.initSite = function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.getElementById("header");
  const nav = document.getElementById("site-nav");
  const menuBtn = document.getElementById("menu-btn");
  const heroImg = document.querySelector(".hero-media img");
  const form = document.getElementById("inquiry-form");
  const formError = document.getElementById("form-error");
  const formSuccess = document.getElementById("form-success");
  const formNote = document.getElementById("form-note");
  const thanksName = document.getElementById("thanks-name");
  const resetBtn = document.getElementById("reset-form");
  const projectType = document.getElementById("project-type");
  const progress = document.getElementById("progress");
  const toTop = document.getElementById("to-top");
  const work = document.querySelector(".work");
  const modal = document.getElementById("project-modal");
  const filterStatus = document.getElementById("filter-status");
  const thanksDetail = document.getElementById("thanks-detail");
  let lastFocus = null;

  function syncNav() {
    if (!nav) return;
    const mobile = window.innerWidth <= 980;
    const open = nav.classList.contains("open");
    if (mobile && !open) nav.setAttribute("aria-hidden", "true");
    else nav.removeAttribute("aria-hidden");
  }

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    syncNav();
  }

  syncNav();

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
      syncNav();
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") || event.target === nav) closeMenu();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (modal && !modal.hidden) closeModal();
    else closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) closeMenu();
  });

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", window.scrollY > 700);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!reduce && heroImg) {
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.25) {
          heroImg.style.animation = "none";
          heroImg.style.transform = "scale(1.08) translate3d(0, " + (y * 0.18) + "px, 0)";
        }
        ticking = false;
      });
    }, { passive: true });
  }

  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    function format(value) {
      if (decimals > 0) return value.toFixed(decimals);
      return Math.round(value).toLocaleString("en-US");
    }
    if (reduce || Number.isNaN(target)) {
      el.textContent = prefix + format(target) + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + format(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll(".hero [data-count]").forEach(animateCount);

  const motionItems = document.querySelectorAll(".reveal, .stagger");
  if (reduce || !("IntersectionObserver" in window)) {
    motionItems.forEach(function (el) {
      el.classList.add("in");
      el.querySelectorAll("[data-count]").forEach(animateCount);
    });
  } else {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        entry.target.querySelectorAll("[data-count]").forEach(animateCount);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });
    motionItems.forEach(function (el) { observer.observe(el); });
  }

  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const link = document.querySelector('.nav a[href="#' + entry.target.id + '"]');
        document.querySelectorAll(".nav a").forEach(function (a) { a.classList.remove("active"); });
        if (link) link.classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (projectType) projectType.value = link.dataset.service;
      if (modal && !modal.hidden) {
        lastFocus = null;
        closeModal();
      }
    });
  });

  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      const filter = chip.dataset.filter;
      document.querySelectorAll(".chip").forEach(function (item) {
        const on = item === chip;
        item.classList.toggle("is-on", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
      let shown = 0;
      work.querySelectorAll(".project").forEach(function (project) {
        const match = filter === "all" || project.dataset.cat === filter;
        project.hidden = !match;
        if (match) shown += 1;
      });
      work.classList.toggle("is-filtered", filter !== "all");
      filterStatus.textContent = shown + (shown === 1 ? " project" : " projects");
    });
  });

  function openProject(project) {
    const img = project.querySelector("img");
    const modalImg = document.getElementById("modal-img");
    modalImg.src = img.currentSrc || img.src;
    modalImg.alt = img.alt;
    document.getElementById("modal-tag").textContent = project.dataset.tag;
    document.getElementById("modal-title").textContent = project.dataset.title;
    document.getElementById("modal-meta").textContent = project.dataset.meta;
    document.getElementById("modal-body").textContent = project.dataset.copy;
    document.getElementById("modal-cta").dataset.service = project.dataset.service;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (work) work.addEventListener("click", function (event) {
    const project = event.target.closest(".project");
    if (project && !project.hidden) openProject(project);
  });

  if (work) work.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    const project = event.target.closest(".project");
    if (!project) return;
    event.preventDefault();
    openProject(project);
  });

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-close]")) closeModal();
    });
  }

  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) form.addEventListener("input", function (event) {
    const field = event.target.closest(".field");
    if (field) field.classList.remove("is-invalid");
  });

  if (form) form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const nameField = form.querySelector('[name="name"]').closest(".field");
    const emailField = form.querySelector('[name="email"]').closest(".field");
    const messageField = form.querySelector('[name="message"]').closest(".field");
    nameField.classList.toggle("is-invalid", !name);
    emailField.classList.toggle("is-invalid", !validEmail(email));
    messageField.classList.toggle("is-invalid", message.length < 4);
    if (!name || !validEmail(email) || message.length < 4) {
      formError.hidden = false;
      return;
    }
    formError.hidden = true;
    form.querySelectorAll(".field.is-invalid").forEach(function (field) {
      field.classList.remove("is-invalid");
    });
    const type = String(data.get("type") || "").trim();
    thanksName.textContent = name.split(" ")[0];
    thanksDetail.textContent = type
      ? "We have your " + type.toLowerCase() + " inquiry and will reply within one business day."
      : "We have your inquiry and will reply within one business day.";
    form.hidden = true;
    formNote.hidden = true;
    formSuccess.hidden = false;
  });

  if (resetBtn) resetBtn.addEventListener("click", function () {
    form.reset();
    form.hidden = false;
    formNote.hidden = false;
    formSuccess.hidden = true;
    formError.hidden = true;
    form.querySelectorAll(".field.is-invalid").forEach(function (field) {
      field.classList.remove("is-invalid");
    });
  });
  };
})();
