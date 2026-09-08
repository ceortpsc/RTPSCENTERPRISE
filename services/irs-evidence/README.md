# IRS Evidence Service

Internal-only starter service for human-initiated, authorization-gated IRS account evidence workflows.

- Synthetic data only.
- No IRS endpoints are hard-coded.
- `IRS_LIVE_ENABLED` defaults to `false`.
- All execution requests require a human-created request record, verified authorization scope, active employee/persona status, purpose-of-use, audit event, and approval where policy requires it.
- Worker execution is fail-closed unless formal integration configuration is supplied.
- Tax Pro Account browser automation, WMR scraping, IDRS access claims, and autonomous IRS correspondence are prohibited.
