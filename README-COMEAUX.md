# Comeaux Clinical Supply & Print Co.

Production-oriented eCommerce module for `RTPSCENTERPRISE`, mounted at `/comeaux-supply`.

**Brand:** Comeaux Clinical Supply & Print Co.  
**Founder profile:** Alzor Comeaux, LVN — wound-care nursing background.  
**Tagline:** Clinical essentials. Personalized with care.

## Scope

- Medical-supply catalog restricted to lawful, non-prescription products and manufacturer-labeled goods.
- Scrubs, underscrubs/undergarments, compression/support wear, name badges, badge reels, and accessory organizers.
- Custom embroidery, DTF/heat-transfer, sublimation, engraved/printed name badges, and print-for-profit job intake.
- Customer accounts, employee/admin workspaces, catalog/variant/SKU/inventory registries, order/invoice/receipt records.
- Google Merchant API, Google Identity Services, reCAPTCHA Enterprise, Google Pay configuration, GA4/Search Console hooks.
- Fraud/audit records and policy-acceptance footprints.
- Render staging blueprint and environment-variable manifest.
- Texas sales-tax and federal internet-order compliance launch checklist.

## Route index

- `/comeaux-supply`
- `/comeaux-supply/products`
- `/comeaux-supply/customize`
- `/comeaux-supply/account`
- `/comeaux-supply/legal/privacy`
- `/comeaux-supply/legal/terms`
- `/comeaux-supply/legal/final-sale`
- `/comeaux-supply/legal/shipping`
- `/comeaux-supply/legal/medical-disclaimer`
- `/api/comeaux/health`
- `/api/comeaux/google/merchant/sync`
- `/api/comeaux/google/recaptcha/assess`
- `/api/comeaux/google/pay/config`
- `/api/comeaux/google/signin`

## Important launch condition

The module is code-ready but credentials and regulated-business identifiers are intentionally not hard-coded. Production launch requires approved merchant/payment credentials, a valid Google Cloud project, Merchant Center data source, reCAPTCHA key, verified domain, tax configuration, and legal review.
