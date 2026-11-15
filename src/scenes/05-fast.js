// Scene 5 – Fast-digesting carbs: quick cuts, speed lines, blood-sugar spike and crash.
import { C, div, sticker, text, box, svgEl } from '../engine.js';

export default function fast(ctx) {
  const { root, tl, dur, T } = ctx;
  ctx.bg(C.black);

  // speed lines racing right → left
  const lines = div(root, { position: 'absolute', left: '-1080px', top: '-200px', width: '3240px', height: '2400px',
    background: `repeating-linear-gradient(0deg, transparent 0 130px, ${C.orange}40 130px 138px, transparent 138px 300px, ${C.cream}22 300px 304px)`,
    transform: 'rotate(-12deg)' });
  const streaks = Array.from({ length: 9 }, (_, i) => {
    const s = div(root, { position: 'absolute', left: '0', top: 120 + i * 205 + 'px', width: 300 + (i % 3) * 160 + 'px', height: '14px', borderRadius: '7px', background: i % 2 ? C.orange : C.cream, opacity: '.8' });
    return { el: s, speed: 2400 + (i * 733) % 1500, off: (i * 517) % 2000 };
  });
  ctx.onFrame((t) => streaks.forEach((s) => {
    const x = 1300 - ((s.off + s.speed * t) % 2200);
    s.el.style.transform = `translateX(${x}px) rotate(-12deg)`;
  }));
  void lines;

  const title = text(root, T.title, { y: 290, size: 250, color: C.orange, fit: 900 });
  title.style.fontStyle = 'italic';
  ctx.slam(title, 0.4, { shake: 22 });
  tl.to(title, { skewX: -8, duration: 0.3 }, 0.7);
  const z = sticker(root, 'bolt', { x: 150, y: 250, size: 210, rot: -14 });
  ctx.pop(z, 0.75, { sound: 'zap' });
  tl.to(z, { rotation: 10, duration: 0.12, yoyo: true, repeat: 40, ease: 'none' }, 1.2);

  // rapid-fire stickers, each with a zoom-punch (follows: sugar, sweets, juice)
  const items = [
    ['sugar', 255, 640, 390, -8, 1.05, T.items[0]],
    ['candy', 830, 570, 340, 12, 1.75, T.items[1]],
    ['donut', 520, 900, 290, -6, 2.05, null],
    ['juice', 850, 955, 320, 8, 2.55, T.items[2]],
  ];
  items.forEach(([name, x, y, size, rot, t, label], i) => {
    const s = sticker(root, name, { x, y, size, rot });
    ctx.fly(s, t - 0.2, { fromX: i % 2 ? 900 : -900, fromY: 0, spin: 0, dur: 0.22, sound: 'pop' });
    ctx.punch(t, 1.14, 0.25);
    tl.to(s.inner, { x: 5, y: -4, duration: 0.05, yoyo: true, repeat: Math.ceil((dur - t) / 0.05), ease: 'none' }, t + 0.1);
    if (label) {
      const lab = text(root, label, { x: x + (name === 'sugar' ? 30 : -20), y: y + (name === 'juice' ? 180 : name === 'candy' ? 170 : 200), size: 60, font: 'body', color: C.black, bg: C.orange, rot: -rot / 2 });
      lab.style.zIndex = '5';
      ctx.pop(lab, t + 0.05, { sound: null, dur: 0.3 });
    }
  });

  // blood-sugar chart: violent spike then crash
  const card = box(root, { x: 540, y: 1335, w: 960, h: 440, bg: C.cream, radius: 44, border: `8px solid ${C.orange}`, rot: -1.5 });
  tl.fromTo(card, { x: -700 }, { x: 540, duration: 0.3, ease: 'power4.out' }, 2.95);
  ctx.sfx('whoosh', 2.85, 0.7);
  const chart = svgEl(card, { x: 472, y: 235, w: 900, h: 360, viewBox: '0 0 900 360' }, `
    <path d="M40 250 H860" stroke="${C.black}" stroke-width="5" stroke-dasharray="4 16" stroke-linecap="round" fill="none"/>
    <path id="spike" d="M40 250 C120 250 150 244 200 220 C260 190 280 40 350 34 C420 30 440 250 520 300 C600 340 720 318 860 312"
      fill="none" stroke="${C.red}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`);
  text(card, T.graph, { x: 760, y: 62, size: 50, font: 'body', color: C.cream, bg: C.black });
  const spike = chart.querySelector('#spike');
  spike.setAttribute('pathLength', '1'); spike.style.strokeDasharray = '1';
  tl.fromTo(spike, { strokeDashoffset: 1 }, { strokeDashoffset: 0.56, duration: 0.5, ease: 'power3.in' }, 3.35);   // up
  tl.to(spike, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, 4.25);                                    // crash
  ctx.sfx('riser', 3.3); ctx.sfx('impact', 3.85, 0.9); ctx.shake(3.85, 18);
  ctx.sfx('fall', 4.25);
  const up = text(card, '↑', { x: 330, y: 150, size: 120, font: 'body', color: C.red });
  ctx.pop(up, 3.85, { sound: null, dur: 0.3 });
  const down = text(card, '↓', { x: 600, y: 190, size: 120, font: 'body', color: C.black });
  ctx.pop(down, 4.7, { sound: 'blip', dur: 0.3 });

  const line = text(root, T.line, { y: 1620, size: 84, color: C.cream, split: true, fit: 960 });
  ctx.words(line, 4.3, { stagger: 0.14 });
}
