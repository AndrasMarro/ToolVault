/* Unit Converter · deutsche Oberfläche
   Übersetzt angezeigte Texte (auch dynamisch gerenderte) per Textknoten-Ersetzung,
   ohne die Rechenlogik anzufassen. Beim Wechsel auf EN wird der Originaltext
   wiederhergestellt. Einheitenkürzel und Formeln bleiben international. */
(function () {
  'use strict';

  // Exakte Texte (getrimmt)
  const EXACT = {
    '// unit converter ·': '// einheiten-rechner ·',
    'CET · SI · imperial · derived · physics': 'MEZ · SI · imperial · abgeleitet · Physik',
    Convert: 'Alles',
    anything: 'umrechnen',
    ', show the math.': ', mit Rechenweg.',
    'Six modes, fifteen categories, scientific steps, engineering notation, physics and chemistry solvers and live exchange rates.':
      'Sechs Modi, fünfzehn Kategorien, Rechenschritte, technische Notation, Physik- und Chemie-Rechner und Live-Wechselkurse.',
    '01 / MODE': '01 / MODUS',
    '02 / MODE': '02 / MODUS',
    '03 / MODE': '03 / MODUS',
    '04 / MODE': '04 / MODUS',
    '05 / MODE': '05 / MODUS',
    '06 / MODE': '06 / MODUS',
    Basic: 'Einfach',
    'Quick · result only': 'Schnell · nur Ergebnis',
    Scientific: 'Wissenschaftlich',
    'Steps · formulas · SI': 'Schritte · Formeln · SI',
    Engineering: 'Technik',
    'Sci. notation · high precision': 'Exponent · hohe Genauigkeit',
    Physics: 'Physik',
    'Formulas · solve any variable': 'Formeln · nach jeder Grösse lösen',
    Chemistry: 'Chemie',
    'Moles · concentration · density': 'Mol · Konzentration · Dichte',
    Currency: 'Währung',
    'Live FX · 160+ pairs': 'Live-Kurse · 160+ Paare',
    Precision: 'Genauigkeit',
    decimals: 'Nachkommastellen',
    Notation: 'Notation',
    Auto: 'Automatisch',
    Decimal: 'Dezimal',
    'Scientific (e)': 'Wissenschaftlich (e)',
    'Engineering (10³)': 'Technisch (10³)',
    'Mode: clean result only': 'Modus: nur das Ergebnis',
    'Mode: step-by-step + formulas + SI base': 'Modus: Schritt für Schritt + Formeln + SI-Basis',
    'Mode: scientific notation enforced': 'Modus: wissenschaftliche Notation',
    'Mode: solve for any variable': 'Modus: nach jeder Grösse auflösen',
    'Mode: chemistry calculations': 'Modus: Chemie-Berechnungen',
    Input: 'Eingabe',
    Readout: 'Anzeige',
    Category: 'Kategorie',
    Value: 'Wert',
    From: 'Von',
    To: 'Nach',
    '↔ Swap units': '↔ Einheiten tauschen',
    BASIC: 'EINFACH',
    SCIENTIFIC: 'WISSENSCHAFTLICH',
    ENGINEERING: 'TECHNIK',
    CHEM: 'CHEMIE',
    'Conversion breakdown': 'Rechenweg',
    'dimensions preserved': 'Dimension bleibt erhalten',
    'SI base:': 'SI-Basis:',
    'Formula select': 'Formel wählen',
    Variables: 'Grössen',
    'Solve for': 'Auflösen nach',
    Solution: 'Lösung',
    'Fill in the other variables': 'Die anderen Grössen ausfüllen',
    "Newton's 2nd Law": '2. Newtonsches Gesetz',
    'Kinetic Energy': 'Kinetische Energie',
    'Gravitational PE': 'Lageenergie',
    Momentum: 'Impuls',
    "Ohm's Law": 'Ohmsches Gesetz',
    'Electrical Power': 'Elektrische Leistung',
    'Wave Equation': 'Wellengleichung',
    'Photon Energy': 'Photonenenergie',
    'Mass-Energy': 'Masse-Energie',
    'Chemistry tools': 'Chemie-Werkzeuge',
    'Moles ↔ grams': 'Mol ↔ Gramm',
    Tool: 'Werkzeug',
    'Mol ↔ g': 'Mol ↔ g',
    'Concentration (mol/L)': 'Konzentration (mol/L)',
    Density: 'Dichte',
    'Molar mass M (g/mol)': 'Molare Masse M (g/mol)',
    'Moles (n)': 'Stoffmenge (n)',
    'Mass (g)': 'Masse (g)',
    Fill: 'Fülle',
    one: 'eines',
    'of n or m. The other is calculated.': 'von n oder m aus. Das andere wird berechnet.',
    Formula: 'Formel',
    'Common molar masses': 'Häufige molare Massen',
    '◯ Offline': '◯ Offline',
    '● Live': '● Live',
    '↻ Refresh': '↻ Aktualisieren',
    'You send': 'Du sendest',
    'They receive': 'Empfänger erhält',
    'Popular vs USD': 'Beliebt gegenüber USD',
    Close: 'Schliessen',
    About: 'Über',
    'A precision unit conversion instrument. Six modes, fifteen categories, real-time FX. Built for engineers, students, and anyone who needs the answer right.':
      'Ein präzises Umrechnungs-Instrument. Sechs Modi, fünfzehn Kategorien, Echtzeit-Wechselkurse. Für Technik, Studium und alle, die die richtige Antwort brauchen.',
    'Modes at a glance': 'Modi im Überblick',
    '— fast lookup': '— schnell nachschlagen',
    '— shows the math': '— zeigt den Rechenweg',
    '— sci. notation': '— Exponentschreibweise',
    '— formula solver': '— Formel-Löser',
    Coverage: 'Abdeckung',
    'Length · Mass · Volume · Temperature · Time · Speed · Area · Pressure · Force · Energy · Power · Frequency · Voltage · Current · Resistance · Data':
      'Länge · Masse · Volumen · Temperatur · Zeit · Geschwindigkeit · Fläche · Druck · Kraft · Energie · Leistung · Frequenz · Spannung · Strom · Widerstand · Daten',
    'FX data': 'Wechselkurse',
    'Live rates via open.er-api.com. Updates daily. Offline fallback included.': 'Live-Kurse von open.er-api.com, täglich aktualisiert. Mit Offline-Ersatzwerten.',
    'runs locally in your browser': 'läuft lokal im Browser',
    'Unit Converter v2.2': 'Einheiten-Rechner v2.2',
  };

  // Kategorien und häufige Begriffe – werden auch innerhalb längerer Texte ersetzt
  const TERMS = [
    ['Mass / Weight', 'Masse / Gewicht'],
    ['Electric Current', 'Elektrischer Strom'],
    ['Digital Storage', 'Speicher'],
    ['Temperature', 'Temperatur'],
    ['Resistance', 'Widerstand'],
    ['Frequency', 'Frequenz'],
    ['Pressure', 'Druck'],
    ['Voltage', 'Spannung'],
    ['Length', 'Länge'],
    ['Volume', 'Volumen'],
    ['Energy', 'Energie'],
    ['Power', 'Leistung'],
    ['Speed', 'Geschwindigkeit'],
    ['Force', 'Kraft'],
    ['Area', 'Fläche'],
    ['Time', 'Zeit'],
    ['Mass', 'Masse'],
    ['Acceleration', 'Beschleunigung'],
    ['Velocity', 'Geschwindigkeit'],
    ['Height', 'Höhe'],
    ['Current', 'Strom'],
    ['Wavelength', 'Wellenlänge'],
    ['Result', 'Ergebnis'],
    ['Foreign Exchange', 'Devisen'],
    ['base', 'Basis'],
    ['dim', 'Dim.'],
    ['equations', 'Formeln'],
    ['astronomical unit', 'Astronomische Einheit'],
    ['light-year', 'Lichtjahr'],
    ['nanometer', 'Nanometer'],
    ['micrometer', 'Mikrometer'],
    ['millimeter', 'Millimeter'],
    ['centimeter', 'Zentimeter'],
    ['kilometer', 'Kilometer'],
    ['meter', 'Meter'],
    ['inch', 'Zoll'],
    ['foot', 'Fuss'],
    ['mile', 'Meile'],
    ['gram', 'Gramm'],
    ['kilogram', 'Kilogramm'],
    ['ounce', 'Unze'],
    ['pound', 'Pfund'],
    ['liter', 'Liter'],
    ['milliliter', 'Milliliter'],
    ['gallon', 'Gallone'],
    ['second', 'Sekunde'],
    ['minute', 'Minute'],
    ['hour', 'Stunde'],
    ['day', 'Tag'],
    ['week', 'Woche'],
    ['year', 'Jahr'],
  ].sort((a, b) => b[0].length - a[0].length);
  const TERM_RE = new RegExp('\\b(' + TERMS.map(([e]) => e.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|') + ')\\b', 'g');
  const TERM_MAP = Object.fromEntries(TERMS);

  // Satzanfänge des Rechenwegs
  const PREFIX = [
    ['Identify:', 'Bestimmen:'],
    ['Step to SI base:', 'Zur SI-Basis:'],
    ['SI base to target:', 'Von SI-Basis zum Ziel:'],
    ['Direct factor:', 'Direkter Faktor:'],
    ['Dimensional analysis:', 'Dimensionsanalyse:'],
    ['Precision:', 'Genauigkeit:'],
    ['Dimensions:', 'Dimensionen:'],
    ['SI base unit:', 'SI-Basiseinheit:'],
    ['significant decimals', 'signifikante Nachkommastellen'],
    ['Note:', 'Hinweis:'],
    ['temperature is an affine (offset) scale — conversions involve an additive constant, not pure multiplication', 'Temperatur ist eine Skala mit Nullpunkt-Verschiebung – die Umrechnung addiert eine Konstante statt nur zu multiplizieren'],
    ['non-linear', 'nicht linear'],
    ['SI conversion', 'SI-Umrechnung'],
    ['No conversion available.', 'Keine Umrechnung verfügbar.'],
  ];

  const PH = {
    'enter number — e.g. 1.5e3': 'Zahl eingeben – z. B. 1.5e3',
    'Search: EUR, Japan, Yen…': 'Suchen: EUR, Japan, Yen …',
    'e.g. 18.015 for H₂O': 'z. B. 18.015 für H₂O',
    auto: 'automatisch',
  };

  function translate(s) {
    const trimmed = s.trim();
    if (!trimmed) return s;
    const lead = s.slice(0, s.indexOf(trimmed[0]));
    const tail = s.slice(lead.length + trimmed.length);
    if (EXACT[trimmed] !== undefined) return lead + EXACT[trimmed] + tail;
    // Einheiten-Auswahl "inch — inch": Kürzel links bleibt, nur der Name rechts wird übersetzt
    const unit = trimmed.match(/^(\S+) — (.+)$/);
    if (unit) return lead + unit[1] + ' — ' + unit[2].replace(TERM_RE, (m) => TERM_MAP[m] || m) + tail;
    let out = trimmed;
    PREFIX.forEach(([e, d]) => (out = out.split(e).join(d)));
    out = out.replace(TERM_RE, (m) => TERM_MAP[m] || m);
    return lead + out + tail;
  }

  // Original pro Textknoten merken, damit EN wiederhergestellt werden kann
  const original = new WeakMap();
  const translated = new WeakMap();
  const SKIP = 'script,style,.fx-picker-list,.wordmark,.themes,#lang,#clock,input,textarea';
  let lang = 'en';

  function applyNode(n) {
    if (n.nodeType !== 3 || !n.nodeValue.trim()) return;
    const p = n.parentElement;
    if (!p || p.closest(SKIP)) return;
    // Hat das Tool den Text inzwischen selbst geändert? Dann ist das der neue Originaltext
    if (!original.has(n) || (translated.get(n) !== n.nodeValue && original.get(n) !== n.nodeValue)) original.set(n, n.nodeValue);
    const orig = original.get(n);
    const want = lang === 'de' ? translate(orig) : orig;
    if (n.nodeValue !== want) n.nodeValue = want;
    translated.set(n, want);
  }
  function applyAttrs(root) {
    (root.querySelectorAll ? root.querySelectorAll('[placeholder]') : []).forEach((el) => {
      if (!el.dataset.phOrig) el.dataset.phOrig = el.placeholder;
      const o = el.dataset.phOrig;
      el.placeholder = lang === 'de' ? PH[o] || o : o;
    });
  }
  function applyTree(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) applyNode(n);
    applyAttrs(root);
  }

  let busy = false;
  const mo = new MutationObserver((list) => {
    if (busy) return;
    busy = true;
    list.forEach((m) => {
      if (m.type === 'characterData') applyNode(m.target);
      m.addedNodes.forEach((n) => (n.nodeType === 3 ? applyNode(n) : n.nodeType === 1 && applyTree(n)));
    });
    mo.takeRecords();
    busy = false;
  });

  window.UnitI18n = {
    set(l) {
      lang = l === 'de' ? 'de' : 'en';
      busy = true;
      applyTree(document.body);
      mo.takeRecords();
      busy = false;
    },
    start() {
      mo.observe(document.body, { subtree: true, childList: true, characterData: true });
    },
  };
})();
