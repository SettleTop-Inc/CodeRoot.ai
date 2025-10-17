# Installation

This repository contains a VS Code extension and a set of repository-backed artifacts used by CodeRoot.

Minimum steps to get started locally:

- Ensure Node.js (16+) is installed and `node` is on your PATH. The repository uses ESM modules (`"type": "module"` in `package.json`).
- Open the workspace root in VS Code (the folder that contains `package.json`).
- Enable the extension host (run the extension in a development host if you are developing the extension).

Initialize the CodeRoot project in a workspace (creates `.coderoot` and default config):

```pwsh
# From the workspace root
node --version
# Use the VS Code command palette: "CodeRoot: Initialize CodeRoot Project"
```

Publishing the repository-backed wiki (dry-run):

The repository includes `scripts/init-wiki.js`, a cross-platform tool that copies `docs/wiki/*` into a temporary clone of the repository wiki and can push the changes.

Dry-run (no network push):

```pwsh
node scripts/init-wiki.js --docs docs/wiki --dry-run
```

To actually publish you must have push rights and a configured `origin` remote; omit `--dry-run` to commit and push.

Files created locally by core features:

- `.coderoot/v1/files/` — journal JSONL event rotations
- `.coderoot/v1/snapshots/` — generated PCM snapshots (`.pcm.json`)
- `.coderoot/v1/index/manifest.json` — repository manifest (schema_version 1.1.7)

See the Commands page for extension commands and the Architecture page for runtime flows.

Installation: quick guide

1. Fresh install (developer flow):

	a. Clone the repo and open in VS Code.
	b. Run `npm install` if you are changing dependencies.
	c. Build the extension: `npm run build`.
	d. Run the extension in a VS Code Extension Development Host (F5).

2. Update (pull & rebuild):

	1. Pull latest changes locally.
	2. Rebuild: `npm run build`.
	3. Reload VS Code dev host.

3. Uninstall from VS Code (dev host):

	- Close the dev host or uninstall via the Extensions view in VS Code.

CLI vs VS Code paths

- CLI: scripts in `scripts/` (e.g., `scripts/init-wiki.js`, `scripts/migrate-legacy-pcm.mjs`). These are ESM and require `node` (v16+). Use `node scripts/<name> --help` when available.
- VS Code: use the Command Palette (Ctrl/Cmd+Shift+P) and run commands that start with "CodeRoot:" listed in `Commands.md`.

Sanity check (dry-run)

Example: verify the wiki workflow does not push:

```pwsh
# Example: Dry-run the wiki publish
node scripts/init-wiki.js --docs docs/wiki --dry-run
```

How to verify

1. Confirm the dry-run prints the temporary clone path and lists files to copy.
2. Inspect `docs/wiki` files locally for expected content.

Safe-use callout

> Tip: run the dry-run first. If you decide to publish, confirm `git remote -v` and that `origin` points to the intended repo.

