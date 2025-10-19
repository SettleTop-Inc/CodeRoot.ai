# Provenance Composition Model (PCM)
##### Public summary and quick verification
> **Schema version:** v1.1.7

**One-liner:**
PCM records *how files changed* (where, by whom, and by what kind of action) without storing your source code.

---

## Why PCM exists

Teams want trustworthy insight into file composition (e.g., human vs. AI effort, paste vs. edit) **without** risking source code exposure. PCM captures **events** about edits and produces per-file **snapshots** with counts and ranges—never raw text.

---

## What PCM tracks (at a glance)

* **Events**: Each edit is an event (insert, replace, delete, paste, AI apply, format, tooling).
* **Where**: Byte ranges for “before” and “after” (precise positions inside a file).
* **How much**: Lines and character counts, plus a content hash (no text).
* **Who**: An **actor** (e.g., user/bot/system), using opaque identifiers.
* **Origin**: Was it **human**, **ai**, or **untracked**?

> **Text-free by design:** PCM stores counts and hashes, **never** the edited text itself.

---

## Key terms (plain English)

* **Event** — One edit operation to a file.
* **Actor** — Who performed the edit (e.g., a user or a tool); use non-sensitive IDs.
* **Origin** — Broad classification of the edit: `human`, `ai`, or `untracked`.
* **Snapshot** — A per-file JSON summary under `.coderoot/v1/snapshots/` that shows spans and totals by origin.
* **Span** — A region of a file (by byte range) with an origin and timestamps.

---

## Operations (cheat sheet)

| Operation  | Typical meaning                            | Size fields present                    |
| ---------- | ------------------------------------------ | -------------------------------------- |
| `insert`   | New content added                          | `introduced`                           |
| `replace`  | Old content replaced by new                | `deleted` + `introduced`               |
| `delete`   | Content removed                            | `deleted`                              |
| `paste`    | Pasted content (treated as a human action) | `introduced`                           |
| `ai_apply` | AI suggestion applied                      | `introduced` (and sometimes `deleted`) |
| `format`   | Automated formatting                       | Usually size-neutral                   |
| `tooling`  | Tool-driven change (e.g., refactor)        | Varies                                 |

---

## Actors & origin (practical guidance)

* **Actor**: keep it simple and private—opaque ID, optional display name (no emails/tokens).
* **Origin**:

  * **human** — typing, paste, manual edits
  * **ai** — AI suggestion/application
  * **untracked** — when origin can’t be determined

---

## Snapshots (what readers actually use)

Every tracked file can have a snapshot at:
`.coderoot/v1/snapshots/<relative-path>.pcm.json`

A snapshot includes:

* **Spans**: regions with an origin and timestamps
* **Summary**: `lines_total`, `lines_by_origin`, `chars_by_origin`, and other safe counts

These power reports (e.g., “% human vs. AI”) **without** exposing any code.

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
  "schema_version": "1.1.7",
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
  }
}
```

**Snapshot (illustrative):**

```json
{
  "schema_version": "1.1.7",
  "file_path": "src/example.txt",
  "updated_at": "2025-10-07T00:00:00Z",
  "spans": [
    { "span_id": "s-1",
      "range": {"startByte": 0, "endByte": 12},
      "origin":"human",
      "introduced_at":"2025-10-07T00:00:00Z",
      "last_modified_at":"2025-10-07T00:00:00Z" }
  ],
  "summary": {
    "lines_total": 2,
    "lines_by_origin": { "human": 2, "ai": 0, "untracked": 0 },
    "chars_by_origin": { "human": 12, "ai": 0, "untracked": 0 }
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
   * No raw text—only counts, ranges, hashes

---

## Privacy & safe-use tips

* Prefer **hash-only** handling for clipboard-related data.
* Keep `actor` identifiers **opaque** and local to the repo.
* Review snapshots locally; publish only when numbers match expectations.

---

## Version & compatibility

* **Schema:** v**1.1.7**
* Readers are tolerant of earlier 1.1.x data and will normalize older field names where reasonable.
* This page is a **public summary**. Implementation details live in the (separate) spec and schema files included in this repo.

---

## FAQ (short)

**Does PCM store my code?**
No. PCM stores ranges, counts, and hashes—never raw text.

**What if I paste content?**
It’s recorded as a `paste` operation, and the origin is **human**.

**What if AI applies a change?**
It’s recorded as `ai_apply` with origin **ai**.

**Why byte ranges?**
They’re precise and resilient to line ending differences. Lines/columns may appear as hints, but byte ranges are the source of truth.

**Where do I find the data?**
Per-file snapshots live under `.coderoot/v1/snapshots/`.