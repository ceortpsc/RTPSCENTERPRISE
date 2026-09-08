export const refundQueries = {
  liveFeed: `SELECT * FROM refund_operations_live_feed WHERE tenant_id = $1 ORDER BY updated_at DESC LIMIT $2`,
  kpis: `SELECT * FROM refund_operations_kpis WHERE tenant_id = $1`,
  staleCases: `SELECT * FROM refund_operations_live_feed WHERE tenant_id = $1 AND operational_health='STALE' ORDER BY hours_since_update DESC`,
  attentionCases: `SELECT * FROM refund_operations_live_feed WHERE tenant_id = $1 AND operational_health='ATTENTION' ORDER BY updated_at ASC`,
  fundedToday: `SELECT * FROM refund_cases WHERE tenant_id=$1 AND irs_funding_date=CURRENT_DATE ORDER BY updated_at DESC`,
  variance: `SELECT id, client_case_id, expected_refund_amount, actual_refund_amount, actual_refund_amount-expected_refund_amount AS variance FROM refund_cases WHERE tenant_id=$1 AND actual_refund_amount IS NOT NULL ORDER BY ABS(actual_refund_amount-expected_refund_amount) DESC`,
  timeline: `SELECT * FROM refund_status_events WHERE refund_case_id=$1 ORDER BY observed_at ASC, recorded_at ASC`,
  workerQueue: `SELECT job_type, state, COUNT(*) AS jobs FROM refund_worker_jobs WHERE tenant_id=$1 GROUP BY job_type, state ORDER BY job_type, state`,
  workerFailures: `SELECT * FROM refund_worker_jobs WHERE tenant_id=$1 AND state IN ('FAILED','DEAD_LETTER') ORDER BY updated_at DESC LIMIT $2`,
  traces: `SELECT * FROM refund_analytic_traces WHERE tenant_id=$1 AND refund_case_id=$2 ORDER BY created_at DESC LIMIT $3`,
};
