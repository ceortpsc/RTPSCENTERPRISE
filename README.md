# RTPSC Enterprise

Enterprise foundation for Ross Tax Pro Software Co. providing unified access to Tax Practitioner Virtual Office, Ross Prime Payroll, Ross Tax Pro University, Ross E-Drive University, document services and enterprise support.

## Included in this foundation

- Next.js App Router public shell using the RTPSC navy/gold/silver/tan corporate theme
- Public-safe RTPSC SVG logo assets
- Node health/API service
- OpenAPI 3.1 contract
- PostgreSQL core schema with RBAC-oriented identity, support intake, approvals, document metadata and immutable audit events
- Workflow manifest with support, onboarding, tax-notice and maintenance gates
- Render Blueprint for `rtpsc-web`, `rtpsc-api` and `rtpsc-postgres`
- GitHub Actions CI for TypeScript/build, Python masterfiles tests and restricted-file policy checks
- Tax Practitioner Masterfiles reference service under `services/tax-masterfiles`

## Security boundary

This repository is public. Do not commit taxpayer exports, SSNs, bank information, EIN/PTIN/CAF/EFIN values, authentication secrets, certificates, production `.env` files or internal-controlled directives. Restricted source data should be ingested through controlled runtime storage and referenced by tokenized/opaque identifiers.

## Local web development

```bash
npm install
npm run dev
```

Health endpoints:

- Web: `GET /api/health`
- API: `GET /health` when running `node server/index.mjs`

## Masterfiles tests

```bash
python -m pip install -r services/tax-masterfiles/requirements.txt
PYTHONPATH=services/tax-masterfiles python -m unittest discover -s services/tax-masterfiles/tests -v
```

The tax-masterfiles integration boundary fails closed until separately authorized external adapters and credentials are configured. No live IRS connectivity is implied by this repository.
