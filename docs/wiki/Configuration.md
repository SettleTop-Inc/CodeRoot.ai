# Configuration

Location: `.coderoot/config.json` (created/managed by the extension). Change settings via VS Code → Command Palette → "CodeRoot: Settings / Quick Menu".

## Overview

CodeRoot uses a comprehensive configuration system stored in `.coderoot/config.json`. Most settings have sensible defaults and rarely need adjustment.

## Key Configuration Groups

- **Writer**: Journal rotation, baseline settings, timing capture
- **Inference**: AI detection thresholds and classification rules
- **Inventory**: File indexing mode (modified vs all)
- **Aggregation**: Event merging and rollup settings
- **Report**: Report generation and presentation options
- **Detection**: Event detection windows and thresholds
- **Features**: Feature flags for enabling/disabling capabilities

## Common Settings

### Inventory Mode

`inventory.mode`: Controls which files are included in analysis
- `modified`: Only track modified files (faster, focused)
- `all`: Track all files (comprehensive baseline)

### Writer Settings

`writer.rotate_bytes`: Journal file rotation size (default: 50MB)
`writer.baseline_on_init`: Create baseline snapshot on initialization

### Feature Flags

`features.build_snapshots`: Enable snapshot generation (recommended: true)
`features.typing_enabled`: Enable typing detection (recommended: true)

## Minimal Example

```json
{
  "workspace_salt": "croot_XXXXXXXX",
  "writer": { "rotate_bytes": 52428800 },
  "inventory": { "mode": "all" },
  "features": { "build_snapshots": true }
}
```

## Full Documentation

For complete configuration reference, see the configuration schema at `docs/spec/coderoot-config/coderoot-config.schema.json`.

**Total Configuration Options**: 139+ settings available

