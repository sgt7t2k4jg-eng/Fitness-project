// Clip 08 — how much protein per day: gym opening, then the explanation. Under 30s.
(function (root) {
  const KIT = typeof module !== 'undefined' && module.exports ? require('../../shared/kit.js') : root.KIT;

  // Exact voiceover script, one caption line per entry ("|" = short pause).
  const LINES = [
    '#a تمرن وعضلاتك ما كيكبروش؟|||',
    '#b المشكل ممكن يكون فالماكلة.||',
    '#c ممكن البروتين لي كتدخل',
    '#c2 لجسمك قليل.||',
    '#d البروتين من أهم عناصر',
    '#d2 بناء العضلات،|',
    '#e وكاين فالبيض والدجاج',
    '#e2 واللحم والحوت',
    '#e3 والتونة والقطاني.||',
    '#f واخا شحال خاصك فالنهار؟||',
    '#g بين 1.6 و2 غرام',
    '#g2 لكل كيلو من وزنك.||',
    '#h مثلا، إلا كان وزنك 60 كيلو،|',
    '#i ضرب 60 فـ 2،',
    '#i2 كيعطيك 120 غرام فالنهار.|',
    '#j ولا ضربو فـ 1.6',
    '#j2 كيعطيك 96.',
  ];
  const START = 1.5; // the gym scene plays alone first
  const LAST = 28.9; // last word ends here -> total stays under 30s

  const keys = {};
  const GROUPS = LINES.map((l, i) => { const m = l.match(/^#(\S+)\s+(.*)$/); keys[m[1]] = i; return m[2]; });
  const probe = KIT.buildTimeline(GROUPS, { unit: 0.06, start: START, tail: 0 });
  const unit = (0.06 * (LAST - START)) / (probe.words[probe.words.length - 1].end - START);
  const T = KIT.buildTimeline(GROUPS, { unit, start: START, tail: 0.75 });
  const word = (key, wi) => {
    const g = T.groups[keys[key]].words;
    const w = T.words[g[wi < 0 ? g.length + wi : wi]];
    if (!w) throw new Error(`line ${key} has no word #${wi}`);
    return w;
  };
  const S = (key, wi = 0) => word(key, wi).start;
  const E = (key, wi = -1) => word(key, wi).end;

  const c = {
    weeks: Array.from({ length: 12 }, (_, i) => +(0.3 + i * 0.105).toFixed(3)), stamp: 1.68, sad: S('a', 1),
    sc2: S('b'), plate: S('b', 0), q: S('b', 3),
    sc3: S('c'), bar: S('c', 1), low: S('c2', 1),
    sc4: S('d'), muscle: S('d', 0), bricks: [S('d', 2), S('d', 3), S('d2', 0)], build: S('d2', 1),
    sc5: S('e'), foods: [S('e', 0), S('e', 1), S('e2', 0), S('e2', 1), S('e3', 0), S('e3', 1)],
    sc6: S('f'), think: S('f', 0), ask: S('f', 1),
    sc7: S('g'), range: S('g', 1), perKg: S('g2', 0),
    sc8: S('h'), kg: S('h', 4), row1: S('i'), res1: S('i2', 1), row2: S('j'), res2: S('j2', 1), end: E('j2'),
  };

  const pop = (at, p = 1, gain = 0.6) => ({ type: 'pop', at, p, gain });
  const whoosh = (at) => ({ type: 'whoosh', at: at - 0.1, gain: 0.4, dur: 0.3 });
  const ding = (at, p = 1568.0, gain = 0.34) => ({ type: 'ding', at, p, gain });
  const sfx = [
    { type: 'whoosh', at: 0, gain: 0.35, dur: 0.4 },
    ...c.weeks.map((at, i) => ({ type: 'tick', at, gain: 0.22, p: 1 + i * 0.04 })),
    { type: 'thud', at: c.stamp, gain: 0.6 }, { type: 'bonk', at: c.stamp + 0.02, gain: 0.4 },
    whoosh(c.sc2), pop(c.plate, 0.9), pop(c.q, 1.4, 0.6),
    whoosh(c.sc3), { type: 'fill', at: c.bar, gain: 0.14, dur: 0.5 }, { type: 'bonk', at: c.low, gain: 0.4 },
    whoosh(c.sc4), pop(c.muscle, 1.0), ...c.bricks.map((at, i) => ({ type: 'thud', at, gain: 0.35 + i * 0.03 })), ding(c.build),
    whoosh(c.sc5), ...c.foods.map((at, i) => pop(at, 1.0 + i * 0.08, 0.55)),
    whoosh(c.sc6), pop(c.think, 1.0), pop(c.ask, 1.3),
    whoosh(c.sc7), pop(c.range, 1.2, 0.75), ding(c.range + 0.05, 1760.0, 0.3), pop(c.perKg, 1.0, 0.5),
    whoosh(c.sc8), pop(c.kg, 1.0), pop(c.row1, 1.1, 0.5), pop(c.res1, 1.4, 0.7), ding(c.res1, 1568.0, 0.3),
    pop(c.row2, 1.1, 0.5), pop(c.res2, 1.4, 0.7), ding(c.res2, 2093.0, 0.4),
  ];

  const TL = { FPS: T.FPS, DURATION: T.DURATION, OUT: 'protein-per-day.mp4', words: T.words, groups: T.groups, cues: c, sfx };
  if (typeof module !== 'undefined' && module.exports) module.exports = TL;
  else root.TL = TL;
})(typeof window !== 'undefined' ? window : globalThis);
