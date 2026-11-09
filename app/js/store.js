/*
 * Uygulama durumu, kalıcı kayıt (localStorage), geri al / yinele ve türetilmiş hesaplar.
 * Tüm veri yalnızca bu bilgisayarda tutulur.
 */
window.S = (function () {
  const STORAGE_KEY = 'yksPlanlayici.v1';
  const BACKUP_KEY = 'yksPlanlayici.v1.gunluk-yedek';
  const UNDO_LIMIT = 150;

  const DEFAULT_SETTINGS = {
    yksDate: '2027-06-19T10:15',
    showSeconds: true,
    tsMultiplier: 2,
    thGreen: 8, thLime: 6, thOrange: 4, thRed: 1,
    restWeekHours: 40,
    dayStart: 7, dayEnd: 26,           // 07:00 – 02:00 (ertesi gün)
    snap: 15,
    defaultBlock: 60,
    hourHeight: 52,
    sounds: true, volume: 0.35,
    confirmDelete: true,
    accent: '#7c9cff',
    uiScale: 100,
    reduceMotion: false,
    showQuote: true,
    startView: 'calendar',
    sidebarCollapsed: false,
    panelWidth: 320,
    lastBackup: null
  };

  function blank() {
    return {
      version: 1,
      settings: Object.assign({}, DEFAULT_SETTINGS),
      blocks: [],          // {id, date, start, dur, topic?, gen?, label?, note?}
      days: {},            // date -> {ok: true, at: iso}
      topics: {},          // topicId -> {fin?: iso, rev?: [iso], tsMin?: number, sona?: bool, hidden?: bool}
      customTopics: [],    // {id, s, n, ts}
      exams: [],           // {id, date, type, name, nets:{}, total, note}
      notes: [],           // {id, c, t, body}
      favs: [],            // hap bilgi favorileri (kart başlıkları)
      createdAt: new Date().toISOString()
    };
  }

  let state = load();
  let undoStack = [], redoStack = [];
  let rev = 0;               // her değişiklikte artar (önbellek için)
  const listeners = new Set();
  let storageOk = true;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return blank();
      return migrate(JSON.parse(raw));
    } catch (e) {
      console.warn('Kayıt okunamadı', e);
      return blank();
    }
  }

  function migrate(s) {
    const b = blank();
    const out = Object.assign(b, s);
    out.settings = Object.assign({}, DEFAULT_SETTINGS, s.settings || {});
    ['blocks', 'customTopics', 'exams', 'notes', 'favs'].forEach((k) => { if (!Array.isArray(out[k])) out[k] = []; });
    ['days', 'topics'].forEach((k) => { if (!out[k] || typeof out[k] !== 'object') out[k] = {}; });
    return out;
  }

  const persist = U.debounce(function () {
    try {
      const json = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, json);
      // Günde bir kez önceki günün kopyasını sakla (yanlışlıkla silmeye karşı)
      const today = U.todayKey();
      const meta = localStorage.getItem(BACKUP_KEY + '.tarih');
      if (meta !== today) {
        localStorage.setItem(BACKUP_KEY, json);
        localStorage.setItem(BACKUP_KEY + '.tarih', today);
      }
      storageOk = true;
    } catch (e) {
      storageOk = false;
      console.error('Kaydedilemedi', e);
      if (window.UI) UI.toast('Veriler kaydedilemedi! Ayarlar > Veri bölümünden yedek alın.', 'error');
    }
  }, 250);

  function emit() { rev++; listeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } }); }

  function snapshot() { return JSON.stringify(state); }

  function pushUndo(snap, label) {
    undoStack.push({ snap, label });
    if (undoStack.length > UNDO_LIMIT) undoStack.shift();
    redoStack = [];
  }

  /** Geri alınabilir değişiklik */
  function commit(label, fn) {
    const snap = snapshot();
    const r = fn(state);
    if (snapshot() === snap) return r;
    pushUndo(snap, label);
    persist();
    emit();
    return r;
  }

  /** Geri alma kaydı oluşturmadan değişiklik (ayar kaydırıcısı vb.) */
  function silent(fn) { fn(state); persist(); emit(); }

  /** Sürükleme gibi çok adımlı işlemler */
  function beginGesture() { return snapshot(); }
  function endGesture(snap, label) {
    if (snapshot() === snap) return false;
    pushUndo(snap, label);
    persist();
    emit();
    return true;
  }

  function undo() {
    const item = undoStack.pop();
    if (!item) return null;
    redoStack.push({ snap: snapshot(), label: item.label });
    state = migrate(JSON.parse(item.snap));
    persist(); emit();
    return item.label;
  }
  function redo() {
    const item = redoStack.pop();
    if (!item) return null;
    undoStack.push({ snap: snapshot(), label: item.label });
    state = migrate(JSON.parse(item.snap));
    persist(); emit();
    return item.label;
  }

  function replaceAll(newState, label) {
    const snap = snapshot();
    state = migrate(newState);
    pushUndo(snap, label || 'Veri yükleme');
    persist(); emit();
  }

  // ------------------------------------------------------------------
  // Türetilmiş veriler
  // ------------------------------------------------------------------
  const SUBJ = {};
  SUBJECTS.forEach((s) => { SUBJ[s.id] = s; });
  const GEN = {};
  GENERIC_BLOCKS.forEach((g) => { GEN[g.id] = g; });

  let cache = { rev: -1 };
  function derived() {
    if (cache.rev === rev) return cache;
    const c = { rev };
    // Konular
    const all = TOPICS.concat(state.customTopics.map((t) => Object.assign({ custom: true }, t)));
    c.topics = all.filter((t) => SUBJ[t.s]);
    c.topicById = {};
    c.topics.forEach((t) => { c.topicById[t.id] = t; });

    // Çalışılan süre: yalnızca onaylanmış günlerdeki bloklar
    c.studied = {};
    c.dayMin = {};
    c.dayApprovedMin = {};
    c.blocksByDate = {};
    state.blocks.forEach((b) => {
      (c.blocksByDate[b.date] = c.blocksByDate[b.date] || []).push(b);
      c.dayMin[b.date] = (c.dayMin[b.date] || 0) + b.dur;
      if (state.days[b.date] && state.days[b.date].ok) {
        c.dayApprovedMin[b.date] = (c.dayApprovedMin[b.date] || 0) + b.dur;
        if (b.topic) c.studied[b.topic] = (c.studied[b.topic] || 0) + b.dur;
      }
    });
    Object.values(c.blocksByDate).forEach((arr) => arr.sort((a, b) => a.start - b.start));

    // Bitirilecekler sıralaması: her ders kolu (TYT + AYT ardışık) içinde konunun göreli konumu
    const tracks = {};
    c.topics.forEach((t) => {
      const tr = SUBJ[t.s].track;
      (tracks[tr] = tracks[tr] || []).push(t);
    });
    const trackOrder = ['mat', 'geo', 'fiz', 'kim', 'bio', 'tr', 'sos'];
    c.rank = {};
    Object.keys(tracks).forEach((tr) => {
      const list = tracks[tr].slice().sort((a, b) => (SUBJ[a.s].exam === SUBJ[b.s].exam ? 0 : SUBJ[a.s].exam === 'TYT' ? -1 : 1));
      list.forEach((t, i) => { c.rank[t.id] = (i + 0.5) / list.length + trackOrder.indexOf(tr) * 0.0001; });
    });
    c.ordered = c.topics.slice().sort((a, b) => c.rank[a.id] - c.rank[b.id]);
    cache = c;
    return c;
  }

  function subject(id) { return SUBJ[id]; }
  function generic(id) { return GEN[id]; }
  function topic(id) { return derived().topicById[id]; }
  function topics() { return derived().topics; }
  function topicState(id) { return state.topics[id] || {}; }
  function topicTs(id) {
    const t = topic(id); if (!t) return 0;
    const st = topicState(id);
    if (typeof st.tsMin === 'number') return st.tsMin;
    if (typeof t.ts === 'number') return t.ts;
    return Math.round((t.v || 0) * (Number(state.settings.tsMultiplier) || 2));
  }
  function topicStudied(id) { return derived().studied[id] || 0; }
  function topicRemaining(id) { return Math.max(0, topicTs(id) - topicStudied(id)); }
  function isFinished(id) { return !!topicState(id).fin; }
  function isHidden(id) { return !!topicState(id).hidden; }
  function isDeferred(id) {
    const st = topicState(id), t = topic(id);
    if (typeof st.sona === 'boolean') return st.sona;
    return !!(t && (t.sona || t.sozel));
  }
  function topicProgress(id) {
    if (isFinished(id)) return 1;
    const ts = topicTs(id);
    return ts ? Math.min(1, topicStudied(id) / ts) : 0;
  }
  function orderedTopics() { return derived().ordered; }

  function blockColor(b) {
    if (b.topic) { const t = topic(b.topic); return t ? SUBJ[t.s].color : '#888'; }
    if (b.gen) { const g = GEN[b.gen]; return g ? g.color : '#888'; }
    return b.color || '#8a93a6';
  }
  function blockTitle(b) {
    if (b.topic) { const t = topic(b.topic); return t ? t.n : 'Silinmiş konu'; }
    if (b.gen) { const g = GEN[b.gen]; return g ? g.n : 'Blok'; }
    return b.label || 'Çalışma';
  }
  function blockSub(b) {
    if (b.topic) { const t = topic(b.topic); if (!t) return ''; const s = SUBJ[t.s]; return s.exam + ' ' + s.short; }
    if (b.gen) return 'Genel';
    return '';
  }

  function blocksOn(date) { return derived().blocksByDate[date] || []; }
  function dayMinutes(date) { return derived().dayMin[date] || 0; }
  function dayApprovedMinutes(date) { return derived().dayApprovedMin[date] || 0; }
  function isApproved(date) { return !!(state.days[date] && state.days[date].ok); }

  /** Haftadaki diğer günlerin onaylı toplamı (dakika) */
  function weekOthersApproved(date) {
    return U.weekDays(date).filter((d) => d !== date).reduce((a, d) => a + dayApprovedMinutes(d), 0);
  }
  function weekMinutes(date, approvedOnly) {
    return U.weekDays(date).reduce((a, d) => a + (approvedOnly ? dayApprovedMinutes(d) : dayMinutes(d)), 0);
  }

  /**
   * Gün durumu:
   *  none    – blok yok, onay yok
   *  planned – plan var, henüz onaylanmadı
   *  green ≥ 8s, lime ≥ 6s, orange ≥ 4s, low (1–4s), red ≤ 1s
   *  rest    – kırmızı/az gün, ama haftanın diğer günleri toplamı 40 saati geçmiş (mola günü)
   */
  function dayStatus(date) {
    const st = state.settings;
    if (!isApproved(date)) return dayMinutes(date) > 0 ? 'planned' : 'none';
    const h = dayApprovedMinutes(date) / 60;
    if (h >= st.thGreen) return 'green';
    if (h >= st.thLime) return 'lime';
    if (h >= st.thOrange) return 'orange';
    if (weekOthersApproved(date) / 60 > st.restWeekHours) return 'rest';
    if (h <= st.thRed) return 'red';
    return 'low';
  }

  const STATUS_INFO = {
    none: { label: 'Boş', color: null },
    planned: { label: 'Planlandı', color: '#5b6478' },
    green: { label: '8+ saat', color: '#34c77b' },
    lime: { label: '6+ saat', color: '#a9c93c' },
    orange: { label: '4+ saat', color: '#f29a3a' },
    low: { label: '1–4 saat', color: '#ea6b3d' },
    red: { label: '1 saat veya az', color: '#e5484d' },
    rest: { label: 'Mola günü', color: '#4b8dff' }
  };
  function statusInfo(code) {
    const s = state.settings;
    const info = Object.assign({}, STATUS_INFO[code]);
    if (code === 'green') info.label = s.thGreen + '+ saat';
    if (code === 'lime') info.label = s.thLime + '+ saat';
    if (code === 'orange') info.label = s.thOrange + '+ saat';
    if (code === 'low') info.label = s.thRed + '–' + s.thOrange + ' saat';
    if (code === 'red') info.label = s.thRed + ' saat veya az';
    return info;
  }

  /** Arka arkaya en az "turuncu" seviyesinde onaylanmış gün sayısı (bugün dahil/hariç) */
  function streak() {
    let d = U.todayKey(), n = 0;
    const good = (k) => ['green', 'lime', 'orange', 'rest'].includes(dayStatus(k));
    if (!good(d)) d = U.addDays(d, -1);
    while (good(d) && n < 3650) { n++; d = U.addDays(d, -1); }
    return n;
  }

  function totalStudied() {
    return Object.values(derived().dayApprovedMin).reduce((a, b) => a + b, 0);
  }

  function subjectStats(sid) {
    const list = topics().filter((t) => t.s === sid && !isHidden(t.id));
    let ts = 0, done = 0, studied = 0, fin = 0;
    list.forEach((t) => {
      const x = topicTs(t.id); ts += x;
      const s = topicStudied(t.id); studied += s;
      if (isFinished(t.id)) { done += x; fin++; } else done += Math.min(x, s);
    });
    return { count: list.length, finished: fin, ts, done, studied, pct: ts ? done / ts : 0, remaining: Math.max(0, ts - done) };
  }

  return {
    get state() { return state; },
    get settings() { return state.settings; },
    get rev() { return rev; },
    get storageOk() { return storageOk; },
    DEFAULT_SETTINGS, blank,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    commit, silent, beginGesture, endGesture, undo, redo, replaceAll,
    canUndo: () => undoStack.length > 0, canRedo: () => redoStack.length > 0,
    undoLabel: () => (undoStack.length ? undoStack[undoStack.length - 1].label : ''),
    redoLabel: () => (redoStack.length ? redoStack[redoStack.length - 1].label : ''),
    saveNow() { persist(); },
    restoreDailyBackup() {
      const raw = localStorage.getItem(BACKUP_KEY);
      if (!raw) return false;
      replaceAll(JSON.parse(raw), 'Günlük yedeğe dönüş');
      return true;
    },
    dailyBackupDate() { return localStorage.getItem(BACKUP_KEY + '.tarih'); },
    subject, generic, topic, topics, topicState, topicTs, topicStudied, topicRemaining, topicProgress,
    isFinished, isHidden, isDeferred, orderedTopics,
    blockColor, blockTitle, blockSub, blocksOn, dayMinutes, dayApprovedMinutes, isApproved,
    weekMinutes, weekOthersApproved, dayStatus, statusInfo, streak, totalStudied, subjectStats
  };
})();
