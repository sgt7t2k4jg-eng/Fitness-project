// Clip 04 — الكربوهيدرات (carbs): word timings + visual/SFX cue points.
// The script is too long for one relaxed clip under 35s, so it is exported as three parts.
(function (root) {
  const KIT = typeof module !== 'undefined' && module.exports ? require('../../shared/kit.js') : root.KIT;

  // Exact voiceover script, one caption line per entry. "#key" names the line for cue lookups,
  // "|" = short pause after the line.
  const LINES = [
    // ---- part A: what carbs are, and what the body does with them ----
    '#first أول حاجة،|',
    '#carbs الكربوهيدرات كتلقاها',
    '#f1 فالخبز،', '#f2 الروز،', '#f3 البطاطا،', '#f4 العدس،', '#f5 الفواكه،|',
    '#sweets وحتى السكر والحلويات.||||',
    '#eat ملي كتاكل الكارب،|',
    '#break الجسم كيفككو',
    '#units لوحدات بسيطة',
    '#glu بحال الغلوكوز،|',
    '#use اللي كيستعملو',
    '#energy كمصدر للطاقة',
    '#work باش يخدم',
    '#body الجسم ديالك.||||',
    '#surplus والفائض من الغلوكوز',
    '#store يقدر يتخزن',
    '#organs فالعضلات والكبد',
    '#glyc على شكل Glycogen.||||',
    '#stock وهاد المخزون',
    '#important مهم بزاف',
    '#athlete بالنسبة ليك كرياضي،|',
    '#mususe حيث العضلات كتستعملو',
    '#energy2 كمصدر للطاقة',
    '#train أثناء التمارين.|||||||||',
    // ---- part B: the two types ----
    '#know دابا خاصك تعرف',
    '#carbs2 أن الكربوهيدرات',
    '#types كاينين منها أنواع:||||',
    '#t1 النوع الأول:|',
    '#fast الكارب السريع.|||',
    '#s1 بحال السكر،',
    '#s2 المشروبات الغازية،',
    '#s3 الحلويات والعصائر.|||',
    '#digest كيتاهضمو بسرعة،|',
    '#but ولكن غالباً',
    '#nofull ما كيشبعوكش بزاف.||||',
    '#t2 النوع الثاني:|',
    '#fiber الكارب الغني بالألياف.|||',
    '#o1 بحال الشوفان،',
    '#o2 روز بطاطا',
    '#o3 خبز القمح الكامل',
    '#o4 او شعير،',
    '#o5 العدس والقطاني',
    '#o6 والفواكه الكاملة.|||',
    '#help هاد المصادر كتعاونك',
    '#full تحس بالشبع',
    '#longer مدة أطول،|',
    '#give وكتوفر ليك',
    '#fib الألياف والعناصر',
    '#nutr الغذائية المهمة.|||||||||',
    // ---- part C: which one is better ----
    '#who دابا شكون',
    '#best فيهم أحسن؟||||',
    '#goal إلا كان الهدف ديالك',
    '#g1 الصحة،',
    '#g2 بناء العضلات',
    '#g3 أو التنشيف،|',
    '#stay خليك مع المصادر',
    '#rich الغنية بالألياف',
    '#less والأقل معالجة،||',
    '#leave وخلي الحلويات',
    '#added والسكريات المضافة',
    '#small بكمية قل',
  ];

  const keys = {};
  const GROUPS = LINES.map((l, i) => { const m = l.match(/^#(\S+)\s+(.*)$/); keys[m[1]] = i; return m[2]; });
  const T = KIT.buildTimeline(GROUPS, { unit: 0.068, start: 0.2, tail: 0.6 });
  const word = (key, wi) => {
    const g = T.groups[keys[key]];
    if (!g) throw new Error('no line ' + key);
    return T.words[g.words[wi < 0 ? g.words.length + wi : wi]];
  };
  const S = (key, wi = 0) => word(key, wi).start; // start of the wi-th word of a line
  const E = (key, wi = -1) => word(key, wi).end; //   end of a word (default: last of the line)

  const c = {
    // A1 — sources
    carbsPill: S('carbs'),
    foods: [S('f1'), S('f2'), S('f3'), S('f4'), S('f5'), S('sweets', 1), S('sweets', 2)],
    // A2 — digestion
    sc2: S('eat'), bread: S('eat', 1), breakStart: S('break', 1),
    units: S('units'), unitsEnd: E('units'), gluLabel: S('glu', 1),
    converge: S('use', 1), bolt: S('energy', 1), boltSlide: S('work'), runner: S('body'),
    // A3 — storage
    sc3: S('surplus'), surplusEnd: E('surplus'), store: S('store', 1),
    muscleCard: S('organs'), liverCard: S('organs', 1), glycLabel: S('glyc', 2),
    // A4 — athlete
    sc4: S('stock'), battery: S('stock', 1), important: S('important'), athlete: S('athlete', 2),
    useStart: S('mususe', 2), useEnd: E('train'), finalA: S('train', 1),
    // B1 — types
    partB: S('know'), pillB: S('carbs2', 1), types: S('types', 2),
    // B2 — fast carbs
    sc6: S('t1'), title6: S('fast'),
    items6: [S('s1', 1), S('s2'), S('s3'), S('s3', 1)],
    digest: S('digest'), speed: S('digest', 1), satFrame6: S('but'), satLow: S('nofull', 1),
    // B3 — fibre-rich carbs
    sc7: S('t2'), title7: S('fiber'),
    items7: [S('o1', 1), S('o2'), S('o2', 1), S('o3'), S('o4', 1), S('o5'), S('o6')],
    help: S('help'), satFrame7: S('full'), satFill: S('full', 1), satFillEnd: E('longer'),
    pillFib: S('fib'), pillNutr: S('fib', 1), sparkB: S('nutr', 1),
    // C — verdict
    partC: S('who'), vsA: S('who'), vsB: S('who', 1), q: S('best', 1),
    goals: [S('g1'), S('g2'), S('g3', 1)],
    pick: S('stay'), check: S('rich'), shrink: S('leave', 1), down: S('small'), finalC: S('small', 1),
  };

  const pop = (at, p = 1, gain = 0.65) => ({ type: 'pop', at, p, gain });
  const whoosh = (at, dur = 0.3) => ({ type: 'whoosh', at: at - 0.1, gain: 0.42, dur });
  const ding = (at, p = 1568.0, gain = 0.38) => ({ type: 'ding', at, p, gain });
  const sfx = [
    // A1
    pop(c.carbsPill, 1.0),
    ...c.foods.map((at, i) => pop(at, 1.0 + i * 0.1, 0.6)),
    // A2
    whoosh(c.sc2), pop(c.bread, 0.9),
    { type: 'thud', at: c.breakStart, gain: 0.5 },
    ...Array.from({ length: 8 }, (_, i) => ({ type: 'rep', at: c.units + (i * (c.unitsEnd - c.units)) / 8, gain: 0.36, p: i })),
    pop(c.gluLabel, 1.3),
    { type: 'fill', at: c.converge, gain: 0.2, dur: c.bolt - c.converge },
    pop(c.bolt, 1.45, 0.75), ding(c.bolt, 1760.0, 0.3),
    whoosh(c.boltSlide + 0.08, 0.24), pop(c.runner, 1.1),
    // A3
    whoosh(c.sc3),
    ...Array.from({ length: 6 }, (_, i) => ({ type: 'rep', at: c.sc3 + (i * (c.surplusEnd - c.sc3)) / 6, gain: 0.36, p: i * 2 })),
    pop(c.store, 0.8), pop(c.muscleCard, 1.0), pop(c.liverCard, 1.15),
    { type: 'fill', at: c.muscleCard + 0.2, gain: 0.18, dur: c.glycLabel - c.muscleCard - 0.2 },
    pop(c.glycLabel, 1.35, 0.75), ding(c.glycLabel),
    // A4
    whoosh(c.sc4), pop(c.battery, 0.9), ding(c.important, 2093.0, 0.3), pop(c.athlete, 1.1),
    { type: 'drain', at: c.useStart, gain: 0.14, dur: c.useEnd - c.useStart },
    ding(c.finalA, 1568.0, 0.36),
    // B1
    pop(c.pillB, 1.0), whoosh(c.types + 0.08, 0.26), pop(c.types + 0.05, 1.2), pop(c.types + 0.25, 1.4),
    // B2
    whoosh(c.sc6), pop(c.sc6, 1.0), pop(c.title6, 1.25),
    ...c.items6.map((at, i) => pop(at, 1.0 + i * 0.12, 0.6)),
    whoosh(c.digest + 0.06, 0.26), pop(c.digest, 1.3),
    { type: 'whoosh', at: c.speed - 0.02, gain: 0.6, dur: 0.3 },
    pop(c.satFrame6, 0.9, 0.55),
    { type: 'bonk', at: c.satLow, gain: 0.45 },
    // B3
    whoosh(c.sc7), pop(c.sc7, 1.0), pop(c.title7, 1.25),
    ...c.items7.map((at, i) => pop(at, 1.0 + i * 0.1, 0.6)),
    whoosh(c.help + 0.06, 0.26), pop(c.satFrame7, 0.9, 0.55),
    { type: 'fill', at: c.satFill, gain: 0.2, dur: c.satFillEnd - c.satFill },
    ding(c.satFillEnd - 0.05, 1568.0, 0.3),
    pop(c.pillFib, 1.2), pop(c.pillNutr, 1.35), ding(c.sparkB, 2093.0, 0.36),
    // C
    pop(c.vsA, 0.9), pop(c.vsB, 1.1), { type: 'bonk', at: c.q, gain: 0.42 }, pop(c.q, 1.4, 0.5),
    ...c.goals.map((at, i) => pop(at, 1.05 + i * 0.15, 0.6)),
    whoosh(c.pick + 0.08, 0.26), pop(c.check, 1.4, 0.75), ding(c.check, 1760.0, 0.36),
    { type: 'drain', at: c.shrink, gain: 0.16, dur: 0.45 },
    pop(c.down, 0.8), ding(c.finalC, 2093.0, 0.4),
  ];

  const parts = [
    { name: 'carbs-01-what-are-carbs.mp4', from: 0, to: c.partB - 0.55 },
    { name: 'carbs-02-two-types.mp4', from: c.partB - 0.12, to: c.partC - 0.55 },
    { name: 'carbs-03-which-is-better.mp4', from: c.partC - 0.12, to: T.DURATION },
  ];

  const TL = {
    FPS: T.FPS, DURATION: T.DURATION, OUT: 'carbs-master.mp4', partsOnly: true,
    words: T.words, groups: T.groups, cues: c, sfx, parts,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = TL;
  else root.TL = TL;
})(typeof window !== 'undefined' ? window : globalThis);
