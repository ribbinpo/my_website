#!/usr/bin/env bash
# PreToolUse hook for Bash. It backs up the deny rules in .claude/settings.json and
# catches what those rules miss:
#   1. Any command that touches a secret file (cat .env, source .env, cp ~/.aws/credentials ...)
#   2. Blocked tools hidden inside wrappers: sh -c "...", bash -lc '...', eval, $(...),
#      backticks, sudo, env VAR=x, xargs, timeout, nohup, chains (; && || |), full paths
#   3. Piping text into a shell (echo ... | sh, curl ... | bash)
# Exit 2 blocks the call; the message on stderr is shown to Claude.
# Works with the bash 3.2 that ships with macOS. Requires jq.

set -u

cmd=$(jq -r '.tool_input.command // empty')
[ -z "$cmd" ] && exit 0

block() {
  echo "Blocked by .claude/hooks/guard-bash.sh: $1. See the Guardrails section in CLAUDE.md. Don't work around this. Tell the user what you needed." >&2
  exit 2
}

# ---------------------------------------------------------------- 1. secret files
# .env and .env.<anything>, except .env.example / .sample / .template / .dist
env_hits=$(printf '%s\n' "$cmd" \
  | grep -oE '(^|[^A-Za-z0-9_.-])\.env(\.[A-Za-z0-9_-]+)*([^A-Za-z0-9_.-]|$)' \
  | grep -oE '\.env(\.[A-Za-z0-9_-]+)*')
for f in $env_hits; do
  case "$f" in
    .env.example|.env.sample|.env.template|.env.dist) ;;
    *) block "access to secret file '$f'" ;;
  esac
done
if printf '%s\n' "$cmd" | grep -qE '(^|[^A-Za-z0-9_.-])\.envrc([^A-Za-z0-9_.-]|$)'; then
  block "access to secret file '.envrc'"
fi

secret_re='\.pem([^A-Za-z0-9]|$)|\.key([[:space:]"'"'"';|)]|$)|\.p12([^A-Za-z0-9]|$)|\.pfx([^A-Za-z0-9]|$)'
secret_re="$secret_re"'|id_rsa|id_ed25519|id_ecdsa|\.tfstate|\.tfvars'
secret_re="$secret_re"'|\.aws/|\.azure/|\.config/gcloud|\.kube/|\.ssh/|\.docker/config\.json|\.netrc|\.npmrc|\.pypirc'
secret_re="$secret_re"'|(^|[[:space:]/"'"'"'=])secrets/|credentials[^[:space:]]*\.json|service-account[^[:space:]]*\.json'
if hit=$(printf '%s\n' "$cmd" | grep -oE "$secret_re" | head -1) && [ -n "$hit" ]; then
  block "access to a secret or credential path (matched '$hit')"
fi

# ---------------------------------------------------------------- 3. piping into a shell
if printf '%s\n' "$cmd" | grep -qE '\|[[:space:]]*(sudo[[:space:]]+)?(/[^[:space:]]*/)?(ba|z|da|k)?sh([[:space:]]|$)'; then
  block "piping text into a shell"
fi

# ---------------------------------------------------------------- 2. command-position checks
# Split the command into segments at every place a new command can start.
segments=$(printf '%s\n' "$cmd" | awk '{ gsub(/\$\(|`|&&|\|\||[;&|]/, "\n"); print }')

blocked_tools=' kubectl helm terraform terragrunt tofu pulumi aws gcloud gsutil az eksctl doctl flyctl fly vercel netlify heroku ssh scp sftp rsync printenv '

wrapper_re='^(sudo|doas|exec|eval|nohup|time|command|builtin|nice|stdbuf|caffeinate|unbuffer)([[:space:]]+-[^[:space:]]+)*[[:space:]]+'
envwrap_re='^env([[:space:]]+(-[^[:space:]]+|[A-Za-z_][A-Za-z0-9_]*=[^[:space:]]*))*[[:space:]]+'
assign_re='^[A-Za-z_][A-Za-z0-9_]*=[^[:space:]]*[[:space:]]+'
timeout_re='^(g?timeout)([[:space:]]+-[^[:space:]]+)*[[:space:]]+[0-9.]+[smhd]?[[:space:]]+'
shellc_re='^(/[^[:space:]]*/)?(ba|z|da|k)?sh([[:space:]]+-[A-Za-z]+)*[[:space:]]+-[A-Za-z]*c[A-Za-z]*[[:space:]]+'

check_segment() {
  s=$1
  # Peel off wrappers until the real command is first.
  i=0
  while [ $i -lt 15 ]; do
    prev=$s
    s=$(printf '%s' "$s" | sed -E "s#^[[:space:](){}\"'\\\\]+##") || block "internal error in guard (failing closed)"
    s=$(printf '%s' "$s" | sed -E "s#$wrapper_re##; s#$envwrap_re##; s#$assign_re##; s#$timeout_re##; s#$shellc_re##") \
      || block "internal error in guard (failing closed)"
    [ "$s" = "$prev" ] && break
    i=$((i + 1))
  done
  [ -z "$s" ] && return 0

  first=${s%%[[:space:]]*}
  first=${first%\"}; first=${first%\'}
  base=${first##*/}

  # xargs / find -exec / watch / parallel run a command given as arguments: check every word.
  case "$base" in
    xargs|find|watch|parallel)
      for w in $s; do
        w=${w#\"}; w=${w#\'}; w=${w%\"}; w=${w%\'}; w=${w##*/}
        case "$blocked_tools" in *" $w "*) block "'$w' run through $base" ;; esac
      done ;;
  esac

  case "$blocked_tools" in *" $base "*) block "'$base' (live infrastructure, remote access or env dump)" ;; esac

  rest=${s#"$first"}
  if [ "$base" = env ] && [ -z "$(printf '%s' "$rest" | tr -d '[:space:]')" ]; then
    block "'env' dumps environment variables"
  fi

  sub=" $(printf '%s' "$rest" | tr -s '[:space:]' ' ' | sed -E 's/^ //; s/ $//') "
  case "$base" in
    docker)
      printf '%s' "$sub" | grep -qE '^ (push|login|context) ' && block "'docker${sub%% }'"
      printf '%s' "$sub" | grep -qE ' (-H|--host)([ =]|$)' && block "docker against a remote host"
      printf '%s' "$sub" | grep -qE '^ buildx build .*--push' && block "docker buildx --push"
      ;;
    gh)
      printf '%s' "$sub" | grep -qE '^ (secret|variable set|release create|pr merge|workflow (run|enable|disable)|run (rerun|cancel)) ' \
        && block "'gh${sub%% }'"
      ;;
    git)
      if printf '%s' "$sub" | grep -qE ' push '; then
        printf '%s' "$sub" | grep -qE ' (-f|--force[^ ]*|-[A-Za-z]*f[A-Za-z]*|\+[^ ]+) ' && block "force-push"
      fi
      ;;
  esac
  return 0
}

while IFS= read -r seg; do
  check_segment "$seg"
done <<EOF
$segments
EOF

exit 0
