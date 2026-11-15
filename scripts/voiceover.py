#!/usr/bin/env python3
"""OPTIONAL: generate a draft voiceover with a Moroccan-Arabic neural voice (edge-tts).

NOTE: this script could not be run in the environment the project was built in
(the TTS host was blocked by the network policy), so treat it as a starting point.
A recorded human voiceover saved as audio/voiceover.wav is the recommended route.

  pip install edge-tts
  node scripts/render.mjs --still 0      # writes build/meta.json
  python3 scripts/voiceover.py           # → audio/voiceover.wav (each line starts with its scene)
  node scripts/mux.mjs
"""
import asyncio, json, os, subprocess, sys
import edge_tts

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
VOICE = os.environ.get('VO_VOICE', 'ar-MA-JamalNeural')    # or ar-MA-MounaNeural
RATE = os.environ.get('VO_RATE', '+0%')
LEAD = 0.35                                                 # seconds after the scene starts

async def main():
    meta = json.load(open(os.path.join(ROOT, 'build/meta.json')))
    tmp = os.path.join(ROOT, 'build/vo'); os.makedirs(tmp, exist_ok=True)
    inputs, filters = [], []
    for i, s in enumerate(meta['scenes']):
        clip = os.path.join(tmp, f"{i:02d}-{s['id']}.mp3")
        await edge_tts.Communicate(s['vo'], VOICE, rate=RATE).save(clip)
        length = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clip]))
        if length + LEAD > s['dur']:
            print(f"WARNING: {s['id']} voiceover is {length:.1f}s but the scene lasts {s['dur']}s – raise VO_RATE or lengthen the scene", file=sys.stderr)
        inputs += ['-i', clip]
        filters.append(f"[{i}:a]adelay={int((s['start'] + LEAD) * 1000)}:all=1[a{i}]")
    n = len(meta['scenes'])
    graph = ';'.join(filters) + ';' + ''.join(f'[a{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0[out]'
    subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', graph, '-map', '[out]',
                           '-t', str(meta['video']['duration']), '-ar', '48000', '-ac', '2', os.path.join(ROOT, 'audio/voiceover.wav')])
    print('audio/voiceover.wav written')

asyncio.run(main())
