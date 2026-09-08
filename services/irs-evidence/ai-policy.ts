export type AiEvidenceDraft = {
  banner: "AI Draft — Human Review Required";
  sourceEvidenceIds: string[];
  confidence: number;
  summary: string;
  externalDispatchAllowed: false;
  irsSystemAccessAllowed: false;
  caseClosureAllowed: false;
};

export function buildAiDraft(input: Omit<AiEvidenceDraft, "banner" | "externalDispatchAllowed" | "irsSystemAccessAllowed" | "caseClosureAllowed">): AiEvidenceDraft {
  return {
    banner: "AI Draft — Human Review Required",
    externalDispatchAllowed: false,
    irsSystemAccessAllowed: false,
    caseClosureAllowed: false,
    ...input
  };
}
