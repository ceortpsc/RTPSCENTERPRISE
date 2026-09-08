-- RTPSC Refund Operations query pack

-- Live operational feed
SELECT *
FROM refund_operations_live_feed
WHERE tenant_id = $1
ORDER BY updated_at DESC
LIMIT 250;

-- Cases requiring attention
SELECT *
FROM refund_operations_live_feed
WHERE tenant_id = $1
  AND operational_health = 'ATTENTION'
ORDER BY updated_at ASC;

-- Stale cases
SELECT *
FROM refund_operations_live_feed
WHERE tenant_id = $1
  AND operational_health = 'STALE'
ORDER BY hours_since_update DESC;

-- Expected vs actual variance
SELECT
  id,
  client_case_id,
  expected_refund_amount,
  actual_refund_amount,
  actual_refund_amount - expected_refund_amount AS variance
FROM refund_cases
WHERE tenant_id = $1
  AND actual_refund_amount IS NOT NULL
ORDER BY ABS(actual_refund_amount - expected_refund_amount) DESC;

-- Funding velocity
SELECT
  tax_year,
  COUNT(*) AS funded_cases,
  AVG(EXTRACT(EPOCH FROM (irs_funding_date::timestamp - efile_ack_at))/86400.0) AS avg_ack_to_funding_days
FROM refund_cases
WHERE tenant_id = $1
  AND irs_funding_date IS NOT NULL
  AND efile_ack_at IS NOT NULL
GROUP BY tax_year
ORDER BY tax_year DESC;

-- Worker queue depth
SELECT job_type, state, COUNT(*) AS jobs
FROM refund_worker_jobs
WHERE tenant_id = $1
GROUP BY job_type, state
ORDER BY job_type, state;

-- Worker reliability
SELECT
  worker_name,
  COUNT(*) AS runs,
  COUNT(*) FILTER (WHERE outcome='SUCCEEDED') AS succeeded,
  COUNT(*) FILTER (WHERE outcome='FAILED') AS failed,
  ROUND(AVG(duration_ms),2) AS avg_duration_ms
FROM refund_worker_runs
GROUP BY worker_name
ORDER BY worker_name;

-- Trace diagnostics
SELECT trace_type, result, COUNT(*) AS traces, ROUND(AVG(duration_ms),2) AS avg_duration_ms
FROM refund_analytic_traces
WHERE tenant_id = $1
  AND created_at >= NOW() - INTERVAL '24 hours'
GROUP BY trace_type, result
ORDER BY trace_type, result;
