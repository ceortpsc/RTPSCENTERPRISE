# Comeaux Clinical — Mobile, API Hub & Artifact Registry Release Plane

## Purpose
This release plane gives Comeaux Clinical a versioned native iOS client, an OpenAPI contract, centralized API catalog metadata, and immutable release artifacts.

## Components

### Native iOS
- Source: `mobile/ios/ComeauxClinical`
- Minimum OS: iOS 17
- Bundle ID default: `com.comeauxclinical.mobile`
- Theme: white / black / purple / pink
- Bootstrap: `GET /api/comeaux/mobile/bootstrap`
- Release metadata: `GET /api/comeaux/platform/manifest`

The iOS app is a native SwiftUI scaffold. Commerce, account, LMS and verified-discount features should move from placeholder shells to authenticated API-backed screens as those APIs are implemented.

### OpenAPI
- Contract: `contracts/comeaux/openapi.yaml`
- Current version: `2026.09.12`
- The contract is intended for Apigee API Hub registration, client generation, linting and change review.

### Apigee API Hub
API Hub is the system of record for API resource metadata, versions, specs, operations, deployments and dependencies. The repository includes `cloud/apigee/api-hub/register.sh` to register the API/version/spec after API Hub has been provisioned in an authorized Google Cloud project.

Required environment:
- `GCP_API_HUB_PROJECT`
- `GCP_API_HUB_LOCATION`
- optional IDs: `COMEAUX_API_HUB_API_ID`, `COMEAUX_API_HUB_VERSION_ID`, `COMEAUX_API_HUB_SPEC_ID`

Do not claim API Hub registration is complete until the script runs successfully against the intended host project and the registered version/spec can be read back.

### Google Artifact Registry
Two repository types are planned:
- `comeaux-containers` — Docker/OCI images with immutable tags.
- `comeaux-release-artifacts` — generic immutable artifacts for OpenAPI, release manifests, iOS archives, PDFs and evidence bundles.

Use `cloud/artifact-registry/publish.sh` only with an authorized Google Cloud project. It creates the repositories if absent and uploads the contract/release manifest. An iOS archive is uploaded only when `build/ios/ComeauxClinical.xcarchive.zip` exists.

Required environment:
- `GCP_PROJECT_ID`
- `GCP_ARTIFACT_LOCATION`
- optional `GCP_ARTIFACT_GENERIC_REPO`, `GCP_ARTIFACT_DOCKER_REPO`

## Release gates
1. TypeScript/build passes.
2. OpenAPI contract exists and is reviewed for breaking changes.
3. iOS simulator build passes.
4. Commit SHA is recorded in the platform manifest.
5. Release artifacts receive version identifiers/checksums.
6. Staging deployment is verified.
7. API Hub registration is read back and deployment metadata is linked.
8. Production promotion requires explicit approval.

## Security
- Do not expose Google Cloud service-account keys to the client or repository.
- Use workload identity / short-lived credentials for CI when available.
- Mobile bootstrap returns public feature flags and endpoint metadata only.
- Customer credentials, health information, payment secrets and regulator records are never placed in release manifests.
