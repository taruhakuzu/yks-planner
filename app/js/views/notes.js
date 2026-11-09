/* HAP BİLGİLER: formül kartları, periyodik tablo, kişisel notlar */
window.Views = window.Views || {};
Views.notes = (function () {
  let cat = 'mat';
  let query = '';
  let favOnly = false;
  let selEl = 8;           // periyodik tabloda seçili element (Oksijen)
  let catFilter = null;

  const favKey = (f) => f.c + '|' + f.t;
  const isFav = (f) => S.state.favs.includes(favKey(f));

  function groupLabel(g) {
    if (g === 1 || g === 2) return g + 'A';
    if (g >= 13) return (g - 10) + 'A';
    if (g >= 3 && g <= 7) return g + 'B';
    if (g >= 8 && g <= 10) return '8B';
    if (g === 11) return '1B';
    if (g === 12) return '2B';
    return '';
  }

  function render(el, params, fresh) {
    if (params.cat) cat = params.cat;
    const searching = query.trim().length > 0;
    const tabs = NOTE_CATEGORIES.map((c) => '<button class="tab' + (cat === c.id && !searching ? ' on' : '') + '" data-cat="' + c.id + '" style="--c:' + c.color + '">' + c.name + '</button>').join('');
    const focused = document.activeElement && document.activeElement.classList.contains('notes-search');

    let content;
    if (!searching && cat === 'ptable') content = ptableHtml();
    else if (!searching && cat === 'mine') content = mineHtml();
    else content = cardsHtml();

    el.innerHTML =
      '<div class="notes-layout">' +
        '<div class="notes-top">' +
          '<div class="tabs">' + tabs + '</div>' +
          '<div class="notes-tools">' +
            '<input class="notes-search" type="search" placeholder="Tüm hap bilgilerde ara… (Ctrl+F)" value="' + U.esc(query) + '">' +
            '<button class="chip' + (favOnly ? ' on' : '') + '" data-act="fav" title="Yalnızca favoriler">★ Favoriler</button>' +
          '</div>' +
        '</div>' +
        '<div class="notes-content scroll-keep">' + content + '</div>' +
      '</div>';

    el.querySelector('.tabs').addEventListener('click', (e) => {
      const b = e.target.closest('.tab'); if (!b) return;
      cat = b.dataset.cat; query = ''; App.setParams({ cat }); App.render();
    });
    const s = el.querySelector('.notes-search');
    s.addEventListener('input', U.debounce(() => { query = s.value; App.render(); }, 140));
    if (focused) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
    el.querySelector('[data-act=fav]').onclick = () => { favOnly = !favOnly; App.render(); };

    el.querySelectorAll('.fcard .star').forEach((b) => b.onclick = (e) => {
      e.stopPropagation();
      const k = b.dataset.key;
      S.commit('Favori değişti', (st) => { const i = st.favs.indexOf(k); if (i >= 0) st.favs.splice(i, 1); else st.favs.push(k); });
    });

    if (!searching && cat === 'ptable') bindPtable(el);
    if (!searching && cat === 'mine') bindMine(el);
    el.querySelectorAll('.mine-card').forEach((c) => c.addEventListener('contextmenu', (e) => mineMenu(e, c.dataset.id)));
  }

  function highlight(html) {
    const q = query.trim();
    if (!q) return html;
    // yalnızca etiket dışındaki metni vurgula
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return html.split(/(<[^>]+>)/).map((part) => part.startsWith('<') ? part : part.replace(re, '<mark>$1</mark>')).join('');
  }

  function cardsHtml() {
    const q = U.norm(query.trim());
    let list = FORMULAS.slice();
    const mine = S.state.notes.map((n) => ({ c: n.c || 'mine', t: n.t, l: String(n.body || '').split('\n').filter(Boolean).map(U.esc), mine: true, id: n.id }));
    if (q) list = list.concat(mine).filter((f) => U.norm(f.t + ' ' + f.l.join(' ').replace(/<[^>]+>/g, '')).includes(q));
    else list = list.filter((f) => f.c === cat);
    if (favOnly) list = list.filter(isFav);
    if (!list.length) return '<div class="empty big">' + (q ? 'Aramaya uyan bilgi bulunamadı.' : favOnly ? 'Bu bölümde favori yok. Kartlardaki ☆ simgesine tıklayarak ekleyebilirsin.' : 'Bu bölümde kart yok.') + '</div>';
    const catOf = (id) => NOTE_CATEGORIES.find((c) => c.id === id) || NOTE_CATEGORIES[NOTE_CATEGORIES.length - 1];
    return '<div class="fcards">' + list.map((f) => {
      const c = catOf(f.c);
      return '<div class="fcard' + (f.mine ? ' mine-card' : '') + '" style="--c:' + c.color + '"' + (f.mine ? ' data-id="' + f.id + '"' : '') + '>' +
        '<div class="fc-head"><h3>' + highlight(U.esc(f.t)) + '</h3>' +
        (q ? '<span class="fc-cat">' + c.name + '</span>' : '') +
        '<button class="star' + (isFav(f) ? ' on' : '') + '" data-key="' + U.esc(favKey(f)) + '" title="Favori">' + (isFav(f) ? '★' : '☆') + '</button></div>' +
        '<ul>' + f.l.map((x) => '<li>' + highlight(x) + '</li>').join('') + '</ul></div>';
    }).join('') + '</div>';
  }

  // ---------------- Periyodik tablo ----------------
  function ptableHtml() {
    let cells = '';
    ELEMENTS.forEach((e) => {
      const color = PERIODIC_CATS[e.cat].color;
      // 1. satır grup başlıkları; 9. satır (ızgarada 10) f-blok öncesi boşluk
      cells += '<button class="el' + (e.z === selEl ? ' sel' : '') + (catFilter && catFilter !== e.cat ? ' dim' : '') + '" data-z="' + e.z + '" style="grid-row:' + (e.row + 1) + ';grid-column:' + e.col + ';--c:' + color + '" title="' + e.name + '">' +
        '<span class="z">' + e.z + '</span><span class="sym">' + e.sym + '</span><span class="nm">' + e.name + '</span></button>';
    });
    // f-blok yer tutucuları
    cells += '<div class="el ph" style="grid-row:7;grid-column:3">57–71</div><div class="el ph" style="grid-row:8;grid-column:3">89–103</div>';
    cells += '<div class="pt-gap" style="grid-row:9;grid-column:1/19"></div>';
    // grup başlıkları
    for (let g = 1; g <= 18; g++) cells += '<div class="gh" style="grid-row:1;grid-column:' + g + '">' + groupLabel(g) + '</div>';
    const legend = Object.entries(PERIODIC_CATS).map(([k, v]) => '<button class="lg' + (catFilter === k ? ' on' : '') + '" data-cat="' + k + '"><i style="background:' + v.color + '"></i>' + v.name + '</button>').join('');
    return '<div class="ptable-wrap card"><div class="ptable">' + cells + '</div>' +
      '<div class="pt-side">' + elementDetail(ELEMENTS[selEl - 1]) + '<div class="pt-legend">' + legend + '</div>' +
      '<div class="muted small">Yön tuşlarıyla gez · harf yazarak sembol ara</div></div></div>';
  }

  function elementDetail(e) {
    const c = PERIODIC_CATS[e.cat];
    return '<div class="el-detail" style="--c:' + c.color + '">' +
      '<div class="ed-sym"><span class="z">' + e.z + '</span>' + e.sym + '</div>' +
      '<div class="ed-name">' + e.name + '</div><div class="ed-cat">' + c.name + '</div>' +
      '<dl>' +
        '<dt>Atom numarası</dt><dd>' + e.z + '</dd>' +
        '<dt>Atom kütlesi</dt><dd>' + String(e.mass).replace('.', ',') + ' g/mol</dd>' +
        '<dt>Periyot / Grup</dt><dd>' + e.period + '. periyot · ' + (e.fblock ? (e.z <= 71 ? 'Lantanitler' : 'Aktinitler') + ' (3B)' : e.group + '. grup (' + groupLabel(e.group) + ')') + '</dd>' +
        '<dt>Elektron dizilimi</dt><dd class="cfg">' + e.config + '</dd>' +
        (e.full ? '<dt>Açık dizilim</dt><dd class="cfg">' + e.full + '</dd>' : '') +
      '</dl></div>';
  }

  function bindPtable(el) {
    el.querySelector('.ptable').addEventListener('click', (e) => {
      const b = e.target.closest('.el[data-z]'); if (!b) return;
      selectEl(el, Number(b.dataset.z));
    });
    el.querySelector('.ptable').addEventListener('mouseover', (e) => {
      const b = e.target.closest('.el[data-z]'); if (!b) return;
      el.querySelector('.el-detail').outerHTML = elementDetail(ELEMENTS[Number(b.dataset.z) - 1]);
    });
    el.querySelector('.ptable').addEventListener('mouseleave', () => {
      const d = el.querySelector('.el-detail'); if (d) d.outerHTML = elementDetail(ELEMENTS[selEl - 1]);
    });
    el.querySelector('.pt-legend').addEventListener('click', (e) => {
      const b = e.target.closest('.lg'); if (!b) return;
      catFilter = catFilter === b.dataset.cat ? null : b.dataset.cat;
      App.render();
    });
  }
  function selectEl(el, z) {
    selEl = z;
    el.querySelectorAll('.el.sel').forEach((x) => x.classList.remove('sel'));
    const b = el.querySelector('.el[data-z="' + z + '"]'); if (b) b.classList.add('sel');
    const d = el.querySelector('.el-detail'); if (d) d.outerHTML = elementDetail(ELEMENTS[z - 1]);
  }

  // ---------------- Notlarım ----------------
  function mineHtml() {
    const list = S.state.notes.filter((n) => !favOnly || S.state.favs.includes((n.c || 'mine') + '|' + n.t));
    const cards = list.map((n) => {
      const c = NOTE_CATEGORIES.find((x) => x.id === n.c) || NOTE_CATEGORIES[NOTE_CATEGORIES.length - 1];
      return '<div class="fcard mine-card" data-id="' + n.id + '" style="--c:' + c.color + '"><div class="fc-head"><h3>' + U.esc(n.t) + '</h3><span class="fc-cat">' + c.name + '</span>' +
        '<button class="icon-btn small" data-act="edit" title="Düzenle">✎</button></div><div class="mine-body">' + U.esc(n.body || '').replace(/\n/g, '<br>') + '</div></div>';
    }).join('');
    return '<div class="mine-top"><button class="btn primary" data-act="newnote">+ Not ekle</button><span class="muted">Kendi formüllerini, hatalarını ve ezberlerini buraya yaz. Arama tüm notlarında da çalışır.</span></div>' +
      (cards ? '<div class="fcards">' + cards + '</div>' : '<div class="empty big">Henüz not yok.</div>');
  }
  function bindMine(el) {
    el.querySelector('[data-act=newnote]').onclick = () => editNote(null);
    el.querySelectorAll('.mine-card').forEach((c) => {
      c.addEventListener('dblclick', () => editNote(c.dataset.id));
      const b = c.querySelector('[data-act=edit]'); if (b) b.onclick = () => editNote(c.dataset.id);
    });
  }
  function mineMenu(e, id) {
    UI.menu(e.clientX, e.clientY, [
      { icon: '✎', label: 'Düzenle…', action: () => editNote(id) },
      { icon: '✕', label: 'Sil', danger: true, action: () => delNote(id) }
    ]);
  }
  function editNote(id) {
    const n = id ? S.state.notes.find((x) => x.id === id) : null;
    const opts = NOTE_CATEGORIES.filter((c) => c.id !== 'ptable').map((c) => '<option value="' + c.id + '"' + ((n ? n.c : 'mine') === c.id ? ' selected' : '') + '>' + c.name + '</option>').join('');
    UI.modal({
      title: n ? 'Notu düzenle' : 'Yeni not', width: '520px',
      body: '<div class="row3"><label class="grow">Başlık<input name="t" value="' + U.esc(n ? n.t : '') + '"></label><label>Bölüm<select name="c">' + opts + '</select></label></div>' +
        '<label>İçerik<textarea name="b" rows="9" placeholder="Her satır ayrı bir madde olarak görünür.">' + U.esc(n ? n.body : '') + '</textarea></label>',
      buttons: [
        n ? { label: 'Sil', kind: 'ghost danger', action: () => { delNote(n.id); } } : null,
        { label: 'Vazgeç', kind: 'ghost' },
        { label: 'Kaydet', kind: 'primary', action: (el) => {
          const t = el.querySelector('[name=t]').value.trim();
          if (!t) { UI.toast('Başlık boş olamaz', 'error'); return false; }
          const rec = { t, c: el.querySelector('[name=c]').value, body: el.querySelector('[name=b]').value };
          S.commit(n ? 'Not düzenlendi' : 'Not eklendi', (s) => {
            if (n) Object.assign(s.notes.find((x) => x.id === n.id), rec); else s.notes.push(Object.assign({ id: U.uid('n') }, rec));
          });
        } }
      ].filter(Boolean)
    });
  }
  async function delNote(id) {
    if (S.settings.confirmDelete && !(await UI.confirm('Not silinsin mi?', { danger: true, okLabel: 'Sil' }))) return;
    S.commit('Not silindi', (s) => { s.notes = s.notes.filter((x) => x.id !== id); });
  }

  // ---------------- Klavye ----------------
  let typeBuf = '', typeTimer = null;
  function onKey(e) {
    const el = document.getElementById('view');
    if (cat === 'ptable' && !query) {
      const cur = ELEMENTS[selEl - 1];
      const move = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
      if (move) {
        let r = cur.row + move[0], c = cur.col + move[1];
        for (let i = 0; i < 18; i++) {
          const hit = ELEMENTS.find((x) => x.row === r && x.col === c);
          if (hit) { selectEl(el, hit.z); return true; }
          r += move[0]; c += move[1];
          if (r < 1 || r > 10 || c < 1 || c > 18) break;
        }
        return true;
      }
      if (/^[a-zA-Z]$/.test(e.key) && !e.ctrlKey && !e.altKey) {
        typeBuf += e.key.toLowerCase();
        clearTimeout(typeTimer); typeTimer = setTimeout(() => { typeBuf = ''; }, 700);
        const hit = ELEMENTS.find((x) => x.sym.toLowerCase() === typeBuf) || ELEMENTS.find((x) => x.sym.toLowerCase().startsWith(typeBuf));
        if (hit) selectEl(el, hit.z);
        return true;
      }
    }
    if (e.key === '/' ) { focusSearch(); return true; }
    return false;
  }
  function focusSearch() { const s = document.querySelector('.notes-search'); if (s) { s.focus(); s.select(); } }

  return { render, onKey, focusSearch };
})();
