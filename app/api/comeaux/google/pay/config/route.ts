import { NextResponse } from "next/server";

export async function GET() {
  const merchantId = process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID;
  const merchantName = process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_NAME || "Comeaux Clinical Supply & Print Co.";
  const gateway = process.env.NEXT_PUBLIC_GOOGLE_PAY_GATEWAY;
  const gatewayMerchantId = process.env.NEXT_PUBLIC_GOOGLE_PAY_GATEWAY_MERCHANT_ID;
  const environment = process.env.NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT === "PRODUCTION" ? "PRODUCTION" : "TEST";

  if (!gateway) return NextResponse.json({ configured: false, environment }, { status: 503 });

  return NextResponse.json({
    configured: true,
    environment,
    merchantInfo: { merchantId, merchantName },
    allowedPaymentMethods: [{
      type: "CARD",
      parameters: {
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        allowedCardNetworks: ["AMEX", "DISCOVER", "MASTERCARD", "VISA"],
        billingAddressRequired: true,
        billingAddressParameters: { format: "FULL-ISO3166", phoneNumberRequired: false }
      },
      tokenizationSpecification: {
        type: "PAYMENT_GATEWAY",
        parameters: {
          gateway,
          gatewayMerchantId: gatewayMerchantId || ""
        }
      }
    }]
  });
}
