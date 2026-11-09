/* AYARLAR */
window.Views = window.Views || {};
Views.settings = (function () {
  const ACCENTS = ['#7c9cff', '#9b8cff', '#5ec4d6', '#5fd39a', '#f2b45c', '#f08aa8', '#c0c6d4'];

  function render(el) {
    const st = S.settings;
    const opt = (v, cur, lbl) => '<option value="' + v + '"' + (String(v) === String(cur) ? ' selected' : '') + '>' + (lbl || v) + '</option>';
    const hourOpts = (from, to, cur) => { let o = ''; for (let h = from; h <= to; h++) o += opt(h, cur, U.pad(h % 24) + ':00' + (h >= 24 ? ' (ertesi gün)' : '')); return o; };
    const lastB = st.lastBackup ? U.fmtDateNum(U.key(new Date(st.lastBackup))) : 'hiç alınmadı';
    const daily = S.dailyBackupDate();

    el.innerHTML =
      '<div class="settings-layout scroll-keep">' +
      section('Sınav', 'YKS tarihi ve geri sayım',
        row('YKS (TYT) tarihi ve saati', '<input type="datetime-local" data-k="yksDate" value="' + st.yksDate + '">', '2027 YKS: 19 Haziran 2027 (TYT, 10:15), 20 Haziran 2027 (AYT). ÖSYM değiştirirse buradan güncelle.') +
        row('Geri sayımda saniyeleri göster', toggle('showSeconds', st.showSeconds)) +
        row('Motivasyon sözlerini göster', toggle('showQuote', st.showQuote))
      ) +
      section('Tahmini süre (T.S)', 'Konu anlatımı + soru çözümü için ayrılan süre',
        row('T.S çarpanı', '<div class="range-row"><input type="range" min="1" max="4" step="0.1" data-k="tsMultiplier" value="' + st.tsMultiplier + '"><b class="range-val">' + String(st.tsMultiplier).replace('.', ',') + '×</b></div>',
          'T.S = oynatma listesindeki video süresi × çarpan. Varsayılan 2×. Elle düzenlediğin T.S’ler bu çarpandan etkilenmez.') +
        row('Elle düzenlenen T.S’leri sıfırla', '<button class="btn small ghost" data-act="resetTs">Sıfırla</button>')
      ) +
      section('Gün renkleri', 'Onaylanan günün çalışma saatine göre renk',
        row('<i class="sw" style="background:#34c77b"></i>Yeşil (en az)', num('thGreen', st.thGreen, 1, 16, 0.5, 'saat')) +
        row('<i class="sw" style="background:#a9c93c"></i>Turuncu-yeşil (en az)', num('thLime', st.thLime, 1, 16, 0.5, 'saat')) +
        row('<i class="sw" style="background:#f29a3a"></i>Turuncu (en az)', num('thOrange', st.thOrange, 0.5, 16, 0.5, 'saat')) +
        row('<i class="sw" style="background:#e5484d"></i>Kırmızı (en fazla)', num('thRed', st.thRed, 0, 8, 0.5, 'saat'), 'Bu değerle turuncu eşiği arası koyu turuncu gösterilir.') +
        row('<i class="sw" style="background:#4b8dff"></i>Mola günü eşiği', num('restWeekHours', st.restWeekHours, 10, 100, 1, 'saat/hafta'), 'Haftanın diğer günlerinin onaylı toplamı bunu geçerse az çalışılan gün mavi (mola günü) olur.')
      ) +
      section('Haftalık plan', 'Saat ızgarası ve bloklar',
        row('Gün başlangıcı', '<select data-k="dayStart" data-num>' + hourOpts(4, 12, st.dayStart) + '</select>') +
        row('Gün bitişi', '<select data-k="dayEnd" data-num>' + hourOpts(20, 28, st.dayEnd) + '</select>') +
        row('Yapışma aralığı', '<select data-k="snap" data-num>' + [5, 10, 15, 30].map((v) => opt(v, st.snap, v + ' dk')).join('') + '</select>', 'Blokları taşırken ve boyutlandırırken kullanılan adım.') +
        row('Varsayılan blok süresi', '<select data-k="defaultBlock" data-num>' + [30, 45, 60, 90, 120].map((v) => opt(v, st.defaultBlock, U.fmtMin(v))).join('') + '</select>', 'Konunun kalan T.S’si daha kısaysa blok o kadar olur.') +
        row('Saat yüksekliği', '<div class="range-row"><input type="range" min="28" max="140" step="2" data-k="hourHeight" value="' + st.hourHeight + '"><b class="range-val">' + st.hourHeight + ' px</b></div>', 'Haftalık planda Ctrl + fare tekerleği ile de değişir.') +
        row('Silmeden önce onay iste', toggle('confirmDelete', st.confirmDelete)) +
        row('Açılış ekranı', '<select data-k="startView">' + opt('calendar', st.startView, 'Takvim') + opt('week', st.startView, 'Bu haftanın planı') + '</select>')
      ) +
      section('Görünüm ve ses', '',
        row('Vurgu rengi', '<div class="accents">' + ACCENTS.map((c) => '<button class="acc' + (c === st.accent ? ' on' : '') + '" data-acc="' + c + '" style="background:' + c + '"></button>').join('') + '</div>') +
        row('Animasyonları azalt', toggle('reduceMotion', st.reduceMotion)) +
        row('Kenar çubuğunu daralt', toggle('sidebarCollapsed', st.sidebarCollapsed), 'Sol üstteki logoya tıklayarak da açıp kapatabilirsin.') +
        row('Tıklama sesleri', toggle('sounds', st.sounds)) +
        row('Ses seviyesi', '<div class="range-row"><input type="range" min="0" max="1" step="0.05" data-k="volume" value="' + st.volume + '"><b class="range-val">%' + Math.round(st.volume * 100) + '</b></div>') +
        row('Yakınlaştırma', '<span class="muted">Ctrl + + / Ctrl + − / Ctrl + 0</span>')
      ) +
      section('Veri ve yedek', 'Tüm veriler yalnızca bu bilgisayarda saklanır; internet bağlantısı kullanılmaz.',
        row('Yedeği dışa aktar', '<button class="btn small primary" data-act="export">Yedek dosyası indir</button>', 'Son yedek: ' + lastB + '. Dosya “İndirilenler” klasörüne kaydedilir. Arkadaşına planını göndermek veya bilgisayar değiştirmek için de kullanabilirsin.') +
        row('Yedekten geri yükle', '<button class="btn small" data-act="import">Dosya seç…</button><input type="file" accept=".json,application/json" class="hidden" data-file>', 'Mevcut verilerin yerini alır (Ctrl+Z ile geri alınabilir).') +
        row('Otomatik günlük kopya', '<button class="btn small ghost" data-act="daily"' + (daily ? '' : ' disabled') + '>Güne başlarken ki hâline dön</button>', daily ? 'Uygulama her gün ilk kayıtta bir kopya saklar (' + U.fmtDateNum(daily) + ').' : 'Henüz kopya yok.') +
        row('Tüm verileri sıfırla', '<button class="btn small danger" data-act="reset">Sıfırla…</button>', 'Plan, onaylar, denemeler ve notlar silinir. Önce yedek almanı öneririz.')
      ) +
      section('Kısayollar ve hakkında', '',
        row('Klavye kısayolları', '<button class="btn small ghost" data-act="keys">Listeyi aç (F1)</button>') +
        row('Sürüm', '<span class="muted">YKS Planlayıcı 1.0 · tamamen çevrimdışı</span>')
      ) +
      '</div>';

    // olaylar
    el.querySelectorAll('[data-k]').forEach((inp) => {
      const k = inp.dataset.k;
      const isRange = inp.type === 'range';
      const handler = () => {
        let v;
        if (inp.type === 'checkbox') v = inp.checked;
        else if (inp.type === 'number' || isRange || inp.hasAttribute('data-num')) v = Number(inp.value);
        else v = inp.value;
        if (isRange) {
          const lbl = inp.parentNode.querySelector('.range-val');
          lbl.textContent = k === 'volume' ? '%' + Math.round(v * 100) : k === 'hourHeight' ? v + ' px' : String(v).replace('.', ',') + '×';
        }
        if (!validate(k, v, inp)) return;
        if (isRange && k !== 'tsMultiplier') { S.state.settings[k] = v; S.saveNow(); return; }
        S.commit('Ayar değişti', (s) => { s.settings[k] = v; });
        if (k === 'sounds' && v) UI.sound('ok');
      };
      inp.addEventListener(isRange ? 'input' : 'change', isRange && k === 'tsMultiplier' ? U.debounce(handler, 250) : handler);
    });
    el.querySelectorAll('[data-acc]').forEach((b) => b.onclick = () => S.commit('Vurgu rengi değişti', (s) => { s.settings.accent = b.dataset.acc; }));
    el.querySelector('[data-act=export]').onclick = exportData;
    const file = el.querySelector('[data-file]');
    el.querySelector('[data-act=import]').onclick = () => file.click();
    file.onchange = () => importFile(file.files[0]);
    el.querySelector('[data-act=reset]').onclick = resetAll;
    el.querySelector('[data-act=resetTs]').onclick = resetTs;
    el.querySelector('[data-act=keys]').onclick = App.showShortcuts;
    const d = el.querySelector('[data-act=daily]');
    if (d) d.onclick = async () => {
      if (!(await UI.confirm('Veriler bugünün ilk kaydındaki hâline dönsün mü? (Ctrl+Z ile geri alınabilir)', { okLabel: 'Geri dön' }))) return;
      if (S.restoreDailyBackup()) UI.toast('Günlük kopyaya dönüldü');
    };
  }

  function validate(k, v, inp) {
    const st = S.settings;
    const bad = (msg) => { UI.toast(msg, 'error'); inp.value = st[k]; return false; };
    if (k === 'yksDate' && isNaN(new Date(v))) return bad('Geçerli bir tarih gir');
    if (k === 'dayEnd' && v - st.dayStart < 8) return bad('Gün en az 8 saat olmalı');
    if (k === 'dayStart' && st.dayEnd - v < 8) return bad('Gün en az 8 saat olmalı');
    if (k === 'dayStart' || k === 'dayEnd') {
      const ds = (k === 'dayStart' ? v : st.dayStart) * 60, de = (k === 'dayEnd' ? v : st.dayEnd) * 60;
      const out = S.state.blocks.filter((b) => b.start < ds || b.start + b.dur > de).length;
      if (out) return bad(out + ' blok bu aralığın dışında kalıyor. Önce onları taşı.');
    }
    if (['thGreen', 'thLime', 'thOrange', 'thRed', 'restWeekHours'].includes(k) && (isNaN(v) || v < 0)) return bad('Geçerli bir sayı gir');
    return true;
  }

  function section(t, sub, body) {
    return '<section class="card set-sec"><div class="set-head"><h2>' + t + '</h2>' + (sub ? '<div class="muted">' + sub + '</div>' : '') + '</div>' + body + '</section>';
  }
  function row(label, control, help) {
    return '<div class="set-row"><div class="set-lbl"><div>' + label + '</div>' + (help ? '<div class="muted small">' + help + '</div>' : '') + '</div><div class="set-ctl">' + control + '</div></div>';
  }
  function toggle(k, v) { return '<label class="switch"><input type="checkbox" data-k="' + k + '"' + (v ? ' checked' : '') + '><span></span></label>'; }
  function num(k, v, min, max, step, unit) { return '<span class="num-unit"><input type="number" data-k="' + k + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + v + '"> ' + unit + '</span>'; }

  function exportData() {
    S.silent((s) => { s.settings.lastBackup = new Date().toISOString(); });
    const data = JSON.stringify(Object.assign({ _app: 'yks-planlayici', _exportedAt: new Date().toISOString() }, S.state), null, 1);
    U.download('yks-planlayici-yedek-' + U.todayKey() + '.json', data);
    UI.toast('Yedek “İndirilenler” klasörüne kaydedildi');
  }

  function importFile(f) {
    if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      try {
        const data = JSON.parse(r.result);
        if (!data || !Array.isArray(data.blocks) || typeof data.settings !== 'object') throw new Error('biçim');
        const msg = 'Yedekte ' + data.blocks.length + ' blok, ' + (data.exams || []).length + ' deneme var. Mevcut verilerin yerini alsın mı?';
        if (!(await UI.confirm(msg, { okLabel: 'Yükle' }))) return;
        delete data._app; delete data._exportedAt;
        S.replaceAll(data, 'Yedek yüklendi');
        UI.toast('Yedek yüklendi');
      } catch (e) {
        UI.toast('Dosya okunamadı: geçerli bir YKS Planlayıcı yedeği değil', 'error');
      }
    };
    r.readAsText(f);
  }

  async function resetAll() {
    if (!(await UI.confirm('Tüm veriler silinecek. Bu işlemden sonra Ctrl+Z ile geri alabilirsin ama uygulamayı kapatınca geri dönüş olmaz. Devam?', { danger: true, okLabel: 'Hepsini sil' }))) return;
    const keep = Object.assign({}, S.settings);
    const b = S.blank();
    b.settings = keep;
    S.replaceAll(b, 'Tüm veriler sıfırlandı');
    UI.toast('Veriler sıfırlandı', '', { action: { label: 'Geri al', fn: () => S.undo() } });
  }

  function resetTs() {
    const n = Object.values(S.state.topics).filter((t) => typeof t.tsMin === 'number').length;
    if (!n) { UI.toast('Elle düzenlenmiş T.S yok'); return; }
    S.commit('T.S’ler sıfırlandı', (s) => { Object.values(s.topics).forEach((t) => { delete t.tsMin; }); });
    UI.toast(n + ' konunun T.S’si varsayılana döndü');
  }

  return { render, exportData };
})();
