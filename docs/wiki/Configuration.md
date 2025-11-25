# Configuration

Location: `.coderoot/config.json` (created/managed by the extension). Change settings via VS Code → Command Palette → “CodeRoot: Settings / Quick Menu”.

Inventory

| Setting           | Description                                  | Typical values | When to change |
|-------------------|----------------------------------------------|----------------|----------------|
| inventory.mode    | Files included in analysis and reports        | modified, all  | modified for daily focus; all for full baselines/rollups |

Writer (journals)

| Setting                         | Description                                      | Typical values             | When to change |
|---------------------------------|--------------------------------------------------|----------------------------|----------------|
| writer.rotate_bytes             | Journal rotation size (bytes)                    | 20–100 MB (e.g., 52428800) | Reduce rotations on large repos |
| writer.batch_events_per_txn     | Batch event writes per transaction               | true/false                 | Leave true unless debugging IO |
| writer.baseline_on_init         | One-time baseline on first init                  | false/true                 | Enable to seed starting state |
| writer.baseline_max_bytes       | Max bytes scanned during baseline                | ~1–5 MB                    | Raise for larger seeds |
| writer.baseline_parallelism     | Concurrency for baseline                         | 2–8                        | Raise on powerful machines |
| writer.sweeper_enabled          | Enable background housekeeping                   | true/false                 | Rarely change |
| writer.sweeper_interval_ms      | Housekeeping interval                            | 10–30s                     | Increase for very large repos |
| writer.timing_capture_enabled   | Capture timing metadata                          | true/false                 | Disable only for strict minimalism |
| writer.line_col_max_file_bytes  | Line/column derivation cutoff (file size)        | ~1.2 MB                    | Increase for very large files if needed |

Inference (edit classification)

| Setting                       | Description                              | Typical values | When to change |
|-------------------------------|------------------------------------------|----------------|----------------|
| inference.ai_likely_threshold | Confidence threshold for AI‑assisted     | ~0.85          | Tighten/loosen to match tolerance |
| inference.burst_loc_min       | Lines-of-code burst minimum              | ~20            | Rare; atypical editing styles |
| inference.latency_ms_max      | Max latency window considered            | ~120 ms        | Rare |
| inference.min_block_chars     | Minimum chars to consider a block        | ~120           | Rare |

Retention

| Setting               | Description                          | Typical values | When to change |
|-----------------------|--------------------------------------|----------------|----------------|
| retention.mode        | Local outputs retention policy       | current_only   | Usually fixed |
| retention.window_days | Housekeeping window (days)           | 0              | Only with external cleanup |
| retention.gc_epoch    | GC epoch marker                      | 0              | Managed by system |

Privacy

| Setting                      | Description                     | Typical values | When to change |
|------------------------------|---------------------------------|----------------|----------------|
| privacy.hash_algo            | Hashing for fingerprints        | sha256         | Fixed |
| privacy.clipboard_store_mode | Clipboard handling              | hash_only      | Keep hash_only |

Ignore

| Setting | Description                     | Typical values | When to change |
|---------|---------------------------------|----------------|----------------|
| ignore  | Glob patterns to exclude        | .coderoot/**   | Add large generated folders |

Aggregation (rollup)

| Setting                                       | Description                                        | Typical values | When to change |
|-----------------------------------------------|----------------------------------------------------|----------------|----------------|
| aggregation.prefer_snapshots                   | Prefer snapshot-based composition                  | true           | Default |
| aggregation.mode_lines                         | Lines accounting mode                              | net, legacy    | Use net for accuracy; legacy for comparisons |
| aggregation.merge_window_ms                    | Merge nearby edits                                 | ~1500          | Increase for chatty tools |
| aggregation.format_merge_ms                    | Merge formatter edits                              | ~3000          | As above |
| aggregation.command_merge_ms                   | Merge command-triggered edits                      | ~3000          | As above |
| aggregation.ai_block_min_chars                 | ~~Threshold for large AI apply~~ **DEPRECATED: Metadata-only** | ~200 chars     | No longer used for classification |
| aggregation.ai_prewindow_ms_for_large_apply    | Pre-window for large AI apply                      | ~5000 ms       | Advanced tuning |
| aggregation.ai_merge_ms_for_large_apply        | Merge window for large AI apply                    | ~10000 ms      | Advanced tuning |
| aggregation.human_high_tcs_threshold           | High typing-confidence threshold                   | ~0.6           | Advanced tuning |
| aggregation.human_episode_share_strong         | Strong human share threshold                       | ~0.6           | Advanced tuning |
| aggregation.human_episode_share_weak           | Weak human share threshold                         | ~0.4           | Advanced tuning |
| aggregation.suggestion_linkage_enabled         | Link AI suggestions to applies                     | true           | Default |
| aggregation.coalescing.file_email_prefer       | Prefer email when coalescing                       | true           | Default |
| aggregation.coalescing.day_hint_enabled        | Use day hints when coalescing                      | true           | Default |
| aggregation.coalescing.day_promotion_threshold_days | Promote day aggregation after N days          | ~2 days        | Adjust for reporting cadence |

Report (presentation)

| Setting                           | Description                                  | Typical values                                | When to change |
|-----------------------------------|----------------------------------------------|------------------------------------------------|----------------|
| report.identity_display           | Identity field to show in reports            | display, git.name, git.email, os.user, id      | Preference |
| report.days_compaction.enabled    | Compact older daily totals                   | false/true                                     | Enable for long histories |
| report.days_compaction.keep_recent_days | Keep recent days before compacting        | ~120                                            | Adjust retention horizon |
| report.days_compaction.bucket     | Compaction bucket                            | weekly                                         | Usually weekly |
| report.days_compaction.auto_threshold_days | Auto-compaction threshold                | ~240                                           | Advanced |
| report.kpis.slope_windows         | KPI trend windows                            | [7, 30]                                        | Preference |
| report.attribution_audit.enabled  | Extra attribution validation                 | false/true                                     | Enable for audits |
| report.version_mix.enabled        | Flag mixed schema versions                   | false/true                                     | Enable for enforcement |
| report.version_mix.threshold_pct  | Threshold for mixed versions                 | ~10                                            | Policy-based |
| report.version_mix.grace_days     | Grace period before flagging                 | ~14                                            | Policy-based |
| report.version_mix.legacy_versions| List of legacy versions                      | e.g., 1.1.3–1.1.5                              | As needed |
| report.current_version | Current release version (string) | e.g., 1.1.7 — should correspond to active config schema version | Optional |
| report.timeModel                  | Time attribution model                       | constant, weighted                             | Preference |
| report.weights.*                  | Weights for time model                       | human/ai_apply/tooling/journal                  | Advanced |
| report.toolingBurst.enabled       | Cap tooling bursts                           | false/true                                     | Enable to cap tooling time |
| report.toolingBurst.windowSeconds | Window for burst                             | ~30                                            | Advanced |
| report.toolingBurst.maxSecondsPerBurst | Max seconds per burst                     | ~120                                           | Advanced |

Detection (event windows)

| Setting                        | Description                                  | Typical values | When to change |
|--------------------------------|----------------------------------------------|----------------|----------------|
| detection.debounce_ms          | Debounce around events                       | ~300 ms        | Rare |
| detection.typing_window_ms     | Typing window                                | ~500 ms        | Rare |
| detection.post_format_nudge_ms | Grace period after formatting                 | ~1000 ms       | Rare |
| detection.ai_window_ms         | AI apply window                              | ~1000 ms       | Rare |
| detection.chat_apply_window_ms | Chat apply window                            | ~3000 ms       | Rare |
| detection.strict_human_typing  | Strict typing inference                       | false/true     | Advanced |
| detection.grace_window_ms      | General grace period                         | ~350 ms        | Rare |

Maintenance

| Setting                                         | Description                           | Typical values | When to change |
|-------------------------------------------------|---------------------------------------|----------------|----------------|
| maintenance.force_snapshots_on_startup           | Rebuild snapshots on startup          | true/false     | Keep true for freshness |
| maintenance.force_snapshots_on_startup_concurrency | Concurrency for rebuild             | ~2             | Raise on powerful CI/hosts |

Suppression (noise control)

| Setting                         | Description                          | Typical values | When to change |
|---------------------------------|--------------------------------------|----------------|----------------|
| suppression.format_spam_enabled | Suppress frequent formatter events   | true/false     | Keep true |
| suppression.format_debounce_ms  | Debounce window for formatting       | ~900 ms        | Adjust if formatter chatty |
| suppression.format_max_burst_ms | Max allowed formatting burst         | ~1200 ms       | Adjust if formatter chatty |

Typing (cadence & thresholds)

| Setting                       | Description                               | Typical values | When to change |
|-------------------------------|-------------------------------------------|----------------|----------------|
| typing.enabled                | Enable typing classifier                   | true/false     | Keep true |
| typing.small_insert_max       | Max chars for small insert run             | ~3             | Adjust for style/IME |
| typing.ime_small_insert_max   | Max chars for small IME insert             | ~6             | IME tuning |
| typing.caret_advance_slop     | Caret advance slop                         | ~1             | Advanced |
| typing.inter_ms_fast          | Fast inter‑key interval                    | ~300 ms        | Advanced |
| typing.inter_ms_slow          | Slow inter‑key interval                    | ~500 ms        | Advanced |
| typing.ime_inter_ms_max       | Max IME inter‑key interval                 | ~1200 ms       | IME tuning |
| typing.tcs_human_threshold    | Human typing confidence threshold          | ~0.45          | Advanced |
| typing.tcs_probably_threshold | “Probably human” threshold                 | ~0.25          | Advanced |

Detectors (format/paste/tooling/AI)

| Setting                               | Description                                 | Typical values | When to change |
|---------------------------------------|---------------------------------------------|----------------|----------------|
| detectors.format_whitespace_ratio_max | Max whitespace ratio to call it formatting  | ~0.1           | Tuning only |
| detectors.format_after_save_window_ms | Window after save for format detection      | ~350 ms        | Tuning only |
| detectors.tooling_multi_range_min     | Multiple ranges → likely tooling            | ~5             | Tuning only |
| detectors.tooling_scatter_min         | Scattered edits → likely tooling            | ~16            | Tuning only |
| detectors.paste_min_chars             | ~~Minimum chars to consider a paste~~ **DEPRECATED: Metadata-only** | ~30            | No longer used for classification |
| detectors.paste_clipboard_probe       | Clipboard probe mode                        | off, hash      | Keep hash |
| detectors.paste_clipboard_window_ms   | Window to link clipboard to paste           | ~1500 ms       | Tuning only |
| detectors.paste_hash_algo             | Hash algorithm for clipboard                | sha256         | Fixed |
| detectors.ai_block_min_chars          | ~~Min chars to treat as AI block~~ **DEPRECATED: Metadata-only** | ~120           | No longer used for classification |
| detectors.ai_dual_block_chars         | ~~Second threshold for dual blocks~~ **DEPRECATED: Metadata-only** | ~80            | No longer used for classification |
| detectors.ai_structure_threshold      | Structure threshold                         | ~0.7           | Tuning only |
| detectors.stream_adaptive             | Adaptive streaming detection                 | true/false     | Advanced |
| detectors.stream_lines_min            | Min lines for streaming detect               | ~3             | Advanced |

Trust (command allowlists)

| Setting                    | Description                                      | Typical values | When to change |
|----------------------------|--------------------------------------------------|----------------|----------------|
| trust.ai_commands          | VS Code command IDs recognized as AI             | list           | Add org‑specific commands |
| trust.formatter_commands   | Command IDs recognized as formatter              | list           | As needed |
| trust.tooling_commands     | Command IDs recognized as tooling                | list           | As needed |
| trust.chat_apply_commands  | Command IDs recognized as chat apply             | list           | As needed |
| trust.paste_commands       | Command IDs recognized as paste                  | list           | As needed |

Telemetry

| Setting         | Description            | Typical values | When to change |
|-----------------|------------------------|----------------|----------------|
| telemetry.debug | Emit diagnostic logs   | false/true     | Enable for support |

Features (master toggles)

| Setting                    | Description                                | Typical values | When to change |
|----------------------------|--------------------------------------------|----------------|----------------|
| features.detection_v1      | Detection engine v1                        | true/false     | Advanced |
| features.detection_v2      | Detection engine v2                        | true/false     | Advanced |
| features.discover_commands | Discover command usage                      | true/false     | Advanced |
| features.latent_intents    | Enable latent intents                       | true/false     | Advanced |
| features.elastic_windows   | Enable elastic windows                      | true/false     | Advanced |
| features.pcm_corrections   | Enable PCM corrections                      | true/false     | Advanced |
| features.typing_enabled    | Enable typing classifier                    | true/false     | Keep true |
| features.identity_capture  | Capture identity data                       | true/false     | Keep true |
| features.strict_git_capture| Enforce stricter Git bindings               | true/false     | Advanced |
| features.build_snapshots   | Emit/build snapshots                         | true/false     | Keep true |
| features.advisory_line_col | Derive advisory line/col hints               | true/false     | Performance tradeoff |
| features.schema_validate   | JSON Schema validation of events             | true/false     | Dev only |

Reporter knobs

| Setting                               | Description                         | Typical values | When to change |
|---------------------------------------|-------------------------------------|----------------|----------------|
| time_per_event_seconds                | Time estimate per event             | ~45 s          | Advanced |
| episode_fallback_mode                 | Episode fallback mode               | none, per_episode, per_event_in_episode | Advanced |
| episode_time_floor_seconds            | Minimum time per episode            | 0+             | Advanced |
| report_display_limits.top_files_today       | Max files in today’s lists        | ~10            | Visual consistency |
| report_display_limits.top_time_files_today  | Max time‑based file list          | ~10            | Visual consistency |
| report_display_limits.top_developers_totals | Max developers in totals list     | ~10            | Visual consistency |

Operational & footer

| Setting                | Description                               | Typical values | When to change |
|------------------------|-------------------------------------------|----------------|----------------|
| writer_enabled         | Turn the writer on/off                    | true/false     | Troubleshooting only |
| writer_last_changed    | ISO timestamp of writer change            | ISO timestamp  | System managed |
| inventory_last_changed | ISO timestamp of inventory change         | ISO timestamp  | System managed |
| commit_message_footer  | Commit footer to append (optional)        | string         | If your org requires footers |

How to change settings

- VS Code → Command Palette → “CodeRoot: Settings / Quick Menu”
  - Toggle snapshot generation
  - Switch scope (Modified vs All)
  - Show/Hide the `.coderoot` folder

Minimal example

```json
{
  "workspace_salt": "croot_XXXXXXXX",
  "writer": { "rotate_bytes": 52428800 },
  "inventory": { "mode": "all" },
  "features": { "build_snapshots": true }
}
```

Advanced (optional)

- Identity: use the Quick Menu to consolidate identities if the same person appears with multiple aliases
- Determinism: outputs are deterministic; identical inputs yield identical reports
- Privacy: journals and snapshots contain metadata (counts, hashes, ranges) — not source text

Representative defaults (excerpt)

```json
{
  "workspace_salt": "croot_XXXXXXXX",
  "writer": {
    "rotate_bytes": 52428800,
    "batch_events_per_txn": true,
    "baseline_on_init": false,
    "baseline_max_bytes": 1000000,
    "baseline_parallelism": 4,
    "sweeper_enabled": true,
    "sweeper_interval_ms": 15000,
    "timing_capture_enabled": true,
    "line_col_max_file_bytes": 1200000
  },
  "inference": { "ai_likely_threshold": 0.85, "burst_loc_min": 20, "latency_ms_max": 120, "min_block_chars": 120 },
  "retention": { "mode": "current_only", "window_days": 0, "gc_epoch": 0 },
  "privacy": { "hash_algo": "sha256", "clipboard_store_mode": "hash_only" },
  "ignore": [".coderoot/**"],
  "inventory": { "mode": "all" },
  "aggregation": {
    "prefer_snapshots": true,
    "mode_lines": "net",
    "ai_dominance_enabled": true,
    "merge_window_ms": 1500,
    "format_merge_ms": 3000,
    "command_merge_ms": 3000,
    "ai_block_min_chars": 200,
    "ai_prewindow_ms_for_large_apply": 5000,
    "ai_merge_ms_for_large_apply": 10000,
    "human_high_tcs_threshold": 0.6,
    "human_episode_share_strong": 0.6,
    "human_episode_share_weak": 0.4,
    "suggestion_linkage_enabled": true,
    "coalescing": { "file_email_prefer": true, "day_hint_enabled": true, "day_promotion_threshold_days": 2 }
  },
  "report": {
    "identity_display": "display",
    "days_compaction": { "enabled": false, "keep_recent_days": 120, "bucket": "weekly", "auto_threshold_days": 240 },
    "kpis": { "slope_windows": [7, 30] },
    "attribution_audit": { "enabled": false },
    "version_mix": { "enabled": false, "threshold_pct": 10, "grace_days": 14, "legacy_versions": ["1.1.3", "1.1.4", "1.1.5"] },
    "timeModel": "constant",
    "weights": { "human": 30, "ai_apply": 60, "tooling": 10, "journal": 5 },
    "toolingBurst": { "enabled": false, "windowSeconds": 30, "maxSecondsPerBurst": 120 }
  },
  "time_per_event_seconds": 45,
  "episode_fallback_mode": "none",
  "episode_time_floor_seconds": 0,
  "report_display_limits": { "top_files_today": 10, "top_time_files_today": 10, "top_developers_totals": 10 },
  "writer_enabled": true,
  "detection": { "debounce_ms": 300, "typing_window_ms": 500, "post_format_nudge_ms": 1000, "ai_window_ms": 1000, "chat_apply_window_ms": 3000, "strict_human_typing": false, "grace_window_ms": 350 },
  "suppression": { "format_spam_enabled": true, "format_debounce_ms": 900, "format_max_burst_ms": 1200 },
  "typing": { "enabled": true, "small_insert_max": 3, "ime_small_insert_max": 6, "caret_advance_slop": 1, "inter_ms_fast": 300, "inter_ms_slow": 500, "ime_inter_ms_max": 1200, "tcs_human_threshold": 0.45, "tcs_probably_threshold": 0.25 },
  "detectors": { "format_whitespace_ratio_max": 0.1, "format_after_save_window_ms": 350, "tooling_multi_range_min": 5, "tooling_scatter_min": 16, "paste_min_chars": 30, "paste_clipboard_probe": "hash", "paste_clipboard_window_ms": 1500, "paste_hash_algo": "sha256", "ai_block_min_chars": 120, "ai_dual_block_chars": 80, "ai_structure_threshold": 0.7, "stream_adaptive": true, "stream_lines_min": 3 },
  "maintenance": { "force_snapshots_on_startup": true, "force_snapshots_on_startup_concurrency": 2 },
  "trust": { "ai_commands": [], "formatter_commands": [], "tooling_commands": [], "chat_apply_commands": [], "paste_commands": [] },
  "telemetry": { "debug": true },
  "features": { "detection_v1": true, "detection_v2": true, "discover_commands": true, "latent_intents": true, "elastic_windows": true, "pcm_corrections": true, "typing_enabled": true, "identity_capture": true, "strict_git_capture": true, "build_snapshots": true, "advisory_line_col": true, "schema_validate": false }
}
```

Fields

- workspace_salt: random per‑workspace salt for stable identifiers; do not change after events exist
- writer.rotate_bytes: journal rotation size in bytes (default ~50MB)
- inventory.mode: scope for indexing and reports — "modified" (faster, focused) or "all" (comprehensive)
- features.build_snapshots: enable per‑file snapshots used by reports
- features.advisory_line_col: include advisory line/column hints where available
- features.schema_validate: validate structures during development (off by default)

Tips

- Keep `.coderoot/**` out of commits (local artifacts)
- Do not change `workspace_salt` once events exist; it underpins stable IDs
- No cloud required; everything runs locally
