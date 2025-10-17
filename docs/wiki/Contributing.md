# Contributing

We appreciate contributions and provide templates and automated helpers to keep the repository consistent.

How to contribute:

1. Open an issue using the templates in `.github/ISSUE_TEMPLATE/`.
2. For code changes, create a feature branch and open a Pull Request (PR) against the default branch.
3. Use the reporter to generate reports if your change includes snapshot/migration behavior: `vscode command: CodeRoot: Generate Report`.

Guidelines:

- Follow the PCM schema when emitting or modifying journal events (`src/pcm.ts`).
- Keep `.coderoot` artifacts out of commits unless they are intentionally part of a baseline or migration (config and manifest are ok). The default `.gitignore` includes `.coderoot/**`.
- Run the included `scripts/init-wiki.js --dry-run --docs docs/wiki` to verify wiki changes locally before pushing.

How to propose changes

1. Open an issue using the templates in `.github/ISSUE_TEMPLATE/`.
2. For code changes, create a branch named `feature/<short-topic>` and open a PR against the default branch.
3. Include a short description, the motivation, and a small example if the change affects PCM or reports.

PR checklist (short)

- Title and description explain the change and risk.
- Tests added or existing tests updated where relevant.
- Docs updated (`docs/wiki/*`) for user-visible behavior.
- `npm run validate` passes locally.

Doc style guide

- Headings: use H2 for page titles and H3 for subsections.
- Links: use relative links for other wiki pages (e.g., `[Installation](Installation.md)`).
- Code fences: include a language where reasonable; keep examples short (≤ 15 lines).

How to verify

1. Run `npm run validate` and `npm run lint` locally before opening the PR.
2. Run the extension's integration checks if the change touches snapshots or reports.

