#!/usr/bin/env bash
# Deploy only the independently built hardware documentation site.
set -euo pipefail
archive=${1:?usage: deploy-site.sh archive.tar.gz}
: "${DEPLOY_HOST:?DEPLOY_HOST is required}"
: "${DEPLOY_USER:?DEPLOY_USER is required}"
: "${DEPLOY_SSH_KEY:?DEPLOY_SSH_KEY is required}"
: "${DEPLOY_HOST_KEY:?DEPLOY_HOST_KEY is required}"
: "${DEPLOY_URL:?DEPLOY_URL is required}"
[[ "$DEPLOY_URL" == https://*/hardware-docs/ ]] || {
    echo 'Expected an HTTPS hardware-docs URL' >&2; exit 1;
}
dist=$(dirname "$archive")
(cd "$dist" && sha256sum --check --ignore-missing SHA256SUMS)
names=$(tar -tzf "$archive")
grep -Eq '^(\./)?index\.html$' <<< "$names"
grep -Eq '^(\./)?deployment\.json$' <<< "$names"
expected=$(tar -xOzf "$archive" ./deployment.json)
ssh_dir=$(mktemp -d)
trap 'rm -rf "$ssh_dir"' EXIT
printf '%s\n' "$DEPLOY_HOST_KEY" > "$ssh_dir/known_hosts"
printf '%s\n' "$DEPLOY_SSH_KEY" > "$ssh_dir/key"
chmod 600 "$ssh_dir/key"
remote=(ssh -i "$ssh_dir/key" -o IdentitiesOnly=yes -o BatchMode=yes
    -o UserKnownHostsFile="$ssh_dir/known_hosts" -o StrictHostKeyChecking=yes
    -o ConnectTimeout=20 "$DEPLOY_USER@$DEPLOY_HOST")
"${remote[@]}" deploy-hardware < "$archive"
if ! actual=$(curl --fail --silent --show-error --retry 3 \
    --max-time 30 "${DEPLOY_URL}deployment.json?version=${GITHUB_SHA:-check}") ||
    [[ "$actual" != "$expected" ]] ||
    ! curl --fail --silent --show-error --retry 3 --max-time 30 \
      "${DEPLOY_URL}mo-62a/hardware-development/overview/" -o /dev/null; then
    echo 'Hardware deployment smoke check failed; restoring previous site.' >&2
    "${remote[@]}" rollback-hardware
    exit 1
fi
echo 'Hardware site version and overview verified.'
