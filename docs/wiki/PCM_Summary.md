# PCM Summary (v1.1.7)

This summary captures key details of the PCM format as used by CodeRoot.ai.

Event types and records

- PCMEvent (record_type: pcm_event)
  - schema_version: 1.1.7
  - event_id, timestamp (ts)
  - file_path, file_id
  - op: insert, replace, delete, paste, ai_apply, format, rename, move, tooling
  - origin: human | ai | untracked
  - introduced / deleted: size & hash metadata (prefer lines over legacy loc)
  - before / after: advisory ranges (startByte/endByte and optional line/column)

- PCMCorrectionRecord (record_type: correction)
  - target_event_id and optional upgrade hints

- PCMJournalRecord (record_type: journal)
  - meta/journal records used by the extension for settings and non-edit events

Snapshots (.pcm.json)

- MinimalSnapshot includes:
  - schema_version: 1.1.7
  - file_path, file_id, updated_at
  - spans: span_id, range, origin, introduced_at, last_modified_at, optional user
  - summary: lines_total, lines_by_origin, chars_by_origin, touched, unchanged_since_install, last_modified_at, optional daily/time breakdowns

Writer guidance (short)

- Emit schema_version: 1.1.7 for new events
- Prefer lines in introduced instead of legacy loc when possible
- Provide ws-sha256 hash for introduced/deleted blocks

Reader guidance (short)

- Accept historical schema_versions 1.1.3–1.1.7; prefer interpreting 1.1.7 fields
- Coerce legacy text_sha / loc fields when encountered

What PCM captures (narrative)

- Each PCM event records an edit operation, byte ranges before/after, size/hash metadata, and provenance hints (typing/paste/ai/tooling)
- The model is text‑free — no source is stored; this improves privacy and determinism while enabling accurate tallies and provenance

Compact example event (redacted)

```
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

- Keep clipboard handling at hash_only for privacy (see privacy.clipboard_store_mode)

How to verify

1) Make a small edit and build a snapshot
2) Inspect the produced .pcm.json and confirm expected totals
