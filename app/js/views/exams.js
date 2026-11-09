/* DENEMELER: net girişi, istatistik ve grafik */
window.Views = window.Views || {};
Views.exams = (function () {
  const FIELDS = {
    TYT: [
      { k: 'tr', n: 'Türkçe', q: 40, c: '#d98a74' }, { k: 'sos', n: 'Sosyal', q: 20, c: '#4fae6f' },
      { k: 'mat', n: 'Matematik', q: 40, c: '#8ccfee' }, { k: 'fiz', n: 'Fizik', q: 7, c: '#ffb47e' },
      { k: 'kim', n: 'Kimya', q: 7, c: '#a9b2ff' }, { k: 'bio', n: 'Biyoloji', q: 6, c: '#9ee39a' }
    ],
    AYT: [
      { k: 'mat', n: 'Matematik', q: 40, c: '#72bbdf' }, { k: 'fiz', n: 'Fizik', q: 14, c: '#ef9c5f' },
      { k: 'kim', n: 'Kimya', q: 13, c: '#8d97ef' }, { k: 'bio', n: 'Biyoloji', q: 13, c: '#80cf7c' }
    ]
  };
  const MAXQ = { TYT: 120, AYT: 80 };
  let type = 'TYT';
  const seriesOn = { total: true };
  let resizeHandler = null;

  function net(d, y) { return (Number(d) || 0) - (Number(y) || 0) / 4; }
  function examNet(ex, k) {
    if (k === 'total') return ex.total;
    if (!ex.d || ex.d[k] == null) return null;
    return net(ex.d[k], ex.y && ex.y[k]);
  }
  const fmtNet = (v) => (v == null ? '—' : (Math.round(v * 100) / 100).toString().replace('.', ','));

  function list() {
    return S.state.exams.filter((e) => e.type === type).slice().sort((a, b) => a.date.localeCompare(b.date) || (a.created || '').localeCompare(b.created || ''));
  }

  function render(el, params) {
    if (params.type) type = params.type;
    const exams = list();
    const totals = exams.map((e) => e.total);
    const last = totals[totals.length - 1];
    const avg = totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : null;
    const best = totals.length ? Math.max(...totals) : null;
    const l5 = totals.slice(-5), p5 = totals.slice(-10, -5);
    const avg5 = l5.length ? l5.reduce((a, b) => a + b, 0) / l5.length : null;
    const avgP5 = p5.length ? p5.reduce((a, b) => a + b, 0) / p5.length : null;
    const trend = avg5 != null && avgP5 != null ? avg5 - avgP5 : null;
    const target = S.settings['target' + type];

    const fields = FIELDS[type];
    const chips = [{ k: 'total', n: 'Toplam', c: 'var(--accent)' }].concat(fields).map((f) =>
      '<button class="chip' + (seriesOn[f.k] ? ' on' : '') + '" data-series="' + f.k + '" style="--c:' + f.c + '"><i></i>' + f.n + '</button>').join('');

    const rows = exams.slice().reverse().map((e) =>
      '<tr data-id="' + e.id + '"><td>' + U.fmtDateNum(e.date) + '</td><td class="ex-name">' + U.esc(e.name || '—') + (e.note ? '<div class="muted small">' + U.esc(e.note) + '</div>' : '') + '</td>' +
      fields.map((f) => '<td>' + fmtNet(examNet(e, f.k)) + '</td>').join('') +
      '<td class="ex-total">' + fmtNet(e.total) + '</td><td class="c-act"><button class="icon-btn small" data-act="edit" title="Düzenle">✎</button><button class="icon-btn small" data-act="del" title="Sil">✕</button></td></tr>'
    ).join('');

    el.innerHTML =
      '<div class="exams-layout scroll-keep">' +
        '<div class="ex-top">' +
          '<div class="seg big" style="--i:' + (type === 'TYT' ? 0 : 1) + '"><span class="seg-thumb"></span>' +
            '<button data-type="TYT" class="' + (type === 'TYT' ? 'on' : '') + '">TYT</button><button data-type="AYT" class="' + (type === 'AYT' ? 'on' : '') + '">AYT</button></div>' +
          '<div class="ex-stats">' +
            stat('Son net', fmtNet(last)) + stat('Ortalama', fmtNet(avg)) + stat('En yüksek', fmtNet(best)) +
            stat('Son 5 ort.', fmtNet(avg5), trend == null ? '' : (trend >= 0 ? '<span class="up">▲ ' + fmtNet(trend) + '</span>' : '<span class="down">▼ ' + fmtNet(-trend) + '</span>')) +
            stat('Deneme', exams.length) +
          '</div>' +
          '<button class="btn primary" data-act="new">+ Yeni ' + type + ' denemesi</button>' +
        '</div>' +
        '<div class="card ex-chart-card">' +
          '<div class="ex-chart-head"><div class="chips">' + chips + '</div>' +
            '<label class="target">Hedef net <input type="number" step="0.25" min="0" max="' + MAXQ[type] + '" value="' + (target != null ? target : '') + '" placeholder="—"></label></div>' +
          '<div class="ex-chart"></div>' +
        '</div>' +
        '<div class="card ex-table-card">' +
          (exams.length ? '<div class="ex-table-wrap scroll-keep"><table class="ex-table"><thead><tr><th>Tarih</th><th>Deneme</th>' + fields.map((f) => '<th>' + f.n + '</th>').join('') + '<th>Toplam</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
            : '<div class="empty big">Henüz ' + type + ' denemesi yok. “Yeni ' + type + ' denemesi” ile ilkini ekle; netlerin grafikte burada görünecek.</div>') +
        '</div>' +
      '</div>';

    el.querySelectorAll('.seg button').forEach((b) => b.onclick = () => { type = b.dataset.type; App.setParams({ type }); App.render(); });
    el.querySelector('[data-act=new]').onclick = () => edit(null);
    el.querySelectorAll('[data-series]').forEach((b) => b.onclick = () => { seriesOn[b.dataset.series] = !seriesOn[b.dataset.series]; App.render(); });
    el.querySelector('.target input').onchange = (e) => {
      const v = e.target.value === '' ? null : Number(e.target.value);
      S.commit('Hedef net değişti', (s) => { if (v == null) delete s.settings['target' + type]; else s.settings['target' + type] = v; });
    };
    const tb = el.querySelector('.ex-table');
    if (tb) {
      tb.addEventListener('click', (e) => {
        const tr = e.target.closest('tr[data-id]'); if (!tr) return;
        const a = e.target.closest('[data-act]');
        if (a && a.dataset.act === 'del') del(tr.dataset.id);
        else edit(tr.dataset.id);
      });
      tb.addEventListener('contextmenu', (e) => {
        const tr = e.target.closest('tr[data-id]'); if (!tr) return;
        UI.menu(e.clientX, e.clientY, [
          { icon: '✎', label: 'Düzenle…', action: () => edit(tr.dataset.id) },
          { icon: '⎘', label: 'Kopyasını oluştur', action: () => duplicate(tr.dataset.id) },
          { sep: true },
          { icon: '✕', label: 'Sil', danger: true, action: () => del(tr.dataset.id) }
        ]);
      });
    }

    drawChart(el.querySelector('.ex-chart'), exams, fields, target);
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = U.debounce(() => { const c = el.querySelector('.ex-chart'); if (c && App.current.name === 'exams') drawChart(c, list(), FIELDS[type], S.settings['target' + type]); }, 120);
    window.addEventListener('resize', resizeHandler);
  }

  function stat(lbl, val, extra) { return '<div class="ex-stat"><b>' + val + '</b><span>' + lbl + (extra ? ' ' + extra : '') + '</span></div>'; }

  // ---------------- Grafik (SVG) ----------------
  function drawChart(box, exams, fields, target) {
    const W = Math.max(320, box.clientWidth), H = Math.max(220, box.clientHeight || 260);
    const pad = { l: 42, r: 18, t: 16, b: 34 };
    if (!exams.length) { box.innerHTML = '<div class="chart-empty">Grafik için en az bir deneme ekle.</div>'; return; }
    const series = [];
    if (seriesOn.total) series.push({ k: 'total', n: 'Toplam', c: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c9cff', w: 2.6 });
    fields.forEach((f) => { if (seriesOn[f.k]) series.push({ k: f.k, n: f.n, c: f.c, w: 1.8, dash: '5 4' }); });
    let maxV = 0, minV = 0;
    series.forEach((s) => exams.forEach((e) => { const v = examNet(e, s.k); if (v != null) { maxV = Math.max(maxV, v); minV = Math.min(minV, v); } }));
    if (target != null && seriesOn.total) maxV = Math.max(maxV, target);
    maxV = Math.max(10, Math.ceil((maxV * 1.1) / 10) * 10);
    minV = Math.floor(minV / 5) * 5;
    const n = exams.length;
    const x = (i) => pad.l + (n === 1 ? (W - pad.l - pad.r) / 2 : (i / (n - 1)) * (W - pad.l - pad.r));
    const y = (v) => pad.t + (1 - (v - minV) / (maxV - minV)) * (H - pad.t - pad.b);

    let svg = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">';
    // ızgara
    const step = maxV - minV > 60 ? 20 : 10;
    for (let v = minV; v <= maxV; v += step) {
      svg += '<line x1="' + pad.l + '" x2="' + (W - pad.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="grid"/>';
      svg += '<text x="' + (pad.l - 8) + '" y="' + (y(v) + 4) + '" class="axis" text-anchor="end">' + v + '</text>';
    }
    // tarih etiketleri (sığdığı kadar)
    const every = Math.ceil(n / Math.max(1, Math.floor((W - pad.l - pad.r) / 70)));
    exams.forEach((e, i) => { if (i % every === 0 || i === n - 1) svg += '<text x="' + x(i) + '" y="' + (H - 10) + '" class="axis" text-anchor="middle">' + U.fmtDateShort(e.date) + '</text>'; });
    if (target != null && seriesOn.total) svg += '<line x1="' + pad.l + '" x2="' + (W - pad.r) + '" y1="' + y(target) + '" y2="' + y(target) + '" class="target-line"/><text x="' + (W - pad.r) + '" y="' + (y(target) - 6) + '" class="axis target-txt" text-anchor="end">hedef ' + fmtNet(target) + '</text>';
    // seriler
    series.forEach((s) => {
      const pts = exams.map((e, i) => { const v = examNet(e, s.k); return v == null ? null : [x(i), y(v)]; });
      let d = '', pen = false;
      pts.forEach((p) => { if (!p) { pen = false; return; } d += (pen ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' '; pen = true; });
      if (s.k === 'total' && pts.filter(Boolean).length > 1) {
        const valid = pts.map((p, i) => p && [p, i]).filter(Boolean);
        const area = 'M' + valid[0][0][0] + ' ' + y(minV) + ' ' + valid.map(([p]) => 'L' + p[0] + ' ' + p[1]).join(' ') + ' L' + valid[valid.length - 1][0][0] + ' ' + y(minV) + ' Z';
        svg += '<path d="' + area + '" fill="' + s.c + '" opacity="0.10"/>';
      }
      svg += '<path d="' + d + '" fill="none" stroke="' + s.c + '" stroke-width="' + s.w + '"' + (s.dash ? ' stroke-dasharray="' + s.dash + '"' : '') + ' stroke-linejoin="round" stroke-linecap="round"/>';
      pts.forEach((p) => { if (p) svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (s.k === 'total' ? 3.6 : 2.6) + '" fill="' + s.c + '"/>'; });
    });
    svg += '<line class="hover-line hidden" y1="' + pad.t + '" y2="' + (H - pad.b) + '"/></svg><div class="chart-tip hidden"></div>';
    box.innerHTML = svg;

    const svgEl = box.querySelector('svg'), tip = box.querySelector('.chart-tip'), hl = box.querySelector('.hover-line');
    svgEl.addEventListener('mousemove', (ev) => {
      const r = svgEl.getBoundingClientRect();
      const mx = ev.clientX - r.left;
      let best = 0, bd = Infinity;
      exams.forEach((e, i) => { const dd = Math.abs(x(i) - mx); if (dd < bd) { bd = dd; best = i; } });
      const e = exams[best];
      hl.setAttribute('x1', x(best)); hl.setAttribute('x2', x(best)); hl.classList.remove('hidden');
      tip.innerHTML = '<b>' + U.esc(e.name || 'Deneme') + '</b><div class="muted">' + U.fmtDateNum(e.date) + '</div>' +
        series.map((s) => '<div><i style="background:' + s.c + '"></i>' + s.n + ': <b>' + fmtNet(examNet(e, s.k)) + '</b></div>').join('');
      tip.classList.remove('hidden');
      const tx = x(best) + 14 + 180 > W ? x(best) - 194 : x(best) + 14;
      tip.style.left = tx + 'px'; tip.style.top = pad.t + 'px';
    });
    svgEl.addEventListener('mouseleave', () => { tip.classList.add('hidden'); hl.classList.add('hidden'); });
    svgEl.addEventListener('click', (ev) => {
      const r = svgEl.getBoundingClientRect();
      const mx = ev.clientX - r.left;
      let best = 0, bd = Infinity;
      exams.forEach((e, i) => { const dd = Math.abs(x(i) - mx); if (dd < bd) { bd = dd; best = i; } });
      edit(exams[best].id);
    });
  }

  // ---------------- Ekle / düzenle ----------------
  function edit(id) {
    const ex = id ? S.state.exams.find((e) => e.id === id) : null;
    const t = ex ? ex.type : type;
    const fields = FIELDS[t];
    const d = (ex && ex.d) || {}, y = (ex && ex.y) || {};
    const body = U.h(
      '<div class="exam-form">' +
        '<div class="row3">' +
          '<label>Tarih<input type="date" name="date" value="' + (ex ? ex.date : U.todayKey()) + '"></label>' +
          '<label class="grow">Deneme / yayın adı<input name="name" value="' + U.esc(ex ? ex.name || '' : '') + '" placeholder="Örn. 3D Türkiye Geneli 4"></label>' +
        '</div>' +
        '<p class="muted small">Ders ders doğru-yanlış girersen netler otomatik hesaplanır (4 yanlış 1 doğruyu götürür). İstersen yalnızca toplam neti yazabilirsin.</p>' +
        '<table class="net-table"><thead><tr><th>Ders</th><th>Doğru</th><th>Yanlış</th><th>Boş</th><th>Net</th></tr></thead><tbody>' +
        fields.map((f) => '<tr data-k="' + f.k + '"><td><i class="dot" style="background:' + f.c + '"></i>' + f.n + ' <span class="muted small">(' + f.q + ')</span></td>' +
          '<td><input type="number" min="0" max="' + f.q + '" name="d_' + f.k + '" value="' + (d[f.k] != null ? d[f.k] : '') + '"></td>' +
          '<td><input type="number" min="0" max="' + f.q + '" name="y_' + f.k + '" value="' + (y[f.k] != null ? y[f.k] : '') + '"></td>' +
          '<td class="bos">—</td><td class="net">—</td></tr>').join('') +
        '</tbody></table>' +
        '<div class="row3 total-row"><label>Toplam net<input type="number" step="0.25" name="total" value="' + (ex ? ex.total : '') + '"></label>' +
        '<label class="grow">Not<input name="note" value="' + U.esc(ex ? ex.note || '' : '') + '" placeholder="Süre yetmedi, geometri zor geldi…"></label></div>' +
      '</div>'
    );
    let totalTouched = !!(ex && ex.manual);
    const recalc = () => {
      let sum = 0, any = false;
      fields.forEach((f) => {
        const dv = body.querySelector('[name=d_' + f.k + ']').value, yv = body.querySelector('[name=y_' + f.k + ']').value;
        const tr = body.querySelector('tr[data-k=' + f.k + ']');
        if (dv === '' && yv === '') { tr.querySelector('.net').textContent = '—'; tr.querySelector('.bos').textContent = '—'; tr.classList.remove('bad'); return; }
        any = true;
        const n = net(dv, yv); sum += n;
        const bos = f.q - (Number(dv) || 0) - (Number(yv) || 0);
        tr.querySelector('.net').textContent = fmtNet(n);
        tr.querySelector('.bos').textContent = bos;
        tr.classList.toggle('bad', bos < 0);
      });
      if (any && !totalTouched) body.querySelector('[name=total]').value = Math.round(sum * 100) / 100;
    };
    body.addEventListener('input', (e) => { if (e.target.name === 'total') totalTouched = e.target.value !== ''; recalc(); });
    recalc();

    UI.modal({
      title: (ex ? 'Denemeyi düzenle' : 'Yeni deneme') + ' — ' + t, body, width: '560px',
      buttons: [
        ex ? { label: 'Sil', kind: 'ghost danger', action: () => { del(ex.id); } } : null,
        { label: 'Vazgeç', kind: 'ghost' },
        { label: 'Kaydet', kind: 'primary', action: (el) => {
          const rec = { type: t, date: el.querySelector('[name=date]').value || U.todayKey(), name: el.querySelector('[name=name]').value.trim(), note: el.querySelector('[name=note]').value.trim(), d: {}, y: {} };
          let bad = false, sum = 0, any = false;
          fields.forEach((f) => {
            const dv = el.querySelector('[name=d_' + f.k + ']').value, yv = el.querySelector('[name=y_' + f.k + ']').value;
            if (dv === '' && yv === '') return;
            any = true;
            rec.d[f.k] = Number(dv) || 0; rec.y[f.k] = Number(yv) || 0;
            if (rec.d[f.k] + rec.y[f.k] > f.q) bad = true;
            sum += net(dv, yv);
          });
          if (bad) { UI.toast('Bir derste doğru + yanlış soru sayısını aşıyor', 'error'); return false; }
          const tv = el.querySelector('[name=total]').value;
          if (tv === '' && !any) { UI.toast('En az toplam neti gir', 'error'); return false; }
          rec.total = tv !== '' ? Number(tv) : Math.round(sum * 100) / 100;
          rec.manual = tv !== '' && (!any || Math.abs(Number(tv) - sum) > 0.001);
          if (rec.total > MAXQ[t]) { UI.toast('Toplam net en fazla ' + MAXQ[t] + ' olabilir', 'error'); return false; }
          S.commit(ex ? 'Deneme düzenlendi' : 'Deneme eklendi', (s) => {
            if (ex) Object.assign(s.exams.find((e) => e.id === ex.id), rec);
            else s.exams.push(Object.assign({ id: U.uid('e'), created: new Date().toISOString() }, rec));
          });
          UI.sound('ok');
        } }
      ].filter(Boolean)
    });
  }

  function duplicate(id) {
    const ex = S.state.exams.find((e) => e.id === id); if (!ex) return;
    S.commit('Deneme kopyalandı', (s) => { s.exams.push(Object.assign(JSON.parse(JSON.stringify(ex)), { id: U.uid('e'), name: (ex.name || 'Deneme') + ' (kopya)', created: new Date().toISOString() })); });
  }

  async function del(id) {
    if (S.settings.confirmDelete && !(await UI.confirm('Deneme silinsin mi?', { danger: true, okLabel: 'Sil' }))) return;
    S.commit('Deneme silindi', (s) => { s.exams = s.exams.filter((e) => e.id !== id); });
    UI.sound('del');
  }

  function onKey(e) {
    if (e.key === 'n' || e.key === 'N') { edit(null); return true; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { type = type === 'TYT' ? 'AYT' : 'TYT'; App.setParams({ type }); App.render(); return true; }
    return false;
  }

  function leave() { if (resizeHandler) window.removeEventListener('resize', resizeHandler); resizeHandler = null; }

  return { render, onKey, leave };
})();
