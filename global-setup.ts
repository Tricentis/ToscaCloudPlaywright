import fs from 'fs';
import path from 'path';

const TESTS_DIR = path.join(__dirname, 'tests');
const SELECTION_FILE = path.join(__dirname, '.demo-chaos.json');
const TITLE_PATTERN = /^test\(\s*'([^']+)'/gm;

function discoverTestTitles(dir: string): string[] {
  const titles: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      titles.push(...discoverTestTitles(fullPath));
    } else if (entry.name.endsWith('.spec.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const match of content.matchAll(TITLE_PATTERN)) {
        titles.push(match[1]);
      }
    }
  }
  return titles;
}

// Picks 1-5 tests to intentionally fail this run, so demo runs always contain
// failure evidence (screenshots/video/trace) without hand-editing tests each time.
export default async function globalSetup() {
  const pool = discoverTestTitles(TESTS_DIR);
  const count = 1 + Math.floor(Math.random() * 5);

  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(idx, 1)[0]);
  }

  fs.writeFileSync(SELECTION_FILE, JSON.stringify({ selected }, null, 2));

  console.log(`\n[demo-chaos] Intentionally failing ${selected.length} test(s) this run:`);
  for (const title of selected) console.log(`  - ${title}`);
}
