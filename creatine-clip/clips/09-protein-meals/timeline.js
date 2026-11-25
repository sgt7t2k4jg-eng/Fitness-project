// Clip 09 — split the daily protein into 4 meals. Under 6s.
(function (root) {
  const KIT = typeof module !== 'undefined' && module.exports ? require('../../shared/kit.js') : root.KIT;
  // Caption text (written from the user's brief).
  const LINES = [
    '#a هاد الرقم هو لي خاصك فالنهار.|',
    '#b قسمو على 4 وجبات:|',
    '#c 30g فكل وجبة.',
  ];
  const START = 0.25, LAST = 5.35;
  const keys = {};
  const GROUPS = LINES.map((l, i) => { const m = l.match(/^#(\S+)\s+(.*)$/); keys[m[1]] = i; return m[2]; });
  const probe = KIT.buildTimeline(GROUPS, { unit: 0.06, start: START, tail: 0 });
  const unit = (0.06 * (LAST - START)) / (probe.words[probe.words.length - 1].end - START);
  const T = KIT.buildTimeline(GROUPS, { unit, start: START, tail: 0.5 });
  const S = (key, wi = 0) => T.words[T.groups[keys[key]].words[wi]].start;
  const c = {
    total: 0.1, day: S('a', 5), split: S('b'), div: S('b', 1),
    meals: [0, 1, 2, 3].map((i) => +(S('b', 2) + i * 0.16).toFixed(3)), each: S('c'), end: T.words[T.words.length - 1].end,
  };
  const pop = (at, p = 1, gain = 0.6) => ({ type: 'pop', at, p, gain });
  const sfx = [
    pop(c.total, 1.0, 0.75), { type: 'ding', at: c.day, gain: 0.25, p: 1568.0 },
    { type: 'whoosh', at: c.split - 0.1, gain: 0.45, dur: 0.3 }, pop(c.div, 1.3, 0.6),
    ...c.meals.map((at, i) => pop(at, 1.0 + i * 0.12, 0.6)),
    ...[0, 1, 2, 3].map((i) => ({ type: 'rep', at: c.each + i * 0.08, gain: 0.35, p: i * 3 })),
    { type: 'ding', at: c.each + 0.35, gain: 0.4, p: 2093.0 },
  ];
  const TL = { FPS: T.FPS, DURATION: Math.min(T.DURATION, 5.9), OUT: 'protein-4-meals.mp4', words: T.words, groups: T.groups, cues: c, sfx };
  if (typeof module !== 'undefined' && module.exports) module.exports = TL;
  else root.TL = TL;
})(typeof window !== 'undefined' ? window : globalThis);
