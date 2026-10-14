/* ToolVault FX · lebendiger Hintergrund, Animations-Schalter und Tool-Icons.
   Läuft auf dem Hub und auf allen Tool-Seiten (zusammen mit fx.css).
   Ohne diese beiden Dateien sieht alles wieder aus wie vorher.
   Icons: Lucide (ISC), siehe shared/vendor/README.md. */
(function () {
  'use strict';
  const ICONS = {
    "qr": "<rect width=\"5\" height=\"5\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"5\" height=\"5\" x=\"16\" y=\"3\" rx=\"1\"/><rect width=\"5\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\"/><path d=\"M21 16h-3a2 2 0 0 0-2 2v3\"/><path d=\"M21 21v.01\"/><path d=\"M12 7v3a2 2 0 0 1-2 2H7\"/><path d=\"M3 12h.01\"/><path d=\"M12 3h.01\"/><path d=\"M12 16v.01\"/><path d=\"M16 12h1\"/><path d=\"M21 12v.01\"/><path d=\"M12 21v-1\"/>",
    "unit-converter": "<path d=\"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z\"/><path d=\"m14.5 12.5 2-2\"/><path d=\"m11.5 9.5 2-2\"/><path d=\"m8.5 6.5 2-2\"/><path d=\"m17.5 15.5 2-2\"/>",
    "fileflip": "<path d=\"M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8\"/><path d=\"M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z\"/><path d=\"M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1\"/>",
    "video": "<path d=\"m12.296 3.464 3.02 3.956\"/><path d=\"M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z\"/><path d=\"M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><path d=\"m6.18 5.276 3.1 3.899\"/>",
    "icon": "<path d=\"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><circle cx=\"17.5\" cy=\"17.5\" r=\"3.5\"/>",
    "color": "<path d=\"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z\"/><circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/>",
    "vision": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>",
    "json": "<path d=\"M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1\"/><path d=\"M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1\"/>",
    "password": "<path d=\"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z\"/><circle cx=\"16.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/>",
    "encode": "<rect x=\"14\" y=\"14\" width=\"4\" height=\"6\" rx=\"2\"/><rect x=\"6\" y=\"4\" width=\"4\" height=\"6\" rx=\"2\"/><path d=\"M6 20h4\"/><path d=\"M14 10h4\"/><path d=\"M6 14h2v6\"/><path d=\"M14 4h2v6\"/>",
    "text": "<path d=\"M12 4v16\"/><path d=\"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2\"/><path d=\"M9 20h6\"/>",
    "regex": "<path d=\"M17 3v10\"/><path d=\"m12.67 5.5 8.66 5\"/><path d=\"m12.67 10.5 8.66-5\"/><path d=\"M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z\"/>",
    "time": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6h4\"/>",
    "md": "<path d=\"M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4\"/><path d=\"M2 6h4\"/><path d=\"M2 10h4\"/><path d=\"M2 14h4\"/><path d=\"M2 18h4\"/><path d=\"M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z\"/>",
    "diff": "<circle cx=\"18\" cy=\"18\" r=\"3\"/><circle cx=\"6\" cy=\"6\" r=\"3\"/><path d=\"M13 6h3a2 2 0 0 1 2 2v7\"/><path d=\"M11 18H8a2 2 0 0 1-2-2V9\"/>",
    "generator": "<rect width=\"12\" height=\"12\" x=\"2\" y=\"10\" rx=\"2\" ry=\"2\"/><path d=\"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6\"/><path d=\"M6 18h.01\"/><path d=\"M10 14h.01\"/><path d=\"M15 6h.01\"/><path d=\"M18 9h.01\"/>",
    "_play": "<path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\"/>",
    "_pause": "<rect x=\"14\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\"/><rect x=\"5\" y=\"3\" width=\"5\" height=\"18\" rx=\"1\"/>",
    "_off": "<path d=\"m2 2 20 20\"/><path d=\"M8.35 2.69A10 10 0 0 1 21.3 15.65\"/><path d=\"M19.08 19.08A10 10 0 1 1 4.92 4.92\"/>",
    "_sparkles": "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"/><path d=\"M20 2v4\"/><path d=\"M22 4h-4\"/><circle cx=\"4\" cy=\"20\" r=\"2\"/>",
  };
  const root = document.documentElement;
  const KEY = 'tv-motion';
  const MODES = ['on', 'still', 'off'];
  const NEXT = { on: 'still', still: 'off', off: 'on' };
  const GLYPH = { on: '_sparkles', still: '_pause', off: '_off' };
  const LABEL = {
    de: {
      on: 'Hintergrund animiert · klicken zum Anhalten',
      still: 'Hintergrund angehalten · klicken zum Ausblenden',
      off: 'Hintergrund aus · klicken zum Animieren',
    },
    en: {
      on: 'Background animated · click to freeze',
      still: 'Background frozen · click to hide',
      off: 'Background off · click to animate',
    },
  };

  // Früh setzen, damit nichts aufblitzt
  let mode = null;
  try {
    mode = localStorage.getItem(KEY);
  } catch (e) {}
  // Standard: animiert – auf Handys/Touch-Geräten angehalten (Akku + Performance).
  // Eine eigene Wahl über den Schalter oben gilt immer.
  if (!MODES.includes(mode)) mode = matchMedia('(max-width: 760px), (pointer: coarse)').matches ? 'still' : 'on';
  root.dataset.motion = mode;

  const svg = (inner, cls = '') =>
    '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';

  let btn = null;
  function paint() {
    if (!btn) return;
    const text = LABEL[root.lang === 'de' ? 'de' : 'en'][mode];
    btn.innerHTML = svg(ICONS[GLYPH[mode]]);
    btn.title = text;
    btn.setAttribute('aria-label', text);
    btn.dataset.mode = mode;
  }
  function setMode(m) {
    mode = m;
    root.dataset.motion = m;
    try {
      localStorage.setItem(KEY, m);
    } catch (e) {}
    paint();
    frame();
  }

  // #region Hintergrund-Szene: Scroll-Parallax + Maus-Licht, alles in einem rAF
  let scene = null;
  let queued = false;
  const spot = { x: innerWidth / 2, y: innerHeight * 0.3, tx: innerWidth / 2, ty: innerHeight * 0.3, on: false };
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  function buildScene() {
    const bg = document.createElement('div');
    bg.className = 'tv-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML =
      '<div class="tv-layer tv-warm"><i></i><i></i></div>' +
      '<div class="tv-layer tv-cool"><i></i><i></i></div>' +
      '<div class="tv-halo"><span></span></div>' +
      '<div class="tv-grid"><b></b></div>' +
      '<div class="tv-spot"></div>';
    const bar = document.createElement('div');
    bar.className = 'tv-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bg, bar);
    const $ = (s) => bg.querySelector(s);
    scene = { warm: $('.tv-warm'), cool: $('.tv-cool'), halo: $('.tv-halo'), grid: $('.tv-grid b'), spot: $('.tv-spot'), bar };
    addEventListener('scroll', frame, { passive: true });
    addEventListener('resize', frame, { passive: true });
    if (finePointer) {
      addEventListener(
        'pointermove',
        (e) => {
          spot.tx = e.clientX;
          spot.ty = e.clientY;
          if (!spot.on) {
            spot.on = true;
            scene.spot.classList.add('on');
          }
          frame();
        },
        { passive: true },
      );
      document.documentElement.addEventListener('pointerleave', () => {
        spot.on = false;
        scene.spot.classList.remove('on');
      });
    }
    frame();
  }
  function frame() {
    if (scene && !queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  }
  function render() {
    queued = false;
    const y = scrollY;
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const p = max > 0 ? Math.min(1, y / max) : 0;
    scene.bar.style.opacity = max > 80 && mode !== 'off' ? 1 : 0;
    scene.bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    // Parallax nur im Modus „animiert“ – sonst ruhige Grundstellung
    const k = mode === 'on' ? 1 : 0;
    scene.warm.style.transform = 'translate3d(0,' + (-y * 0.06 * k).toFixed(1) + 'px,0)';
    scene.warm.style.opacity = (1 - p * 0.7 * k).toFixed(3);
    scene.cool.style.transform = 'translate3d(0,' + (-y * 0.16 * k).toFixed(1) + 'px,0)';
    scene.cool.style.opacity = (0.35 + p * 0.65 * k).toFixed(3);
    scene.halo.style.transform =
      'translate3d(0,' + (-y * 0.22 * k).toFixed(1) + 'px,0) rotate(' + (p * 160 * k).toFixed(2) + 'deg) scale(' + (1 + p * 0.3 * k).toFixed(3) + ')';
    scene.grid.style.transform = 'translate3d(0,' + (-((y * 0.35 * k) % 26)).toFixed(1) + 'px,0)';
    // Licht folgt der Maus mit Federung (lerp), läuft aus, sobald es angekommen ist
    if (k && spot.on) {
      spot.x += (spot.tx - spot.x) * 0.12;
      spot.y += (spot.ty - spot.y) * 0.12;
      scene.spot.style.transform = 'translate3d(' + spot.x.toFixed(1) + 'px,' + spot.y.toFixed(1) + 'px,0)';
      if (Math.abs(spot.tx - spot.x) + Math.abs(spot.ty - spot.y) > 0.6) frame();
    }
  }
  // #endregion

  // #region Einblenden beim Hinscrollen
  function setupReveal() {
    if (mode === 'off' || !('IntersectionObserver' in window)) return;
    const all = Array.from(
      document.querySelectorAll('.grid > .card, .wrap .box, .panel-grid > .panel, .container .card, .tool-grid > .card'),
    );
    // nur sichtbare Elemente unterhalb des Bildschirms, keine verschachtelten
    const els = all.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.height > 0 && r.top > innerHeight && !all.some((o) => o !== el && o.contains(el));
    });
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          io.unobserve(el);
          el.style.transitionDelay = Math.min(n++, 5) * 70 + 'ms';
          el.classList.add('tv-in');
          const done = (ev) => {
            if (ev.target !== el || ev.propertyName !== 'transform') return;
            el.style.animation = 'none'; // Lade-Animation nicht nachträglich noch einmal abspielen
            el.classList.remove('tv-reveal', 'tv-in');
            el.style.transitionDelay = '';
            el.removeEventListener('transitionend', done);
          };
          el.addEventListener('transitionend', done);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    els.forEach((el) => {
      el.classList.add('tv-reveal');
      io.observe(el);
    });
  }
  // #endregion

  function start() {
    const embedded = root.classList.contains('embed');
    if (!embedded && !document.querySelector('.tv-bg')) buildScene();
    const bar = document.querySelector('.topbar-right');
    if (bar && !embedded) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'motion-btn';
      btn.addEventListener('click', () => setMode(NEXT[mode]));
      bar.prepend(btn);
      paint();
      // Sprache wechselt → Tooltip mitziehen
      new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ['lang'] });
    }
    // Tool-Icon im Kopf jeder Tool-Seite
    const key = location.pathname.split('/').slice(-2, -1)[0];
    const hero = document.querySelector('.hero');
    if (hero && ICONS[key] && !hero.querySelector('.hero-icon')) {
      const ic = document.createElement('span');
      ic.className = 'hero-icon';
      ic.innerHTML = svg(ICONS[key]);
      hero.prepend(ic);
    }
    // Karten nacheinander einblenden
    document.querySelectorAll('.grid > .card').forEach((c, i) => c.style.setProperty('--i', i));
    if (!embedded) setupReveal();
    // Pointer-Licht auf Karten und Boxen (nur Maus)
    if (matchMedia('(hover: hover)').matches) {
      document.addEventListener('pointermove', (e) => {
        const el = e.target.closest && e.target.closest('.grid > .card');
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', e.clientX - r.left + 'px');
        el.style.setProperty('--my', e.clientY - r.top + 'px');
      }, { passive: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  window.TVFX = { icons: ICONS, svg, setMode };
})();
