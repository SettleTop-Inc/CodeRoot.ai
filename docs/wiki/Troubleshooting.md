# Troubleshooting

Common checks and fixes for CodeRoot.ai:

- I don't see `.coderoot` in VS Code: use "CodeRoot: Toggle .coderoot Visibility"
- Reports look sparse: work in the repo after initializing; the report summarizes local activity
- Git not detected: enable the VS Code Git extension and ensure Git is on PATH

If you need help, open an issue using the templates.

Top issues (symptom → quick fix)

1. Symptom: Report generation looks incomplete

	Fix: Ensure you've run "CodeRoot: Initialize CodeRoot" and made changes in the workspace; then run "CodeRoot: Generate Report".

2. Symptom: Identity totals don't match expectations

	Fix: Run "CodeRoot: Consolidate Identities Now", then regenerate the report.

3. Symptom: Nothing appears under `.coderoot/`

	Fix: The folder may be hidden; toggle visibility from the Quick Menu.

When to file an issue

- Deterministic mismatches between report totals and expectations
- Crashes with an error you can't interpret
- Questions about interpreting Human vs AI vs Untracked

