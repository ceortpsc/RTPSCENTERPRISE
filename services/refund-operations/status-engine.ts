import type { RefundCaseSignal, RefundStatus } from './types';

/**
 * Internal refund-state normalization.
 * WMR-like labels may be recorded only as client-reported or verified evidence;
 * this service does not browse, scrape, automate, or impersonate the IRS WMR tool.
 */
export function normalizeRefundStatus(signal: RefundCaseSignal): RefundStatus {
  if (signal.bankProductFunded || signal.irsFundingDate) return 'FUNDED';
  if (signal.actionRequired || signal.authorizedIrsEvidenceStatus === 'ACTION_REQUIRED') return 'ACTION_REQUIRED';
  if (signal.reviewFlag || signal.authorizedIrsEvidenceStatus === 'REVIEW') return 'REVIEW';

  const verified = signal.authorizedIrsEvidenceStatus;
  if (verified === 'REFUND_SENT') return 'REFUND_SENT';
  if (verified === 'REFUND_APPROVED') return 'REFUND_APPROVED';
  if (verified === 'RETURN_RECEIVED') return 'PROCESSING';

  // Client-reported WMR state is usable for internal follow-up, not for a verified conclusion.
  if (signal.clientReportedWmrStatus === 'REFUND_SENT') return 'REFUND_SENT';
  if (signal.clientReportedWmrStatus === 'REFUND_APPROVED') return 'REFUND_APPROVED';
  if (signal.clientReportedWmrStatus === 'RETURN_RECEIVED') return 'PROCESSING';

  if (signal.efileAcknowledged) return 'ACKNOWLEDGED';
  return 'INTAKE';
}

export const officialWmrDisplayStages = [
  'Return Received',
  'Refund Approved',
  'Refund Sent',
] as const;
