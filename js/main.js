(function () {
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

  function syncNav() {
    const mobile = window.innerWidth <= 980;
    const open = nav.classList.contains("open");
    if (mobile && !open) nav.setAttribute("aria-hidden", "true");
    else nav.removeAttribute("aria-hidden");
  }

  function closeMenu() {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    syncNav();
  }

  syncNav();

  menuBtn.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
    syncNav();
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a") || event.target === nav) closeMenu();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) closeMenu();
  });

  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 12);
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
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
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
      projectType.value = link.dataset.service;
    });
  });

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !validEmail(email) || message.length < 4) {
      formError.hidden = false;
      return;
    }
    formError.hidden = true;
    thanksName.textContent = name.split(" ")[0];
    form.hidden = true;
    formNote.hidden = true;
    formSuccess.hidden = false;
  });

  resetBtn.addEventListener("click", function () {
    form.reset();
    form.hidden = false;
    formNote.hidden = false;
    formSuccess.hidden = true;
    formError.hidden = true;
  });
})();
