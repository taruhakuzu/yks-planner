/* DERSLER EKRANI: ders ders konular, T.S'ler ve tamamlanma yüzdeleri */
window.Views = window.Views || {};
Views.subjects = (function () {
  let showHidden = false;
  let listScroll = {};

  function title(params) {
    const s = S.subject(params.subject || 'mat');
    return 'Dersler · ' + s.exam + ' ' + s.name;
  }

  function render(el, params, fresh) {
    const sid = params.subject && S.subject(params.subject) ? params.subject : 'mat';
    const old = el.querySelector('.subj-table-wrap');
    if (old && !fresh) listScroll[sid] = old.scrollTop;

    const groups = ['TYT', 'AYT'].map((ex) => {
      const items = SUBJECTS.filter((s) => s.exam === ex).map((s) => {
        const st = S.subjectStats(s.id);
        return '<button class="subj-item' + (s.id === sid ? ' active' : '') + '" data-sid="' + s.id + '" style="--c:' + s.color + '">' +
          '<div class="si-top"><i class="dot"></i><span class="si-name">' + U.esc(s.name) + '</span><span class="si-pct">%' + Math.round(st.pct * 100) + '</span></div>' +
          UI.progress(st.pct, s.color) +
          '<div class="si-sub">' + st.finished + '/' + st.count + ' konu · kalan ' + U.fmtHours(st.remaining) + '</div></button>';
      }).join('');
      return '<div class="subj-group"><div class="sg-title">' + ex + '</div>' + items + '</div>';
    }).join('');

    // genel ilerleme
    let tsAll = 0, doneAll = 0;
    SUBJECTS.forEach((s) => { const st = S.subjectStats(s.id); tsAll += st.ts; doneAll += st.done; });

    const sub = S.subject(sid);
    const st = S.subjectStats(sid);
    const topics = S.topics().filter((t) => t.s === sid && (showHidden || !S.isHidden(t.id)));
    const mult = S.settings.tsMultiplier;
    const hiddenCount = S.topics().filter((t) => t.s === sid && S.isHidden(t.id)).length;

    const rows = topics.map((t, i) => {
      const ts = S.topicTs(t.id), studied = S.topicStudied(t.id), rem = S.topicRemaining(t.id);
      const fin = S.isFinished(t.id), def = S.isDeferred(t.id), hid = S.isHidden(t.id);
      const custom = typeof S.topicState(t.id).tsMin === 'number';
      const pct = S.topicProgress(t.id);
      return '<tr class="' + (fin ? 'fin' : '') + (hid ? ' hid' : '') + (params.topic === t.id ? ' flash' : '') + '" data-id="' + t.id + '">' +
        '<td class="c-num">' + (i + 1) + '</td>' +
        '<td class="c-name"><div>' + U.esc(t.n) + '</div><div class="tags">' +
          (def ? '<span class="tag">' + (t.sozel ? 'sözel' : 'sona') + '</span>' : '') +
          (t.est ? '<span class="tag" title="Oynatma listesinde karşılığı yok; süre tahminidir">tahmini</span>' : '') +
          (t.custom ? '<span class="tag">özel</span>' : '') + (hid ? '<span class="tag">gizli</span>' : '') + '</div></td>' +
        '<td class="c-vid">' + (t.v ? U.fmtMin(t.v) : '—') + '</td>' +
        '<td class="c-ts"><button class="ts-btn' + (custom ? ' custom' : '') + '" data-act="ts" title="T.S’yi düzenle">' + U.fmtMin(ts) + '</button></td>' +
        '<td class="c-st">' + U.fmtMin(studied) + '</td>' +
        '<td class="c-rem">' + (fin ? '—' : U.fmtMin(rem)) + '</td>' +
        '<td class="c-prog">' + UI.progress(pct, sub.color) + '<span>%' + Math.round(pct * 100) + '</span></td>' +
        '<td class="c-act"><button class="fin-btn' + (fin ? ' on' : '') + '" data-act="fin" title="' + (fin ? 'Bitirilmemiş yap' : 'Bitirildi olarak işaretle') + '">✓</button>' +
        '<button class="icon-btn small" data-act="more" title="Diğer">⋯</button></td></tr>';
    }).join('');

    el.innerHTML =
      '<div class="subj-layout">' +
        '<div class="subj-side card scroll-keep">' +
          '<div class="overall"><div class="ov-lbl">Genel ilerleme</div><div class="ov-pct">%' + Math.round(tsAll ? doneAll / tsAll * 100 : 0) + '</div>' + UI.progress(tsAll ? doneAll / tsAll : 0, null) +
          '<div class="ov-sub">' + U.fmtHours(doneAll) + ' / ' + U.fmtHours(tsAll) + '</div></div>' +
          groups +
        '</div>' +
        '<div class="subj-main card" style="--c:' + sub.color + '">' +
          '<div class="sm-head">' +
            '<div><div class="sm-exam">' + sub.exam + '</div><h2><i class="dot"></i>' + U.esc(sub.name) + '</h2></div>' +
            '<div class="sm-stats">' +
              '<div><b>' + U.fmtHours(st.ts) + '</b><span>toplam T.S</span></div>' +
              '<div><b>' + U.fmtHours(st.studied) + '</b><span>çalışılan</span></div>' +
              '<div><b>' + U.fmtHours(st.remaining) + '</b><span>kalan</span></div>' +
              '<div><b>' + st.finished + '/' + st.count + '</b><span>bitirilen</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="sm-tools">' +
            '<span class="muted">T.S = video süresi × <b>' + String(mult).replace('.', ',') + '</b> (konu anlatımı + soru çözümü). Çarpanı Ayarlar’dan değiştirebilirsin. Onaylanan günlerdeki çalışma T.S’den otomatik düşülür.</span>' +
            '<div class="sm-btns">' +
              (hiddenCount ? '<button class="btn small ghost" data-act="toggleHidden">' + (showHidden ? 'Gizlileri sakla' : 'Gizlileri göster (' + hiddenCount + ')') + '</button>' : '') +
              '<button class="btn small" data-act="add">+ Konu ekle</button>' +
            '</div>' +
          '</div>' +
          '<div class="subj-table-wrap"><table class="subj-table"><thead><tr>' +
            '<th>#</th><th>Konu</th><th title="Oynatma listesindeki toplam video süresi">Video</th><th title="Tahmini süre">T.S</th><th>Çalışılan</th><th>Kalan</th><th>İlerleme</th><th></th>' +
          '</tr></thead><tbody>' + (rows || '<tr><td colspan="8" class="empty">Bu derste konu yok.</td></tr>') + '</tbody></table></div>' +
          '<div class="sm-foot">' +
            '<div class="sf-lbl"><b>' + sub.exam + ' ' + U.esc(sub.name) + '</b> · %' + Math.round(st.pct * 100) + ' tamamlandı</div>' +
            UI.progress(st.pct, sub.color, { big: true }) +
            '<div class="sf-sub">' + U.fmtHours(st.done) + ' / ' + U.fmtHours(st.ts) + ' · kalan ' + U.fmtHours(st.remaining) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    el.querySelector('.subj-side').addEventListener('click', (e) => {
      const b = e.target.closest('.subj-item'); if (!b) return;
      App.go('subjects', { subject: b.dataset.sid }, { replace: true });
    });
    const tbl = el.querySelector('.subj-table');
    tbl.addEventListener('click', (e) => {
      const tr = e.target.closest('tr[data-id]'); if (!tr) return;
      const id = tr.dataset.id;
      const act = e.target.closest('[data-act]');
      if (!act) return;
      if (act.dataset.act === 'ts') editTs(id);
      if (act.dataset.act === 'fin') Views.week.setFinished(id, !S.isFinished(id));
      if (act.dataset.act === 'more') { const r = act.getBoundingClientRect(); rowMenu(r.left, r.bottom, id); }
    });
    tbl.addEventListener('contextmenu', (e) => {
      const tr = e.target.closest('tr[data-id]'); if (!tr) return;
      rowMenu(e.clientX, e.clientY, tr.dataset.id);
    });
    tbl.addEventListener('dblclick', (e) => {
      const tr = e.target.closest('tr[data-id]'); if (!tr || e.target.closest('button')) return;
      editTs(tr.dataset.id);
    });
    const th = el.querySelector('[data-act=toggleHidden]');
    if (th) th.onclick = () => { showHidden = !showHidden; App.render(); };
    el.querySelector('[data-act=add]').onclick = () => addTopic(sid);

    const wrap = el.querySelector('.subj-table-wrap');
    if (listScroll[sid] != null) wrap.scrollTop = listScroll[sid];
    if (params.topic && fresh) {
      const row = el.querySelector('tr[data-id="' + params.topic + '"]');
      if (row) setTimeout(() => row.scrollIntoView({ block: 'center' }), 30);
    }
  }

  function rowMenu(x, y, id) {
    const t = S.topic(id);
    const fin = S.isFinished(id), def = S.isDeferred(id), hid = S.isHidden(id);
    UI.menu(x, y, [
      { header: t.n },
      { icon: '⏱', label: 'T.S düzenle…', action: () => editTs(id) },
      fin ? { icon: '↺', label: 'Bitirilmemiş yap', action: () => Views.week.setFinished(id, false) }
          : { icon: '✔', label: 'Bitirildi — tekrar edilecek', action: () => Views.week.setFinished(id, true) },
      fin ? { icon: '↻', label: 'Tekrar ettim (+1)', action: () => Views.week.markReviewed(id) } : null,
      !fin ? { icon: def ? '↑' : '↓', label: def ? 'Sıraya al' : 'Sona bırak', action: () => Views.week.setDeferred(id, !def) } : null,
      { icon: hid ? '◉' : '◌', label: hid ? 'Göster' : 'Gizle (listelerden çıkar)', action: () => setHidden(id, !hid) },
      t.custom ? { sep: true } : null,
      t.custom ? { icon: '✎', label: 'Adını değiştir…', action: () => renameTopic(id) } : null,
      t.custom ? { icon: '✕', label: 'Konuyu sil', danger: true, action: () => deleteTopic(id) } : null
    ]);
  }

  function setHidden(id, val) {
    S.commit(val ? 'Konu gizlendi' : 'Konu gösterildi', (s) => {
      const st = s.topics[id] = s.topics[id] || {};
      if (val) st.hidden = true; else delete st.hidden;
    });
  }

  function editTs(id) {
    const t = S.topic(id);
    const cur = S.topicTs(id);
    const st = S.topicState(id);
    const mult = S.settings.tsMultiplier;
    const def = typeof t.ts === 'number' ? t.ts : Math.round((t.v || 0) * mult);
    const body =
      '<p class="muted">' + (t.v ? 'Video süresi: <b>' + U.fmtMin(t.v) + '</b> × ' + String(mult).replace('.', ',') + ' = <b>' + U.fmtMin(def) + '</b>' : 'Varsayılan T.S: <b>' + U.fmtMin(def) + '</b>') +
      (t.est ? ' (tahmini)' : '') + '</p>' +
      '<div class="row2"><label>Saat<input type="number" name="h" min="0" max="500" value="' + Math.floor(cur / 60) + '"></label>' +
      '<label>Dakika<input type="number" name="m" min="0" max="59" step="5" value="' + (cur % 60) + '"></label></div>' +
      '<p class="muted small">Çalışılan: ' + U.fmtMin(S.topicStudied(id)) + ' · Kalan: ' + U.fmtMin(S.topicRemaining(id)) + '</p>';
    UI.modal({
      title: 'T.S — ' + t.n, body, width: '420px',
      buttons: [
        typeof st.tsMin === 'number' ? { label: 'Varsayılana dön', kind: 'ghost', action: () => {
          S.commit('T.S varsayılana döndü', (s) => { delete s.topics[id].tsMin; });
        } } : null,
        { label: 'Vazgeç', kind: 'ghost' },
        { label: 'Kaydet', kind: 'primary', action: (el) => {
          const h = Math.max(0, Number(el.querySelector('[name=h]').value) || 0);
          const m = U.clamp(Number(el.querySelector('[name=m]').value) || 0, 0, 59);
          const v = Math.round(h * 60 + m);
          S.commit('T.S değişti', (s) => {
            const x = s.topics[id] = s.topics[id] || {};
            if (v === def) delete x.tsMin; else x.tsMin = v;
          });
        } }
      ].filter(Boolean)
    });
  }

  function addTopic(sid) {
    const sub = S.subject(sid);
    const body =
      '<label>Konu adı<input name="n" placeholder="Örn. Paragrafta Yapı" autofocus></label>' +
      '<div class="row2"><label>T.S (saat)<input type="number" name="h" min="0" step="0.5" value="2"></label>' +
      '<label>Sona bırak<select name="sona"><option value="0">Hayır</option><option value="1">Evet</option></select></label></div>';
    UI.modal({
      title: sub.exam + ' ' + sub.name + ' — yeni konu', body, width: '420px',
      buttons: [
        { label: 'Vazgeç', kind: 'ghost' },
        { label: 'Ekle', kind: 'primary', action: (el) => {
          const n = el.querySelector('[name=n]').value.trim();
          if (!n) { UI.toast('Konu adı boş olamaz', 'error'); return false; }
          const ts = Math.round((Number(el.querySelector('[name=h]').value) || 0) * 60);
          const sona = el.querySelector('[name=sona]').value === '1';
          S.commit('Konu eklendi', (s) => { s.customTopics.push(Object.assign({ id: U.uid('t'), s: sid, n, ts }, sona ? { sona: true } : {})); });
          UI.sound('ok');
        } }
      ]
    });
  }

  function renameTopic(id) {
    const t = S.topic(id);
    UI.modal({
      title: 'Konu adı', width: '420px',
      body: '<label>Ad<input name="n" value="' + U.esc(t.n) + '"></label>',
      buttons: [
        { label: 'Vazgeç', kind: 'ghost' },
        { label: 'Kaydet', kind: 'primary', action: (el) => {
          const n = el.querySelector('[name=n]').value.trim(); if (!n) return false;
          S.commit('Konu adı değişti', (s) => { const x = s.customTopics.find((c) => c.id === id); if (x) x.n = n; });
        } }
      ]
    });
  }

  async function deleteTopic(id) {
    const used = S.state.blocks.filter((b) => b.topic === id).length;
    if (!(await UI.confirm('Konu silinsin mi?' + (used ? ' Bu konuya ait ' + used + ' blok da silinecek.' : ''), { danger: true, okLabel: 'Sil' }))) return;
    S.commit('Konu silindi', (s) => {
      s.customTopics = s.customTopics.filter((c) => c.id !== id);
      s.blocks = s.blocks.filter((b) => b.topic !== id);
      delete s.topics[id];
    });
  }

  function onKey(e) {
    const p = App.current.params;
    const idx = SUBJECTS.findIndex((s) => s.id === (p.subject || 'mat'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { App.go('subjects', { subject: SUBJECTS[(idx + 1) % SUBJECTS.length].id }, { replace: true }); return true; }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { App.go('subjects', { subject: SUBJECTS[(idx - 1 + SUBJECTS.length) % SUBJECTS.length].id }, { replace: true }); return true; }
    return false;
  }

  return { title, render, onKey, editTs };
})();
