export type RefundStatus =
  | 'INTAKE'
  | 'TRANSMITTED'
  | 'ACKNOWLEDGED'
  | 'PROCESSING'
  | 'REVIEW'
  | 'ACTION_REQUIRED'
  | 'REFUND_APPROVED'
  | 'REFUND_SENT'
  | 'FUNDED'
  | 'OFFSET_OR_ADJUSTMENT'
  | 'CLOSED';

export type RefundEvidenceSource =
  | 'EFILE_ACK'
  | 'AUTHORIZED_IRS_EVIDENCE'
  | 'BANK_PRODUCT'
  | 'PRACTITIONER_ENTRY'
  | 'CLIENT_REPORTED_WMR'
  | 'PAYMENT_RAIL'
  | 'SYSTEM_DERIVED';

export type RefundCaseSignal = {
  efileAcknowledged?: boolean;
  authorizedIrsEvidenceStatus?: 'RETURN_RECEIVED' | 'REFUND_APPROVED' | 'REFUND_SENT' | 'REVIEW' | 'ACTION_REQUIRED';
  clientReportedWmrStatus?: 'RETURN_RECEIVED' | 'REFUND_APPROVED' | 'REFUND_SENT';
  bankProductFunded?: boolean;
  actualRefundAmount?: number | null;
  irsFundingDate?: string | null;
  reviewFlag?: boolean;
  actionRequired?: boolean;
};

export type AnalyticFootprint = {
  traceType: 'INGEST' | 'NORMALIZE' | 'STATUS_TRANSITION' | 'RECONCILE' | 'ANOMALY' | 'WORKER' | 'QUERY' | 'NOTIFICATION' | 'EXPORT';
  traceKey: string;
  correlationId: string;
  result: 'SUCCESS' | 'PARTIAL' | 'BLOCKED' | 'FAILED' | 'NO_CHANGE';
  reasonCode?: string;
  metrics?: Record<string, number | string | boolean | null>;
};
