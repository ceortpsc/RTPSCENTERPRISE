export const refundOperationsRoutes = [
  { method: 'GET', path: '/internal/v1/refunds/live-feed', purpose: 'Role-filtered real-time refund operations feed' },
  { method: 'GET', path: '/internal/v1/refunds/kpis', purpose: 'Aggregate refund operations KPIs' },
  { method: 'GET', path: '/internal/v1/refunds/cases/:id', purpose: 'Case-safe refund tracking record' },
  { method: 'GET', path: '/internal/v1/refunds/cases/:id/timeline', purpose: 'Immutable refund status timeline' },
  { method: 'GET', path: '/internal/v1/refunds/cases/:id/traces', purpose: 'Analytic footprints and worker/query traces' },
  { method: 'POST', path: '/internal/v1/refunds/cases/:id/wmr-observations', purpose: 'Record a human/client-reported WMR observation; never automate WMR' },
  { method: 'POST', path: '/internal/v1/refunds/cases/:id/reconcile', purpose: 'Queue refund reconciliation job' },
  { method: 'POST', path: '/internal/v1/refunds/imports', purpose: 'Queue tokenizing workbook/import job from an approved secure source' },
  { method: 'GET', path: '/internal/v1/refunds/workers/queue', purpose: 'Background worker queue depth and state' },
  { method: 'GET', path: '/internal/v1/refunds/workers/runs', purpose: 'Background worker reliability and execution traces' },
] as const;

export const refundOperationsAccessPolicy = {
  publicAccess: false,
  requiresWorkforceIdentity: true,
  requiresTenantContext: true,
  requiresCaseAssignmentForCaseRoutes: true,
  rawSsnInRequestBody: false,
  rawTaxCredentialInRequestBody: false,
  wmrAutomation: false,
  clientReportedWmrRequiresHumanInitiation: true,
  externalConclusionRequiresPractitionerReview: true,
} as const;
