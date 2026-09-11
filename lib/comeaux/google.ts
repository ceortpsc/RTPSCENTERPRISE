import { createSign } from "node:crypto";

const tokenCache = new Map<string, { accessToken: string; expiresAt: number }>();

function b64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export async function getGoogleServiceAccountToken(scopes: string[]) {
  const cacheKey = [...scopes].sort().join(" ");
  const cached = tokenCache.get(cacheKey);
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.expiresAt - now > 120) return cached.accessToken;

  const clientEmail = required("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = required("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY").replace(/\\n/g, "\n");
  const aud = "https://oauth2.googleapis.com/token";
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({
    iss: clientEmail,
    scope: scopes.join(" "),
    aud,
    iat: now,
    exp: now + 3600
  }));
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${signer.sign(privateKey).toString("base64url")}`;

  const response = await fetch(aud, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    }),
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`Google OAuth token exchange failed: ${response.status}`);
  const data = await response.json() as { access_token: string; expires_in: number };
  tokenCache.set(cacheKey, { accessToken: data.access_token, expiresAt: now + data.expires_in });
  return data.access_token;
}

export function merchantProductInput(product: {
  sku: string; name: string; description: string; priceCents: number; quantityOnHand: number;
}) {
  const origin = process.env.NEXT_PUBLIC_COMEAUX_STORE_ORIGIN || "http://localhost:3000";
  return {
    offerId: product.sku,
    contentLanguage: "en",
    feedLabel: "US",
    productAttributes: {
      title: product.name,
      description: product.description,
      link: `${origin}/comeaux-supply/products#${encodeURIComponent(product.sku)}`,
      condition: "new",
      availability: product.quantityOnHand > 0 ? "in stock" : "out of stock",
      price: {
        amountMicros: String(product.priceCents * 10_000),
        currencyCode: "USD"
      }
    }
  };
}
