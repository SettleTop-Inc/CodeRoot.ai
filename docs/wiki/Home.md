# CodeRoot.ai — Project Home

Welcome to CodeRoot.ai (CodeRoot-Core). This repository contains the VS Code extension and core libraries that capture, track, and report on code provenance, edits, and AI interactions using the PCM journal format.

Key resources


Start here (one-screen):

1. Read this page (you are here).
2. Review Installation.md for local setup and dry-run commands.
3. Use Commands.md to learn the extension actions you can run from VS Code.
4. Read PCM_1.1.7_Summary.md for a short explanation of the data model.

Glossary (short)

- PCM: Provenance Composition Map — newline-delimited events describing edits.
- Journal: JSONL event logs under `.coderoot/v1/files/`.
- Snapshot: computed per-file `.pcm.json` under `.coderoot/v1/snapshots/`.

Start here checklist

1. Open this repo in VS Code.
2. Run: `node scripts/init-wiki.js --docs docs/wiki --dry-run` to verify wiki pages are ready. (Dry-run only.)
3. Use the quick commands in `Commands.md` for local actions.

Safe-use reminder

> Warning: always run the wiki script with `--dry-run` first. Do not push wiki changes from an environment you do not control.

See the other pages below for details.

