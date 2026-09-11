# Google + Render implementation map

## Google Cloud / Google resources

Enable only what is actually used:

1. **Google Merchant API**
   - Create/verify Merchant Center account.
   - Create an API-type primary product data source.
   - Grant the runtime identity the Merchant Center access required for product management.
   - Configure `GOOGLE_MERCHANT_ACCOUNT_ID` and `GOOGLE_MERCHANT_DATASOURCE_ID`.
   - The sync route uses `productInputs:insert` and records one result per SKU.

2. **Google Identity Services**
   - Create a Web OAuth client.
   - Add the production/staging origins and login endpoint.
   - Configure `NEXT_PUBLIC_GOOGLE_IDENTITY_CLIENT_ID`.
   - Treat the Google `sub` claim as the stable external identity key; store app roles separately.

3. **reCAPTCHA Enterprise / Fraud Defense**
   - Register the staging and production domains.
   - Restrict the API key.
   - Configure project ID, site key and API key.
   - Generate a browser token per protected action, then call `/api/comeaux/google/recaptcha/assess` from the backend flow.
   - Do not trust a browser-supplied risk score.

4. **Google Pay**
   - Select a supported payment gateway unless the merchant independently qualifies for a direct PCI DSS integration.
   - Keep staging in `TEST`.
   - Complete Google Pay production review before switching the environment to `PRODUCTION`.
   - The config route intentionally exposes only public merchant/gateway configuration; secret processor credentials remain server-side.

5. **Google Search / analytics**
   - Add Search Console verification token to `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
   - Add GA4 measurement ID only after privacy/cookie-consent requirements for served jurisdictions are reviewed.
   - Submit product URLs/sitemap after production domain and canonical URLs are final.

## Render

Recommended staging service:
- branch: `feature/comeaux-clinical-store`
- runtime: Node
- region: Ohio for a Central Texas-centered US storefront when the selected account supports that region
- build: `npm ci && npm run build`
- start: `npm start`
- health: `/api/comeaux/health`

Secrets are never committed. Add them through Render environment variables. Use separate credentials for staging and production.

## Deployment gates

Do not switch the storefront to production until:
- build/typecheck pass;
- Google domains/redirect URIs match final HTTPS domains;
- Merchant product data is approved/eligible;
- payment gateway + Google Pay production access are approved;
- reCAPTCHA thresholds are tested with real traffic patterns;
- tax engine / Texas sales-tax collection is configured;
- policies and regulatory product claims are reviewed;
- fulfillment promises are supportable;
- employee accounts use MFA and least privilege.
