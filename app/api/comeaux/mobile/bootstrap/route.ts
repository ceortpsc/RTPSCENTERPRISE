import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  const origin = process.env.NEXT_PUBLIC_COMEAUX_STORE_ORIGIN || "http://localhost:3000";

  return NextResponse.json({
    apiVersion: "2026.09",
    minimumIOS: "17.0",
    brand: {
      name: "Comeaux Clinical Supply & Print Co.",
      academy: "Comeaux Clinical Training",
      theme: {
        background: "#FFFFFF",
        foreground: "#111111",
        purple: "#6D28D9",
        pink: "#EC4899"
      }
    },
    features: {
      storefront: true,
      training: true,
      verifiedSavings: true,
      account: true,
      offlineCatalogCache: true
    },
    endpoints: {
      home: `${origin}/comeaux-supply`,
      products: `${origin}/comeaux-supply/products`,
      savings: `${origin}/comeaux-supply/discounts`,
      account: `${origin}/comeaux-supply/account`,
      manifest: `${origin}/api/comeaux/platform/manifest`,
      health: `${origin}/api/comeaux/health`
    }
  });
}
