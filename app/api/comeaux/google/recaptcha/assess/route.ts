import { NextRequest, NextResponse } from "next/server";

const allowedActions = new Set(["login", "signup", "checkout", "customization_submit", "contact"]);

export async function POST(req: NextRequest) {
  const { token, action } = await req.json() as { token?: string; action?: string };
  if (!token || !action || !allowedActions.has(action)) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const projectId = process.env.GOOGLE_RECAPTCHA_PROJECT_ID;
  const siteKey = process.env.GOOGLE_RECAPTCHA_SITE_KEY;
  const apiKey = process.env.GOOGLE_RECAPTCHA_API_KEY;
  if (!projectId || !siteKey || !apiKey) {
    return NextResponse.json({ error: "reCAPTCHA Enterprise is not configured." }, { status: 503 });
  }

  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const assessment = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/assessments?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: {
          token,
          siteKey,
          expectedAction: action,
          userAgent: req.headers.get("user-agent") || undefined,
          userIpAddress: forwarded || undefined
        }
      }),
      cache: "no-store"
    }
  );

  const data = await assessment.json() as {
    tokenProperties?: { valid?: boolean; action?: string; hostname?: string; invalidReason?: string };
    riskAnalysis?: { score?: number; reasons?: string[] };
    name?: string;
  };

  const score = data.riskAnalysis?.score ?? 0;
  const valid = Boolean(data.tokenProperties?.valid && data.tokenProperties?.action === action);
  const decision = !valid ? "block" : score >= 0.7 ? "allow" : score >= 0.4 ? "review" : "block";

  return NextResponse.json({
    valid,
    action,
    score,
    decision,
    reasons: data.riskAnalysis?.reasons ?? [],
    assessmentName: data.name,
    hostname: data.tokenProperties?.hostname,
    invalidReason: data.tokenProperties?.invalidReason
  }, { status: assessment.ok ? 200 : assessment.status });
}
