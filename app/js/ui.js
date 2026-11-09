/* Ortak arayüz parçaları: pencere (modal), onay, bildirim, sağ tık menüsü, ses */
window.UI = (function () {
  const modalRoot = () => document.getElementById('modalRoot');
  const stack = [];

  // ---------------- Ses (yalnızca yumuşak tıklama efektleri) ----------------
  let ctx = null;
  function sound(kind) {
    const st = S.settings;
    if (!st.sounds) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const vol = Math.max(0, Math.min(1, Number(st.volume) || 0)) * 0.18;
      const tone = (freq, start, dur, type) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, now + start);
        g.gain.setValueAtTime(0.0001, now + start);
        g.gain.exponentialRampToValueAtTime(vol, now + start + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        o.connect(g); g.connect(ctx.destination);
        o.start(now + start); o.stop(now + start + dur + 0.02);
      };
      if (kind === 'ok') { tone(660, 0, 0.09); tone(990, 0.07, 0.12); }
      else if (kind === 'drop') { tone(420, 0, 0.06, 'triangle'); }
      else if (kind === 'del') { tone(300, 0, 0.07, 'triangle'); }
      else { tone(1250, 0, 0.035, 'triangle'); }
    } catch (e) { /* ses desteklenmiyorsa sessiz geç */ }
  }

  // ---------------- Bildirim ----------------
  function toast(msg, kind, opts) {
    const root = document.getElementById('toasts');
    const el = U.h('<div class="toast ' + (kind || '') + '"><span class="toast-msg"></span></div>');
    el.querySelector('.toast-msg').textContent = msg;
    if (opts && opts.action) {
      const b = U.h('<button class="toast-btn"></button>');
      b.textContent = opts.action.label;
      b.onclick = () => { opts.action.fn(); el.remove(); };
      el.appendChild(b);
    }
    root.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    const life = (opts && opts.life) || (kind === 'error' ? 6000 : 2600);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 250); }, life);
    while (root.children.length > 4) root.firstChild.remove();
  }

  // ---------------- Modal ----------------
  function modal(o) {
    const el = U.h(
      '<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><h2></h2><button class="icon-btn modal-x" title="Kapat (Esc)">✕</button></div>' +
      '<div class="modal-body"></div><div class="modal-foot"></div></div></div>'
    );
    const box = el.querySelector('.modal');
    if (o.width) box.style.width = o.width;
    el.querySelector('h2').textContent = o.title || '';
    const body = el.querySelector('.modal-body');
    if (typeof o.body === 'string') body.innerHTML = o.body; else if (o.body) body.appendChild(o.body);
    const foot = el.querySelector('.modal-foot');
    const entry = { el, close, onEnter: null, o };

    function close(result) {
      const i = stack.indexOf(entry);
      if (i >= 0) stack.splice(i, 1);
      el.classList.remove('show');
      setTimeout(() => el.remove(), 150);
      if (o.onClose) o.onClose(result);
    }

    (o.buttons || [{ label: 'Kapat', kind: 'primary' }]).forEach((bt) => {
      const b = U.h('<button class="btn ' + (bt.kind || '') + '"></button>');
      b.textContent = bt.label;
      b.onclick = () => {
        if (bt.action) { const r = bt.action(body); if (r === false) return; }
        close(bt.value);
      };
      foot.appendChild(b);
      if (bt.kind && bt.kind.includes('primary')) entry.onEnter = () => b.click();
    });
    if (!o.buttons || !o.buttons.length) foot.remove();

    el.querySelector('.modal-x').onclick = () => close();
    el.addEventListener('mousedown', (e) => { if (e.target === el) entry.downOnBackdrop = true; });
    el.addEventListener('mouseup', (e) => { if (e.target === el && entry.downOnBackdrop) close(); entry.downOnBackdrop = false; });

    modalRoot().appendChild(el);
    stack.push(entry);
    requestAnimationFrame(() => el.classList.add('show'));
    if (o.onOpen) o.onOpen(body, close);
    const first = body.querySelector('[autofocus], input:not([type=checkbox]):not([type=color]), textarea, select');
    if (first) setTimeout(() => { first.focus(); if (first.select && first.type !== 'date') try { first.select(); } catch (e) {} }, 30);
    return { close, body, el };
  }

  function confirm(message, opts) {
    opts = opts || {};
    return new Promise((resolve) => {
      let done = false;
      modal({
        title: opts.title || 'Emin misin?',
        body: '<p class="confirm-msg">' + U.esc(message) + '</p>',
        width: '420px',
        buttons: [
          { label: opts.cancelLabel || 'Vazgeç', kind: 'ghost', value: false },
          { label: opts.okLabel || 'Evet', kind: 'primary' + (opts.danger ? ' danger' : ''), value: true }
        ],
        onClose: (v) => { if (!done) { done = true; resolve(!!v); } }
      });
    });
  }

  function hasModal() { return stack.length > 0; }
  function closeTopModal() { const m = stack[stack.length - 1]; if (m) { m.close(); return true; } return false; }
  function modalEnter(e) {
    const m = stack[stack.length - 1];
    if (!m || !m.onEnter) return false;
    if (e.target && e.target.tagName === 'TEXTAREA') return false;
    m.onEnter();
    return true;
  }

  // ---------------- Sağ tık menüsü ----------------
  const menuEl = () => document.getElementById('ctxMenu');
  function menu(x, y, items) {
    const m = menuEl();
    m.innerHTML = '';
    items.filter(Boolean).forEach((it) => {
      if (it.sep) { m.appendChild(U.h('<div class="ctx-sep"></div>')); return; }
      if (it.header) { const hd = U.h('<div class="ctx-header"></div>'); hd.textContent = it.header; m.appendChild(hd); return; }
      const b = U.h('<button class="ctx-item' + (it.danger ? ' danger' : '') + '"><span class="ctx-ico"></span><span class="ctx-lbl"></span><span class="ctx-key"></span></button>');
      b.querySelector('.ctx-ico').textContent = it.icon || '';
      b.querySelector('.ctx-lbl').textContent = it.label;
      b.querySelector('.ctx-key').textContent = it.key || '';
      if (it.disabled) b.disabled = true;
      b.onclick = (e) => { e.stopPropagation(); hideMenu(); sound(); it.action && it.action(); };
      m.appendChild(b);
    });
    m.classList.remove('hidden');
    const r = m.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    m.style.left = Math.min(x, vw - r.width - 8) + 'px';
    m.style.top = Math.min(y, vh - r.height - 8) + 'px';
  }
  function hideMenu() { menuEl().classList.add('hidden'); }
  function menuOpen() { return !menuEl().classList.contains('hidden'); }

  document.addEventListener('mousedown', (e) => { if (menuOpen() && !menuEl().contains(e.target)) hideMenu(); }, true);
  window.addEventListener('blur', hideMenu);
  window.addEventListener('resize', hideMenu);

  /** Yüzde çubuğu */
  function progress(pct, color, opts) {
    const p = Math.round(U.clamp(pct, 0, 1) * 100);
    return '<div class="progress' + (opts && opts.big ? ' big' : '') + '"><div class="progress-fill" style="width:' + p + '%;' + (color ? 'background:' + color : '') + '"></div></div>';
  }

  return { sound, toast, modal, confirm, hasModal, closeTopModal, modalEnter, menu, hideMenu, menuOpen, progress };
})();
