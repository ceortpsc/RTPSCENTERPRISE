import { createHash, randomUUID } from 'node:crypto';
import type { AnalyticFootprint } from './types';

export function hashTracePayload(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export function createFootprint(input: Omit<AnalyticFootprint, 'correlationId'> & { correlationId?: string }): AnalyticFootprint {
  return {
    ...input,
    correlationId: input.correlationId ?? randomUUID(),
  };
}

export const traceVocabulary = {
  INGEST: 'Source row accepted/rejected and normalized into a case-safe record.',
  NORMALIZE: 'Signals evaluated by the refund status engine.',
  STATUS_TRANSITION: 'Case state changed with source, timestamp, confidence and correlation ID.',
  RECONCILE: 'Expected, actual, funding and evidence values compared.',
  ANOMALY: 'Stale, conflicting, missing, duplicate or unexpected condition detected.',
  WORKER: 'Background job execution footprint.',
  QUERY: 'Authorized operational query footprint with row-count/latency metadata only.',
  NOTIFICATION: 'Draft/approved communication workflow trace.',
  EXPORT: 'Authorized export footprint with classification and result hash.',
} as const;
