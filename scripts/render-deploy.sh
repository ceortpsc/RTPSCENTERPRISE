#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${RENDER_DEPLOY_HOOK:-}" ]]; then
  echo "RENDER_DEPLOY_HOOK is required." >&2
  exit 1
fi

curl --fail-with-body --silent --show-error --request POST "$RENDER_DEPLOY_HOOK"
echo "Render deployment requested successfully."
