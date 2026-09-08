export type EvidenceFact = { key: string; value: string | number | null; sourceEvidenceId: string; verified: boolean };
export type ReconciliationVariance = { key: string; evidenceValue: unknown; clientValue: unknown; sourceEvidenceId: string };

export function reconcileEvidence(evidence: EvidenceFact[], clientRecord: Record<string, unknown>) {
  const variances: ReconciliationVariance[] = [];
  for (const fact of evidence) {
    if (!fact.verified) continue;
    const clientValue = clientRecord[fact.key];
    if (clientValue !== undefined && clientValue !== fact.value) {
      variances.push({ key: fact.key, evidenceValue: fact.value, clientValue, sourceEvidenceId: fact.sourceEvidenceId });
    }
  }
  return { status: variances.length ? "VARIANCES_FOUND" : "COMPLETE", variances } as const;
}
