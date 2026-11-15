// Scene 7 – Summary: a full plate and the takeaway line.
import { C, W, div, sticker, text, box } from '../engine.js';

export default function outro(ctx) {
  const { root, tl, dur, T } = ctx;
  ctx.bg(C.orange);

  const rays = div(root, { position: 'absolute', left: W / 2 - 1300 + 'px', top: 650 - 1300 + 'px', width: '2600px', height: '2600px', borderRadius: '50%',
    background: 'repeating-conic-gradient(from 0deg, rgba(255,243,224,.14) 0 9deg, transparent 9deg 18deg)' });
  tl.fromTo(rays, { rotation: 0 }, { rotation: -30, duration: dur, ease: 'none' }, 0);

  const plate = box(root, { x: 540, y: 650, w: 760, h: 760, bg: C.cream, radius: 999, border: `12px solid ${C.black}`, shadow: `14px 18px 0 ${C.black}` });
  div(plate, { position: 'absolute', inset: '60px', borderRadius: '50%', border: `6px solid ${C.black}33` });
  tl.fromTo(plate, { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.5)' }, 0.3);
  ctx.sfx('pop', 0.35);

  const foods = [
    ['wholebread', 345, 520, 350, -12],
    ['rice', 735, 520, 360, 10],
    ['potato', 320, 800, 330, 10],
    ['lentils', 760, 800, 350, -8],
    ['broccoli', 540, 385, 300, 4],
    ['apple', 540, 915, 280, -6],
    ['wheat', 540, 650, 320, 12],
  ].map(([name, x, y, size, rot], i) => {
    const s = sticker(root, name, { x, y, size, rot });
    ctx.pop(s, 0.7 + i * 0.13, { dur: 0.45 });
    ctx.float(s, { amp: 7, rot: 2.5, period: 2 + i * 0.21 });
    return s;
  });
  void foods;

  [[130, 300, 110], [960, 250, 90], [950, 1010, 120], [110, 1030, 90]].forEach(([x, y, size], i) => {
    const st = sticker(root, 'star', { x, y, size, outline: 0 });
    tl.fromTo(st, { scale: 0, rotation: 0 }, { scale: 1, rotation: 180, duration: 0.6, yoyo: true, repeat: 9, ease: 'sine.inOut' }, 1.2 + i * 0.25);
  });
  ctx.sfx('sparkle', 1.3, 0.8);

  const l1 = text(root, T.l1, { y: 1195, size: 150, color: C.cream, split: true, fit: 980 });
  ctx.words(l1, 1.9, { stagger: 0.2 });

  const l2 = text(root, T.l2, { y: 1400, size: 300, color: C.black });
  ctx.slam(l2, 2.75, { shake: 22 });
  ctx.burst(540, 1400, 3.02, { n: 16, r0: 380, r1: 620, len: 90, color: C.cream });
  tl.to(l2, { scale: 1.06, duration: 0.6, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 3.2);

  const bulb = sticker(root, 'bulb', { x: 955, y: 1330, size: 190, rot: 14 });
  ctx.pop(bulb, 3.1, { sound: 'chime' });
  ctx.float(bulb, { amp: 8, rot: 5, period: 1.6 });

  const cta = text(root, T.cta, { y: 1590, size: 66, font: 'body', color: C.cream, bg: C.black, rot: -2 });
  ctx.pop(cta, 3.9);

  tl.fromTo(ctx.cam, { scale: 1 }, { scale: 1.04, duration: dur - 3, ease: 'sine.inOut', immediateRender: false }, 3);
}
