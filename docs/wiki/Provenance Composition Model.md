> **Schema version:** v1.1.8

The PCM records *how files changed* (where, by whom, and by what kind of action) without storing your source code.

---

## Why PCM exists

Teams want trustworthy insight into file composition (e.g., human vs. AI effort, paste vs. edit) **without** risking source code exposure. PCM captures **events** about edits and produces per-file **snapshots** with counts and ranges—never raw text.

---

## What PCM tracks (at a glance)

* **Events**: Each edit is an event (insert, replace, delete, paste, AI apply, format, tooling).
* **Where**: Byte ranges for "before" and "after" (precise positions inside a file).
* **How much**: Lines and character counts, plus a content hash (no text).
* **Who**: An **actor** (e.g., user/bot/system), using opaque identifiers.
* **Origin**: Was it **human**, **ai**, or **untracked**?
* **Category** (PCM 1.1.8): Broader classification: `human`, `automation`, `preexisting`, or `out_of_band`.
* **Subtype** (PCM 1.1.8): Specific type when determinable: `ai`, `ai_assisted`, `tooling`, `format`, `generator`, `bootstrap`, `codemod`.

> **Text-free by design:** PCM stores counts and hashes, **never** the edited text itself.

---

## Key terms (plain English)

* **Event** — One edit operation to a file.
* **Actor** — Who performed the edit (e.g., a user or a tool); use non-sensitive IDs.
* **Origin** — Immediate source classification: `human`, `ai`, `untracked`, or `observed` (ingest-only).
* **Category** (PCM 1.1.8) — Broader classification: `human` (deliberate work), `automation` (AI/tooling), `preexisting` (baseline), `out_of_band` (external).
* **Subtype** (PCM 1.1.8) — Specific type when determinable: `ai`, `ai_assisted`, `tooling`, `format`, `generator`, `bootstrap`, `codemod`.
* **Snapshot** — A per-file JSON summary under `.coderoot/v1/snapshots/` that shows spans and totals by origin, category, and subtype.
* **Span** — A region of a file (by byte range) with an origin, category, and timestamps.

---

## Operations (cheat sheet)

| Operation  | Typical meaning                            | Size fields present                    |
| ---------- | ------------------------------------------ | -------------------------------------- |
| `insert`   | New content added                          | `introduced`               |
| `replace`   | Old content replaced by new                          | `deleted` + `introduced`               |
| `delete`   | Content removed                          | `deleted`               |
| `paste`   | Pasted content (treated as a human action)                          | `introduced`               |
| `ai_apply`   | AI suggestion applied                          | `introduced` (and sometimes `deleted`)               |
| `format`   | Automated formatting                          | Usually size-neutral               |
| `tooling`   | Tool-driven change (e.g., refactor)                          | Varies               |
| `rename`   | File renamed                          | N/A               |
| `move`   | File moved                          | N/A               |

---

## Actors, origin, category & subtype (practical guidance)

* **Actor**: keep it simple and private—opaque ID, optional display name (no emails/tokens).
* **Origin**: Immediate source classification

  * **ai** — AI suggestion/application
  * **human** — typing, paste, manual edits
  * **observed** — observed tool output
  * **untracked** — when origin can't be determined
  * **external** — external edits or unknown attribution

* **Category** (PCM 1.1.8): Broader classification system
  * **human** — Deliberate human work (typing, paste, manual edits)
  * **automation** — AI-assisted and trusted automation (AI applies, formatters, tooling)
  * **preexisting** — Content present at workspace initialization
  * **out_of_band** — External edits introduced outside IDE attribution

* **Subtype** (PCM 1.1.8): Specific type when determinable
  * **ai** — Direct AI-generated code
  * **ai_assisted** — AI suggestions requiring human confirmation
  * **tooling** — Automated tool operations (linters, refactors)
  * **format** — Formatting-only changes
  * **generator** — Code generation tools
  * **bootstrap** — Initial project setup
  * **codemod** — Automated code transformations

---

## Snapshots (what readers actually use)

Every tracked file can have a snapshot at:
`.coderoot/v1/snapshots/<relative-path>.pcm.json`

A snapshot includes:

* **Spans**: regions with an origin, category, and timestamps
* **Summary**: Multiple aggregation views:
  * `lines_by_origin` / `chars_by_origin` — By immediate source (human, ai, untracked)
  * `lines_by_category` / `chars_by_category` — By broader classification (human, automation, preexisting, out_of_band)
  * `lines_by_subtype` / `chars_by_subtype` — By specific type (ai, tooling, format, etc.)
  * `lines_by_bucket` / `chars_by_bucket` (PCM 1.1.8) — Category-based rollups
* **Metadata**: File information, encoding, replay checkpoints for incremental processing

These power reports (e.g., "% human vs. AI", "% automation", breakdowns by subtype) **without** exposing any code.

---

## What PCM deliberately does **not** store

* ❌ No source code text
* ❌ No clipboard contents
* ❌ No credentials or personal emails
* ❌ No tool internals or proprietary CI details

---

## Minimal redacted examples

**Event (illustrative):**

```json
{
  "schema_version": "1.1.8",
  "record_type": "pcm_event",
  "event_id": "e-123",
  "file_path": "src/example.txt",
  "op": "insert",
  "origin": "human",
  "actor": { "id": "u-abc" },
  "after": { "range": { "startByte": 0, "endByte": 12 } },
  "introduced": {
    "lines": 2,
    "chars_total": 12,
    "hash": { "algo": "ws-sha256", "value": "…" }
  },
  "provenance": {
    "category": "human",
    "reason_code": "op:typing",
    "evidence": ["op:typing"]
  }
}
```

**AI Apply Event (illustrative):**

```json
{
  "schema_version": "1.1.8",
  "record_type": "pcm_event",
  "event_id": "e-456",
  "file_path": "src/example.txt",
  "op": "ai_apply",
  "origin": "ai",
  "actor": { "id": "u-abc" },
  "after": { "range": { "startByte": 12, "endByte": 50 } },
  "introduced": {
    "lines": 5,
    "chars_total": 38,
    "hash": { "algo": "ws-sha256", "value": "…" }
  },
  "provenance": {
    "category": "automation",
    "subtype": "ai",
    "reason_code": "op:ai_apply",
    "evidence": ["op:ai_apply", "suggestion_accepted"]
  }
}
```

**Snapshot (illustrative):**

```json
{
  "schema_version": "1.1.8",
  "file_path": "src/example.txt",
  "file_id": "file-abc123",
  "updated_at": "2025-10-07T00:00:00Z",
  "spans": [
    { "span_id": "s-1",
      "range": {"startByte": 0, "endByte": 12},
      "origin": "human",
      "category": "human",
      "introduced_at": "2025-10-07T00:00:00Z",
      "last_modified_at": "2025-10-07T00:00:00Z" },
    { "span_id": "s-2",
      "range": {"startByte": 12, "endByte": 50},
      "origin": "ai",
      "category": "automation",
      "introduced_at": "2025-10-07T00:05:00Z",
      "last_modified_at": "2025-10-07T00:05:00Z" }
  ],
  "summary": {
    "lines_total": 7,
    "lines_by_origin": { "human": 2, "ai": 5, "untracked": 0, "observed": 0, "external": 0 },
    "chars_by_origin": { "human": 12, "ai": 38, "untracked": 0, "observed": 0, "external": 0 },
    "lines_by_category": { "human": 2, "automation": 5, "preexisting": 0, "out_of_band": 0 },
    "chars_by_category": { "human": 12, "automation": 38, "preexisting": 0, "out_of_band": 0 },
    "lines_by_subtype": { "ai": 5, "ai_assisted": 0, "tooling": 0, "format": 0, "generator": 0, "bootstrap": 0, "codemod": 0 },
    "chars_by_subtype": { "ai": 38, "ai_assisted": 0, "tooling": 0, "format": 0, "generator": 0, "bootstrap": 0, "codemod": 0 },
    "lines_by_bucket": { "human": 2, "automation": 5, "preexisting": 0, "out_of_band": 0 },
    "chars_by_bucket": { "human": 12, "automation": 38, "preexisting": 0, "out_of_band": 0 },
    "touched": 2,
    "last_modified_at": "2025-10-07T00:05:00Z"
  },
  "meta": {
    "replay_checkpoint": {
      "schema_applied": "1.1.8",
      "processed_through_event_id": "e-456",
      "processed_through_ts": "2025-10-07T00:05:00Z"
    }
  }
}
```

> **Note:** Hashes are shown as `…` on purpose. PCM uses hashes to verify content **without** storing it.

---

## Quick-start: verify PCM locally (2 minutes)

1. **Make a tiny change** in any file (add one short line).
2. **Generate snapshots** with your editor integration or CLI.
3. **Open the snapshot** at `.coderoot/v1/snapshots/<relative-path>.pcm.json`.
4. **Confirm**:

   * `summary.lines_total` increased as expected
   * `lines_by_origin.human` (or `ai`) reflects your change
   * `lines_by_category` and `lines_by_bucket` show category breakdowns
   * `lines_by_subtype` shows specific types when determinable
   * No raw text—only counts, ranges, hashes

---

## Privacy & safe-use tips

* Prefer **hash-only** handling for clipboard-related data.
* Keep `actor` identifiers **opaque** and local to the repo.
* Review snapshots locally; publish only when numbers match expectations.

---

## Origins vs Categories vs Buckets

**Origins** represent the immediate source:
- `human`: Direct human input
- `ai`: AI-generated content
- `observed`: Observed tool output (ingest-only, coerced to `untracked` in snapshots)
- `untracked`: When origin can't be determined
- `external`: External edits

**Categories** represent the broader classification:
- `human`: Deliberate human work
- `automation`: AI-assisted and trusted automation
- `preexisting`: Baseline content from workspace initialization
- `out_of_band`: External edits needing review

**Buckets** (PCM 1.1.8) are category-based rollups that sum to the same totals as origin-based fields. They provide an alternative view for reporting and analysis.

## Version & compatibility

* **Schema:** v**1.1.8**
* Readers are tolerant of earlier 1.1.x data (1.1.3–1.1.7) and will normalize older field names where reasonable.
* PCM 1.1.8 introduces category/subtype classification and bucket rollups while maintaining backward compatibility with origin-based fields.
* This page is a **public summary**. Implementation details live in the (separate) spec and schema files included in this repo.

---

## FAQ (short)

**Does PCM store my code?**
No. PCM stores ranges, counts, and hashes—never raw text.

**What if I paste content?**
It's recorded as a `paste` operation, and the origin is **human**.

**What if AI applies a change?**
It's recorded as `ai_apply` with origin **ai**.

**Why byte ranges?**
They're precise and resilient to line ending differences. Lines/columns may appear as hints, but byte ranges are the source of truth.

**Where do I find the data?**
Per-file snapshots live under `.coderoot/v1/snapshots/`.
