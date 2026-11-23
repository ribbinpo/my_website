#!/usr/bin/env bash
# Publishes QA evidence (screenshots, recordings, test reports) to the `qa-evidence`
# branch on origin and prints a Markdown block for the PR body on stdout.
#
#   publish-evidence.sh [evidence-dir]     # default: .qa-evidence
#
# The feature branch and working tree are never touched: files are written straight
# into git objects with a temporary index and pushed as a normal (non-force) commit on
# top of the evidence branch. URLs are pinned to that commit, so they never change.
#
# Env: QA_EVIDENCE_BRANCH (default qa-evidence), QA_EVIDENCE_REMOTE (default origin).
# Needs git and gh. Uses ffmpeg, if installed, to add an inline GIF preview per video.
# Works with the bash 3.2 that ships with macOS.

set -u

dir=${1:-.qa-evidence}
ev_branch=${QA_EVIDENCE_BRANCH:-qa-evidence}
remote=${QA_EVIDENCE_REMOTE:-origin}
max_bytes=$((50 * 1024 * 1024))   # GitHub warns at 50 MB and rejects files over 100 MB

die() { echo "publish-evidence: $1" >&2; exit 1; }
warn() { echo "publish-evidence: warning: $1" >&2; }

[ -d "$dir" ] || die "evidence directory '$dir' not found"
git rev-parse --git-dir >/dev/null 2>&1 || die "not inside a git repository"
repo=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null) || die "can't resolve the GitHub repo (is gh authenticated?)"
[ -n "$repo" ] || die "can't resolve the GitHub repo"

git check-ignore -q "$dir" || warn "'$dir' is not in .gitignore; add it so evidence is never committed to the feature branch"

feature=$(git rev-parse --abbrev-ref HEAD)
safe_feature=$(printf '%s' "$feature" | tr -c 'A-Za-z0-9._-' '-')
prefix="$safe_feature/$(date -u +%Y%m%dT%H%M%SZ)"

tmp=$(mktemp -d) || die "mktemp failed"
trap 'rm -rf "$tmp"' EXIT

# ------------------------------------------------------------ collect files
files="$tmp/files"
: > "$files"
(cd "$dir" && find . -type f ! -name '.*' | sed 's#^\./##' | LC_ALL=C sort) | while IFS= read -r rel; do
  case "$rel" in
    *[!A-Za-z0-9._/-]*) warn "skipping '$rel': use only letters, digits, '.', '_', '-' in names"; continue ;;
  esac
  size=$(wc -c < "$dir/$rel" | tr -d ' ')
  if [ "$size" -gt "$max_bytes" ]; then
    warn "skipping '$rel': $size bytes is over 50 MB; trim or re-encode it"
    continue
  fi
  printf '%s\t%s\n' "$dir/$rel" "$rel" >> "$files"
  # Inline preview for videos: GitHub doesn't play videos committed to a repo.
  case "$rel" in
    *.mp4|*.mov|*.webm)
      if command -v ffmpeg >/dev/null 2>&1; then
        gif="$tmp/preview/${rel%.*}.gif"
        mkdir -p "$(dirname "$gif")"
        if ffmpeg -loglevel error -y -t 20 -i "$dir/$rel" \
             -vf 'fps=8,scale=320:-1:flags=lanczos' "$gif" </dev/null; then
          printf '%s\t%s\n' "$gif" "${rel%.*}.preview.gif" >> "$files"
        else
          warn "ffmpeg couldn't make a preview for '$rel'"
        fi
      fi ;;
  esac
done
[ -s "$files" ] || die "no publishable files in '$dir'"

# ------------------------------------------------------------ build and push the commit
export GIT_INDEX_FILE="$tmp/index"

attempt=0
while :; do
  attempt=$((attempt + 1))
  rm -f "$GIT_INDEX_FILE"
  parent=
  if git fetch -q "$remote" "refs/heads/$ev_branch" 2>/dev/null; then
    parent=$(git rev-parse FETCH_HEAD) || die "can't read fetched $ev_branch"
    git read-tree "$parent" || die "read-tree failed"
  else
    git read-tree --empty || die "read-tree failed"
  fi

  while IFS="$(printf '\t')" read -r src rel; do
    sha=$(git hash-object -w "$src") || die "hash-object failed for '$src'"
    git update-index --add --cacheinfo "100644,$sha,$prefix/$rel" || die "update-index failed for '$rel'"
  done < "$files"

  tree=$(git write-tree) || die "write-tree failed"
  msg="qa evidence: $feature ($prefix)"
  if [ -n "$parent" ]; then
    commit=$(git commit-tree "$tree" -p "$parent" -m "$msg") || die "commit-tree failed"
  else
    commit=$(git commit-tree "$tree" -m "$msg") || die "commit-tree failed"
  fi

  if git push -q "$remote" "$commit:refs/heads/$ev_branch" >/dev/null 2>"$tmp/push.err"; then
    break
  fi
  # Someone else pushed evidence at the same time: rebuild on the new tip and retry.
  [ "$attempt" -lt 3 ] || { cat "$tmp/push.err" >&2; die "push to $remote/$ev_branch failed"; }
done

# ------------------------------------------------------------ print the Markdown block
base="https://github.com/$repo/blob/$commit/$prefix"
echo "## QA evidence"
echo
echo "_Published to \`$ev_branch\` @ \`$(printf '%s' "$commit" | cut -c1-7)\` under \`$prefix/\`._"
echo
while IFS="$(printf '\t')" read -r src rel; do
  case "$rel" in
    *.preview.gif) continue ;;
    *.png|*.jpg|*.jpeg|*.gif|*.webp)
      echo "**\`$rel\`**"
      echo
      echo "<img src=\"$base/$rel?raw=true\" alt=\"$rel\" width=\"320\">"
      echo ;;
    *.mp4|*.mov|*.webm)
      echo "**\`$rel\`** ([download video]($base/$rel?raw=true))"
      echo
      if grep -q "	${rel%.*}.preview.gif\$" "$files"; then
        echo "<img src=\"$base/${rel%.*}.preview.gif?raw=true\" alt=\"$rel preview\" width=\"320\">"
        echo
      fi ;;
    *)
      echo "- [\`$rel\`]($base/$rel)" ;;
  esac
done < "$files"
