/* QR Studio · Logik
   Erstellen: Formulare -> Payload -> qrcode-generator -> "Szene" aus SVG-Pfaden,
   die identisch als Canvas (Vorschau/PNG) und als SVG exportiert wird.
   Lesen: jsQR auf Bild/Kamera -> Typ-Erkennung -> Felder, Details, Hexdump. */
(function () {
  'use strict';
  const { $, $$, t, esc, copy, download, toast } = TV;
  qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];

  // #region Icons (eigene, 24×24, Strich) und Logos (eigene, 100×100, Fläche)
  const IC = {
    link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L12 5.6"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>',
    wifi: '<path d="M2.5 9a14 14 0 0 1 19 0"/><path d="M5.8 12.6a9 9 0 0 1 12.4 0"/><path d="M9.2 16.1a4.2 4.2 0 0 1 5.6 0"/><circle cx="12" cy="19.4" r="1.3" fill="currentColor"/>',
    user: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10.5" r="2.4"/><path d="M5.5 16.5c.8-1.9 2-2.8 3.5-2.8s2.7.9 3.5 2.8"/><path d="M15 10h3.5M15 13.5h3.5"/>',
    person: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c1.2-3.6 3.8-5.4 7-5.4s5.8 1.8 7 5.4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7.5l8 5.5 8-5.5"/>',
    chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z"/><path d="M8.5 9.5h7M8.5 12.5h4"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.5 18.5h3"/><path d="M10 5.5h4"/>',
    pin: '<path d="M12 21.5s-6.5-6.2-6.5-11.3a6.5 6.5 0 0 1 13 0c0 5.1-6.5 11.3-6.5 11.3z"/><circle cx="12" cy="10" r="2.4"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2.5M13.5 14H16M8 17h2.5"/>',
    text: '<path d="M5 6h14M5 10.5h14M5 15h9M5 19.5h6"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
    building: '<path d="M4.5 20.5V5.5l8-2.5v17.5M12.5 8.5l7 2v10"/><path d="M8 8h1.5M8 11.5h1.5M8 15h1.5M15.5 13.5H17M15.5 17H17M3 20.5h18"/>',
    home: '<path d="M3.5 11L12 4l8.5 7"/><path d="M6 9.5v10.5h12V9.5"/><path d="M10 20v-5h4v5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    locate: '<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
    x: '<path d="M7 7l10 10M17 7L7 17"/>',
    tag: '<path d="M3.5 12.5V5a1.5 1.5 0 0 1 1.5-1.5h7.5l8 8-9 9z"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/>',
    upload: '<path d="M12 15.5V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4 15v3.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V15"/>',
    camera: '<path d="M3.5 8.5A2 2 0 0 1 5.5 6.5h2.2L9.5 4h5l1.8 2.5h2.2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.6"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.2c-.6-.8-1.5-1.2-2.6-1.2-1.6 0-2.7.8-2.7 2s1.1 1.6 2.7 2 2.9.8 2.9 2.1-1.2 2-2.9 2c-1.2 0-2.2-.5-2.8-1.3M12 6v2M12 16v2"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M18.5 4.5l1.8 1.8"/>',
    magnet: '<path d="M6 4v8a6 6 0 0 0 12 0V4"/><path d="M6 8h3M15 8h3"/><path d="M9 4v8a3 3 0 0 0 6 0V4"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/>',
  };
  const icon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k] || IC.text}</svg>`;

  // Logos: bewusst rund und kräftig, damit sie in der QR-Mitte gut wirken (evenodd = Aussparungen)
  const LOGOS = {
    smile: { d: 'M50 5a45 45 0 1 0 0 90a45 45 0 1 0 0-90z M35 30a7 7 0 1 1 0 14a7 7 0 1 1 0-14z M65 30a7 7 0 1 1 0 14a7 7 0 1 1 0-14z M26 56c6 14 16 21 24 21s18-7 24-21z', rule: 'evenodd' },
    heart: { d: 'M50 90C20 68 5 52 5 32 5 16 17 6 31 6c9 0 15 5 19 13 4-8 10-13 19-13 14 0 26 10 26 26 0 20-15 36-45 58z' },
    star: { d: 'M50 4l12 32 34 1-27 21 10 34-29-20-29 20 10-34L4 37l34-1z' },
    coffee: { d: 'M14 36h58v24c0 16-12 26-29 26S14 76 14 60z M72 42h7c9 0 13 6 13 12s-4 12-13 12h-7v-8h6c4 0 6-2 6-4s-2-4-6-4h-6z M30 6c-5 6 5 10 0 18h6c5-8-5-12 0-18z M44 4c-5 6 5 10 0 18h6c5-8-5-12 0-18z M58 6c-5 6 5 10 0 18h6c5-8-5-12 0-18z' },
    paw: { d: 'M50 50c16 0 28 14 26 27-2 12-16 9-26 9s-24 3-26-9c-2-13 10-27 26-27z M22 30a10 12 0 1 1 0 24a10 12 0 1 1 0-24z M40 10a10 12 0 1 1 0 24a10 12 0 1 1 0-24z M60 10a10 12 0 1 1 0 24a10 12 0 1 1 0-24z M78 30a10 12 0 1 1 0 24a10 12 0 1 1 0-24z' },
    rocket: { d: 'M50 4c16 12 22 32 18 58H32C28 36 34 16 50 4z M50 26a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M32 46L16 68l16-3z M68 46l16 22-16-3z M38 66h24L50 96z', rule: 'evenodd' },
    music: { d: 'M36 18l50-12v58c0 9-8 15-17 14-8-1-12-8-8-15 3-6 11-8 17-5V24L44 32v44c0 9-8 15-17 14-8-1-12-8-8-15 3-6 11-8 17-5z' },
    flower: { d: 'M50 4a17 17 0 0 1 14 27a17 17 0 0 1 26 22a17 17 0 0 1-17 27a17 17 0 0 1-23 16a17 17 0 0 1-23-16a17 17 0 0 1-17-27a17 17 0 0 1 26-22A17 17 0 0 1 50 4z M50 38a12 12 0 1 0 0 24a12 12 0 1 0 0-24z', rule: 'evenodd' },
  };
  const logoSvg = (k, fill = 'currentColor') =>
    `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${LOGOS[k].d}" fill="${fill}" fill-rule="${LOGOS[k].rule || 'nonzero'}"/></svg>`;
  // #endregion

  // #region Inhaltstypen + Felder
  const isMail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const isPhone = (v) => /^\+?[\d\s()\/.-]{4,}$/.test(v) && /\d{3}/.test(v.replace(/\D/g, ''));
  const isUrl = (v) => {
    try {
      const u = new URL(v);
      return /^https?:$/.test(u.protocol) && u.hostname.includes('.');
    } catch (e) {
      return false;
    }
  };
  // Telefonnummer beim Verlassen des Felds lesbar gruppieren (+41 79 123 45 67)
  function fmtPhone(v) {
    let d = v.replace(/[^\d+]/g, '');
    if (d.startsWith('00')) d = '+' + d.slice(2);
    if (/^\+41\d{9}$/.test(d)) return d.replace(/^\+41(\d{2})(\d{3})(\d{2})(\d{2})$/, '+41 $1 $2 $3 $4');
    if (/^0\d{9}$/.test(d)) return d.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
    if (/^\+49\d{6,}$/.test(d)) return d.replace(/^\+49(\d{3,4})(\d+)$/, '+49 $1 $2');
    if (/^\+\d{10,}$/.test(d)) return d.replace(/^(\+\d{2})(\d{2,3})(\d{3})(\d+)$/, '$1 $2 $3 $4');
    return v.trim();
  }
  const req = (v) => !!v.trim() || 'e_required';
  const V = {
    mail: (v) => !v || isMail(v) || 'e_mail',
    phone: (v) => !v || isPhone(v) || 'e_phone',
    url: (v) => !v || isUrl(v) || 'e_url',
    lat: (v) => (v.trim() !== '' && !isNaN(+v) && Math.abs(+v) <= 90) || (v === '' ? 'e_required' : 'e_lat'),
    lon: (v) => (v.trim() !== '' && !isNaN(+v) && Math.abs(+v) <= 180) || (v === '' ? 'e_required' : 'e_lon'),
    req,
    reqMail: (v) => (req(v) === true ? V.mail(v) : 'e_required'),
    reqPhone: (v) => (req(v) === true ? V.phone(v) : 'e_required'),
  };
  const FORMS = {
    text: { icon: 'link', fields: [{ id: 'text', type: 'textarea', wide: true, icon: 'text', value: 'https://andrasmarro.github.io/ToolVault/', hint: 'h_text', counter: true, clear: true }] },
    wifi: {
      icon: 'wifi',
      fields: [
        { id: 'ssid', icon: 'wifi', hint: 'h_ssid', validate: V.req, clear: true },
        { id: 'pass', icon: 'lock', input: 'password', reveal: true, optional: true },
        { id: 'sec', type: 'select', icon: 'shield', options: [['WPA', 'WPA / WPA2 / WPA3'], ['WEP', 'WEP'], ['nopass', '—']] },
        { id: 'hidden', type: 'checkbox' },
      ],
    },
    vcard: {
      icon: 'user',
      fields: [
        { id: 'first', icon: 'person' },
        { id: 'last', icon: 'person' },
        { id: 'org', icon: 'building', optional: true },
        { id: 'jobtitle', icon: 'tag', optional: true },
        { id: 'phone', icon: 'phone', input: 'tel', hint: 'h_phone', validate: V.phone, format: fmtPhone, clear: true },
        { id: 'mail', icon: 'mail', input: 'email', hint: 'h_mail', validate: V.mail, clear: true },
        { id: 'url', icon: 'globe', input: 'url', hint: 'h_url', validate: V.url, wide: true, optional: true, clear: true },
        { id: 'street', icon: 'home', optional: true },
        { id: 'city', icon: 'pin', optional: true },
        { id: 'country', icon: 'globe', optional: true },
      ],
    },
    email: {
      icon: 'mail',
      fields: [
        { id: 'to', icon: 'mail', input: 'email', hint: 'h_mail', validate: V.reqMail, clear: true },
        { id: 'subject', icon: 'tag', optional: true, clear: true },
        { id: 'body', type: 'textarea', icon: 'text', wide: true, optional: true, counter: true },
      ],
    },
    sms: {
      icon: 'chat',
      fields: [
        { id: 'number', icon: 'phone', input: 'tel', hint: 'h_phone', validate: V.reqPhone, format: fmtPhone, clear: true },
        { id: 'body', type: 'textarea', icon: 'chat', wide: true, optional: true, counter: 160 },
      ],
    },
    tel: { icon: 'phone', fields: [{ id: 'number', icon: 'phone', input: 'tel', hint: 'h_phone', validate: V.reqPhone, format: fmtPhone, clear: true }] },
    geo: {
      icon: 'pin',
      fields: [
        { id: 'lat', icon: 'pin', value: '47.3769', mode: 'decimal', hint: 'h_lat', validate: V.lat },
        { id: 'lon', icon: 'pin', value: '8.5417', mode: 'decimal', hint: 'h_lon', validate: V.lon, locate: true },
        { id: 'query', icon: 'tag', wide: true, optional: true, clear: true },
      ],
    },
    event: {
      icon: 'cal',
      fields: [
        { id: 'title', icon: 'cal', wide: true, validate: V.req, clear: true },
        { id: 'start', icon: 'clock', input: 'datetime-local' },
        { id: 'end', icon: 'clock', input: 'datetime-local', optional: true },
        { id: 'location', icon: 'pin', wide: true, optional: true, clear: true },
        { id: 'desc', type: 'textarea', icon: 'text', wide: true, optional: true },
      ],
    },
  };
  const FIELD_LABEL = { text: 'f_text', ssid: 'f_ssid', pass: 'f_pass', sec: 'f_sec', hidden: 'f_hidden', first: 'f_first', last: 'f_last', org: 'f_org', jobtitle: 'f_jobtitle', phone: 'f_phone', mail: 'f_mail', url: 'f_url', street: 'f_street', city: 'f_city', country: 'f_country', to: 'f_to', subject: 'f_subject', body: 'f_body', number: 'f_number', lat: 'f_lat', lon: 'f_lon', query: 'f_query', title: 'f_title', start: 'f_start', end: 'f_end', location: 'f_location', desc: 'f_desc' };

  const wEsc = (s) => s.replace(/([\\;,":])/g, '\\$1');
  const vEsc = (s) => s.replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n');
  const val = (id) => {
    const el = $('#f-' + id);
    if (!el) return '';
    return el.type === 'checkbox' ? el.checked : (el.value || '').trim();
  };
  const icsDate = (v) => (v ? v.replace(/[-:]/g, '').slice(0, 13) + '00' : '');

  const BUILD = {
    text: () => $('#f-text')?.value || '',
    wifi: () => {
      if (!val('ssid')) return '';
      const sec = val('sec');
      return `WIFI:T:${sec};S:${wEsc(val('ssid'))};${sec !== 'nopass' ? 'P:' + wEsc(val('pass')) + ';' : ''}${val('hidden') ? 'H:true;' : ''};`;
    },
    vcard: () => {
      if (!val('first') && !val('last') && !val('org')) return '';
      const l = ['BEGIN:VCARD', 'VERSION:3.0', `N:${vEsc(val('last'))};${vEsc(val('first'))};;;`, `FN:${vEsc((val('first') + ' ' + val('last')).trim() || val('org'))}`];
      if (val('org')) l.push('ORG:' + vEsc(val('org')));
      if (val('jobtitle')) l.push('TITLE:' + vEsc(val('jobtitle')));
      if (val('phone')) l.push('TEL;TYPE=CELL:' + val('phone').replace(/[^\d+]/g, ''));
      if (val('mail')) l.push('EMAIL:' + val('mail'));
      if (val('url')) l.push('URL:' + val('url'));
      if (val('street') || val('city') || val('country')) l.push(`ADR:;;${vEsc(val('street'))};${vEsc(val('city'))};;;${vEsc(val('country'))}`);
      l.push('END:VCARD');
      return l.join('\n');
    },
    email: () => {
      const q = [];
      if (val('subject')) q.push('subject=' + encodeURIComponent(val('subject')));
      if (val('body')) q.push('body=' + encodeURIComponent(val('body')));
      return val('to') ? 'mailto:' + val('to') + (q.length ? '?' + q.join('&') : '') : '';
    },
    sms: () => (val('number') ? `SMSTO:${val('number').replace(/[^\d+]/g, '')}:${val('body')}` : ''),
    tel: () => (val('number') ? 'tel:' + val('number').replace(/[^\d+]/g, '') : ''),
    geo: () => `geo:${val('lat')},${val('lon')}${val('query') ? '?q=' + encodeURIComponent(val('query')) : ''}`,
    event: () => {
      if (!val('title')) return '';
      const l = ['BEGIN:VEVENT', 'SUMMARY:' + vEsc(val('title'))];
      if (val('start')) l.push('DTSTART:' + icsDate(val('start')));
      if (val('end')) l.push('DTEND:' + icsDate(val('end')));
      if (val('location')) l.push('LOCATION:' + vEsc(val('location')));
      if (val('desc')) l.push('DESCRIPTION:' + vEsc(val('desc')));
      l.push('END:VEVENT');
      return l.join('\n');
    },
  };

  let qType = 'text';
  const draft = {};

  function renderTypeTabs() {
    $('#typeTabs').innerHTML = '';
    Object.keys(FORMS).forEach((k) => {
      const b = document.createElement('button');
      b.className = 'type';
      b.setAttribute('role', 'tab');
      b.innerHTML = icon(FORMS[k].icon) + `<span>${esc(t('t_' + k))}</span>`;
      b.setAttribute('aria-selected', String(k === qType));
      b.addEventListener('click', () => {
        saveDraft();
        qType = k;
        renderTypeTabs();
        renderFields();
        generate();
      });
      $('#typeTabs').appendChild(b);
    });
  }
  function saveDraft() {
    draft[qType] = {};
    $$('#fields [id^="f-"]').forEach((el) => (draft[qType][el.id] = el.type === 'checkbox' ? el.checked : el.value));
  }
  function defaultValue(f) {
    if (f.id === 'start' || f.id === 'end') {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(f.id === 'start' ? 18 : 20, 0, 0, 0);
      const p = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`;
    }
    return f.value ?? '';
  }

  // Feld: [Icon] Eingabe [Aktionen] [Status] + Hinweis/Fehler und Zähler darunter
  function buildField(f) {
    if (f.type === 'checkbox') {
      const l = document.createElement('label');
      l.className = 'qf qf-check' + (f.wide ? ' wide' : '');
      l.innerHTML = `<input type="checkbox" id="f-${f.id}"> <span>${esc(t(FIELD_LABEL[f.id]))}</span>`;
      const el = l.querySelector('input');
      el.checked = !!draft[qType]?.[el.id];
      el.addEventListener('change', schedule);
      return l;
    }
    const wrap = document.createElement('label');
    wrap.className = 'qf' + (f.wide ? ' wide' : '');
    wrap.innerHTML = `<span class="qf-label"><span>${esc(t(FIELD_LABEL[f.id]))}</span>${f.optional ? `<span class="opt">${esc(t('optional'))}</span>` : ''}</span>
      <span class="qf-box"><span class="qf-pre">${icon(f.icon)}</span></span>
      <span class="qf-foot"><span class="qf-hint">${f.hint ? esc(t(f.hint)) : ''}</span><span class="qf-count"></span></span>`;
    const box = wrap.querySelector('.qf-box');
    let el;
    if (f.type === 'textarea') el = document.createElement('textarea');
    else if (f.type === 'select') {
      el = document.createElement('select');
      f.options.forEach(([v, l]) => el.add(new Option(l === '—' ? t('none') : l, v)));
    } else {
      el = document.createElement('input');
      el.type = f.input || 'text';
      if (f.mode) el.inputMode = f.mode;
      if (f.input === 'email') el.autocomplete = 'email';
      if (f.input === 'tel') el.autocomplete = 'tel';
    }
    el.id = 'f-' + f.id;
    el.spellcheck = false;
    const saved = draft[qType]?.[el.id];
    if (f.type === 'select') el.value = saved || f.options[0][0];
    else el.value = saved ?? defaultValue(f);
    box.appendChild(el);

    const addBtn = (ic, title, fn) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'qf-btn';
      b.title = title;
      b.setAttribute('aria-label', title);
      b.innerHTML = icon(ic);
      b.addEventListener('click', (e) => {
        e.preventDefault();
        fn();
      });
      box.appendChild(b);
    };
    if (f.reveal) addBtn('eye', t('showPw'), () => (el.type = el.type === 'password' ? 'text' : 'password'));
    if (f.locate && navigator.geolocation)
      addBtn('locate', t('locate'), () =>
        navigator.geolocation.getCurrentPosition((pos) => {
          $('#f-lat').value = pos.coords.latitude.toFixed(5);
          $('#f-lon').value = pos.coords.longitude.toFixed(5);
          generate();
        }),
      );
    if (f.clear)
      addBtn('x', t('clear'), () => {
        el.value = '';
        el.focus();
        onInput();
      });
    const st = document.createElement('span');
    st.className = 'qf-state';
    box.appendChild(st);

    const count = wrap.querySelector('.qf-count');
    const updateCount = () => {
      if (!f.counter) return;
      const n = [...el.value].length;
      count.textContent = typeof f.counter === 'number' ? `${n} / ${f.counter}` : `${n}`;
      count.style.color = typeof f.counter === 'number' && n > f.counter ? 'var(--warn)' : '';
    };
    const onInput = () => {
      updateCount();
      validateField(wrap, f, el, false);
      schedule();
    };
    el.addEventListener('input', onInput);
    el.addEventListener('change', onInput);
    el.addEventListener('blur', () => {
      if (f.format && el.value) el.value = f.format(el.value);
      validateField(wrap, f, el, true);
      schedule();
    });
    wrap._check = (strict) => validateField(wrap, f, el, strict);
    updateCount();
    return wrap;
  }
  function validateField(wrap, f, el, strict) {
    const v = el.value.trim();
    let res = f.validate ? f.validate(v) : true;
    if (f.id === 'end' && v && val('start') && v < val('start')) res = 'e_end';
    // Fehler erst zeigen, wenn das Feld einmal verlassen wurde (nicht schon beim ersten Tippen)
    if (strict) wrap.dataset.touched = '1';
    const touched = wrap.dataset.touched === '1';
    const hint = wrap.querySelector('.qf-hint');
    if (res !== true && touched) {
      wrap.dataset.state = 'bad';
      hint.textContent = t(res);
    } else {
      wrap.dataset.state = res === true && v && f.validate ? 'ok' : '';
      hint.textContent = f.hint ? t(f.hint) : '';
    }
    return res === true;
  }
  function fieldsValid() {
    let ok = true;
    $$('#fields .qf').forEach((w) => {
      if (w._check && !w._check(false)) ok = false;
    });
    return ok;
  }
  function renderFields() {
    const box = $('#fields');
    box.innerHTML = '';
    FORMS[qType].fields.forEach((f) => box.appendChild(buildField(f)));
  }
  // #endregion

  // #region Gestaltung – Zustand
  const DEFAULT_STYLE = {
    fg: '#15120f', fg2: '#e8a23c', fill: 'solid', bg: '#ffffff', transparent: false, eyeOwn: false, eye: '#d6492f',
    shape: 'square', eyeShape: 'square', radius: 0, ecc: 'M', margin: 4, size: 1024,
    logo: null, logoSize: 22, logoColor: '#15120f', frame: 'none', caption: '',
  };
  let style = { ...DEFAULT_STYLE };
  let customLogo = null;
  const PRESETS = [
    { name: 'Classic', fg: '#15120f', bg: '#ffffff', fill: 'solid', eyeOwn: false },
    { name: 'Ocean', fg: '#0b3d91', fg2: '#13707f', bg: '#ffffff', fill: 'linear', eyeOwn: true, eye: '#0b3d91' },
    { name: 'Sunset', fg: '#b3261e', fg2: '#d9772a', bg: '#fff8ef', fill: 'linear', eyeOwn: true, eye: '#7a1712' },
    { name: 'Forest', fg: '#1f4d2b', fg2: '#3f7a2e', bg: '#f6f8f1', fill: 'radial', eyeOwn: true, eye: '#16351e' },
    { name: 'Grape', fg: '#4b1d6b', fg2: '#a3367d', bg: '#ffffff', fill: 'linear', eyeOwn: true, eye: '#2e1042' },
    { name: 'Ink', fg: '#20201c', bg: '#f2eee6', fill: 'solid', eyeOwn: true, eye: '#d6492f' },
  ];
  const SHAPES = ['square', 'rounded', 'dots', 'diamond', 'bars'];
  const EYES = ['square', 'rounded', 'circle', 'leaf'];
  const SHAPE_SYM = { square: '■', rounded: '▢', dots: '●', diamond: '◆', bars: '▮', circle: '◉', leaf: '◖' };
  // #endregion

  // #region Kapazität (Byte-Modus) per Binärsuche mit dem Generator, gecacht
  const capCache = {};
  function capacity(version, ecc) {
    const k = version + ecc;
    if (capCache[k]) return capCache[k];
    let lo = 0,
      hi = 3000;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      try {
        const q = qrcode(version, ecc);
        q.addData('a'.repeat(mid), 'Byte');
        q.make();
        lo = mid;
      } catch (e) {
        hi = mid - 1;
      }
    }
    return (capCache[k] = lo);
  }
  // #endregion

  // #region Szene (Modul-Einheiten) -> Canvas / SVG
  const inFinder = (r, c, n) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const DOT_R = 0.5; // kleinere Punkte liest z. B. jsQR nicht mehr zuverlässig
  const f2 = (v) => Math.round(v * 1000) / 1000;
  // Rechteck mit Eckradien [oben-links, oben-rechts, unten-rechts, unten-links]
  function rectPath(x, y, w, h, r) {
    const [a, b, c, d] = Array.isArray(r) ? r : [r, r, r, r];
    return (
      `M${f2(x + a)} ${f2(y)}H${f2(x + w - b)}` +
      (b ? `A${b} ${b} 0 0 1 ${f2(x + w)} ${f2(y + b)}` : '') +
      `V${f2(y + h - c)}` +
      (c ? `A${c} ${c} 0 0 1 ${f2(x + w - c)} ${f2(y + h)}` : '') +
      `H${f2(x + d)}` +
      (d ? `A${d} ${d} 0 0 1 ${f2(x)} ${f2(y + h - d)}` : '') +
      `V${f2(y + a)}` +
      (a ? `A${a} ${a} 0 0 1 ${f2(x + a)} ${f2(y)}` : '') +
      'Z'
    );
  }
  const circlePath = (cx, cy, r) => `M${f2(cx - r)} ${f2(cy)}a${r} ${r} 0 1 0 ${f2(2 * r)} 0a${r} ${r} 0 1 0 ${f2(-2 * r)} 0Z`;

  function buildScene(qr) {
    const n = qr.getModuleCount();
    const m = style.margin;
    const W = n + 2 * m;
    const pad = style.frame === 'badge' ? 1.4 : 0;
    const capH = style.frame !== 'none' ? Math.max(3.2, n * 0.13) : 0;
    const total = { w: W + 2 * pad, h: W + 2 * pad + capH };
    const ox = pad + m,
      oy = pad + m; // Ursprung des ersten Moduls
    const mods = [];
    for (let c = 0; c < n; c++)
      for (let r = 0; r < n; r++) {
        if (!qr.isDark(r, c) || inFinder(r, c, n)) continue;
        const x = ox + c,
          y = oy + r;
        if (style.shape === 'dots') mods.push(circlePath(x + 0.5, y + 0.5, DOT_R));
        else if (style.shape === 'rounded') mods.push(rectPath(x + 0.04, y + 0.04, 0.92, 0.92, 0.32));
        else if (style.shape === 'diamond') mods.push(`M${f2(x + 0.5)} ${f2(y - 0.18)}L${f2(x + 1.18)} ${f2(y + 0.5)}L${f2(x + 0.5)} ${f2(y + 1.18)}L${f2(x - 0.18)} ${f2(y + 0.5)}Z`);
        else if (style.shape === 'bars') {
          // senkrechte Läufe zu abgerundeten Balken zusammenfassen
          if (r > 0 && qr.isDark(r - 1, c) && !inFinder(r - 1, c, n)) continue;
          let len = 1;
          while (r + len < n && qr.isDark(r + len, c) && !inFinder(r + len, c, n)) len++;
          mods.push(rectPath(x + 0.08, y + 0.03, 0.84, len - 0.06, 0.42));
        } else mods.push(rectPath(x, y, 1.02, 1.02, 0));
      }
    const outer = [],
      inner = [];
    const ER = { square: [0, 0, 0], rounded: [2, 1.4, 0.9], circle: [3.5, 2.5, 1.5] };
    [[0, 0, 'tl'], [0, n - 7, 'tr'], [n - 7, 0, 'bl']].forEach(([r, c, pos]) => {
      const x = ox + c,
        y = oy + r;
      if (style.eyeShape === 'leaf') {
        // zwei gegenüberliegende Ecken rund, Spitze zeigt zur Code-Mitte
        const big = { tl: [3, 0, 3, 0], tr: [0, 3, 0, 3], bl: [0, 3, 0, 3] }[pos];
        outer.push(rectPath(x, y, 7, 7, big) + rectPath(x + 1, y + 1, 5, 5, big.map((v) => (v ? 2 : 0))));
        inner.push(rectPath(x + 2, y + 2, 3, 3, big.map((v) => (v ? 1.2 : 0))));
      } else {
        const [a, b, cc] = ER[style.eyeShape];
        outer.push(rectPath(x, y, 7, 7, a) + rectPath(x + 1, y + 1, 5, 5, b));
        inner.push(style.eyeShape === 'circle' ? circlePath(x + 3.5, y + 3.5, 1.5) : rectPath(x + 2, y + 2, 3, 3, cc));
      }
    });
    // Abrundung des ganzen Bildes (0–12 → bis ~ein Viertel der Breite)
    const R = (style.radius / 12) * (total.w / 4);
    return { n, W, total, ox, oy, pad, capH, R, mods: mods.join(''), outer: outer.join(''), inner: inner.join('') };
  }

  function logoSource() {
    if (style.logo === 'custom') return customLogo;
    if (style.logo && LOGOS[style.logo]) return logoImage(style.logo, style.logoColor);
    return null;
  }
  const _logoCache = {};
  function logoImage(k, color) {
    const key = k + color;
    if (_logoCache[key]) return _logoCache[key];
    const img = new Image();
    img.onload = () => schedule();
    img.src = 'data:image/svg+xml,' + encodeURIComponent(logoSvg(k, color).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" '));
    return (_logoCache[key] = img);
  }
  function logoRect(sc, img) {
    const box = sc.n * (style.logoSize / 100);
    const ratio = img.naturalWidth / img.naturalHeight || 1;
    const w = ratio >= 1 ? box : box * ratio;
    const h = ratio >= 1 ? box / ratio : box;
    const cx = sc.ox + sc.n / 2,
      cy = sc.oy + sc.n / 2;
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }
  const captionText = () => (style.caption || t('captionDefault')).toUpperCase();

  function paint(ctx, sc, which) {
    if (which === 'eye' && style.eyeOwn) return style.eye;
    if (style.fill === 'solid') return style.fg;
    const x0 = sc.ox,
      y0 = sc.oy,
      s = sc.n;
    const g =
      style.fill === 'radial'
        ? ctx.createRadialGradient(x0 + s / 2, y0 + s / 2, 0, x0 + s / 2, y0 + s / 2, s * 0.72)
        : ctx.createLinearGradient(x0, y0, x0 + s, y0 + s);
    g.addColorStop(0, style.fg);
    g.addColorStop(1, style.fg2);
    return g;
  }

  function drawQR(canvas, qr, px) {
    const sc = buildScene(qr);
    const unit = px / sc.total.w;
    canvas.width = px;
    canvas.height = Math.round(sc.total.h * unit);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(unit, unit);
    const inner = rectPath(sc.pad, sc.pad, sc.W, sc.W, Math.max(sc.R * 0.7, sc.pad ? 0.8 : 0));
    if (style.frame === 'badge') {
      ctx.fillStyle = paint(ctx, sc, 'fg');
      ctx.fill(new Path2D(rectPath(0, 0, sc.total.w, sc.total.h, Math.max(sc.R, 1.4))));
      if (style.transparent) ctx.globalCompositeOperation = 'destination-out';
      else ctx.fillStyle = style.bg;
      ctx.fill(new Path2D(inner));
      ctx.globalCompositeOperation = 'source-over';
    } else if (!style.transparent) {
      ctx.fillStyle = style.bg;
      ctx.fill(new Path2D(rectPath(0, 0, sc.total.w, sc.total.h, sc.R)));
    }
    ctx.fillStyle = paint(ctx, sc, 'fg');
    ctx.fill(new Path2D(sc.mods));
    ctx.fillStyle = paint(ctx, sc, 'eye');
    ctx.fill(new Path2D(sc.outer), 'evenodd');
    ctx.fill(new Path2D(sc.inner));
    const img = logoSource();
    if (img && img.complete && img.naturalWidth) {
      const r = logoRect(sc, img);
      ctx.fillStyle = style.transparent ? '#ffffff' : style.bg;
      ctx.fill(new Path2D(rectPath(r.x - 0.7, r.y - 0.7, r.w + 1.4, r.h + 1.4, 1)));
      ctx.drawImage(img, r.x, r.y, r.w, r.h);
    }
    if (style.frame !== 'none') {
      ctx.font = `700 ${sc.capH * 0.46}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = style.frame === 'badge' ? (style.transparent ? '#ffffff' : style.bg) : paint(ctx, sc, 'fg');
      ctx.fillText(captionText(), sc.total.w / 2, sc.pad + sc.W + sc.capH / 2 - (style.frame === 'badge' ? 0.1 : 0.6), sc.total.w - 2);
    }
    return sc;
  }

  function svgString(qr) {
    const sc = buildScene(qr);
    const px = style.size;
    const s = sc.n;
    let defs = '';
    let fgFill = style.fg;
    if (style.fill !== 'solid') {
      defs =
        style.fill === 'radial'
          ? `<radialGradient id="g" gradientUnits="userSpaceOnUse" cx="${f2(sc.ox + s / 2)}" cy="${f2(sc.oy + s / 2)}" r="${f2(s * 0.72)}"><stop offset="0" stop-color="${style.fg}"/><stop offset="1" stop-color="${style.fg2}"/></radialGradient>`
          : `<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${sc.ox}" y1="${sc.oy}" x2="${sc.ox + s}" y2="${sc.oy + s}"><stop offset="0" stop-color="${style.fg}"/><stop offset="1" stop-color="${style.fg2}"/></linearGradient>`;
      fgFill = 'url(#g)';
    }
    const eyeFill = style.eyeOwn ? style.eye : fgFill;
    const bgCol = style.transparent ? '#ffffff' : style.bg;
    const inner = rectPath(sc.pad, sc.pad, sc.W, sc.W, Math.max(sc.R * 0.7, sc.pad ? 0.8 : 0));
    let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f2(sc.total.w)} ${f2(sc.total.h)}" width="${px}" height="${Math.round((px * sc.total.h) / sc.total.w)}">`;
    if (defs) out += `<defs>${defs}</defs>`;
    if (style.frame === 'badge') {
      out += style.transparent
        ? `<path d="${rectPath(0, 0, sc.total.w, sc.total.h, Math.max(sc.R, 1.4))}${inner}" fill="${fgFill}" fill-rule="evenodd"/>`
        : `<path d="${rectPath(0, 0, sc.total.w, sc.total.h, Math.max(sc.R, 1.4))}" fill="${fgFill}"/><path d="${inner}" fill="${style.bg}"/>`;
    } else if (!style.transparent) out += `<path d="${rectPath(0, 0, sc.total.w, sc.total.h, sc.R)}" fill="${style.bg}"/>`;
    out += `<path d="${sc.mods}" fill="${fgFill}"/><path d="${sc.outer}" fill="${eyeFill}" fill-rule="evenodd"/><path d="${sc.inner}" fill="${eyeFill}"/>`;
    const img = logoSource();
    if (img && img.complete && img.naturalWidth) {
      const r = logoRect(sc, img);
      let href;
      if (style.logo !== 'custom') href = img.src;
      else {
        const c = document.createElement('canvas');
        c.width = 400;
        c.height = Math.round(400 / (img.naturalWidth / img.naturalHeight));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        href = c.toDataURL('image/png');
      }
      out += `<path d="${rectPath(r.x - 0.7, r.y - 0.7, r.w + 1.4, r.h + 1.4, 1)}" fill="${bgCol}"/><image href="${href}" x="${f2(r.x)}" y="${f2(r.y)}" width="${f2(r.w)}" height="${f2(r.h)}"/>`;
    }
    if (style.frame !== 'none') {
      out += `<text x="${f2(sc.total.w / 2)}" y="${f2(sc.pad + sc.W + sc.capH / 2 - (style.frame === 'badge' ? 0.1 : 0.6))}" text-anchor="middle" dominant-baseline="middle" font-family="JetBrains Mono, ui-monospace, monospace" font-weight="700" font-size="${f2(sc.capH * 0.46)}" fill="${style.frame === 'badge' ? bgCol : fgFill}">${esc(captionText())}</text>`;
    }
    return out + '</svg>';
  }
  // #endregion

  // #region Prüfung + Details
  const lum = (hex) => {
    const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  function contrastRatio() {
    const lb = style.transparent ? 1 : lum(style.bg);
    const cols = [style.fg].concat(style.fill !== 'solid' ? [style.fg2] : [], style.eyeOwn ? [style.eye] : []);
    const lf = Math.max(...cols.map(lum));
    return { ratio: (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05), inverted: lf > lb };
  }
  function verify(canvas) {
    const out = [];
    const { ratio, inverted } = contrastRatio();
    if (inverted) out.push(`<span class="pill warn">${esc(t('inverted'))}</span>`);
    else if (ratio < 4) out.push(`<span class="pill warn">${esc(t('lowContrast', ratio.toFixed(1)))}</span>`);
    // Echter Test-Scan mit jsQR bei zwei Auflösungen (etwa wie eine Handykamera nah / weiter weg)
    const scanAt = (s) => {
      const w = $('#work');
      const h = Math.round((s * canvas.height) / canvas.width);
      w.width = s;
      w.height = h;
      const ctx = w.getContext('2d', { willReadFrequently: true });
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, s, h);
      ctx.drawImage(canvas, 0, 0, s, h);
      const res = jsQR(ctx.getImageData(0, 0, s, h).data, s, h, { inversionAttempts: 'attemptBoth' });
      return res && res.data === current.text;
    };
    const ok = scanAt(720) || scanAt(480);
    out.unshift(`<span class="pill ${ok ? 'ok' : 'bad'}">${esc(ok ? t('ok') : t('fail'))}</span>`);
    $('#verify').innerHTML = out.join('');
    return ok;
  }
  function renderDetails() {
    const box = $('#details');
    if (!current) return (box.innerHTML = '');
    const { qr, text, ecc } = current;
    const n = qr.getModuleCount();
    const v = (n - 17) / 4;
    const bytes = new TextEncoder().encode(text).length;
    const cap = capacity(v, ecc);
    const capMax = capacity(40, ecc);
    const eccPct = { L: 7, M: 15, Q: 25, H: 30 }[ecc];
    const printCm = Math.max(1, Math.round((n + 2 * style.margin) * 0.04 * 10) / 10);
    const loc = TV.lang === 'de' ? 'de-CH' : 'en-GB';
    const { ratio } = contrastRatio();
    const tile = (l, nn, s2, extra = '', cls = '') =>
      `<div class="dt ${cls}"><div class="l">${esc(l)}</div>${nn !== '' ? `<div class="n">${esc(nn)}</div>` : ''}${s2 ? `<div class="s">${esc(s2)}</div>` : ''}${extra}</div>`;
    box.innerHTML =
      tile(t('dt_version'), v, t('dt_modules', n)) +
      tile(t('dt_ecc'), ecc, t('dt_eccS', eccPct)) +
      tile(
        t('dt_data'),
        `${bytes} B`,
        t('dt_dataS', bytes, cap),
        `<div class="fill"><span style="width:${Math.min(100, (bytes / cap) * 100)}%"></span></div><div class="s" style="margin-top:4px">${esc(t('dt_max', Math.max(1, Math.round((bytes / capMax) * 100))))}</div>`,
        'wide',
      ) +
      tile(t('dt_print'), `${printCm.toLocaleString(loc)} cm`, t('dt_printS')) +
      tile(t('dt_dist'), `≈ ${Math.round(Math.max(printCm, 2) * 10)} cm`, t('dt_distS', Math.max(printCm, 2).toLocaleString(loc))) +
      tile(t('dt_contrast'), `${ratio.toFixed(1)} : 1`, ratio >= 7 ? '✓ AAA' : ratio >= 4.5 ? '✓ AA' : '⚠', '', 'wide') +
      tile(t('dt_raw'), '', '', `<pre class="raw">${esc(text)}</pre>`, 'wide');
  }
  // #endregion

  // #region Erzeugen + Export
  let timer;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(generate, 90);
  }
  let current = null;
  function makeQR(text) {
    const ecc = style.logo ? 'H' : style.ecc;
    const qr = qrcode(0, ecc);
    qr.addData(text, 'Byte');
    qr.make();
    return { qr, ecc };
  }
  function generate() {
    const text = BUILD[qType]();
    const canvas = $('#qrCanvas');
    $('#genMsg').textContent = '';
    const ok = fieldsValid();
    if (!text.trim()) {
      current = null;
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      $('#qrInfo').textContent = '';
      $('#verify').innerHTML = `<span class="muted">${esc(t('empty'))}</span>`;
      renderDetails();
      return;
    }
    try {
      const { qr, ecc } = makeQR(text);
      current = { qr, text, ecc };
      drawQR(canvas, qr, 720);
      const n = qr.getModuleCount();
      $('#qrInfo').textContent = t('info', (n - 17) / 4, n) + ' · ' + ecc;
      verify(canvas);
      if (!ok) {
        $('#genMsg').className = 'msg bad';
        $('#genMsg').textContent = t('invalidFields');
      }
    } catch (e) {
      current = null;
      $('#qrInfo').textContent = '';
      $('#verify').innerHTML = '';
      $('#genMsg').className = 'msg bad';
      $('#genMsg').textContent = t('tooLong');
    }
    renderDetails();
  }
  function fileBase() {
    const text = current ? current.text : 'qr';
    const slug = text.replace(/^[a-z]+:\/*/i, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 32);
    return 'qr-' + (slug || 'code');
  }
  function exportCanvas() {
    const c = document.createElement('canvas');
    drawQR(c, current.qr, style.size);
    return c;
  }
  $('#dlPng').addEventListener('click', () => current && exportCanvas().toBlob((b) => download(fileBase() + '.png', b)));
  $('#dlSvg').addEventListener('click', () => current && download(fileBase() + '.svg', svgString(current.qr), 'image/svg+xml'));
  $('#copyPng').addEventListener('click', () => {
    if (!current) return;
    exportCanvas().toBlob(async (b) => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]);
        toast(t('copied'));
      } catch (e) {
        toast(t('copyFail'));
      }
    });
  });
  // #endregion

  // #region Gestaltung – Steuerung
  const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v);
  function renderShapeSegs() {
    const mk = (sel, list, key) => {
      $(sel).innerHTML = list.map((v) => `<button data-v="${v}">${SHAPE_SYM[v]} ${esc(t('sh_' + v))}</button>`).join('');
      $$(sel + ' button').forEach((b) =>
        b.addEventListener('click', () => {
          style[key] = b.dataset.v;
          syncStyleUI();
          schedule();
        }),
      );
    };
    mk('#shapeSeg', SHAPES, 'shape');
    mk('#eyeSeg', EYES, 'eyeShape');
  }
  function renderLogos() {
    const box = $('#logos');
    box.innerHTML = '';
    const mk = (k, inner, title) => {
      const b = document.createElement('button');
      b.className = 'logo-btn';
      b.dataset.logo = k;
      b.title = title;
      b.setAttribute('aria-label', title);
      b.innerHTML = inner;
      box.appendChild(b);
      return b;
    };
    mk('none', '∅', t('noLogo')).addEventListener('click', () => setLogo(null));
    Object.keys(LOGOS).forEach((k) => mk(k, logoSvg(k), t('lg_' + k)).addEventListener('click', () => setLogo(k)));
    const up = mk('custom', icon('upload') + `<input type="file" accept="image/*" aria-label="${esc(t('upload'))}">`, t('upload'));
    up.querySelector('input').addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const img = new Image();
      img.onload = () => {
        customLogo = img;
        setLogo('custom');
      };
      img.src = URL.createObjectURL(f);
      e.target.value = '';
    });
  }
  function setLogo(k) {
    style.logo = k;
    syncStyleUI();
    generate();
  }
  function renderPresets() {
    $('#presets').innerHTML = '';
    PRESETS.forEach((p) => {
      const b = document.createElement('button');
      b.className = 'btn sm';
      const g = p.fill === 'solid' ? p.fg : `linear-gradient(135deg, ${p.fg}, ${p.fg2})`;
      b.innerHTML = `<span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${g};outline:1px solid var(--border)"></span>${esc(p.name)}`;
      b.addEventListener('click', () => {
        const { name, ...rest } = p;
        Object.assign(style, { fg2: DEFAULT_STYLE.fg2, eye: DEFAULT_STYLE.eye }, rest);
        style.logoColor = p.eyeOwn ? p.eye : p.fg;
        syncStyleUI();
        generate();
      });
      $('#presets').appendChild(b);
    });
  }
  const COLOR_PAIRS = [['fg', 'fgHex'], ['fg2', 'fg2Hex'], ['bg', 'bgHex'], ['eye', 'eyeHex'], ['logoColor', 'logoColorHex']];
  function syncStyleUI() {
    COLOR_PAIRS.forEach(([a, b]) => ($('#' + a).value = $('#' + b).value = style[a]));
    $('#transparent').checked = style.transparent;
    $('#eyeOwn').checked = style.eyeOwn;
    $('#eye').disabled = $('#eyeHex').disabled = !style.eyeOwn;
    $('#fg2Row').hidden = style.fill === 'solid';
    $('#margin').value = style.margin;
    $('#marginVal').textContent = style.margin;
    $('#size').value = style.size;
    $('#sizeVal').textContent = style.size + ' px';
    $('#radius').value = style.radius;
    $('#radiusVal').textContent = style.radius;
    $('#logoSize').value = style.logoSize;
    $('#logoSizeVal').textContent = style.logoSize + '%';
    $('#logoSizeRow').hidden = !style.logo;
    $('#logoColorRow').hidden = !style.logo || style.logo === 'custom';
    $('#captionRow').hidden = style.frame === 'none';
    $('#caption').placeholder = t('captionDefault');
    $('#caption').value = style.caption;
    $$('#fillSeg button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.fill === style.fill)));
    $$('#shapeSeg button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.v === style.shape)));
    $$('#eyeSeg button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.v === style.eyeShape)));
    $$('#frameSeg button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.frame === style.frame)));
    $$('#eccSeg button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.ecc === (style.logo ? 'H' : style.ecc))));
    $$('#logos .logo-btn').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.logo === 'none' && !style.logo) || b.dataset.logo === style.logo)));
    $('#logoNote').textContent = style.logo ? t('logoNote') : '';
  }
  COLOR_PAIRS.forEach(([pick, text]) => {
    $('#' + pick).addEventListener('input', (e) => {
      style[pick] = e.target.value;
      $('#' + text).value = e.target.value;
      schedule();
    });
    $('#' + text).addEventListener('input', (e) => {
      let v = e.target.value.trim();
      if (!v.startsWith('#')) v = '#' + v;
      const ok = isHex(v);
      e.target.classList.toggle('is-bad', !ok);
      if (!ok) return;
      style[pick] = v.toLowerCase();
      $('#' + pick).value = style[pick];
      schedule();
    });
  });
  $('#transparent').addEventListener('change', (e) => ((style.transparent = e.target.checked), schedule()));
  $('#eyeOwn').addEventListener('change', (e) => ((style.eyeOwn = e.target.checked), syncStyleUI(), schedule()));
  ['margin', 'radius', 'logoSize'].forEach((id) =>
    $('#' + id).addEventListener('input', (e) => {
      style[id] = +e.target.value;
      syncStyleUI();
      schedule();
    }),
  );
  $('#size').addEventListener('input', (e) => {
    style.size = +e.target.value;
    $('#sizeVal').textContent = style.size + ' px';
  });
  $('#caption').addEventListener('input', (e) => ((style.caption = e.target.value), schedule()));
  $$('#fillSeg button').forEach((b) => b.addEventListener('click', () => ((style.fill = b.dataset.fill), syncStyleUI(), schedule())));
  $$('#frameSeg button').forEach((b) => b.addEventListener('click', () => ((style.frame = b.dataset.frame), syncStyleUI(), schedule())));
  $$('#eccSeg button').forEach((b) => b.addEventListener('click', () => ((style.ecc = b.dataset.ecc), syncStyleUI(), schedule())));
  $('#resetStyle').addEventListener('click', () => {
    style = { ...DEFAULT_STYLE };
    syncStyleUI();
    generate();
  });
  // #endregion

  // #region Lesen — Typ-Erkennung und Parser
  function detectType(d) {
    if (/^https?:\/\//i.test(d)) return 'url';
    if (/^mailto:/i.test(d) || /^MATMSG:/i.test(d)) return 'email';
    if (/^tel:/i.test(d)) return 'phone';
    if (/^(sms|smsto):/i.test(d)) return 'sms';
    if (/^WIFI:/i.test(d)) return 'wifi';
    if (/^BEGIN:VCARD/i.test(d)) return 'vcard';
    if (/^MECARD:/i.test(d)) return 'mecard';
    if (/^geo:/i.test(d)) return 'geo';
    if (/^BEGIN:(VEVENT|VCALENDAR)/i.test(d)) return 'event';
    if (/^(bitcoin|ethereum|litecoin):/i.test(d)) return 'crypto';
    if (/^otpauth:/i.test(d)) return 'otp';
    if (/^magnet:/i.test(d)) return 'magnet';
    if (/^SPC\r?\n/.test(d) || /^upi:\/\//i.test(d) || /^bezahlcode:/i.test(d)) return 'payment';
    return 'text';
  }
  const unesc = (s) => s.replace(/\\n/g, '\n').replace(/\\([\\;,":])/g, '$1');
  const qs = (s) => Object.fromEntries((s || '').split('&').filter(Boolean).map((p) => p.split('=').map((x) => decodeURIComponent((x || '').replace(/\+/g, ' ')))));
  const fmtIcs = (v) => {
    const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);
    if (!m) return v;
    const d = new Date(+m[1], m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
    return d.toLocaleString(TV.lang === 'de' ? 'de-CH' : 'en-GB', m[4] ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' });
  };

  function parse(type, d) {
    const k = t('keys');
    const r = [];
    const add = (key, v) => v && r.push([k[key] || key, v]);
    if (type === 'url') {
      try {
        const u = new URL(d);
        add('protocol', u.protocol.replace(':', ''));
        add('host', u.hostname + (u.port ? ':' + u.port : ''));
        if (u.pathname !== '/') add('path', u.pathname);
        u.searchParams.forEach((v, key) => r.push([key, v]));
        add('hash', u.hash);
      } catch (e) {}
    } else if (type === 'wifi') {
      d.replace(/^WIFI:/i, '')
        .split(/(?<!\\);/)
        .forEach((p) => {
          const m = p.match(/^([A-Z]):(.*)$/i);
          if (!m) return;
          const v = unesc(m[2]);
          ({ S: () => add('ssid', v), P: () => add('password', v), T: () => add('security', v || t('none')), H: () => add('hidden', v === 'true' ? k.yes : k.no) })[m[1].toUpperCase()]?.();
        });
    } else if (type === 'vcard') {
      const map = { FN: 'name', ORG: 'org', TITLE: 'title', TEL: 'phone', EMAIL: 'email', URL: 'url', ADR: 'address', NOTE: 'note' };
      d.split(/\r?\n/).forEach((line) => {
        const m = line.match(/^([A-Z-]+)(?:;[^:]*)?:(.*)$/i);
        if (m && map[m[1].toUpperCase()]) add(map[m[1].toUpperCase()], unesc(m[2]).replace(/^;+|;+$/g, '').replace(/;+/g, ', '));
      });
    } else if (type === 'event') {
      const map = { SUMMARY: 'summary', DTSTART: 'start', DTEND: 'end', LOCATION: 'location', DESCRIPTION: 'description' };
      d.split(/\r?\n/).forEach((line) => {
        const m = line.match(/^([A-Z-]+)(?:;[^:]*)?:(.*)$/i);
        if (!m || !map[m[1].toUpperCase()]) return;
        const key = map[m[1].toUpperCase()];
        add(key, key === 'start' || key === 'end' ? fmtIcs(m[2]) : unesc(m[2]));
      });
    } else if (type === 'mecard') {
      const map = { N: 'name', TEL: 'phone', EMAIL: 'email', URL: 'url', ADR: 'address', NOTE: 'note', ORG: 'org' };
      d.replace(/^MECARD:/i, '')
        .split(/(?<!\\);/)
        .forEach((p) => {
          const m = p.match(/^([A-Z]+):(.*)$/i);
          if (m && map[m[1].toUpperCase()]) add(map[m[1].toUpperCase()], unesc(m[2]));
        });
    } else if (type === 'email') {
      const m = d.match(/^mailto:([^?]*)(?:\?(.*))?$/i);
      if (m) {
        add('to', decodeURIComponent(m[1]));
        const q = qs(m[2]);
        add('subject', q.subject);
        add('body', q.body);
      }
    } else if (type === 'sms') {
      const m = d.match(/^(?:sms|smsto):([^?:;]+)(?:[?:;](?:body=)?([\s\S]*))?$/i);
      if (m) {
        add('number', m[1]);
        add('body', m[2] ? decodeURIComponent(m[2]) : '');
      }
    } else if (type === 'phone') add('number', d.replace(/^tel:/i, ''));
    else if (type === 'geo') {
      const m = d.match(/^geo:([-\d.]+),([-\d.]+)(?:,[-\d.]+)?(?:\?(.*))?$/i);
      if (m) {
        add('lat', m[1]);
        add('lon', m[2]);
        add('note', qs(m[3]).q);
      }
    } else if (type === 'otp') {
      try {
        const u = new URL(d);
        add('account', decodeURIComponent(u.pathname.replace(/^\//, '')));
        u.searchParams.forEach((v, key) => r.push([key === 'issuer' ? k.issuer : key, key === 'secret' ? v.slice(0, 4) + '…' : v]));
      } catch (e) {}
    } else if (type === 'crypto') {
      const m = d.match(/^([a-z]+):([^?]+)(?:\?(.*))?$/i);
      if (m) {
        add('currency', m[1]);
        add('account', m[2]);
        add('amount', qs(m[3]).amount);
      }
    }
    return r;
  }
  // #endregion

  // #region Lesen — Darstellung
  const TYPE_ICON = { url: 'link', email: 'mail', phone: 'phone', sms: 'chat', wifi: 'wifi', vcard: 'user', mecard: 'user', geo: 'pin', event: 'cal', crypto: 'coin', otp: 'key', magnet: 'magnet', payment: 'coin', text: 'text' };
  let lastRead = null;
  function showRead(code, source) {
    lastRead = { code, source };
    const d = code.data;
    const type = detectType(d);
    $('#readResult').hidden = false;
    $('#readMsg').textContent = '';
    $('#typeIco').innerHTML = icon(TYPE_ICON[type]);
    $('#typeName').textContent = t('types')[type];
    $('#srcName').textContent = source.name;
    drawShot(source, code.location);
    $('#payload').innerHTML = type === 'url' ? `<a href="${esc(d)}" target="_blank" rel="noopener noreferrer">${esc(d)}</a>` : esc(d);

    const acts = $('#actions');
    acts.innerHTML = '';
    const btn = (label, fn, primary) => {
      const b = document.createElement('button');
      b.className = 'btn' + (primary ? ' primary' : '');
      b.textContent = label;
      b.addEventListener('click', fn);
      acts.appendChild(b);
    };
    const link = (label, href) => {
      const a = document.createElement('a');
      a.className = 'btn primary';
      a.textContent = label;
      a.href = href;
      if (/^https?:/.test(href)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      acts.appendChild(a);
    };
    btn(t('copy'), () => copy(d));
    if (type === 'url') link(t('open'), d);
    if (type === 'email' && /^mailto:/i.test(d)) link(t('mailTo'), d);
    if (type === 'phone') link(t('call'), d);
    if (type === 'geo') {
      const m = d.match(/^geo:([-\d.]+),([-\d.]+)/i);
      if (m) link(t('map'), `https://www.openstreetmap.org/?mlat=${m[1]}&mlon=${m[2]}#map=16/${m[1]}/${m[2]}`);
    }
    if (type === 'wifi') {
      const p = d.match(/(?:^|;)P:((?:\\.|[^;])*)/i);
      if (p) btn(t('joinWifi'), () => copy(unesc(p[1])), true);
    }

    $('#parsed').innerHTML = '';
    parse(type, d).forEach(([k, v]) => {
      const c = document.createElement('div');
      c.className = 'fieldcard';
      c.innerHTML = `<span class="l">${esc(k)}</span><span class="v">${esc(v)}</span>`;
      const b = document.createElement('button');
      b.className = 'btn sm';
      b.textContent = '⧉';
      b.title = t('copy');
      b.addEventListener('click', () => copy(String(v), k));
      c.appendChild(b);
      $('#parsed').appendChild(c);
    });

    const bytes = new TextEncoder().encode(d);
    const n = code.version ? 17 + 4 * code.version : null;
    $('#readStats').innerHTML = [
      [[...d].length, 's_chars'],
      [bytes.length, 's_bytes'],
      [(d.match(/\S+/g) || []).length, 's_words'],
      [code.version || '—', 's_version'],
      [n ? `${n}×${n}` : '—', 's_modules'],
      [code.chunks?.[0]?.type || '—', 's_mode'],
    ]
      .map(([nn, l]) => `<div class="stat"><div class="n">${esc(nn)}</div><div class="l">${esc(t(l))}</div></div>`)
      .join('');

    const loc = code.location;
    const pt = (p) => `(${Math.round(p.x)}, ${Math.round(p.y)})`;
    $('#tech').innerHTML = '';
    [
      ['type', type],
      ['version', String(code.version)],
      ['chunks', (code.chunks || []).map((c) => c.type).join(', ') || '—'],
      ['ECI', code.chunks?.find((c) => c.type === 'eci')?.assignmentNumber ?? 'UTF-8 (inferred)'],
      ['top-left', loc ? pt(loc.topLeftCorner) : '—'],
      ['top-right', loc ? pt(loc.topRightCorner) : '—'],
      ['bottom-left', loc ? pt(loc.bottomLeftCorner) : '—'],
      ['bottom-right', loc ? pt(loc.bottomRightCorner) : '—'],
    ].forEach(([k, v]) => {
      const a = document.createElement('span');
      a.className = 'k';
      a.textContent = k;
      const b = document.createElement('span');
      b.className = 'v';
      b.textContent = v;
      $('#tech').append(a, b, document.createElement('span'));
    });
    const lines = [];
    for (let i = 0; i < bytes.length; i += 16) {
      const s = bytes.slice(i, i + 16);
      lines.push(i.toString(16).padStart(6, '0') + '  ' + Array.from(s, (b) => b.toString(16).padStart(2, '0')).join(' ').padEnd(48) + ' │ ' + Array.from(s, (b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : '·')).join(''));
    }
    $('#hex').textContent = lines.join('\n');
  }

  // Aufnahme anzeigen, Umgebung abdunkeln und den erkannten Code umranden
  function drawShot(source, loc) {
    const cv = $('#shot');
    const img = source.img;
    if (!img) return;
    const nw = img.naturalWidth || img.width,
      nh = img.naturalHeight || img.height;
    const w = Math.min(560, nw);
    const s = w / nw;
    cv.width = w;
    cv.height = Math.round(nh * s);
    const g = cv.getContext('2d');
    g.drawImage(img, 0, 0, cv.width, cv.height);
    if (!loc) return;
    const k = s / (source.scale || 1);
    const P = ['topLeftCorner', 'topRightCorner', 'bottomRightCorner', 'bottomLeftCorner'].map((p) => [loc[p].x * k, loc[p].y * k]);
    const poly = () => {
      g.moveTo(...P[0]);
      P.slice(1).forEach((p) => g.lineTo(...p));
      g.closePath();
    };
    g.fillStyle = 'rgba(0,0,0,0.45)';
    g.beginPath();
    g.rect(0, 0, cv.width, cv.height);
    poly();
    g.fill('evenodd');
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e8a23c';
    g.strokeStyle = accent;
    g.lineWidth = Math.max(2, cv.width / 140);
    g.lineJoin = 'round';
    g.beginPath();
    poly();
    g.stroke();
    g.fillStyle = accent;
    P.forEach(([x, y]) => {
      g.beginPath();
      g.arc(x, y, g.lineWidth * 1.8, 0, Math.PI * 2);
      g.fill();
    });
  }

  function decodeImage(img, name) {
    const nw = img.naturalWidth || img.width,
      nh = img.naturalHeight || img.height;
    const scale = Math.min(1, 1600 / Math.max(nw, nh));
    const w = Math.round(nw * scale),
      h = Math.round(nh * scale);
    const c = $('#work');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    let code = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'attemptBoth' });
    let used = scale;
    if (!code && w > 600) {
      const s2 = 600 / w;
      c.width = 600;
      c.height = Math.round(h * s2);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      code = jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height, { inversionAttempts: 'attemptBoth' });
      used = scale * s2;
    }
    if (!code) {
      $('#readMsg').className = 'msg bad';
      $('#readMsg').textContent = t('noCode');
      return;
    }
    showRead(code, { name, img, scale: used });
  }
  function readFile(f) {
    if (!f || !f.type.startsWith('image/')) return;
    const img = new Image();
    img.onload = () => decodeImage(img, f.name || 'clipboard.png');
    img.src = URL.createObjectURL(f);
  }
  $('#readFile').addEventListener('change', (e) => {
    readFile(e.target.files[0]);
    e.target.value = '';
  });
  const drop = $('#drop');
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => (e.preventDefault(), drop.classList.add('over'))));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, () => drop.classList.remove('over')));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    readFile(e.dataTransfer.files[0]);
  });
  document.addEventListener('paste', (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
    if (!item) return;
    e.preventDefault();
    setMode('read');
    readFile(item.getAsFile());
  });

  let stream = null;
  let raf = 0;
  async function startCam() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    } catch (e) {
      $('#readMsg').className = 'msg bad';
      $('#readMsg').textContent = t('camDenied');
      return;
    }
    const v = $('#video');
    v.srcObject = stream;
    await v.play();
    $('#cam').hidden = false;
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d', { willReadFrequently: true });
    let frame = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (frame++ % 3 || v.readyState < 2) return;
      const w = 640;
      const h = Math.round((v.videoHeight / v.videoWidth) * w) || 480;
      c.width = w;
      c.height = h;
      ctx.drawImage(v, 0, 0, w, h);
      const code = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
      if (code && code.data) {
        if (navigator.vibrate) navigator.vibrate(60);
        const snap = new Image();
        snap.onload = () => showRead(code, { name: t('liveCam'), img: snap, scale: 1 });
        snap.src = c.toDataURL('image/jpeg', 0.85);
        stopCam();
      }
    };
    loop();
  }
  function stopCam() {
    cancelAnimationFrame(raf);
    if (stream) stream.getTracks().forEach((tr) => tr.stop());
    stream = null;
    $('#cam').hidden = true;
  }
  $('#camBtn').addEventListener('click', startCam);
  $('#camClose').addEventListener('click', stopCam);

  $('#toCreate').addEventListener('click', () => {
    if (!lastRead) return;
    draft.text = { 'f-text': lastRead.code.data };
    qType = 'text';
    setMode('create');
    renderTypeTabs();
    renderFields();
    generate();
  });
  // #endregion

  // #region Modus + Start
  function setMode(m) {
    $$('#modeTabs [data-mode]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === m)));
    $('#view-create').hidden = m !== 'create';
    $('#view-read').hidden = m !== 'read';
    if (m !== 'read') stopCam();
    try {
      history.replaceState(null, '', m === 'read' ? '#read' : location.pathname + location.search);
    } catch (e) {}
  }
  $$('#modeTabs [data-mode]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));

  $('#dropIco').innerHTML = icon('upload');
  $('#camIco').innerHTML = icon('camera');
  TV.init({
    glyph: '▦',
    strings: window.QR_STRINGS,
    onLang: () => {
      saveDraft();
      renderTypeTabs();
      renderFields();
      renderShapeSegs();
      renderLogos();
      renderPresets();
      syncStyleUI();
      generate();
      if (lastRead && !$('#readResult').hidden) showRead(lastRead.code, lastRead.source);
    },
  });
  setMode(location.hash === '#read' ? 'read' : 'create');

  // für Tests
  window.QRStudio = { get style() { return style; }, set style(s) { style = s; }, generate, get current() { return current; }, setType: (k) => { saveDraft(); qType = k; renderTypeTabs(); renderFields(); generate(); }, svgString, syncStyleUI };
  // #endregion
})();
