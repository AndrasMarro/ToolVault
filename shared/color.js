/* ToolVault · Farb-Bibliothek
   Gemeinsam genutzt von Farb-Konverter und Farbsehen-Tool:
   - Umrechnung sRGB <-> linear <-> OKLab / OKLCH, Farbabstand (ΔE OK)
   - verständliche Farbbeschreibung auf Deutsch / Englisch ("dunkles Indigoblau")
   - nächster gängiger Farbname (eigene DE/EN-Liste) und nächster Name aus
     color-name-list (wird bei Bedarf nachgeladen)
   - Farbschwäche-Simulation nach Machado, Oliveira & Fernandes (2009)
   Farben sind Objekte { r, g, b } mit Werten 0–255. */
(function () {
  'use strict';

  // #region Umrechnung
  const toLin = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const fromLin = (c) => {
    c = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, c * 255));
  };
  function hexToRgb(hex) {
    let h = String(hex).trim().replace(/^#/, '');
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    if (!/^[0-9a-f]{6}/i.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  }
  const rgbToHex = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

  function oklab({ r, g, b }) {
    const R = toLin(r),
      G = toLin(g),
      B = toLin(b);
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
    const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
    const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return {
      L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    };
  }
  function oklch(rgb) {
    const { L, a, b } = oklab(rgb);
    const C = Math.hypot(a, b);
    let h = (Math.atan2(b, a) * 180) / Math.PI;
    if (h < 0) h += 360;
    return { L, C, h };
  }
  const deltaE = (p, q) => Math.hypot(p.L - q.L, p.a - q.a, p.b - q.b);
  // #endregion

  // #region Beschreibung
  // Farbton-Familien in OKLCH-Grad. Alle deutschen Farbnomen sind sächlich ("das Blau"),
  // daher passen Adjektive auf "-es" immer.
  const FAMILIES = [
    { to: 12, de: 'Rosarot', en: 'rose red' },
    { to: 40, de: 'Rot', en: 'red' },
    { to: 62, de: 'Orange', en: 'orange' },
    { to: 85, de: 'Bernsteingelb', en: 'amber' },
    { to: 118, de: 'Gelb', en: 'yellow' },
    { to: 138, de: 'Gelbgrün', en: 'yellow green' },
    { to: 165, de: 'Grün', en: 'green' },
    { to: 200, de: 'Türkis', en: 'teal' },
    { to: 235, de: 'Himmelblau', en: 'azure blue' },
    { to: 270, de: 'Blau', en: 'blue' },
    { to: 290, de: 'Indigoblau', en: 'indigo blue' },
    { to: 315, de: 'Violett', en: 'violet' },
    { to: 340, de: 'Purpur', en: 'purple' },
    { to: 361, de: 'Pink', en: 'pink' },
  ];
  const familyOf = (h) => FAMILIES.find((f) => h < f.to);

  function describe(rgb, lang = 'de') {
    const { L, C, h } = oklch(rgb);
    const de = lang === 'de';
    // Unbunt
    if (C < 0.022) {
      if (L < 0.2) return de ? 'Schwarz' : 'black';
      if (L > 0.96) return de ? 'Weiss' : 'white';
      const tone = L < 0.4 ? (de ? 'Dunkelgrau' : 'dark grey') : L < 0.62 ? (de ? 'Grau' : 'grey') : L < 0.82 ? (de ? 'Hellgrau' : 'light grey') : de ? 'sehr helles Grau' : 'very light grey';
      if (C < 0.008) return tone;
      const fam = familyOf(h);
      return de ? `${tone} mit ${fam.de}stich` : `${tone} with a ${fam.en} tint`;
    }

    let fam = familyOf(h);
    let noun = de ? fam.de : fam.en;
    // Sondernamen, die Menschen tatsächlich benutzen
    if (h >= 30 && h < 95 && L < 0.6) noun = h < 85 ? (de ? 'Braun' : 'brown') : de ? 'Olivbraun' : 'olive brown';
    else if (h >= 95 && h < 125 && L < 0.7) noun = de ? 'Oliv' : 'olive';
    else if (h >= 40 && h < 110 && L >= 0.82 && C < 0.09) noun = de ? 'Beige' : 'beige';
    else if (h >= 60 && h < 115 && L >= 0.65 && C < 0.08) noun = de ? 'Khaki' : 'khaki';
    else if (h >= 12 && h < 45 && L >= 0.72 && C < 0.16) noun = de ? 'Lachsrosa' : 'salmon pink';
    else if ((h >= 340 || h < 12) && L >= 0.78) noun = de ? 'Rosa' : 'pink';
    else if ((h >= 340 || h < 25) && L < 0.45) noun = de ? 'Weinrot' : 'wine red';
    else if (h >= 235 && h < 275 && L < 0.36) noun = de ? 'Marineblau' : 'navy blue';
    else if (h >= 165 && h < 215 && L < 0.5) noun = de ? 'Petrol' : 'teal';
    else if (h >= 290 && h < 330 && L >= 0.72) noun = de ? 'Lavendel' : 'lavender';
    else if (h >= 315 && h < 340 && L < 0.36) noun = de ? 'Aubergine' : 'plum';
    else if (h >= 315 && h < 345 && L >= 0.6 && C > 0.2) noun = de ? 'Magenta' : 'magenta';

    const adj = [];
    if (L < 0.3) adj.push(de ? 'sehr dunkles' : 'very dark');
    else if (L < 0.47) adj.push(de ? 'dunkles' : 'dark');
    else if (L > 0.88) adj.push(de ? 'sehr helles' : 'very light');
    else if (L > 0.74) adj.push(de ? 'helles' : 'light');
    const soft = ['Beige', 'beige', 'Khaki', 'khaki', 'Rosa', 'pink', 'Lachsrosa', 'salmon pink', 'Lavendel', 'lavender'].includes(noun);
    if (soft) {
      // Diese Namen sagen schon "blass" – kein zusätzliches Sättigungs-Adjektiv
    } else if (C < 0.06) adj.push(de ? 'gräuliches' : 'greyish');
    else if (C < 0.1) adj.push(de ? 'gedecktes' : 'muted');
    else if (C > 0.2) adj.push(de ? 'leuchtendes' : 'vivid');
    else if (C > 0.15) adj.push(de ? 'kräftiges' : 'strong');
    // Doppelte Aussagen vermeiden ("dunkles Marineblau" ist ok, "helles Rosa" auch)
    let out = [...adj, noun].join(' ');
    if (de) {
      // Mehrere Adjektive: nur das letzte bekommt die starke Endung, davor Komma ("dunkles, kräftiges Blau")
      if (adj.length === 2) out = `${adj[0]}, ${adj[1]} ${noun}`;
    }
    return out;
  }
  // #endregion

  // #region Gängige Farbnamen (DE / EN, eigene Liste)
  // [hex, Deutsch, Englisch]
  const BASIC = [
    ['000000', 'Schwarz', 'Black'], ['2b2b2b', 'Graphitschwarz', 'Jet black'], ['383e42', 'Anthrazit', 'Anthracite'],
    ['555555', 'Dunkelgrau', 'Dark grey'], ['808080', 'Grau', 'Grey'], ['a9a9a9', 'Mittelgrau', 'Medium grey'],
    ['c0c0c0', 'Silber', 'Silver'], ['d3d3d3', 'Hellgrau', 'Light grey'], ['f5f5f5', 'Weissgrau', 'White smoke'],
    ['ffffff', 'Weiss', 'White'], ['fffdd0', 'Creme', 'Cream'], ['fffff0', 'Elfenbein', 'Ivory'],
    ['f5f5dc', 'Beige', 'Beige'], ['e1c699', 'Sand', 'Sand'], ['c2b280', 'Khaki', 'Khaki'],
    ['8b0000', 'Dunkelrot', 'Dark red'], ['800020', 'Bordeaux', 'Burgundy'], ['722f37', 'Weinrot', 'Wine'],
    ['960018', 'Karminrot', 'Carmine'], ['b22222', 'Ziegelrot', 'Firebrick'], ['dc143c', 'Purpurrot', 'Crimson'],
    ['ff0000', 'Rot', 'Red'], ['e32636', 'Signalrot', 'Signal red'], ['ff2400', 'Scharlachrot', 'Scarlet'],
    ['ff4f00', 'Leuchtorange', 'International orange'], ['ff7f50', 'Koralle', 'Coral'], ['fa8072', 'Lachs', 'Salmon'],
    ['ffa07a', 'Hellachs', 'Light salmon'], ['e2725b', 'Terrakotta', 'Terracotta'], ['b7410e', 'Rost', 'Rust'],
    ['ff8c00', 'Dunkelorange', 'Dark orange'], ['ffa500', 'Orange', 'Orange'], ['fbceb1', 'Aprikose', 'Apricot'],
    ['ffdab9', 'Pfirsich', 'Peach'], ['ffbf00', 'Bernstein', 'Amber'], ['ffd700', 'Goldgelb', 'Gold'],
    ['d4af37', 'Altgold', 'Metallic gold'], ['ffff00', 'Gelb', 'Yellow'], ['fff44f', 'Zitronengelb', 'Lemon yellow'],
    ['fafad2', 'Hellgelb', 'Light yellow'], ['e1ad01', 'Senfgelb', 'Mustard'], ['cc7722', 'Ocker', 'Ochre'],
    ['964b00', 'Braun', 'Brown'], ['7b3f00', 'Schokobraun', 'Chocolate'], ['954535', 'Kastanienbraun', 'Chestnut'],
    ['8b4513', 'Sattelbraun', 'Saddle brown'], ['a0522d', 'Siena', 'Sienna'], ['d2b48c', 'Hellbraun', 'Tan'],
    ['c19a6b', 'Kamel', 'Camel'], ['6f4e37', 'Kaffeebraun', 'Coffee'], ['3d2b1f', 'Dunkelbraun', 'Dark brown'],
    ['808000', 'Oliv', 'Olive'], ['556b2f', 'Olivgrün', 'Dark olive green'], ['6b8e23', 'Moosgrün', 'Moss green'],
    ['9acd32', 'Gelbgrün', 'Yellow green'], ['bfff00', 'Limette', 'Lime'], ['7cfc00', 'Rasengrün', 'Lawn green'],
    ['00ff00', 'Neongrün', 'Neon green'], ['32cd32', 'Hellgrün', 'Lime green'], ['4caf50', 'Grasgrün', 'Grass green'],
    ['008000', 'Grün', 'Green'], ['228b22', 'Waldgrün', 'Forest green'], ['013220', 'Tannengrün', 'Dark green'],
    ['2e8b57', 'Seegrün', 'Sea green'], ['50c878', 'Smaragdgrün', 'Emerald'], ['9dc183', 'Salbeigrün', 'Sage'],
    ['98ff98', 'Mintgrün', 'Mint'], ['aaf0d1', 'Pastellmint', 'Magic mint'], ['00a86b', 'Jadegrün', 'Jade'],
    ['008080', 'Petrol', 'Teal'], ['005f6a', 'Dunkelpetrol', 'Deep teal'], ['40e0d0', 'Türkis', 'Turquoise'],
    ['00ffff', 'Cyan', 'Cyan'], ['7fffd4', 'Aquamarin', 'Aquamarine'], ['b0e0e6', 'Puderblau', 'Powder blue'],
    ['87ceeb', 'Himmelblau', 'Sky blue'], ['add8e6', 'Hellblau', 'Light blue'], ['89cff0', 'Babyblau', 'Baby blue'],
    ['007fff', 'Azurblau', 'Azure'], ['1e90ff', 'Dodgerblau', 'Dodger blue'], ['4682b4', 'Stahlblau', 'Steel blue'],
    ['6699cc', 'Taubenblau', 'Dove blue'], ['0047ab', 'Kobaltblau', 'Cobalt blue'], ['4169e1', 'Königsblau', 'Royal blue'],
    ['0000ff', 'Blau', 'Blue'], ['120a8f', 'Ultramarin', 'Ultramarine'], ['00008b', 'Dunkelblau', 'Dark blue'],
    ['000080', 'Marineblau', 'Navy'], ['191970', 'Mitternachtsblau', 'Midnight blue'], ['1c2841', 'Nachtblau', 'Night blue'],
    ['4b0082', 'Indigo', 'Indigo'], ['3f00ff', 'Elektrisches Indigo', 'Electric indigo'], ['6a5acd', 'Schieferblau', 'Slate blue'],
    ['483d8b', 'Dunkles Schieferblau', 'Dark slate blue'], ['8a2be2', 'Blauviolett', 'Blue violet'], ['7f00ff', 'Violett', 'Violet'],
    ['9400d3', 'Dunkelviolett', 'Dark violet'], ['e6e6fa', 'Lavendelweiss', 'Lavender mist'], ['b57edc', 'Lavendel', 'Lavender'],
    ['c8a2c8', 'Flieder', 'Lilac'], ['a87cc8', 'Lila', 'Light purple'], ['9966cc', 'Amethyst', 'Amethyst'],
    ['800080', 'Purpur', 'Purple'], ['614051', 'Aubergine', 'Eggplant'], ['8e4585', 'Pflaume', 'Plum'],
    ['da70d6', 'Orchidee', 'Orchid'], ['ff00ff', 'Magenta', 'Magenta'], ['c71585', 'Mittelviolettrot', 'Medium violet red'],
    ['ff1493', 'Tiefrosa', 'Deep pink'], ['ff69b4', 'Pink', 'Hot pink'], ['e30b5c', 'Himbeerrot', 'Raspberry'],
    ['ffc0cb', 'Rosa', 'Pink'], ['ffb6c1', 'Hellrosa', 'Light pink'], ['c08081', 'Altrosa', 'Old rose'],
    ['f4c2c2', 'Babyrosa', 'Baby pink'], ['de5d83', 'Rosenrot', 'Blush'], ['b03060', 'Brombeer', 'Maroon rose'],
  ];
  const BASIC_LAB = BASIC.map(([hex, de, en]) => ({ hex: '#' + hex, de, en, lab: oklab(hexToRgb(hex)) }));

  function basicName(rgb, lang = 'de') {
    const lab = oklab(rgb);
    let best = null;
    for (const c of BASIC_LAB) {
      const d = deltaE(lab, c.lab);
      if (!best || d < best.d) best = { ...c, d };
    }
    return { name: lang === 'de' ? best.de : best.en, hex: best.hex, dE: best.d * 100 };
  }
  // #endregion

  // #region Datenbank-Namen (color-name-list, nachgeladen)
  let named = null;
  let loading = null;
  function loadNames(base = '../shared/vendor/') {
    if (named) return Promise.resolve(named);
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const done = () => {
        named = (window.TV_COLOR_NAMES || '').split('|').map((e) => {
          const hex = '#' + e.slice(0, 6);
          return { hex, name: e.slice(6), lab: oklab(hexToRgb(hex)) };
        });
        resolve(named);
      };
      if (window.TV_COLOR_NAMES) return done();
      const s = document.createElement('script');
      s.src = base + 'colornames.js';
      s.onload = done;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return loading;
  }
  function namedColor(rgb) {
    if (!named) return null;
    const lab = oklab(rgb);
    let best = null;
    for (const c of named) {
      const d = deltaE(lab, c.lab);
      if (!best || d < best.d) best = { ...c, d };
    }
    return { name: best.name, hex: best.hex, dE: best.d * 100 };
  }
  // #endregion

  // #region Farbschwäche-Simulation (Machado et al. 2009, Schweregrad 1.0)
  const CVD = {
    protan: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
    deutan: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
    tritan: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039],
    achroma: [0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722, 0.2126, 0.7152, 0.0722],
  };
  const ID = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  // Lineare Interpolation zwischen normalem Sehen und vollständiger Ausprägung
  // (Anomalie: "-anomalie" ≈ Schweregrad < 1)
  function matrix(type, severity = 1) {
    const m = CVD[type];
    if (!m) return ID;
    return m.map((v, i) => ID[i] + (v - ID[i]) * severity);
  }
  function simulate(rgb, type, severity = 1) {
    if (!type || type === 'normal') return { ...rgb };
    const m = matrix(type, severity);
    const R = toLin(rgb.r),
      G = toLin(rgb.g),
      B = toLin(rgb.b);
    return {
      r: fromLin(m[0] * R + m[1] * G + m[2] * B),
      g: fromLin(m[3] * R + m[4] * G + m[5] * B),
      b: fromLin(m[6] * R + m[7] * G + m[8] * B),
    };
  }
  // Lookup-Tabellen für schnelle Bildverarbeitung
  const LIN = new Float32Array(256).map((_, i) => toLin(i));
  const GAMMA = new Uint8ClampedArray(4096).map((_, i) => Math.round(fromLin(i / 4095)));
  function simulateImageData(img, type, severity = 1) {
    const d = img.data;
    const m = matrix(type, severity);
    for (let i = 0; i < d.length; i += 4) {
      const R = LIN[d[i]],
        G = LIN[d[i + 1]],
        B = LIN[d[i + 2]];
      d[i] = GAMMA[Math.max(0, Math.min(4095, ((m[0] * R + m[1] * G + m[2] * B) * 4095) | 0))];
      d[i + 1] = GAMMA[Math.max(0, Math.min(4095, ((m[3] * R + m[4] * G + m[5] * B) * 4095) | 0))];
      d[i + 2] = GAMMA[Math.max(0, Math.min(4095, ((m[6] * R + m[7] * G + m[8] * B) * 4095) | 0))];
    }
    return img;
  }
  // Daltonisierung: verlorene Farbinformation auf noch sichtbare Kanäle verschieben
  function daltonizeImageData(img, type, strength = 1) {
    const d = img.data;
    const m = matrix(type, 1);
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i],
        g = d[i + 1],
        b = d[i + 2];
      const R = LIN[r],
        G = LIN[g],
        B = LIN[b];
      const sr = fromLin(m[0] * R + m[1] * G + m[2] * B);
      const sg = fromLin(m[3] * R + m[4] * G + m[5] * B);
      const sb = fromLin(m[6] * R + m[7] * G + m[8] * B);
      const er = r - sr,
        eg = g - sg,
        eb = b - sb;
      // Fehler-Umverteilung nach Fidaner et al.: Rot-Fehler auf Grün/Blau,
      // bei Tritan umgekehrt der Blau-Fehler auf Rot/Grün
      if (type === 'tritan') {
        d[i] = r + strength * (0.7 * eb + er);
        d[i + 1] = g + strength * (0.7 * eb + eg);
      } else {
        d[i + 1] = g + strength * (0.7 * er + eg);
        d[i + 2] = b + strength * (0.7 * er + eb);
      }
    }
    return img;
  }
  // #endregion

  window.TVColor = {
    hexToRgb,
    rgbToHex,
    oklab,
    oklch,
    deltaE,
    describe,
    basicName,
    loadNames,
    namedColor,
    simulate,
    simulateImageData,
    daltonizeImageData,
    matrix,
    TYPES: ['protan', 'deutan', 'tritan', 'achroma'],
  };
})();
