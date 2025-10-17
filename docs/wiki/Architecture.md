# Architecture

High-level pipeline:

1. Writers: The extension instruments editor and file system events and appends PCM events to `.coderoot/v1/files/<rel>.xform.jsonl` (rotated by size).
2. Snapshot builder: `snapshotBuilder.buildSnapshotFromJournal()` consumes rotated journal files and materializes a per-file snapshot under `.coderoot/v1/snapshots/<rel>.pcm.json` (schema_version 1.1.7).
3. Index & manifest: `indexManifest.writeManifest()` writes a small repository-level manifest used by reporters and maintenance tasks.
4. Reporter: `report.generateReport()` locates `assets/ci-reporter.mjs` and executes `generateReport(workspaceRoot)` to produce JSON and Markdown outputs.

Data shapes and storage:

- Journals: newline-delimited JSONL under `.coderoot/v1/files/*.xform.jsonl`.
- Snapshots: JSON `.pcm.json` files under `.coderoot/v1/snapshots/` containing spans with origins and summary sections (lines_by_origin, chars_by_origin, time_by_day, etc.).
- Refs: file binding and paths index under `.coderoot/v1/refs/` (paths.json, bindings/*).

Maintenance & CI helpers:

- The extension includes helpers to seed or repair `.github` CI assets when `coderoot.ci.maintenance.enabled` is set. See `src/extension.ts` commands for toggling and the `scripts/init-wiki.js` for repository wiki publishing.

Architecture (expanded)

Diagram (placeholder)

```text
[Editor/FS events] -> [Journal writer (.coderoot/v1/files/*.jsonl)] -> [Snapshot builder (.coderoot/v1/snapshots/*.pcm.json)] -> [Reporter (assets/ci-reporter.mjs) -> JSON/MD]
```

Key boundaries

- The writer only stores hashes, counts, ranges, and provenance — no source text.
- The snapshot builder is responsible for synthesizing spans and computing per-file totals.
- Reporter consumes snapshots and index data to produce human-readable reports.

Out of scope

- This repo does not store or expose raw file contents in `.coderoot`.
- It does not attempt to auto-fix user code or modify source files (except optional maintenance scripts guarded by settings).

How to verify

1. Create a small test file, perform a few edits in VS Code, then run `CodeRoot: Generate Report`.
2. Inspect `.coderoot/v1/snapshots/<file>.pcm.json` and the generated Markdown for expected summaries.

