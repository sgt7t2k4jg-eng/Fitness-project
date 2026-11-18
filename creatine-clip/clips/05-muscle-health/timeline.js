// Clip 05 — العضلات والصحة (why muscle matters for health): word timings + visual/SFX cues.
// Exported as three parts, one per point (السكري / ملي كتمرض / السقوط).
(function (root) {
  const KIT = typeof module !== 'undefined' && module.exports ? require('../../shared/kit.js') : root.KIT;

  // Exact voiceover script, one caption line per entry. "#key" names the line for cue lookups,
  // "|" = short pause after the line.
  const LINES = [
    // ---- part 1: diabetes ----
    '#h1 الحاجة الأولى:|',
    '#t1 مرض السكري.||||',
    '#m1 العضلات ديالك كتستهلك',
    '#m2 كمية كبيرة من السكر',
    '#m3 اللي كيدور فالدم،|',
    '#m4 وكتعاون الجسم',
    '#m5 ينظّم مستواه.||||',
    '#k1 كلما كانت عندك',
    '#k2 كتلة عضلية مزيانة',
    '#k3 وكتتمرن بانتظام،|',
    '#k4 كتتحسن حساسية',
    '#k5 جسمك للأنسولين،|',
    '#k6 وكتنقص احتمالية الإصابة',
    '#k7 بالسكري من النوع الثاني.|||||||||',
    // ---- part 2: when you get sick ----
    '#h2 الحاجة الثانية:|',
    '#t2 ملي كتمرض.||||',
    '#i1 تخيل معايا واحد الشخص',
    '#i2 مرض مرض خطير',
    '#i3 واضطر يبقى مدة طويلة',
    '#i4 فالفراش.||||',
    '#n1 فهاد الحالة',
    '#n2 الجسم كيحتاج',
    '#n3 الطاقة والبروتين',
    '#n4 باش يواجه المرض،|',
    '#n5 والعضلات كتعتبر',
    '#n6 مخزون مهم',
    '#n7 للبروتين والطاقة.||||',
    '#d1 والدراسات لقات',
    '#d2 أن المرضى اللي عندهم',
    '#d3 نقص كبير',
    '#d4 فالكتلة العضلية',
    '#d5 كيكون عندهم خطر أكبر',
    '#d6 ديال المضاعفات والوفاة.||||',
    '#y1 يعني العضلات',
    '#y2 ماشي غير للمظهر،|',
    '#y3 عندها أهمية',
    '#y4 حتى فمواجهة الأمراض.|||||||||',
    // ---- part 3: falls and injuries ----
    '#h3 الحاجة الثالثة:|',
    '#t3 السقوط والإصابات.||||',
    '#a1 مع التقدم فالعمر،|',
    '#a2 الإنسان كيبدأ يفقد',
    '#a3 الكتلة والقوة العضلية،|',
    '#a4 وهادشي كيأثر',
    '#a5 على التوازن والحركة.||||',
    '#s1 ولكن ملي كتقوي',
    '#s2 عضلات الرجلين والأرداف',
    '#s3 وكتخدم على التوازن،|',
    '#s4 كتعاون جسمك ينقص',
    '#s5 خطر السقوط',
    '#s6 والإصابات والكسور',
  ];

  const keys = {};
  const GROUPS = LINES.map((l, i) => { const m = l.match(/^#(\S+)\s+(.*)$/); keys[m[1]] = i; return m[2]; });
  const T = KIT.buildTimeline(GROUPS, { unit: 0.066, start: 0.2, tail: 0.7 });
  const word = (key, wi) => {
    const g = T.groups[keys[key]];
    if (!g) throw new Error('no line ' + key);
    const w = T.words[g.words[wi < 0 ? g.words.length + wi : wi]];
    if (!w) throw new Error(`line ${key} has no word #${wi}`);
    return w;
  };
  const S = (key, wi = 0) => word(key, wi).start; // start of the wi-th word of a line
  const E = (key, wi = -1) => word(key, wi).end; //   end of a word (default: last of the line)

  const c = {
    // 1 — diabetes
    p1: S('h1'), num1: S('h1', 1), title1: S('t1', 1), drop: S('t1', 1),
    sc1b: S('m1'), muscle1: S('m1'), flowStart: S('m2', 1), flowEnd: E('m3'), vessel: S('m3', 2),
    gauge: S('m4'), gaugeFix: S('m5'), gaugeFixEnd: E('m5'),
    sc1c: S('k1'), lifter: S('k2'), checks: [S('k3'), S('k3', 1)],
    key: S('k4', 1), unlock: S('k5', 1), risk: S('k6'), riskDown: S('k6', 1), riskEnd: E('k7'), riskLabel: S('k7'),
    final1: S('k7', 3),
    // 2 — when you get sick
    p2: S('h2'), num2: S('h2', 1), title2: S('t2', 1),
    sc2b: S('i1'), person: S('i1', 3), sick: S('i2', 1), bed: S('i3', 1), days: S('i3', 3), daysEnd: E('i4'),
    sc2c: S('n1'), shield: S('n2', 1), pE: S('n3'), pP: S('n3', 1), virus: S('n4', 2),
    muscle2: S('n5'), stock: S('n6'), flow2: S('n7'), flow2End: E('n7'),
    sc2d: S('d1'), paper: S('d1', 1), barsIn: S('d2', 2), lowMuscle: S('d3', 1), riskUp: S('d5', 2), riskUpEnd: E('d6'),
    sc2e: S('y1'), mirror: S('y2', 2), cross: S('y2', 2), muscle3: S('y3'), shield2: S('y4', 1), final2: S('y4', 2),
    // 3 — falls & injuries
    p3: S('h3'), num3: S('h3', 1), title3: S('t3'),
    sc3b: S('a1'), age: S('a1', 1), ageEnd: E('a3'), loseStart: S('a2', 2), loseEnd: E('a3'),
    wobble: S('a4'), wobbleLabel: S('a5', 1),
    sc3c: S('s1'), leg: S('s2'), legFill: S('s2', 1), legFillEnd: E('s2'), balance: S('s3', 2),
    risks: [S('s5', 1), S('s6'), S('s6', 1)], downs: S('s4', 2), final3: E('s6') - 0.25,
  };

  const pop = (at, p = 1, gain = 0.65) => ({ type: 'pop', at, p, gain });
  const whoosh = (at, dur = 0.3) => ({ type: 'whoosh', at: at - 0.1, gain: 0.42, dur });
  const ding = (at, p = 1568.0, gain = 0.38) => ({ type: 'ding', at, p, gain });
  const reps = (from, to, n, gain = 0.34, step = 1) =>
    Array.from({ length: n }, (_, i) => ({ type: 'rep', at: from + (i * (to - from)) / n, gain, p: i * step }));
  const sfx = [
    // 1
    pop(c.num1, 1.0), pop(c.title1, 1.25), pop(c.drop + 0.15, 1.45, 0.5),
    whoosh(c.sc1b), pop(c.muscle1, 0.9), pop(c.vessel, 1.1, 0.5),
    ...reps(c.flowStart, c.flowEnd, 8),
    pop(c.gauge, 1.0), { type: 'fill', at: c.gaugeFix, gain: 0.16, dur: c.gaugeFixEnd - c.gaugeFix }, ding(c.gaugeFixEnd - 0.1),
    whoosh(c.sc1c), pop(c.lifter, 0.9), ...c.checks.map((at, i) => pop(at, 1.3 + i * 0.15, 0.6)),
    pop(c.key, 1.1), { type: 'bonk', at: c.unlock - 0.05, gain: 0.22 }, ding(c.unlock + 0.1, 1760.0, 0.32),
    pop(c.risk, 0.9), { type: 'drain', at: c.riskDown, gain: 0.15, dur: c.riskEnd - c.riskDown },
    pop(c.riskLabel, 1.2), ding(c.final1, 2093.0, 0.4),
    // 2
    whoosh(c.p2), pop(c.num2, 1.0), pop(c.title2, 1.25),
    whoosh(c.sc2b), pop(c.person, 1.0), { type: 'bonk', at: c.sick, gain: 0.4 }, pop(c.bed, 0.85),
    ...reps(c.days, c.daysEnd, 6, 0.3, 2),
    whoosh(c.sc2c), pop(c.shield, 0.9), pop(c.pE, 1.2), pop(c.pP, 1.35), { type: 'thud', at: c.virus, gain: 0.45 }, pop(c.virus, 0.7),
    pop(c.muscle2, 1.0), pop(c.stock, 1.2, 0.5), { type: 'fill', at: c.flow2, gain: 0.18, dur: c.flow2End - c.flow2 },
    whoosh(c.sc2d), pop(c.paper, 1.3, 0.55), pop(c.barsIn, 0.9, 0.55), { type: 'drain', at: c.lowMuscle, gain: 0.14, dur: 0.5 },
    { type: 'fill', at: c.riskUp, gain: 0.17, dur: c.riskUpEnd - c.riskUp }, { type: 'thud', at: c.riskUpEnd - 0.1, gain: 0.4 },
    whoosh(c.sc2e), pop(c.muscle3, 1.0), pop(c.mirror, 1.1), { type: 'bonk', at: c.cross + 0.15, gain: 0.3 },
    pop(c.shield2, 1.25, 0.75), ding(c.final2, 2093.0, 0.4),
    // 3
    whoosh(c.p3), pop(c.num3, 1.0), pop(c.title3, 1.25),
    whoosh(c.sc3b), pop(c.age, 1.0), ...reps(c.age + 0.2, c.ageEnd - 0.3, 5, 0.28, 3).map((e) => ({ ...e, p: -e.p })),
    { type: 'drain', at: c.loseStart, gain: 0.15, dur: c.loseEnd - c.loseStart },
    { type: 'whoosh', at: c.wobble, gain: 0.3, dur: 0.5 }, pop(c.wobbleLabel, 1.1),
    whoosh(c.sc3c), pop(c.leg, 1.0), { type: 'fill', at: c.legFill, gain: 0.18, dur: c.legFillEnd - c.legFill },
    pop(c.balance, 1.2), ding(c.balance + 0.35, 1568.0, 0.3),
    ...c.risks.map((at, i) => pop(at, 1.05 + i * 0.15, 0.6)), ding(c.final3, 2093.0, 0.42),
  ];

  const parts = [
    { name: 'muscle-health-01-diabetes.mp4', from: 0, to: c.p2 - 0.55 },
    { name: 'muscle-health-02-illness.mp4', from: c.p2 - 0.12, to: c.p3 - 0.55 },
    { name: 'muscle-health-03-falls.mp4', from: c.p3 - 0.12, to: T.DURATION },
  ];

  const TL = {
    FPS: T.FPS, DURATION: T.DURATION, OUT: 'muscle-health-master.mp4', partsOnly: true,
    words: T.words, groups: T.groups, cues: c, sfx, parts,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = TL;
  else root.TL = TL;
})(typeof window !== 'undefined' ? window : globalThis);
