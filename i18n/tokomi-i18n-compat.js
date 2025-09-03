/*!
 * Tokomi i18n compatibility wrapper
 * Expose une API uniforme par-dessus ton moteur existant (translations.js + i18n.js).
 * Charge cet ordre de scripts dans chaque page :
 *   <script defer src="/i18n/translations.js"></script>
 *   <script defer src="/i18n/i18n.js"></script>
 *   <script defer src="/i18n/tokomi-i18n-compat.js"></script>
 */
(function () {
  'use strict';

  var DEFAULT_LANG = 'fr';
  var STORE_KEY = 'selectedLang';

  // Résout une clé "a.b.c" dans un dictionnaire
  function resolve(dict, path) {
    try {
      return path.split('.').reduce(function (o, k) {
        return (o && o[k] != null) ? o[k] : undefined;
      }, dict);
    } catch (e) {
      return undefined;
    }
  }

  // Langue courante (localStorage -> fallback fr)
  function getLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    return (saved === 'en' || saved === 'fr') ? saved : DEFAULT_LANG;
  }

  // Applique la langue via ton moteur, met <html lang="..."> et gère redirection optionnelle
  function setLang(lang, opts) {
    opts = opts || {};
    var safe = (lang === 'en') ? 'en' : 'fr';

    try {
      if (typeof window.changeLanguage === 'function') {
        // Ton i18n.js fournit changeLanguage(lang) qui persiste + applique
        window.changeLanguage(safe);
      } else {
        // Fallback si changeLanguage absent
        try { localStorage.setItem(STORE_KEY, safe); } catch (e) {}
        if (typeof window.applyTranslations === 'function') {
          window.applyTranslations(safe);
        }
      }
    } catch (e) {
      // En dernier recours : on force la persistance + applique
      try { localStorage.setItem(STORE_KEY, safe); } catch (_) {}
      if (typeof window.applyTranslations === 'function') {
        window.applyTranslations(safe);
      }
    }

    try { document.documentElement.setAttribute('lang', safe); } catch (e) {}

    if (opts.redirect) {
      var target = opts.redirectTo || 'profil.html';
      try { window.location.href = target; } catch (e) {}
    }
  }

  // Traduction d’une clé immédiate via window.I18N
  function t(key, lang) {
    var l = lang || getLang();
    var dictAll = window.I18N || {};
    var dict = dictAll[l] || dictAll[DEFAULT_LANG] || {};
    var val = resolve(dict, key);
    return (val != null) ? val : key;
  }

  // Réapplique toutes les traductions de la page
  function apply(lang) {
    var l = lang || getLang();
    if (typeof window.applyTranslations === 'function') {
      window.applyTranslations(l);
    }
    try { document.documentElement.setAttribute('lang', l); } catch (e) {}
  }

  // Binder simple d’un bouton retour
  function bindBackButton(selector, href) {
    selector = selector || '#btnRetour';
    href = href || 'profil.html';
    var btn = document.querySelector(selector);
    if (!btn) return;
    btn.addEventListener('click', function () {
      try { window.location.href = href; } catch (e) {}
    });
  }

  // Optionnel : connecte un groupe radio (id="fr"/"en") pour changer la langue
  function bindLanguageRadios(opts) {
    opts = opts || {};
    var onChangeRedirect = !!opts.redirect;
    var redirectTo = opts.redirectTo || 'profil.html';

    var fr = document.getElementById('fr');
    var en = document.getElementById('en');
    var current = getLang();

    if (fr && current === 'fr') fr.checked = true;
    if (en && current === 'en') en.checked = true;

    function handler(next) {
      setLang(next, { redirect: onChangeRedirect, redirectTo: redirectTo });
    }

    if (fr) fr.addEventListener('change', function () { if (fr.checked) handler('fr'); });
    if (en) en.addEventListener('change', function () { if (en.checked) handler('en'); });
  }

  // Optionnel : synchronise un <select id="languageSelect"> si présent
  function bindLanguageSelect(opts) {
    opts = opts || {};
    var onChangeRedirect = !!opts.redirect;
    var redirectTo = opts.redirectTo || 'profil.html';

    var sel = document.getElementById('languageSelect');
    if (!sel) return;

    var current = getLang();
    sel.value = current;

    sel.addEventListener('change', function () {
      var next = sel.value === 'en' ? 'en' : 'fr';
      setLang(next, { redirect: onChangeRedirect, redirectTo: redirectTo });
    });
  }

  // Expose l’API unifiée
  window.tokomiI18n = {
    getLang: getLang,
    setLang: setLang,
    t: t,
    apply: apply,
    // dict renvoie la source globale (lecture seule)
    dict: (function () { return window.I18N || {}; })(),
    bindBackButton: bindBackButton,
    bindLanguageRadios: bindLanguageRadios,
    bindLanguageSelect: bindLanguageSelect
  };
})();

