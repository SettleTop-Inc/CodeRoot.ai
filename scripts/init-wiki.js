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
  // Allow overriding the docs source path via DOCS_SRC (relative to repo root)
  const docsSrc = process.env.DOCS_SRC || 'docs';
  const docsDir = path.resolve(repoRoot, docsSrc);
  const tempBase = path.join(os.tmpdir(), 'coderoot-wiki-clone-' + Date.now());
  const branch = 'wiki';
  const isDry = !!process.env.DRY_RUN || process.env.DRY_RUN === '1';
  const useWorkspace = !!process.env.USE_WORKSPACE || process.env.USE_WORKSPACE === '1';

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

    // Decide whether to operate in the checked-out workspace or clone into a temp dir
    const repoUrl = execSync(`git -C "${repoRoot}" remote get-url origin`).toString().trim();
    let workingDir = tempBase;
    if (useWorkspace) {
      console.log('Using checked-out workspace at', repoRoot, 'to perform branch operations (no second clone).');
      workingDir = repoRoot;
    } else {
      // If running in CI and a token is available, embed it into the clone URL so git push can authenticate.
      let cloneUrl = repoUrl;
      if (isCI && process.env.GITHUB_TOKEN && repoUrl.startsWith('https://')) {
        // Use the token in the URL in the form https://x-access-token:TOKEN@github.com/owner/repo.git
        const token = process.env.GITHUB_TOKEN;
        cloneUrl = repoUrl.replace(/^https:\/\//, `https://x-access-token:${token}@`);
      }
      console.log('Cloning repository:', repoUrl, 'to', tempBase);
      // Mask the token in logs when present
      const maskedClone = cloneUrl.replace(/https:\/\/x-access-token:(?:[^@]+)@/, 'https://x-access-token:<REDACTED>@');
      exec(`git clone "${cloneUrl}" "${tempBase}"`, { mask: `git clone "${maskedClone}" "${tempBase}"` });
    }

    // checkout or create wiki branch
    // operate against the selected workingDir (either temp clone or workspace)
    exec(`git -C "${workingDir}" fetch origin ${branch}:${branch} || true`);
    // create branch if it doesn't exist; save current ref to restore if using workspace
    let originalRef = null;
    if (useWorkspace) {
      try {
        originalRef = execSync(`git -C "${workingDir}" rev-parse --abbrev-ref HEAD`).toString().trim();
      } catch (e) {
        originalRef = null;
      }
    }
    exec(`git -C "${workingDir}" checkout -B ${branch}`);

    // remove everything except .git
    console.log('Cleaning working tree (preserving .git)...');
    await removeAllButGit(workingDir);

    console.log('Copying markdown files to branch...');
    await copyMarkdownRecursive(docsDir, workingDir);

    // commit & push
    exec(`git -C "${tempBase}" add --all`);
    const status = execSync(`git -C "${workingDir}" status --porcelain`).toString().trim();
    if (!status) {
      console.log('No changes to commit.');
      // If we used the workspace, try to restore original ref
      if (useWorkspace && originalRef) {
        try { exec(`git -C "${workingDir}" checkout "${originalRef}"`); } catch (e) { /* ignore */ }
      }
      return;
    }
    // Ensure git author identity is set in the temporary clone so commits succeed in CI
    try {
      const gitUserName = process.env.GIT_USER_NAME || process.env.GIT_COMMITTER_NAME || process.env.GITHUB_ACTOR || 'github-actions';
      const gitUserEmail = process.env.GIT_USER_EMAIL || process.env.GIT_COMMITTER_EMAIL || `${process.env.GITHUB_ACTOR || 'github-actions'}@users.noreply.github.com`;
      exec(`git -C "${workingDir}" config user.name "${gitUserName}"`);
      exec(`git -C "${workingDir}" config user.email "${gitUserEmail}"`);
    } catch (e) {
      console.warn('Warning: failed to set git user identity in temp clone:', e && e.message ? e.message : e);
    }

    exec(`git -C "${workingDir}" commit -m "chore(docs): update wiki branch from docs/" || true`);
    // Mask push so token doesn't leak in logs
    exec(`git -C "${workingDir}" push origin ${branch}`, { mask: `git -C "${workingDir}" push origin ${branch} (token redacted)` });

    // If we modified the workspace, attempt to restore the original branch/ref
    if (useWorkspace && originalRef) {
      try {
        exec(`git -C "${workingDir}" checkout "${originalRef}"`);
      } catch (e) {
        console.warn('Warning: failed to restore original branch/ref:', originalRef, e && e.message ? e.message : e);
      }
    }
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
