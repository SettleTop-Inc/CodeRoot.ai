import fs, { mkdtempSync, writeFileSync, rmSync } from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
// test harness for init-wiki.js

function runTest() {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'coderoot-wiki-test-'));
  const docsWiki = path.join(tmp, 'docs', 'wiki');
  try {
  // create sample wiki page using Node API (cross-platform)
  const dir = path.dirname(path.join(docsWiki, 'Home.md'));
  fs.mkdirSync(dir, { recursive: true });
  const sample = path.join(docsWiki, 'Home.md');
  writeFileSync(sample, '# Home\n\nThis is a test wiki page.');

    console.log('Running init-wiki.js in dry-run mode against', docsWiki);
    execSync(`node "scripts/init-wiki.js" --docs "${docsWiki}" --dry-run`, { stdio: 'inherit' });
    console.log('Dry-run completed');
  } finally {
    // cleanup
    try { rmSync(tmp, { recursive: true, force: true }); } catch {}
  }
}

if (process.argv[1] && process.argv[1].endsWith('init-wiki-test.js')) runTest();
