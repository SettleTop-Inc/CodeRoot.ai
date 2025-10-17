# Troubleshooting

Common checks and fixes:

- I don't see `.coderoot` files in the repository: the extension hides `.coderoot` from the file explorer by setting `files.exclude`. Use `CodeRoot: Toggle .coderoot visibility` or show hidden files to inspect.
- `generateReport` fails with "assets/ci-reporter.mjs not found": ensure `assets/ci-reporter.mjs` exists in the repository and that `assets/ci-reporter.mjs` is reachable from the extension context (the reporter resolution attempts a few candidate paths).
- `init-wiki.js` ESM errors: the repository `package.json` is ESM (`type: module`) — ensure scripts are run with `node` (v16+) and that the script is executed as ESM.
- Publishing wiki fails to push: confirm `origin` remote points to GitHub and your environment has push credentials; use `--remote <name>` to select a different remote.

If you need help, open a discussion or issue using the repository templates.

Top issues (symptom → quick fix)

1. Symptom: `generateReport` fails with "assets/ci-reporter.mjs not found".

	Fix: Ensure `assets/ci-reporter.mjs` exists and is readable. Verify extension context or run the reporter directly with `node assets/ci-reporter.mjs` (may require `node` ESM invocation).

2. Symptom: `init-wiki.js` ESM error (`require is not defined`).

	Fix: Run the script with Node (v16+) in this ESM repo: `node scripts/init-wiki.js --docs docs/wiki --dry-run`.

3. Symptom: Dry-run lists files but push fails due to permissions.

	Fix: Confirm `git remote -v` and that `origin` points to the expected repo; ensure your SSH key or credential manager is set up.

4. Symptom: Snapshots show empty spans or wrong totals.

	Fix: Ensure your workspace `workspace_salt` was not changed after journal writes. Run `npm run force:snapshots` to rebuild (developer caution).

5. Symptom: Identity consolidation misses expected mappings.

	Fix: Run `CodeRoot: Consolidate Identities Now` and then `CodeRoot: Generate Report` to surface mapping changes.

6. Symptom: Auto-commit does not run unexpectedly.

	Fix: Auto-commit is disabled by default. Check `coderoot.autoCommit.enabled` in workspace settings and ensure journaling is enabled and workspace initialized.

7. Symptom: Linter/validate scripts fail locally.

	Fix: Run `npm install` and ensure Node.js version matches project requirements; run `npm run lint` and fix the reported issues.

8. Symptom: Reported totals differ from local expectations.

	Fix: Inspect `.coderoot/v1/snapshots/<file>.pcm.json` and cross-check `lines_by_origin` and `chars_by_origin`. Remember snapshots may scale distributions to match accurate file bytes when available.

9. Symptom: CLI scripts fail with path errors on Windows.

	Fix: Tools expect ESM-safe imports; ensure scripts use `file://`/pathToFileURL when dynamically importing local modules. Use the provided scripts which handle Windows paths.

10. Symptom: Unexpected schema version warnings.

	Fix: Mixed historical journal versions can be tolerated. Consider running migration tools (`migrateLegacyPCM`) in dry-run first.

When to file an issue

1. If you find a deterministic mismatch between snapshot totals and file contents after rebuilding.
2. If a reporter crash includes an error message you can't interpret.

How to verify fixes

1. Re-run the failing command with `--dry-run` when available or check the extension Output channel.
2. Collect the failing commands, output, and a short reproduction case and open an issue using `.github/ISSUE_TEMPLATE`.

