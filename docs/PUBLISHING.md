# Publishing to the GitHub Wiki

This repository automatically publishes documentation from the `docs/` directory to the GitHub Wiki.

Rules

- Only files with a `.md` extension are copied to the wiki.
- Files are copied preserving their relative paths under `docs/`.
- The publishing workflow runs when commits are pushed to the default branch (e.g., `main`) or when a pull request that includes `docs/**` changes is merged.

How it works

- A GitHub Actions workflow checks out the repository and runs `node scripts/init-wiki.js --docs docs`.
- The script clones the repository's wiki (e.g., `https://github.com/<owner>/<repo>.wiki.git`) into a temporary directory, copies markdown files from `docs/` into the wiki working tree, commits, and pushes the changes.
- On GitHub Actions the workflow uses `GITHUB_TOKEN` so no additional secrets are required by default.

Local testing

Run a dry run locally to see which files would be copied without pushing anything:

```pwsh
node scripts/init-wiki.js --docs docs --dry-run
```

If you want to perform a real push from your machine, ensure your local git credentials allow pushing to the wiki remote or pass an authenticated `--wiki-url` (not recommended in shell history).

Security notes

- The workflow uses the repository's `GITHUB_TOKEN` by default. If your organization restricts that token's permissions, create a deploy PAT with appropriate repo permissions and store it in repository secrets, then update the workflow to use that secret.

FAQ

Q: Will non-markdown files (images, PDFs) be published to the wiki?
A: No. Only `.md` files are copied. If you need attachments in the wiki, those must be added manually or we can extend the script to include selected asset directories.

Q: Can I skip wiki publishing for a particular PR?
A: You can add an opt-out label or a CI lock file; I can help implement either pattern if desired.
