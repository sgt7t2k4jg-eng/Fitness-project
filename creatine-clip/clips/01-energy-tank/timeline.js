// Shared timeline: word timings + visual/SFX cue points.
// Used by index.html (visuals), render.js (frames) and sfx.py (audio, via timeline.json).
(function (root) {
  const FPS = 30;
  const DURATION = 9.8; // seconds — strictly under 10
  const SPEECH_START = 0.1;
  const SPEECH_END = 9.5;

  // Exact voiceover script, split into caption groups. "|" marks a pause after the group.
  const GROUPS = [
    'ملي كتكون كتدير',
    'واحد السيري|',
    'العضلة ديالك',
    'كتحرق واحد الطاقة',
    'سريعة بزاف|',
    'وكتسالي ليها دغيا||',
    'الكرياتين',
    'كيعمّر ليك',
    'هاد الخزان||',
    'يعني فاللخر',
    'ديال السيري|',
    'ملي كنتي غادي تحبس|',
    'كتلقى راسك',
    'قادر تزيد',
    'ريبة ولا جوج',
  ];

  const letters = (w) => w.replace(/[ً-ْ]/g, '').length;
  const words = [];
  const groups = [];
  let cursor = 0;
  GROUPS.forEach((g, gi) => {
    const pause = (g.match(/\|/g) || []).length * 1.3;
    const ws = g.replace(/\|/g, '').trim().split(/\s+/);
    const idx = [];
    ws.forEach((text) => {
      const weight = letters(text) + 1.5;
      idx.push(words.length);
      words.push({ text, group: gi, u0: cursor, u1: cursor + weight });
      cursor += weight;
    });
    cursor += pause;
    groups.push({ words: idx });
  });
  const total = words[words.length - 1].u1;
  const scale = (SPEECH_END - SPEECH_START) / total;
  words.forEach((w) => {
    w.start = +(SPEECH_START + w.u0 * scale).toFixed(3);
    w.end = +(SPEECH_START + w.u1 * scale).toFixed(3);
    delete w.u0;
    delete w.u1;
  });
  groups.forEach((g, i) => {
    g.start = words[g.words[0]].start;
    g.end = i + 1 < groups.length ? words[groups[i + 1].words[0]].start : DURATION + 1;
  });

  const s = (i) => words[i].start;
  const e = (i) => words[i].end;
  const REPS = 8;
  const repStart = s(21);
  const repEnd = e(23);
  const cues = {
    dumbbell: s(4), // السيري
    muscle: s(5), // العضلة
    drainStart: s(7), // كتحرق
    bolt: s(9), // الطاقة
    drainEnd: e(11), // بزاف
    empty: s(12), // وكتسالي
    emptyEnd: e(14),
    scene2: s(15), // الكرياتين
    fillStart: s(16), // كيعمّر
    fillEnd: s(19), // الخزان
    full: s(19) + 0.04,
    scene3: s(20), // يعني
    reps: Array.from({ length: REPS }, (_, i) => +(repStart + ((i + 0.5) * (repEnd - repStart)) / REPS).toFixed(3)),
    stop: s(27), // تحبس
    stopOut: s(30), // قادر
    plus1: s(32), // ريبة
    plus2: s(34), // جوج
  };

  // SFX cue list, consumed by sfx.py (word ticks are added automatically).
  const c = cues;
  const sfx = [
    { type: 'pop', at: c.dumbbell, gain: 0.7, p: 1.0 },
    { type: 'pop', at: c.muscle, gain: 0.7, p: 1.2 },
    { type: 'pop', at: c.bolt, gain: 0.7, p: 1.45 },
    { type: 'drain', at: c.drainStart, gain: 0.2, dur: c.drainEnd - c.drainStart },
    { type: 'thud', at: c.empty, gain: 0.85 },
    { type: 'whoosh', at: c.scene2 - 0.1, gain: 0.5, dur: 0.36 },
    { type: 'pop', at: c.scene2, gain: 0.75, p: 1.1 },
    { type: 'fill', at: c.fillStart, gain: 0.22, dur: c.fillEnd - c.fillStart },
    { type: 'ding', at: c.full, gain: 0.42, p: 1318.5 },
    { type: 'whoosh', at: c.scene3 - 0.08, gain: 0.5, dur: 0.36 },
    ...c.reps.map((at, i) => ({ type: 'rep', at, gain: 0.42, p: i })),
    { type: 'bonk', at: c.stop, gain: 0.6 },
    { type: 'whoosh', at: c.stopOut - 0.04, gain: 0.4, dur: 0.24 },
    { type: 'pop', at: c.plus1, gain: 0.8, p: 1.3 },
    { type: 'ding', at: c.plus1, gain: 0.25, p: 1568.0 },
    { type: 'pop', at: c.plus2, gain: 0.8, p: 1.6 },
    { type: 'ding', at: c.plus2, gain: 0.4, p: 2093.0 },
  ];

  const TL = { FPS, DURATION, OUT: 'creatine-01-energy-tank.mp4', words, groups, cues, sfx };
  if (typeof module !== 'undefined' && module.exports) module.exports = TL;
  else root.TL = TL;
})(typeof window !== 'undefined' ? window : globalThis);
