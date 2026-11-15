// Guarantees the on-screen captions are the voiceover script, word for word.
const fs = require('fs');
const path = require('path');
require('../src/scenes.js');

const norm = (s) => s.replace(/\|/g, ' ').trim().split(/\s+/);
const script = norm(fs.readFileSync(path.join(__dirname, '../script/voiceover.txt'), 'utf8'));
const caps = norm(globalThis.SCENES.map((s) => s.text).join(' '));

for (let i = 0; i < Math.max(script.length, caps.length); i++) {
  if (script[i] !== caps[i]) {
    console.error(`MISMATCH at word ${i + 1}: script="${script[i]}" captions="${caps[i]}"`);
    process.exit(1);
  }
}
console.log(`OK: captions match the script word for word (${script.length} words).`);
