# Configuration

CodeRoot stores workspace project configuration under `.coderoot/config.json`. The extension ships with sensible defaults and provides `readConfig()` / `writeConfig()` helpers.

Key files and locations:

- `.coderoot/config.json` — full runtime configuration (see `src/config.ts` for shape and defaults).
- `.coderoot/v1/index/manifest.json` — summary manifest written by `writeManifest()`.

Notable config sections (high-level):

- `writer` — writer controls (rotate size, batch behavior, baseline settings, sweeper behavior).
- `inference` — heuristics used to decide AI vs human edits.
- `aggregation` — snapshot/aggregation knobs (prefer_snapshots, merge windows, ai dominance thresholds).
- `report` — reporter display and compaction knobs; used by the reporter to tune outputs.
- `features` — enable/disable behavioral features (build_snapshots, advisory_line_col, schema_validate, etc.).

Editing configuration:

Use the extension command palette to change settings or call `writeConfig()` programmatically (the extension exposes `coderoot.settingsQuickMenu` to open the settings UI).

When writing changes programmatically the extension persists through `writeConfig(mutator)` which reads the current config, applies the mutator function, and writes the file atomically.

Minimal config example (redacted)

```json
// Example: .coderoot/config.json (minimal)
{
  "workspace_salt": "croot_XXXXXXXX",
  "writer": { "rotate_bytes": 52428800 },
  "inventory": { "mode": "all" },
  "features": { "build_snapshots": true }
}
```

Environment variables

- `CODEROOT_FORCE_SNAPSHOT_FAIL=1` — development-only: force snapshot builder to fail for testing.
- Scripts are ESM; run with `node` (v16+). No other environment variables are required by default.

Precedence & where values live

1. Command-level options (if any) — highest priority.
2. Workspace `.coderoot/config.json` — persisted project-level configuration.
3. Built-in defaults from `src/config.ts` (used when config is missing).

Common mistakes

- Editing `.coderoot` files and committing them unintentionally — default `.gitignore` excludes `.coderoot/**`.
- Changing `workspace_salt` after events were written — this will change derived `file_id` values and break bindings. Do not modify the salt on active projects.

How to verify

1. After changing config, run `node scripts/init-wiki.js --docs docs/wiki --dry-run` as a non-invasive check (dry-run).
2. Confirm `readConfig()` returns expected values inside the extension (use the extension output channel or small diagnostic command).

