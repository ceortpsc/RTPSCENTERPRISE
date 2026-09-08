import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "rtpsc-web",
    version: process.env.RENDER_GIT_COMMIT ?? process.env.GIT_SHA ?? "development",
    timestamp: new Date().toISOString()
  }, { headers: { "Cache-Control": "no-store" } });
}
