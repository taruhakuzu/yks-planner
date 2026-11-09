/* BİTİRİLENLER KLASÖRÜ: bitirilen ve tekrar edilecek konular (aralıklı tekrar önerisi ile) */
window.Views = window.Views || {};
Views.finished = (function () {
  const INTERVALS = [1, 3, 7, 14, 30, 60];   // n. tekrardan sonra önerilen bekleme (gün)
  let sort = 'due';
  let track = 'all';

  function info(t) {
    const st = S.topicState(t.id);
    const rev = st.rev || [];
    const last = rev.length ? rev[rev.length - 1] : st.fin;
    const ago = last ? Math.floor((Date.now() - new Date(last)) / 86400000) : 0;
    const wait = INTERVALS[Math.min(rev.length, INTERVALS.length - 1)];
    return { fin: st.fin, rev, last, ago, wait, due: ago >= wait, dueIn: wait - ago };
  }

  function render(el) {
    let list = S.topics().filter((t) => S.isFinished(t.id)).map((t) => ({ t, i: info(t) }));
    if (track !== 'all') list = list.filter((x) => S.subject(x.t.s).track === track);
    if (sort === 'due') list.sort((a, b) => (b.i.due - a.i.due) || (a.i.dueIn - b.i.dueIn));
    else if (sort === 'fin') list.sort((a, b) => String(b.i.fin).localeCompare(String(a.i.fin)));
    else list.sort((a, b) => SUBJECTS.findIndex((s) => s.id === a.t.s) - SUBJECTS.findIndex((s) => s.id === b.t.s));

    const dueCount = list.filter((x) => x.i.due).length;
    const tracks = [['all', 'Tümü'], ['mat', 'Mat'], ['geo', 'Geo'], ['fiz', 'Fizik'], ['kim', 'Kimya'], ['bio', 'Biyoloji'], ['tr', 'Türkçe'], ['sos', 'Sosyal']];

    const cards = list.map(({ t, i }) => {
      const sub = S.subject(t.s);
      return '<div class="fin-card' + (i.due ? ' due' : '') + '" data-id="' + t.id + '" style="--c:' + sub.color + '">' +
        '<div class="fin-main"><div class="fin-sub">' + sub.exam + ' ' + U.esc(sub.name) + '</div><div class="fin-name">' + U.esc(t.n) + '</div>' +
        '<div class="fin-meta">Bitirildi: ' + (i.fin ? U.fmtDateNum(U.key(new Date(i.fin))) : '—') + ' · ' + i.rev.length + ' tekrar · son: ' + (i.ago ? i.ago + ' gün önce' : 'bugün') + '</div></div>' +
        '<div class="fin-due">' + (i.due ? '<span class="pill warn">Tekrar zamanı</span>' : '<span class="pill">' + i.dueIn + ' gün sonra</span>') + '</div>' +
        '<div class="fin-act"><button class="btn small" data-act="rev" title="Bugün tekrar ettim">↻ Tekrar ettim</button>' +
        '<button class="icon-btn small" data-act="more" title="Diğer">⋯</button></div></div>';
    }).join('');

    el.innerHTML =
      '<div class="fin-layout">' +
        '<div class="fin-top card">' +
          '<div><h2>Bitirilenler</h2><div class="muted">Bitirdiğin konular burada toplanır. Aralıklı tekrar önerisi: 1 → 3 → 7 → 14 → 30 → 60 gün. Haftalık plandaki “Tekrar” sekmesinden bu konuları takvime sürükleyebilirsin.</div></div>' +
          '<div class="fin-kpis"><div><b>' + S.topics().filter((t) => S.isFinished(t.id)).length + '</b><span>bitirilen</span></div><div><b>' + dueCount + '</b><span>tekrar zamanı gelen</span></div></div>' +
        '</div>' +
        '<div class="fin-tools">' +
          '<div class="chips">' + tracks.map(([k, n]) => '<button class="chip' + (track === k ? ' on' : '') + '" data-track="' + k + '">' + n + '</button>').join('') + '</div>' +
          '<label class="muted">Sırala <select class="fin-sort"><option value="due"' + (sort === 'due' ? ' selected' : '') + '>Tekrar zamanına göre</option><option value="fin"' + (sort === 'fin' ? ' selected' : '') + '>Bitirme tarihine göre</option><option value="subj"' + (sort === 'subj' ? ' selected' : '') + '>Derse göre</option></select></label>' +
        '</div>' +
        '<div class="fin-list scroll-keep">' + (cards || '<div class="empty big">Henüz bitirilen konu yok.<br><span class="muted">Haftalık plandaki Bitirilecekler çubuğunda bir konuya sağ tıklayıp “Bitirildi — tekrar edilecek” seçeneğini kullan.</span></div>') + '</div>' +
      '</div>';

    el.querySelectorAll('[data-track]').forEach((b) => b.onclick = () => { track = b.dataset.track; App.render(); });
    el.querySelector('.fin-sort').onchange = (e) => { sort = e.target.value; App.render(); };
    const listEl = el.querySelector('.fin-list');
    listEl.addEventListener('click', (e) => {
      const card = e.target.closest('.fin-card'); if (!card) return;
      const a = e.target.closest('[data-act]'); if (!a) return;
      if (a.dataset.act === 'rev') Views.week.markReviewed(card.dataset.id);
      if (a.dataset.act === 'more') { const r = a.getBoundingClientRect(); menu(r.left, r.bottom, card.dataset.id); }
    });
    listEl.addEventListener('contextmenu', (e) => {
      const card = e.target.closest('.fin-card'); if (!card) return;
      menu(e.clientX, e.clientY, card.dataset.id);
    });
  }

  function menu(x, y, id) {
    const t = S.topic(id);
    UI.menu(x, y, [
      { header: t.n },
      { icon: '↻', label: 'Tekrar ettim (+1)', action: () => Views.week.markReviewed(id) },
      { icon: '▤', label: 'Bu haftanın planına git', action: () => App.go('week', { date: U.todayKey() }) },
      { icon: '◧', label: 'Derste göster', action: () => App.go('subjects', { subject: t.s, topic: id }) },
      { sep: true },
      { icon: '↺', label: 'Bitirilmemiş yap (listeye geri dön)', danger: true, action: () => Views.week.setFinished(id, false) }
    ]);
  }

  return { render };
})();
