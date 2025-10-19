# Provenance Composition Model (PCM) — Summary (v1.1.7)

This page gives a concise, user-facing summary of the Provenance Composition Model (PCM) format used by CodeRoot (schema version 1.1.7).

Short definition

- PCM (Provenance Composition Map): a text-free, lines-first event model that records edit operations as newline-delimited JSON records. PCM stores byte ranges, counts, hashes and provenance hints — not source text.

Event kinds (high level)

- PCMEvent (record_type: `pcm_event`)
  - Common fields: `schema_version` (1.1.7), `event_id`, `timestamp`/`ts`, `file_path`, `file_id`.
  - Note: `actor` (who performed the edit) is required for `pcm_event` per the schema and should be provided when available.
  - `op`: edit operation; typical values include `insert`, `replace`, `delete`, `paste`, `ai_apply`, `format`, `rename`, `move`, `tooling`.
  - `origin`: authoritatitive categories are `human`, `ai`, or `untracked`. (Readers may accept legacy `observed` and coerce it.)
  - `introduced` / `deleted`: size and hash metadata (prefer `lines` over legacy `loc`).
  - `before` / `after`: authoritative byte ranges (`startByte`/`endByte`) with optional advisory line/column coordinates.

- PCMCorrectionRecord (record_type: `correction`) — reference to a prior event (`target_event_id`) with optional upgrade hints.

- PCMJournalRecord (record_type: `journal`) — workspace/meta records used by the extension for settings and non-edit bookkeeping.

Snapshots (what readers see)

- Snapshots are materialized per-file as `.pcm.json` under `.coderoot/v1/snapshots/`.
- A minimal snapshot contains: `schema_version`, `file_path`, `file_id`, `updated_at`, `spans` (with `span_id`, `range`, `origin`, `introduced_at`, `last_modified_at`), and a `summary` (including `lines_total`, `lines_by_origin`, `chars_by_origin`, `touched`).

Key rules and guidance (brief)

1. Lines-first, text-free: Writers should emit `introduced.lines` and `chars_total` and a `hash` (e.g., `ws-sha256`) when possible; do not store full file text inside events.
2. Byte ranges authoritative: `before.range` / `after.range` (`startByte`/`endByte`) are the authoritative anchors for byte-clamp and mapping; line/column values are advisory.
3. Backward compatibility: readers should accept historical schema versions (1.1.3 → 1.1.7) and coerce legacy fields (`loc`, `text_sha`) to the 1.1.7 equivalents where feasible.
4. Origin handling: prefer `human`/`ai`/`untracked`. If older journals include `observed` treat it as legacy and map to a best-fit category during migration/reporting.

Compact example event (redacted)

Example: compact PCM event (redacted)

```json
{
  "schema_version": "1.1.7",
  "event_id": "e-XXXX",
  "file_path": "src/example.txt",
  "op": "insert",
  "origin": "human",
  "after": { "range": { "startByte": 0, "endByte": 12 } },
  "introduced": { "lines": 2, "chars_total": 12, "hash": { "algo": "ws-sha256", "value": "..." } }
}
```

Safe-use callouts

> Warning: PCM is deliberately text-free for privacy. Avoid adding raw clipboard or source text into events. Keep `privacy.clipboard_store_mode` set to `hash_only` unless you explicitly need text stored and you understand the privacy implications.

How to verify (quick)

1. Perform a small edit (1–2 lines) in a tracked file.
2. Rebuild or let the extension write journals; then run snapshot generation (developer: `npm run force:snapshots` or use extension commands).
3. Inspect `.coderoot/v1/snapshots/<rel>.pcm.json` and confirm `lines_total` and `lines_by_origin` reflect your edits.

Where to read more

- See `docs/spec/1.1.7/PCM_SPEC_1.1.7.md` and the migration notes in `docs/spec/1.1.7/MIGRATION_GUIDE.md` for developer-level details and examples.
