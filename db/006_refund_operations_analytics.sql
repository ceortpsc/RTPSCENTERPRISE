-- RTPSC Refund Operations Analytics
-- Internal operational tracking only. No WMR scraping and no raw SSN persistence.

CREATE TABLE IF NOT EXISTS refund_cases (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  client_case_id UUID NOT NULL,
  tax_year INTEGER NOT NULL,
  taxpayer_token TEXT NOT NULL,
  return_type TEXT NOT NULL DEFAULT '1040',
  efile_ack_at TIMESTAMPTZ,
  expected_refund_amount NUMERIC(14,2),
  actual_refund_amount NUMERIC(14,2),
  expected_ach_date DATE,
  irs_funding_date DATE,
  normalized_status TEXT NOT NULL DEFAULT 'ACKNOWLEDGED'
    CHECK (normalized_status IN (
      'INTAKE','TRANSMITTED','ACKNOWLEDGED','PROCESSING','REVIEW','ACTION_REQUIRED',
      'REFUND_APPROVED','REFUND_SENT','FUNDED','OFFSET_OR_ADJUSTMENT','CLOSED'
    )),
  source_confidence TEXT NOT NULL DEFAULT 'UNVERIFIED'
    CHECK (source_confidence IN ('UNVERIFIED','CLIENT_REPORTED','BANK_PRODUCT_VERIFIED','EFILE_VERIFIED','IRS_EVIDENCE_VERIFIED','PRACTITIONER_VERIFIED')),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, client_case_id, tax_year)
);

CREATE TABLE IF NOT EXISTS refund_status_events (
  id UUID PRIMARY KEY,
  refund_case_id UUID NOT NULL REFERENCES refund_cases(id),
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN (
    'EFILE_ACK','AUTHORIZED_IRS_EVIDENCE','BANK_PRODUCT','PRACTITIONER_ENTRY',
    'CLIENT_REPORTED_WMR','PAYMENT_RAIL','SYSTEM_DERIVED'
  )),
  source_reference TEXT,
  observed_at TIMESTAMPTZ NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confidence NUMERIC(5,4),
  evidence_hash TEXT,
  actor_id TEXT,
  correlation_id UUID NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS refund_analytic_traces (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  refund_case_id UUID REFERENCES refund_cases(id),
  trace_type TEXT NOT NULL CHECK (trace_type IN (
    'INGEST','NORMALIZE','STATUS_TRANSITION','RECONCILE','ANOMALY','WORKER','QUERY','NOTIFICATION','EXPORT'
  )),
  trace_key TEXT NOT NULL,
  correlation_id UUID NOT NULL,
  parent_trace_id UUID,
  worker_name TEXT,
  duration_ms INTEGER,
  result TEXT NOT NULL CHECK (result IN ('SUCCESS','PARTIAL','BLOCKED','FAILED','NO_CHANGE')),
  reason_code TEXT,
  input_hash TEXT,
  output_hash TEXT,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refund_worker_jobs (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  refund_case_id UUID REFERENCES refund_cases(id),
  job_type TEXT NOT NULL CHECK (job_type IN (
    'IMPORT_REFUND_RECORD','NORMALIZE_STATUS','RECONCILE_REFUND','REFRESH_ANALYTICS',
    'CHECK_STALE_CASE','GENERATE_CASE_TIMELINE','QUEUE_CLIENT_DRAFT','ARCHIVE_TRACE'
  )),
  state TEXT NOT NULL DEFAULT 'QUEUED'
    CHECK (state IN ('QUEUED','LEASED','RUNNING','SUCCEEDED','FAILED','DEAD_LETTER','CANCELLED')),
  priority INTEGER NOT NULL DEFAULT 50,
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  lease_expires_at TIMESTAMPTZ,
  leased_by TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  idempotency_key TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS refund_worker_runs (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES refund_worker_jobs(id),
  worker_name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  outcome TEXT CHECK (outcome IN ('SUCCEEDED','FAILED','BLOCKED','NO_CHANGE')),
  rows_read INTEGER NOT NULL DEFAULT 0,
  rows_written INTEGER NOT NULL DEFAULT 0,
  traces_created INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  error_code TEXT,
  error_digest TEXT
);

CREATE INDEX IF NOT EXISTS idx_refund_cases_status ON refund_cases (tenant_id, normalized_status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_refund_cases_ack ON refund_cases (tenant_id, efile_ack_at DESC);
CREATE INDEX IF NOT EXISTS idx_refund_events_case ON refund_status_events (refund_case_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_refund_traces_case ON refund_analytic_traces (refund_case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_refund_jobs_queue ON refund_worker_jobs (state, priority DESC, available_at);

CREATE OR REPLACE VIEW refund_operations_live_feed AS
SELECT
  c.tenant_id,
  c.id AS refund_case_id,
  c.tax_year,
  c.normalized_status,
  c.source_confidence,
  c.efile_ack_at,
  c.expected_ach_date,
  c.irs_funding_date,
  c.expected_refund_amount,
  c.actual_refund_amount,
  c.updated_at,
  EXTRACT(EPOCH FROM (NOW() - c.updated_at))/3600.0 AS hours_since_update,
  CASE
    WHEN c.irs_funding_date IS NOT NULL THEN 'FUNDED'
    WHEN c.normalized_status IN ('REVIEW','ACTION_REQUIRED') THEN 'ATTENTION'
    WHEN c.updated_at < NOW() - INTERVAL '48 hours' THEN 'STALE'
    ELSE 'CURRENT'
  END AS operational_health
FROM refund_cases c;

CREATE OR REPLACE VIEW refund_operations_kpis AS
SELECT
  tenant_id,
  COUNT(*) AS total_cases,
  COUNT(*) FILTER (WHERE normalized_status='FUNDED') AS funded_cases,
  COUNT(*) FILTER (WHERE normalized_status IN ('REVIEW','ACTION_REQUIRED')) AS attention_cases,
  COUNT(*) FILTER (WHERE updated_at < NOW() - INTERVAL '48 hours' AND normalized_status <> 'FUNDED') AS stale_cases,
  COALESCE(SUM(expected_refund_amount),0) AS expected_refund_total,
  COALESCE(SUM(actual_refund_amount),0) AS actual_refund_total,
  COALESCE(SUM(actual_refund_amount),0) - COALESCE(SUM(expected_refund_amount),0) AS refund_variance
FROM refund_cases
GROUP BY tenant_id;
