/* ToolVault · gemeinsame Logik für Tool-Seiten
   - Theme-Punkte (geteilt mit der Startseite über localStorage 'hub-theme')
   - DE/EN-Umschalter mit data-i18n-Attributen
   - kleine Helfer: Kopieren, Toast, Download, Escape

   Verwendung in einem Tool:
     TV.init({ glyph: '#', strings: { de: {...}, en: {...} }, onLang: (lang) => {...} });
     TV.init({ glyph: '↺', lang: false })   -> nur Themes/Favicon, Sprache macht das Tool selbst
     TV.t('key')   -> Text in aktueller Sprache
   Attribute: data-i18n (Text), data-i18n-html (HTML), data-i18n-ph (Placeholder),
              data-i18n-title (title + aria-label). */
(function () {
  'use strict';

  const THEMES = [
    { id: 'graphite', label: 'Graphite', dot: '#e8a23c' },
    { id: 'blueprint', label: 'Blueprint', dot: '#4fd1e0' },
    { id: 'moss', label: 'Moss', dot: '#9bd64a' },
    { id: 'plum', label: 'Plum', dot: '#ef8fb4' },
    { id: 'paper', label: 'Paper', dot: '#f2eee6' },
  ];
  const DEFAULT_THEME = 'graphite';
  const DEFAULT_LANG = 'en';

  const store = {
    get(k, s = localStorage) {
      try {
        return s.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set(k, v, s = localStorage) {
      try {
        s.setItem(k, v);
      } catch (e) {}
    },
  };

  // Theme so früh wie möglich setzen (gegen Aufblitzen)
  const startTheme = THEMES.some((t) => t.id === store.get('hub-theme'))
    ? store.get('hub-theme')
    : DEFAULT_THEME;
  document.documentElement.setAttribute('data-theme', startTheme);
  document.documentElement.style.colorScheme = startTheme === 'paper' ? 'light' : 'dark';

  let LANG = DEFAULT_LANG;
  let STRINGS = { de: {}, en: {} };
  let GLYPH = '›';
  const langListeners = [];

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );

  function t(key, ...args) {
    const v = (STRINGS[LANG] && STRINGS[LANG][key]) ?? STRINGS.en[key] ?? key;
    return typeof v === 'function' ? v(...args) : v;
  }

  function buildFavicon() {
    const cs = getComputedStyle(document.documentElement);
    const accent = cs.getPropertyValue('--accent').trim() || '#e8a23c';
    const plate = cs.getPropertyValue('--text').trim() || '#f0e9df';
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
      '<rect x="2" y="2" width="28" height="28" rx="7" fill="' +
      plate +
      '"/><text x="16" y="22.5" font-family="Menlo,Consolas,monospace" font-size="17" ' +
      'font-weight="700" text-anchor="middle" fill="' +
      accent +
      '">' +
      esc(GLYPH) +
      '</text></svg>';
    let link = document.getElementById('favicon');
    if (!link) {
      link = document.createElement('link');
      link.id = 'favicon';
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      document.head.appendChild(link);
    }
    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function setTheme(id) {
    document.documentElement.setAttribute('data-theme', id);
    document.documentElement.style.colorScheme = id === 'paper' ? 'light' : 'dark';
    $$('.theme-dot').forEach((d) =>
      d.setAttribute('aria-pressed', d.dataset.theme === id ? 'true' : 'false'),
    );
    buildFavicon();
    store.set('hub-theme', id);
    document.dispatchEvent(new CustomEvent('tv:theme', { detail: id }));
  }

  function applyLang(lang) {
    LANG = STRINGS[lang] ? lang : DEFAULT_LANG;
    document.documentElement.lang = LANG;
    $$('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $$('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
    $$('[data-i18n-ph]').forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
    $$('[data-i18n-title]').forEach((el) => {
      el.title = t(el.dataset.i18nTitle);
      el.setAttribute('aria-label', el.title);
    });
    $$('#lang button').forEach((b) =>
      b.setAttribute('aria-pressed', b.dataset.lang === LANG ? 'true' : 'false'),
    );
    if (STRINGS[LANG].pageTitle) document.title = STRINGS[LANG].pageTitle + ' · ToolVault';
    store.set('tv-lang', LANG, sessionStorage);
    langListeners.forEach((fn) => fn(LANG));
  }

  let toastTimer;
  function toast(text) {
    let el = $('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1500);
  }

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Fallback für http:// oder ältere Browser
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    toast((LANG === 'de' ? 'Kopiert' : 'Copied') + (label ? ' · ' + label : ''));
  }

  function download(name, content, type = 'text/plain') {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function init(opts = {}) {
    GLYPH = opts.glyph || GLYPH;
    STRINGS = opts.strings || STRINGS;
    STRINGS.de = STRINGS.de || {};
    STRINGS.en = STRINGS.en || {};
    if (opts.onLang) langListeners.push(opts.onLang);

    // Theme-Punkte
    const themesEl = $('#themes');
    if (themesEl) {
      THEMES.forEach((th) => {
        const b = document.createElement('button');
        b.className = 'theme-dot';
        b.dataset.theme = th.id;
        b.style.setProperty('--dot', th.dot);
        b.title = th.label;
        b.setAttribute('aria-label', th.label);
        b.addEventListener('click', () => setTheme(th.id));
        themesEl.appendChild(b);
      });
    }
    setTheme(document.documentElement.getAttribute('data-theme') || DEFAULT_THEME);

    // Sprache (lang: false = das Tool hat eine eigene Sprachsteuerung)
    if (opts.lang !== false) {
      $$('#lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));
      applyLang(store.get('tv-lang', sessionStorage) || DEFAULT_LANG);
    } else {
      LANG = document.documentElement.lang || DEFAULT_LANG;
    }

    // Copy-Buttons: <button data-copy="#selector">
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-copy]');
      if (!btn || !btn.dataset.copy) return;
      const src = $(btn.dataset.copy);
      if (!src) return;
      const text = 'value' in src && src.tagName !== 'BUTTON' ? src.value : src.textContent;
      if (text) copy(text);
    });

    // Jahr in der Fusszeile
    const y = $('#tv-year');
    if (y) y.textContent = '© ' + new Date().getFullYear();
  }

  window.TV = {
    init,
    t,
    esc,
    copy,
    toast,
    download,
    setTheme,
    $,
    $$,
    get lang() {
      return LANG;
    },
  };
})();
