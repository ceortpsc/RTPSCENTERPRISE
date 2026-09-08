# RTPSC Refund Operations, WMR Assist & Analytic Footprints

## Product phrasing

**RTPSC Refund Operations Command Center** is an internal, evidence-driven refund tracking and analytics system that converts e-file acknowledgments, authorized IRS account evidence, verified bank-product funding data, practitioner observations and client-reported WMR updates into a secure case timeline, real-time operational feed, exception queue and auditable analytic footprint.

The system is **not** an IRS Where's My Refund scraper, public taxpayer lookup, autonomous IRS bot, or source of independent IRS status claims.

## WMR Assist feature

The IRS Where's My Refund tracker uses three public-facing stages: **Return Received → Refund Approved → Refund Sent**. RTPSC may display these labels when the source is either authorized official evidence or a clearly labeled client/practitioner-reported WMR observation. RTPSC does not automate browser access to WMR and does not store WMR login/session artifacts.

Current IRS guidance says WMR can generally be checked 24 hours after a current-year e-file, 3–4 days after a prior-year e-file, or 4 weeks after a paper filing. The IRS also says the tool updates once daily, generally overnight. RTPSC therefore prohibits high-frequency WMR polling.

## Internal normalized lifecycle

```text
INTAKE
→ TRANSMITTED
→ ACKNOWLEDGED
→ PROCESSING
→ REVIEW / ACTION_REQUIRED (when applicable)
→ REFUND_APPROVED
→ REFUND_SENT
→ FUNDED
→ CLOSED
```

The internal lifecycle is deliberately richer than WMR because RTPSC also tracks ERO acknowledgment, funding/reconciliation, bank-product activity, practitioner review and case closure.

## Analytic footprints

Every meaningful operation creates a trace containing:

- correlation ID
- case reference
- trace type
- worker/query name
- source classification
- result state
- reason code
- input/output hashes where appropriate
- duration
- safe aggregate metrics
- timestamp

Raw taxpayer identifiers, full EFIN/PTIN values, credentials and account numbers are excluded from traces.

## Real-time jobs

1. `refund-import-worker` — safe field mapping + tokenized identity reference.
2. `refund-status-normalizer` — converts evidence into normalized status.
3. `refund-reconciliation-worker` — expected/actual/funding variance analysis.
4. `refund-stale-case-worker` — stale-case detection and routing.
5. `refund-analytics-worker` — KPI/live-feed refresh.
6. `refund-timeline-worker` — immutable case timeline generation.
7. `refund-client-draft-worker` — human-review-required client update drafts.
8. `refund-trace-archive-worker` — retention/archival of operational traces.

## Queries and dashboards

Recommended command-center tiles:

- total active refund cases
- acknowledged today
- cases in review/action required
- refund approved
- refund sent
- funded today
- stale cases
- expected vs actual refund variance
- average ACK-to-funding duration
- worker queue depth
- worker failures/dead letters
- trace volume and query latency
- evidence source confidence

## Spreadsheet ingestion boundary

The source workbook may contain names, SSNs, PTIN/EFIN values, check/account references and other restricted information. Import processing must tokenize or vault identifiers before persistence and must never copy the raw workbook into a public repository, application log, analytics trace or search index.

The supported operational fields include tax year, IRS ACK date, expected ACH date, application status, expected/actual IRS refund amount, IRS funding date, state refund amounts, preparation fees, disbursement type and advance fields.

## Source confidence

```text
UNVERIFIED
CLIENT_REPORTED
BANK_PRODUCT_VERIFIED
EFILE_VERIFIED
IRS_EVIDENCE_VERIFIED
PRACTITIONER_VERIFIED
```

External/client-facing conclusions require an appropriate verified source and practitioner review under the existing RTPSC approval model.
