// Shared helpers for clips: word-timing builder (node + browser) and animation utilities (browser).
(function (root) {
  const K = {};

  // GROUPS: caption lines of the exact script. Each "|" after a line adds a short pause.
  // Word durations are estimated from word length (unit = seconds per letter-ish unit).
  K.buildTimeline = function (GROUPS, opts = {}) {
    const { fps = 30, start = 0.1, unit = 0.047, tail = 0.35 } = opts;
    const clean = (w) => w.replace(/[:،,.]+$/, '');
    const weight = (w) => (/^\d+$/.test(w) ? 5.5 : w.replace(/[ً-ْ]/g, '').length + 1.5);
    const words = [];
    const groups = [];
    let cursor = 0;
    GROUPS.forEach((g, gi) => {
      const pause = (g.match(/\|/g) || []).length * 1.3;
      const idx = [];
      g.replace(/\|/g, '').trim().split(/\s+/).forEach((raw) => {
        const text = clean(raw);
        const w = weight(text);
        idx.push(words.length);
        words.push({ text, group: gi, start: +(start + cursor * unit).toFixed(3), end: +(start + (cursor + w) * unit).toFixed(3) });
        cursor += w;
      });
      cursor += pause;
      groups.push({ words: idx });
    });
    const DURATION = Math.ceil((words[words.length - 1].end + tail) * fps) / fps;
    groups.forEach((g, i) => {
      g.start = words[g.words[0]].start;
      g.end = i + 1 < groups.length ? words[groups[i + 1].words[0]].start : DURATION + 1;
    });
    // idx('كلمة', n) -> index of the n-th occurrence of a word
    const idx = (text, n = 0) => {
      const hits = words.map((w, i) => (w.text === text ? i : -1)).filter((i) => i >= 0);
      if (hits[n] === undefined) throw new Error(`word not found: ${text} #${n}`);
      return hits[n];
    };
    return { FPS: fps, DURATION, words, groups, s: (t, n) => words[idx(t, n)].start, e: (t, n) => words[idx(t, n)].end };
  };

  // ---- animation utilities ----
  K.clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  K.prog = (t, t0, d) => K.clamp((t - t0) / d);
  K.lerp = (a, b, p) => a + (b - a) * p;
  K.easeOut = (p) => 1 - Math.pow(1 - p, 3);
  K.easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  K.back = (p) => { const c = 2.2; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  // Sticker scale: pops in at tIn (overshoot), shrinks out at tOut.
  K.popScale = (t, tIn, tOut = 1e9) => {
    if (t < tIn) return 0;
    if (t >= tOut) return 1 - K.easeOut(K.prog(t, tOut, 0.16));
    return K.back(K.prog(t, tIn, 0.3));
  };
  K.sticker = (el, sc, rot = 0, extra = '') => {
    el.style.transform = `${extra} scale(${Math.max(0, sc).toFixed(4)}) rotate(${rot}deg)`;
    el.style.opacity = sc > 0.01 ? 1 : 0;
  };
  K.rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  // Word-by-word captions: returns update(t).
  K.captions = function (capEl, TL) {
    const { words, groups } = TL;
    const els = words.map((w) => { const s = document.createElement('span'); s.textContent = w.text; return s; });
    let shown = -1;
    return function (t) {
      let gi = groups.findIndex((g) => t >= g.start && t < g.end);
      if (gi < 0) gi = 0;
      // clear the caption during long pauses (e.g. between sections)
      const last = words[groups[gi].words[groups[gi].words.length - 1]];
      capEl.style.opacity = gi < groups.length - 1 && t >= last.end + 0.25 ? 0 : 1;
      if (gi !== shown) { capEl.replaceChildren(...groups[gi].words.map((i) => els[i])); shown = gi; }
      groups[gi].words.forEach((i) => {
        const w = words[i], el = els[i];
        if (t < w.start) { el.style.opacity = 0; return; }
        const p = K.prog(t, w.start, 0.12);
        el.style.opacity = 1;
        el.style.color = t < w.end + 0.02 ? '#c6ff3d' : '#fff';
        el.style.transform = `translateY(${(1 - K.easeOut(p)) * 26}px) scale(${K.lerp(0.7, 1, K.back(p)).toFixed(4)})`;
      });
    };
  };

  // Live preview when a clip page is opened directly (add ?t=3.2 to freeze a frame).
  K.boot = function (setTime, DURATION) {
    window.setTime = setTime;
    window.ready = document.fonts.ready.then(() => { setTime(0); return true; });
    const q = new URLSearchParams(location.search);
    if (q.has('t')) window.ready.then(() => setTime(+q.get('t')));
    else if (!navigator.webdriver) {
      const t0 = performance.now();
      (function loop() { setTime(((performance.now() - t0) / 1000) % (DURATION + 0.6)); requestAnimationFrame(loop); })();
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = K;
  else root.KIT = K;
})(typeof window !== 'undefined' ? window : globalThis);
