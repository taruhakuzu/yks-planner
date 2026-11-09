/* Uygulama denetleyicisi: gezinme, geçmiş (geri/ileri), kısayollar, geri sayım */
window.App = (function () {
  const viewEl = document.getElementById('view');
  let current = null;          // {name, params}
  const back = [], fwd = [];

  const TITLES = {
    calendar: 'Takvim', week: 'Haftalık Plan', subjects: 'Dersler', exams: 'Denemeler',
    notes: 'Hap Bilgiler', finished: 'Bitirilenler', settings: 'Ayarlar'
  };

  function go(name, params, opts) {
    opts = opts || {};
    params = params || {};
    if (!Views[name]) name = 'calendar';
    if (current && !opts.noHistory) {
      if (current.name === name && JSON.stringify(current.params) === JSON.stringify(params)) return;
      saveScroll();
      if (!opts.replace) { back.push(current); if (back.length > 60) back.shift(); fwd.length = 0; }
    }
    if (current && Views[current.name].leave) Views[current.name].leave();
    current = { name, params };
    render(true);
  }

  function goBack() {
    if (!back.length) { if (current && current.name !== 'calendar') go('calendar', {}, { replace: true }); return; }
    saveScroll();
    if (current) fwd.push(current);
    if (current && Views[current.name].leave) Views[current.name].leave();
    current = back.pop();
    render(true);
  }
  function goForward() {
    if (!fwd.length) return;
    saveScroll();
    if (current) back.push(current);
    if (current && Views[current.name].leave) Views[current.name].leave();
    current = fwd.pop();
    render(true);
  }
  function home() { go('calendar', { month: null }); }

  function saveScroll() {
    if (!current) return;
    const v = Views[current.name];
    if (v.saveState) v.saveState(current.params);
  }

  /** Görünümün parametresini geçmişe eklemeden güncelle (ör. ay değiştirme) */
  function setParams(p) { if (current) { Object.assign(current.params, p); updateChrome(); } }

  function render(fresh) {
    const v = Views[current.name];
    if (fresh) { viewEl.innerHTML = ''; viewEl.className = 'view-' + current.name; }
    // Yeniden çizimde kaydırma konumlarını koru
    const keep = fresh ? [] : [...viewEl.querySelectorAll('.scroll-keep')].map((x) => x.scrollTop);
    v.render(viewEl, current.params, fresh);
    if (keep.length) viewEl.querySelectorAll('.scroll-keep').forEach((x, i) => { if (keep[i] != null) x.scrollTop = keep[i]; });
    updateChrome();
  }

  function updateChrome() {
    const v = Views[current.name];
    document.getElementById('viewTitle').textContent = (v.title ? v.title(current.params) : TITLES[current.name]) || '';
    document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.nav === current.name));
    document.getElementById('btnBack').disabled = !back.length && current.name === 'calendar';
    document.getElementById('btnForward').disabled = !fwd.length;
    const u = document.getElementById('btnUndo'), r = document.getElementById('btnRedo');
    u.disabled = !S.canUndo(); r.disabled = !S.canRedo();
    u.title = S.canUndo() ? 'Geri al: ' + S.undoLabel() + ' (Ctrl+Z)' : 'Geri alınacak işlem yok';
    r.title = S.canRedo() ? 'Yinele: ' + S.redoLabel() + ' (Ctrl+Y)' : 'Yinelenecek işlem yok';
    const fin = S.topics().filter((t) => S.isFinished(t.id)).length;
    const badge = document.getElementById('finishedBadge');
    badge.textContent = fin || '';
    badge.style.display = fin ? '' : 'none';
    updateStats();
  }

  function updateStats() {
    const today = U.todayKey();
    const planned = S.dayMinutes(today);
    const weekOk = S.weekMinutes(today, true);
    const st = S.streak();
    document.getElementById('tbStats').innerHTML =
      '<span title="Bugün planlanan">Bugün <b>' + U.fmtMin(planned) + '</b></span>' +
      '<span title="Bu hafta onaylanan çalışma">Hafta <b>' + U.fmtHours(weekOk) + '</b></span>' +
      '<span title="En az ' + S.settings.thOrange + ' saatlik onaylı gün serisi">Seri <b>' + st + ' gün</b></span>';
  }

  // ---------------- Geri sayım ----------------
  function yksTarget() {
    const v = S.settings.yksDate || '2027-06-19T10:15';
    const d = new Date(v);
    return isNaN(d) ? new Date(2027, 5, 19, 10, 15) : d;
  }
  function countdownParts() {
    const diff = Math.max(0, yksTarget() - new Date());
    const s = Math.floor(diff / 1000);
    return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), mins: Math.floor((s % 3600) / 60), secs: s % 60, total: diff };
  }
  let lastDay = U.todayKey();
  function tick() {
    const p = countdownParts();
    const sb = document.getElementById('sidebarCountdown');
    if (sb) sb.textContent = p.total > 0 ? 'YKS’ye ' + p.days + ' gün' : 'YKS zamanı!';
    document.querySelectorAll('[data-cd]').forEach((el) => {
      const k = el.dataset.cd;
      el.textContent = k === 'days' ? p.days : U.pad(p[k]);
    });
    // Gün değiştiyse ekranı tazele
    const t = U.todayKey();
    if (t !== lastDay) { lastDay = t; if (current) render(false); }
  }

  // ---------------- Ayarları uygula ----------------
  function applySettings() {
    const st = S.settings;
    const root = document.documentElement;
    root.style.setProperty('--accent', st.accent);
    root.style.setProperty('--accent-soft', U.rgba(st.accent, 0.16));
    root.style.setProperty('--accent-line', U.rgba(st.accent, 0.45));
    document.body.classList.toggle('reduce-motion', !!st.reduceMotion);
    document.getElementById('app').classList.toggle('sb-collapsed', !!st.sidebarCollapsed);
  }

  // ---------------- Kısayollar ----------------
  function onKey(e) {
    const k = e.key;
    const ctrl = e.ctrlKey || e.metaKey;

    if (UI.menuOpen()) {
      if (k === 'Escape') { UI.hideMenu(); e.preventDefault(); }
      return;
    }
    if (UI.hasModal()) {
      if (k === 'Escape') { UI.closeTopModal(); e.preventDefault(); }
      else if (k === 'Enter' && UI.modalEnter(e)) e.preventDefault();
      return;
    }
    // Tarayıcı kısayollarını engelle
    if (ctrl && (k === 's' || k === 'S')) { e.preventDefault(); S.saveNow(); UI.toast('Kaydedildi — veriler zaten otomatik kaydediliyor.'); return; }
    if (ctrl && /^[pujhgldPUJHGLD]$/.test(k)) e.preventDefault();

    if (U.isTyping(e)) {
      if (k === 'Escape') { e.target.blur(); e.preventDefault(); }
      return;
    }

    if (ctrl && !e.shiftKey && (k === 'z' || k === 'Z')) { e.preventDefault(); doUndo(); return; }
    if (ctrl && ((k === 'y' || k === 'Y') || (e.shiftKey && (k === 'z' || k === 'Z')))) { e.preventDefault(); doRedo(); return; }
    if (e.altKey && k === 'ArrowLeft') { e.preventDefault(); goBack(); return; }
    if (e.altKey && k === 'ArrowRight') { e.preventDefault(); goForward(); return; }
    if (e.altKey && k === 'Home') { e.preventDefault(); home(); return; }
    if (e.altKey && /^[1-7]$/.test(k)) {
      e.preventDefault();
      const names = ['calendar', 'week', 'subjects', 'exams', 'notes', 'finished', 'settings'];
      nav(names[+k - 1]);
      return;
    }
    if (k === 'F1' || (k === '?' && !ctrl)) { e.preventDefault(); showShortcuts(); return; }
    if (ctrl && (k === 'f' || k === 'F')) {
      const v = Views[current.name];
      if (v.focusSearch) { e.preventDefault(); v.focusSearch(); return; }
    }

    const v = Views[current.name];
    if (v.onKey && v.onKey(e) === true) { e.preventDefault(); return; }

    if (k === 'Backspace') { e.preventDefault(); goBack(); return; }
    if (k === 'Escape') { if (current.name !== 'calendar') { e.preventDefault(); goBack(); } }
  }

  function doUndo() {
    const l = S.undo();
    if (l) { UI.toast('Geri alındı: ' + l); UI.sound(); } else UI.toast('Geri alınacak işlem yok');
  }
  function doRedo() {
    const l = S.redo();
    if (l) { UI.toast('Yinelendi: ' + l); UI.sound(); } else UI.toast('Yinelenecek işlem yok');
  }

  function nav(name) {
    if (name === 'week') go('week', { date: U.todayKey() });
    else if (name === 'calendar') go('calendar', {});
    else go(name, {});
  }

  function showShortcuts() {
    const rows = [
      ['Genel', ''],
      ['Ctrl + Z', 'Geri al'], ['Ctrl + Y / Ctrl + Shift + Z', 'Yinele'],
      ['Alt + ← / Backspace / Fare geri tuşu', 'Önceki ekran'], ['Alt + →', 'Sonraki ekran'],
      ['Alt + Home', 'Ana ekran (takvim)'], ['Alt + 1…7', 'Menüdeki ekranlar'],
      ['Esc', 'Pencereyi kapat / seçimi kaldır / geri'], ['Ctrl + F', 'Arama kutusuna git'],
      ['Ctrl + + / Ctrl + − / Ctrl + 0', 'Yakınlaştır / uzaklaştır / sıfırla'], ['F11', 'Tam ekran'],
      ['Takvim', ''],
      ['← / → veya PageUp / PageDown', 'Önceki / sonraki ay'], ['T', 'Bugüne git'], ['Enter', 'Bu haftayı aç'],
      ['Haftalık plan', ''],
      ['Sürükle-bırak', 'Sağdaki çubuktan konuyu takvime ekle'],
      ['Bloğun üst/alt kenarı', 'Süreyi uzat / kısalt'],
      ['Tık / Ctrl + Tık', 'Seç / çoklu seç'], ['Ctrl + A', 'Haftadaki tüm blokları seç'],
      ['Ctrl + C / Ctrl + X / Ctrl + V', 'Kopyala / kes / fare konumuna yapıştır'],
      ['Ctrl + D', 'Seçili blokları çoğalt'], ['Delete', 'Seçili blokları sil'],
      ['↑ / ↓', 'Seçili bloğu ' + S.settings.snap + ' dk kaydır'], ['Shift + ↑ / ↓', 'Seçili bloğu kısalt / uzat'],
      ['← / →', 'Seçim varsa bloğu güne taşı, yoksa hafta değiştir'],
      ['Çift tık (boş alan)', 'Konu seçerek blok ekle'], ['Ctrl + fare tekerleği', 'Saat yüksekliğini değiştir'],
      ['Sağ tık', 'Blok, gün ve konu menüleri']
    ];
    const html = '<div class="shortcuts">' + rows.map(([a, b]) => b === '' ? '<div class="sc-head">' + a + '</div>' :
      '<div class="sc-row"><kbd>' + U.esc(a) + '</kbd><span>' + U.esc(b) + '</span></div>').join('') + '</div>';
    UI.modal({ title: 'Klavye ve fare kısayolları', body: html, width: '620px' });
  }

  // ---------------- Başlat ----------------
  function init() {
    applySettings();

    document.getElementById('nav').addEventListener('click', (e) => { const b = e.target.closest('.nav-btn'); if (b) nav(b.dataset.nav); });
    document.querySelector('.nav-bottom').addEventListener('click', (e) => { const b = e.target.closest('.nav-btn'); if (b) nav(b.dataset.nav); });
    document.querySelector('.brand').addEventListener('click', () => {
      S.silent((s) => { s.settings.sidebarCollapsed = !s.settings.sidebarCollapsed; });
    });
    document.getElementById('btnBack').onclick = goBack;
    document.getElementById('btnForward').onclick = goForward;
    document.getElementById('btnHome').onclick = home;
    document.getElementById('btnUndo').onclick = doUndo;
    document.getElementById('btnRedo').onclick = doRedo;
    document.getElementById('btnHelp').onclick = showShortcuts;

    document.addEventListener('keydown', onKey);
    // Fare yan tuşları (geri / ileri)
    document.addEventListener('mouseup', (e) => {
      if (e.button === 3) { e.preventDefault(); goBack(); }
      if (e.button === 4) { e.preventDefault(); goForward(); }
    });
    document.addEventListener('mousedown', (e) => { if (e.button === 3 || e.button === 4) e.preventDefault(); });
    // Varsayılan sağ tık menüsü yalnızca yazı alanlarında
    document.addEventListener('contextmenu', (e) => { if (!U.isTyping(e)) e.preventDefault(); });
    // Tıklama sesi
    document.addEventListener('click', (e) => {
      if (e.target.closest('button, .clickable, .cal-cell, input[type=checkbox]')) UI.sound();
    }, true);
    // Ctrl + tekerlek ile tarayıcı yakınlaştırmasını haftalık görünüm kendisi yönetir
    window.addEventListener('beforeunload', () => S.saveNow());

    S.subscribe(() => { applySettings(); if (current) render(false); });

    tick();
    setInterval(tick, 1000);

    const start = S.settings.startView === 'week' ? 'week' : 'calendar';
    current = null;
    go(start, start === 'week' ? { date: U.todayKey() } : {}, { noHistory: true });

    if (!S.storageOk) UI.toast('Tarayıcı depolaması kullanılamıyor; veriler kaydedilmeyebilir.', 'error');
    remindBackup();
  }

  function remindBackup() {
    const last = S.settings.lastBackup;
    const hasData = S.state.blocks.length > 10;
    if (!hasData) return;
    const days = last ? (Date.now() - new Date(last)) / 86400000 : 999;
    if (days > 14) {
      setTimeout(() => UI.toast('Son yedeğin üzerinden ' + (last ? Math.floor(days) + ' gün' : 'uzun süre') + ' geçti.', '', {
        life: 9000, action: { label: 'Yedek al', fn: () => Views.settings.exportData() }
      }), 1500);
    }
  }

  return { go, goBack, goForward, home, setParams, render: () => render(false), init, countdownParts, yksTarget, get current() { return current; }, showShortcuts, nav };
})();

window.addEventListener('DOMContentLoaded', () => App.init());
