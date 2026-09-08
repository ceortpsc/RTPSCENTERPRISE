# Tax Practitioner Masterfiles

Production-oriented reference service for a multi-tenant tax-practice masterfile and multi-year reconciliation system.

Included controls:

- Stable client account with tax-year folders
- Idempotent CSV ingestion
- AES-256-GCM field encryption for sensitive fields
- Tenant-scoped blind indexes
- Case notes, remedies, credits/adjustments, TC 846 and SBTPG sections
- Durable worker leasing, heartbeat and real-time event cursor model
- Fail-closed IRS/TDS/SOR/Tax Pro Account adapter boundary
- Immutable-style audit and replication records

This service does **not** claim direct IRS connectivity. Production integrations remain disabled until the applicable authorization, credentials, certificates, testing and service-specific approval are configured and independently verified.

## Test

```bash
python -m pip install -r requirements.txt
PYTHONPATH=. python -m unittest discover -s tests -v
```

## Local import

```bash
export TMF_MASTER_KEY_HEX="$(openssl rand -hex 32)"
python -m masterfiles.cli init --db ./masterfiles.db
python -m masterfiles.cli import --db ./masterfiles.db --tenant ross-tax-pro --tax-year 2025 /secure/path/report.csv
```

Do not place raw taxpayer exports, databases, production keys or decrypted documents in Git.
