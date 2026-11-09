/* Genel yardımcı fonksiyonlar */
window.U = (function () {
  const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const MONTHS_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const DAYS_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const pad = (n) => String(n).padStart(2, '0');

  /** Date -> 'YYYY-MM-DD' (yerel saat) */
  function key(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  /** 'YYYY-MM-DD' -> Date (yerel, öğlen 12:00 — yaz saati sorunlarını önler) */
  function parse(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d, 12); }
  function addDays(k, n) { const d = parse(k); d.setDate(d.getDate() + n); return key(d); }
  /** Pazartesi=0 … Pazar=6 */
  function dow(k) { return (parse(k).getDay() + 6) % 7; }
  function weekStart(k) { return addDays(k, -dow(k)); }
  function weekDays(k) { const s = weekStart(k); return [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(s, i)); }

  /** 07:00 → 02:00 gibi gece yarısını aşan program için "plan günü". */
  function todayKey() {
    const now = new Date();
    return key(now);
  }

  function fmtDateLong(k) { const d = parse(k); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ', ' + DAYS[dow(k)]; }
  function fmtDateShort(k) { const d = parse(k); return d.getDate() + ' ' + MONTHS_SHORT[d.getMonth()]; }
  function fmtDateNum(k) { const d = parse(k); return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear(); }

  /** dakika -> "3s 20dk" */
  function fmtMin(m, opts) {
    m = Math.round(m || 0);
    const neg = m < 0; m = Math.abs(m);
    const h = Math.floor(m / 60), r = m % 60;
    let s;
    if (h && r) s = h + 's ' + r + 'dk';
    else if (h) s = h + ' saat';
    else s = r + ' dk';
    if (opts && opts.compact) s = h ? (r ? h + 's' + pad(r) : h + 's') : r + 'dk';
    return (neg ? '−' : '') + s;
  }
  function fmtHours(m) { const h = (m || 0) / 60; return (Math.round(h * 10) / 10).toString().replace('.', ',') + ' s'; }

  /** Program saatini (gün başlangıcından itibaren dakika) "HH:MM" yap */
  function fmtClock(absMin) {
    const t = ((absMin % 1440) + 1440) % 1440;
    return pad(Math.floor(t / 60)) + ':' + pad(t % 60);
  }

  function uid(prefix) { return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function norm(s) {
    return String(s || '').toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u');
  }

  /** hex rengi karartır/açar: amt -1..1 */
  function shade(hex, amt) {
    const c = hex.replace('#', '');
    let r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  }
  function rgba(hex, a) {
    const c = hex.replace('#', '');
    return 'rgba(' + parseInt(c.slice(0, 2), 16) + ',' + parseInt(c.slice(2, 4), 16) + ',' + parseInt(c.slice(4, 6), 16) + ',' + a + ')';
  }

  function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }

  function debounce(fn, ms) { let t; return function () { clearTimeout(t); const a = arguments; t = setTimeout(() => fn.apply(this, a), ms); }; }

  function download(filename, text, type) {
    const blob = new Blob([text], { type: type || 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function isTyping(e) {
    const t = e.target;
    if (!t) return false;
    const tag = t.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
  }

  return { MONTHS, MONTHS_SHORT, DAYS, DAYS_SHORT, pad, key, parse, addDays, dow, weekStart, weekDays, todayKey, fmtDateLong, fmtDateShort, fmtDateNum, fmtMin, fmtHours, fmtClock, uid, esc, clamp, norm, shade, rgba, h, debounce, download, isTyping };
})();
