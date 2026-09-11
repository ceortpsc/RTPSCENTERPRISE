import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "comeaux-clinical-store",
    integrations: {
      merchant: Boolean(process.env.GOOGLE_MERCHANT_ACCOUNT_ID && process.env.GOOGLE_MERCHANT_DATASOURCE_ID),
      recaptcha: Boolean(process.env.GOOGLE_RECAPTCHA_PROJECT_ID && process.env.GOOGLE_RECAPTCHA_SITE_KEY),
      googlePay: Boolean(process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID && process.env.NEXT_PUBLIC_GOOGLE_PAY_GATEWAY),
      googleIdentity: Boolean(process.env.NEXT_PUBLIC_GOOGLE_IDENTITY_CLIENT_ID)
    },
    time: new Date().toISOString()
  });
}
