#!/usr/bin/env bash
set -euo pipefail

: "${GCP_API_HUB_PROJECT:?Set GCP_API_HUB_PROJECT}"
: "${GCP_API_HUB_LOCATION:?Set GCP_API_HUB_LOCATION}"

API_ID="${COMEAUX_API_HUB_API_ID:-comeaux-clinical-platform}"
VERSION_ID="${COMEAUX_API_HUB_VERSION_ID:-v2026-09}"
SPEC_ID="${COMEAUX_API_HUB_SPEC_ID:-openapi-2026-09}"
SPEC_PATH="${COMEAUX_OPENAPI_PATH:-contracts/comeaux/openapi.yaml}"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud CLI is required." >&2
  exit 1
fi

gcloud apihub apis create \
  --api="$API_ID" \
  --display-name="Comeaux Clinical Platform API" \
  --description="Storefront, mobile bootstrap and regulated-training platform API catalog." \
  --project="$GCP_API_HUB_PROJECT" \
  --location="$GCP_API_HUB_LOCATION"

gcloud apihub apis versions create "$VERSION_ID" \
  --api="$API_ID" \
  --display-name="Comeaux Clinical API 2026.09" \
  --project="$GCP_API_HUB_PROJECT" \
  --location="$GCP_API_HUB_LOCATION"

gcloud apihub apis versions specs create "$SPEC_ID" \
  --api="$API_ID" \
  --version="$VERSION_ID" \
  --display-name="Comeaux Clinical OpenAPI 3.1" \
  --contents="$(cat "$SPEC_PATH")" \
  --contents-mime-type="application/yaml" \
  --project="$GCP_API_HUB_PROJECT" \
  --location="$GCP_API_HUB_LOCATION"

echo "API Hub registration submitted for ${API_ID}/${VERSION_ID}/${SPEC_ID}."
echo "Create/link deployment metadata after confirming the target endpoint and deployment type in the provisioned API Hub project."
