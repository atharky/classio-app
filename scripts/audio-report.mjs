/* Informe de narraciones grabadas.
   node scripts/audio-report.mjs            → cuántos pasos tienen audio y cuáles faltan
   node scripts/audio-report.mjs --write    → escribe audio/manifest.json con la ruta y el texto de cada paso sin audio
   node scripts/audio-report.mjs --strict   → falla si falta algún audio (para activarlo en CI cuando estén todos) */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ANIMS } from '../catalog.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const audioPath = (moduleId, level, step) => `audio/${moduleId}-${level + 1}-${step + 1}.mp3`;

export function audioSteps() {
  const out = [];
  for (const [moduleId, levels] of Object.entries(ANIMS))
    levels.forEach((steps, level) =>
      steps.forEach((s, step) =>
        out.push({
          moduleId,
          level,
          step,
          text: s.say,
          path: audioPath(moduleId, level, step),
          declared: s.audio,
          exists: Boolean(s.audio) && existsSync(ROOT + s.audio),
        }),
      ),
    );
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const all = audioSteps();
  const missing = all.filter((s) => !s.exists);
  console.log(`${all.length - missing.length} de ${all.length} pasos con audio grabado; faltan ${missing.length}.`);
  if (process.argv.includes('--write')) {
    mkdirSync(ROOT + 'audio', { recursive: true });
    writeFileSync(ROOT + 'audio/manifest.json', JSON.stringify(Object.fromEntries(missing.map((s) => [s.path, s.text])), null, 2) + '\n');
    console.log("Escrito audio/manifest.json: graba o genera cada texto y guarda el archivo en la ruta indicada; después añade `audio: '<ruta>'` al paso.");
  }
  if (process.argv.includes('--strict') && missing.length) process.exit(1);
}
