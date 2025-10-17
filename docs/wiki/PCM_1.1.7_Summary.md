# PCM 1.1.7 Summary

This summary captures the important details of the PCM 1.1.7 format as used by CodeRoot (see `src/pcm.ts` and `src/snapshotBuilder.ts`). Use this page as a quick reference for writers and reporters.

Event types and records:

- PCMEvent (record_type `pcm_event`) — main edit event. Key fields:
  - `schema_version`: `1.1.7`
  - `event_id`, `timestamp` (and `ts`)
  - `file_path`, `file_id`
  - `op`: one of `insert`, `replace`, `delete`, `paste`, `ai_apply`, `format`, `rename`, `move`, `tooling`
  - `origin`: `human` | `ai` | `untracked`
  - `introduced` / `deleted`: size & hash metadata (prefer `lines` over legacy `loc`)
  - `before` / `after`: advisory ranges (startByte/endByte and optional line/column)

- PCMCorrectionRecord (record_type `correction`) — used to upgrade or correct prior events; includes `target_event_id` and optional `upgrade` hints.

- PCMJournalRecord (record_type `journal`) — meta/journal records used by the extension for settings and non-edit events.

Snapshots (`.pcm.json`):

- A MinimalSnapshot contains:
  - `schema_version: '1.1.7'`
  - `file_path`, `file_id`, `updated_at`
  - `spans`: array of spans with `span_id`, `range` (startByte/endByte + start/end line/col), `origin`, `introduced_at`, `last_modified_at`, optional `user`.
  - `summary`: `lines_total`, `lines_by_origin`, `chars_by_origin`, `touched`, `unchanged_since_install`, `last_modified_at` and optional daily/time breakdowns.

Writer guidance (short):

- Emit `schema_version: '1.1.7'` for new events.
- Prefer `lines` in `introduced` instead of legacy `loc` when possible.
- Provide `hash` for introduced/deleted blocks using ws-sha256 for canonical normalization.

Reader guidance (short):

- Accept historical schema_versions 1.1.3–1.1.7 but prefer interpreting 1.1.7 fields.
- Coerce legacy `text_sha` / `loc` fields when encountered.

What PCM captures (narrative)

- Each PCM event records an edit operation (insert/replace/delete/etc.), the byte ranges before/after, a small set of size/hash metadata, and provenance hints (typing/paste/ai/tooling).
- The model is "text-free" — no source is stored. This improves privacy and determinism while enabling accurate tallies and provenance.

Compact example event (redacted)

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

> Tip: For privacy, avoid adding raw content into events. Use `ws-sha256` for local validation and keep `clipboard_store_mode` set to `hash_only` unless you need text storage.

How to verify

1. Run a small edit sequence and build a snapshot: `npm run force:snapshots` (or use the extension's snapshot hooks).
2. Open the produced `.pcm.json` and confirm `lines_total` and `lines_by_origin` are present and make sense relative to your edits.

