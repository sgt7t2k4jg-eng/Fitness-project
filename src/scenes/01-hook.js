// Scene 1 – Hook: carb foods fly in around the big question.
import { C, W, H, div, sticker, text, svgEl } from '../engine.js';

export default function hook(ctx) {
  const { root, tl, dur, T } = ctx;
  ctx.bg(C.orange);

  // slowly rotating sunburst
  const rays = div(root, {
    position: 'absolute', left: W / 2 - 1300 + 'px', top: 900 - 1300 + 'px', width: '2600px', height: '2600px', borderRadius: '50%',
    background: 'repeating-conic-gradient(from 0deg, rgba(255,243,224,.13) 0 9deg, transparent 9deg 18deg)',
  });
  tl.fromTo(rays, { rotation: 0 }, { rotation: 38, duration: dur, ease: 'none' }, 0);

  const foods = [
    ['sugar', 545, 330, 290, 8, 0, -900],
    ['bread', 235, 530, 400, -12, -700, -500],
    ['rice', 835, 510, 380, 10, 700, -500],
    ['potato', 215, 1420, 370, 14, -700, 500],
    ['lentils', 850, 1410, 390, -8, 700, 500],
    ['apple', 540, 1530, 300, -6, 0, 900],
  ].map(([name, x, y, size, rot, fx, fy], i) => {
    const s = sticker(root, name, { x, y, size, rot });
    ctx.fly(s, 0.25 + i * 0.16, { fromX: fx, fromY: fy, spin: i % 2 ? 160 : -160 });
    ctx.float(s, { amp: 12 + (i % 3) * 4, rot: 3, period: 2.2 + i * 0.23 });
    return s;
  });

  const kicker = text(root, T.kicker, { y: 790, size: 150, color: C.cream, split: true });
  ctx.words(kicker, 1.2, { stagger: 0.14 });

  const title = text(root, T.title, { y: 975, size: 250, color: C.black, fit: 980 });
  ctx.slam(title, 1.75, { shake: 20 });
  ctx.burst(540, 975, 2.0, { n: 14, r0: 520, r1: 760, len: 90, color: C.cream });

  // hand-drawn underline
  const ul = svgEl(root, { x: 540, y: 1100, w: 860, h: 60, viewBox: '0 0 860 60' },
    `<path d="M20 34 C200 6 420 54 600 22 C700 6 800 30 842 22" fill="none" stroke="${C.cream}" stroke-width="16" stroke-linecap="round"/>`);
  ctx.draw(ul.querySelector('path'), 2.15, 0.5);
  ctx.sfx('swish', 2.15, 0.7);

  const sub = text(root, T.sub, { y: 1215, size: 74, font: 'body', color: C.cream, bg: C.black, rot: -3 });
  ctx.pop(sub, 3.3);
  tl.to(sub, { rotation: 2, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 2 }, 3.9);

  // title breathes, then everything rushes at the camera before the cut
  tl.to(title, { scale: 1.05, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 2.6);
  tl.to(ctx.cam, { scale: 1.35, duration: 0.5, ease: 'power3.in' }, dur - 0.5);
  foods.forEach((s, i) => tl.to(s, { x: s._x + (s._x - 540) * 1.6, y: s._y + (s._y - 960) * 1.2, duration: 0.5, ease: 'power3.in' }, dur - 0.5));
}
