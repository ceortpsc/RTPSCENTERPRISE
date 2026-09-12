#!/usr/bin/env bash
set -euo pipefail

: "${GCP_PROJECT_ID:?Set GCP_PROJECT_ID}"
: "${GCP_ARTIFACT_LOCATION:?Set GCP_ARTIFACT_LOCATION}"

GENERIC_REPO="${GCP_ARTIFACT_GENERIC_REPO:-comeaux-release-artifacts}"
DOCKER_REPO="${GCP_ARTIFACT_DOCKER_REPO:-comeaux-containers}"
RELEASE_VERSION="${COMEAUX_PLATFORM_VERSION:-2026.09.12}"

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud CLI is required." >&2
  exit 1
fi

gcloud config set project "$GCP_PROJECT_ID" >/dev/null

gcloud artifacts repositories describe "$GENERIC_REPO" --location="$GCP_ARTIFACT_LOCATION" >/dev/null 2>&1 || \
  gcloud artifacts repositories create "$GENERIC_REPO" \
    --repository-format=generic \
    --location="$GCP_ARTIFACT_LOCATION" \
    --description="Comeaux Clinical immutable release artifacts"

gcloud artifacts repositories describe "$DOCKER_REPO" --location="$GCP_ARTIFACT_LOCATION" >/dev/null 2>&1 || \
  gcloud artifacts repositories create "$DOCKER_REPO" \
    --repository-format=docker \
    --location="$GCP_ARTIFACT_LOCATION" \
    --description="Comeaux Clinical OCI images" \
    --immutable-tags

gcloud artifacts generic upload \
  --repository="$GENERIC_REPO" \
  --location="$GCP_ARTIFACT_LOCATION" \
  --package="api-contracts" \
  --version="$RELEASE_VERSION" \
  --source="contracts/comeaux/openapi.yaml"

gcloud artifacts generic upload \
  --repository="$GENERIC_REPO" \
  --location="$GCP_ARTIFACT_LOCATION" \
  --package="release-manifest" \
  --version="$RELEASE_VERSION" \
  --source="config/comeaux.artifacts.json"

if [[ -f build/ios/ComeauxClinical.xcarchive.zip ]]; then
  gcloud artifacts generic upload \
    --repository="$GENERIC_REPO" \
    --location="$GCP_ARTIFACT_LOCATION" \
    --package="ios-app" \
    --version="${COMEAUX_IOS_VERSION:-1.0.0-staging}" \
    --source="build/ios/ComeauxClinical.xcarchive.zip"
fi

echo "Artifact Registry publication complete for version ${RELEASE_VERSION}."
