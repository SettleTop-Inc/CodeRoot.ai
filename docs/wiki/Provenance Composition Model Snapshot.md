> **Schema version:** v1.1.8

# Provenance Composition Model Snapshot

PCM Snapshots are per-file JSON summaries stored under `.coderoot/v1/snapshots/<relative-path>.pcm.json`. They provide a complete view of file composition without storing source code.

---

## What Snapshots Contain

A snapshot includes:

* **Spans**: Regions of the file (by byte range) with origin, category, and timestamps
* **Summary**: Aggregated counts by origin, category, and subtype
* **Metadata**: File information, encoding, replay checkpoints

---

## Snapshot Structure

### Required Fields

```json
{
  "schema_version": "1.1.8",
  "file_path": "src/example.txt",
  "file_id": "file-abc123",
  "updated_at": "2025-10-07T00:00:00Z",
  "spans": [...],
  "summary": {...},
  "meta": {...}
}
```

### Spans

Each span represents a region of the file:

```json
{
  "span_id": "s-1",
  "range": {
    "startByte": 0,
    "endByte": 100,
    "start": { "line": 0, "column": 0 },
    "end": { "line": 5, "column": 10 }
  },
  "origin": "human",
  "category": "human",
  "introduced_at": "2025-10-07T00:00:00Z",
  "last_modified_at": "2025-10-07T00:00:00Z"
}
```

**Span Fields:**
- `span_id`: Unique identifier for the span
- `range`: Byte range (required) and optional line/column positions
- `origin`: One of `ai`, `human`, `observed`, `untracked`, `external`
- `category`: One of `human`, `automation`, `preexisting`, `out_of_band`
- `introduced_at`: When content was first added
- `last_modified_at`: When content was last modified

### Summary

The summary provides aggregated metrics:

```json
{
  "summary": {
    "lines_total": 100,
    "lines_by_origin": {
      "ai": 20,
      "human": 70,
      "observed": 5,
      "external": 5
    },
    "chars_by_origin": {
      "ai": 500,
      "human": 2000,
      "observed": 100,
      "external": 100
    },
    "lines_by_category": {
      "human": 70,
      "automation": 20,
      "preexisting": 5,
      "out_of_band": 5
    },
    "chars_by_category": {...},
    "lines_by_subtype": {...},
    "chars_by_subtype": {...},
    "touched": 95,
    "last_modified_at": "2025-10-07T00:00:00Z"
  }
}
```

**Summary Fields:**
- `lines_total`: Total lines in the file
- `lines_by_origin`: Lines broken down by origin (ai, human, observed, external)
- `chars_by_origin`: Characters broken down by origin
- `loc_by_origin`: Lines of code (excluding comments/whitespace) by origin
- `lines_by_category`: Lines broken down by category (human, automation, preexisting, out_of_band)
- `chars_by_category`: Characters broken down by category
- `lines_by_subtype`: Lines broken down by subtype (ai, ai_assisted, tooling, format, etc.)
- `chars_by_subtype`: Characters broken down by subtype
- `touched`: Number of spans that have been modified
- `last_modified_at`: Timestamp of last modification

---

## Origins vs Categories

**Origins** represent the immediate source:
- `human`: Direct human input
- `ai`: AI-generated content
- `observed`: Observed tool output
- `external`: External edits

**Categories** represent the broader classification:
- `human`: Deliberate human work
- `automation`: AI-assisted and trusted automation
- `preexisting`: Baseline content from workspace initialization
- `out_of_band`: External edits needing review

---

## Example Snapshot

```json
{
  "schema_version": "1.1.8",
  "file_path": "src/example.txt",
  "file_id": "file-abc123",
  "updated_at": "2025-10-07T00:00:00Z",
  "spans": [
    {
      "span_id": "s-1",
      "range": { "startByte": 0, "endByte": 50 },
      "origin": "human",
      "category": "human",
      "introduced_at": "2025-10-07T00:00:00Z",
      "last_modified_at": "2025-10-07T00:00:00Z"
    }
  ],
  "summary": {
    "lines_total": 10,
    "lines_by_origin": { "ai": 0, "human": 10, "observed": 0, "external": 0 },
    "chars_by_origin": { "ai": 0, "human": 200, "observed": 0, "external": 0 },
    "lines_by_category": { "human": 10, "automation": 0, "preexisting": 0, "out_of_band": 0 },
    "touched": 1,
    "last_modified_at": "2025-10-07T00:00:00Z"
  },
  "meta": {
    "replay_checkpoint": {
      "schema_applied": "1.1.8",
      "processed_through_event_id": "e-123",
      "processed_through_ts": "2025-10-07T00:00:00Z"
    }
  }
}
```

---

## Privacy & Safety

Snapshots contain:
- ✅ Byte ranges and positions
- ✅ Line and character counts
- ✅ Content hashes (for verification)
- ✅ Timestamps
- ❌ No source code text
- ❌ No file contents

---

## Version & Compatibility

* **Schema:** v1.1.8
* Snapshots are backward compatible with earlier 1.1.x versions
* This page documents the snapshot format. For event/journal format, see [Provenance Composition Model](Provenance-Composition-Model).
