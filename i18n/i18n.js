<script>
(function () {
  const STORAGE_KEY = "selectedLang";
  const SUPPORTED = ["fr", "en"];
  const DEFAULT_LANG = "fr";

  const I18N = {
    current: null,

    init() {
      const saved = localStorage.getItem(STORAGE_KEY);
      const navLang = (navigator.language || "fr").slice(0,2).toLowerCase();
      const lang = this.normalize(saved || navLang || DEFAULT_LANG);
      this.setLang(lang, { apply: false });
      this.applyAll();

      // Wire automatiques : <select id="languageSelect"> ou boutons data-lang
      const select = document.getElementById("languageSelect");
      if (select) {
        select.value = this.current;
        select.addEventListener("change", () => this.setLang(select.value));
      }
      document.querySelectorAll("[data-lang]").forEach(btn => {
        btn.addEventListener("click", () => this.setLang(btn.getAttribute("data-lang")));
      });
    },

    normalize(l) {
      const s = (l || "").toLowerCase().slice(0,2);
      return SUPPORTED.includes(s) ? s : DEFAULT_LANG;
    },

    setLang(lang, opts={}) {
      const l = this.normalize(lang);
      this.current = l;
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.setAttribute("lang", l);
      if (opts.apply !== false) this.applyAll();
    },

    // t("intro.btnGuest") ou t("product.price", { amount: "400" })
    t(key, params) {
      const dict = (window.TOKOMI_TRANSLATIONS || {})[this.current] || {};
      const value = key.split(".").reduce((o,k)=> (o && o[k] != null) ? o[k] : null, dict);
      if (value == null) return key; // fallback visible en dev
      if (!params) return value;
      return value.replace(/\{(\w+)\}/g, (_, k) => (params[k] != null ? params[k] : ""));
    },

    applyAll(root=document) {
      // Texte simple
      root.querySelectorAll("[data-i18n]").forEach(el => {
        const k = el.getAttribute("data-i18n");
        el.textContent = this.t(k);
      });

      // HTML riche (innerHTML)
      root.querySelectorAll("[data-i18n-html]").forEach(el => {
        const k = el.getAttribute("data-i18n-html");
        el.innerHTML = this.t(k);
      });

      // Attributs (ex: placeholder:forms.email, aria-label:forms.search)
      root.querySelectorAll("[data-i18n-attr]").forEach(el => {
        const spec = el.getAttribute("data-i18n-attr"); // "placeholder:forms.email,aria-label:forms.email"
        spec.split(",").forEach(pair => {
          const [attr, key] = pair.split(":").map(s => s.trim());
          if (attr && key) el.setAttribute(attr, this.t(key));
        });
      });

      // <title data-i18n-title="intro.title"> (si présent)
      const titleEl = document.querySelector("title[data-i18n-title]");
      if (titleEl) {
        const k = titleEl.getAttribute("data-i18n-title");
        titleEl.textContent = this.t(k);
        document.title = titleEl.textContent;
      }

      // Sélecteur si présent
      const select = document.getElementById("languageSelect");
      if (select) select.value = this.current;
    }
  };

  // Expose globalement pour usage ponctuel: i18n.t(...)
  window.i18n = I18N;

  // Lancement après DOM prêt (et après translations.js)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => I18N.init());
  } else {
    I18N.init();
  }
})();
</script>
