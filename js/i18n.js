(function () {
  var KEY = "site-lang";

  var UI = {
    en: {
      language: "Language",
      primaryNav: "Primary",
      toggleMenu: "Toggle menu",
      home: "home",
      discuss: "Discuss this",
      services: "Services",
      clients: "Clients",
      clientCompanies: "Client companies",
      view: "View",
      contact: "Contact",
      openMaps: "Open in Google Maps",
      mapTitle: "Map showing {address}",
      inquiry: "Inquiry",
      projectInquiry: "Project Inquiry",
      formNote: "Tell us about your project. We respond within one business day.",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      projectType: "Project type",
      selectType: "Select a type",
      message: "Message",
      formError: "Please add your name, a valid email, and a short note about the project.",
      sendInquiry: "Send Inquiry",
      thanksPrefix: "Thank you,",
      thanksDetail: "We have your inquiry and will reply within one business day.",
      thanksDetailType: "We have your {type} inquiry and will reply within one business day.",
      sendAnother: "Send another inquiry",
      links: "Links",
      loading: "Loading",
      couldNotLoad: "Could not load",
      loaderNote: "Please check your connection and try again.",
      tryAgain: "Try again",
      backToTop: "Back to top",
      seoSuffix: "Trading & Contracting",
      aboutAlt: "About",
      goalsAlt: "Our goals",
      offerCatalog: "Services",
      locality: "Al Khobar"
    },
    ar: {
      language: "اللغة",
      primaryNav: "التنقل الرئيسي",
      toggleMenu: "فتح القائمة",
      home: "الرئيسية",
      discuss: "ناقش هذه الخدمة",
      services: "الخدمات",
      clients: "العملاء",
      clientCompanies: "شركات العملاء",
      view: "عرض",
      contact: "تواصل معنا",
      openMaps: "افتح في خرائط جوجل",
      mapTitle: "خريطة توضح {address}",
      inquiry: "استفسار",
      projectInquiry: "استفسار عن مشروع",
      formNote: "أخبرنا عن مشروعك. نرد خلال يوم عمل واحد.",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      projectType: "نوع المشروع",
      selectType: "اختر النوع",
      message: "الرسالة",
      formError: "يرجى إضافة الاسم وبريد إلكتروني صحيح وملاحظة قصيرة عن المشروع.",
      sendInquiry: "إرسال الاستفسار",
      thanksPrefix: "شكراً لك،",
      thanksDetail: "استلمنا استفسارك وسنرد خلال يوم عمل واحد.",
      thanksDetailType: "استلمنا استفسارك بخصوص {type} وسنرد خلال يوم عمل واحد.",
      sendAnother: "إرسال استفسار آخر",
      links: "روابط",
      loading: "جارٍ التحميل",
      couldNotLoad: "تعذر التحميل",
      loaderNote: "يرجى التحقق من الاتصال والمحاولة مرة أخرى.",
      tryAgain: "حاول مرة أخرى",
      backToTop: "العودة إلى الأعلى",
      seoSuffix: "تجارة ومقاولات",
      aboutAlt: "من نحن",
      goalsAlt: "أهدافنا",
      offerCatalog: "الخدمات",
      locality: "الخبر"
    }
  };

  var CACHE_KEY = "site-tr-en-ar";
  var SEP = "\n@@\n";
  var SKIP = {
    link: 1,
    image: 1,
    imagePublicId: 1,
    logo: 1,
    logoPublicId: 1,
    mapUrl: 1,
    email: 1,
    phone: 1,
    sectionKey: 1,
    type: 1,
    number: 1,
    itemFields: 1,
    _id: 1,
    id: 1,
    createdAt: 1,
    updatedAt: 1
  };

  function plain(value) {
    return String(value || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function shouldTranslate(value) {
    var text = plain(value);
    if (text.length < 2) return false;
    if (/^https?:\/\//i.test(text)) return false;
    if (/^#[A-Za-z0-9_-]+$/.test(text)) return false;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return false;
    if (/^[+\d][\d\s().\-\u2013]{5,}$/.test(text)) return false;
    return /[A-Za-z]/.test(text);
  }

  function collect(node, bag) {
    if (Array.isArray(node)) {
      node.forEach(function (item) { collect(item, bag); });
      return;
    }
    if (!node || typeof node !== "object") return;
    Object.keys(node).forEach(function (key) {
      var value = node[key];
      if (typeof value === "string") {
        if (!SKIP[key] && shouldTranslate(value)) bag[value] = true;
      } else if (value && typeof value === "object") {
        collect(value, bag);
      }
    });
  }

  function applyMap(node, dict) {
    if (Array.isArray(node)) return node.map(function (item) { return applyMap(item, dict); });
    if (!node || typeof node !== "object") return node;
    var copy = Array.isArray(node) ? [] : {};
    Object.keys(node).forEach(function (key) {
      var value = node[key];
      if (typeof value === "string") copy[key] = !SKIP[key] && dict[value] ? dict[value] : value;
      else if (value && typeof value === "object") copy[key] = applyMap(value, dict);
      else copy[key] = value;
    });
    return copy;
  }

  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (error) { return {}; }
  }

  function writeCache(cache) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (error) {}
  }

  function fetchJson(url) {
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;
    return fetch(url, controller ? { signal: controller.signal } : undefined).then(function (response) {
      if (timer) clearTimeout(timer);
      if (!response.ok) throw new Error("translate");
      return response.json();
    }, function (error) {
      if (timer) clearTimeout(timer);
      throw error;
    });
  }

  function joinParts(data) {
    return (data && data[0] ? data[0] : []).map(function (part) { return part && part[0] ? part[0] : ""; }).join("");
  }

  function translateOne(text) {
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" + encodeURIComponent(text);
    return fetchJson(url).then(joinParts);
  }

  function translateBatch(texts) {
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" + encodeURIComponent(texts.join(SEP));
    return fetchJson(url).then(function (data) {
      var parts = joinParts(data).split("@@").map(function (part) { return part.replace(/^\s+|\s+$/g, ""); });
      if (parts.length !== texts.length) throw new Error("split");
      return parts;
    });
  }

  function chunk(texts) {
    var batches = [];
    var current = [];
    var size = 0;
    texts.forEach(function (text) {
      var length = encodeURIComponent(text).length + SEP.length;
      if (current.length && size + length > 3500) {
        batches.push(current);
        current = [];
        size = 0;
      }
      current.push(text);
      size += length;
    });
    if (current.length) batches.push(current);
    return batches;
  }

  function translateMissing(missing, cache) {
    if (!missing.length) return Promise.resolve(cache);
    var batches = chunk(missing);
    var chain = Promise.resolve();
    batches.forEach(function (batch) {
      chain = chain.then(function () {
        return translateBatch(batch).then(function (parts) {
          batch.forEach(function (text, index) {
            if (parts[index]) cache[text] = parts[index];
          });
        }).catch(function () {
          return Promise.all(batch.map(function (text) {
            return translateOne(text).then(function (out) {
              if (out) cache[text] = out;
            }).catch(function () {});
          }));
        });
      });
    });
    return chain.then(function () { return cache; });
  }

  function localize(sections) {
    if (get() !== "ar" || !sections) return Promise.resolve(sections);
    var bag = {};
    collect(sections, bag);
    var cache = readCache();
    var missing = Object.keys(bag).filter(function (text) { return !cache[text]; });
    return translateMissing(missing, cache).then(function (next) {
      writeCache(next);
      return applyMap(sections, next);
    }).catch(function () {
      return applyMap(sections, cache);
    });
  }


  function get() {
    try {
      var query = new URLSearchParams(window.location.search).get("lang");
      if (query === "ar" || query === "en") return query;
      var saved = localStorage.getItem(KEY);
      if (saved === "ar" || saved === "en") return saved;
    } catch (error) {}
    return "en";
  }

  function t(key, vars) {
    var lang = get();
    var pack = UI[lang] || UI.en;
    var text = pack[key] || UI.en[key] || key;
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, function (_, name) {
      return vars[name] == null ? "" : String(vars[name]);
    });
  }

  function applyDocument() {
    var lang = get();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }

  function set(lang) {
    if (lang !== "ar" && lang !== "en") return;
    if (lang === get()) return;
    try { localStorage.setItem(KEY, lang); } catch (error) {}
    var url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.location.assign(url.toString());
  }

  function switcher() {
    var lang = get();
    var label = lang === "ar" ? "عربي" : "EN";
    var globe = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 12h16M12 4c2.2 2.4 3.3 5.1 3.3 8s-1.1 5.6-3.3 8c-2.2-2.4-3.3-5.1-3.3-8s1.1-5.6 3.3-8z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
    var chevron = '<svg class="lang-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var check = '<svg class="lang-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 9.2 16.7 19 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    function option(code, name, value) {
      var selected = lang === value;
      return (
        '<li role="presentation">' +
          '<button class="lang-option" type="button" role="option" data-lang="' + value + '" lang="' + value + '" aria-selected="' + (selected ? "true" : "false") + '">' +
            '<span class="lang-code">' + code + "</span>" +
            '<span class="lang-name">' + name + "</span>" +
            check +
          "</button>" +
        "</li>"
      );
    }
    return (
      '<div class="lang-switch">' +
        '<button class="lang-toggle" type="button" data-current="' + lang + '" aria-haspopup="listbox" aria-expanded="false" aria-controls="lang-menu" aria-label="' + t("language") + '">' +
          globe +
          '<span class="lang-label">' + label + "</span>" +
          chevron +
        "</button>" +
        '<ul class="lang-menu" id="lang-menu" role="listbox" aria-label="' + t("language") + '" hidden>' +
          option("EN", "English", "en") +
          option("ع", "العربية", "ar") +
        "</ul>" +
      "</div>"
    );
  }

  applyDocument();
  try { localStorage.setItem(KEY, get()); } catch (error) {}

  var loaderLabel = document.querySelector(".loader-label");
  if (loaderLabel && loaderLabel.textContent.trim() === "Loading") loaderLabel.textContent = t("loading");
  var toTop = document.getElementById("to-top");
  if (toTop) toTop.setAttribute("aria-label", t("backToTop"));

  window.I18N = {
    get: get,
    set: set,
    t: t,
    localize: localize,
    switcher: switcher
  };
})();
