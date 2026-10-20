/* Markdown · Logik
   marked (GFM) -> DOMPurify -> Nachbearbeitung (Überschriften-Anker, Aufgaben, Code-Kopieren)
   -> Vorschau + Inhaltsverzeichnis. Alles lokal, Entwurf im localStorage. */
(function () {
  'use strict';
  const { $, $$, t, esc, copy, download, toast } = TV;

  // #region Texte
  const SAMPLE = {
    de: `---
title: Willkommen im Markdown-Reader
autor: ToolVault
---

# Willkommen 👋

Dieser Reader zeigt **Markdown** sofort *formatiert* an – links tippen, rechts lesen. Oder oben auf **Lesen** schalten für die volle Ansicht mit Inhaltsverzeichnis.

## Was alles geht

- **Fett**, *kursiv*, ~~durchgestrichen~~ und \`Code\`
- [Links](https://andrasmarro.github.io/ToolVault/) öffnen in einem neuen Tab
- Verschachtelte Listen
  - wie diese hier
  - und diese

### Aufgaben

- [x] Datei öffnen oder hineinziehen
- [ ] Im Lesemodus Schrift und Grösse anpassen
- [ ] Haken direkt in der Vorschau setzen – der Text links ändert sich mit

## Tabelle

| Tool | Wofür | Lokal |
| --- | --- | :---: |
| QR Studio | QR-Codes erstellen & lesen | ✓ |
| Farbsehen | Farben benennen | ✓ |
| Markdown | .md lesen & schreiben | ✓ |

## Code

\`\`\`js
// Syntax-Hervorhebung für viele Sprachen
function hallo(name) {
  return \`Hallo, \${name}!\`;
}
\`\`\`

> **Tipp:** Mit Strg+S speicherst du die Datei, mit Strg+B / Strg+I formatierst du die Auswahl.

---

Viel Spass beim Schreiben!
`,
    en: `---
title: Welcome to the Markdown reader
author: ToolVault
---

# Welcome 👋

This reader shows **Markdown** *formatted* instantly – type on the left, read on the right. Or switch to **Read** above for the full view with a table of contents.

## What works

- **Bold**, *italic*, ~~strikethrough~~ and \`code\`
- [Links](https://andrasmarro.github.io/ToolVault/) open in a new tab
- Nested lists
  - like this one
  - and this one

### Tasks

- [x] Open or drop a file
- [ ] Adjust font and size in reading mode
- [ ] Tick boxes right in the preview – the text on the left updates too

## Table

| Tool | Purpose | Local |
| --- | --- | :---: |
| QR Studio | create & read QR codes | ✓ |
| Color Vision | name colours | ✓ |
| Markdown | read & write .md | ✓ |

## Code

\`\`\`js
// syntax highlighting for many languages
function hello(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> **Tip:** Ctrl+S saves the file, Ctrl+B / Ctrl+I format the selection.

---

Have fun writing!
`,
  };
  const STRINGS = {
    de: {
      pageTitle: 'Markdown',
      kicker: '// markdown · lesen & schreiben',
      title: '.md-Dateien <span class="accent">schön lesen</span> und bearbeiten.',
      lead: 'Markdown öffnen, hineinziehen oder einfügen – die Vorschau formatiert live mit Tabellen, Code-Farben und Checklisten. Lesemodus mit Inhaltsverzeichnis, Export als HTML oder PDF.',
      open: '📂 Öffnen',
      new: '＋ Neu',
      save: '⬇ .md speichern',
      exportHtml: '⬇ HTML',
      print: '🖨 PDF / Drucken',
      printHeaders: 'Kopf-/Fusszeile',
      printHeadersHint: 'Browser-Kopf- und Fusszeile (Titel, Adresse, Datum, Seitenzahl) im PDF mitdrucken',
      v_edit: '✎ Schreiben',
      v_split: '◫ Geteilt',
      v_read: '☰ Lesen',
      w_narrow: 'schmal',
      w_wide: 'breit',
      placeholder: '# Titel\n\nHier Markdown schreiben oder eine .md-Datei hineinziehen …',
      untitled: 'unbenannt.md',
      stats: (w, c, m) => `${w} Wörter · ${c} Zeichen · ~${m} Min. Lesezeit`,
      savedAt: (tm) => `Entwurf gesichert ${tm}`,
      confirmNew: 'Aktuelles Dokument verwerfen und neu beginnen?',
      toc: 'Inhalt',
      empty: 'Noch nichts zu sehen – links Markdown schreiben.',
      copyCode: 'Kopieren',
      dropHere: '.md-Datei hier ablegen',
      local: 'läuft lokal im Browser',
      f_bold: 'Fett (Strg+B)',
      f_italic: 'Kursiv (Strg+I)',
      f_strike: 'Durchgestrichen',
      f_h1: 'Überschrift 1',
      f_h2: 'Überschrift 2',
      f_h3: 'Überschrift 3',
      f_ul: 'Liste',
      f_ol: 'Nummerierte Liste',
      f_task: 'Aufgabe',
      f_quote: 'Zitat',
      f_code: 'Code',
      f_block: 'Code-Block',
      f_link: 'Link (Strg+K)',
      f_image: 'Bild',
      f_table: 'Tabelle',
      f_hr: 'Trennlinie',
      linkText: 'Linktext',
      imgAlt: 'Beschreibung',
      tableTpl: '| Spalte A | Spalte B |\n| --- | --- |\n| … | … |',
    },
    en: {
      pageTitle: 'Markdown',
      kicker: '// markdown · read & write',
      title: 'Read .md files <span class="accent">beautifully</span> – and edit them.',
      lead: 'Open, drop or paste Markdown – the preview formats live with tables, code colours and task lists. Reading mode with a table of contents, export as HTML or PDF.',
      open: '📂 Open',
      new: '＋ New',
      save: '⬇ Save .md',
      exportHtml: '⬇ HTML',
      print: '🖨 PDF / Print',
      printHeaders: 'Header/footer',
      printHeadersHint: 'Include the browser header and footer (title, address, date, page number) in the PDF',
      v_edit: '✎ Write',
      v_split: '◫ Split',
      v_read: '☰ Read',
      w_narrow: 'narrow',
      w_wide: 'wide',
      placeholder: '# Title\n\nWrite Markdown here or drop a .md file …',
      untitled: 'untitled.md',
      stats: (w, c, m) => `${w} words · ${c} characters · ~${m} min read`,
      savedAt: (tm) => `Draft saved ${tm}`,
      confirmNew: 'Discard the current document and start fresh?',
      toc: 'Contents',
      empty: 'Nothing to see yet – write some Markdown on the left.',
      copyCode: 'Copy',
      dropHere: 'Drop a .md file here',
      local: 'runs locally in your browser',
      f_bold: 'Bold (Ctrl+B)',
      f_italic: 'Italic (Ctrl+I)',
      f_strike: 'Strikethrough',
      f_h1: 'Heading 1',
      f_h2: 'Heading 2',
      f_h3: 'Heading 3',
      f_ul: 'List',
      f_ol: 'Numbered list',
      f_task: 'Task',
      f_quote: 'Quote',
      f_code: 'Code',
      f_block: 'Code block',
      f_link: 'Link (Ctrl+K)',
      f_image: 'Image',
      f_table: 'Table',
      f_hr: 'Divider',
      linkText: 'link text',
      imgAlt: 'description',
      tableTpl: '| Column A | Column B |\n| --- | --- |\n| … | … |',
    },
  };
  // #endregion

  // #region Zustand + Speicher
  const src = $('#src');
  const preview = $('#preview');
  let fileName = null;
  let view = 'split';
  const prefs = { font: 'sans', size: 1.02, width: 'narrow' };
  const store = {
    get(k) {
      try {
        return JSON.parse(localStorage.getItem(k));
      } catch (e) {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {}
    },
  };
  Object.assign(prefs, store.get('tv-md-prefs') || {});
  // #endregion

  // #region Rendern
  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      code({ text, lang }) {
        const l = (lang || '').trim().split(/\s+/)[0].toLowerCase();
        let html;
        if (l && hljs.getLanguage(l)) html = hljs.highlight(text, { language: l, ignoreIllegals: true }).value;
        else html = esc(text);
        return `<pre><span class="lang">${esc(l)}</span><code class="hljs language-${esc(l || 'text')}">${html}</code></pre>`;
      },
    },
  });
  // Externe Links in neuem Tab, sicher
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && /^https?:/i.test(node.getAttribute('href') || '')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  function splitFrontMatter(text) {
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (!m) return { meta: null, body: text };
    const meta = m[1]
      .split(/\r?\n/)
      .map((l) => l.match(/^([\w-]+):\s*(.*)$/))
      .filter(Boolean)
      .map((x) => [x[1], x[2].replace(/^["']|["']$/g, '')]);
    return { meta, body: text.slice(m[0].length) };
  }
  const slug = (s) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-|-$/g, '') || 'abschnitt';

  function render() {
    const text = src.value;
    const { meta, body } = splitFrontMatter(text);
    let html = DOMPurify.sanitize(marked.parse(body), { ADD_ATTR: ['target'] });
    if (meta && meta.length) html = `<div class="frontmatter">${meta.map(([k, v]) => `<b>${esc(k)}</b><span>${esc(v)}</span>`).join('')}</div>` + html;
    preview.innerHTML = text.trim() ? html : `<p class="empty">${esc(t('empty'))}</p>`;

    // Überschriften: IDs + Anker
    const used = {};
    $$('h1,h2,h3,h4', preview).forEach((h) => {
      let id = slug(h.textContent);
      if (used[id]) id += '-' + ++used[id];
      else used[id] = 1;
      h.id = id;
      const a = document.createElement('a');
      a.className = 'anchor';
      a.href = '#' + id;
      a.textContent = '#';
      a.setAttribute('aria-hidden', 'true');
      h.prepend(a);
    });
    // Aufgaben anklickbar machen
    $$('li > input[type="checkbox"]', preview).forEach((cb, i) => {
      const li = cb.parentElement;
      li.classList.add('task');
      li.classList.toggle('done', cb.checked);
      cb.disabled = false;
      cb.dataset.i = i;
      const span = document.createElement('span');
      while (cb.nextSibling) span.appendChild(cb.nextSibling);
      li.appendChild(span);
    });
    // Code kopieren
    $$('pre', preview).forEach((pre) => {
      const b = document.createElement('button');
      b.className = 'btn sm copy';
      b.textContent = t('copyCode');
      b.addEventListener('click', () => copy(pre.querySelector('code').textContent));
      pre.appendChild(b);
    });
    renderToc();
    renderStats(body);
  }

  // Haken in der Vorschau -> Quelltext ändern
  preview.addEventListener('change', (e) => {
    const cb = e.target.closest('input[type="checkbox"][data-i]');
    if (!cb) return;
    const idx = +cb.dataset.i;
    let n = -1;
    let inFence = false;
    const lines = src.value.split('\n').map((line) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
      if (inFence) return line;
      return line.replace(/^(\s*(?:[-*+]|\d+[.)])\s+\[)([ xX])(\])/, (m, a, mark, c) => (++n === idx ? a + (cb.checked ? 'x' : ' ') + c : m));
    });
    src.value = lines.join('\n');
    cb.closest('li').classList.toggle('done', cb.checked);
    persist();
    renderStats(splitFrontMatter(src.value).body);
  });

  function renderToc() {
    const hs = $$('h1,h2,h3', preview);
    const toc = $('#toc');
    if (hs.length < 2) return (toc.innerHTML = '');
    toc.innerHTML = `<div class="ttl">${esc(t('toc'))}</div>` + hs.map((h) => `<a href="#${h.id}" class="l${h.tagName[1]}">${esc(h.textContent.replace(/^#/, ''))}</a>`).join('');
  }
  // Aktiven Abschnitt im Inhaltsverzeichnis markieren
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$('#toc a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      });
    },
    { rootMargin: '-120px 0px -70% 0px' },
  );
  const observeHeadings = () => {
    spy.disconnect();
    $$('h1,h2,h3', preview).forEach((h) => spy.observe(h));
  };

  function renderStats(body) {
    const plain = body.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`~\-|[\]()!]/g, ' ');
    const words = (plain.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []).length;
    $('#stats').textContent = t('stats', words.toLocaleString(TV.lang === 'de' ? 'de-CH' : 'en-GB'), [...src.value].length.toLocaleString(TV.lang === 'de' ? 'de-CH' : 'en-GB'), Math.max(1, Math.round(words / 220)));
  }
  // #endregion

  // #region Ablauf, Speichern, Dateien
  let timer, saveTimer;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      render();
      observeHeadings();
    }, 120);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 600);
  }
  function persist() {
    store.set('tv-md', { name: fileName, text: src.value });
    $('#saved').textContent = t('savedAt', new Date().toLocaleTimeString(TV.lang === 'de' ? 'de-CH' : 'en-GB', { hour: '2-digit', minute: '2-digit' }));
  }
  function setName(n) {
    fileName = n;
    $('#fileName').textContent = n || t('untitled');
    document.title = (n ? n + ' · ' : '') + 'Markdown · ToolVault';
  }
  function load(text, name) {
    src.value = text.replace(/\r\n?/g, '\n');
    setName(name);
    render();
    observeHeadings();
    persist();
    src.scrollTop = 0;
  }
  function openFile(f) {
    if (!f) return;
    f.text().then((txt) => {
      load(txt, f.name);
      if (view === 'edit') setView('read');
    });
  }
  $('#file').addEventListener('change', (e) => {
    openFile(e.target.files[0]);
    e.target.value = '';
  });
  // ganze Seite als Ablagefläche
  let dragDepth = 0;
  window.addEventListener('dragenter', (e) => {
    if (![...(e.dataTransfer?.types || [])].includes('Files')) return;
    dragDepth++;
    $('#dropOverlay').hidden = false;
  });
  window.addEventListener('dragleave', () => {
    if (--dragDepth <= 0) $('#dropOverlay').hidden = true;
  });
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDepth = 0;
    $('#dropOverlay').hidden = true;
    const f = e.dataTransfer.files[0];
    if (f) openFile(f);
  });

  const baseName = () => (fileName || t('untitled')).replace(/\.(md|markdown|mdown|txt)$/i, '');
  function save() {
    download(baseName() + '.md', src.value, 'text/markdown');
  }
  $('#save').addEventListener('click', save);
  $('#new').addEventListener('click', () => {
    if (src.value.trim() && !confirm(t('confirmNew'))) return;
    load('', null);
    setView('split');
    src.focus();
  });
  // Kopf-/Fusszeile druckt der Browser in den Seitenrand (Titel, URL, Datum).
  // Aus (Standard): Seitenrand 0 → der Browser hat keinen Platz dafür; den Abstand
  // übernimmt das Dokument selbst (md.css, .no-hf). Der Titel wird zum Dateinamen,
  // damit „Als PDF speichern“ einen sauberen Namen vorschlägt.
  const hfBox = $('#printHeaders');
  hfBox.checked = store.get('tv-md-print-hf') === true;
  const pageRule = document.head.appendChild(document.createElement('style'));
  const applyHf = () => {
    document.documentElement.classList.toggle('no-hf', !hfBox.checked);
    pageRule.textContent = hfBox.checked ? '' : '@page { margin: 0; }';
  };
  hfBox.addEventListener('change', () => {
    store.set('tv-md-print-hf', hfBox.checked);
    applyHf();
  });
  applyHf();
  let titleBefore = null;
  addEventListener('beforeprint', () => {
    if (hfBox.checked) return;
    titleBefore = document.title;
    document.title = baseName();
  });
  addEventListener('afterprint', () => {
    if (titleBefore !== null) document.title = titleBefore;
    titleBefore = null;
  });
  $('#print').addEventListener('click', () => {
    if (view === 'edit') setView('split');
    setTimeout(() => window.print(), 60);
  });
  // Eigenständige HTML-Datei mit eingebettetem Lesestil
  $('#exportHtml').addEventListener('click', () => {
    const body = preview.cloneNode(true);
    $$('.copy, .anchor', body).forEach((el) => el.remove());
    const cssVars = getComputedStyle(document.documentElement);
    const v = (n) => cssVars.getPropertyValue(n).trim();
    const doc = `<!doctype html>
<html lang="${TV.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(baseName())}</title>
<style>
body{margin:0;background:${v('--bg')};color:${v('--text')};font:17px/1.72 ${prefs.font === 'serif' ? "Literata, Georgia, serif" : prefs.font === 'mono' ? "'JetBrains Mono', Menlo, monospace" : "Montserrat, system-ui, sans-serif"}}
main{max-width:${prefs.width === 'wide' ? 96 : 72}ch;margin:0 auto;padding:48px 22px 80px}
h1,h2,h3,h4{font-family:Montserrat,system-ui,sans-serif;line-height:1.25;margin:1.8em 0 .6em}h1{font-size:2em}h2{font-size:1.45em;border-bottom:1px solid ${v('--border')};padding-bottom:.3em}
a{color:${v('--accent')}}code{font-family:'JetBrains Mono',Menlo,monospace;font-size:.86em;background:${v('--surface-2')};border:1px solid ${v('--border')};border-radius:5px;padding:.1em .35em}
pre{background:${v('--surface')};border:1px solid ${v('--border')};border-radius:10px;padding:14px 16px;overflow:auto}pre code{background:none;border:0;padding:0}pre .lang{float:right;font:11px monospace;opacity:.6}
blockquote{border-left:3px solid ${v('--accent')};background:${v('--accent-soft')};margin:0 0 1em;padding:.7em 1.1em;border-radius:0 10px 10px 0}
table{border-collapse:collapse}th,td{border:1px solid ${v('--border')};padding:7px 12px}th{background:${v('--surface-2')}}img{max-width:100%}
li.task{list-style:none;margin-left:-1.4em}hr{border:0;height:1px;background:${v('--border')};margin:2em 0}
.frontmatter{font:12px monospace;opacity:.75;display:grid;grid-template-columns:auto 1fr;gap:2px 12px;margin-bottom:1.5em}
.hljs-keyword,.hljs-built_in,.hljs-literal{color:${v('--accent')}}.hljs-string{color:${v('--ok')}}.hljs-comment{opacity:.6;font-style:italic}
</style></head><body><main>${body.innerHTML}</main></body></html>`;
    download(baseName() + '.html', doc, 'text/html');
  });
  // #endregion

  // #region Formatieren
  function wrapSel(before, after = before, placeholder = '') {
    const { selectionStart: a, selectionEnd: z, value } = src;
    const sel = value.slice(a, z) || placeholder;
    src.setRangeText(before + sel + after, a, z, 'select');
    src.setSelectionRange(a + before.length, a + before.length + sel.length);
    src.focus();
    schedule();
  }
  function prefixLines(prefix) {
    const { selectionStart: a, selectionEnd: z, value } = src;
    const start = value.lastIndexOf('\n', a - 1) + 1;
    const endIdx = value.indexOf('\n', z);
    const end = endIdx === -1 ? value.length : endIdx;
    const lines = value.slice(start, end).split('\n');
    const all = lines.every((l) => l.startsWith(typeof prefix === 'function' ? prefix(0) : prefix));
    const out = lines.map((l, i) => {
      const p = typeof prefix === 'function' ? prefix(i) : prefix;
      return all ? l.slice(p.length) : l.replace(/^(#{1,6} |> |- \[[ x]\] |[-*+] |\d+\. )/, '') && p + l.replace(/^(#{1,6} |> |- \[[ x]\] |[-*+] |\d+\. )/, '');
    });
    src.setRangeText(out.join('\n'), start, end, 'select');
    src.focus();
    schedule();
  }
  function insertBlock(text) {
    const { selectionStart: a, value } = src;
    const pre = a > 0 && value[a - 1] !== '\n' ? '\n\n' : a > 1 && value[a - 2] !== '\n' ? '\n' : '';
    src.setRangeText(pre + text + '\n', a, src.selectionEnd, 'end');
    src.focus();
    schedule();
  }
  const ACTIONS = {
    bold: () => wrapSel('**', '**', 'Text'),
    italic: () => wrapSel('*', '*', 'Text'),
    strike: () => wrapSel('~~', '~~', 'Text'),
    h1: () => prefixLines('# '),
    h2: () => prefixLines('## '),
    h3: () => prefixLines('### '),
    ul: () => prefixLines('- '),
    ol: () => prefixLines((i) => `${i + 1}. `),
    task: () => prefixLines('- [ ] '),
    quote: () => prefixLines('> '),
    code: () => wrapSel('`', '`', 'code'),
    block: () => wrapSel('```js\n', '\n```', '// code'),
    link: () => {
      const sel = src.value.slice(src.selectionStart, src.selectionEnd);
      wrapSel('[', '](https://)', sel || t('linkText'));
    },
    image: () => wrapSel('![', '](https://)', t('imgAlt')),
    table: () => insertBlock(t('tableTpl')),
    hr: () => insertBlock('---'),
  };
  const FMT = [
    ['bold', '<b>B</b>'], ['italic', '<i>I</i>'], ['strike', '<s>S</s>'], '|',
    ['h1', 'H1'], ['h2', 'H2'], ['h3', 'H3'], '|',
    ['ul', '•'], ['ol', '1.'], ['task', '☐'], ['quote', '❝'], '|',
    ['code', '`'], ['block', '{}'], ['link', '🔗'], ['image', '🖼'], ['table', '▦'], ['hr', '―'],
  ];
  function renderFmt() {
    $('#fmt').innerHTML = FMT.map((f) => (f === '|' ? '<span class="sep"></span>' : `<button type="button" data-act="${f[0]}" title="${esc(t('f_' + f[0]))}" aria-label="${esc(t('f_' + f[0]))}">${f[1]}</button>`)).join('');
  }
  $('#fmt').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (b) ACTIONS[b.dataset.act]();
  });
  src.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'b') (e.preventDefault(), ACTIONS.bold());
    else if (mod && e.key.toLowerCase() === 'i') (e.preventDefault(), ACTIONS.italic());
    else if (mod && e.key.toLowerCase() === 'k') (e.preventDefault(), ACTIONS.link());
    else if (e.key === 'Tab') {
      e.preventDefault();
      src.setRangeText('  ', src.selectionStart, src.selectionEnd, 'end');
      schedule();
    } else if (e.key === 'Enter') {
      // Listen automatisch fortsetzen
      const { selectionStart: a, value } = src;
      const line = value.slice(value.lastIndexOf('\n', a - 1) + 1, a);
      const m = line.match(/^(\s*)([-*+] \[[ xX]\] |[-*+] |(\d+)\. )(.*)$/);
      if (!m) return;
      e.preventDefault();
      if (!m[4].trim()) {
        // leere Aufzählung beenden
        src.setRangeText('', a - line.length, a, 'end');
      } else {
        const next = m[3] ? `${+m[3] + 1}. ` : m[2].replace(/\[[xX]\]/, '[ ]');
        src.setRangeText('\n' + m[1] + next, a, src.selectionEnd, 'end');
      }
      schedule();
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      save();
    }
  });
  src.addEventListener('input', schedule);
  // #endregion

  // #region Ansicht + Lese-Einstellungen
  function setView(v) {
    view = v;
    $('#layout').dataset.view = v;
    $$('#viewSeg button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === v)));
    store.set('tv-md-view', v);
    observeHeadings();
  }
  $$('#viewSeg button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
  function applyPrefs() {
    preview.dataset.font = prefs.font;
    preview.style.setProperty('--read-size', prefs.size + 'rem');
    preview.style.setProperty('--read-width', prefs.width === 'wide' ? '96ch' : '72ch');
    $$('#fontSeg button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.font === prefs.font)));
    $$('#widthSeg button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.width === prefs.width)));
    store.set('tv-md-prefs', prefs);
  }
  $$('#fontSeg button').forEach((b) => b.addEventListener('click', () => ((prefs.font = b.dataset.font), applyPrefs())));
  $$('#widthSeg button').forEach((b) => b.addEventListener('click', () => ((prefs.width = b.dataset.width), applyPrefs())));
  $$('#sizeSeg button').forEach((b) =>
    b.addEventListener('click', () => {
      prefs.size = Math.min(1.4, Math.max(0.84, Math.round((prefs.size + +b.dataset.size * 0.06) * 100) / 100));
      applyPrefs();
    }),
  );
  // Geteilte Ansicht: Seite scrollt proportional zum Editor mit
  src.addEventListener('scroll', () => {
    if (view !== 'split' || window.innerWidth < 900) return;
    const ratio = src.scrollTop / Math.max(1, src.scrollHeight - src.clientHeight);
    const pane = $('.preview-pane');
    const top = pane.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: top + ratio * Math.max(0, pane.offsetHeight - window.innerHeight + 160) });
  });
  // #endregion

  // #region Start
  TV.init({
    glyph: 'M↓',
    strings: STRINGS,
    onLang: () => {
      renderFmt();
      setName(fileName);
      render();
      observeHeadings();
    },
  });
  const saved = store.get('tv-md');
  if (saved && typeof saved.text === 'string') load(saved.text, saved.name);
  else load(SAMPLE[TV.lang] || SAMPLE.en, null);
  setView(store.get('tv-md-view') || 'split');
  applyPrefs();
  window.MD = { load, render, setView };
  // #endregion
})();
