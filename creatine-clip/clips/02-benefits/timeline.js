// Clip 02 — الفوائد (benefits): word timings + visual/SFX cue points.
(function (root) {
  const KIT = typeof module !== 'undefined' && module.exports ? require('../../shared/kit.js') : root.KIT;

  // Exact voiceover script, split into caption lines. "|" = short pause after the line.
  const GROUPS = [
    'الفوائد:||',
    '1. القوة:|',
    'ملي كتزيد ريبات',
    'كل حصة،|',
    'مع الوقت',
    'كتولي ترفع',
    'تقل كثر.|||||||||',
    '2. العضلات:|',
    'الباحثين جمعو',
    'بزاف ديال الدراسات',
    'ولقاو بلي',
    'اللي كياخد الكرياتين',
    'وكيتريني',
    'كيتزادوه تقريبا كيلو',
    'على اللي كيطريني',
    'وماكيخدش كرياتين.|||||||||',
    '3. آمن:|',
    'الدراسات ما لقاتش',
    'بلي كيضر الكلاوي',
    'عند الناس',
    'اللي صحتهم مزيانة،|',
    'وحتى الناس',
    'لي خايفا من',
    'شعرها لايطيح،|',
    'دراسة اتدارت',
    'وقاسوا الشعر بالآلات',
    'وما لقاو',
    'حتى فرق',
    'بين اللي خداه',
    'واللي ما خداوهش',
  ];

  const T = KIT.buildTimeline(GROUPS, { tail: 0.45 });
  const { s, e } = T;

  const c = {
    intro: s('الفوائد'),
    // 1 — القوة
    sec1: s('1'), title1: s('القوة'),
    barbell: s('ملي'), plusA: s('كتزيد'), plusB: s('ريبات'),
    sessions: [s('كل'), s('حصة'), s('حصة') + 0.16, s('مع'), s('الوقت')],
    plate2: s('ترفع'), plate3: s('تقل'), lift: s('كثر'),
    // 2 — العضلات
    sec2: s('2'), title2: s('العضلات'),
    papers: [s('الباحثين'), s('جمعو'), s('بزاف'), s('ديال'), s('الدراسات')],
    compare: s('ولقاو'), labelA: s('الكرياتين'),
    growBoth: s('وكيتريني'), growBothEnd: e('وكيتريني'),
    growExtra: s('كيتزادوه'), growExtraEnd: s('كيلو'), kilo: s('كيلو'),
    labelB: s('وماكيخدش'),
    // 3 — آمن
    sec3: s('3'), title3: s('آمن'),
    study3: s('الدراسات', 1), kidney: s('الكلاوي'), kidneyOk: s('مزيانة'),
    hair: s('وحتى'), head: s('الناس', 1), worry: s('خايفا'),
    study: s('دراسة'), scanStart: s('وقاسوا'), scanEnd: e('بالآلات'),
    split: s('وما'), equal: s('فرق'), tookLabel: s('خداه'), notLabel: s('ما', 1), final: s('خداوهش'),
  };

  const pop = (at, p = 1, gain = 0.7) => ({ type: 'pop', at, p, gain });
  const sfx = [
    pop(c.intro, 0.9), pop(c.intro + 0.12, 1.1), pop(c.intro + 0.24, 1.35),
    // 1
    { type: 'whoosh', at: c.sec1 - 0.1, gain: 0.45, dur: 0.3 },
    pop(c.sec1, 1.0), pop(c.title1, 1.25),
    pop(c.barbell, 0.8), pop(c.plusA, 1.3), pop(c.plusB, 1.5),
    ...c.sessions.map((at, i) => ({ type: 'rep', at, gain: 0.4, p: i * 2 })),
    { type: 'thud', at: c.plate2, gain: 0.5 }, pop(c.plate2, 0.7),
    { type: 'thud', at: c.plate3, gain: 0.55 }, pop(c.plate3, 0.6),
    { type: 'whoosh', at: c.lift - 0.05, gain: 0.4, dur: 0.24 },
    { type: 'ding', at: c.lift + 0.03, gain: 0.4, p: 1568.0 },
    // 2
    { type: 'whoosh', at: c.sec2 - 0.1, gain: 0.45, dur: 0.3 },
    pop(c.sec2, 1.0), pop(c.title2, 1.25),
    ...c.papers.map((at, i) => pop(at, 1.3 + i * 0.12, 0.5)),
    { type: 'whoosh', at: c.compare - 0.06, gain: 0.4, dur: 0.26 },
    pop(c.compare + 0.05, 0.9, 0.55), pop(c.labelA, 1.2),
    { type: 'fill', at: c.growBoth, gain: 0.2, dur: c.growBothEnd - c.growBoth },
    { type: 'fill', at: c.growExtra, gain: 0.22, dur: c.growExtraEnd - c.growExtra },
    pop(c.kilo, 1.4, 0.8), { type: 'ding', at: c.kilo, gain: 0.4, p: 1760.0 },
    pop(c.labelB, 0.9),
    // 3
    { type: 'whoosh', at: c.sec3 - 0.1, gain: 0.45, dur: 0.3 },
    pop(c.sec3, 1.0), pop(c.title3, 1.25),
    pop(c.study3, 1.3, 0.55), pop(c.kidney, 0.9), pop(c.kidneyOk, 1.4), { type: 'ding', at: c.kidneyOk, gain: 0.38, p: 1568.0 },
    { type: 'whoosh', at: c.hair - 0.06, gain: 0.4, dur: 0.26 },
    pop(c.head, 1.0), { type: 'bonk', at: c.worry, gain: 0.4 },
    pop(c.scanStart, 1.2, 0.6),
    { type: 'scan', at: c.scanStart + 0.1, gain: 0.13, dur: c.scanEnd - c.scanStart - 0.1 },
    { type: 'whoosh', at: c.split - 0.05, gain: 0.4, dur: 0.26 }, pop(c.split + 0.08, 1.0),
    pop(c.equal, 1.35, 0.8), { type: 'ding', at: c.equal, gain: 0.3, p: 1568.0 },
    pop(c.tookLabel, 1.1, 0.6), pop(c.notLabel, 0.95, 0.6),
    { type: 'ding', at: c.final, gain: 0.42, p: 2093.0 },
  ];

  // Optional per-benefit cuts (each < 15s) for interleaving with camera footage.
  const parts = [
    { name: 'creatine-02a-strength.mp4', from: 0, to: c.sec2 - 0.32 },
    { name: 'creatine-02b-muscle.mp4', from: c.sec2 - 0.12, to: c.sec3 - 0.32 },
    { name: 'creatine-02c-safety.mp4', from: c.sec3 - 0.12, to: T.DURATION },
  ];

  const TL = { FPS: T.FPS, DURATION: T.DURATION, OUT: 'creatine-02-benefits.mp4', words: T.words, groups: T.groups, cues: c, sfx, parts };
  if (typeof module !== 'undefined' && module.exports) module.exports = TL;
  else root.TL = TL;
})(typeof window !== 'undefined' ? window : globalThis);
