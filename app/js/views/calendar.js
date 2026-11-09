/* ANA EKRAN: Aylık takvim + YKS geri sayımı */
window.Views = window.Views || {};
Views.calendar = (function () {
  let quoteIdx = Math.floor(Math.random() * QUOTES.length);

  function monthOf(params) {
    if (params.month) return params.month;
    const t = U.todayKey();
    return t.slice(0, 7);
  }
  function shiftMonth(m, n) {
    const [y, mo] = m.split('-').map(Number);
    const d = new Date(y, mo - 1 + n, 1);
    return d.getFullYear() + '-' + U.pad(d.getMonth() + 1);
  }

  function title(params) {
    const [y, m] = monthOf(params).split('-').map(Number);
    return 'Takvim · ' + U.MONTHS[m - 1] + ' ' + y;
  }

  function render(el, params) {
    const month = monthOf(params);
    const [y, m] = month.split('-').map(Number);
    const first = U.key(new Date(y, m - 1, 1, 12));
    const gridStart = U.weekStart(first);
    const today = U.todayKey();

    let cells = '';
    for (let w = 0; w < 6; w++) {
      const ws = U.addDays(gridStart, w * 7);
      for (let i = 0; i < 7; i++) {
        const d = U.addDays(ws, i);
        cells += cellHtml(d, d.slice(0, 7) === month, d === today);
      }
      const wOk = S.weekMinutes(ws, true), wPlan = S.weekMinutes(ws, false);
      const restLimit = S.settings.restWeekHours * 60;
      cells += '<button class="cal-week" data-week="' + ws + '" title="Bu haftayı aç">' +
        '<span class="cw-num">' + U.fmtHours(wOk) + '</span>' +
        '<span class="cw-sub">' + (wPlan > wOk ? U.fmtHours(wPlan) + ' plan' : 'onaylı') + '</span>' +
        '<span class="cw-bar"><i style="height:' + Math.min(100, (wOk / restLimit) * 100) + '%"></i></span></button>';
    }

    const legendCodes = ['green', 'lime', 'orange', 'low', 'red', 'rest', 'planned'];
    const legend = legendCodes.map((c) => { const inf = S.statusInfo(c); return '<span class="lg"><i style="background:' + inf.color + '"></i>' + inf.label + '</span>'; }).join('');

    const target = App.yksTarget();
    const tKey = U.key(target);
    const p = App.countdownParts();
    const showSec = S.settings.showSeconds;

    const allTopics = S.topics().filter((t) => !S.isHidden(t.id));
    const finCount = allTopics.filter((t) => S.isFinished(t.id)).length;
    let tsSum = 0, doneSum = 0;
    allTopics.forEach((t) => { const ts = S.topicTs(t.id); tsSum += ts; doneSum += S.isFinished(t.id) ? ts : Math.min(ts, S.topicStudied(t.id)); });
    const monthOk = Object.keys(S.state.days).filter((d) => d.slice(0, 7) === month).reduce((a, d) => a + S.dayApprovedMinutes(d), 0);
    const daysLeft = Math.max(1, p.days);
    const perDay = Math.max(0, tsSum - doneSum) / daysLeft;

    el.innerHTML =
      '<div class="cal-layout">' +
        '<div class="card cal-card">' +
          '<div class="cal-head">' +
            '<div class="cal-nav">' +
              '<button class="icon-btn" data-act="prev" title="Önceki ay (←)">‹</button>' +
              '<h2 class="cal-title">' + U.MONTHS[m - 1] + ' <span>' + y + '</span></h2>' +
              '<button class="icon-btn" data-act="next" title="Sonraki ay (→)">›</button>' +
              '<button class="btn small ghost" data-act="today" title="Bugün (T)">Bugün</button>' +
            '</div>' +
            '<div class="cal-legend">' + legend + '</div>' +
          '</div>' +
          '<div class="cal-dows">' + U.DAYS_SHORT.map((d) => '<div>' + d + '</div>').join('') + '<div class="cw-head">Hafta</div></div>' +
          '<div class="cal-grid">' + cells + '</div>' +
        '</div>' +
        '<div class="countdown-card">' +
          '<div class="cd-main">' +
            '<div class="cd-label">YKS’ye kalan süre</div>' +
            '<div class="cd-boxes">' +
              '<div class="cd-box big"><b data-cd="days">' + p.days + '</b><span>gün</span></div>' +
              '<div class="cd-box"><b data-cd="hours">' + U.pad(p.hours) + '</b><span>saat</span></div>' +
              '<div class="cd-box"><b data-cd="mins">' + U.pad(p.mins) + '</b><span>dakika</span></div>' +
              (showSec ? '<div class="cd-box"><b data-cd="secs">' + U.pad(p.secs) + '</b><span>saniye</span></div>' : '') +
            '</div>' +
            '<div class="cd-date">' + U.fmtDateLong(tKey) + ' · ' + U.pad(target.getHours()) + ':' + U.pad(target.getMinutes()) + ' — TYT</div>' +
          '</div>' +
          '<div class="cd-side">' +
            (S.settings.showQuote ? '<div class="cd-quote clickable" title="Başka bir söz">“' + U.esc(QUOTES[quoteIdx % QUOTES.length]) + '”</div>' : '') +
            '<div class="cd-stats">' +
              '<div><b>' + U.fmtHours(S.totalStudied()) + '</b><span>toplam onaylı çalışma</span></div>' +
              '<div><b>' + U.fmtHours(monthOk) + '</b><span>bu ay</span></div>' +
              '<div><b>' + finCount + '/' + allTopics.length + '</b><span>bitirilen konu</span></div>' +
              '<div><b>%' + Math.round(tsSum ? (doneSum / tsSum) * 100 : 0) + '</b><span>genel ilerleme</span></div>' +
              '<div title="Kalan T.S toplamının kalan güne bölümü"><b>' + U.fmtMin(perDay) + '</b><span>günlük gereken tempo</span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    el.querySelector('[data-act=prev]').onclick = () => setMonth(shiftMonth(month, -1));
    el.querySelector('[data-act=next]').onclick = () => setMonth(shiftMonth(month, 1));
    el.querySelector('[data-act=today]').onclick = () => setMonth(U.todayKey().slice(0, 7));
    const q = el.querySelector('.cd-quote');
    if (q) q.onclick = () => { quoteIdx++; q.textContent = '“' + QUOTES[quoteIdx % QUOTES.length] + '”'; };

    const grid = el.querySelector('.cal-grid');
    grid.addEventListener('click', (e) => {
      const c = e.target.closest('.cal-cell');
      if (c) { App.go('week', { date: c.dataset.date, focus: c.dataset.date }); return; }
      const w = e.target.closest('.cal-week');
      if (w) App.go('week', { date: w.dataset.week });
    });
    grid.addEventListener('contextmenu', (e) => {
      const c = e.target.closest('.cal-cell');
      if (!c) return;
      const d = c.dataset.date;
      const ok = S.isApproved(d);
      UI.menu(e.clientX, e.clientY, [
        { header: U.fmtDateLong(d) },
        { icon: '▤', label: 'Haftayı aç', action: () => App.go('week', { date: d, focus: d }) },
        { icon: ok ? '↺' : '✓', label: ok ? 'Onayı kaldır' : 'Günü onayla', action: () => toggleApprove(d) },
        { sep: true },
        { icon: '✕', label: 'Günün planını temizle', danger: true, disabled: !S.blocksOn(d).length, action: () => clearDay(d) }
      ]);
    });
    // Fare tekerleği ile ay değiştirme
    grid.addEventListener('wheel', (e) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      const now = Date.now();
      if (now - (grid._lastWheel || 0) < 350) return;
      grid._lastWheel = now;
      setMonth(shiftMonth(month, e.deltaY > 0 ? 1 : -1));
    }, { passive: false });
  }

  function cellHtml(d, inMonth, isToday) {
    const status = S.dayStatus(d);
    const inf = S.statusInfo(status);
    const blocks = S.blocksOn(d);
    const mins = S.dayMinutes(d);
    const approved = S.isApproved(d);
    const day = U.parse(d).getDate();

    // Ders dağılım çubuğu
    let bars = '';
    if (mins) {
      const by = {};
      blocks.forEach((b) => { const c = S.blockColor(b); by[c] = (by[c] || 0) + b.dur; });
      bars = '<div class="cell-bars">' + Object.entries(by).map(([c, v]) => '<i style="flex:' + v + ';background:' + c + '"></i>').join('') + '</div>';
    }
    const names = blocks.slice(0, 3).map((b) => '<div class="cell-topic"><i style="background:' + S.blockColor(b) + '"></i>' + U.esc(S.blockTitle(b)) + '</div>').join('');
    const more = blocks.length > 3 ? '<div class="cell-more">+' + (blocks.length - 3) + ' blok</div>' : '';
    const style = inf.color && status !== 'planned' ? ' style="--st:' + inf.color + '"' : '';
    const titleTxt = U.fmtDateLong(d) + (mins ? ' — ' + U.fmtMin(mins) + (approved ? ' (onaylı, ' + inf.label + ')' : ' planlı') : '');

    return '<div class="cal-cell st-' + status + (inMonth ? '' : ' other') + (isToday ? ' today' : '') + '" data-date="' + d + '"' + style + ' title="' + U.esc(titleTxt) + '">' +
      '<div class="cell-top"><span class="cell-num">' + day + '</span>' +
      (approved ? '<span class="cell-check" title="Onaylandı">✓</span>' : '') +
      (mins ? '<span class="cell-hours">' + U.fmtMin(mins, { compact: true }) + '</span>' : '') + '</div>' +
      bars + '<div class="cell-topics">' + names + more + '</div>' +
    '</div>';
  }

  function setMonth(m) { App.setParams({ month: m }); App.render(); }

  function toggleApprove(d) {
    const ok = S.isApproved(d);
    S.commit(ok ? 'Gün onayı kaldırıldı' : 'Gün onaylandı', (s) => {
      if (ok) delete s.days[d]; else s.days[d] = { ok: true, at: new Date().toISOString() };
    });
    if (!ok) UI.sound('ok');
  }
  async function clearDay(d) {
    if (S.settings.confirmDelete && !(await UI.confirm(U.fmtDateLong(d) + ' günündeki tüm bloklar silinsin mi?', { danger: true, okLabel: 'Temizle' }))) return;
    S.commit('Gün temizlendi', (s) => { s.blocks = s.blocks.filter((b) => b.date !== d); });
  }

  function onKey(e) {
    const p = App.current.params;
    const month = monthOf(p);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { setMonth(shiftMonth(month, -1)); return true; }
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { setMonth(shiftMonth(month, 1)); return true; }
    if (e.key === 't' || e.key === 'T') { setMonth(U.todayKey().slice(0, 7)); return true; }
    if (e.key === 'Enter') { App.go('week', { date: U.todayKey(), focus: U.todayKey() }); return true; }
    return false;
  }

  return { title, render, onKey };
})();
