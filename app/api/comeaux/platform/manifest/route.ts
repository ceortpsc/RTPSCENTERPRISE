import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const origin = process.env.NEXT_PUBLIC_COMEAUX_STORE_ORIGIN || "http://localhost:3000";
  const version = process.env.COMEAUX_PLATFORM_VERSION || "2026.09.12";
  const commit = process.env.RENDER_GIT_COMMIT || process.env.GITHUB_SHA || "local";

  return NextResponse.json({
    schemaVersion: "1.0.0",
    platform: "Comeaux Clinical Platform",
    version,
    commit,
    environment: process.env.NODE_ENV || "development",
    runtime: "nextjs-node",
    contracts: {
      openapiRepositoryPath: "contracts/comeaux/openapi.yaml",
      health: `${origin}/api/comeaux/health`,
      mobileBootstrap: `${origin}/api/comeaux/mobile/bootstrap`
    },
    mobile: {
      ios: {
        minimumOS: "17.0",
        bundleId: process.env.COMEAUX_IOS_BUNDLE_ID || "com.comeauxclinical.mobile",
        releaseChannel: process.env.COMEAUX_IOS_RELEASE_CHANNEL || "staging"
      }
    },
    integrations: {
      apigeeApiHubConfigured: Boolean(process.env.GCP_API_HUB_PROJECT && process.env.GCP_API_HUB_LOCATION),
      artifactRegistryConfigured: Boolean(process.env.GCP_PROJECT_ID && process.env.GCP_ARTIFACT_LOCATION && process.env.GCP_ARTIFACT_GENERIC_REPO),
      render: Boolean(process.env.RENDER),
      googleIdentity: Boolean(process.env.NEXT_PUBLIC_GOOGLE_IDENTITY_CLIENT_ID)
    },
    generatedAt: new Date().toISOString()
  });
}
