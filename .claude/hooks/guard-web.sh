#!/usr/bin/env bash
# PreToolUse hook for Bash, added by the web-frontend stack. Runs next to guard-bash.sh
# and backs up the web-frontend deny rules in .claude/settings.json:
#   1. Hosting deploy CLIs (vercel, netlify, wrangler, firebase, surge, gh-pages), also
#      when run through a package runner: npx, bunx, pnpx, npm exec, pnpm dlx, yarn dlx
#   2. Publishing and registry auth: npm/pnpm/yarn/bun publish, login, adduser, token ...
#   3. Deploy and release scripts: npm run deploy, pnpm release:prod, yarn deploy ...
#   4. Wrangler's local secrets file, .dev.vars
# Only words in command position are checked, so `grep -r firebase src` still works.
# Exit 2 blocks the call; the message on stderr is shown to Claude.
# Works with the bash 3.2 that ships with macOS. Requires jq.

set -u
set -f   # word splitting below must not expand globs

cmd=$(jq -r '.tool_input.command // empty')
[ -z "$cmd" ] && exit 0

block() {
  echo "Blocked by .claude/hooks/guard-web.sh: $1. See the Guardrails section in CLAUDE.md. Don't work around this. Tell the user what you needed." >&2
  exit 2
}

# .dev.vars and .dev.vars.<env>, except .dev.vars.example / .sample / .template
dv_hits=$(printf '%s\n' "$cmd" \
  | grep -oE '(^|[^A-Za-z0-9_.-])\.dev\.vars(\.[A-Za-z0-9_-]+)*([^A-Za-z0-9_.-]|$)' \
  | grep -oE '\.dev\.vars(\.[A-Za-z0-9_-]+)*')
for f in $dv_hits; do
  case "$f" in
    .dev.vars.example|.dev.vars.sample|.dev.vars.template) ;;
    *) block "access to secret file '$f'" ;;
  esac
done

deploy_tools=' vercel netlify netlify-cli wrangler firebase firebase-tools surge gh-pages '
runners=' npx bunx pnpx '
managers=' npm pnpm yarn bun '
# Words that run the next word as a command: wrappers, shells, eval, xargs.
transparent=' sudo doas env exec eval nohup time command builtin nice timeout gtimeout stdbuf xargs watch sh bash zsh dash ksh '
registry_cmds=' publish unpublish deprecate adduser login logout token owner dist-tag '

is_in() { case "$2" in *" $1 "*) return 0 ;; esac; return 1; }

is_release_script() {
  case "$1" in
    deploy|deploy:*|deploy-*|release|release:*|release-*|publish:*|publish-*) return 0 ;;
  esac
  return 1
}

# Split at every place a new command can start, then walk each segment's words.
segments=$(printf '%s\n' "$cmd" | awk '{ gsub(/\$\(|`|&&|\|\||[;&|()]/, "\n"); print }')
while IFS= read -r seg; do
  # state: cmd = next word is a command, mgr = next word is a package manager
  # subcommand, run = next word is a script name, other = nothing to check.
  state=cmd; mgr=; skip=
  for w in $seg; do
    w=${w#\"}; w=${w#\'}; w=${w%\"}; w=${w%\'}; w=${w%\\}
    # Value of a package manager flag (pnpm --filter web publish): not a subcommand.
    if [ -n "$skip" ]; then skip=; continue; fi
    case "$w" in
      --filter|-F|--dir|-C|--prefix|--cwd|--workspace|-w|--cache|--registry|--userconfig)
        [ "$state" = mgr ] && skip=1
        continue ;;
      -*) continue ;;
    esac
    w=${w##*/}
    # vercel@latest -> vercel (a scoped @org/pkg is left alone)
    case "$w" in @*) ;; *@*) w=${w%%@*} ;; esac

    case "$state" in
      cmd)
        case "$w" in
          [A-Za-z_]*=*) continue ;;                    # VAR=value prefix
          [0-9]*) continue ;;                          # timeout 30 ...
        esac
        is_in "$w" "$transparent" && continue
        is_in "$w" "$runners" && continue
        is_in "$w" "$deploy_tools" && block "'$w' (deploys go through CI or a human)"
        if is_in "$w" "$managers"; then mgr=$w; state=mgr; continue; fi
        state=other ;;
      mgr)
        case "$w" in
          dlx|exec|x) state=cmd; continue ;;
          run|run-script) state=run; continue ;;
        esac
        is_in "$w" "$registry_cmds" && block "'$mgr $w' (publishing and registry auth need the user's go-ahead)"
        # yarn/pnpm/bun run scripts without "run"
        is_release_script "$w" && block "'$mgr $w' (deploy and release scripts need the user's go-ahead)"
        state=other ;;
      run)
        is_release_script "$w" && block "'$mgr run $w' (deploy and release scripts need the user's go-ahead)"
        case "$w" in publish) block "'$mgr run $w' (publish scripts need the user's go-ahead)" ;; esac
        state=other ;;
    esac
  done
done <<EOF
$segments
EOF

exit 0
