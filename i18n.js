// i18n.js
// Lightweight i18n engine for Tokomi.
// Usage (in every page):
// <script defer src="/i18n/translations.js"></script>
// <script defer src="/i18n/i18n.js"></script>
// Mark elements with data-i18n, data-i18n-title, data-i18n-placeholder, etc.
// Optional language selector: <select id="languageSelect" onchange="changeLanguage()">

(function () {
  const DEFAULT_LANG = "fr";

  function t(dict, path) {
    return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), dict);
  }

  function applyTranslations(lang) {
    const dictAll = window.I18N || {};
    const dict = dictAll[lang] || dictAll[DEFAULT_LANG] || {};

    // Text content
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(dict, key);
      if (typeof val === "string") el.textContent = val;
    });

    // Inner HTML (optional)
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = t(dict, key);
      if (typeof val === "string") el.innerHTML = val;
    });

    // <title>
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const val = t(dict, key);
      if (typeof val === "string") document.title = val;
    });

    // Placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = t(dict, key);
      if (typeof val === "string") el.setAttribute("placeholder", val);
    });

    // Generic attribute mapping: data-i18n-attr="aria-label" + data-i18n="header.home"
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const attr = el.getAttribute("data-i18n-attr");
      const key = el.getAttribute("data-i18n");
      const val = t(dict, key);
      if (attr && typeof val === "string") el.setAttribute(attr, val);
    });

    // <html lang="...">
    if (dict.htmlLang) {
      document.documentElement.setAttribute("lang", dict.htmlLang);
    } else {
      document.documentElement.setAttribute("lang", lang);
    }

    // Sync any #languageSelect present on the page
    document.querySelectorAll("#languageSelect").forEach((sel) => (sel.value = lang));
  }

  function selectedOrDefault(defaultLang) {
    const saved = localStorage.getItem("selectedLang");
    if (saved) return saved;
    if (defaultLang) return defaultLang;
    const nav = (navigator.language || navigator.userLanguage || "fr").toLowerCase();
    return nav.startsWith("en") ? "en" : "fr";
  }

  // Expose API
  window.applyTranslations = applyTranslations;
  window.changeLanguage = function (lang) {
    const next = lang || document.getElementById("languageSelect")?.value || DEFAULT_LANG;
    localStorage.setItem("selectedLang", next);
    applyTranslations(next);
  };
  window.i18nInit = function (defaultLang) {
    const lang = selectedOrDefault(defaultLang || DEFAULT_LANG);
    localStorage.setItem("selectedLang", lang);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => applyTranslations(lang));
    } else {
      applyTranslations(lang);
    }
  };

  // Auto-init
  window.i18nInit(DEFAULT_LANG);
})();
