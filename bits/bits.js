/* Bit Lab · Zahlensysteme umrechnen, rechnen (+ − × ÷) und Logik (AND, OR, XOR …).
   Zwei Ansichten: „Rechner“ (sofort) und „Rechenweg“ (Schritt für Schritt animiert + erklärt).
   Gerechnet wird mit BigInt: beliebig große ganze Zahlen, ohne Rundungsfehler.

   Aufbau:
   - parse/fmt/digits        Zahlen lesen und schreiben (Basis 2–36)
   - gen*                    erzeugen die Schritte für den Rechenweg: { html, text }
   - renderQuick/renderLearn Darstellung, Player für die Schritte */
(() => {
  'use strict';
  const { $, $$, esc } = TV;
  const DIG = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const COMMON = [2, 8, 10, 16];
  const BNAME = { 2: 'BIN', 8: 'OCT', 10: 'DEC', 16: 'HEX' };
  const ASYM = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const LOGIC = ['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR', 'XNOR', 'SHL', 'SHR'];
  const LSYM = { AND: 'AND', OR: 'OR', XOR: 'XOR', NOT: 'NOT', NAND: 'NAND', NOR: 'NOR', XNOR: 'XNOR', SHL: '<<', SHR: '>>' };
  const BIT = {
    AND: (a, b) => a & b,
    OR: (a, b) => a | b,
    XOR: (a, b) => a ^ b,
    NAND: (a, b) => 1 - (a & b),
    NOR: (a, b) => 1 - (a | b),
    XNOR: (a, b) => 1 - (a ^ b),
    NOT: (a) => 1 - a,
  };
  const SPEEDS = [2400, 1600, 1100, 700, 380]; // ms pro Schritt

  // #region Texte
  const sup = (n) => `<sup>${n}</sup>`;
  const s = (n, one, many) => (n === 1 ? one : many);
  const STRINGS = {
    de: {
      pageTitle: 'Bit Lab',
      kicker: '// bit lab · zahlensysteme · logik',
      title: 'Bit <span class="accent">Lab</span>',
      lead: 'Binär, Oktal, Dezimal und Hex umrechnen, damit rechnen und Bits verknüpfen – sofort im Rechner oder Schritt für Schritt mit Animation und Erklärung.',
      v_quick: 'Rechner',
      v_learn: 'Rechenweg',
      m_convert: 'Umrechnen',
      m_arith: 'Rechnen',
      m_logic: 'Logik',
      number: 'Zahl',
      from: 'Basis der Eingabe',
      to: 'Zielbasis',
      calcBase: 'Basis der Eingaben',
      opLabel: 'Operation',
      width: 'Bitbreite',
      auto: 'auto',
      shiftBy: 'Verschieben um',
      other: 'andere',
      result: 'Ergebnis',
      quotient: 'Quotient',
      remainder: 'Rest',
      copy: 'Kopieren',
      digits: (n) => `${n} ${s(n, 'Ziffer', 'Ziffern')}`,
      bitsInfo: (n, ones) => `${n} Bit · ${ones} ${s(ones, 'Eins', 'Einsen')}`,
      signed: (w, v) => `Als vorzeichenbehaftete Zahl (Zweierkomplement, ${w} Bit): <b>${v}</b>`,
      bitHint: 'Bits anklicken zum Umschalten · Mauszeiger auf ein Bit zeigt seinen Wert',
      tooWide: 'Das Bitraster zeigt bis zu 64 Bit.',
      intOnly: 'Ganze Zahlen, beliebig groß. Präfixe wie 0b, 0o, 0x werden erkannt.',
      e_digit: (ch, b) => `„${ch}“ ist keine gültige Ziffer zur Basis ${b}.`,
      e_empty: 'Bitte eine Zahl eingeben.',
      e_div0: 'Division durch 0 ist nicht definiert.',
      e_shift: 'Verschiebung: 0 bis 256 Stellen.',
      toLearn: 'Rechenweg ansehen →',
      truncated: (w) => `Auf ${w} Bit gekürzt – überstehende Bits fallen weg.`,
      ctl_first: 'Zum Anfang (Pos1)',
      ctl_prev: 'Zurück (←)',
      ctl_next: 'Weiter (→)',
      ctl_last: 'Zum Ende (Ende)',
      play: '▶ Abspielen',
      pause: '⏸ Pause',
      again: '↺ Nochmal',
      speed: 'Tempo',
      stepOf: (i, n) => `Schritt ${i} / ${n}`,
      keysHint: 'Tastatur: ← → blättern, Leertaste abspielen/pausieren.',
      local: '🔒 Alles läuft lokal im Browser',
      // Umrechnen
      cv_same: (b) => `Quelle und Ziel sind beide Basis ${b} – es gibt nichts umzurechnen.`,
      td_intro: (b) =>
        `<b>Stellenwertsystem:</b> Jede Ziffer zählt so viel wie <b>Ziffer × ${b}${sup('Position')}</b> – die Position wird von rechts gezählt und beginnt bei 0. Alle Werte zusammengezählt ergeben die Dezimalzahl.`,
      td_term: (k, d, dv, b, w, p, sum) =>
        `Position ${k}: Ziffer <b>${d}</b>${dv} × ${b}${sup(k)} (= ${w}) = <b>${p}</b>. Zwischensumme: <b>${sum}</b>.`,
      td_zero: (k) => `Position ${k}: Ziffer 0 – trägt nichts bei.`,
      td_done: (r) => `Alles zusammengezählt: <b>${r}</b>.`,
      fd_intro: (b) =>
        `<b>Wiederholte Division:</b> Die Zahl immer wieder durch ${b} teilen. Der <b>Rest</b> jeder Division ist eine Ziffer des Ergebnisses – von rechts nach links. Weiter, bis der Quotient 0 ist.`,
      fd_step: (n, b, q, r, dig) =>
        `${n} ÷ ${b} = ${q} Rest <b>${r}</b>${dig !== String(r) ? ` → Ziffer <b>${dig}</b>` : ''}.`,
      fd_read: 'Die Reste <b>von unten nach oben</b> gelesen ergeben das Ergebnis.',
      fd_zero: '0 ist in jeder Basis einfach 0.',
      gr_to: (to, g) =>
        `${to} = 2${sup(g)}: Darum entsprechen immer <b>${g} Bits genau einer Ziffer</b> zur Basis ${to}. Die Binärzahl wird von rechts in ${g}er-Gruppen geteilt.`,
      gr_pad: (z) => `Links ${z} ${s(z, 'Null', 'Nullen')} ergänzen, damit jede Gruppe voll ist – der Wert bleibt gleich.`,
      gr_group: (bits, expr, val, dig) => `Gruppe <b>${bits}</b> = ${expr} = ${val} → Ziffer <b>${dig}</b>.`,
      gr_from: (from, g) => `${from} = 2${sup(g)}: Jede Ziffer wird zu genau <b>${g} Bits</b> – einfach nachschlagen oder in Zweierpotenzen zerlegen.`,
      gr_expand: (d, val, bits) => `Ziffer <b>${d}</b> (= ${val}) → <b>${bits}</b>.`,
      gr_trim: 'Führende Nullen weglassen – fertig.',
      via_dec: (f, t) => `Zwischen Basis ${f} und ${t} gibt es keine Abkürzung – wir rechnen über das Dezimalsystem: erst nach 10, dann nach ${t}.`,
      via_bin: (f, t) => `Beide Basen sind Zweierpotenzen – die Abkürzung führt über das Binärsystem: Basis ${f} → 2 → ${t}.`,
      phase2: (t) => `Jetzt die Dezimalzahl in Basis ${t} umrechnen.`,
      phase2bin: (t) => `Jetzt die Binärzahl in Basis ${t} gruppieren.`,
      // Rechnen
      neg_note: (e) => `<b>Negative Zahlen:</b> Wir rechnen mit den Beträgen und setzen das Vorzeichen am Ende. ${e}`,
      neg_add_same: 'Beide negativ → Beträge addieren, Ergebnis negativ.',
      neg_add_mix: (big) => `Unterschiedliche Vorzeichen → größeren minus kleineren Betrag, Vorzeichen von ${big}.`,
      neg_sub: 'Minus einer negativen Zahl ist Plus: a − (−b) = a + b.',
      neg_mul: (neg) => (neg ? 'Ungleiche Vorzeichen → Ergebnis negativ.' : 'Gleiche Vorzeichen → Ergebnis positiv.'),
      add_intro: (b) =>
        `<b>Schriftliche Addition</b> zur Basis ${b}: Stelle für Stelle von rechts. Wird eine Summe ${b} oder größer, schreiben wir den Rest hin und geben einen <b>Übertrag</b> an die nächste Stelle weiter.`,
      add_col: (k, a, b, c, sum, base, dig, carry) =>
        `Stelle ${k}: ${a} + ${b}${c ? ` + Übertrag ${c}` : ''} = ${sum}` +
        (carry ? ` = ${carry}·${base} + ${dig} → <b>${dig}</b> schreiben, Übertrag <b>${carry}</b>.` : ` → <b>${dig}</b> schreiben.`),
      add_last: (c) => `Der letzte Übertrag ${c} wird zur vordersten Ziffer.`,
      sub_intro: (b) =>
        `<b>Schriftliche Subtraktion</b> zur Basis ${b}: Stelle für Stelle von rechts. Ist die obere Ziffer zu klein, <b>leihen</b> wir 1 von der nächsten Stelle – dort ist sie ${b} wert.`,
      sub_swap: 'A ist kleiner als B → wir rechnen B − A und setzen ein Minus vor das Ergebnis.',
      sub_col: (k, a, bin, b, dig) => `Stelle ${k}: ${a}${bin ? ` − geliehen ${bin}` : ''} − ${b} = <b>${dig}</b>.`,
      sub_borrow: (k, a, bin, b, base, dig) =>
        `Stelle ${k}: ${a}${bin ? ` − ${bin}` : ''} ist kleiner als ${b} → 1 von links leihen (= ${base}): ${a}${bin ? ` − ${bin}` : ''} + ${base} − ${b} = <b>${dig}</b>.`,
      sub_trim: 'Führende Nullen weglassen.',
      mul_intro: (b) =>
        b === 2
          ? '<b>Binäre Multiplikation</b> ist besonders einfach: Für jede 1 in B wird A abgeschrieben – passend nach links verschoben. Für jede 0 gibt es nur Nullen. Danach alles addieren.'
          : `<b>Schriftliche Multiplikation</b> zur Basis ${b}: A mit jeder Ziffer von B multiplizieren, jedes Teilprodukt um seine Position nach links verschieben, dann alles addieren.`,
      mul_row: (j, d, p, base) =>
        base === 2
          ? d === '1'
            ? `Ziffer ${j} von B ist 1 → A abschreiben, um ${j} ${s(j, 'Stelle', 'Stellen')} nach links verschoben.`
            : `Ziffer ${j} von B ist 0 → nur Nullen.`
          : `Ziffer ${j} von B ist <b>${d}</b>: A × ${d} = ${p}, um ${j} ${s(j, 'Stelle', 'Stellen')} nach links verschoben.`,
      mul_sum: 'Die Teilprodukte stellenweise addieren (mit Übertrag wie bei der Addition):',
      div_intro: (b) =>
        `<b>Schriftliche Division</b> zur Basis ${b}: Ziffern von A der Reihe nach herunterholen. Wie oft passt B in die aktuelle Zahl? Das ist die nächste Ziffer des Ergebnisses – abziehen und weiter.`,
      div_gather: (r, y) => `Erst so viele Ziffern holen, bis B hineinpasst: ${r} ≥ ${y}.`,
      div_small: (r, y) => `${r} ist kleiner als B (${y}) und die Zahl ist zu Ende → B passt 0-mal.`,
      div_step: (r, y, q, prod, rem) => `${r} ÷ ${y}: passt <b>${q}</b>-mal. ${r} − ${prod} = <b>${rem}</b>.`,
      div_down: (d, r) => `Nächste Ziffer ${d} herunterholen → ${r}.`,
      div_done: (q, r) => `Ergebnis: <b>${q}</b> Rest <b>${r}</b>. Probe: Quotient × B + Rest = A.`,
      // Logik
      lg: {
        AND: 'AND ergibt nur dann 1, wenn <b>beide</b> Bits 1 sind. Praktisch zum <b>Ausmaskieren</b>: Wo die Maske 0 ist, wird das Ergebnis 0.',
        OR: 'OR ergibt 1, wenn <b>mindestens eines</b> der Bits 1 ist. Praktisch zum <b>Setzen</b> von Bits.',
        XOR: 'XOR (exklusives Oder) ergibt 1, wenn die Bits <b>verschieden</b> sind. Praktisch zum <b>Umschalten</b> von Bits und zum Vergleichen.',
        NOT: 'NOT dreht jedes Bit um: aus 0 wird 1, aus 1 wird 0. Das Ergebnis hängt davon ab, mit wie vielen Bits man rechnet.',
        NAND: 'NAND ist NOT AND: nur dann 0, wenn beide Bits 1 sind. Aus NAND-Gattern allein lässt sich jeder Computer bauen.',
        NOR: 'NOR ist NOT OR: nur dann 1, wenn beide Bits 0 sind.',
        XNOR: 'XNOR ist NOT XOR: 1, wenn beide Bits <b>gleich</b> sind.',
        SHL: (n) => `Linksverschiebung um ${n}: Alle Bits rücken ${n} ${s(n, 'Stelle', 'Stellen')} nach links, rechts kommen Nullen nach. Das ist dasselbe wie <b>× 2${sup(n)}</b>.`,
        SHR: (n) => `Rechtsverschiebung um ${n}: Alle Bits rücken nach rechts, die rechten ${n} Bit fallen weg. Das ist dasselbe wie <b>÷ 2${sup(n)}</b> (abgerundet).`,
      },
      lg_width: (w) => `Gerechnet wird mit ${w} Bit – kürzere Zahlen werden links mit Nullen aufgefüllt.`,
      lg_bit: (k, a, op, b, r) => `Bit ${k}: ${a} ${op} ${b} = <b>${r}</b>.`,
      lg_not: (k, a, r) => `Bit ${k}: NOT ${a} = <b>${r}</b>.`,
      lg_done: 'Fertig – alle Bits verknüpft.',
      sh_move: (n, left) => `Alle Bits wandern ${n} ${s(n, 'Stelle', 'Stellen')} nach ${left ? 'links' : 'rechts'}.`,
      sh_fill: (n, left, lost) =>
        `${left ? 'Rechts' : 'Links'} werden ${n} ${s(n, 'Null', 'Nullen')} aufgefüllt.` + (lost ? ` ${lost} Bit fallen über den Rand und gehen verloren.` : ''),
      res: 'Ergebnis',
      check: 'Probe',
    },
    en: {
      pageTitle: 'Bit Lab',
      kicker: '// bit lab · number bases · logic',
      title: 'Bit <span class="accent">Lab</span>',
      lead: 'Convert between binary, octal, decimal and hex, calculate with them and combine bits – instantly in the calculator or step by step with animation and explanations.',
      v_quick: 'Calculator',
      v_learn: 'Step by step',
      m_convert: 'Convert',
      m_arith: 'Arithmetic',
      m_logic: 'Logic',
      number: 'Number',
      from: 'Input base',
      to: 'Target base',
      calcBase: 'Base of the inputs',
      opLabel: 'Operation',
      width: 'Bit width',
      auto: 'auto',
      shiftBy: 'Shift by',
      other: 'other',
      result: 'Result',
      quotient: 'Quotient',
      remainder: 'Remainder',
      copy: 'Copy',
      digits: (n) => `${n} ${s(n, 'digit', 'digits')}`,
      bitsInfo: (n, ones) => `${n} bit · ${ones} ${s(ones, 'one', 'ones')}`,
      signed: (w, v) => `As a signed number (two's complement, ${w} bit): <b>${v}</b>`,
      bitHint: 'Click bits to toggle · hover a bit to see its value',
      tooWide: 'The bit grid shows up to 64 bits.',
      intOnly: 'Whole numbers of any size. Prefixes like 0b, 0o, 0x are recognised.',
      e_digit: (ch, b) => `"${ch}" is not a valid digit in base ${b}.`,
      e_empty: 'Please enter a number.',
      e_div0: 'Division by 0 is undefined.',
      e_shift: 'Shift: 0 to 256 places.',
      toLearn: 'Show the steps →',
      truncated: (w) => `Cut to ${w} bit – bits beyond that are dropped.`,
      ctl_first: 'To start (Home)',
      ctl_prev: 'Back (←)',
      ctl_next: 'Next (→)',
      ctl_last: 'To end (End)',
      play: '▶ Play',
      pause: '⏸ Pause',
      again: '↺ Replay',
      speed: 'Speed',
      stepOf: (i, n) => `Step ${i} / ${n}`,
      keysHint: 'Keyboard: ← → to step, space to play/pause.',
      local: '🔒 Everything runs locally in your browser',
      cv_same: (b) => `Source and target are both base ${b} – nothing to convert.`,
      td_intro: (b) =>
        `<b>Positional notation:</b> every digit is worth <b>digit × ${b}${sup('position')}</b> – positions are counted from the right, starting at 0. Adding all values gives the decimal number.`,
      td_term: (k, d, dv, b, w, p, sum) =>
        `Position ${k}: digit <b>${d}</b>${dv} × ${b}${sup(k)} (= ${w}) = <b>${p}</b>. Running total: <b>${sum}</b>.`,
      td_zero: (k) => `Position ${k}: digit 0 – adds nothing.`,
      td_done: (r) => `Everything added up: <b>${r}</b>.`,
      fd_intro: (b) =>
        `<b>Repeated division:</b> keep dividing the number by ${b}. The <b>remainder</b> of each division is one digit of the result – from right to left. Stop when the quotient is 0.`,
      fd_step: (n, b, q, r, dig) =>
        `${n} ÷ ${b} = ${q} remainder <b>${r}</b>${dig !== String(r) ? ` → digit <b>${dig}</b>` : ''}.`,
      fd_read: 'Reading the remainders <b>from bottom to top</b> gives the result.',
      fd_zero: '0 is simply 0 in every base.',
      gr_to: (to, g) =>
        `${to} = 2${sup(g)}: so <b>${g} bits are exactly one digit</b> in base ${to}. Split the binary number into groups of ${g} from the right.`,
      gr_pad: (z) => `Add ${z} ${s(z, 'zero', 'zeros')} on the left so every group is full – the value stays the same.`,
      gr_group: (bits, expr, val, dig) => `Group <b>${bits}</b> = ${expr} = ${val} → digit <b>${dig}</b>.`,
      gr_from: (from, g) => `${from} = 2${sup(g)}: every digit becomes exactly <b>${g} bits</b> – look it up or split it into powers of two.`,
      gr_expand: (d, val, bits) => `Digit <b>${d}</b> (= ${val}) → <b>${bits}</b>.`,
      gr_trim: 'Drop the leading zeros – done.',
      via_dec: (f, t) => `There is no shortcut between base ${f} and ${t} – we go through decimal: first to 10, then to ${t}.`,
      via_bin: (f, t) => `Both bases are powers of two – the shortcut goes through binary: base ${f} → 2 → ${t}.`,
      phase2: (t) => `Now convert the decimal number to base ${t}.`,
      phase2bin: (t) => `Now group the binary number into base ${t}.`,
      neg_note: (e) => `<b>Negative numbers:</b> we calculate with the absolute values and set the sign at the end. ${e}`,
      neg_add_same: 'Both negative → add the absolute values, result is negative.',
      neg_add_mix: (big) => `Different signs → larger minus smaller absolute value, sign of ${big}.`,
      neg_sub: 'Subtracting a negative number is adding: a − (−b) = a + b.',
      neg_mul: (neg) => (neg ? 'Different signs → negative result.' : 'Same signs → positive result.'),
      add_intro: (b) =>
        `<b>Column addition</b> in base ${b}: column by column from the right. If a sum is ${b} or more, write down the rest and <b>carry</b> to the next column.`,
      add_col: (k, a, b, c, sum, base, dig, carry) =>
        `Column ${k}: ${a} + ${b}${c ? ` + carry ${c}` : ''} = ${sum}` +
        (carry ? ` = ${carry}·${base} + ${dig} → write <b>${dig}</b>, carry <b>${carry}</b>.` : ` → write <b>${dig}</b>.`),
      add_last: (c) => `The last carry ${c} becomes the leading digit.`,
      sub_intro: (b) =>
        `<b>Column subtraction</b> in base ${b}: column by column from the right. If the top digit is too small, <b>borrow</b> 1 from the next column – it is worth ${b} here.`,
      sub_swap: 'A is smaller than B → we calculate B − A and put a minus in front of the result.',
      sub_col: (k, a, bin, b, dig) => `Column ${k}: ${a}${bin ? ` − borrowed ${bin}` : ''} − ${b} = <b>${dig}</b>.`,
      sub_borrow: (k, a, bin, b, base, dig) =>
        `Column ${k}: ${a}${bin ? ` − ${bin}` : ''} is smaller than ${b} → borrow 1 from the left (= ${base}): ${a}${bin ? ` − ${bin}` : ''} + ${base} − ${b} = <b>${dig}</b>.`,
      sub_trim: 'Drop the leading zeros.',
      mul_intro: (b) =>
        b === 2
          ? '<b>Binary multiplication</b> is especially easy: for every 1 in B, copy A – shifted to the left accordingly. For every 0 there are only zeros. Then add everything up.'
          : `<b>Long multiplication</b> in base ${b}: multiply A by every digit of B, shift each partial product left by its position, then add them all.`,
      mul_row: (j, d, p, base) =>
        base === 2
          ? d === '1'
            ? `Digit ${j} of B is 1 → copy A, shifted ${j} ${s(j, 'place', 'places')} to the left.`
            : `Digit ${j} of B is 0 → only zeros.`
          : `Digit ${j} of B is <b>${d}</b>: A × ${d} = ${p}, shifted ${j} ${s(j, 'place', 'places')} to the left.`,
      mul_sum: 'Add the partial products column by column (with carries, like addition):',
      div_intro: (b) =>
        `<b>Long division</b> in base ${b}: bring down the digits of A one by one. How many times does B fit into the current number? That is the next digit of the result – subtract and continue.`,
      div_gather: (r, y) => `First take enough digits for B to fit: ${r} ≥ ${y}.`,
      div_small: (r, y) => `${r} is smaller than B (${y}) and there are no more digits → B fits 0 times.`,
      div_step: (r, y, q, prod, rem) => `${r} ÷ ${y}: fits <b>${q}</b> times. ${r} − ${prod} = <b>${rem}</b>.`,
      div_down: (d, r) => `Bring down the next digit ${d} → ${r}.`,
      div_done: (q, r) => `Result: <b>${q}</b> remainder <b>${r}</b>. Check: quotient × B + remainder = A.`,
      lg: {
        AND: 'AND gives 1 only if <b>both</b> bits are 1. Handy for <b>masking</b>: wherever the mask is 0, the result is 0.',
        OR: 'OR gives 1 if <b>at least one</b> of the bits is 1. Handy for <b>setting</b> bits.',
        XOR: 'XOR (exclusive or) gives 1 if the bits are <b>different</b>. Handy for <b>toggling</b> bits and for comparing.',
        NOT: 'NOT flips every bit: 0 becomes 1, 1 becomes 0. The result depends on how many bits you work with.',
        NAND: 'NAND is NOT AND: 0 only if both bits are 1. You can build any computer from NAND gates alone.',
        NOR: 'NOR is NOT OR: 1 only if both bits are 0.',
        XNOR: 'XNOR is NOT XOR: 1 if both bits are <b>equal</b>.',
        SHL: (n) => `Shift left by ${n}: all bits move ${n} ${s(n, 'place', 'places')} to the left, zeros come in on the right. Same as <b>× 2${sup(n)}</b>.`,
        SHR: (n) => `Shift right by ${n}: all bits move to the right, the rightmost ${n} bit are dropped. Same as <b>÷ 2${sup(n)}</b> (rounded down).`,
      },
      lg_width: (w) => `We work with ${w} bits – shorter numbers are padded with zeros on the left.`,
      lg_bit: (k, a, op, b, r) => `Bit ${k}: ${a} ${op} ${b} = <b>${r}</b>.`,
      lg_not: (k, a, r) => `Bit ${k}: NOT ${a} = <b>${r}</b>.`,
      lg_done: 'Done – all bits combined.',
      sh_move: (n, left) => `All bits move ${n} ${s(n, 'place', 'places')} to the ${left ? 'left' : 'right'}.`,
      sh_fill: (n, left, lost) =>
        `${n} ${s(n, 'zero is', 'zeros are')} filled in on the ${left ? 'right' : 'left'}.` + (lost ? ` ${lost} bit fall off the edge and are lost.` : ''),
      res: 'Result',
      check: 'Check',
    },
  };
  const t = TV.t;
  const L = () => STRINGS[TV.lang] || STRINGS.en;
  // #endregion

  // #region Zahlen lesen + schreiben
  const abs = (v) => (v < 0n ? -v : v);
  const digits = (v, b) => abs(v).toString(b).toUpperCase();
  const dval = (ch) => (ch === ' ' || ch === undefined ? 0 : DIG.indexOf(ch));
  const dchar = (n) => DIG[n];
  /** Liest eine Zahl; Präfix 0b/0o/0x gewinnt vor der gewählten Basis. */
  function parse(raw, base) {
    let str = String(raw).trim().replace(/[\s_'’]/g, '').toUpperCase();
    if (!str) return { empty: true };
    let neg = false;
    if (str[0] === '-' || str[0] === '−') {
      neg = true;
      str = str.slice(1);
    }
    const pre = { '0B': 2, '0O': 8, '0X': 16 }[str.slice(0, 2)];
    if (pre && str.length > 2) {
      base = pre;
      str = str.slice(2);
    }
    if (!str) return { error: t('e_empty') };
    let v = 0n;
    const B = BigInt(base);
    for (const ch of str) {
      const d = DIG.indexOf(ch);
      if (d < 0 || d >= base) return { error: t('e_digit', ch, base) };
      v = v * B + BigInt(d);
    }
    return { value: neg ? -v : v, base };
  }
  /** Gruppiert Ziffern zum Lesen: BIN/HEX in 4er, DEC in 3er (schmales Leerzeichen), OCT in 3er. */
  function fmt(v, b, group = true) {
    let str = digits(v, b);
    const g = { 2: 4, 16: 4, 10: 3, 8: 3 }[b];
    if (group && g && str.length > g) str = str.replace(new RegExp('\\B(?=(.{' + g + '})+$)', 'g'), b === 10 ? ' ' : ' ');
    return (v < 0n ? '−' : '') + str;
  }
  const num = (str, b) => `<span class="num">${esc(str)}<sub>${b}</sub></span>`;
  const nb = (v, b) => num(fmt(v, b), b);
  const dv = (ch) => (DIG.indexOf(ch) > 9 ? ` (= ${DIG.indexOf(ch)})` : '');
  const bitLen = (v) => (v === 0n ? 1 : abs(v).toString(2).length);
  // #endregion

  // #region Bausteine für die Bühne
  // Eine Ziffernzeile, rechtsbündig auf N Spalten. cells: Array von {t, c} von links nach rechts.
  function drow(cells, N, label = '', cls = '') {
    const pad = Array.from({ length: Math.max(0, N - cells.length) }, () => ({ t: '' }));
    return (
      `<div class="drow ${cls}"><span class="dl">${label}</span>` +
      pad
        .concat(cells)
        .map((c) => `<span class="d ${c.c || ''}"${c.title ? ` title="${esc(c.title)}"` : ''}>${c.t === '' ? '' : esc(c.t)}</span>`)
        .join('') +
      '</div>'
    );
  }
  const strCells = (str, fn = () => '') => str.split('').map((ch, i) => ({ t: ch === ' ' ? '' : ch, c: fn(i, ch) }));
  const rule = (N) => `<div class="drow rule"><span class="dl"></span>${'<span class="d"></span>'.repeat(N)}</div>`;
  const board = (inner, cls = '') => `<div class="board ${cls}">${inner}</div>`;
  // #endregion

  // #region Rechenweg: Umrechnen
  function genToDec(v, b, steps, final = true) {
    const ds = digits(v, b);
    const n = ds.length;
    const head = (active, done) =>
      `<div class="drow posrow"><span class="dl"></span>${ds
        .split('')
        .map((ch, i) => {
          const k = n - 1 - i;
          const c = k === active ? 'hl' : k < done ? 'done' : '';
          return `<span class="d ${c}">${ch}<i class="pos">${b}${sup(k)}</i></span>`;
        })
        .join('')}</div>`;
    steps.push({ html: board(head(-1, 0)), text: L().td_intro(b) });
    let sum = 0n;
    const terms = [];
    for (let k = 0; k < n; k++) {
      const ch = ds[n - 1 - k];
      const d = BigInt(dval(ch));
      const w = BigInt(b) ** BigInt(k);
      const p = d * w;
      sum += p;
      terms.unshift({ k, ch, d, w, p });
      const list = terms
        .map(
          (x) =>
            `<div class="term ${x.k === k ? 'fresh' : ''} ${x.d === 0n ? 'zero' : ''}"><span>${x.ch} × ${b}${sup(x.k)}</span><span>= ${x.d} × ${fmt(x.w, 10)}</span><span>= <b>${fmt(x.p, 10)}</b></span></div>`,
        )
        .join('');
      steps.push({
        html: board(head(k, k) + `<div class="terms">${list}</div><div class="sum fresh">Σ = <b>${fmt(sum, 10)}</b></div>`),
        text: d === 0n ? L().td_zero(k) : L().td_term(k, ch, dv(ch), b, fmt(w, 10), fmt(p, 10), fmt(sum, 10)),
      });
    }
    if (final)
      steps.push({
        html: board(head(-1, n) + `<div class="sum big fresh">${num(ds, b)} = ${nb(sum, 10)}</div>`),
        text: L().td_done(nb(sum, 10)),
        result: sum,
      });
    return sum;
  }

  function genFromDec(v, b, steps) {
    if (v === 0n) {
      steps.push({ html: board(`<div class="sum big fresh">${num('0', 10)} = ${num('0', b)}</div>`), text: L().fd_zero, result: 0n });
      return;
    }
    steps.push({ html: board(`<div class="divlist"></div>`), text: L().fd_intro(b) });
    const lines = [];
    let n = v;
    while (n > 0n) {
      const q = n / BigInt(b);
      const r = Number(n % BigInt(b));
      lines.push({ n, q, r });
      const list = lines
        .map(
          (l, i) =>
            `<div class="divline ${i === lines.length - 1 ? 'fresh' : ''}"><span class="dn">${fmt(l.n, 10)}</span><span>÷ ${b} =</span><span class="dq">${fmt(l.q, 10)}</span><span class="dr">R <b>${l.r}</b>${l.r > 9 ? ` → ${dchar(l.r)}` : ''}</span></div>`,
        )
        .join('');
      steps.push({ html: board(`<div class="divlist">${list}</div>`), text: L().fd_step(fmt(n, 10), b, fmt(q, 10), r, dchar(r)) });
      n = q;
    }
    const list = lines
      .map(
        (l, i) =>
          `<div class="divline"><span class="dn">${fmt(l.n, 10)}</span><span>÷ ${b} =</span><span class="dq">${fmt(l.q, 10)}</span><span class="dr read" style="--i:${lines.length - 1 - i}">R <b>${l.r}</b>${l.r > 9 ? ` → ${dchar(l.r)}` : ''}</span></div>`,
      )
      .join('');
    steps.push({
      html: board(`<div class="divlist reading">${list}<span class="readup" aria-hidden="true"></span></div><div class="sum big fresh">${nb(v, 10)} = ${nb(v, b)}</div>`),
      text: L().fd_read,
      result: v,
    });
  }

  const LOG2 = { 2: 1, 4: 2, 8: 3, 16: 4, 32: 5 };
  // Basis (Zweierpotenz) → Binär: jede Ziffer wird zu g Bits
  function genExpand(v, from, steps) {
    const g = LOG2[from];
    const ds = digits(v, from);
    steps.push({ html: board(drow(strCells(ds), ds.length * g, '', 'big')), text: L().gr_from(from, g) });
    for (let i = 0; i < ds.length; i++) {
      const groups = ds
        .split('')
        .map((ch, j) =>
          j <= i
            ? `<span class="grp ${j === i ? 'fresh hl' : ''}"><b>${ch}</b><span>${dval(ch).toString(2).padStart(g, '0')}</span></span>`
            : `<span class="grp todo"><b>${ch}</b><span>${'·'.repeat(g)}</span></span>`,
        )
        .join('');
      const ch = ds[i];
      steps.push({ html: board(`<div class="groups">${groups}</div>`), text: L().gr_expand(ch, dval(ch), dval(ch).toString(2).padStart(g, '0')) });
    }
    const full = ds
      .split('')
      .map((ch) => dval(ch).toString(2).padStart(g, '0'))
      .join('');
    const lead = full.length - full.replace(/^0+(?=.)/, '').length;
    steps.push({
      html: board(drow(strCells(full, (i) => (i < lead ? 'strike' : 'fresh')), full.length, '', 'big') + `<div class="sum big fresh">${num(ds, from)} = ${nb(v, 2)}</div>`),
      text: L().gr_trim,
      result: v,
    });
  }
  // Binär → Basis (Zweierpotenz): von rechts gruppieren
  function genGroup(v, to, steps) {
    const g = LOG2[to];
    const raw = digits(v, 2);
    const z = (g - (raw.length % g)) % g;
    const bits = '0'.repeat(z) + raw;
    const nGroups = bits.length / g;
    steps.push({ html: board(drow(strCells(raw), bits.length, '', 'big')), text: L().gr_to(to, g) });
    if (z) steps.push({ html: board(drow(strCells(bits, (i) => (i < z ? 'fresh pad' : '')), bits.length, '', 'big')), text: L().gr_pad(z) });
    const out = [];
    for (let k = 0; k < nGroups; k++) {
      const gi = nGroups - 1 - k;
      const chunk = bits.slice(gi * g, gi * g + g);
      const val = parseInt(chunk, 2);
      out[gi] = dchar(val);
      const groups = Array.from({ length: nGroups }, (_, j) => {
        const c = bits.slice(j * g, j * g + g);
        return out[j] !== undefined
          ? `<span class="grp ${j === gi ? 'fresh hl' : ''}"><span>${c}</span><b>${out[j]}</b></span>`
          : `<span class="grp todo"><span>${c}</span><b>·</b></span>`;
      }).join('');
      const expr = chunk
        .split('')
        .map((bit, i) => (bit === '1' ? 2 ** (g - 1 - i) : null))
        .filter((x) => x !== null)
        .join(' + ') || '0';
      steps.push({ html: board(`<div class="groups">${groups}</div>`), text: L().gr_group(chunk, expr, val, dchar(val)) });
    }
    steps.push({ html: board(`<div class="sum big fresh">${nb(v, 2)} = ${nb(v, to)}</div>`), text: L().gr_trim, result: v });
  }

  function genConvert(v, from, to) {
    const steps = [];
    const neg = v < 0n;
    const a = abs(v);
    if (from === to) steps.push({ html: board(`<div class="sum big">${nb(v, from)}</div>`), text: L().cv_same(from), result: v });
    else if (to === 10) genToDec(a, from, steps);
    else if (from === 10) genFromDec(a, to, steps);
    else if (LOG2[from] && LOG2[to]) {
      if (from !== 2 && to !== 2) steps.push({ html: board(`<div class="sum big">${nb(a, from)} → ${num('?', to)}</div>`), text: L().via_bin(from, to) });
      if (from !== 2) genExpand(a, from, steps);
      if (to !== 2) {
        if (from !== 2) steps.push({ html: board(`<div class="sum big">${nb(a, 2)}</div>`), text: L().phase2bin(to) });
        genGroup(a, to, steps);
      }
    } else {
      steps.push({ html: board(`<div class="sum big">${nb(a, from)} → ${num('?', to)}</div>`), text: L().via_dec(from, to) });
      genToDec(a, from, steps, false);
      steps.push({ html: board(`<div class="sum big">${nb(a, from)} = ${nb(a, 10)}</div>`), text: L().phase2(to) });
      genFromDec(a, to, steps);
    }
    if (neg) {
      const last = steps[steps.length - 1];
      last.html += board(`<div class="sum big fresh">${nb(v, from)} = ${nb(v, to)}</div>`);
      last.text += ' ' + L().neg_note('');
    }
    steps[steps.length - 1].result = v;
    return steps;
  }
  // #endregion

  // #region Rechenweg: Rechnen
  /** Schriftliche Addition x + y (x, y ≥ 0) zur Basis b */
  function genAddCols(x, y, b, steps, sign = '') {
    const xs = digits(x, b);
    const ys = digits(y, b);
    const n = Math.max(xs.length, ys.length);
    const N = n + 1;
    const cols = [];
    let c = 0;
    for (let k = 0; k < n; k++) {
      const ach = xs[xs.length - 1 - k];
      const bch = ys[ys.length - 1 - k];
      const sum = dval(ach) + dval(bch) + c;
      cols.push({ ach: ach || '0', bch: bch || '0', cin: c, sum, dig: sum % b, cout: Math.floor(sum / b) });
      c = Math.floor(sum / b);
    }
    const draw = (done, active) => {
      // Spalten von rechts (k=0) nach links (k=N-1)
      const carry = [];
      const A = [];
      const B = [];
      const R = [];
      for (let k = N - 1; k >= 0; k--) {
        const hl = k === active ? 'hl' : '';
        const cin = k > 0 && k <= done && cols[k - 1] && cols[k - 1].cout ? cols[k - 1].cout : 0;
        carry.push({ t: cin ? String(cin) : '', c: 'carry ' + (k === done && k === active + 1 ? 'fresh' : '') });
        A.push({ t: xs[xs.length - 1 - k] || '', c: hl });
        B.push({ t: ys[ys.length - 1 - k] || '', c: hl });
        let r = '';
        let rc = '';
        if (k < done && k < n) r = dchar(cols[k].dig);
        if (k === n && done > n) r = String(c);
        if (k === active || (k === n && done > n && active === n)) rc = 'fresh res';
        else if (r) rc = 'res';
        R.push({ t: r, c: rc });
      }
      return board(drow(carry, N, '', 'carries') + drow(A, N, 'A') + drow(B, N, '+') + rule(N) + drow(R, N, '='));
    };
    steps.push({ html: draw(0, -1), text: L().add_intro(b) });
    for (let k = 0; k < n; k++) {
      const col = cols[k];
      steps.push({
        html: draw(k + 1, k),
        text: L().add_col(k, `${col.ach}${dv(col.ach)}`, `${col.bch}${dv(col.bch)}`, col.cin, col.sum, b, dchar(col.dig), col.cout),
      });
    }
    if (c) steps.push({ html: draw(n + 1, n), text: L().add_last(c) });
    const res = x + y;
    steps.push({ html: draw(c ? n + 1 : n, -1) + board(`<div class="sum big fresh">${sign}${nb(res, b)} = ${sign}${nb(res, 10)}</div>`), text: `${L().res}: <b>${sign}${fmt(res, b)}</b>` });
    return res;
  }
  /** Schriftliche Subtraktion x − y (x ≥ y ≥ 0) zur Basis b */
  function genSubCols(x, y, b, steps, sign = '') {
    const xs = digits(x, b);
    const ys = digits(y, b);
    const n = xs.length;
    const cols = [];
    let bin = 0;
    for (let k = 0; k < n; k++) {
      const ach = xs[n - 1 - k];
      const bch = ys[ys.length - 1 - k] || '0';
      const a = dval(ach) - bin;
      const bb = dval(bch);
      const borrow = a < bb;
      cols.push({ ach, bch, bin, borrow, dig: borrow ? a + b - bb : a - bb });
      bin = borrow ? 1 : 0;
    }
    const draw = (done, active) => {
      const brow = [];
      const A = [];
      const B = [];
      const R = [];
      for (let k = n - 1; k >= 0; k--) {
        const hl = k === active ? 'hl' : '';
        // Leihmarke über der Stelle, die verliehen hat (k), wenn Stelle k-1 geliehen hat
        const lent = k > 0 && k <= done && cols[k - 1].borrow;
        brow.push({ t: lent ? '−1' : '', c: 'carry ' + (lent && k === active + 1 ? 'fresh' : '') });
        A.push({ t: xs[n - 1 - k], c: hl + (k < done && cols[k].borrow ? ' lent' : '') });
        B.push({ t: ys[ys.length - 1 - k] || '', c: hl });
        R.push({ t: k < done ? dchar(cols[k].dig) : '', c: k === active ? 'fresh res' : k < done ? 'res' : '' });
      }
      return board(drow(brow, n, '', 'carries') + drow(A, n, 'A') + drow(B, n, '−') + rule(n) + drow(R, n, '='));
    };
    steps.push({ html: draw(0, -1), text: L().sub_intro(b) });
    for (let k = 0; k < n; k++) {
      const c = cols[k];
      const a = `${c.ach}${dv(c.ach)}`;
      const bb = `${c.bch}${dv(c.bch)}`;
      steps.push({
        html: draw(k + 1, k),
        text: c.borrow ? L().sub_borrow(k, a, c.bin, bb, b, dchar(c.dig)) : L().sub_col(k, a, c.bin, bb, dchar(c.dig)),
      });
    }
    const res = x - y;
    steps.push({ html: draw(n, -1) + board(`<div class="sum big fresh">${sign}${nb(res, b)} = ${sign}${nb(res, 10)}</div>`), text: `${L().sub_trim} ${L().res}: <b>${sign}${fmt(res, b)}</b>` });
    return res;
  }
  function genMul(x, y, b, steps, sign = '') {
    const xs = digits(x, b);
    const ys = digits(y, b);
    const res = x * y;
    const N = Math.max(digits(res, b).length, xs.length, ys.length) + 1;
    const rows = [];
    const draw = (activeJ, sum) => {
      let h = drow(strCells(xs), N, 'A') + drow(strCells(ys, (i) => (ys.length - 1 - i === activeJ ? 'hl' : '')), N, '×') + rule(N);
      rows.forEach((r, j) => {
        const cells = strCells(r.str + ' '.repeat(j), (i) => (i >= r.str.length ? 'shift' : j === activeJ ? 'fresh' : r.zero ? 'dim' : ''));
        h += drow(cells.map((c) => (c.t === ' ' ? { t: '·', c: 'shift' } : c)), N, j ? '+' : '');
      });
      if (sum) h += rule(N) + drow(strCells(digits(res, b), () => 'fresh res'), N, '=');
      return board(h);
    };
    steps.push({ html: draw(-1, false), text: L().mul_intro(b) });
    for (let j = 0; j < ys.length; j++) {
      const d = ys[ys.length - 1 - j];
      const p = x * BigInt(dval(d));
      rows.push({ str: p === 0n ? '0'.repeat(xs.length) : digits(p, b), zero: p === 0n });
      steps.push({ html: draw(j, false), text: L().mul_row(j, d, num(digits(p, b), b), b) });
    }
    steps.push({ html: draw(-1, true), text: L().mul_sum });
    steps.push({ html: draw(-1, true) + board(`<div class="sum big fresh">${sign}${nb(res, b)} = ${sign}${nb(res, 10)}</div>`), text: `${L().res}: <b>${sign}${fmt(res, b)}</b>` });
    return res;
  }
  function genDiv(x, y, b, steps, sign = '') {
    const xs = digits(x, b);
    const B = BigInt(b);
    const ystr = digits(y, b);
    steps.push({ html: board(`<div class="divhead">${num(xs, b)} ÷ ${num(ystr, b)} = <span class="q">?</span></div>`), text: L().div_intro(b) });
    let r = 0n;
    let q = '';
    const work = [];
    let i = 0;
    const head = (used, active) =>
      `<div class="divhead"><span class="dd">${xs
        .split('')
        .map((ch, j) => `<span class="${j < used ? 'used' : ''} ${j === active ? 'hl' : ''}">${ch}</span>`)
        .join('')}</span> ÷ ${num(ystr, b)} = <span class="q">${q || '…'}</span></div>`;
    const list = () => `<div class="work">${work.map((w, j) => `<div class="wline ${j === work.length - 1 ? 'fresh' : ''}">${w}</div>`).join('')}</div>`;
    // Anfang: so viele Ziffern sammeln, bis y hineinpasst (oder Ende)
    while (i < xs.length && r * B + BigInt(dval(xs[i])) < y && i < xs.length - 1) {
      r = r * B + BigInt(dval(xs[i]));
      i++;
    }
    let first = true;
    while (i < xs.length) {
      r = r * B + BigInt(dval(xs[i]));
      i++;
      const qd = r / y;
      const prod = qd * y;
      const rem = r - prod;
      q += dchar(Number(qd));
      const rs = fmt(r, b);
      if (first && i > 1) work.push(`<span class="muted">${L().div_gather(num(rs, b), num(ystr, b))}</span>`);
      else if (!first) work.push(`<span class="muted">${L().div_down(xs[i - 1], num(rs, b))}</span>`);
      work.push(`${num(rs, b)} − ${dchar(Number(qd))} × ${num(ystr, b)} = ${num(rs, b)} − ${num(fmt(prod, b), b)} = <b>${num(fmt(rem, b), b)}</b>`);
      steps.push({
        html: board(head(i, i - 1) + list()),
        text: qd === 0n && i === xs.length && first ? L().div_small(num(rs, b), num(ystr, b)) : L().div_step(num(rs, b), num(ystr, b), dchar(Number(qd)), num(fmt(prod, b), b), num(fmt(rem, b), b)),
      });
      r = rem;
      first = false;
    }
    const Q = x / y;
    const R = x % y;
    q = digits(Q, b);
    steps.push({
      html: board(head(xs.length, -1) + list()) + board(`<div class="sum big fresh">${sign}${nb(Q, b)} <span class="muted">${t('remainder')}</span> ${nb(R, b)}</div><div class="sum">${L().check}: ${nb(Q, b)} × ${nb(y, b)} + ${nb(R, b)} = ${nb(x, b)}</div>`),
      text: L().div_done(`${sign}${fmt(Q, b)}`, fmt(R, b)),
    });
    return Q;
  }
  function genArith(a, op, bv, b) {
    const steps = [];
    if (op === '+' || op === '-') {
      const y = op === '-' ? -bv : bv; // a − b = a + (−b)
      const head = `<div class="sum big">${nb(a, b)} ${ASYM[op]} ${nb(bv, b)}</div>`;
      if (op === '-' && bv < 0n) steps.push({ html: board(head), text: L().neg_note(L().neg_sub) });
      if (a >= 0n && y >= 0n) genAddCols(a, y, b, steps);
      else if (a < 0n && y < 0n) {
        steps.push({ html: board(head), text: L().neg_note(L().neg_add_same) });
        genAddCols(-a, -y, b, steps, '−');
      } else {
        // gemischte Vorzeichen → größerer minus kleinerer Betrag
        const big = abs(a) >= abs(y) ? a : y;
        const small = big === a ? y : a;
        const sign = big < 0n && abs(a) !== abs(y) ? '−' : '';
        if (op === '-' && a >= 0n && bv > 0n) {
          if (a < bv) steps.push({ html: board(head), text: L().sub_swap });
        } else steps.push({ html: board(head), text: L().neg_note(L().neg_add_mix(nb(big, b))) });
        genSubCols(abs(big), abs(small), b, steps, sign);
      }
      steps[steps.length - 1].result = op === '+' ? a + bv : a - bv;
    } else if (op === '*') {
      const neg = (a < 0n) !== (bv < 0n) && a !== 0n && bv !== 0n;
      if (a < 0n || bv < 0n) steps.push({ html: board(`<div class="sum big">${nb(a, b)} × ${nb(bv, b)}</div>`), text: L().neg_note(L().neg_mul(neg)) });
      genMul(abs(a), abs(bv), b, steps, neg ? '−' : '');
      steps[steps.length - 1].result = a * bv;
    } else {
      const neg = (a < 0n) !== (bv < 0n) && abs(a) >= abs(bv);
      if (a < 0n || bv < 0n) steps.push({ html: board(`<div class="sum big">${nb(a, b)} ÷ ${nb(bv, b)}</div>`), text: L().neg_note(L().neg_mul((a < 0n) !== (bv < 0n))) });
      genDiv(abs(a), abs(bv), b, steps, neg ? '−' : '');
      steps[steps.length - 1].result = a / bv; // BigInt rundet Richtung 0
    }
    return steps;
  }
  // #endregion

  // #region Rechenweg: Logik
  function truthTable(op, hl) {
    if (op === 'NOT')
      return `<table class="tt"><tr><th>A</th><th>NOT A</th></tr>${[0, 1]
        .map((a) => `<tr class="${hl && hl[0] === a ? 'hl' : ''}"><td>${a}</td><td>${BIT.NOT(a)}</td></tr>`)
        .join('')}</table>`;
    return `<table class="tt"><tr><th>A</th><th>B</th><th>${op}</th></tr>${[
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]
      .map(([a, b]) => `<tr class="${hl && hl[0] === a && hl[1] === b ? 'hl' : ''}"><td>${a}</td><td>${b}</td><td>${BIT[op](a, b)}</td></tr>`)
      .join('')}</table>`;
  }
  function genLogic(a, bv, op, w, shift) {
    const steps = [];
    const as = BigInt.asUintN(w, a).toString(2).padStart(w, '0');
    const label = (i) => (w - 1 - i) % 4 === 0 && w > 8 ? 'nib' : '';
    if (op === 'SHL' || op === 'SHR') {
      const left = op === 'SHL';
      const res = left ? BigInt.asUintN(w, BigInt.asUintN(w, a) << BigInt(shift)) : BigInt.asUintN(w, a) >> BigInt(shift);
      const rs = res.toString(2).padStart(w, '0');
      const lost = left ? as.slice(0, Math.min(shift, w)).replace(/0/g, '').length : as.slice(Math.max(0, w - shift)).replace(/0/g, '').length;
      const base = drow(strCells(as), w, 'A', 'bits');
      steps.push({ html: board(base), text: L().lg[op](shift) + ' ' + L().lg_width(w) });
      // Bits gleiten um n Zellen; was über den Rand fällt, blendet aus
      const n = Math.min(shift, w);
      const moving = strCells(as, (i) => (left ? i < n : i >= w - n) ? 'drop' : '');
      steps.push({
        html: board(drow(moving, w, '', `bits moving ${left ? 'to-left' : 'to-right'}`).replace('class="drow', `style="--n:${n}" class="drow`)),
        text: L().sh_move(shift, left),
      });
      steps.push({
        html: board(base + drow(strCells(rs, (i) => (left ? (i >= w - shift ? 'fresh pad' : '') : i < shift ? 'fresh pad' : '')), w, LSYM[op] + ' ' + shift, 'bits')),
        text: L().sh_fill(Math.min(shift, w), left, lost),
      });
      steps.push({
        html: board(base + drow(strCells(rs), w, '=', 'bits res')) + board(`<div class="sum big fresh">${nb(BigInt.asUintN(w, a), 10)} ${LSYM[op]} ${shift} = ${nb(res, 10)} = ${nb(res, 16)}</div>`),
        text: L().lg_done,
        result: res,
      });
      return steps;
    }
    const bs = op === 'NOT' ? '' : BigInt.asUintN(w, bv).toString(2).padStart(w, '0');
    const out = [];
    const draw = (active, hl) => {
      const cls = (i) => (w - 1 - i === active ? 'hl' : '') + ' ' + label(i);
      let h = drow(strCells(as, cls), w, 'A', 'bits');
      if (op !== 'NOT') h += drow(strCells(bs, cls), w, 'B', 'bits');
      h += rule(w);
      const R = Array.from({ length: w }, (_, i) => {
        const k = w - 1 - i;
        return { t: out[k] !== undefined ? String(out[k]) : '', c: (k === active ? 'fresh res' : out[k] !== undefined ? 'res' : '') + ' ' + label(i) };
      });
      h += drow(R, w, op === 'NOT' ? 'NOT' : op, 'bits');
      return `<div class="logic-grid">${board(h)}${truthTable(op, hl)}</div>`;
    };
    steps.push({ html: draw(-1), text: L().lg[op] + ' ' + L().lg_width(w) });
    for (let k = 0; k < w; k++) {
      const x = +as[w - 1 - k];
      const y = op === 'NOT' ? 0 : +bs[w - 1 - k];
      out[k] = op === 'NOT' ? BIT.NOT(x) : BIT[op](x, y);
      steps.push({ html: draw(k, op === 'NOT' ? [x] : [x, y]), text: op === 'NOT' ? L().lg_not(k, x, out[k]) : L().lg_bit(k, x, op, y, out[k]) });
    }
    const res = BigInt('0b' + out.slice().reverse().join(''));
    steps.push({ html: draw(-1) + board(`<div class="sum big fresh">${L().res}: ${nb(res, 2)} = ${nb(res, 16)} = ${nb(res, 10)}</div>`), text: L().lg_done, result: res });
    return steps;
  }
  // #endregion

  // #region Rechner (sofort)
  function calcLogic(a, b, op, w, shift) {
    const A = BigInt.asUintN(w, a);
    const B = BigInt.asUintN(w, b);
    const m = (1n << BigInt(w)) - 1n;
    switch (op) {
      case 'AND': return A & B;
      case 'OR': return A | B;
      case 'XOR': return A ^ B;
      case 'NOT': return ~A & m;
      case 'NAND': return ~(A & B) & m;
      case 'NOR': return ~(A | B) & m;
      case 'XNOR': return ~(A ^ B) & m;
      case 'SHL': return (A << BigInt(shift)) & m;
      case 'SHR': return A >> BigInt(shift);
    }
  }
  function autoWidth(...vals) {
    const n = Math.max(...vals.map((v) => (v < 0n ? bitLen(v) + 1 : bitLen(v))));
    return Math.max(8, Math.ceil(n / 8) * 8);
  }
  // #endregion

  // #region Zustand + Eingaben
  const STORE = 'tv-bits';
  const S = {
    view: 'quick',
    mode: 'convert',
    conv: { input: '156', from: 10, to: 2 },
    arith: { a: '1011', b: '110', base: 2, op: '+' },
    logic: { a: '1100 1010', b: '1010 0110', base: 2, op: 'AND', width: 'auto', shift: 2 },
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved) for (const k of Object.keys(S)) if (saved[k] !== undefined) S[k] = typeof S[k] === 'object' ? Object.assign(S[k], saved[k]) : saved[k];
  } catch (e) {}
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify(S));
    } catch (e) {}
  };

  function baseControl(obj, key, label) {
    const cur = obj[key];
    return `<div class="field-base"><span class="lbl">${esc(label)}</span><span class="seg small" data-base="${key}">${COMMON.map(
      (b) => `<button type="button" data-b="${b}" aria-selected="${cur === b}">${BNAME[b]}<sub>${b}</sub></button>`,
    ).join('')}<label class="nbase ${COMMON.includes(cur) ? '' : 'on'}" title="${esc(t('other'))}"><input type="number" min="2" max="36" value="${COMMON.includes(cur) ? '' : cur}" placeholder="${esc(t('other'))}" data-nbase="${key}" aria-label="${esc(t('other'))} (2–36)"></label></span></div>`;
  }
  function renderInputs() {
    const el = $('#inputs');
    if (S.mode === 'convert') {
      const c = S.conv;
      el.innerHTML = `<div class="inrow"><label class="field grow"><span>${t('number')}</span><input type="text" id="cIn" spellcheck="false" autocomplete="off" value="${esc(c.input)}"></label></div>
        <div class="inrow">${baseControl(c, 'from', t('from'))}<button class="btn sm swap" id="swap" type="button" title="⇄">⇄</button>${baseControl(c, 'to', t('to'))}</div>
        <p class="hint">${t('intOnly')}</p><div class="msg bad" id="err"></div>`;
    } else if (S.mode === 'arith') {
      const c = S.arith;
      el.innerHTML = `<div class="inrow ops"><label class="field grow"><span>A</span><input type="text" id="aA" spellcheck="false" autocomplete="off" value="${esc(c.a)}"></label>
        <span class="seg opseg" id="opSeg">${['+', '-', '*', '/'].map((o) => `<button type="button" data-op="${o}" aria-selected="${c.op === o}">${ASYM[o]}</button>`).join('')}</span>
        <label class="field grow"><span>B</span><input type="text" id="aB" spellcheck="false" autocomplete="off" value="${esc(c.b)}"></label></div>
        <div class="inrow">${baseControl(c, 'base', t('calcBase'))}</div><p class="hint">${t('intOnly')}</p><div class="msg bad" id="err"></div>`;
    } else {
      const c = S.logic;
      const unary = c.op === 'NOT';
      const sh = c.op === 'SHL' || c.op === 'SHR';
      el.innerHTML = `<div class="inrow"><span class="seg small opseg" id="lopSeg">${LOGIC.map((o) => `<button type="button" data-op="${o}" aria-selected="${c.op === o}">${LSYM[o]}</button>`).join('')}</span></div>
        <div class="inrow ops"><label class="field grow"><span>A</span><input type="text" id="lA" spellcheck="false" autocomplete="off" value="${esc(c.a)}"></label>
        ${unary ? '' : sh ? `<label class="field shift"><span>${t('shiftBy')}</span><input type="number" id="lS" min="0" max="256" value="${c.shift}"></label>` : `<label class="field grow"><span>B</span><input type="text" id="lB" spellcheck="false" autocomplete="off" value="${esc(c.b)}"></label>`}</div>
        <div class="inrow">${baseControl(c, 'base', t('calcBase'))}<div class="field-base"><span class="lbl">${t('width')}</span><span class="seg small" id="wSeg">${['auto', 8, 16, 32, 64]
          .map((w) => `<button type="button" data-w="${w}" aria-selected="${String(c.width) === String(w)}">${w === 'auto' ? t('auto') : w}</button>`)
          .join('')}</span></div></div><div class="msg bad" id="err"></div>`;
    }
  }
  // #endregion

  // #region Auswertung
  function evaluate() {
    const err = (m) => ({ error: m });
    if (S.mode === 'convert') {
      const p = parse(S.conv.input, S.conv.from);
      if (p.empty) return err(t('e_empty'));
      if (p.error) return err(p.error);
      return { kind: 'convert', v: p.value, from: p.base, to: S.conv.to };
    }
    if (S.mode === 'arith') {
      const c = S.arith;
      const a = parse(c.a, c.base);
      const b = parse(c.b, c.base);
      if (a.empty || b.empty) return err(t('e_empty'));
      if (a.error || b.error) return err(a.error || b.error);
      if (c.op === '/' && b.value === 0n) return err(t('e_div0'));
      const r = { '+': a.value + b.value, '-': a.value - b.value, '*': a.value * b.value, '/': b.value ? a.value / b.value : 0n }[c.op];
      return { kind: 'arith', a: a.value, b: b.value, op: c.op, base: c.base, r, rem: c.op === '/' ? a.value % b.value : null };
    }
    const c = S.logic;
    const a = parse(c.a, c.base);
    if (a.empty) return err(t('e_empty'));
    if (a.error) return err(a.error);
    let b = { value: 0n };
    const sh = c.op === 'SHL' || c.op === 'SHR';
    if (!sh && c.op !== 'NOT') {
      b = parse(c.b, c.base);
      if (b.empty) return err(t('e_empty'));
      if (b.error) return err(b.error);
    }
    const shift = Number(c.shift);
    if (sh && !(Number.isInteger(shift) && shift >= 0 && shift <= 256)) return err(t('e_shift'));
    const w =
      c.width === 'auto'
        ? autoWidth(a.value, b.value, c.op === 'SHL' ? abs(a.value) << BigInt(shift) : 0n)
        : Number(c.width);
    const truncated = c.width !== 'auto' && (bitLen(a.value) > w || bitLen(b.value) > w);
    return { kind: 'logic', a: a.value, b: b.value, op: c.op, w, shift, r: calcLogic(a.value, b.value, c.op, w, shift), truncated, base: c.base };
  }
  // #endregion

  // #region Darstellung: Rechner
  function outRows(v, highlight, extra = '') {
    const bases = COMMON.includes(highlight) ? COMMON : COMMON.concat([highlight]);
    return `<div class="outs">${bases
      .map((b) => {
        const raw = (v < 0n ? '-' : '') + digits(v, b);
        return `<div class="out-row ${b === highlight ? 'on' : ''}"><span class="ob">${BNAME[b] || 'B' + b}<sub>${b}</sub></span><code class="ov">${esc(fmt(v, b))}</code><span class="oc">${t('digits', digits(v, b).length)}</span><button class="btn sm" data-copyv="${esc(raw)}">${t('copy')}</button></div>`;
      })
      .join('')}${extra}</div>`;
  }
  function bitGrid(v, editable) {
    const n = bitLen(v);
    if (n > 64) return `<p class="hint">${t('tooWide')}</p>`;
    const w = v < 0n ? autoWidth(v) : Math.max(8, Math.ceil(n / 8) * 8);
    const bits = BigInt.asUintN(w, v).toString(2).padStart(w, '0');
    const ones = bits.replace(/0/g, '').length;
    const cells = bits
      .split('')
      .map((bit, i) => {
        const k = w - 1 - i;
        return `<button type="button" class="bit ${bit === '1' ? 'one' : ''} ${k % 8 === 7 && i ? 'byte' : ''}" data-k="${k}" ${editable ? '' : 'disabled'} title="Bit ${k} · 2^${k} = ${fmt(1n << BigInt(k), 10)}"><span>${bit}</span><i>${k}</i></button>`;
      })
      .join('');
    const signed = BigInt.asIntN(w, v);
    return `<div class="bitgrid" style="--w:${Math.min(w, 32)}">${cells}</div>
      <div class="bitinfo"><span>${t('bitsInfo', w, ones)}</span>${bits[0] === '1' ? `<span>${t('signed', w, fmt(signed, 10))}</span>` : ''}</div>
      ${editable ? `<p class="hint">${t('bitHint')}</p>` : ''}`;
  }
  function renderQuick(r) {
    const q = $('#quick');
    if (r.error) {
      q.innerHTML = '';
      return;
    }
    const learnBtn = `<button class="btn" id="toLearn" type="button">${t('toLearn')}</button>`;
    if (r.kind === 'convert') {
      q.innerHTML = `<div class="box"><h2 class="box-title"><span>${t('result')}</span>${learnBtn}</h2>${outRows(r.v, r.to)}</div>
        <div class="box"><h2 class="box-title"><span>Bits</span></h2>${bitGrid(r.v, true)}</div>`;
    } else if (r.kind === 'arith') {
      const expr = `${nb(r.a, r.base)} ${ASYM[r.op]} ${nb(r.b, r.base)} = ${nb(r.r, r.base)}${r.rem !== null ? ` <span class="muted">${t('remainder')}</span> ${nb(r.rem, r.base)}` : ''}`;
      const dec = r.base === 10 ? '' : `<div class="expr small">${nb(r.a, 10)} ${ASYM[r.op]} ${nb(r.b, 10)} = ${nb(r.r, 10)}${r.rem !== null ? ` <span class="muted">${t('remainder')}</span> ${nb(r.rem, 10)}` : ''}</div>`;
      q.innerHTML = `<div class="box"><h2 class="box-title"><span>${r.op === '/' ? t('quotient') : t('result')}</span>${learnBtn}</h2><div class="expr">${expr}</div>${dec}${outRows(r.r, r.base)}</div>
        ${r.rem !== null ? `<div class="box"><h2 class="box-title"><span>${t('remainder')}</span></h2>${outRows(r.rem, r.base)}</div>` : ''}`;
    } else {
      const w = r.w;
      const row = (label, v, cls = '') => {
        const bits = BigInt.asUintN(w, v).toString(2).padStart(w, '0');
        return `<div class="lrow ${cls}"><span class="ll">${label}</span><span class="lbits">${bits
          .split('')
          .map((bit, i) => `<span class="lb ${bit === '1' ? 'one' : ''} ${(w - i) % 4 === 0 && i ? 'gap' : ''}">${bit}</span>`)
          .join('')}</span><code class="lh">0x${BigInt.asUintN(w, v).toString(16).toUpperCase()}</code></div>`;
      };
      const sh = r.op === 'SHL' || r.op === 'SHR';
      const rows =
        row('A', r.a) +
        (r.op === 'NOT' ? '' : sh ? `<div class="lrow"><span class="ll">${LSYM[r.op]}</span><span class="lbits muted">${r.shift}</span></div>` : row('B', r.b)) +
        row(LSYM[r.op], r.r, 'res');
      q.innerHTML = `<div class="box"><h2 class="box-title"><span>${t('result')} · ${w} Bit</span>${learnBtn}</h2><div class="lrows">${rows}</div>${r.truncated ? `<p class="msg">${t('truncated', w)}</p>` : ''}${outRows(r.r, r.base)}</div>`;
    }
  }
  // #endregion

  // #region Darstellung: Rechenweg + Player
  let steps = [];
  let idx = 0;
  let timer = null;
  let lastKey = '';
  let lastLang = '';
  function buildSteps(r) {
    if (r.kind === 'convert') return genConvert(r.v, r.from, r.to);
    if (r.kind === 'arith') return genArith(r.a, r.op, r.b, r.base);
    return genLogic(r.a, r.b, r.op, r.w, r.shift);
  }
  function taskLine(r) {
    if (r.kind === 'convert') return `${nb(r.v, r.from)} → ${num('?', r.to)}`;
    if (r.kind === 'arith') return `${nb(r.a, r.base)} ${ASYM[r.op]} ${nb(r.b, r.base)} = ?`;
    if (r.op === 'NOT') return `NOT ${nb(BigInt.asUintN(r.w, r.a), 2)}`;
    if (r.op === 'SHL' || r.op === 'SHR') return `${nb(BigInt.asUintN(r.w, r.a), 2)} ${LSYM[r.op]} ${r.shift}`;
    return `${nb(BigInt.asUintN(r.w, r.a), 2)} ${r.op} ${nb(BigInt.asUintN(r.w, r.b), 2)}`;
  }
  function renderLearn(r) {
    if (r.error) {
      $('#task').innerHTML = '';
      $('#stage').innerHTML = '';
      $('#explain').innerHTML = '';
      $('#progress').innerHTML = '';
      $('#stepNo').textContent = '';
      stop();
      return;
    }
    // Neue Aufgabe → von vorn; nur Sprache gewechselt → gleicher Schritt, Texte neu
    const dataKey = JSON.stringify(r, (k, v) => (typeof v === 'bigint' ? v.toString() : v));
    if (dataKey !== lastKey || TV.lang !== lastLang) {
      if (dataKey !== lastKey) {
        idx = 0;
        stop();
      }
      lastKey = dataKey;
      lastLang = TV.lang;
      steps = buildSteps(r);
      idx = Math.min(idx, steps.length - 1);
      $('#task').innerHTML = taskLine(r);
      $('#progress').innerHTML = steps.map((_, i) => `<button type="button" data-i="${i}" aria-label="${i + 1}"></button>`).join('');
    }
    show();
  }
  function show() {
    if (!steps.length) return;
    const st = steps[idx];
    $('#stage').innerHTML = st.html;
    $('#explain').innerHTML = st.text;
    $('#stepNo').textContent = t('stepOf', idx + 1, steps.length);
    $$('#progress button').forEach((b, i) => b.classList.toggle('on', i <= idx));
    $('#pPrev').disabled = $('#pFirst').disabled = idx === 0;
    $('#pNext').disabled = $('#pLast').disabled = idx === steps.length - 1;
    paintPlay();
    // aktive Zelle in Sicht halten (lange Zahlen scrollen seitlich)
    const hl = $('#stage .hl, #stage .fresh');
    if (hl && hl.scrollIntoView) hl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function paintPlay() {
    $('#pPlay').textContent = timer ? t('pause') : idx === steps.length - 1 && steps.length > 1 ? t('again') : t('play');
  }
  function go(i) {
    idx = Math.max(0, Math.min(steps.length - 1, i));
    show();
  }
  function stop() {
    clearInterval(timer);
    timer = null;
    if (steps.length) paintPlay();
  }
  function play() {
    if (timer) return stop();
    if (idx >= steps.length - 1) go(0);
    timer = setInterval(() => {
      if (idx >= steps.length - 1) return stop();
      go(idx + 1);
    }, SPEEDS[+$('#pSpeed').value]);
    paintPlay();
  }
  // #endregion

  // #region Ablauf
  function render() {
    $$('#viewSeg button').forEach((b) => b.setAttribute('aria-selected', b.dataset.view === S.view));
    $$('#modeSeg button').forEach((b) => b.setAttribute('aria-selected', b.dataset.mode === S.mode));
    const r = evaluate();
    $('#err').textContent = r.error || '';
    $('#quick').hidden = S.view !== 'quick';
    $('#learn').hidden = S.view !== 'learn';
    if (S.view === 'quick') renderQuick(r);
    else renderLearn(r);
    save();
  }
  let inTimer;
  const later = () => {
    clearTimeout(inTimer);
    inTimer = setTimeout(render, 160);
  };
  function full() {
    renderInputs();
    render();
  }

  $('#viewSeg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (!b) return;
    S.view = b.dataset.view;
    stop();
    render();
  });
  $('#modeSeg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (!b) return;
    S.mode = b.dataset.mode;
    stop();
    full();
  });
  const cur = () => (S.mode === 'convert' ? S.conv : S.mode === 'arith' ? S.arith : S.logic);
  $('#inputs').addEventListener('input', (e) => {
    const id = e.target.id;
    const map = { cIn: ['conv', 'input'], aA: ['arith', 'a'], aB: ['arith', 'b'], lA: ['logic', 'a'], lB: ['logic', 'b'], lS: ['logic', 'shift'] };
    if (map[id]) {
      S[map[id][0]][map[id][1]] = e.target.value;
      return later();
    }
    if (e.target.dataset.nbase) {
      const v = +e.target.value;
      if (v >= 2 && v <= 36) {
        cur()[e.target.dataset.nbase] = v;
        $$('[data-base="' + e.target.dataset.nbase + '"] button').forEach((x) => x.setAttribute('aria-selected', false));
        e.target.parentElement.classList.add('on');
        later();
      }
    }
  });
  $('#inputs').addEventListener('click', (e) => {
    const bb = e.target.closest('[data-b]');
    if (bb) {
      const key = bb.closest('[data-base]').dataset.base;
      const c = cur();
      const nbv = +bb.dataset.b;
      // Eingabe beim Basiswechsel mitnehmen, wenn sie gültig ist (Umrechnen: Zahl bleibt gleich)
      if (S.mode === 'convert' && key === 'from') {
        const p = parse(c.input, c.from);
        if (p.value !== undefined) c.input = fmt(p.value, nbv, false).replace('−', '-');
      } else if (key === 'base') {
        const fields = S.mode === 'arith' ? ['a', 'b'] : ['a', 'b'];
        fields.forEach((f) => {
          const p = parse(c[f], c.base);
          if (p.value !== undefined) c[f] = fmt(p.value, nbv, nbv === 2).replace('−', '-');
        });
      }
      c[key] = nbv;
      return full();
    }
    const op = e.target.closest('[data-op]');
    if (op) {
      cur().op = op.dataset.op;
      return full();
    }
    const w = e.target.closest('[data-w]');
    if (w) {
      S.logic.width = w.dataset.w === 'auto' ? 'auto' : +w.dataset.w;
      return full();
    }
    if (e.target.closest('#swap')) {
      const c = S.conv;
      const p = parse(c.input, c.from);
      [c.from, c.to] = [c.to, c.from];
      if (p.value !== undefined) c.input = fmt(p.value, c.from, false).replace('−', '-');
      return full();
    }
  });
  $('#quick').addEventListener('click', (e) => {
    const cp = e.target.closest('[data-copyv]');
    if (cp) return TV.copy(cp.dataset.copyv);
    if (e.target.closest('#toLearn')) {
      S.view = 'learn';
      render();
      scrollTo({ top: $('#learn').getBoundingClientRect().top + scrollY - 20, behavior: 'smooth' });
      return;
    }
    const bit = e.target.closest('.bit[data-k]');
    if (bit) {
      const r = evaluate();
      if (r.kind !== 'convert') return;
      const w = $$('.bitgrid .bit').length;
      let u = BigInt.asUintN(w, r.v) ^ (1n << BigInt(bit.dataset.k));
      const v = r.v < 0n ? BigInt.asIntN(w, u) : u;
      S.conv.input = fmt(v, S.conv.from, false).replace('−', '-');
      $('#cIn').value = S.conv.input;
      render();
    }
  });
  $('#pFirst').addEventListener('click', () => (stop(), go(0)));
  $('#pPrev').addEventListener('click', () => (stop(), go(idx - 1)));
  $('#pNext').addEventListener('click', () => (stop(), go(idx + 1)));
  $('#pLast').addEventListener('click', () => (stop(), go(steps.length - 1)));
  $('#pPlay').addEventListener('click', play);
  $('#pSpeed').addEventListener('input', () => {
    if (timer) {
      stop();
      play();
    }
  });
  $('#progress').addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (b) (stop(), go(+b.dataset.i));
  });
  document.addEventListener('keydown', (e) => {
    if (S.view !== 'learn' || e.target.matches('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === 'ArrowRight') (stop(), go(idx + 1));
    else if (k === 'ArrowLeft') (stop(), go(idx - 1));
    else if (k === 'Home') (stop(), go(0));
    else if (k === 'End') (stop(), go(steps.length - 1));
    else if (k === ' ') play();
    else return;
    e.preventDefault();
  });

  TV.init({
    glyph: '01',
    strings: STRINGS,
    onLang: () => {
      if (!$('#inputs').children.length) return;
      full();
    },
  });
  full();

  // Für Tests: reine Funktionen von außen prüfbar
  window.BitLab = { parse, fmt, digits, genConvert, genArith, genLogic, calcLogic, autoWidth, state: S, render: full };
  // #endregion
})();
