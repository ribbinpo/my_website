---
name: attach-pr-evidence
description: Publish the screenshots, screen recordings and test reports that qa saved in .qa-evidence/ and embed them in the pull request body for a human to check. Use in the Delivery Workflow when opening or updating a PR and .qa-evidence/ has files.
---

# Attach QA evidence to a PR

`qa` saves what it saw while testing into `.qa-evidence/`: screenshots, screen recordings and test reports. This skill publishes those files and puts them in the PR, so the reviewer can check the change without running the app.

GitHub's API can't upload attachments to a PR body. So the files are committed to a separate branch, `qa-evidence`, and the PR body links to them by commit SHA. The feature branch never contains evidence.

## Steps

1. **Check there's something to attach.** If `.qa-evidence/` is missing or empty, write `No QA evidence: <reason from qa's report>` in the PR's QA evidence section and stop.
2. **Check the contents before publishing.** List the files and look at each screenshot. Anything you push is visible to everyone with repo access and stays in git history. Remove any file that shows real user data, tokens, API keys, cookies, or anything from outside the app under test. If you aren't sure, ask the user.
3. **Make sure `.qa-evidence/` is git-ignored** (`git check-ignore -q .qa-evidence`). If it isn't, add it to `.gitignore` as part of the PR.
4. **Publish:**
   ```bash
   .claude/skills/attach-pr-evidence/scripts/publish-evidence.sh .qa-evidence > .qa-evidence.md
   ```
   The script pushes one normal commit to `origin/qa-evidence`. It never force-pushes. It prints a Markdown block:
   - Images show inline.
   - Videos are a link, plus an inline GIF preview if `ffmpeg` is installed.
   - Other files (JUnit XML, logs, traces) are links.

   Warnings go to stderr. Read them, because the script reports skipped files there.
5. **Write the PR body.** Paste the block as the `## QA evidence` section, between `## Verification` and `## Deploy notes`. Under each file, add one line from qa's evidence list saying what it shows and what the reviewer should look for. Keep qa's verdict in `## Verification`.
6. **Remove the temporary files** after the PR is created or edited: `rm -rf .qa-evidence .qa-evidence.md`.

When qa runs again after a fix, publish again and replace the section with `gh pr edit <number> --body-file <file>`. Old evidence stays on the branch but is no longer linked.

## If it fails

- **`gh` isn't authenticated or the push is rejected** (e.g. a branch protection rule on `qa-evidence`): open the PR without the files. List them by name in QA evidence and say what blocked the upload.
- **A file over 50 MB is skipped:** ask `qa` for a shorter recording, or re-encode it (`ffmpeg -i in.mp4 -vf scale=540:-2 -crf 30 out.mp4`), then publish again.
- **Images don't render:** they render only for people who can read the repo. That's expected for private repos.
