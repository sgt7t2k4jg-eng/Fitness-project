// ─────────────────────────────────────────────────────────────────────────
//  EDIT ME: everything a non-animator needs to change lives in this file
//  (brand colours and video size are in config.js).
//  - scene order, start time and duration (seconds)
//  - the voiceover sentence of each scene (used for the VO script / SRT)
//  - every on-screen Arabic string
//  A new Reel = copy this file's structure, swap texts, re-order scenes.
// ─────────────────────────────────────────────────────────────────────────
import hook from './scenes/01-hook.js';
import sources from './scenes/02-sources.js';
import body from './scenes/03-body.js';
import energy from './scenes/04-energy.js';
import fast from './scenes/05-fast.js';
import slow from './scenes/06-slow.js';
import outro from './scenes/07-outro.js';

// transition = how this scene is revealed (played over the cut from the previous scene)
export const SCENES = [
  {
    id: 'hook', build: hook, start: 0, dur: 6,
    vo: 'شنو هي الكربوهيدرات؟ وعلاش جسمك محتاجها؟',
    text: { kicker: 'شنو هي', title: 'الكربوهيدرات؟', sub: 'وعلاش جسمك محتاجها؟' },
  },
  {
    id: 'sources', build: sources, start: 6, dur: 9, transition: 'slide-up',
    vo: 'الخبز، الروز، البطاطا، العدس، وحتى السكر… كلهم مصادر ديال الكربوهيدرات.',
    text: {
      tag: 'منين كيجي الكارب؟',
      items: ['الخبز', 'الروز', 'البطاطا', 'العدس', 'السكر'],
      badge: 'كارب',
      line: 'كلهم مصادر ديال الكربوهيدرات',
    },
  },
  {
    id: 'body', build: body, start: 15, dur: 10, transition: 'iris',
    vo: 'ملي كتاكلهم، جسمك كيهضمهم وكيحولهم لگلوكوز… وهاد الگلوكوز كيدخل للدم.',
    text: { title: 'شنو كيوقع فجسمك؟', digest: 'الهضم', glucose: 'گلوكوز', blood: 'الدم', line: 'الگلوكوز كيدخل للدم' },
  },
  {
    id: 'energy', build: energy, start: 25, dur: 11, transition: 'bars',
    vo: 'الگلوكوز هو الطاقة ديالك. واللي شاط، كيتخزن فالكبدة والعضلات على شكل گليكوجين… باش تهز الحديد بقوة.',
    text: { energy: 'طاقة!', liver: 'الكبدة', muscle: 'العضلات', glycogen: 'گليكوجين', power: 'قوة!', fuel: 'الگليكوجين = الوقود ديالك' },
  },
  {
    id: 'fast', build: fast, start: 36, dur: 7, transition: 'slide-left',
    vo: 'السكر، الحلويات والعصير كيتهضمو بالزربة، وكيطلعو السكر فالدم دغيا.',
    text: { title: 'كارب سريع', items: ['السكر', 'الحلويات', 'العصير'], graph: 'السكر فالدم', line: 'كيطلع دغيا… وكيطيح دغيا' },
  },
  {
    id: 'slow', build: slow, start: 43, dur: 10.5, transition: 'iris',
    vo: 'أما الحبوب الكاملة، الروز، البطاطا، العدس، الخضرة والفواكه، فيهم الألياف: كيتهضمو بشوية وكيخليوك شبعان مدة طويلة.',
    text: { title: 'كارب بطيء', fiber: 'الألياف', steady: 'طاقة مستقرة', full: 'شبعان مدة طويلة' },
  },
  {
    id: 'outro', build: outro, start: 53.5, dur: 6.5, transition: 'bars',
    vo: 'إذن… اختار مصادر الكارب بذكاء.',
    text: { l1: 'اختار مصادر الكارب', l2: 'بذكاء.', cta: 'تابعني باش تعرف كثر' },
  },
];
