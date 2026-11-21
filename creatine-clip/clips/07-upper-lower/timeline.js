// Clip 07 — UPPER / LOWER: explained intro (voiceover captions), then one page per training day.
(function (root) {
  const KIT = typeof module !== 'undefined' && module.exports ? require('../../shared/kit.js') : root.KIT;

  // Exact voiceover script (section emojis dropped; "_" keeps Latin words together in RTL captions).
  const LINES = [
    '#s1 ببساطة،|',
    '#s2 UPPER_LOWER هو نظام تدريبي',
    '#s3 كتقسم فيه الجسم',
    '#s4 لجوج أجزاء:|||',
    '#u1 UPPER:|',
    '#u2 الجزء العلوي من الجسم،|',
    '#u3 يعني الصدر، الظهر،',
    '#u4 الكتاف والذراعين.|||',
    '#l1 LOWER:|',
    '#l2 الجزء السفلي،|',
    '#l3 يعني الفخاد، المؤخرة',
    '#l4 والسمانة.|||||',
    '#q2 كيفاش كتقسم أيام التدريب؟|||',
    '#m1 مثلاً تقدر تخدم',
    '#m2 بهاد الطريقة:||',
    '#w1 الإثنين: UPPER_A.||',
    '#w2 الثلاثاء: LOWER_A.||',
    '#w3 الأربعاء: راحة.||',
    '#w4 الخميس: UPPER_B.||',
    '#w5 الجمعة: LOWER_B.||',
    '#w6 السبت والأحد: راحة.|||||',
    '#q3 شنو المميزات ديالو؟|||',
    '#b1 أول حاجة،|',
    '#b2 كتقدر تدرب كل عضلة',
    '#b3 جوج مرات فالسيمانة.|||',
    '#c1 ثاني حاجة،|',
    '#c2 كتوزع التمارين',
    '#c3 والحجم التدريبي',
    '#c4 على جوج حصص،|',
    '#c5 وهادشي كيعاونك تحافظ',
    '#c6 على جودة الأداء ديالك.|||',
    '#r1 وزيادة على هادشي،|',
    '#r2 عندك أيام راحة كافية',
    '#r3 باش تسترجع الطاقة ديالك.',
  ];

  const ex = (name, id, frames = [0, 1]) => ({ name, frames: frames.map((f) => `../../exercises/${id}_${f}.jpg`) });
  const DAYS = [
    { chip: 'الإثنين', en: 'UPPER A', ar: 'الجزء العلوي', groups: [
      ['CHEST', [ex('Barbell Bench Press', 'Barbell_Bench_Press_-_Medium_Grip')]],
      ['BACK', [ex('Bent-Over Barbell Row', 'Bent_Over_Barbell_Row'), ex('Wide-Grip Lat Pulldown', 'Wide-Grip_Lat_Pulldown')]],
      ['SHOULDERS', [ex('Overhead Press', 'Standing_Military_Press'), ex('Lateral Raise', 'Side_Lateral_Raise')]],
      ['ARMS', [ex('Barbell Curl', 'Barbell_Curl'), ex('Rope Triceps Pushdown', 'Triceps_Pushdown_-_Rope_Attachment')]],
    ] },
    { chip: 'الثلاثاء', en: 'LOWER A', ar: 'الجزء السفلي', groups: [
      ['QUADS', [ex('Barbell Squat', 'Barbell_Squat'), ex('Leg Press', 'Leg_Press')]],
      ['HAMSTRINGS', [ex('Romanian Deadlift', 'Romanian_Deadlift'), ex('Lying Leg Curl', 'Lying_Leg_Curls')]],
      ['GLUTES', [ex('Barbell Hip Thrust', 'Barbell_Hip_Thrust')]],
      ['CALVES', [ex('Standing Calf Raise', 'Standing_Calf_Raises')]],
    ] },
    { chip: 'الأربعاء', en: 'REST', ar: 'راحة', rest: true },
    { chip: 'الخميس', en: 'UPPER B', ar: 'الجزء العلوي', groups: [
      ['CHEST', [ex('Incline Dumbbell Press', 'Incline_Dumbbell_Press')]],
      ['BACK', [ex('Pull-Ups', 'Pullups'), ex('Seated Cable Row', 'Seated_Cable_Rows')]],
      ['SHOULDERS', [ex('Dumbbell Shoulder Press', 'Dumbbell_Shoulder_Press'), ex('Rear Delt Fly', 'Reverse_Flyes')]],
      ['ARMS', [ex('Hammer Curl', 'Hammer_Curls'), ex('Overhead Cable Extension', 'Cable_Rope_Overhead_Triceps_Extension')]],
    ] },
    { chip: 'الجمعة', en: 'LOWER B', ar: 'الجزء السفلي', groups: [
      ['QUADS', [ex('Hack Squat', 'Hack_Squat'), ex('Dumbbell Split Squat', 'Split_Squat_with_Dumbbells'), ex('Leg Extension', 'Leg_Extensions')]],
      ['HAMSTRINGS', [ex('Seated Leg Curl', 'Seated_Leg_Curl'), ex('Barbell Deadlift', 'Barbell_Deadlift')]],
      ['CALVES', [ex('Seated Calf Raise', 'Seated_Calf_Raise')]],
    ] },
    { chip: 'السبت والأحد', en: 'REST', ar: 'راحة', rest: true },
  ];

  const keys = {};
  const GROUPS = LINES.map((l, i) => { const m = l.match(/^#(\S+)\s+(.*)$/); keys[m[1]] = i; return m[2]; });
  const T = KIT.buildTimeline(GROUPS, { unit: 0.064, start: 1.4, tail: 0 });
  const word = (key, wi) => {
    const g = T.groups[keys[key]].words;
    const w = T.words[g[wi < 0 ? g.length + wi : wi]];
    if (!w) throw new Error(`line ${key} has no word #${wi}`);
    return w;
  };
  const S = (key, wi = 0) => word(key, wi).start;
  const E = (key, wi = -1) => word(key, wi).end;
  const INTRO = Math.ceil((E('r3') + 1.0) * 30) / 30;

  const c = {
    title: 0.2, shrink: S('s3'), panels: S('s4', 1),
    upper: S('u1'), upperSub: S('u2'), upperChips: [S('u3', 1), S('u3', 2), S('u4'), S('u4', 1)],
    lower: S('l1'), lowerSub: S('l2'), lowerChips: [S('l3', 1), S('l3', 2), S('l4')],
    sec2: S('q2'), rows: [S('w1'), S('w2'), S('w3'), S('w4'), S('w5'), S('w6'), S('w6') + 0.2],
    sec3: S('q3'), ben1: S('b2'), x2: S('b3'), ben2: S('c2'), split: S('c4', 1), quality: S('c6', 1),
    ben3: S('r2'), charge: S('r3'), chargeEnd: E('r3'),
    introEnd: INTRO,
  };

  const ROW = 0.55;
  let at = INTRO;
  const pages = DAYS.map((d, i) => {
    const n = d.rest ? 0 : d.groups.reduce((a, g) => a + g[1].length, 0);
    const dur = d.rest ? 3.2 : 1.2 + n * ROW + 3.6;
    const p = { ...d, day: i + 1, from: at, to: at + dur, n };
    at += dur;
    return p;
  });
  const DURATION = Math.ceil(at * 30) / 30;

  const pop = (t, p = 1, gain = 0.6) => ({ type: 'pop', at: t, p, gain });
  const whoosh = (t, gain = 0.4) => ({ type: 'whoosh', at: t - 0.1, gain, dur: 0.3 });
  const sfx = [
    pop(c.title, 1.0, 0.75), whoosh(c.shrink, 0.35),
    pop(c.panels, 0.9, 0.5), pop(c.panels + 0.15, 1.0, 0.5),
    pop(c.upper, 1.1, 0.7), pop(c.upperSub, 1.3, 0.45), ...c.upperChips.map((t, i) => pop(t, 1.2 + i * 0.1, 0.5)),
    pop(c.lower, 0.95, 0.7), pop(c.lowerSub, 1.15, 0.45), ...c.lowerChips.map((t, i) => pop(t, 1.0 + i * 0.1, 0.5)),
    whoosh(c.sec2), pop(c.sec2 + 0.05, 1.0, 0.7),
    ...c.rows.map((t, i) => pop(t + 0.05, [2, 5, 6].includes(i) ? 0.75 : 1.0 + i * 0.07, 0.55)),
    whoosh(c.sec3), pop(c.sec3 + 0.05, 1.0, 0.7),
    pop(c.ben1, 1.0), pop(c.x2, 1.45, 0.75), { type: 'ding', at: c.x2 + 0.05, gain: 0.3, p: 1568.0 },
    pop(c.ben2, 1.1), { type: 'rep', at: c.split, gain: 0.4, p: 0 }, { type: 'rep', at: c.split + 0.18, gain: 0.4, p: 4 },
    pop(c.quality, 1.35, 0.6), { type: 'ding', at: c.quality + 0.05, gain: 0.28, p: 1760.0 },
    pop(c.ben3, 0.9), { type: 'fill', at: c.charge, gain: 0.18, dur: c.chargeEnd - c.charge }, { type: 'ding', at: c.chargeEnd, gain: 0.36, p: 2093.0 },
    ...pages.flatMap((p) => [
      { type: 'whoosh', at: p.from - 0.08, gain: 0.45, dur: 0.32 },
      pop(p.from + 0.15, 1.0, 0.7),
      ...(p.rest ? [{ type: 'ding', at: p.from + 0.6, gain: 0.3, p: 1046.5 }]
        : [...Array.from({ length: p.n }, (_, k) => pop(p.from + 1.2 + k * ROW, 1.1 + k * 0.06, 0.5)),
           { type: 'ding', at: p.from + 1.2 + p.n * ROW + 0.1, gain: 0.32, p: 1568.0 }]),
    ]),
  ];

  const stills = pages.filter((p) => !p.rest).map((p) => ({ name: `upper-lower-pages/${p.en.toLowerCase().replace(' ', '-')}.png`, at: +(p.to - 0.5).toFixed(2) }));

  const TL = { FPS: 30, DURATION, OUT: 'upper-lower.mp4', words: T.words, groups: T.groups, cues: c, pages, sfx, stills, ROW };
  if (typeof module !== 'undefined' && module.exports) module.exports = TL;
  else root.TL = TL;
})(typeof window !== 'undefined' ? window : globalThis);
