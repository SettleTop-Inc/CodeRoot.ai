<img src="assets\images\coderoot_logo.png" alt="CodeRoot.ai Logo" style="height:100px;" />

# See where your AI code takes root — and how it grows over time

CodeRoot.ai turns everyday editing into a simple, trustworthy picture of creation: Human vs AI vs Untracked. With a shared view of what’s happening in your codebase, teams can talk about impact and outcomes with facts, not anecdotes.

<img src="assets\images\screens\overview.gif" alt="CodeRoot.ai Report Overview"  />

## Who it’s for (at a glance)

- Developers: a fair view of your work and easy validation of recent changes
- Tech leads: clarity on AI usage and ownership; hotspots without guesswork
- Managers: objective trends you can compare over time and across teams
- Executives: visibility into AI’s contribution to production, not just change volume

<img src="assets\images\screens\daily_trend_area.png" alt="CodeRoot.ai Daily Trend Area"  />

## What you’ll see

CodeRoot.ai provides a shared lens on creation:

- Human — deliberate human edits
- AI — AI‑assisted creation and changes
- Untracked — unknown or missing attribution to follow up


All analysis runs locally. Reports are deterministic: the same inputs produce the same outputs, so comparisons remain stable over time.

## Install from the VS Code Marketplace

1) In VS Code, open the Extensions view
2) Search for “CodeRoot.ai” by SettleTop and click Install
3) Reload if prompted

## Quick start (2 minutes)

1) Open a folder that’s a Git repository
2) Run “CodeRoot: Initialize CodeRoot”
3) Run “CodeRoot: Generate Report” and open it

That’s it. A small `.coderoot/` folder appears in your repo (hidden by default). You can toggle its visibility any time from the Quick Menu.

## The Quick Menu (your control center)

Open “CodeRoot: Settings / Quick Menu.” From one place you can:

- Show/hide the `.coderoot` folder in Explorer
- Switch report scope: Modified vs All files
- Run an Identity Sweep to unify aliases
- Open the `.coderoot` folder
- (Optional) Enable CI script maintenance

<img src="assets\images\screens\quick_menu.png" alt="CodeRoot.ai Daily Trend Area"  />
Quick Menu — visibility, scope, identity, and CI

## Privacy and safety (designed-in)

- Local‑first: analysis runs on your machine; no servers are contacted
- Text‑free journals: we store counts, byte ranges, and hashes — not your code
- Deterministic outputs: identical inputs produce identical reports for trustworthy comparisons

Note for implementers: CodeRoot emits PCM 1.1.7 (text‑free, lines‑first). Readers accept legacy 1.1.3–1.1.7.

## Common actions

- Toggle .coderoot visibility: “CodeRoot: Toggle .coderoot Visibility”
- Switch scope: “CodeRoot: Inventory Mode — Modified/All”
- Run Identity Sweep: “CodeRoot: Run Identity Sweep” (unifies aliases for clean per‑person totals)
- Consolidate identities now: “CodeRoot: Consolidate Identities Now”
- Open .coderoot folder: “CodeRoot: Open .coderoot Folder”

Advanced (optional)

- CI reports: enable “CI Scripts Maintenance” in the Quick Menu to seed `.github/scripts/` and a workflow; add `.github/.coderoot-ci.lock` to opt out
- Migrate legacy journals: “CodeRoot: Migrate Legacy PCM Journals” to upgrade older entries in place

## Requirements

- VS Code 1.90.0 or later
- A Git repository workspace (recommended)
- A GitHub hosted project for CI integration (optional)

## Troubleshooting

- “I don’t see `.coderoot/`.” Run “CodeRoot: Initialize CodeRoot” in the workspace root
- “Git isn’t available.” Enable the VS Code Git extension
- “Report looks sparse.” Make sure you’ve worked in this repo after initializing; the report summarizes what happened locally

## License and support

CodeRoot.ai is licensed commercially with free evaluation through December 31, 2025 (see [LICENSE.md](LICENSE.md)). For questions or feedback, contact [support@coderoot.ai](mailto:support@coderoot.ai).

#### © 2025 SettleTop, Inc.
[![SettleTop](assets/images/settletop_logo.png)](https://www.settletop.com)

## Wiki / Documentation

Project documentation is available in the GitHub Wiki:

https://github.com/SettleTop-Inc/CodeRoot.ai/wiki

Markdown files placed under `docs/` are automatically published to the wiki when changes are merged into the default branch. Only `.md` files are copied.
