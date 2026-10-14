/* Icon Builder · App-Icons und SVG-Icons bauen und für alle Plattformen exportieren.
   Alles wird als ein SVG (1024×1024) beschrieben; PNG/ICO entstehen daraus per Canvas,
   damit Vorschau, SVG- und PNG-Export immer identisch aussehen. */
(() => {
  'use strict';
  const { $, $$, esc } = TV;
  const L = window.LUCIDE;
  const C = window.TVColor;

  // #region Texte
  const STRINGS = {
    de: {
      pageTitle: 'Icon Builder',
      kicker: '// icon · svg · app-icons',
      title: 'Icon <span class="accent">Builder</span>',
      lead: 'Eigene Icons aus über 1800 Symbolen, Formen, Text und Emoji bauen – mit Verläufen, Mustern und Schatten – und alles für iPhone, Android, Web, macOS und Windows exportieren.',
      canvas: 'Arbeitsfläche',
      g_none: 'Keine',
      g_grid: 'Raster',
      stageHint: 'Ebene anklicken und ziehen · Pfeiltasten verschieben · Shift = ohne Einrasten',
      undo: 'Rückgängig (Strg+Z)',
      redo: 'Wiederholen (Strg+Y)',
      random: '🎲 Zufall',
      saveProj: 'Projekt speichern',
      loadProj: 'Projekt laden',
      mockups: 'So sieht es aus',
      themed: 'Themed',
      t_templates: 'Vorlagen',
      t_bg: 'Hintergrund',
      t_layers: 'Ebenen',
      t_export: 'Export',
      templates: 'Mit einer Vorlage starten',
      tplHint: 'Vorlage anklicken und dann alles anpassen. Rückgängig geht immer mit Strg+Z.',
      addText: '+ Text',
      addShape: '+ Form',
      addImage: '+ Bild',
      noLayers: 'Noch keine Ebene – oben eine hinzufügen.',
      noSel: 'Ebene in der Liste oder auf der Fläche anklicken, um sie zu bearbeiten.',
      shape: 'Form',
      radius: 'Rundung',
      fill: 'Füllung',
      f_solid: 'Voll',
      f_linear: 'Linear',
      f_radial: 'Radial',
      color: 'Farbe',
      color1: 'Farbe 1',
      color2: 'Farbe 2',
      angle: 'Winkel',
      swap: '⇄ tauschen',
      palettes: 'Paletten',
      pattern: 'Muster',
      p_none: 'Keins',
      p_dots: 'Punkte',
      p_grid: 'Gitter',
      p_stripes: 'Streifen',
      p_rays: 'Strahlen',
      p_waves: 'Wellen',
      patColor: 'Musterfarbe',
      white: 'Weiss',
      black: 'Schwarz',
      opacity: 'Deckkraft',
      gloss: 'Glanz oben',
      border: 'Rand',
      borderColor: 'Randfarbe',
      clip: 'Ebenen an Form abschneiden',
      icon: 'Symbol',
      search: 'Suchen (deutsch oder englisch) …',
      style: 'Stil',
      s_line: 'Linie',
      s_filled: 'Gefüllt',
      s_duo: 'Duo',
      s_fill: 'Fläche',
      s_outline: 'Kontur',
      stroke: 'Strich',
      text: 'Text',
      font: 'Schrift',
      weight: 'Stärke',
      fontNote: 'Systemschriften, damit PNG und SVG überall gleich aussehen. Emoji sehen je nach Gerät anders aus.',
      size: 'Grösse',
      posX: 'X',
      posY: 'Y',
      rotate: 'Drehung',
      flip: 'Spiegeln',
      center: '⊕ zentrieren',
      shadow: 'Schatten',
      sh_none: 'Aus',
      sh_soft: 'Weich',
      sh_hard: 'Hart',
      sh_long: 'Lang',
      shColor: 'Schattenfarbe',
      shDist: 'Abstand',
      shBlur: 'Unschärfe',
      shAngle: 'Richtung',
      shLen: 'Länge',
      image: 'Bild',
      replace: 'Ersetzen …',
      l_icon: 'Symbol',
      l_text: 'Text',
      l_shape: 'Form',
      l_image: 'Bild',
      up: 'Nach oben',
      down: 'Nach unten',
      dup: 'Duplizieren',
      del: 'Löschen',
      hide: 'Ein-/ausblenden',
      appName: 'App-Name (für Manifest und Vorschau)',
      copySvg: 'SVG kopieren',
      copy: 'Kopieren',
      snippet: 'HTML-Code für den <head>',
      zip: (n) => `⬇ ZIP mit ${n} Dateien herunterladen`,
      zipNone: 'Mindestens ein Ziel wählen',
      building: (i, n) => `Erzeuge Datei ${i} von ${n} …`,
      done: (n, kb) => `Fertig: ${n} Dateien · ${kb} KB.`,
      ios: 'iPhone & iPad',
      iosD: 'AppIcon.appiconset für Xcode: 1024 px hell, dunkel und getönt (iOS 18) + alle klassischen Grössen 20–1024 mit Contents.json. Ohne Transparenz – iOS rundet selbst.',
      android: 'Android',
      androidD: 'res/mipmap-mdpi … xxxhdpi: ic_launcher, ic_launcher_round, Adaptive Icon (Vorder-/Hintergrund 108 dp), Themed-Monochrom (Android 13) + XML, Play-Store 512 px.',
      web: 'Web & PWA',
      webD: 'favicon.ico (16/32/48), favicon.svg, PNG 16/32, apple-touch-icon 180, 192/512 + maskable, site.webmanifest, HTML-Code.',
      macos: 'macOS',
      macosD: 'AppIcon.iconset (16–1024, @1x/@2x) im Big-Sur-Raster mit Schatten. Daraus macht „iconutil -c icns AppIcon.iconset“ eine .icns.',
      windows: 'Windows',
      windowsD: 'app.ico mit 16, 24, 32, 48, 64, 128 und 256 px.',
      source: 'Quelle',
      sourceD: 'icon.svg, icon-1024.png und die Projektdatei zum späteren Weiterbearbeiten.',
      copied: 'SVG kopiert',
      loaded: 'Projekt geladen',
      badFile: 'Datei konnte nicht gelesen werden',
      local: '🔒 Alles läuft lokal im Browser',
      cvdTitle: 'Mit Farbschwäche',
      n_normal: 'normal',
      n_protan: 'Protan',
      n_deutan: 'Deutan',
      n_tritan: 'Tritan',
      n_achroma: 'Grau',
      readme: 'Erstellt mit ToolVault Icon Builder',
    },
    en: {
      pageTitle: 'Icon Builder',
      kicker: '// icon · svg · app icons',
      title: 'Icon <span class="accent">Builder</span>',
      lead: 'Build your own icons from 1,800+ glyphs, shapes, text and emoji – with gradients, patterns and shadows – and export everything for iPhone, Android, web, macOS and Windows.',
      canvas: 'Canvas',
      g_none: 'None',
      g_grid: 'Grid',
      stageHint: 'Click and drag a layer · arrow keys nudge · Shift = no snapping',
      undo: 'Undo (Ctrl+Z)',
      redo: 'Redo (Ctrl+Y)',
      random: '🎲 Random',
      saveProj: 'Save project',
      loadProj: 'Open project',
      mockups: 'How it looks',
      themed: 'Themed',
      t_templates: 'Templates',
      t_bg: 'Background',
      t_layers: 'Layers',
      t_export: 'Export',
      templates: 'Start from a template',
      tplHint: 'Pick a template, then change everything. Ctrl+Z always undoes.',
      addText: '+ Text',
      addShape: '+ Shape',
      addImage: '+ Image',
      noLayers: 'No layers yet – add one above.',
      noSel: 'Click a layer in the list or on the canvas to edit it.',
      shape: 'Shape',
      radius: 'Corner',
      fill: 'Fill',
      f_solid: 'Solid',
      f_linear: 'Linear',
      f_radial: 'Radial',
      color: 'Colour',
      color1: 'Colour 1',
      color2: 'Colour 2',
      angle: 'Angle',
      swap: '⇄ swap',
      palettes: 'Palettes',
      pattern: 'Pattern',
      p_none: 'None',
      p_dots: 'Dots',
      p_grid: 'Grid',
      p_stripes: 'Stripes',
      p_rays: 'Rays',
      p_waves: 'Waves',
      patColor: 'Pattern colour',
      white: 'White',
      black: 'Black',
      opacity: 'Opacity',
      gloss: 'Top gloss',
      border: 'Border',
      borderColor: 'Border colour',
      clip: 'Clip layers to shape',
      icon: 'Glyph',
      search: 'Search icons …',
      style: 'Style',
      s_line: 'Line',
      s_filled: 'Filled',
      s_duo: 'Duo',
      s_fill: 'Fill',
      s_outline: 'Outline',
      stroke: 'Stroke',
      text: 'Text',
      font: 'Font',
      weight: 'Weight',
      fontNote: 'System fonts, so PNG and SVG look the same everywhere. Emoji depend on the device.',
      size: 'Size',
      posX: 'X',
      posY: 'Y',
      rotate: 'Rotation',
      flip: 'Mirror',
      center: '⊕ centre',
      shadow: 'Shadow',
      sh_none: 'Off',
      sh_soft: 'Soft',
      sh_hard: 'Hard',
      sh_long: 'Long',
      shColor: 'Shadow colour',
      shDist: 'Distance',
      shBlur: 'Blur',
      shAngle: 'Direction',
      shLen: 'Length',
      image: 'Image',
      replace: 'Replace …',
      l_icon: 'Glyph',
      l_text: 'Text',
      l_shape: 'Shape',
      l_image: 'Image',
      up: 'Move up',
      down: 'Move down',
      dup: 'Duplicate',
      del: 'Delete',
      hide: 'Show/hide',
      appName: 'App name (for manifest and preview)',
      copySvg: 'Copy SVG',
      copy: 'Copy',
      snippet: 'HTML for the <head>',
      zip: (n) => `⬇ Download ZIP with ${n} files`,
      zipNone: 'Pick at least one target',
      building: (i, n) => `Rendering file ${i} of ${n} …`,
      done: (n, kb) => `Done: ${n} files · ${kb} KB.`,
      ios: 'iPhone & iPad',
      iosD: 'AppIcon.appiconset for Xcode: 1024 px light, dark and tinted (iOS 18) + all classic sizes 20–1024 with Contents.json. No transparency – iOS rounds it.',
      android: 'Android',
      androidD: 'res/mipmap-mdpi … xxxhdpi: ic_launcher, ic_launcher_round, adaptive icon (foreground/background 108 dp), themed monochrome (Android 13) + XML, Play Store 512 px.',
      web: 'Web & PWA',
      webD: 'favicon.ico (16/32/48), favicon.svg, PNG 16/32, apple-touch-icon 180, 192/512 + maskable, site.webmanifest, HTML snippet.',
      macos: 'macOS',
      macosD: 'AppIcon.iconset (16–1024, @1x/@2x) on the Big Sur grid with shadow. "iconutil -c icns AppIcon.iconset" turns it into an .icns.',
      windows: 'Windows',
      windowsD: 'app.ico with 16, 24, 32, 48, 64, 128 and 256 px.',
      source: 'Source',
      sourceD: 'icon.svg, icon-1024.png and the project file for later editing.',
      copied: 'SVG copied',
      loaded: 'Project loaded',
      badFile: 'Could not read that file',
      local: '🔒 Everything runs locally in your browser',
      cvdTitle: 'With colour blindness',
      n_normal: 'normal',
      n_protan: 'Protan',
      n_deutan: 'Deutan',
      n_tritan: 'Tritan',
      n_achroma: 'Grey',
      readme: 'Made with ToolVault Icon Builder',
    },
  };
  const t = TV.t;
  // #endregion

  // #region Formen und Konstanten
  const S = 1024;
  const r2 = (v) => Math.round(v * 100) / 100;

  function starPath(n, ro, ri) {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? ri : ro;
      const a = (Math.PI * i) / n - Math.PI / 2;
      d += (i ? 'L' : 'M') + r2(12 + r * Math.cos(a)) + ' ' + r2(12 + r * Math.sin(a));
    }
    return d + 'Z';
  }
  // Ebenen-Formen im 24er-Raster (wie die Lucide-Symbole)
  const SHAPES = {
    circle: 'M12 1a11 11 0 1 1 0 22 11 11 0 1 1 0-22Z',
    square: 'M1 1h22v22H1Z',
    rounded: 'M6 1h12a5 5 0 0 1 5 5v12a5 5 0 0 1-5 5H6a5 5 0 0 1-5-5V6a5 5 0 0 1 5-5Z',
    triangle: 'M12 1.5 23 21.5H1Z',
    diamond: 'M12 1 23 12 12 23 1 12Z',
    hexagon: starPath(6, 11, 11),
    star: starPath(5, 11.5, 4.8),
    burst: starPath(12, 11.5, 9.2),
    heart:
      'M12 21.6C5 16.4 1.5 12.6 1.5 8.2 1.5 5 4 2.5 7.1 2.5c2 0 3.8 1 4.9 2.7 1.1-1.7 2.9-2.7 4.9-2.7 3.1 0 5.6 2.5 5.6 5.7 0 4.4-3.5 8.2-10.5 13.4Z',
    ring: 'M12 1a11 11 0 1 1 0 22 11 11 0 1 1 0-22Zm0 5a6 6 0 1 0 0 12 6 6 0 1 0 0-12Z',
    shield: 'M12 1 21.5 4.5v6.5c0 6-4 10.5-9.5 12-5.5-1.5-9.5-6-9.5-12V4.5Z',
    blob: 'M17.6 3.3c2.6 1.6 4.6 4.7 4.4 7.8-.2 3.2-2.5 6.3-5.3 8.3-2.8 2-6.1 2.8-8.9 1.7C5 20 2.6 17 1.9 13.8 1.2 10.6 2.2 7.2 4.4 4.9 6.7 2.6 10.1 1.4 13 1.6c1.7.1 3.3.7 4.6 1.7Z',
    drop: 'M12 1.5S4 10 4 15a8 8 0 0 0 16 0c0-5-8-13.5-8-13.5Z',
    bolt: 'M13.5 1 3.5 13.5h7L9 23l11.5-13h-7Z',
    bubble: 'M3 3h18a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 21 17H9l-5.5 4.5V17H3a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 3 3Z',
    leafy: 'M2 22C2 10 10 2 22 2c0 12-8 20-20 20Z',
  };

  function bgPath(shape, radius) {
    if (shape === 'square') return 'M0 0H1024V1024H0Z';
    if (shape === 'circle') return 'M512 0a512 512 0 1 1 0 1024 512 512 0 1 1 0-1024Z';
    if (shape === 'rounded') {
      const r = r2((radius / 100) * 512);
      return `M${r} 0H${S - r}A${r} ${r} 0 0 1 ${S} ${r}V${S - r}A${r} ${r} 0 0 1 ${S - r} ${S}H${r}A${r} ${r} 0 0 1 0 ${S - r}V${r}A${r} ${r} 0 0 1 ${r} 0Z`;
    }
    if (shape === 'squircle') {
      // Superellipse n=5 – nah an der „kontinuierlichen“ Rundung von iOS
      let d = '';
      for (let i = 0; i < 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        const c = Math.cos(a),
          s = Math.sin(a);
        const x = 512 + 512 * Math.sign(c) * Math.abs(c) ** 0.4;
        const y = 512 + 512 * Math.sign(s) * Math.abs(s) ** 0.4;
        d += (i ? 'L' : 'M') + r2(x) + ' ' + r2(y);
      }
      return d + 'Z';
    }
    return '';
  }

  const FONTS = {
    sans: { label: 'Sans', css: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
    rounded: { label: 'Rounded', css: "ui-rounded, 'SF Pro Rounded', 'Arial Rounded MT Bold', 'Varela Round', system-ui, sans-serif" },
    serif: { label: 'Serif', css: "ui-serif, Georgia, 'Times New Roman', serif" },
    mono: { label: 'Mono', css: "ui-monospace, 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace" },
    impact: { label: 'Impact', css: "Impact, 'Arial Black', 'Helvetica Neue', sans-serif" },
  };

  const PALETTES = [
    ['#7b2ff7', '#f107a3'],
    ['#ff9a44', '#fc6076'],
    ['#00c6fb', '#005bea'],
    ['#a8e063', '#56ab2f'],
    ['#f7971e', '#ffd200'],
    ['#ff5f6d', '#ffc371'],
    ['#11998e', '#38ef7d'],
    ['#4568dc', '#b06ab3'],
    ['#0f2027', '#2c5364'],
    ['#232526', '#414345'],
    ['#ee0979', '#ff6a00'],
    ['#8e2de2', '#4a00e0'],
    ['#f953c6', '#b91d73'],
    ['#00b09b', '#96c93d'],
    ['#c79081', '#dfa579'],
    ['#e0eafc', '#cfdef3'],
    ['#1f1c2c', '#928dab'],
    ['#fdfbfb', '#ebedee'],
  ];

  // Beliebte Symbole, wenn noch nichts gesucht ist
  const POPULAR =
    'rocket heart star zap camera music code leaf coffee sun moon cloud flame droplet sparkles gem crown trophy gift globe compass map-pin house lock key shield bell mail message-circle send phone headphones mic film image palette brush pen-tool pencil book graduation-cap lightbulb brain atom cpu terminal bot gamepad-2 puzzle target dumbbell bike car plane sailboat anchor mountain tree-pine flower-2 sprout paw-print cat dog fish bird bug apple pizza cake shopping-cart wallet coins chart-line calendar clock timer check smile ghost skull snowflake umbrella rainbow feather wand-sparkles swords flask-conical rocket'
      .split(' ')
      .filter((n, i, a) => L[n] && a.indexOf(n) === i);

  // Deutsche Suchbegriffe → englische Namen/Tags
  const DE = {
    herz: 'heart', stern: 'star', haus: 'house', kamera: 'camera', foto: 'camera', musik: 'music', rakete: 'rocket',
    blatt: 'leaf', pflanze: 'sprout', kaffee: 'coffee', blitz: 'zap', schloss: 'lock', wolke: 'cloud', sonne: 'sun',
    mond: 'moon', buch: 'book', brief: 'mail', post: 'mail', einkauf: 'shopping', katze: 'cat', hund: 'dog',
    fisch: 'fish', vogel: 'bird', baum: 'tree', feuer: 'flame', wasser: 'droplet', tropfen: 'droplet', uhr: 'clock',
    kalender: 'calendar', glocke: 'bell', karte: 'map', pfeil: 'arrow', spiel: 'game', geld: 'wallet', münze: 'coin',
    schlüssel: 'key', schild: 'shield', person: 'user', nutzer: 'user', freund: 'users', telefon: 'phone',
    bild: 'image', stift: 'pen', pinsel: 'brush', farbe: 'palette', lampe: 'lamp', idee: 'lightbulb', gehirn: 'brain',
    pokal: 'trophy', krone: 'crown', geschenk: 'gift', welt: 'globe', erde: 'earth', berg: 'mountain', blume: 'flower',
    auto: 'car', fahrrad: 'bike', flugzeug: 'plane', boot: 'sail', schiff: 'ship', anker: 'anchor', zug: 'train',
    pizza: 'pizza', kuchen: 'cake', apfel: 'apple', essen: 'utensils', trinken: 'cup', bier: 'beer', wein: 'wine',
    schnee: 'snow', regen: 'rain', schirm: 'umbrella', regenbogen: 'rainbow', feder: 'feather', zauber: 'wand',
    schwert: 'sword', ziel: 'target', puzzle: 'puzzle', hantel: 'dumbbell', sport: 'dumbbell', code: 'code',
    computer: 'computer', laptop: 'laptop', handy: 'smartphone', roboter: 'bot', einstellungen: 'settings',
    werkzeug: 'wrench', hammer: 'hammer', suche: 'search', lupe: 'search', haken: 'check', kreuz: 'x', plus: 'plus',
    warnung: 'alert', info: 'info', frage: 'help', diagramm: 'chart', statistik: 'chart', ordner: 'folder',
    datei: 'file', wolkenkratzer: 'building', gebäude: 'building', schule: 'school', geist: 'ghost', totenkopf: 'skull',
    lachen: 'smil', gesicht: 'face', kopfhörer: 'headphones', mikrofon: 'mic', video: 'video', film: 'film',
    nachricht: 'message', chat: 'message', senden: 'send', herunterladen: 'download', hochladen: 'upload',
    teilen: 'share', zuhause: 'house', standort: 'map-pin', kompass: 'compass', pfote: 'paw', käfer: 'bug',
  };
  // #endregion

  // #region Zustand
  let uid = 1;
  const fillOf = (c1, c2 = c1, type = c1 === c2 ? 'solid' : 'linear', angle = 135) => ({ type, c1, c2, angle });
  const shadowOff = () => ({ type: 'none', color: '#000000', opacity: 35, dist: 24, blur: 24, angle: 90, len: 60 });
  function layer(type, o = {}) {
    return Object.assign(
      {
        id: uid++,
        type,
        icon: 'rocket',
        shape: 'circle',
        text: 'A',
        font: 'sans',
        weight: 800,
        src: '',
        style: type === 'shape' ? 'fill' : 'line',
        sw: 2,
        x: 512,
        y: 512,
        size: 600,
        rot: 0,
        flip: false,
        opacity: 100,
        fill: fillOf('#ffffff'),
        shadow: shadowOff(),
        visible: true,
      },
      o,
    );
  }
  function defaultState() {
    return {
      bg: {
        shape: 'squircle',
        radius: 22,
        fill: fillOf('#7b2ff7', '#f107a3', 'linear', 135),
        pattern: 'none',
        patColor: '#ffffff',
        patOpacity: 14,
        gloss: false,
        border: 0,
        borderColor: '#ffffff',
        clip: true,
      },
      layers: [layer('icon', { icon: 'rocket', shadow: Object.assign(shadowOff(), { type: 'long', opacity: 22, angle: 45 }) })],
      sel: null,
      name: 'My App',
    };
  }
  let state = defaultState();
  state.sel = state.layers[0].id;
  const selLayer = () => state.layers.find((l) => l.id === state.sel) || null;
  // #endregion

  // #region SVG erzeugen
  function gradDef(id, f, x, y, size) {
    const stops = `<stop offset="0" stop-color="${f.c1}"/><stop offset="1" stop-color="${f.c2}"/>`;
    const c = size / 2;
    if (f.type === 'radial')
      return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${x + c}" cy="${r2(y + c * 0.8)}" r="${r2(size * 0.72)}">${stops}</radialGradient>`;
    const a = ((f.angle - 90) * Math.PI) / 180;
    const dx = Math.cos(a) * c,
      dy = Math.sin(a) * c;
    return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r2(x + c - dx)}" y1="${r2(y + c - dy)}" x2="${r2(x + c + dx)}" y2="${r2(y + c + dy)}">${stops}</linearGradient>`;
  }
  function paint(f, id, defs, x = 0, y = 0, size = 24) {
    if (f.type === 'solid') return f.c1;
    defs.push(gradDef(id, f, x, y, size));
    return `url(#${id})`;
  }

  function patternDef(bg, defs) {
    const c = bg.patColor;
    const P = {
      dots: `<pattern id="pat" width="64" height="64" patternUnits="userSpaceOnUse"><circle cx="32" cy="32" r="9" fill="${c}"/></pattern>`,
      grid: `<pattern id="pat" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="${c}" stroke-width="5"/></pattern>`,
      stripes: `<pattern id="pat" width="72" height="72" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="30" height="72" fill="${c}"/></pattern>`,
      waves: `<pattern id="pat" width="128" height="64" patternUnits="userSpaceOnUse"><path d="M0 32q32-28 64 0t64 0" fill="none" stroke="${c}" stroke-width="8"/></pattern>`,
    };
    if (bg.pattern === 'rays') {
      let d = '';
      for (let i = 0; i < 24; i += 2) {
        const a1 = (i / 24) * Math.PI * 2,
          a2 = ((i + 1) / 24) * Math.PI * 2;
        d += `M512 512L${r2(512 + 1100 * Math.cos(a1))} ${r2(512 + 1100 * Math.sin(a1))}L${r2(512 + 1100 * Math.cos(a2))} ${r2(512 + 1100 * Math.sin(a2))}Z`;
      }
      return `<path d="${d}" fill="${c}"/>`;
    }
    defs.push(P[bg.pattern]);
    return `<rect width="1024" height="1024" fill="url(#pat)"/>`;
  }

  // Inhalt einer Ebene im 24er-Raster
  function layerBody(l, fill, defs, i) {
    const lin = 'stroke-linecap="round" stroke-linejoin="round"';
    if (l.type === 'icon') {
      const inner = (L[l.icon] || L.star)[0];
      if (l.style === 'filled') return `<g fill="${fill}" stroke="${fill}" stroke-width="${l.sw}" ${lin}>${inner}</g>`;
      if (l.style === 'duo')
        return `<g fill="${fill}" fill-opacity=".32" stroke="${fill}" stroke-width="${l.sw}" ${lin}>${inner}</g>`;
      return `<g fill="none" stroke="${fill}" stroke-width="${l.sw}" ${lin}>${inner}</g>`;
    }
    if (l.type === 'shape') {
      const d = SHAPES[l.shape] || SHAPES.circle;
      return l.style === 'outline'
        ? `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${l.sw}" ${lin} transform="translate(12 12) scale(${r2((22 - l.sw) / 22)}) translate(-12 -12)"/>`
        : `<path d="${d}" fill="${fill}" fill-rule="evenodd"/>`;
    }
    if (l.type === 'text') {
      const f = FONTS[l.font] || FONTS.sans;
      return `<text x="12" y="12" text-anchor="middle" dominant-baseline="central" font-family="${esc(f.css)}" font-weight="${l.weight}" font-size="20" fill="${fill}">${esc(l.text)}</text>`;
    }
    if (l.type === 'image' && l.src)
      return `<image href="${l.src}" x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet"/>`;
    return '';
  }

  function layerSvg(l, i, defs, o) {
    const k = l.size / 24;
    const tf = `translate(${r2(l.x)} ${r2(l.y)}) rotate(${l.rot}) scale(${l.flip ? -r2(k) : r2(k)} ${r2(k)}) translate(-12 -12)`;
    const fill = paint(l.fill, `lf${i}`, defs);
    const body = `<g transform="${tf}">${layerBody(l, fill, defs, i)}</g>`;
    const sh = l.shadow;
    let pre = '',
      filter = '';
    if (!o.mono && sh.type !== 'none') {
      const a = (sh.angle * Math.PI) / 180;
      if (sh.type === 'long') {
        // Viele Kopien in Schattenfarbe – der klassische „Long Shadow“
        const shBody = `<g transform="${tf}">${layerBody(l, sh.color, [], i)}</g>`;
        const n = 40,
          step = (sh.len / 100) * 16;
        let copies = '';
        for (let j = n; j >= 1; j--)
          copies += `<g transform="translate(${r2(Math.cos(a) * step * j)} ${r2(Math.sin(a) * step * j)})">${shBody}</g>`;
        pre = `<g opacity="${sh.opacity / 100}">${copies}</g>`;
      } else {
        defs.push(
          `<filter id="sh${i}" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feDropShadow dx="${r2(Math.cos(a) * sh.dist)}" dy="${r2(Math.sin(a) * sh.dist)}" stdDeviation="${sh.type === 'hard' ? 0 : r2(sh.blur / 2)}" flood-color="${sh.color}" flood-opacity="${sh.opacity / 100}"/></filter>`,
        );
        filter = ` filter="url(#sh${i})"`;
      }
    }
    const op = l.opacity < 100 ? ` opacity="${l.opacity / 100}"` : '';
    return `<g data-layer="${l.id}"${op}>${pre}<g${filter}>${body}</g></g>`;
  }

  /* Optionen:
     shape   Hintergrundform überschreiben ('square' = randlos für iOS/Android)
     bg      false = ohne Hintergrund (Android-Vordergrund)
     layers  false = nur Hintergrund
     scale   Ebenen um die Mitte skalieren (Safe-Zone)
     mono    Farbe für alle Ebenen als Silhouette (Themed/Tinted)
     mac     macOS-Raster: 824er Körper + Schatten
     size    width/height-Attribut */
  function svg(o = {}) {
    const bg = state.bg;
    const defs = [];
    const shape = o.shape || bg.shape;
    const d = o.bg === false ? '' : bgPath(shape, bg.radius);
    let out = '';
    if (d) {
      defs.push(`<clipPath id="clip"><path d="${d}"/></clipPath>`);
      out += `<path d="${d}" fill="${paint(bg.fill, 'bgf', defs, 0, 0, S)}"/>`;
      if (bg.pattern !== 'none')
        out += `<g clip-path="url(#clip)" opacity="${bg.patOpacity / 100}">${patternDef(bg, defs)}</g>`;
      if (bg.gloss) {
        defs.push(
          '<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></linearGradient>',
        );
        out += `<path d="${d}" fill="url(#gloss)"/>`;
      }
    }
    if (o.layers !== false) {
      let g = state.layers
        .filter((l) => l.visible)
        .map((l, i) => layerSvg(l, i, defs, o))
        .join('');
      if (o.scale && o.scale !== 1) g = `<g transform="translate(512 512) scale(${o.scale}) translate(-512 -512)">${g}</g>`;
      if (o.mono) {
        defs.push(
          `<filter id="mono" color-interpolation-filters="sRGB"><feFlood flood-color="${o.mono}"/><feComposite in2="SourceAlpha" operator="in"/></filter>`,
        );
        g = `<g filter="url(#mono)">${g}</g>`;
      }
      out += d && bg.clip ? `<g clip-path="url(#clip)">${g}</g>` : g;
    }
    if (d && bg.border > 0)
      out += `<path d="${d}" fill="none" stroke="${bg.borderColor}" stroke-width="${bg.border * 2}" clip-path="url(#clip)"/>`;
    if (o.mac) {
      defs.push(
        '<filter id="macsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000" flood-opacity=".3"/></filter>',
      );
      out = `<g filter="url(#macsh)"><g transform="translate(100 100) scale(0.8046875)">${out}</g></g>`;
    }
    const sz = o.size ? ` width="${o.size}" height="${o.size}"` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"${sz}><defs>${defs.join('')}</defs>${out}</svg>`;
  }
  // #endregion

  // #region Rastern, PNG, ICO
  async function canvasOf(svgStr, size) {
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
    await img.decode();
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const x = c.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.drawImage(img, 0, 0, size, size);
    return c;
  }
  const blobOf = (c) => new Promise((r) => c.toBlob(r, 'image/png'));
  async function png(o, size) {
    return blobOf(await canvasOf(svg({ ...o, size }), size));
  }
  // ICO mit eingebetteten PNGs (von allen aktuellen Systemen unterstützt)
  async function ico(o, sizes) {
    const pngs = [];
    for (const s of sizes) pngs.push(new Uint8Array(await (await png(o, s)).arrayBuffer()));
    const head = 6 + 16 * sizes.length;
    const total = head + pngs.reduce((a, p) => a + p.length, 0);
    const buf = new Uint8Array(total);
    const v = new DataView(buf.buffer);
    v.setUint16(2, 1, true);
    v.setUint16(4, sizes.length, true);
    let off = head;
    sizes.forEach((s, i) => {
      const e = 6 + 16 * i;
      v.setUint8(e, s >= 256 ? 0 : s);
      v.setUint8(e + 1, s >= 256 ? 0 : s);
      v.setUint16(e + 4, 1, true);
      v.setUint16(e + 6, 32, true);
      v.setUint32(e + 8, pngs[i].length, true);
      v.setUint32(e + 12, off, true);
      buf.set(pngs[i], off);
      off += pngs[i].length;
    });
    return new Blob([buf], { type: 'image/x-icon' });
  }
  // #endregion

  // #region Export-Ziele
  const IOS_LEGACY = [
    ['iphone', 20, 2], ['iphone', 20, 3], ['iphone', 29, 2], ['iphone', 29, 3], ['iphone', 40, 2], ['iphone', 40, 3],
    ['iphone', 60, 2], ['iphone', 60, 3], ['ipad', 20, 1], ['ipad', 20, 2], ['ipad', 29, 1], ['ipad', 29, 2],
    ['ipad', 40, 1], ['ipad', 40, 2], ['ipad', 76, 1], ['ipad', 76, 2], ['ipad', 83.5, 2], ['ios-marketing', 1024, 1],
  ];
  const DENS = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  const MAC = [16, 32, 128, 256, 512];
  const XC = { author: 'xcode', version: 1 };
  const slug = () => (state.name || 'app').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app';
  const json = (o) => JSON.stringify(o, null, 2) + '\n';

  const SQ = { shape: 'square' }; // randlos, ohne Transparenz
  const TARGETS = {
    ios() {
      const f = [
        ['ios/AppIcon.appiconset/Icon-1024.png', SQ, 1024],
        ['ios/AppIcon.appiconset/Icon-1024-dark.png', { bg: false }, 1024],
        ['ios/AppIcon.appiconset/Icon-1024-tinted.png', { tinted: true }, 1024],
        [
          'ios/AppIcon.appiconset/Contents.json',
          json({
            images: [
              { filename: 'Icon-1024.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
              { appearances: [{ appearance: 'luminosity', value: 'dark' }], filename: 'Icon-1024-dark.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
              { appearances: [{ appearance: 'luminosity', value: 'tinted' }], filename: 'Icon-1024-tinted.png', idiom: 'universal', platform: 'ios', size: '1024x1024' },
            ],
            info: XC,
          }),
        ],
      ];
      const images = IOS_LEGACY.map(([idiom, pt, sc]) => {
        const filename = `Icon-${pt}@${sc}x.png`;
        f.push([`ios/AppIcon-legacy.appiconset/${filename}`, SQ, pt * sc]);
        return { size: `${pt}x${pt}`, idiom, filename, scale: `${sc}x` };
      });
      f.push(['ios/AppIcon-legacy.appiconset/Contents.json', json({ images, info: XC })]);
      return f;
    },
    android() {
      const f = [];
      const legacyShape = ['circle', 'none'].includes(state.bg.shape) ? 'rounded' : state.bg.shape;
      for (const [dn, k] of Object.entries(DENS)) {
        const dir = `android/res/mipmap-${dn}/`;
        f.push([dir + 'ic_launcher.png', { shape: legacyShape }, 48 * k]);
        f.push([dir + 'ic_launcher_round.png', { shape: 'circle' }, 48 * k]);
        // Adaptive Icons: 108 dp, sichtbar sind die inneren 72 dp → Ebenen auf 2/3
        f.push([dir + 'ic_launcher_foreground.png', { bg: false, scale: 0.6667 }, 108 * k]);
        f.push([dir + 'ic_launcher_background.png', { shape: 'square', layers: false }, 108 * k]);
        f.push([dir + 'ic_launcher_monochrome.png', { bg: false, scale: 0.6667, mono: '#ffffff' }, 108 * k]);
      }
      const xml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome" />
</adaptive-icon>
`;
      f.push(['android/res/mipmap-anydpi-v26/ic_launcher.xml', xml]);
      f.push(['android/res/mipmap-anydpi-v26/ic_launcher_round.xml', xml]);
      f.push(['android/play-store-512.png', SQ, 512]);
      return f;
    },
    web() {
      const c = state.bg.fill.c1;
      return [
        ['web/favicon.ico', 'ico', [16, 32, 48]],
        ['web/favicon.svg', svg()],
        ['web/favicon-16x16.png', {}, 16],
        ['web/favicon-32x32.png', {}, 32],
        ['web/apple-touch-icon.png', SQ, 180],
        ['web/icon-192.png', {}, 192],
        ['web/icon-512.png', {}, 512],
        ['web/icon-maskable-512.png', { shape: 'square', scale: 0.8 }, 512],
        [
          'web/site.webmanifest',
          json({
            name: state.name,
            short_name: state.name.slice(0, 12),
            icons: [
              { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
              { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
              { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            ],
            theme_color: c,
            background_color: c,
            display: 'standalone',
          }),
        ],
        ['web/head.html', headSnippet()],
      ];
    },
    macos() {
      const f = [];
      const shape = state.bg.shape === 'circle' ? 'circle' : 'squircle';
      for (const s of MAC) {
        f.push([`macos/AppIcon.iconset/icon_${s}x${s}.png`, { shape, mac: true }, s]);
        f.push([`macos/AppIcon.iconset/icon_${s}x${s}@2x.png`, { shape, mac: true }, s * 2]);
      }
      return f;
    },
    windows() {
      return [['windows/app.ico', 'ico', [16, 24, 32, 48, 64, 128, 256]]];
    },
    source() {
      return [
        [`${slug()}.svg`, svg()],
        [`${slug()}-1024.png`, {}, 1024],
        [`${slug()}.icon.json`, json(projectData())],
      ];
    },
  };
  function headSnippet() {
    return `<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${state.bg.fill.c1}">
`;
  }

  // Getönte Variante (iOS 18): Graustufen-Silhouette auf Schwarz
  async function renderEntry(o, size) {
    if (o.tinted) {
      const c = await canvasOf(svg({ bg: false, size }), size);
      const out = document.createElement('canvas');
      out.width = out.height = size;
      const x = out.getContext('2d');
      x.fillStyle = '#000';
      x.fillRect(0, 0, size, size);
      x.filter = 'grayscale(1) brightness(1.25)';
      x.drawImage(c, 0, 0);
      return blobOf(out);
    }
    return png(o, size);
  }

  const selectedTargets = () => $$('#targets input:checked').map((i) => i.value);
  function countFiles() {
    return selectedTargets().reduce((n, k) => n + TARGETS[k]().length, 0) + 1;
  }
  async function buildZip() {
    const keys = selectedTargets();
    if (!keys.length) return;
    const btn = $('#dlZip');
    btn.disabled = true;
    const zip = new JSZip();
    const list = keys.flatMap((k) => TARGETS[k]());
    const cache = new Map();
    try {
      for (let i = 0; i < list.length; i++) {
        $('#exportMsg').textContent = t('building', i + 1, list.length);
        $('#exportMsg').className = 'msg';
        const [path, a, b] = list[i];
        if (typeof a === 'string' && a !== 'ico') zip.file(path, a);
        else if (a === 'ico') zip.file(path, await ico({}, b));
        else {
          const key = JSON.stringify(a) + b;
          if (!cache.has(key)) cache.set(key, await renderEntry(a, b));
          zip.file(path, cache.get(key));
        }
        if (i % 6 === 0) await new Promise((r) => setTimeout(r));
      }
      zip.file('README.txt', readme(keys));
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      TV.download(`${slug()}-icons.zip`, blob);
      $('#exportMsg').textContent = t('done', list.length + 1, Math.round(blob.size / 1024));
      $('#exportMsg').className = 'msg ok';
    } catch (e) {
      $('#exportMsg').textContent = String(e.message || e);
      $('#exportMsg').className = 'msg bad';
    }
    btn.disabled = false;
  }
  function readme(keys) {
    const parts = {
      ios: 'ios/        Drag AppIcon.appiconset into Assets.xcassets (Xcode 15+). AppIcon-legacy = all classic sizes (older Xcode, Flutter, React Native).',
      android: 'android/    Copy res/ into app/src/main/res. AndroidManifest: android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round". play-store-512.png for the Play Console.',
      web: 'web/        Put the files in your site root and paste head.html into <head>.',
      macos: 'macos/      iconutil -c icns AppIcon.iconset   → AppIcon.icns',
      windows: 'windows/    app.ico (16–256 px) for apps, shortcuts and installers.',
      source: 'source      SVG master, 1024 px PNG and .icon.json (open again in Icon Builder).',
    };
    return `${state.name} – ${t('readme')}\n${new Date().toISOString().slice(0, 10)}\n\n${keys.map((k) => parts[k]).join('\n')}\n`;
  }
  // #endregion

  // #region Darstellen
  let stageSvgCache = '';
  function render() {
    const s = svg();
    if (s !== stageSvgCache) {
      $('#art').innerHTML = s;
      stageSvgCache = s;
    }
    drawGuides();
    renderLayerList();
    scheduleMockups();
  }

  let guide = 'none';
  function drawGuides() {
    let g = '';
    if (guide === 'ios') {
      g = `<path class="soft" d="${bgPath('squircle')}"/><circle cx="512" cy="512" r="410"/><circle class="soft" cx="512" cy="512" r="240"/><rect class="soft" x="160" y="96" width="704" height="832" rx="40"/><rect class="soft" x="96" y="160" width="832" height="704" rx="40"/><path class="soft" d="M0 0L1024 1024M1024 0L0 1024M512 0V1024M0 512H1024"/>`;
    } else if (guide === 'android') {
      // sichtbar 72 dp = 1024 px · Safe-Zone 66 dp Kreis
      g = `<circle cx="512" cy="512" r="469"/><circle class="soft" cx="512" cy="512" r="512"/><rect class="soft" x="0" y="0" width="1024" height="1024" rx="307"/>`;
    } else if (guide === 'grid') {
      for (let i = 128; i < S; i += 128) g += `<path class="soft" d="M${i} 0V1024M0 ${i}H1024"/>`;
      g += '<path d="M512 0V1024M0 512H1024"/>';
    }
    const l = selLayer();
    if (l && l.visible) {
      const h = l.size / 2;
      g += `<rect class="sel" x="${l.x - h}" y="${l.y - h}" width="${l.size}" height="${l.size}" transform="rotate(${l.rot} ${l.x} ${l.y})"/>`;
    }
    $('#guides').innerHTML = g;
  }

  const miniSvg = (inner, extra = '') =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${inner}</svg>`;
  function thumbOf(l) {
    if (l.type === 'icon') return miniSvg((L[l.icon] || L.star)[0]);
    if (l.type === 'shape') return `<svg viewBox="0 0 24 24"><path d="${SHAPES[l.shape]}" fill="currentColor" fill-rule="evenodd"/></svg>`;
    if (l.type === 'text') return `<b style="font-size:.8rem">${esc(l.text.slice(0, 2))}</b>`;
    return l.src ? `<img src="${l.src}" alt="" style="width:22px;height:22px;object-fit:contain">` : '';
  }
  function layerName(l) {
    if (l.type === 'icon') return l.icon;
    if (l.type === 'shape') return t('l_shape') + ' · ' + l.shape;
    if (l.type === 'text') return '„' + l.text + '“';
    return t('l_image');
  }
  function renderLayerList() {
    const ol = $('#layerList');
    if (!state.layers.length) {
      ol.innerHTML = `<li class="empty">${esc(t('noLayers'))}</li>`;
      return;
    }
    // Oberste Ebene zuerst anzeigen
    ol.innerHTML = state.layers
      .map((l, i) => ({ l, i }))
      .reverse()
      .map(
        ({ l }) => `<li data-id="${l.id}" aria-selected="${l.id === state.sel}" class="${l.visible ? '' : 'off'}">
          <span class="lthumb" style="color:${l.fill.c1}">${thumbOf(l)}</span>
          <span class="lname">${esc(layerName(l))}</span>
          <button class="lbtn" data-act="vis" title="${esc(t('hide'))}">${l.visible ? '◉' : '○'}</button>
          <button class="lbtn" data-act="up" title="${esc(t('up'))}">↑</button>
          <button class="lbtn" data-act="down" title="${esc(t('down'))}">↓</button>
          <button class="lbtn" data-act="dup" title="${esc(t('dup'))}">⧉</button>
          <button class="lbtn" data-act="del" title="${esc(t('del'))}">✕</button>
        </li>`,
      )
      .join('');
  }
  // #endregion

  // #region Bausteine für die Steuerung
  function el(html) {
    const d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }
  function row(label, ...kids) {
    const r = el(`<div class="opt-row"><span>${esc(label)}</span></div>`);
    r.append(...kids);
    return r;
  }
  function range(label, obj, key, min, max, step = 1, unit = '') {
    const inp = el(`<input type="range" min="${min}" max="${max}" step="${step}" aria-label="${esc(label)}">`);
    const val = el('<span class="val"></span>');
    inp.value = obj[key];
    val.textContent = obj[key] + unit;
    inp.addEventListener('input', () => {
      obj[key] = +inp.value;
      val.textContent = inp.value + unit;
      change();
    });
    return row(label, inp, val);
  }
  function seg(label, obj, key, opts, structural = true) {
    const s = el('<span class="seg small wide"></span>');
    opts.forEach(([v, txt]) => {
      const b = el(`<button type="button">${esc(txt)}</button>`);
      b.setAttribute('aria-selected', obj[key] === v);
      b.addEventListener('click', () => {
        obj[key] = v;
        $$('button', s).forEach((x) => x.setAttribute('aria-selected', x === b));
        change(structural);
      });
      s.append(b);
    });
    return label ? row(label, s) : s;
  }
  function check(label, obj, key) {
    const l = el(`<label class="check"><input type="checkbox"> <span>${esc(label)}</span></label>`);
    const i = $('input', l);
    i.checked = obj[key];
    i.addEventListener('change', () => {
      obj[key] = i.checked;
      change();
    });
    return l;
  }
  function colorIn(label, obj, key) {
    const wrap = el(
      '<span class="color-in wide"><input type="color"><input type="text" spellcheck="false" maxlength="7"><span class="cname"></span></span>',
    );
    const [ci, ti] = $$('input', wrap);
    const nm = $('.cname', wrap);
    const show = () => {
      ci.value = obj[key];
      ti.value = obj[key];
      nm.textContent = C.describe(C.hexToRgb(obj[key]), TV.lang);
      nm.title = nm.textContent;
    };
    show();
    ci.addEventListener('input', () => {
      obj[key] = ci.value;
      ti.value = ci.value;
      nm.textContent = C.describe(C.hexToRgb(ci.value), TV.lang);
      change();
    });
    ti.addEventListener('input', () => {
      const v = ti.value.trim();
      if (/^#?[0-9a-f]{6}$/i.test(v)) {
        obj[key] = (v[0] === '#' ? v : '#' + v).toLowerCase();
        ci.value = obj[key];
        nm.textContent = C.describe(C.hexToRgb(obj[key]), TV.lang);
        change();
      }
    });
    return row(label, wrap);
  }
  // Füllung: Voll / Linear / Radial + zwei Farben + Winkel + Paletten
  function fillEditor(f) {
    const box = el('<div></div>');
    const draw = () => {
      box.innerHTML = '';
      box.append(
        seg(t('fill'), f, 'type', [
          ['solid', t('f_solid')],
          ['linear', t('f_linear')],
          ['radial', t('f_radial')],
        ]),
      );
      box.append(colorIn(f.type === 'solid' ? t('color') : t('color1'), f, 'c1'));
      if (f.type !== 'solid') {
        box.append(colorIn(t('color2'), f, 'c2'));
        if (f.type === 'linear') box.append(range(t('angle'), f, 'angle', 0, 360, 5, '°'));
        const sw = el(`<button class="btn sm" type="button">${esc(t('swap'))}</button>`);
        sw.addEventListener('click', () => {
          [f.c1, f.c2] = [f.c2, f.c1];
          change(true);
        });
        box.append(row('', sw));
      }
      const pal = el('<div class="swatches wide"></div>');
      PALETTES.forEach(([a, b]) => {
        const p = el(`<button type="button" title="${a} → ${b}" style="background:linear-gradient(135deg,${a},${b})"></button>`);
        p.addEventListener('click', () => {
          f.c1 = a;
          f.c2 = b;
          if (f.type === 'solid') f.type = 'linear';
          change(true);
        });
        pal.append(p);
      });
      box.append(row(t('palettes'), pal));
    };
    draw();
    return box;
  }
  function tilesFor(obj, key, items, render) {
    const g = el('<div class="tiles"></div>');
    items.forEach((v) => {
      const b = el(`<button type="button" class="tile" title="${esc(v)}">${render(v)}</button>`);
      b.setAttribute('aria-pressed', obj[key] === v);
      b.addEventListener('click', () => {
        obj[key] = v;
        $$('.tile', g).forEach((x) => x.setAttribute('aria-pressed', x === b));
        change(true);
      });
      g.append(b);
    });
    return g;
  }
  const sub = (title) => el(`<div class="sub"><p class="sub-title">${esc(title)}</p></div>`);
  // #endregion

  // #region Panels
  function renderBgPanel() {
    const bg = state.bg;
    const p = $('#bgPanel');
    p.innerHTML = '';
    p.append(
      tilesFor(bg, 'shape', ['squircle', 'rounded', 'circle', 'square', 'none'], (v) =>
        v === 'none'
          ? '∅'
          : `<svg viewBox="0 0 1024 1024"><path d="${bgPath(v, v === 'rounded' ? bg.radius : 0)}" fill="currentColor"/></svg>`,
      ),
    );
    if (bg.shape === 'rounded') p.append(range(t('radius'), bg, 'radius', 0, 50, 1, '%'));
    if (bg.shape !== 'none') {
      const f = sub(t('fill'));
      f.append(fillEditor(bg.fill));
      p.append(f);
      const pt = sub(t('pattern'));
      pt.append(
        seg('', bg, 'pattern', [
          ['none', t('p_none')],
          ['dots', t('p_dots')],
          ['grid', t('p_grid')],
          ['stripes', t('p_stripes')],
          ['rays', t('p_rays')],
          ['waves', t('p_waves')],
        ]),
      );
      if (bg.pattern !== 'none') {
        pt.append(
          seg(t('patColor'), bg, 'patColor', [
            ['#ffffff', t('white')],
            ['#000000', t('black')],
          ]),
        );
        pt.append(range(t('opacity'), bg, 'patOpacity', 2, 60, 1, '%'));
      }
      p.append(pt);
      const ex = sub(t('border'));
      ex.append(range(t('border'), bg, 'border', 0, 80, 2, 'px'));
      if (bg.border > 0) ex.append(colorIn(t('borderColor'), bg, 'borderColor'));
      const checks = el('<div class="row" style="margin-top:12px"></div>');
      checks.append(check(t('gloss'), bg, 'gloss'), check(t('clip'), bg, 'clip'));
      ex.append(checks);
      p.append(ex);
    }
  }

  let iconQuery = '';
  function iconPicker(l) {
    const box = el(
      `<div><div class="icon-search"><input type="search" placeholder="${esc(t('search'))}" aria-label="${esc(t('search'))}"><span class="count"></span></div><div class="tiles icon-grid"></div></div>`,
    );
    const inp = $('input', box),
      grid = $('.icon-grid', box),
      cnt = $('.count', box);
    inp.value = iconQuery;
    const names = Object.keys(L);
    const draw = () => {
      const q = inp.value.trim().toLowerCase();
      iconQuery = q;
      let list;
      if (!q) list = POPULAR;
      else {
        const terms = [q, DE[q]].filter(Boolean);
        // auch Teilwörter der deutschen Liste („herzen“ → herz)
        for (const [de, en] of Object.entries(DE)) if (q.length > 2 && de.startsWith(q)) terms.push(en);
        const hit = (n) => terms.some((s) => n.includes(s));
        // genaue Treffer zuerst, dann Wortanfang, dann irgendwo im Namen
        const rank = (n) => (terms.includes(n) ? 0 : terms.some((s) => n.startsWith(s)) ? 1 : 2);
        const byName = names.filter(hit).sort((a, b) => rank(a) - rank(b));
        const byTag = names.filter((n) => !byName.includes(n) && terms.some((s) => L[n][1].includes(s)));
        list = byName.concat(byTag);
      }
      cnt.textContent = q ? `${list.length} / ${names.length}` : `${names.length} Lucide`;
      grid.innerHTML = list
        .slice(0, 180)
        .map((n) => `<button type="button" class="tile" title="${n}" data-icon="${n}" aria-pressed="${n === l.icon}">${miniSvg(L[n][0])}</button>`)
        .join('');
    };
    inp.addEventListener('input', draw);
    grid.addEventListener('click', (e) => {
      const b = e.target.closest('[data-icon]');
      if (!b) return;
      l.icon = b.dataset.icon;
      $$('.tile', grid).forEach((x) => x.setAttribute('aria-pressed', x === b));
      change();
    });
    draw();
    return box;
  }

  function renderLayerPanel() {
    const p = $('#layerPanel');
    const l = selLayer();
    p.innerHTML = '';
    if (!l) {
      p.append(el(`<p class="hint" style="margin:0">${esc(t('noSel'))}</p>`));
      return;
    }
    p.append(el(`<h2 class="box-title"><span>${esc(t('l_' + l.type))}</span></h2>`));
    if (l.type === 'icon') {
      p.append(iconPicker(l));
      p.append(
        seg(t('style'), l, 'style', [
          ['line', t('s_line')],
          ['filled', t('s_filled')],
          ['duo', t('s_duo')],
        ]),
      );
      p.append(range(t('stroke'), l, 'sw', 0.5, 4, 0.25));
    } else if (l.type === 'shape') {
      p.append(
        tilesFor(l, 'shape', Object.keys(SHAPES), (v) => `<svg viewBox="0 0 24 24"><path d="${SHAPES[v]}" fill="currentColor" fill-rule="evenodd"/></svg>`),
      );
      p.append(
        seg(t('style'), l, 'style', [
          ['fill', t('s_fill')],
          ['outline', t('s_outline')],
        ]),
      );
      if (l.style === 'outline') p.append(range(t('stroke'), l, 'sw', 0.5, 6, 0.25));
    } else if (l.type === 'text') {
      const ti = el(`<input type="text" class="wide" maxlength="12" aria-label="${esc(t('text'))}">`);
      ti.value = l.text;
      ti.addEventListener('input', () => {
        l.text = ti.value;
        change();
      });
      p.append(row(t('text'), ti));
      p.append(
        seg(
          t('font'),
          l,
          'font',
          Object.entries(FONTS).map(([k, f]) => [k, f.label]),
        ),
      );
      p.append(
        seg(t('weight'), l, 'weight', [
          [400, '400'],
          [600, '600'],
          [800, '800'],
          [900, '900'],
        ]),
      );
      p.append(el(`<p class="hint">${esc(t('fontNote'))}</p>`));
    } else if (l.type === 'image') {
      const up = el(`<label class="btn sm file-btn"><span>${esc(t('replace'))}</span><input type="file" accept="image/*,.svg"></label>`);
      $('input', up).addEventListener('change', async (e) => {
        const src = await readImage(e.target.files[0]);
        if (src) {
          l.src = src;
          change(true);
        }
      });
      p.append(row(t('image'), up));
    }
    if (l.type !== 'image') {
      const f = sub(t('fill'));
      f.append(fillEditor(l.fill));
      p.append(f);
    }
    const geo = sub(t('size'));
    geo.append(range(t('size'), l, 'size', 40, 1400, 4, 'px'));
    geo.append(range(t('posX'), l, 'x', 0, 1024, 1));
    geo.append(range(t('posY'), l, 'y', 0, 1024, 1));
    geo.append(range(t('rotate'), l, 'rot', -180, 180, 1, '°'));
    geo.append(range(t('opacity'), l, 'opacity', 5, 100, 1, '%'));
    const acts = el('<div class="row" style="margin-top:12px"></div>');
    const cb = el(`<button class="btn sm" type="button">${esc(t('center'))}</button>`);
    cb.addEventListener('click', () => {
      l.x = l.y = 512;
      change(true);
    });
    acts.append(cb, check(t('flip'), l, 'flip'));
    geo.append(acts);
    p.append(geo);

    const sh = sub(t('shadow'));
    sh.append(
      seg('', l.shadow, 'type', [
        ['none', t('sh_none')],
        ['soft', t('sh_soft')],
        ['hard', t('sh_hard')],
        ['long', t('sh_long')],
      ]),
    );
    if (l.shadow.type !== 'none') {
      sh.append(colorIn(t('shColor'), l.shadow, 'color'));
      sh.append(range(t('opacity'), l.shadow, 'opacity', 5, 100, 1, '%'));
      sh.append(range(t('shAngle'), l.shadow, 'angle', 0, 360, 5, '°'));
      if (l.shadow.type === 'long') sh.append(range(t('shLen'), l.shadow, 'len', 10, 100, 1, '%'));
      else sh.append(range(t('shDist'), l.shadow, 'dist', 0, 80, 1, 'px'));
      if (l.shadow.type === 'soft') sh.append(range(t('shBlur'), l.shadow, 'blur', 0, 100, 1, 'px'));
    }
    p.append(sh);
  }

  function renderTargets() {
    const keys = ['ios', 'android', 'web', 'macos', 'windows', 'source'];
    const prev = new Set(selectedTargets());
    const first = !$('#targets').children.length;
    $('#targets').innerHTML = keys
      .map(
        (k) => `<label class="target"><input type="checkbox" value="${k}" ${first || prev.has(k) ? 'checked' : ''}>
          <b>${esc(t(k))}</b><small>${esc(t(k + 'D'))}</small></label>`,
      )
      .join('');
    updateZipLabel();
  }
  function updateZipLabel() {
    const n = selectedTargets().length ? countFiles() : 0;
    $('#dlZip').textContent = n ? t('zip', n) : t('zipNone');
    $('#dlZip').disabled = !n;
  }

  function renderPanels() {
    renderBgPanel();
    renderLayerPanel();
  }
  // #endregion

  // #region Vorlagen
  const sh = (o) => Object.assign(shadowOff(), o);
  const TEMPLATES = [
    ['Rocket', { shape: 'squircle', fill: fillOf('#7b2ff7', '#f107a3') }, [layer('icon', { icon: 'rocket', shadow: sh({ type: 'long', opacity: 22, angle: 45 }) })]],
    ['Leaf', { shape: 'squircle', fill: fillOf('#a8e063', '#2f8f2f', 'radial') }, [layer('icon', { icon: 'leaf', style: 'duo', sw: 1.75, size: 620 })]],
    ['Monogram', { shape: 'squircle', fill: fillOf('#141414'), gloss: true }, [layer('text', { text: 'A', weight: 900, size: 820, fill: fillOf('#f7971e', '#ffd200', 'linear', 160) })]],
    ['Camera', { shape: 'rounded', fill: fillOf('#ff9a44', '#fc6076', 'linear', 160), pattern: 'rays', patOpacity: 10 }, [layer('icon', { icon: 'camera', sw: 1.75, shadow: sh({ type: 'soft', opacity: 30, dist: 16, blur: 30 }) })]],
    ['Ocean', { shape: 'squircle', fill: fillOf('#00c6fb', '#005bea', 'linear', 180), pattern: 'waves', patOpacity: 12 }, [layer('icon', { icon: 'droplet', style: 'filled', size: 520 })]],
    ['Music', { shape: 'circle', fill: fillOf('#1f1c2c', '#928dab', 'linear', 200) }, [layer('icon', { icon: 'music', sw: 2.25, fill: fillOf('#f953c6', '#4fd1e0', 'linear', 135), shadow: sh({ type: 'soft', color: '#f953c6', opacity: 55, dist: 0, blur: 40 }) })]],
    ['Fox', { shape: 'rounded', radius: 26, fill: fillOf('#ffe259', '#ffa751', 'linear', 180) }, [layer('text', { text: '🦊', size: 660, weight: 400 })]],
    ['Code', { shape: 'square', fill: fillOf('#0f2027', '#2c5364', 'linear', 150), pattern: 'grid', patOpacity: 8 }, [layer('icon', { icon: 'code', sw: 2.5, fill: fillOf('#4fd1e0', '#9bd64a', 'linear', 90) })]],
    ['Badge', { shape: 'none', fill: fillOf('#ffffff') }, [
      layer('shape', { shape: 'burst', size: 1000, fill: fillOf('#f7971e', '#ffd200', 'linear', 0) }),
      layer('shape', { shape: 'circle', size: 720, fill: fillOf('#d46a00', '#f7971e', 'linear', 180) }),
      layer('icon', { icon: 'check', sw: 3, size: 460 }),
    ]],
    ['Love', { shape: 'squircle', fill: fillOf('#ff5f6d', '#ffc371', 'linear', 150) }, [layer('shape', { shape: 'heart', size: 560, y: 530, shadow: sh({ type: 'soft', color: '#b8002a', opacity: 40, dist: 20, blur: 30 }) })]],
    ['Bolt', { shape: 'squircle', fill: fillOf('#232526', '#414345', 'linear', 160) }, [layer('icon', { icon: 'zap', style: 'filled', sw: 1.5, size: 560, fill: fillOf('#ffd200'), shadow: sh({ type: 'long', opacity: 35, angle: 45 }) })]],
    ['Coffee', { shape: 'rounded', radius: 30, fill: fillOf('#c79081', '#dfa579', 'linear', 150), border: 24, borderColor: '#ffffff' }, [layer('icon', { icon: 'coffee', sw: 2, size: 560, fill: fillOf('#3b2416') })]],
    ['Chat', { shape: 'squircle', fill: fillOf('#11998e', '#38ef7d', 'linear', 180) }, [layer('shape', { shape: 'bubble', size: 600, fill: fillOf('#ffffff') }), layer('icon', { icon: 'sparkles', size: 260, y: 470, sw: 2.5, fill: fillOf('#11998e') })]],
    ['Shield', { shape: 'squircle', fill: fillOf('#4568dc', '#b06ab3', 'linear', 135), pattern: 'dots', patOpacity: 10 }, [layer('shape', { shape: 'shield', size: 600, style: 'outline', sw: 1.6 }), layer('icon', { icon: 'lock', size: 300, sw: 2.5 })]],
    ['Game', { shape: 'circle', fill: fillOf('#ee0979', '#ff6a00', 'linear', 120), pattern: 'stripes', patOpacity: 8 }, [layer('icon', { icon: 'gamepad-2', sw: 1.75, size: 640, shadow: sh({ type: 'hard', opacity: 25, dist: 18 }) })]],
    ['Paw', { shape: 'squircle', fill: fillOf('#fdfbfb', '#ebedee', 'linear', 180), gloss: false }, [layer('icon', { icon: 'paw-print', style: 'filled', sw: 1, size: 560, fill: fillOf('#8e2de2', '#4a00e0', 'linear', 135) })]],
  ];
  function applyTemplate(i) {
    const [, bg, layers] = TEMPLATES[i];
    const base = defaultState().bg;
    state.bg = JSON.parse(JSON.stringify(Object.assign(base, bg)));
    state.layers = JSON.parse(JSON.stringify(layers)).map((l) => Object.assign(l, { id: uid++ }));
    state.sel = state.layers[state.layers.length - 1].id;
    change(true);
  }
  function renderTemplates() {
    const keep = state;
    $('#tplGrid').innerHTML = TEMPLATES.map(([name, bg, layers], i) => {
      state = { bg: Object.assign(defaultState().bg, bg), layers };
      const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg());
      return `<button type="button" class="tpl" data-tpl="${i}"><img src="${src}" alt="" loading="lazy"><span>${esc(name)}</span></button>`;
    }).join('');
    state = keep;
  }
  function randomize() {
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const [a, b] = pick(PALETTES);
    const dark = C.oklab(C.hexToRgb(a)).L + C.oklab(C.hexToRgb(b)).L > 1.45;
    const ink = dark ? pick(['#1a1a2e', '#2b2b2b', '#3b2416']) : '#ffffff';
    state.bg = Object.assign(defaultState().bg, {
      shape: pick(['squircle', 'squircle', 'rounded', 'circle']),
      fill: fillOf(a, b, pick(['linear', 'linear', 'radial']), pick([90, 135, 160, 180, 225])),
      pattern: pick(['none', 'none', 'none', 'dots', 'rays', 'waves', 'stripes', 'grid']),
      patColor: dark ? '#000000' : '#ffffff',
      patOpacity: 9,
      gloss: Math.random() < 0.25,
    });
    const l = layer('icon', {
      icon: pick(POPULAR),
      style: pick(['line', 'line', 'filled', 'duo']),
      sw: pick([1.5, 1.75, 2, 2.25]),
      size: pick([520, 580, 620]),
      fill: fillOf(ink),
      shadow: sh({ type: pick(['none', 'long', 'soft', 'hard']), opacity: 25, dist: 16, blur: 30, angle: 45 }),
    });
    state.layers = [l];
    state.sel = l.id;
    change(true);
  }
  // #endregion

  // #region Verlauf + Speichern
  const STORE = 'tv-icon';
  let past = [],
    future = [],
    last = '',
    histTimer;
  const snapshot = () => JSON.stringify({ bg: state.bg, layers: state.layers, sel: state.sel, name: state.name });
  function record() {
    const s = snapshot();
    if (s === last) return;
    if (last) past.push(last);
    if (past.length > 100) past.shift();
    future = [];
    last = s;
    try {
      localStorage.setItem(STORE, s);
    } catch (e) {
      /* zu gross (Bilder) – dann eben nicht */
    }
  }
  function restore(s) {
    state = JSON.parse(s);
    uid = Math.max(uid, ...state.layers.map((l) => l.id + 1));
    last = s;
    render();
    renderPanels();
    syncName();
  }
  function undo() {
    clearTimeout(histTimer);
    record();
    if (!past.length) return;
    future.push(last);
    restore(past.pop());
  }
  function redo() {
    if (!future.length) return;
    past.push(last);
    restore(future.pop());
  }
  function change(structural) {
    render();
    if (structural) renderPanels();
    clearTimeout(histTimer);
    histTimer = setTimeout(record, 350);
  }
  function projectData() {
    return { app: 'toolvault-icon', v: 1, ...JSON.parse(snapshot()) };
  }
  function loadProject(data) {
    if (!data || !data.bg || !Array.isArray(data.layers)) throw new Error('format');
    const base = defaultState();
    state = {
      bg: Object.assign(base.bg, data.bg),
      layers: data.layers.map((l) => Object.assign(layer(l.type), l, { shadow: Object.assign(shadowOff(), l.shadow) })),
      sel: data.sel,
      name: data.name || base.name,
    };
    uid = Math.max(uid, ...state.layers.map((l) => l.id + 1));
    render();
    renderPanels();
    syncName();
    record();
  }
  // #endregion

  // #region Vorschauen
  let mockTimer;
  function scheduleMockups() {
    clearTimeout(mockTimer);
    mockTimer = setTimeout(renderMockups, 220);
  }
  async function renderMockups() {
    const url = async (o, size) => (await canvasOf(svg({ ...o, size }), size)).toDataURL();
    const [sq, mono, fav, mac] = await Promise.all([
      url(SQ, 192),
      url({ bg: false, mono: '#1f5d46' }, 128),
      url({}, 32),
      url({ shape: state.bg.shape === 'circle' ? 'circle' : 'squircle', mac: true }, 128),
    ]);
    const map = { sq, mono, fav, mac };
    $$('[data-mock]').forEach((img) => (img.src = map[img.dataset.mock]));
    // Kleine Grössen nebeneinander
    const sizes = [16, 24, 32, 48, 64, 96];
    const urls = await Promise.all(sizes.map((s) => url({}, s)));
    $('#sizes').innerHTML = sizes
      .map((s, i) => `<figure><img src="${urls[i]}" width="${s}" height="${s}" alt=""><figcaption>${s}</figcaption></figure>`)
      .join('');
    // Wie Menschen mit Farbschwäche das Icon sehen
    const base = await canvasOf(svg({ size: 104 }), 104);
    const types = ['normal', ...C.TYPES];
    $('#cvd').innerHTML =
      `<figure style="align-self:center;margin-right:4px"><figcaption>${esc(t('cvdTitle'))}</figcaption></figure>` +
      types
        .map((k) => {
          if (k === 'normal') return `<figure><img src="${base.toDataURL()}" alt=""><figcaption>${esc(t('n_normal'))}</figcaption></figure>`;
          const c = document.createElement('canvas');
          c.width = c.height = 104;
          const x = c.getContext('2d');
          x.drawImage(base, 0, 0);
          x.putImageData(C.simulateImageData(x.getImageData(0, 0, 104, 104), k), 0, 0);
          return `<figure><img src="${c.toDataURL()}" alt=""><figcaption>${esc(t('n_' + k))}</figcaption></figure>`;
        })
        .join('');
    $('#headSnippet').textContent = headSnippet();
  }
  function syncName() {
    $('#appName').value = state.name;
    $$('.appname').forEach((s) => (s.textContent = state.name || 'App'));
  }
  // #endregion

  // #region Bild-Upload
  function readImage(file) {
    return new Promise((res) => {
      if (!file) return res(null);
      const r = new FileReader();
      r.onload = async () => {
        let src = r.result;
        // Grosse Rasterbilder verkleinern, damit Projekt + Verlauf klein bleiben
        if (!/svg/.test(file.type) && file.size > 300000) {
          const img = new Image();
          img.src = src;
          await img.decode();
          const k = Math.min(1, 1024 / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * k);
          c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          src = c.toDataURL('image/png');
        }
        res(src);
      };
      r.onerror = () => res(null);
      r.readAsDataURL(file);
    });
  }
  // #endregion

  // #region Ziehen auf der Bühne
  function stagePoint(e) {
    const r = $('#stage').getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * S, y: ((e.clientY - r.top) / r.height) * S };
  }
  let drag = null;
  $('#stage').addEventListener('pointerdown', (e) => {
    const hit = e.target.closest('[data-layer]');
    if (hit) {
      const id = +hit.dataset.layer;
      if (id !== state.sel) {
        state.sel = id;
        renderLayerPanel();
        showTab('layers');
      }
    }
    const l = selLayer();
    if (!l || !hit) return;
    // Stand vor dem Ziehen sichern, damit Rückgängig genau dorthin springt
    clearTimeout(histTimer);
    record();
    const p = stagePoint(e);
    drag = { dx: l.x - p.x, dy: l.y - p.y };
    $('#stage').setPointerCapture(e.pointerId);
    $('#art').classList.add('dragging');
    render();
  });
  $('#stage').addEventListener('pointermove', (e) => {
    if (!drag) return;
    const l = selLayer();
    const p = stagePoint(e);
    let x = Math.round(p.x + drag.dx),
      y = Math.round(p.y + drag.dy);
    if (!e.shiftKey) {
      if (Math.abs(x - 512) < 14) x = 512;
      if (Math.abs(y - 512) < 14) y = 512;
    }
    l.x = Math.max(0, Math.min(S, x));
    l.y = Math.max(0, Math.min(S, y));
    render();
  });
  const endDrag = () => {
    if (!drag) return;
    drag = null;
    $('#art').classList.remove('dragging');
    change(true);
  };
  $('#stage').addEventListener('pointerup', endDrag);
  $('#stage').addEventListener('pointercancel', endDrag);
  $('#stage').addEventListener('keydown', (e) => {
    const l = selLayer();
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!l || !d) return;
    e.preventDefault();
    const k = e.shiftKey ? 32 : 4;
    l.x = Math.max(0, Math.min(S, l.x + d[0] * k));
    l.y = Math.max(0, Math.min(S, l.y + d[1] * k));
    change(true);
  });
  // #endregion

  // #region Ereignisse
  function showTab(k) {
    $$('#tabs button').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === k));
    $$('.tab-panel').forEach((p) => p.classList.toggle('on', p.dataset.panel === k));
    try {
      sessionStorage.setItem('tv-icon-tab', k);
    } catch (e) {}
  }
  $('#tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (b) showTab(b.dataset.tab);
  });
  $('#guideSeg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-guide]');
    if (!b) return;
    guide = b.dataset.guide;
    $$('#guideSeg button').forEach((x) => x.setAttribute('aria-selected', x === b));
    drawGuides();
  });
  $('#tplGrid').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tpl]');
    if (b) applyTemplate(+b.dataset.tpl);
  });
  $$('[data-add]').forEach((b) =>
    b.addEventListener('click', () => {
      const type = b.dataset.add;
      const l = layer(type, type === 'shape' ? { size: 700, fill: fillOf('#ffffff') } : type === 'text' ? { size: 640 } : {});
      state.layers.push(l);
      state.sel = l.id;
      change(true);
    }),
  );
  $('#addImage').addEventListener('change', async (e) => {
    const src = await readImage(e.target.files[0]);
    e.target.value = '';
    if (!src) return TV.toast(t('badFile'));
    const l = layer('image', { src, size: 640 });
    state.layers.push(l);
    state.sel = l.id;
    change(true);
  });
  $('#layerList').addEventListener('click', (e) => {
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = +li.dataset.id;
    const i = state.layers.findIndex((l) => l.id === id);
    const act = e.target.closest('[data-act]')?.dataset.act;
    const L2 = state.layers;
    if (act === 'vis') L2[i].visible = !L2[i].visible;
    else if (act === 'up' && i < L2.length - 1) [L2[i], L2[i + 1]] = [L2[i + 1], L2[i]];
    else if (act === 'down' && i > 0) [L2[i], L2[i - 1]] = [L2[i - 1], L2[i]];
    else if (act === 'dup') {
      const c = Object.assign(JSON.parse(JSON.stringify(L2[i])), { id: uid++, x: L2[i].x + 40, y: L2[i].y + 40 });
      L2.splice(i + 1, 0, c);
      state.sel = c.id;
    } else if (act === 'del') {
      L2.splice(i, 1);
      if (state.sel === id) state.sel = L2.length ? L2[Math.max(0, i - 1)].id : null;
    } else state.sel = id;
    change(true);
  });
  $('#undo').addEventListener('click', undo);
  $('#redo').addEventListener('click', redo);
  $('#random').addEventListener('click', randomize);
  document.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.target.matches('input[type=text], input[type=search], textarea')) return;
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if (k === 'y' || (k === 'z' && e.shiftKey)) {
      e.preventDefault();
      redo();
    }
  });
  $('#saveProj').addEventListener('click', () =>
    TV.download(`${slug()}.icon.json`, json(projectData()), 'application/json'),
  );
  $('#loadProj').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      loadProject(JSON.parse(await f.text()));
      TV.toast(t('loaded'));
    } catch (err) {
      TV.toast(t('badFile'));
    }
  });
  $('#appName').addEventListener('input', (e) => {
    state.name = e.target.value;
    $$('.appname').forEach((s) => (s.textContent = state.name || 'App'));
    $('#headSnippet').textContent = headSnippet();
    clearTimeout(histTimer);
    histTimer = setTimeout(record, 350);
  });
  $('#dlSvg').addEventListener('click', () => TV.download(`${slug()}.svg`, svg(), 'image/svg+xml'));
  $('#copySvg').addEventListener('click', () => TV.copy(svg(), 'SVG'));
  $('#dlPng').addEventListener('click', async () => {
    const s = +$('#pngSize').value;
    TV.download(`${slug()}-${s}.png`, await png({}, s));
  });
  $('#dlIco').addEventListener('click', async () => TV.download('favicon.ico', await ico({}, [16, 32, 48])));
  $('#targets').addEventListener('change', updateZipLabel);
  $('#dlZip').addEventListener('click', buildZip);
  // #endregion

  // #region Start
  TV.init({
    glyph: '◆',
    strings: STRINGS,
    onLang: () => {
      if (!$('#tplGrid').children.length) return;
      renderPanels();
      renderTargets();
      render();
      scheduleMockups();
    },
  });
  try {
    const saved = localStorage.getItem(STORE);
    if (saved) loadProject(JSON.parse(saved));
  } catch (e) {
    /* kaputter Speicherstand → Standard */
  }
  past = [];
  last = snapshot();
  renderTemplates();
  renderTargets();
  renderPanels();
  syncName();
  render();
  let tab = 'templates';
  try {
    tab = sessionStorage.getItem('tv-icon-tab') || (localStorage.getItem(STORE) ? 'layers' : 'templates');
  } catch (e) {}
  showTab(tab);
  $$('#guideSeg button').forEach((x) => x.setAttribute('aria-selected', x.dataset.guide === guide));

  // Für Tests
  window.IconBuilder = { svg, png, ico, TARGETS, get state() { return state; }, applyTemplate, loadProject, buildZip };
  // #endregion
})();
