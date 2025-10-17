# Commands

This page lists the primary VS Code commands registered by the CodeRoot extension and what they do.


Commands and quick examples

1. coderoot.openQuickMenu

	- Purpose: Open the CodeRoot quick menu (safe when not initialized).
	- Use from: VS Code Command Palette (CodeRoot: Quick Menu).

2. coderoot.initProject

	- Purpose: Initialize the workspace for CodeRoot. Creates `.coderoot/config.json` and baseline state.
	- Example: run from Command Palette: "CodeRoot: Initialize CodeRoot".

3. coderoot.toggleJournal

	- Purpose: Enable/disable journaling (persisted in `.coderoot`). Requires initialization.

4. coderoot.setInventoryModeModified / coderoot.setInventoryModeAll

	- Purpose: Switch inventory indexing mode between `modified` and `all`.

5. coderoot.toggleVisibility

	- Purpose: Toggle `.coderoot` visibility in explorer (workspace or per-folder).

6. coderoot.autoCommit / coderoot.autoCommitDryRun

	- Purpose: Auto-commit helper (dry-run shows which files would be staged).
	- Example (dry-run): the dry-run command writes details to the extension output channel — use `coderoot.autoCommitDryRun`.

7. coderoot.generateReport

	- Purpose: Generate JSON + Markdown report via `assets/ci-reporter.mjs`.
	- Example (from command): run `CodeRoot: Generate Report` in the Command Palette. The extension will prompt to open the generated Markdown.

8. Identity & migration utilities

	- `coderoot.consolidateIdentitiesNow`, `coderoot.runIdentitySweep`, `coderoot.trustIdentitySeeds`, `coderoot.migrateSnapshotsPerUser`, `coderoot.migrateLegacyPCM`
	- Purpose: Maintenance and migration tasks. `migrateLegacyPCM` prompts for Dry-run vs Apply and can use `scripts/migrate-legacy-pcm.mjs`.

Notes & verification

1. Many commands require the workspace to be initialized and journaling enabled; the extension shows warnings if preconditions fail.
2. How to verify: after running commands that change state, use the Output channel (CodeRoot) or inspect `.coderoot/v1/*` files.

