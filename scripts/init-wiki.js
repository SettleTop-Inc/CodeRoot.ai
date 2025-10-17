#!/usr/bin/env node
import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { remote: 'origin', docs: null, temp: null, dryRun: false, wikiUrl: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--remote' && args[i+1]) { opts.remote = args[++i]; }
    else if (a === '--docs' && args[i+1]) { opts.docs = args[++i]; }
    else if (a === '--temp' && args[i+1]) { opts.temp = args[++i]; }
    else if (a === '--wiki-url' && args[i+1]) { opts.wikiUrl = args[++i]; }
    else if (a === '--dry-run') { opts.dryRun = true; }
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/init-wiki.js [--remote origin] [--docs <path>] [--temp <dir>] [--dry-run]');
      process.exit(0);
    }
  }
  return opts;
}

function exec(cmd, opts = {}) {
  // opts.mask - a string to log instead of the real command (used to avoid leaking tokens)
  if (opts.mask) console.log('>', opts.mask);
  else console.log('>', cmd);
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

// Copy only markdown files from src -> dest, preserving directory structure.
async function copyMarkdownRecursive(src, dest) {
  const stat = await fsp.stat(src);
  if (stat.isDirectory()) {
    const entries = await fsp.readdir(src);
    for (const e of entries) {
      await copyMarkdownRecursive(path.join(src, e), path.join(dest, e));
    }
  } else {
    // Only copy .md files (case-insensitive)
    if (path.extname(src).toLowerCase() === '.md') {
      await fsp.mkdir(path.dirname(dest), { recursive: true });
      await fsp.copyFile(src, dest);
    }
  }
}

// Return a flat list of markdown file paths (relative to root) for dry-run output
async function listMarkdownFiles(root) {
  const out = [];
  async function walk(src, base) {
    const stat = await fsp.stat(src);
    if (stat.isDirectory()) {
      const entries = await fsp.readdir(src);
      for (const e of entries) await walk(path.join(src, e), base);
    } else {
      if (path.extname(src).toLowerCase() === '.md') {
        out.push(path.relative(root, src) || path.basename(src));
      }
    }
  }
  await walk(root, root);
  return out;
}

async function main() {
  const opts = parseArgs();
  const scriptDir = path.dirname(__filename);
  const repoRoot = path.resolve(scriptDir, '..');
  const docsDir = opts.docs ? (path.isAbsolute(opts.docs) ? opts.docs : path.resolve(opts.docs)) : path.resolve(repoRoot, 'docs', 'wiki');
  const tempBase = opts.temp || path.join(os.tmpdir(), 'coderoot-wiki-clone-' + Date.now());

  console.log('Repo root:', repoRoot);
  console.log('Docs dir:', docsDir);
  console.log('Temp dir:', tempBase);
  console.log('Remote:', opts.remote);
  if (opts.dryRun) console.log('Dry run: no git clone/commit/push will be executed');

  if (!fs.existsSync(docsDir)) {
    console.error('Docs wiki folder not found at', docsDir);
    process.exitCode = 2;
    return;
  }

  // Determine remote URL
  let remoteUrl = null;
  try {
    remoteUrl = execSync(`git -C "${repoRoot}" remote get-url ${opts.remote}`).toString().trim();
  } catch (err) {
    console.error(`Could not get remote URL for '${opts.remote}':`, err.message);
    if (!opts.dryRun) { process.exitCode = 3; return; }
  }

  let wikiUrl = null;
  if (opts.wikiUrl) {
    wikiUrl = opts.wikiUrl;
  } else if (remoteUrl) {
    if (/\.git$/.test(remoteUrl)) wikiUrl = remoteUrl.replace(/\.git$/, '.wiki.git');
    else wikiUrl = remoteUrl + '.wiki.git';
  }

  // If running in CI with a GITHUB_TOKEN available, inject it into an https wiki URL so git can authenticate.
  const isCI = process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true';
  let maskedWikiUrl = wikiUrl;
  if (wikiUrl && isCI && process.env.GITHUB_TOKEN) {
    try {
      const token = process.env.GITHUB_TOKEN;
      if (wikiUrl.startsWith('git@')) {
        // convert ssh-style URL to https with token using GITHUB_REPOSITORY if available
        const repo = process.env.GITHUB_REPOSITORY || (remoteUrl && remoteUrl.match(/[:\/]([^\/]+\/[^\/.]+)(?:\.git)?$/) && RegExp.$1);
        if (repo) wikiUrl = `https://x-access-token:${token}@github.com/${repo}.wiki.git`;
      } else if (wikiUrl.startsWith('https://')) {
        wikiUrl = wikiUrl.replace(/^https:\/\//, `https://x-access-token:${token}@`);
      }
      // mask the token in logs
      maskedWikiUrl = wikiUrl.replace(new RegExp(process.env.GITHUB_TOKEN, 'g'), '***');
    } catch (err) {
      // fall back to original wikiUrl if anything goes wrong
      maskedWikiUrl = wikiUrl;
    }
  }

  if (opts.dryRun) {
    console.log('DRY RUN: would clone wiki URL:', maskedWikiUrl || '<unknown remote URL>');
    console.log('DRY RUN: would copy markdown files from', docsDir, 'to temp wiki repo at', tempBase);
    const samples = await listMarkdownFiles(docsDir);
    console.log('DRY RUN: markdown files to copy:', samples.join(', '));
    console.log('DRY RUN complete');
    return;
  }

  // real run
  try {
    if (fs.existsSync(tempBase)) {
      console.log('Removing existing temp dir', tempBase);
      await fsp.rm(tempBase, { recursive: true, force: true });
    }
  console.log('Cloning wiki repo:', maskedWikiUrl, 'to', tempBase);
  exec(`git clone "${wikiUrl}" "${tempBase}"`, { mask: `git clone "${maskedWikiUrl}" "${tempBase}"` });

  console.log('Copying markdown files...');
  await copyMarkdownRecursive(docsDir, tempBase);

    // commit and push
  exec(`git -C "${tempBase}" add --all`);
    // check if there is anything to commit
    const status = execSync(`git -C "${tempBase}" status --porcelain`).toString().trim();
    if (!status) { console.log('No changes to commit.'); return; }
  exec(`git -C "${tempBase}" commit -m "chore(docs): update wiki pages from docs"`);
  exec(`git -C "${tempBase}" push`, { mask: `git -C "${tempBase}" push` });
    console.log('Wiki updated successfully.');
  } catch (err) {
    console.error('Failed to update wiki:', err && err.message ? err.message : err);
    process.exitCode = 10;
  }
}

// ESM entrypoint: call main when this file is executed directly with node
if (process.argv[1] === __filename) {
  // top-level await is supported; ensure returned promise rejections are reported
  main().catch(err => {
    console.error('Unhandled error in init-wiki:', err);
    process.exit(1);
  });
}
