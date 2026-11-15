// Boots the composition: builds every scene onto one paused master timeline
// and exposes window.__seek(t) for the frame renderer.
// Open index.html through `npm run preview` to watch it play in real time.
import { VIDEO, BRAND as C } from './config.js';
import { SCENES } from './content.js';
import { makeContext, addTransition, grain, div, W, H } from './engine.js';

const gsap = window.gsap;
const stage = document.getElementById('stage');
const params = new URLSearchParams(location.search);

async function boot() {
  await Promise.all([
    document.fonts.load("400 40px Lalezar", 'شنو'),
    document.fonts.load("700 40px Cairo", 'شنو'),
    document.fonts.load("900 40px Cairo", 'شنو'),
  ]);
  await document.fonts.ready;

  const master = gsap.timeline({ paused: true });
  const cues = [];
  const sceneLayer = div(stage, { position: 'absolute', inset: '0' });
  const transLayer = div(stage, { position: 'absolute', inset: '0', pointerEvents: 'none' });

  const built = SCENES.map((scene) => {
    const ctx = makeContext(scene, sceneLayer, master, cues);
    scene.build(ctx);
    if (scene.transition) addTransition(master, transLayer, scene.start, scene.transition, cues);
    return { scene, ctx };
  });

  grain(stage);
  const bar = div(stage, { position: 'absolute', left: '0', top: '0', height: '10px', width: W + 'px', background: C.black, transformOrigin: '0 50%', opacity: '0.85' });

  window.__seek = (t) => {
    t = Math.max(0, Math.min(VIDEO.duration, t));
    for (const { scene, ctx } of built) {
      const on = t >= scene.start && t < scene.start + scene.dur + 1e-6;
      ctx.wrap.style.visibility = on ? 'visible' : 'hidden';
    }
    master.time(t, false);
    for (const { scene, ctx } of built) {
      if (t >= scene.start && t < scene.start + scene.dur + 1e-6) ctx.hooks.forEach((f) => f(t - scene.start));
    }
    bar.style.transform = `scaleX(${t / VIDEO.duration})`;
  };
  window.__cues = cues.sort((a, b) => a.t - b.t);
  window.__meta = { video: VIDEO, scenes: SCENES.map(({ id, start, dur, vo }) => ({ id, start, dur, vo })) };
  window.__seek(0);
  window.__ready = true;

  if (!params.has('render')) preview();
}

// Real-time preview in a normal browser tab (space = pause, arrows = ±1s, ?t=12 to start at 12s)
function preview() {
  const fitStage = () => {
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(${(innerWidth - W * s) / 2}px,0) scale(${s})`;
  };
  fitStage(); addEventListener('resize', fitStage);
  const audio = new Audio('output/mix.wav');
  let t = parseFloat(params.get('t') || '0'), playing = true, last = performance.now();
  audio.currentTime = t; audio.play().catch(() => {});
  const hud = document.getElementById('hud');
  const loop = (now) => {
    if (playing) t += (now - last) / 1000;
    last = now;
    if (t > VIDEO.duration) { t = 0; audio.currentTime = 0; }
    window.__seek(t);
    hud.textContent = t.toFixed(2) + 's';
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  addEventListener('keydown', (e) => {
    if (e.code === 'Space') { playing = !playing; playing ? audio.play().catch(() => {}) : audio.pause(); }
    if (e.code === 'ArrowRight') t = Math.min(VIDEO.duration, t + 1);
    if (e.code === 'ArrowLeft') t = Math.max(0, t - 1);
    audio.currentTime = t;
  });
}

boot();
