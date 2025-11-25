# Commands

This page lists primary CodeRoot.ai commands available in VS Code and what they do.


Commands and quick examples

1. coderoot.settingsQuickMenu

	- Purpose: CodeRoot: Settings / Quick Menu
	- Use from: VS Code Command Palette (CodeRoot: Settings / Quick Menu)

2. coderoot.toggleVisibility

	- Purpose: CodeRoot: Toggle .coderoot Visibility
	- Use from: VS Code Command Palette (CodeRoot: Toggle .coderoot Visibility)

3. coderoot.openFolder

	- Purpose: CodeRoot: Open .coderoot Folder
	- Use from: VS Code Command Palette (CodeRoot: Open .coderoot Folder)

4. coderoot.initProject

	- Purpose: CodeRoot: Initialize CodeRoot
	- Use from: VS Code Command Palette (CodeRoot: Initialize CodeRoot)

5. coderoot.toggleJournal

	- Purpose: CodeRoot: Toggle Logging
	- Use from: VS Code Command Palette (CodeRoot: Toggle Logging)

6. coderoot.migrateLegacyPCM

	- Purpose: CodeRoot: Migrate Legacy PCM Journals
	- Use from: VS Code Command Palette (CodeRoot: Migrate Legacy PCM Journals)

7. coderoot.enableJournal

	- Purpose: CodeRoot: Enable Logging
	- Use from: VS Code Command Palette (CodeRoot: Enable Logging)

8. coderoot.disableJournal

	- Purpose: CodeRoot: Disable Logging
	- Use from: VS Code Command Palette (CodeRoot: Disable Logging)

9. coderoot.setInventoryModeModified

	- Purpose: CodeRoot: Inventory Mode — Modified
	- Use from: VS Code Command Palette (CodeRoot: Inventory Mode — Modified)

10. coderoot.setInventoryModeAll

	- Purpose: CodeRoot: Inventory Mode — All
	- Use from: VS Code Command Palette (CodeRoot: Inventory Mode — All)

11. coderoot.toggleInventoryMode

	- Purpose: CodeRoot: Toggle Inventory Mode
	- Use from: VS Code Command Palette (CodeRoot: Toggle Inventory Mode)

12. coderoot.generateReport

	- Purpose: CodeRoot: Generate Report
	- Use from: VS Code Command Palette (CodeRoot: Generate Report)

13. coderoot.consolidateIdentitiesNow

	- Purpose: CodeRoot: Consolidate Identities Now
	- Use from: VS Code Command Palette (CodeRoot: Consolidate Identities Now)

14. coderoot.trustIdentitySeeds

	- Purpose: CodeRoot: Trust Identity Seeds
	- Use from: VS Code Command Palette (CodeRoot: Trust Identity Seeds)

15. coderoot.toggleCiMaintenance

	- Purpose: CodeRoot: Toggle CI Scripts Maintenance
	- Use from: VS Code Command Palette (CodeRoot: Toggle CI Scripts Maintenance)

16. coderoot.viewKeybindingConflicts

	- Purpose: CodeRoot: View Keybinding Conflicts
	- Use from: VS Code Command Palette (CodeRoot: View Keybinding Conflicts)

17. coderoot.intercept.editor_action_clipboardPasteAction

	- Purpose: CodeRoot: Intercept Paste
	- Use from: VS Code Command Palette (CodeRoot: Intercept Paste)

18. coderoot.intercept.editor_action_formatDocument

	- Purpose: CodeRoot: Intercept Format Document
	- Use from: VS Code Command Palette (CodeRoot: Intercept Format Document)

19. coderoot.intercept.editor_action_formatSelection

	- Purpose: CodeRoot: Intercept Format Selection
	- Use from: VS Code Command Palette (CodeRoot: Intercept Format Selection)

20. coderoot.intercept.github_copilot_acceptSuggestion

	- Purpose: CodeRoot: Intercept CoPilot Accept Suggestion
	- Use from: VS Code Command Palette (CodeRoot: Intercept CoPilot Accept Suggestion)

21. coderoot.intercept.github_copilot_acceptInlineCompletion

	- Purpose: CodeRoot: Intercept CoPilot Accept Inline Completion
	- Use from: VS Code Command Palette (CodeRoot: Intercept CoPilot Accept Inline Completion)

22. coderoot.intercept.editor_action_inlineSuggest_commit

	- Purpose: CodeRoot: Intercept Inline Suggest Commit
	- Use from: VS Code Command Palette (CodeRoot: Intercept Inline Suggest Commit)

Notes & verification

1. Many commands require the workspace to be initialized and journaling enabled; the extension shows warnings if preconditions fail.
2. How to verify: after running commands that change state, use the Output channel (CodeRoot) or inspect `.coderoot/v1/*` files.

