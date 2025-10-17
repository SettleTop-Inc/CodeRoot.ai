#!/usr/bin/env node
import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Simplified script: always publish markdown files from `docs/` to the `wiki` branch
// Configuration via environment variables:
//  - DRY_RUN=1        -> no git clone/commit/push, just list files
//  - DEPLOY_WIKI_TOKEN -> PAT used to authenticate git pushes in CI (preferred)
// The script assumes it's run from the repository root (or within scripts/) and
// will read docs/ relative to the repository root.

async function removeAllButGit(dir) {
  const entries = await fsp.readdir(dir);
  for (const e of entries) {
    if (e === '.git') continue;
    await fsp.rm(path.join(dir, e), { recursive: true, force: true });
  }
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
  const scriptDir = path.dirname(__filename);
  const repoRoot = path.resolve(scriptDir, '..');
  const docsDir = path.resolve(repoRoot, 'docs');
  const tempBase = path.join(os.tmpdir(), 'coderoot-wiki-clone-' + Date.now());
  const branch = 'wiki';
  const isDry = !!process.env.DRY_RUN || process.env.DRY_RUN === '1';

  console.log('Repo root:', repoRoot);
  console.log('Docs dir:', docsDir);
  console.log('Temp dir:', tempBase);
  if (isDry) console.log('Dry run: listing markdown files only');

  const isCI = process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true';

  if (isCI && !isDry) {
    if (!process.env.DEPLOY_WIKI_TOKEN && !process.env.GITHUB_TOKEN) {
      console.error('ERROR: No authentication token available in CI.');
      console.error('Set repository secret DEPLOY_WIKI_TOKEN (a PAT with Contents: write) or ensure GITHUB_TOKEN is available.');
      process.exit(20);
    }
    if (process.env.DEPLOY_WIKI_TOKEN) process.env.GITHUB_TOKEN = process.env.DEPLOY_WIKI_TOKEN;
  }

  if (!fs.existsSync(docsDir)) {
    console.error('Docs folder not found at', docsDir);
    process.exitCode = 2;
    return;
  }

  if (isDry) {
    const samples = await listMarkdownFiles(docsDir);
    console.log('DRY RUN: markdown files found under docs/:', samples.join(', '));
    return;
  }

  try {
    if (fs.existsSync(tempBase)) {
      console.log('Removing existing temp dir', tempBase);
      await fsp.rm(tempBase, { recursive: true, force: true });
    }

    // Clone the main repository and push docs into the wiki branch
    const repoUrl = execSync(`git -C "${repoRoot}" remote get-url origin`).toString().trim();
    console.log('Cloning repository:', repoUrl, 'to', tempBase);
    exec(`git clone "${repoUrl}" "${tempBase}"`, { mask: `git clone "${repoUrl}" "${tempBase}"` });

    // checkout or create wiki branch
    exec(`git -C "${tempBase}" fetch origin ${branch}:${branch} || true`);
    // create branch if it doesn't exist
    exec(`git -C "${tempBase}" checkout -B ${branch}`);

    // remove everything except .git
    console.log('Cleaning working tree (preserving .git)...');
    await removeAllButGit(tempBase);

    console.log('Copying markdown files to branch...');
    await copyMarkdownRecursive(docsDir, tempBase);

    // commit & push
    exec(`git -C "${tempBase}" add --all`);
    const status = execSync(`git -C "${tempBase}" status --porcelain`).toString().trim();
    if (!status) { console.log('No changes to commit.'); return; }
    exec(`git -C "${tempBase}" commit -m "chore(docs): update wiki branch from docs/" || true`);
    exec(`git -C "${tempBase}" push origin ${branch}`, { mask: `git -C "${tempBase}" push origin ${branch}` });
    console.log('Docs branch updated successfully.');
  } catch (err) {
    console.error('Failed to update wiki branch:', err && err.message ? err.message : err);
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
