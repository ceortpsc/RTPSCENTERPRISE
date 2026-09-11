import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let credential = "";
  let csrf = "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await req.formData();
    credential = String(form.get("credential") || "");
    csrf = String(form.get("g_csrf_token") || "");
  } else {
    const body = await req.json() as { credential?: string; g_csrf_token?: string };
    credential = body.credential || "";
    csrf = body.g_csrf_token || "";
  }

  const cookieCsrf = req.cookies.get("g_csrf_token")?.value || "";
  if (!credential || !csrf || !cookieCsrf || csrf !== cookieCsrf) {
    return NextResponse.json({ error: "CSRF validation failed." }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_IDENTITY_CLIENT_ID;
  if (!clientId) return NextResponse.json({ error: "Google Identity is not configured." }, { status: 503 });

  const verify = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`, { cache: "no-store" });
  if (!verify.ok) return NextResponse.json({ error: "Invalid Google credential." }, { status: 401 });

  const token = await verify.json() as { aud?: string; sub?: string; email?: string; email_verified?: string; name?: string; exp?: string };
  if (token.aud !== clientId || !token.sub) {
    return NextResponse.json({ error: "Token audience mismatch." }, { status: 401 });
  }

  // `sub` is the stable external identity key. Persist/lookup the local user separately,
  // then issue your own httpOnly, Secure, SameSite session cookie.
  return NextResponse.json({
    authenticated: true,
    googleSubject: token.sub,
    email: token.email,
    emailVerified: token.email_verified === "true",
    displayName: token.name,
    next: "/comeaux-supply/account"
  });
}
