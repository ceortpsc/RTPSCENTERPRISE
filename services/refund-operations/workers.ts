export const refundWorkers = {
  importWorker: {
    name: 'refund-import-worker',
    purpose: 'Validate source headers, tokenize taxpayer identifiers outside logs, upsert operational refund fields, create ingest traces.',
  },
  normalizationWorker: {
    name: 'refund-status-normalizer',
    purpose: 'Normalize e-file, authorized evidence, bank-product, and practitioner signals into the internal refund state machine.',
  },
  reconciliationWorker: {
    name: 'refund-reconciliation-worker',
    purpose: 'Compare expected versus actual refund/funding values and create variance tasks without changing official records.',
  },
  staleCaseWorker: {
    name: 'refund-stale-case-worker',
    purpose: 'Identify cases that have not received a verified update within policy thresholds and route them for human review.',
  },
  analyticsWorker: {
    name: 'refund-analytics-worker',
    purpose: 'Refresh KPI/live-feed aggregates and operational-health metrics.',
  },
  timelineWorker: {
    name: 'refund-timeline-worker',
    purpose: 'Generate case timelines from immutable status events and verified evidence references.',
  },
  communicationDraftWorker: {
    name: 'refund-client-draft-worker',
    purpose: 'Draft client updates from approved case facts. Never dispatch without the existing human communication approval gate.',
  },
  traceArchiveWorker: {
    name: 'refund-trace-archive-worker',
    purpose: 'Archive high-volume analytic traces according to retention policy while preserving immutable audit references.',
  },
} as const;

export const refundJobCadence = {
  queueSweep: 'every 5 minutes',
  analyticsRefresh: 'every 15 minutes',
  staleCaseScan: 'hourly',
  dailyOperationsRollup: 'daily',
  wmrAssistRule: 'No automated WMR polling. IRS says WMR updates once daily; RTPSC stores only authorized evidence or human/client-reported WMR observations.',
} as const;
