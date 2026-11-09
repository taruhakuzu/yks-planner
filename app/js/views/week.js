/* HAFTA EKRANI: 07:00–02:00 arası saat blokları + sağda Bitirilecekler çubuğu */
window.Views = window.Views || {};
Views.week = (function () {
  // ---- görünüm durumu (yeniden çizimlerde korunur) ----
  const selected = new Set();
  let clipboard = null;           // {items:[{dayOff, start, dur, topic, gen, label, note}]}
  let anchor = null;              // {date, min} – yapıştırma konumu
  let panelTab = 'next';          // next | later | review
  let panelSearch = '';
  let panelTrack = 'all';
  let panelExam = 'all';
  let panelCollapsed = false;
  const scrollMem = {};           // hafta -> scrollTop
  let listScroll = 0;
  let nowTimer = null;
  let rootEl = null;
  let curParams = null;

  const TRACKS = [
    { id: 'all', n: 'Tümü' }, { id: 'mat', n: 'Mat' }, { id: 'geo', n: 'Geo' }, { id: 'fiz', n: 'Fiz' },
    { id: 'kim', n: 'Kim' }, { id: 'bio', n: 'Bio' }, { id: 'tr', n: 'Türkçe' }, { id: 'sos', n: 'Sosyal' }
  ];

  const cfg = () => {
    const st = S.settings;
    return { ds: st.dayStart * 60, de: st.dayEnd * 60, hh: st.hourHeight, ppm: st.hourHeight / 60, snap: Number(st.snap) || 15 };
  };
  const snapMin = (m) => { const s = cfg().snap; return Math.round(m / s) * s; };

  function weekOf(params) { return U.weekStart(params.date || U.todayKey()); }

  function title(params) {
    const days = U.weekDays(weekOf(params));
    const a = U.parse(days[0]), b = U.parse(days[6]);
    const left = a.getMonth() === b.getMonth() ? a.getDate() : a.getDate() + ' ' + U.MONTHS[a.getMonth()];
    return 'Hafta · ' + left + '–' + b.getDate() + ' ' + U.MONTHS[b.getMonth()] + ' ' + b.getFullYear();
  }

  function textColor(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#10131a' : '#fbfbfd';
  }

  // =====================================================================
  // ÇİZİM
  // =====================================================================
  function render(el, params, fresh) {
    rootEl = el; curParams = params;
    const ws = weekOf(params);
    const days = U.weekDays(ws);
    const c = cfg();
    const today = U.todayKey();

    // kaydırma konumlarını koru
    const oldScroll = el.querySelector('.wk-scroll');
    if (oldScroll && !fresh) scrollMem[ws] = oldScroll.scrollTop;
    const oldList = el.querySelector('.todo-list');
    if (oldList) listScroll = oldList.scrollTop;
    const searchFocused = document.activeElement && document.activeElement.classList.contains('tp-search');

    // seçimi temizle (silinen bloklar)
    const ids = new Set(S.state.blocks.map((b) => b.id));
    [...selected].forEach((id) => { if (!ids.has(id)) selected.delete(id); });

    const wPlan = S.weekMinutes(ws, false), wOk = S.weekMinutes(ws, true);
    const totalH = (c.de - c.ds) * c.ppm;

    let gutter = '';
    for (let m = c.ds; m < c.de; m += 60) gutter += '<div class="wk-hour" style="height:' + c.hh + 'px"><span>' + U.fmtClock(m) + '</span></div>';

    const heads = days.map((d, i) => {
      const st = S.dayStatus(d), inf = S.statusInfo(st);
      const mins = S.dayMinutes(d);
      const isFocus = params.focus === d;
      return '<div class="wk-dayhead' + (d === today ? ' today' : '') + (isFocus ? ' focus' : '') + '" data-date="' + d + '" style="--st:' + (inf.color || 'transparent') + '">' +
        '<div class="dh-name">' + U.DAYS_SHORT[i] + ' <b>' + U.parse(d).getDate() + '</b> <span>' + U.MONTHS_SHORT[U.parse(d).getMonth()] + '</span></div>' +
        '<div class="dh-sub">' + (mins ? U.fmtMin(mins) : '—') + (S.isApproved(d) ? ' · <span class="dh-st">' + inf.label + '</span>' : '') + '</div>' +
      '</div>';
    }).join('');

    const cols = days.map((d) => '<div class="wk-col' + (d === today ? ' today' : '') + (params.focus === d ? ' focus' : '') + '" data-date="' + d + '" style="background-size:100% ' + c.hh + 'px"></div>').join('');

    const foots = days.map((d) => {
      const ok = S.isApproved(d);
      const st = S.dayStatus(d), inf = S.statusInfo(st);
      return '<button class="approve' + (ok ? ' on' : '') + '" data-date="' + d + '" style="--st:' + (inf.color || 'var(--accent)') + '" title="' +
        (ok ? 'Onayı kaldır' : 'Bu günü tamamlandı olarak onayla — süreler T.S’den düşülür') + '">' +
        '<span class="ap-tick">✓</span><span class="ap-lbl">' + (ok ? U.fmtMin(S.dayApprovedMinutes(d)) : 'Onayla') + '</span></button>';
    }).join('');

    el.innerHTML =
      '<div class="week-layout' + (panelCollapsed ? ' panel-collapsed' : '') + '">' +
        '<div class="week-main card">' +
          '<div class="week-toolbar">' +
            '<div class="wt-left">' +
              '<button class="icon-btn" data-act="prev" title="Önceki hafta (←)">‹</button>' +
              '<button class="btn small ghost" data-act="this" title="Bu hafta (T)">Bu hafta</button>' +
              '<button class="icon-btn" data-act="next" title="Sonraki hafta (→)">›</button>' +
              '<div class="wt-range">' + U.esc(title(params).replace('Hafta · ', '')) + '</div>' +
            '</div>' +
            '<div class="wt-right">' +
              '<span class="wt-stat">Planlı <b>' + U.fmtHours(wPlan) + '</b></span>' +
              '<span class="wt-stat">Onaylı <b>' + U.fmtHours(wOk) + '</b></span>' +
              '<span class="wt-sep"></span>' +
              '<button class="icon-btn" data-act="zoomout" title="Saatleri daralt (Ctrl + tekerlek)">−</button>' +
              '<button class="icon-btn" data-act="zoomin" title="Saatleri genişlet (Ctrl + tekerlek)">+</button>' +
              '<button class="icon-btn" data-act="more" title="Hafta işlemleri">⋯</button>' +
            '</div>' +
          '</div>' +
          '<div class="wk-head"><div class="wk-corner"></div>' + heads + '</div>' +
          '<div class="wk-scroll"><div class="wk-body" style="height:' + totalH + 'px">' +
            '<div class="wk-gutter">' + gutter + '</div>' + cols +
            '<div class="wk-now hidden"></div>' +
          '</div></div>' +
          '<div class="wk-foot"><div class="wk-corner foot-lbl">Gün<br>onayı</div>' + foots + '</div>' +
        '</div>' +
        '<div class="panel-resizer" title="Genişliği ayarla"></div>' +
        panelHtml() +
      '</div>';

    renderBlocks();
    bind(el, ws);
    updateNowLine();
    clearInterval(nowTimer);
    nowTimer = setInterval(updateNowLine, 30000);

    const sc = el.querySelector('.wk-scroll');
    if (scrollMem[ws] != null) sc.scrollTop = scrollMem[ws];
    else {
      let target = 0;
      if (days.includes(today)) { const n = new Date(); target = ((n.getHours() * 60 + n.getMinutes()) - c.ds - 60) * c.ppm; }
      else {
        const first = S.state.blocks.filter((b) => days.includes(b.date)).sort((a, b) => a.start - b.start)[0];
        if (first) target = (first.start - c.ds - 30) * c.ppm;
      }
      sc.scrollTop = Math.max(0, target);
    }
    const list = el.querySelector('.todo-list');
    if (list) list.scrollTop = listScroll;
    if (searchFocused) { const s = el.querySelector('.tp-search'); if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); } }
  }

  function weekBlocks() {
    const days = U.weekDays(weekOf(curParams));
    const set = new Set(days);
    return S.state.blocks.filter((b) => set.has(b.date));
  }

  /** Blokları sütunlara yerleştirir (çakışanlar yan yana) */
  function renderBlocks() {
    if (!rootEl) return;
    const c = cfg();
    const all = weekBlocks();
    rootEl.querySelectorAll('.wk-col').forEach((col) => {
      const d = col.dataset.date;
      const list = all.filter((b) => b.date === d).sort((a, b) => a.start - b.start || b.dur - a.dur);
      // şerit ataması
      const lanes = [];
      const clusters = [];
      let cluster = null, clusterEnd = -1;
      list.forEach((b) => {
        if (b.start >= clusterEnd) { cluster = { items: [], lanes: [] }; clusters.push(cluster); }
        let lane = cluster.lanes.findIndex((end) => end <= b.start);
        if (lane < 0) { lane = cluster.lanes.length; cluster.lanes.push(0); }
        cluster.lanes[lane] = b.start + b.dur;
        cluster.items.push({ b, lane });
        clusterEnd = Math.max(clusterEnd, b.start + b.dur);
      });
      let html = '';
      clusters.forEach((cl) => {
        const n = cl.lanes.length;
        cl.items.forEach(({ b, lane }) => {
          const color = S.blockColor(b);
          const top = (b.start - c.ds) * c.ppm, h = Math.max(10, b.dur * c.ppm - 2);
          const tiny = h < 30, small = h < 46;
          const sub = S.blockSub(b);
          html += '<div class="blk' + (selected.has(b.id) ? ' sel' : '') + (tiny ? ' tiny' : small ? ' small' : '') + (S.isApproved(b.date) ? ' done' : '') +
            '" data-id="' + b.id + '" style="top:' + top + 'px;height:' + h + 'px;left:calc(' + (lane / n * 100) + '% + 2px);width:calc(' + (100 / n) + '% - 4px);--c:' + color + ';--tc:' + textColor(color) + '" title="' +
            U.esc(S.blockTitle(b) + ' · ' + U.fmtClock(b.start) + '–' + U.fmtClock(b.start + b.dur) + ' (' + U.fmtMin(b.dur) + ')' + (b.note ? '\n' + b.note : '')) + '">' +
            '<div class="blk-h top"></div>' +
            '<div class="blk-in"><div class="blk-t">' + U.esc(S.blockTitle(b)) + '</div>' +
            '<div class="blk-s">' + (sub ? U.esc(sub) + ' · ' : '') + U.fmtClock(b.start) + '–' + U.fmtClock(b.start + b.dur) + ' · ' + U.fmtMin(b.dur, { compact: true }) + '</div>' +
            (b.note && !small ? '<div class="blk-n">' + U.esc(b.note) + '</div>' : '') + '</div>' +
            '<div class="blk-h bot"></div></div>';
        });
      });
      col.innerHTML = html;
    });
  }

  function updateNowLine() {
    if (!rootEl) return;
    const line = rootEl.querySelector('.wk-now');
    if (!line) return;
    const today = U.todayKey();
    const days = U.weekDays(weekOf(curParams));
    const idx = days.indexOf(today);
    const c = cfg();
    const n = new Date();
    let m = n.getHours() * 60 + n.getMinutes();
    if (idx < 0 || m < c.ds || m > c.de) { line.classList.add('hidden'); return; }
    const col = rootEl.querySelectorAll('.wk-col')[idx];
    line.classList.remove('hidden');
    line.style.top = (m - c.ds) * c.ppm + 'px';
    line.style.left = col.offsetLeft + 'px';
    line.style.width = col.offsetWidth + 'px';
  }

  // =====================================================================
  // BİTİRİLECEKLER ÇUBUĞU
  // =====================================================================
  function plannedPending() {
    // onaylanmamış günlerdeki planlı süreler
    const out = {};
    S.state.blocks.forEach((b) => { if (b.topic && !S.isApproved(b.date)) out[b.topic] = (out[b.topic] || 0) + b.dur; });
    return out;
  }

  function panelItems() {
    const q = U.norm(panelSearch.trim());
    let list = S.orderedTopics().filter((t) => !S.isHidden(t.id));
    if (panelTab === 'next') list = list.filter((t) => !S.isFinished(t.id) && !S.isDeferred(t.id));
    else if (panelTab === 'later') list = list.filter((t) => !S.isFinished(t.id) && S.isDeferred(t.id));
    else {
      list = list.filter((t) => S.isFinished(t.id));
      const last = (t) => { const st = S.topicState(t.id); const r = st.rev || []; return r.length ? r[r.length - 1] : st.fin; };
      list.sort((a, b) => String(last(a)).localeCompare(String(last(b))));
    }
    if (panelTrack !== 'all') list = list.filter((t) => S.subject(t.s).track === panelTrack);
    if (panelExam !== 'all') list = list.filter((t) => S.subject(t.s).exam === panelExam);
    if (q) list = list.filter((t) => U.norm(t.n + ' ' + S.subject(t.s).name + ' ' + S.subject(t.s).exam).includes(q));
    return list;
  }

  function panelHtml() {
    const items = panelItems();
    const pend = plannedPending();
    const counts = {
      next: S.topics().filter((t) => !S.isHidden(t.id) && !S.isFinished(t.id) && !S.isDeferred(t.id)).length,
      later: S.topics().filter((t) => !S.isHidden(t.id) && !S.isFinished(t.id) && S.isDeferred(t.id)).length,
      review: S.topics().filter((t) => S.isFinished(t.id)).length
    };
    const tabIdx = { next: 0, later: 1, review: 2 }[panelTab];

    const rows = items.map((t, i) => {
      const sub = S.subject(t.s);
      const ts = S.topicTs(t.id), studied = S.topicStudied(t.id), rem = S.topicRemaining(t.id);
      const p = pend[t.id] || 0;
      let meta;
      if (panelTab === 'review') {
        const st = S.topicState(t.id); const r = st.rev || [];
        const last = r.length ? r[r.length - 1] : st.fin;
        const ago = last ? Math.floor((Date.now() - new Date(last)) / 86400000) : 0;
        meta = sub.exam + ' ' + sub.short + ' · ' + (r.length ? r.length + ' tekrar · ' : '') + (ago ? ago + ' gün önce' : 'bugün');
      } else {
        meta = sub.exam + ' ' + sub.short + ' · kalan ' + U.fmtMin(rem) + (p ? ' · planda ' + U.fmtMin(p) : '');
      }
      return '<div class="todo" data-topic="' + t.id + '" style="--c:' + sub.color + '" title="' + U.esc(t.n + ' — T.S ' + U.fmtMin(ts) + ', çalışılan ' + U.fmtMin(studied) + (t.est ? ' (tahmini süre)' : '')) + '">' +
        '<div class="todo-rank">' + (panelTab === 'review' ? '↻' : i + 1) + '</div>' +
        '<div class="todo-main"><div class="todo-name">' + U.esc(t.n) + '</div>' +
        '<div class="todo-meta">' + U.esc(meta) + '</div>' +
        (panelTab !== 'review' ? '<div class="todo-bar"><i style="width:' + Math.round(S.topicProgress(t.id) * 100) + '%"></i>' + (p && ts ? '<u style="left:' + Math.min(100, Math.round(studied / ts * 100)) + '%;width:' + Math.min(100, Math.round(p / ts * 100)) + '%"></u>' : '') + '</div>' : '') +
        '</div></div>';
    }).join('');

    const empty = panelTab === 'review' ? 'Henüz bitirilen konu yok. Bir konuya sağ tıklayıp “Bitirildi” diyerek buraya taşıyabilirsin.'
      : panelSearch ? 'Aramaya uyan konu yok.' : 'Bu listede konu kalmadı. Harika!';

    return '<aside class="todo-panel" style="width:' + (panelCollapsed ? 44 : S.settings.panelWidth) + 'px">' +
      '<button class="tp-collapse icon-btn" title="' + (panelCollapsed ? 'Çubuğu aç' : 'Çubuğu daralt') + '">' + (panelCollapsed ? '‹' : '›') + '</button>' +
      '<div class="tp-inner">' +
        '<div class="tp-head"><div class="tp-title">Bitirilecekler</div>' +
          '<div class="seg" style="--i:' + tabIdx + '">' +
            '<span class="seg-thumb"></span>' +
            '<button data-tab="next" class="' + (panelTab === 'next' ? 'on' : '') + '" title="Temelden ileriye sıralı konular">Sıradaki <i>' + counts.next + '</i></button>' +
            '<button data-tab="later" class="' + (panelTab === 'later' ? 'on' : '') + '" title="Sona bırakılan matematik konuları ve sözel dersler">Sona kalan <i>' + counts.later + '</i></button>' +
            '<button data-tab="review" class="' + (panelTab === 'review' ? 'on' : '') + '" title="Bitirilen ve tekrar edilecek konular">Tekrar <i>' + counts.review + '</i></button>' +
          '</div>' +
        '</div>' +
        '<div class="tp-tools">' +
          '<input class="tp-search" type="search" placeholder="Konu ara…  (Ctrl+F)" value="' + U.esc(panelSearch) + '">' +
          '<select class="tp-exam" title="Sınav türü"><option value="all">TYT+AYT</option><option value="TYT"' + (panelExam === 'TYT' ? ' selected' : '') + '>TYT</option><option value="AYT"' + (panelExam === 'AYT' ? ' selected' : '') + '>AYT</option></select>' +
        '</div>' +
        '<div class="tp-tracks">' + TRACKS.map((t) => '<button data-track="' + t.id + '" class="chip' + (panelTrack === t.id ? ' on' : '') + '">' + t.n + '</button>').join('') + '</div>' +
        '<div class="tp-generic" title="Genel çalışma blokları — takvime sürükle">' + GENERIC_BLOCKS.map((g) => '<div class="gen" data-gen="' + g.id + '" style="--c:' + g.color + '">' + U.esc(g.n) + '</div>').join('') + '</div>' +
        '<div class="todo-list">' + (rows || '<div class="empty">' + empty + '</div>') + '</div>' +
        '<div class="tp-hint">Sürükleyip takvime bırak · çift tık: odaktaki güne ekle · sağ tık: seçenekler</div>' +
      '</div>' +
    '</aside>';
  }

  function refreshPanel() {
    const old = rootEl.querySelector('.todo-panel');
    const ls = rootEl.querySelector('.todo-list');
    if (ls) listScroll = ls.scrollTop;
    const focused = document.activeElement && document.activeElement.classList.contains('tp-search');
    const tmp = U.h(panelHtml());
    old.replaceWith(tmp);
    bindPanel(tmp);
    const list = tmp.querySelector('.todo-list'); if (list) list.scrollTop = listScroll;
    if (focused) { const s = tmp.querySelector('.tp-search'); s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
  }

  // =====================================================================
  // OLAYLAR
  // =====================================================================
  function bind(el, ws) {
    el.querySelector('[data-act=prev]').onclick = () => gotoWeek(U.addDays(ws, -7));
    el.querySelector('[data-act=next]').onclick = () => gotoWeek(U.addDays(ws, 7));
    el.querySelector('[data-act=this]').onclick = () => gotoWeek(U.todayKey());
    el.querySelector('[data-act=zoomin]').onclick = () => zoom(8);
    el.querySelector('[data-act=zoomout]').onclick = () => zoom(-8);
    el.querySelector('[data-act=more]').onclick = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      weekMenu(r.left, r.bottom + 4, ws);
    };

    const scroll = el.querySelector('.wk-scroll');
    const body = el.querySelector('.wk-body');
    // Saat ızgarası: blok taşıma / boyutlandırma
    body.addEventListener('pointerdown', onGridPointerDown);
    body.addEventListener('dblclick', onGridDblClick);
    body.addEventListener('contextmenu', onGridContext);
    body.addEventListener('pointermove', (e) => { const p = pointToSlot(e.clientX, e.clientY); if (p) anchor = p; });
    scroll.addEventListener('wheel', (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      zoom(e.deltaY < 0 ? 6 : -6);
    }, { passive: false });
    scroll.addEventListener('scroll', () => { scrollMem[ws] = scroll.scrollTop; });

    el.querySelector('.wk-head').addEventListener('contextmenu', (e) => {
      const h = e.target.closest('.wk-dayhead'); if (!h) return;
      dayMenu(e.clientX, e.clientY, h.dataset.date);
    });
    el.querySelector('.wk-head').addEventListener('click', (e) => {
      const h = e.target.closest('.wk-dayhead'); if (!h) return;
      App.setParams({ focus: h.dataset.date });
      el.querySelectorAll('.wk-dayhead, .wk-col').forEach((x) => x.classList.toggle('focus', x.dataset.date === h.dataset.date));
    });
    el.querySelector('.wk-foot').addEventListener('click', (e) => {
      const b = e.target.closest('.approve'); if (!b) return;
      toggleApprove(b.dataset.date);
    });
    el.querySelector('.wk-foot').addEventListener('contextmenu', (e) => {
      const b = e.target.closest('.approve'); if (!b) return;
      dayMenu(e.clientX, e.clientY, b.dataset.date);
    });

    // Panel genişliği
    const rz = el.querySelector('.panel-resizer');
    rz.addEventListener('pointerdown', (e) => {
      if (panelCollapsed) return;
      e.preventDefault();
      const panel = el.querySelector('.todo-panel');
      const startX = e.clientX, startW = panel.offsetWidth;
      rz.classList.add('active');
      const mv = (ev) => { panel.style.width = U.clamp(startW + (startX - ev.clientX), 240, 560) + 'px'; updateNowLine(); };
      const up = () => {
        window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
        rz.classList.remove('active');
        const w = panel.offsetWidth;
        S.state.settings.panelWidth = w; S.saveNow();
      };
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    });
    rz.addEventListener('dblclick', () => { S.state.settings.panelWidth = 320; S.saveNow(); App.render(); });

    bindPanel(el.querySelector('.todo-panel'));
  }

  function bindPanel(panel) {
    panel.querySelector('.tp-collapse').onclick = () => { panelCollapsed = !panelCollapsed; App.render(); };
    if (panelCollapsed) {
      panel.querySelector('.tp-inner').style.display = 'none';
      panel.addEventListener('dblclick', () => { panelCollapsed = false; App.render(); });
      return;
    }
    panel.querySelectorAll('.seg button').forEach((b) => b.onclick = () => { panelTab = b.dataset.tab; refreshPanel(); });
    panel.querySelectorAll('.tp-tracks .chip').forEach((b) => b.onclick = () => { panelTrack = b.dataset.track; refreshPanel(); });
    const search = panel.querySelector('.tp-search');
    search.addEventListener('input', U.debounce(() => { panelSearch = search.value; refreshPanel(); }, 120));
    panel.querySelector('.tp-exam').onchange = (e) => { panelExam = e.target.value; refreshPanel(); };

    const list = panel.querySelector('.todo-list');
    list.addEventListener('pointerdown', (e) => {
      const it = e.target.closest('.todo'); if (!it || e.button !== 0) return;
      startPanelDrag(e, { topic: it.dataset.topic }, it);
    });
    list.addEventListener('dblclick', (e) => {
      const it = e.target.closest('.todo'); if (!it) return;
      quickAdd({ topic: it.dataset.topic });
    });
    list.addEventListener('contextmenu', (e) => {
      const it = e.target.closest('.todo'); if (!it) return;
      topicMenu(e.clientX, e.clientY, it.dataset.topic);
    });
    panel.querySelector('.tp-generic').addEventListener('pointerdown', (e) => {
      const g = e.target.closest('.gen'); if (!g || e.button !== 0) return;
      startPanelDrag(e, { gen: g.dataset.gen }, g);
    });
    panel.querySelector('.tp-generic').addEventListener('dblclick', (e) => {
      const g = e.target.closest('.gen'); if (!g) return;
      quickAdd({ gen: g.dataset.gen });
    });
  }

  // ---------------- yardımcılar ----------------
  function cols() { return [...rootEl.querySelectorAll('.wk-col')]; }

  /** ekran koordinatı -> {date, min} (ızgara dışındaysa null) */
  function pointToSlot(x, y, clampY) {
    const cs = cols();
    const c = cfg();
    for (const col of cs) {
      const r = col.getBoundingClientRect();
      if (x >= r.left && x <= r.right && (clampY || (y >= r.top && y <= r.bottom))) {
        const min = c.ds + (y - r.top) / c.ppm;
        return { date: col.dataset.date, min: U.clamp(min, c.ds, c.de), col };
      }
    }
    return null;
  }
  function colIndexAt(x) {
    const cs = cols();
    for (let i = 0; i < cs.length; i++) { const r = cs[i].getBoundingClientRect(); if (x >= r.left && x <= r.right) return i; }
    if (!cs.length) return -1;
    if (x < cs[0].getBoundingClientRect().left) return 0;
    return cs.length - 1;
  }

  function findBlock(id) { return S.state.blocks.find((b) => b.id === id); }

  function defaultDur(src) {
    if (src.gen) { const g = S.generic(src.gen); return g ? g.dur : S.settings.defaultBlock; }
    let d = Number(S.settings.defaultBlock) || 60;
    if (src.topic && !S.isFinished(src.topic)) {
      const rem = S.topicRemaining(src.topic) - (plannedPending()[src.topic] || 0);
      if (rem > 0 && rem < d) d = Math.max(cfg().snap, snapMin(rem));
    }
    return d;
  }

  function firstFree(date, dur) {
    const c = cfg();
    const list = S.state.blocks.filter((b) => b.date === date).sort((a, b) => a.start - b.start);
    let t = c.ds;
    for (const b of list) {
      if (b.start - t >= dur) return t;
      t = Math.max(t, b.start + b.dur);
    }
    return t + dur <= c.de ? t : Math.max(c.ds, c.de - dur);
  }

  function addBlock(src, date, start, dur, label) {
    const c = cfg();
    dur = U.clamp(dur, c.snap, c.de - c.ds);
    start = U.clamp(snapMin(start), c.ds, c.de - dur);
    const b = { id: U.uid('b'), date, start, dur };
    if (src.topic) b.topic = src.topic;
    if (src.gen) b.gen = src.gen;
    if (src.label) b.label = src.label;
    S.commit(label || 'Blok eklendi', (s) => { s.blocks.push(b); });
    selected.clear(); selected.add(b.id);
    renderBlocks();
    UI.sound('drop');
    return b;
  }

  function quickAdd(src) {
    const date = (curParams.focus && U.weekDays(weekOf(curParams)).includes(curParams.focus)) ? curParams.focus
      : (U.weekDays(weekOf(curParams)).includes(U.todayKey()) ? U.todayKey() : U.weekDays(weekOf(curParams))[0]);
    const dur = defaultDur(src);
    addBlock(src, date, firstFree(date, dur), dur);
    UI.toast(U.fmtDateShort(date) + ' gününe eklendi');
  }

  function gotoWeek(d) { App.go('week', { date: U.weekStart(d), focus: curParams.focus }, { replace: true }); }

  function zoom(delta) {
    const sc = rootEl.querySelector('.wk-scroll');
    const c = cfg();
    const centerMin = c.ds + (sc.scrollTop + sc.clientHeight / 2) / c.ppm;
    const nh = U.clamp(S.settings.hourHeight + delta, 28, 140);
    if (nh === S.settings.hourHeight) return;
    S.state.settings.hourHeight = nh; S.saveNow();
    const ws = weekOf(curParams);
    scrollMem[ws] = null;
    App.render();
    const sc2 = rootEl.querySelector('.wk-scroll');
    sc2.scrollTop = (centerMin - c.ds) * (nh / 60) - sc2.clientHeight / 2;
  }

  // =====================================================================
  // IZGARADA SÜRÜKLEME / BOYUTLANDIRMA
  // =====================================================================
  function onGridPointerDown(e) {
    if (e.button !== 0) return;
    const blkEl = e.target.closest('.blk');
    if (!blkEl) {
      // boş alana tık: seçimi kaldır, yapıştırma konumunu ayarla
      const p = pointToSlot(e.clientX, e.clientY);
      if (p) anchor = { date: p.date, min: p.min };
      if (!e.ctrlKey && !e.shiftKey && selected.size) { selected.clear(); renderBlocks(); }
      if (p) startLasso(e);
      return;
    }
    e.preventDefault();
    const id = blkEl.dataset.id;
    const handle = e.target.closest('.blk-h');
    const multi = e.ctrlKey || e.metaKey || e.shiftKey;

    if (multi && !handle) {
      if (selected.has(id)) selected.delete(id); else selected.add(id);
      renderBlocks();
      return;
    }
    if (!selected.has(id)) { selected.clear(); selected.add(id); renderBlocks(); }

    const b = findBlock(id); if (!b) return;
    const c = cfg();
    const startX = e.clientX, startY = e.clientY;
    const snap = S.beginGesture();
    let started = false;
    let copyMode = e.altKey;
    const mode = handle ? (handle.classList.contains('top') ? 'top' : 'bottom') : 'move';
    const days = U.weekDays(weekOf(curParams));
    let group = mode === 'move' ? [...selected].map(findBlock).filter(Boolean) : [b];
    let origin = group.map((x) => ({ x, date: x.date, start: x.start, dur: x.dur }));
    const originCol = days.indexOf(b.date);
    let tip = null;

    document.body.classList.add(mode === 'move' ? 'dragging' : 'resizing');

    const mv = (ev) => {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      if (!started && Math.hypot(dx, dy) < 4) return;
      if (!started) {
        started = true;
        if (copyMode && mode === 'move') {
          // Alt ile sürükleme: kopyasını taşı
          const clones = origin.map((o) => Object.assign({}, o.x, { id: U.uid('b') }));
          S.state.blocks.push(...clones);
          selected.clear(); clones.forEach((cl) => selected.add(cl.id));
          group = clones; origin = clones.map((x) => ({ x, date: x.date, start: x.start, dur: x.dur }));
        }
        tip = U.h('<div class="drag-tip"></div>'); document.body.appendChild(tip);
      }
      const dMin = Math.round((dy / c.ppm) / c.snap) * c.snap;
      if (mode === 'move') {
        const ci = colIndexAt(ev.clientX);
        const dDay = ci - originCol;
        origin.forEach((o) => {
          const di = U.clamp(days.indexOf(o.date) + dDay, 0, 6);
          o.x.date = days[di];
          o.x.start = U.clamp(o.start + dMin, c.ds, c.de - o.dur);
        });
        tip.textContent = U.fmtClock(b.start) + ' – ' + U.fmtClock(b.start + b.dur) + (copyMode ? '  (kopya)' : '');
      } else if (mode === 'top') {
        const o = origin[0];
        const ns = U.clamp(o.start + dMin, c.ds, o.start + o.dur - c.snap);
        b.start = ns; b.dur = o.start + o.dur - ns;
        tip.textContent = U.fmtClock(b.start) + ' – ' + U.fmtClock(b.start + b.dur) + ' · ' + U.fmtMin(b.dur);
      } else {
        const o = origin[0];
        b.dur = U.clamp(o.dur + dMin, c.snap, c.de - o.start);
        tip.textContent = U.fmtClock(b.start) + ' – ' + U.fmtClock(b.start + b.dur) + ' · ' + U.fmtMin(b.dur);
      }
      tip.style.left = ev.clientX + 14 + 'px'; tip.style.top = ev.clientY + 14 + 'px';
      renderBlocks();
      autoScroll(ev.clientY);
    };
    const up = () => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      document.body.classList.remove('dragging', 'resizing');
      stopAutoScroll();
      if (tip) tip.remove();
      if (started) {
        const label = mode === 'move' ? (copyMode ? 'Blok kopyalandı' : 'Blok taşındı') : 'Blok süresi değişti';
        if (S.endGesture(snap, label)) UI.sound('drop');
      }
    };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
  }

  // kenara yaklaşınca otomatik kaydırma
  let asTimer = null, asDir = 0;
  function autoScroll(y) {
    const sc = rootEl.querySelector('.wk-scroll');
    const r = sc.getBoundingClientRect();
    asDir = y < r.top + 40 ? -1 : y > r.bottom - 40 ? 1 : 0;
    if (asDir && !asTimer) asTimer = setInterval(() => { if (asDir) sc.scrollTop += asDir * 12; else stopAutoScroll(); }, 16);
  }
  function stopAutoScroll() { clearInterval(asTimer); asTimer = null; asDir = 0; }

  /** Boş alanda sürükleyerek çoklu seçim */
  function startLasso(e) {
    const body = rootEl.querySelector('.wk-body');
    const br = body.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    let box = null;
    const base = (e.ctrlKey || e.shiftKey) ? new Set(selected) : new Set();
    const mv = (ev) => {
      if (!box && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
      if (!box) { box = U.h('<div class="lasso"></div>'); body.appendChild(box); }
      const b2 = body.getBoundingClientRect();
      const x1 = Math.min(sx, ev.clientX), x2 = Math.max(sx, ev.clientX);
      const y1 = Math.min(sy, ev.clientY), y2 = Math.max(sy, ev.clientY);
      box.style.left = x1 - b2.left + 'px'; box.style.top = y1 - b2.top + 'px';
      box.style.width = x2 - x1 + 'px'; box.style.height = y2 - y1 + 'px';
      selected.clear(); base.forEach((id) => selected.add(id));
      rootEl.querySelectorAll('.blk').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > x1 && r.left < x2 && r.bottom > y1 && r.top < y2) selected.add(el.dataset.id);
      });
      rootEl.querySelectorAll('.blk').forEach((el) => el.classList.toggle('sel', selected.has(el.dataset.id)));
      autoScroll(ev.clientY);
    };
    const up = () => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      stopAutoScroll();
      if (box) box.remove();
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    void br;
  }

  // =====================================================================
  // PANELDEN SÜRÜKLE-BIRAK
  // =====================================================================
  function startPanelDrag(e, src, itemEl) {
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY;
    const c = cfg();
    const dur = defaultDur(src);
    let ghost = null, preview = null, started = false, target = null;
    const color = src.topic ? S.subject(S.topic(src.topic).s).color : S.generic(src.gen).color;
    const name = src.topic ? S.topic(src.topic).n : S.generic(src.gen).n;

    const mv = (ev) => {
      if (!started && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
      if (!started) {
        started = true;
        document.body.classList.add('dragging');
        ghost = U.h('<div class="drag-ghost" style="--c:' + color + ';--tc:' + textColor(color) + '"></div>');
        ghost.textContent = name;
        document.body.appendChild(ghost);
        itemEl.classList.add('lifting');
      }
      ghost.style.left = ev.clientX + 12 + 'px'; ghost.style.top = ev.clientY - 14 + 'px';
      const p = pointToSlot(ev.clientX, ev.clientY);
      if (p) {
        // bloğun üst kenarı imlecin biraz üstünde başlasın
        const start = U.clamp(snapMin(p.min - Math.min(30, dur / 2)), c.ds, c.de - dur);
        target = { date: p.date, start };
        if (!preview || preview.parentNode !== p.col) {
          if (preview) preview.remove();
          preview = U.h('<div class="blk-preview" style="--c:' + color + '"></div>');
          p.col.appendChild(preview);
        }
        preview.style.top = (start - c.ds) * c.ppm + 'px';
        preview.style.height = dur * c.ppm - 2 + 'px';
        preview.textContent = U.fmtClock(start) + ' – ' + U.fmtClock(start + dur);
        ghost.classList.add('over');
        autoScroll(ev.clientY);
      } else {
        // gün başlığının üzerine bırakılırsa ilk boş saate yerleşir
        const head = document.elementFromPoint(ev.clientX, ev.clientY);
        const dh = head && head.closest && head.closest('.wk-dayhead');
        target = dh ? { date: dh.dataset.date, start: null } : null;
        if (preview) { preview.remove(); preview = null; }
        ghost.classList.toggle('over', !!dh);
        stopAutoScroll();
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      document.body.classList.remove('dragging');
      stopAutoScroll();
      if (ghost) ghost.remove();
      if (preview) preview.remove();
      itemEl.classList.remove('lifting');
      if (started && target) {
        const start = target.start == null ? firstFree(target.date, dur) : target.start;
        addBlock(src, target.date, start, dur, 'Ders eklendi');
      }
    };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
  }

  // =====================================================================
  // ÇİFT TIK, SAĞ TIK, MENÜLER
  // =====================================================================
  function onGridDblClick(e) {
    const blkEl = e.target.closest('.blk');
    if (blkEl) { editBlock(blkEl.dataset.id); return; }
    const p = pointToSlot(e.clientX, e.clientY);
    if (p) pickTopic(p.date, snapMin(p.min - 15));
  }

  function onGridContext(e) {
    const blkEl = e.target.closest('.blk');
    const p = pointToSlot(e.clientX, e.clientY);
    if (p) anchor = { date: p.date, min: p.min };
    if (blkEl) {
      const id = blkEl.dataset.id;
      if (!selected.has(id)) { selected.clear(); selected.add(id); renderBlocks(); }
      const b = findBlock(id);
      const n = selected.size;
      const items = [
        { header: n > 1 ? n + ' blok seçili' : S.blockTitle(b) },
        n === 1 ? { icon: '✎', label: 'Düzenle…', key: 'Enter', action: () => editBlock(id) } : null,
        { icon: '⧉', label: 'Kopyala', key: 'Ctrl+C', action: copySel },
        { icon: '✂', label: 'Kes', key: 'Ctrl+X', action: cutSel },
        { icon: '⎘', label: 'Çoğalt', key: 'Ctrl+D', action: duplicateSel },
        { icon: '⇥', label: 'Ertesi güne taşı', action: () => moveSel(0, 1) }
      ];
      if (n === 1 && b.topic) {
        items.push({ sep: true });
        items.push(S.isFinished(b.topic)
          ? { icon: '↺', label: 'Konuyu bitirilmemiş yap', action: () => setFinished(b.topic, false) }
          : { icon: '✔', label: 'Konuyu bitirildi olarak işaretle', action: () => setFinished(b.topic, true) });
        items.push({ icon: '◧', label: 'Derste göster', action: () => App.go('subjects', { subject: S.topic(b.topic).s, topic: b.topic }) });
      }
      items.push({ sep: true });
      items.push({ icon: '✕', label: 'Sil', key: 'Delete', danger: true, action: deleteSel });
      UI.menu(e.clientX, e.clientY, items);
    } else if (p) {
      const t = snapMin(p.min);
      UI.menu(e.clientX, e.clientY, [
        { header: U.fmtDateShort(p.date) + ' · ' + U.fmtClock(t) },
        { icon: '+', label: 'Konu ekle…', action: () => pickTopic(p.date, t) },
        { icon: '⎘', label: 'Buraya yapıştır', key: 'Ctrl+V', disabled: !clipboard, action: () => paste({ date: p.date, min: t }) },
        { sep: true },
        { icon: '▣', label: 'Tüm blokları seç', key: 'Ctrl+A', action: selectAll }
      ]);
    }
  }

  function dayMenu(x, y, d) {
    const ok = S.isApproved(d);
    const n = S.state.blocks.filter((b) => b.date === d).length;
    UI.menu(x, y, [
      { header: U.fmtDateLong(d) },
      { icon: ok ? '↺' : '✓', label: ok ? 'Onayı kaldır' : 'Günü onayla', action: () => toggleApprove(d) },
      { icon: '▣', label: 'Günün bloklarını seç', disabled: !n, action: () => { selected.clear(); S.state.blocks.filter((b) => b.date === d).forEach((b) => selected.add(b.id)); renderBlocks(); } },
      { icon: '⧉', label: 'Günü kopyala', disabled: !n, action: () => copyDay(d) },
      { icon: '⎘', label: 'Kopyalananı bu güne yapıştır', disabled: !clipboard, action: () => paste({ date: d, min: null }) },
      { icon: '⇥', label: 'Günü ertesi güne kopyala', disabled: !n, action: () => cloneDay(d, U.addDays(d, 1)) },
      { sep: true },
      { icon: '✕', label: 'Günü temizle', danger: true, disabled: !n, action: () => clearDays([d], 'Gün temizlendi') }
    ]);
  }

  function weekMenu(x, y, ws) {
    const days = U.weekDays(ws);
    const n = S.state.blocks.filter((b) => days.includes(b.date)).length;
    UI.menu(x, y, [
      { header: 'Hafta işlemleri' },
      { icon: '⇥', label: 'Bu haftayı sonraki haftaya kopyala', disabled: !n, action: () => cloneWeek(ws, U.addDays(ws, 7)) },
      { icon: '⇤', label: 'Önceki haftanın planını buraya kopyala', action: () => cloneWeek(U.addDays(ws, -7), ws) },
      { icon: '✓', label: 'Geçmiş günleri onayla', action: () => approvePast(days) },
      { icon: '▣', label: 'Tüm blokları seç', key: 'Ctrl+A', disabled: !n, action: selectAll },
      { sep: true },
      { icon: '✕', label: 'Haftayı temizle', danger: true, disabled: !n, action: () => clearDays(days, 'Hafta temizlendi') }
    ]);
  }

  function topicMenu(x, y, id) {
    const t = S.topic(id), fin = S.isFinished(id), def = S.isDeferred(id);
    UI.menu(x, y, [
      { header: t.n },
      { icon: '+', label: 'Odaktaki güne ekle', action: () => quickAdd({ topic: id }) },
      fin ? { icon: '↻', label: 'Tekrar ettim (+1)', action: () => markReviewed(id) } : null,
      fin ? { icon: '↺', label: 'Bitirilmemiş yap', action: () => setFinished(id, false) }
          : { icon: '✔', label: 'Bitirildi — tekrar edilecek', action: () => setFinished(id, true) },
      !fin ? { icon: def ? '↑' : '↓', label: def ? 'Sıraya al (sona bırakma)' : 'Sona bırak', action: () => setDeferred(id, !def) } : null,
      { icon: '⏱', label: 'T.S düzenle…', action: () => Views.subjects.editTs(id) },
      { icon: '◧', label: 'Derste göster', action: () => App.go('subjects', { subject: t.s, topic: id }) }
    ]);
  }

  // =====================================================================
  // İŞLEMLER
  // =====================================================================
  function toggleApprove(d) {
    const ok = S.isApproved(d);
    S.commit(ok ? 'Gün onayı kaldırıldı' : 'Gün onaylandı', (s) => {
      if (ok) delete s.days[d]; else s.days[d] = { ok: true, at: new Date().toISOString() };
    });
    if (!ok) {
      UI.sound('ok');
      const st = S.dayStatus(d);
      const msg = { green: 'Harika bir gün! 💚', lime: 'Çok iyi gün!', orange: 'Güzel, devam!', rest: 'Mola günü — haftan zaten dolu.', low: 'Onaylandı.', red: 'Onaylandı. Yarın daha iyi olacak.' }[st] || 'Onaylandı.';
      UI.toast(U.fmtDateShort(d) + ': ' + msg);
    }
  }

  function approvePast(days) {
    const today = U.todayKey();
    const list = days.filter((d) => d < today && !S.isApproved(d) && S.dayMinutes(d) > 0);
    if (!list.length) { UI.toast('Onaylanacak geçmiş gün yok'); return; }
    S.commit('Geçmiş günler onaylandı', (s) => { list.forEach((d) => { s.days[d] = { ok: true, at: new Date().toISOString() }; }); });
    UI.sound('ok');
  }

  function setFinished(id, val) {
    S.commit(val ? 'Konu bitirildi' : 'Konu bitirilmemiş yapıldı', (s) => {
      const st = s.topics[id] = s.topics[id] || {};
      if (val) { st.fin = new Date().toISOString(); st.rev = st.rev || []; } else { delete st.fin; }
    });
    if (val) { UI.sound('ok'); UI.toast('“' + S.topic(id).n + '” Bitirilenler klasörüne taşındı'); }
  }
  function setDeferred(id, val) {
    S.commit(val ? 'Konu sona bırakıldı' : 'Konu sıraya alındı', (s) => {
      const st = s.topics[id] = s.topics[id] || {};
      const t = S.topic(id);
      const def = !!(t.sona || t.sozel);
      if (val === def) delete st.sona; else st.sona = val;
    });
  }
  function markReviewed(id) {
    S.commit('Tekrar kaydedildi', (s) => {
      const st = s.topics[id] = s.topics[id] || {};
      st.rev = (st.rev || []).concat(new Date().toISOString());
    });
    UI.sound('ok');
  }

  function selBlocks() { return [...selected].map(findBlock).filter(Boolean); }

  function copySel() {
    const list = selBlocks(); if (!list.length) return false;
    const days = U.weekDays(weekOf(curParams));
    const minDay = Math.min(...list.map((b) => days.indexOf(b.date)));
    const minStart = Math.min(...list.map((b) => b.start));
    clipboard = { items: list.map((b) => ({ dayOff: days.indexOf(b.date) - minDay, off: b.start - minStart, dur: b.dur, topic: b.topic, gen: b.gen, label: b.label, note: b.note, start: b.start })) };
    UI.toast(list.length + ' blok kopyalandı');
    return true;
  }
  function cutSel() {
    if (!copySel()) return;
    const ids = new Set(selected);
    S.commit('Blok kesildi', (s) => { s.blocks = s.blocks.filter((b) => !ids.has(b.id)); });
    selected.clear();
  }
  function copyDay(d) {
    const list = S.state.blocks.filter((b) => b.date === d);
    clipboard = { day: true, items: list.map((b) => ({ dayOff: 0, off: b.start, dur: b.dur, topic: b.topic, gen: b.gen, label: b.label, note: b.note, start: b.start })) };
    UI.toast('Gün kopyalandı (' + list.length + ' blok)');
  }

  /** at.min null ise blokların kendi saatleri korunur */
  function paste(at) {
    if (!clipboard || !clipboard.items.length) { UI.toast('Pano boş'); return; }
    const c = cfg();
    const days = U.weekDays(weekOf(curParams));
    let baseDay, baseMin;
    if (at) { baseDay = days.indexOf(at.date); baseMin = at.min == null ? null : snapMin(at.min); }
    else if (anchor && days.includes(anchor.date)) { baseDay = days.indexOf(anchor.date); baseMin = snapMin(anchor.min); }
    else { baseDay = Math.max(0, days.indexOf(curParams.focus)); baseMin = null; }
    if (baseDay < 0) baseDay = 0;
    const newIds = [];
    const minOff = Math.min(...clipboard.items.map((x) => x.off));
    S.commit('Yapıştırıldı', (s) => {
      clipboard.items.forEach((it) => {
        const di = baseDay + it.dayOff;
        if (di > 6) return;
        const start = baseMin == null ? it.start : baseMin + (it.off - minOff);
        const b = { id: U.uid('b'), date: days[di], start: U.clamp(start, c.ds, c.de - it.dur), dur: it.dur };
        ['topic', 'gen', 'label', 'note'].forEach((k) => { if (it[k]) b[k] = it[k]; });
        s.blocks.push(b); newIds.push(b.id);
      });
    });
    selected.clear(); newIds.forEach((id) => selected.add(id));
    renderBlocks();
    UI.sound('drop');
  }

  function duplicateSel() {
    const list = selBlocks(); if (!list.length) return;
    const c = cfg();
    const newIds = [];
    S.commit('Blok çoğaltıldı', (s) => {
      list.forEach((b) => {
        const nb = Object.assign({}, b, { id: U.uid('b') });
        // hemen altına yerleştir, sığmazsa ertesi güne aynı saate
        if (b.start + b.dur * 2 <= c.de) nb.start = b.start + b.dur;
        else { nb.date = U.addDays(b.date, 1); }
        s.blocks.push(nb); newIds.push(nb.id);
      });
    });
    selected.clear(); newIds.forEach((id) => selected.add(id));
    renderBlocks();
  }

  async function deleteSel() {
    const list = selBlocks(); if (!list.length) return;
    if (S.settings.confirmDelete && list.length > 1 && !(await UI.confirm(list.length + ' blok silinsin mi?', { danger: true, okLabel: 'Sil' }))) return;
    const ids = new Set(list.map((b) => b.id));
    S.commit(list.length > 1 ? list.length + ' blok silindi' : 'Blok silindi', (s) => { s.blocks = s.blocks.filter((b) => !ids.has(b.id)); });
    selected.clear();
    UI.sound('del');
    UI.toast(list.length > 1 ? list.length + ' blok silindi' : 'Blok silindi', '', { action: { label: 'Geri al', fn: () => S.undo() } });
  }

  function moveSel(dMin, dDay) {
    const list = selBlocks(); if (!list.length) return;
    const c = cfg();
    const days = U.weekDays(weekOf(curParams));
    S.commit('Blok taşındı', () => {
      list.forEach((b) => {
        if (dDay) {
          const i = days.indexOf(b.date) + dDay;
          if (i < 0 || i > 6) b.date = U.addDays(b.date, dDay); else b.date = days[i];
        }
        b.start = U.clamp(b.start + dMin, c.ds, c.de - b.dur);
      });
    });
    renderBlocks();
  }
  function resizeSel(dMin) {
    const list = selBlocks(); if (!list.length) return;
    const c = cfg();
    S.commit('Blok süresi değişti', () => { list.forEach((b) => { b.dur = U.clamp(b.dur + dMin, c.snap, c.de - b.start); }); });
    renderBlocks();
  }

  function selectAll() {
    selected.clear(); weekBlocks().forEach((b) => selected.add(b.id)); renderBlocks();
  }

  async function clearDays(days, label) {
    const set = new Set(days);
    const n = S.state.blocks.filter((b) => set.has(b.date)).length;
    if (!n) return;
    if (S.settings.confirmDelete && !(await UI.confirm(n + ' blok silinecek. Devam edilsin mi?', { danger: true, okLabel: 'Temizle' }))) return;
    S.commit(label, (s) => { s.blocks = s.blocks.filter((b) => !set.has(b.date)); });
    UI.sound('del');
  }

  function cloneDay(from, to) {
    const src = S.state.blocks.filter((b) => b.date === from);
    S.commit('Gün kopyalandı', (s) => { src.forEach((b) => s.blocks.push(Object.assign({}, b, { id: U.uid('b'), date: to }))); });
    UI.toast(src.length + ' blok ' + U.fmtDateShort(to) + ' gününe kopyalandı');
  }
  async function cloneWeek(fromWs, toWs) {
    const fromDays = U.weekDays(fromWs), toDays = U.weekDays(toWs);
    const src = S.state.blocks.filter((b) => fromDays.includes(b.date));
    if (!src.length) { UI.toast('Kopyalanacak blok yok'); return; }
    const existing = S.state.blocks.filter((b) => toDays.includes(b.date)).length;
    if (existing && !(await UI.confirm('Hedef haftada zaten ' + existing + ' blok var. Yeni bloklar bunlara eklensin mi?', { okLabel: 'Ekle' }))) return;
    S.commit('Hafta kopyalandı', (s) => {
      src.forEach((b) => s.blocks.push(Object.assign({}, b, { id: U.uid('b'), date: toDays[fromDays.indexOf(b.date)] })));
    });
    UI.toast(src.length + ' blok kopyalandı');
  }

  // ---------------- Düzenleme penceresi ----------------
  function timeOptions(selectedMin) {
    const c = cfg();
    let o = '';
    for (let m = c.ds; m <= c.de; m += c.snap) o += '<option value="' + m + '"' + (m === selectedMin ? ' selected' : '') + '>' + U.fmtClock(m) + '</option>';
    return o;
  }
  function sourceOptions(b) {
    let html = '<optgroup label="Genel">' + GENERIC_BLOCKS.map((g) => '<option value="gen:' + g.id + '"' + (b.gen === g.id ? ' selected' : '') + '>' + U.esc(g.n) + '</option>').join('') +
      '<option value="label:"' + (!b.gen && !b.topic ? ' selected' : '') + '>Özel başlık…</option></optgroup>';
    SUBJECTS.forEach((sub) => {
      const ts = S.topics().filter((t) => t.s === sub.id);
      html += '<optgroup label="' + sub.exam + ' ' + U.esc(sub.name) + '">' + ts.map((t) => '<option value="topic:' + t.id + '"' + (b.topic === t.id ? ' selected' : '') + '>' + U.esc(t.n) + (S.isFinished(t.id) ? ' ✓' : '') + '</option>').join('') + '</optgroup>';
    });
    return html;
  }

  function editBlock(id) {
    const b = findBlock(id); if (!b) return;
    const c = cfg();
    const body =
      '<div class="form-grid">' +
        '<label>Konu / tür<select name="src">' + sourceOptions(b) + '</select></label>' +
        '<label class="lbl-custom"' + (b.topic || b.gen ? ' style="display:none"' : '') + '>Başlık<input name="label" value="' + U.esc(b.label || '') + '" placeholder="Örn. Okul ödevi"></label>' +
        '<label>Gün<input type="date" name="date" value="' + b.date + '"></label>' +
        '<div class="row2"><label>Başlangıç<select name="start">' + timeOptions(b.start) + '</select></label>' +
        '<label>Bitiş<select name="end">' + timeOptions(b.start + b.dur) + '</select></label></div>' +
        '<label>Not<textarea name="note" rows="3" placeholder="İsteğe bağlı: hangi kaynak, kaç soru…">' + U.esc(b.note || '') + '</textarea></label>' +
      '</div>';
    UI.modal({
      title: 'Bloğu düzenle', body, width: '460px',
      onOpen: (el) => {
        el.querySelector('[name=src]').onchange = (e) => { el.querySelector('.lbl-custom').style.display = e.target.value === 'label:' ? '' : 'none'; };
      },
      buttons: [
        { label: 'Sil', kind: 'ghost danger', action: () => { selected.clear(); selected.add(id); deleteSel(); } },
        { label: 'Vazgeç', kind: 'ghost' },
        { label: 'Kaydet', kind: 'primary', action: (el) => {
          const start = Number(el.querySelector('[name=start]').value);
          const end = Number(el.querySelector('[name=end]').value);
          if (end <= start) { UI.toast('Bitiş saati başlangıçtan sonra olmalı', 'error'); return false; }
          const [kind, val] = el.querySelector('[name=src]').value.split(':');
          const date = el.querySelector('[name=date]').value || b.date;
          S.commit('Blok düzenlendi', () => {
            const x = findBlock(id); if (!x) return;
            delete x.topic; delete x.gen; delete x.label;
            if (kind === 'topic') x.topic = val; else if (kind === 'gen') x.gen = val; else x.label = el.querySelector('[name=label]').value.trim() || 'Çalışma';
            x.date = date; x.start = U.clamp(start, c.ds, c.de - c.snap); x.dur = U.clamp(end - start, c.snap, c.de - x.start);
            const note = el.querySelector('[name=note]').value.trim();
            if (note) x.note = note; else delete x.note;
          });
        } }
      ]
    });
  }

  function pickTopic(date, start) {
    const body = U.h('<div class="picker"><input class="picker-search" placeholder="Konu ara…" autofocus><div class="picker-list"></div></div>');
    const listEl = body.querySelector('.picker-list');
    let modalRef = null;
    const draw = () => {
      const q = U.norm(body.querySelector('.picker-search').value);
      let html = '<div class="picker-gen">' + GENERIC_BLOCKS.filter((g) => !q || U.norm(g.n).includes(q)).map((g) => '<button class="gen" data-gen="' + g.id + '" style="--c:' + g.color + '">' + U.esc(g.n) + '</button>').join('') + '</div>';
      const list = S.orderedTopics().filter((t) => !S.isHidden(t.id) && (!q || U.norm(t.n + ' ' + S.subject(t.s).name + ' ' + S.subject(t.s).exam).includes(q)));
      list.sort((a, b) => (S.isFinished(a.id) - S.isFinished(b.id)) || (S.isDeferred(a.id) - S.isDeferred(b.id)));
      html += list.slice(0, 120).map((t) => {
        const sub = S.subject(t.s);
        return '<button class="pick" data-topic="' + t.id + '" style="--c:' + sub.color + '"><i></i><span>' + U.esc(t.n) + '</span><small>' + sub.exam + ' ' + sub.short + (S.isFinished(t.id) ? ' · bitti' : ' · kalan ' + U.fmtMin(S.topicRemaining(t.id))) + '</small></button>';
      }).join('');
      listEl.innerHTML = html;
    };
    draw();
    body.querySelector('.picker-search').addEventListener('input', draw);
    body.querySelector('.picker-search').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const f = listEl.querySelector('.pick, .gen'); if (f) { e.preventDefault(); e.stopPropagation(); f.click(); } }
    });
    listEl.addEventListener('click', (e) => {
      const p = e.target.closest('.pick, .gen'); if (!p) return;
      const src = p.dataset.topic ? { topic: p.dataset.topic } : { gen: p.dataset.gen };
      modalRef.close();
      addBlock(src, date, start, defaultDur(src));
    });
    modalRef = UI.modal({ title: U.fmtDateShort(date) + ' · ' + U.fmtClock(start) + ' — blok ekle', body, width: '520px', buttons: [] });
  }

  // =====================================================================
  // KLAVYE
  // =====================================================================
  function onKey(e) {
    const k = e.key, ctrl = e.ctrlKey || e.metaKey;
    const has = selected.size > 0;
    const c = cfg();
    if (ctrl && (k === 'c' || k === 'C')) { copySel(); return true; }
    if (ctrl && (k === 'x' || k === 'X')) { cutSel(); return true; }
    if (ctrl && (k === 'v' || k === 'V')) { paste(); return true; }
    if (ctrl && (k === 'd' || k === 'D')) { duplicateSel(); return true; }
    if (ctrl && (k === 'a' || k === 'A')) { selectAll(); return true; }
    if ((k === 'Delete' || k === 'Backspace') && has) { deleteSel(); return true; }
    if (k === 'Escape' && has) { selected.clear(); renderBlocks(); return true; }
    if (k === 'Enter' && selected.size === 1) { editBlock([...selected][0]); return true; }
    if (has && !ctrl && !e.altKey) {
      if (k === 'ArrowUp') { e.shiftKey ? resizeSel(-c.snap) : moveSel(-c.snap, 0); return true; }
      if (k === 'ArrowDown') { e.shiftKey ? resizeSel(c.snap) : moveSel(c.snap, 0); return true; }
      if (k === 'ArrowLeft') { moveSel(0, -1); return true; }
      if (k === 'ArrowRight') { moveSel(0, 1); return true; }
    }
    if (!has && !ctrl && !e.altKey) {
      const ws = weekOf(curParams);
      if (k === 'ArrowLeft' || k === 'PageUp') { gotoWeek(U.addDays(ws, -7)); return true; }
      if (k === 'ArrowRight' || k === 'PageDown') { gotoWeek(U.addDays(ws, 7)); return true; }
      if (k === 't' || k === 'T') { gotoWeek(U.todayKey()); return true; }
    }
    return false;
  }

  function focusSearch() {
    if (panelCollapsed) { panelCollapsed = false; App.render(); }
    const s = rootEl && rootEl.querySelector('.tp-search');
    if (s) { s.focus(); s.select(); }
  }

  function leave() { clearInterval(nowTimer); selected.clear(); stopAutoScroll(); }

  window.addEventListener('resize', () => { if (App.current && App.current.name === 'week') updateNowLine(); });

  return { title, render, onKey, focusSearch, leave, setFinished, markReviewed, setDeferred };
})();
