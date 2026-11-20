// Clip 06 — BRO SPLIT: ~40s explained intro (voiceover captions), then one page per training day.
(function (root) {
  const KIT = typeof module !== 'undefined' && module.exports ? require('../../shared/kit.js') : root.KIT;

  // ---------- intro: exact voiceover script ("PRO SPLIT" written as BRO SPLIT) ----------
  const LINES = [
    '#q شنو هو BRO_SPLIT؟|||',
    '#s1 ببساطة،|',
    '#s2 BRO_SPLIT هو واحد الطريقة فالتدريب،|',
    '#s3 كتقسم فيها العضلات',
    '#s4 على أيام الأسبوع،|',
    '#s5 وكتخصص لكل مجموعة عضلية',
    '#s6 نهار ديالها.||||',
    '#ex مثلاً:||',
    '#d1 نهار اللول: الصدر والترايسبس.||',
    '#d2 نهار الثاني: الظهر والبايسبس.||',
    '#d3 نهار الثالث: الرجلين.||',
    '#d4 نهار الرابع: الراحة.||',
    '#d5 نهار الخامس: الكتاف والترابيس.||',
    '#d6 نهار السادس: الذراعين والكرش||',
    '#d7 نهار سابع راحة',
  ];
  const INTRO = 40; // seconds

  // ---------- program (exercise names in English, grouped by muscle; images from free-exercise-db) ----------
  const ex = (name, id, frames = [0, 1]) => ({ name, frames: frames.map((f) => `../../exercises/${id}_${f}.jpg`) });
  const DAYS = [
    { en: 'CHEST + TRICEPS', ar: 'الصدر والترايسبس', groups: [
      ['CHEST', [ex('Barbell Bench Press', 'Barbell_Bench_Press_-_Medium_Grip'), ex('Incline Dumbbell Press', 'Incline_Dumbbell_Press'),
                 ex('Dumbbell Flyes', 'Dumbbell_Flyes'), ex('Cable Crossover', 'Cable_Crossover')]],
      ['TRICEPS', [ex('Rope Triceps Pushdown', 'Triceps_Pushdown_-_Rope_Attachment'), ex('Overhead Cable Extension', 'Cable_Rope_Overhead_Triceps_Extension'),
                   ex('Triceps Dips', 'Dips_-_Triceps_Version')]],
    ] },
    { en: 'BACK + BICEPS', ar: 'الظهر والبايسبس', groups: [
      ['BACK', [ex('Pull-Ups', 'Pullups'), ex('Wide-Grip Lat Pulldown', 'Wide-Grip_Lat_Pulldown'), ex('Bent-Over Barbell Row', 'Bent_Over_Barbell_Row'),
                ex('Seated Cable Row', 'Seated_Cable_Rows'), ex('Barbell Deadlift', 'Barbell_Deadlift')]],
      ['BICEPS', [ex('Barbell Curl', 'Barbell_Curl'), ex('Hammer Curl', 'Hammer_Curls')]],
    ] },
    { en: 'LEGS', ar: 'الرجلين', groups: [
      ['QUADS', [ex('Barbell Squat', 'Barbell_Squat'), ex('Leg Press', 'Leg_Press'), ex('Leg Extension', 'Leg_Extensions')]],
      ['HAMSTRINGS & GLUTES', [ex('Romanian Deadlift', 'Romanian_Deadlift'), ex('Lying Leg Curl', 'Lying_Leg_Curls'), ex('Walking Lunges', 'Barbell_Walking_Lunge')]],
      ['CALVES', [ex('Standing Calf Raise', 'Standing_Calf_Raises')]],
    ] },
    { en: 'REST', ar: 'راحة', rest: true },
    { en: 'SHOULDERS + TRAPS', ar: 'الكتاف والترابيس', groups: [
      ['SHOULDERS', [ex('Overhead Press', 'Standing_Military_Press'), ex('Dumbbell Shoulder Press', 'Dumbbell_Shoulder_Press'),
                     ex('Lateral Raise', 'Side_Lateral_Raise'), ex('Rear Delt Fly', 'Reverse_Flyes'), ex('Face Pull', 'Face_Pull')]],
      ['TRAPS', [ex('Barbell Shrug', 'Barbell_Shrug'), ex('Dumbbell Shrug', 'Dumbbell_Shrug')]],
    ] },
    { en: 'ARMS + ABS', ar: 'الذراعين والكرش', groups: [
      ['BICEPS', [ex('Preacher Curl', 'Preacher_Curl'), ex('Concentration Curl', 'Concentration_Curls')]],
      ['TRICEPS', [ex('Close-Grip Bench Press', 'Close-Grip_Barbell_Bench_Press'), ex('EZ-Bar Skull Crusher', 'EZ-Bar_Skullcrusher')]],
      ['ABS', [ex('Hanging Leg Raise', 'Hanging_Leg_Raise'), ex('Cable Crunch', 'Cable_Crunch'), ex('Plank', 'Plank', [1])]],
    ] },
    { en: 'REST', ar: 'راحة', rest: true },
  ];

  // pick the word unit so the intro speech fills ~INTRO seconds
  const keys = {};
  const GROUPS = LINES.map((l, i) => { const m = l.match(/^#(\S+)\s+(.*)$/); keys[m[1]] = i; return m[2]; });
  const probe = KIT.buildTimeline(GROUPS, { unit: 0.06, start: 0.3, tail: 0 });
  const unit = (0.06 * (INTRO - 0.9 - 0.3)) / (probe.words[probe.words.length - 1].end - 0.3);
  const T = KIT.buildTimeline(GROUPS, { unit, start: 0.3, tail: 0 });
  const word = (key, wi) => {
    const w = T.words[T.groups[keys[key]].words[wi < 0 ? T.groups[keys[key]].words.length + wi : wi]];
    if (!w) throw new Error(`line ${key} has no word #${wi}`);
    return w;
  };
  const S = (key, wi = 0) => word(key, wi).start;

  const c = {
    title: S('q', 2), shrink: S('s1'), lifter: S('s2', 2),
    chips: [0, 1, 2, 3, 4].map((i) => S('s3', 0) + i * 0.16), tiles: S('s4', 1), assign: S('s5', 1), assignEnd: S('s6', 1) + 0.3,
    table: S('ex'), rows: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'].map((k) => S(k)),
    introEnd: INTRO,
  };

  // ---------- day pages ----------
  const ROW = 0.55; // seconds between exercise rows
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
  const sfx = [
    pop(c.title, 1.0, 0.75), { type: 'whoosh', at: c.shrink - 0.1, gain: 0.35, dur: 0.3 }, pop(c.lifter, 0.9),
    ...c.chips.map((t, i) => pop(t, 1.1 + i * 0.1, 0.5)),
    ...Array.from({ length: 7 }, (_, i) => ({ type: 'rep', at: c.tiles + i * 0.09, gain: 0.32, p: i * 2 })),
    ...c.chips.map((_, i) => ({ type: 'rep', at: c.assign + 0.25 + i * ((c.assignEnd - c.assign - 0.3) / 5), gain: 0.36, p: 12 - i })),
    { type: 'whoosh', at: c.table - 0.1, gain: 0.4, dur: 0.3 },
    ...c.rows.map((t, i) => pop(t + 0.05, [3, 6].includes(i) ? 0.75 : 1.0 + i * 0.07, 0.6)),
    ...pages.flatMap((p) => [
      { type: 'whoosh', at: p.from - 0.08, gain: 0.45, dur: 0.32 },
      pop(p.from + 0.15, 1.0, 0.7),
      ...(p.rest ? [{ type: 'ding', at: p.from + 0.6, gain: 0.3, p: 1046.5 }]
        : [...Array.from({ length: p.n }, (_, k) => pop(p.from + 1.2 + k * ROW, 1.1 + k * 0.06, 0.5)),
           { type: 'ding', at: p.from + 1.2 + p.n * ROW + 0.1, gain: 0.32, p: 1568.0 }]),
    ]),
  ];

  const stills = pages.filter((p) => !p.rest).map((p) => ({ name: `bro-split-pages/day-${p.day}.png`, at: +(p.to - 0.5).toFixed(2) }));

  const TL = { FPS: 30, DURATION, OUT: 'bro-split.mp4', words: T.words, groups: T.groups, cues: c, pages, sfx, stills, ROW };
  if (typeof module !== 'undefined' && module.exports) module.exports = TL;
  else root.TL = TL;
})(typeof window !== 'undefined' ? window : globalThis);
