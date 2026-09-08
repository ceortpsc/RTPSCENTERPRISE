export type Persona =
  | "OWNER_CEO"
  | "TAX_OPERATIONS_DIRECTOR"
  | "TAX_PRACTITIONER"
  | "TAX_RESOLUTION_SPECIALIST"
  | "TAX_REVIEWER_QC"
  | "IRS_AUTHORIZATION_ADMIN"
  | "TAX_INTAKE_SPECIALIST"
  | "DATA_ENTRY_SPECIALIST"
  | "COMPLIANCE_OFFICER"
  | "INFORMATION_SECURITY_OFFICER"
  | "IRS_API_WORKER"
  | "TRANSCRIPT_PARSER_WORKER"
  | "RECONCILIATION_WORKER"
  | "AI_CASE_ASSISTANT"
  | "COMMUNICATION_WORKER"
  | "RELEASE_MANAGER";

export type InternalIrsRequestContext = {
  workforceIdentity: string;
  persona: Persona;
  tenantId: string;
  legalEntityId: string;
  clientCaseId?: string;
  dataClassification: "RESTRICTED_CLIENT_TAXPAYER";
  purposeOfUse: string;
  sessionAssurance: "MFA_VERIFIED" | "STEP_UP_VERIFIED";
  correlationId: string;
  idempotencyKey?: string;
  deviceRiskLevel: "LOW" | "MEDIUM" | "HIGH";
};

export function assertInternalIrsPolicy(ctx: InternalIrsRequestContext, action: string) {
  if (!ctx.workforceIdentity) throw new Error("workforce_identity_required");
  if (!ctx.tenantId || !ctx.legalEntityId) throw new Error("tenant_entity_context_required");
  if (!ctx.purposeOfUse) throw new Error("purpose_of_use_required");
  if (ctx.sessionAssurance !== "MFA_VERIFIED" && ctx.sessionAssurance !== "STEP_UP_VERIFIED") throw new Error("assurance_required");
  if (ctx.deviceRiskLevel === "HIGH") throw new Error("high_risk_session_blocked");
  if (action !== "READ" && !ctx.idempotencyKey) throw new Error("idempotency_key_required");
}

export const PERSONA_CAPABILITIES: Record<Persona, readonly string[]> = {
  OWNER_CEO: ["INITIATE_ASSIGNED", "HIGH_RISK_ESCALATION"],
  TAX_OPERATIONS_DIRECTOR: ["INITIATE", "APPROVE", "REVIEW"],
  TAX_PRACTITIONER: ["INITIATE", "REVIEW_ASSIGNED", "DRAFT_COMMUNICATION"],
  TAX_RESOLUTION_SPECIALIST: ["INITIATE", "REVIEW_ASSIGNED", "DRAFT_COMMUNICATION"],
  TAX_REVIEWER_QC: ["INITIATE_REVIEW", "APPROVE", "REVIEW"],
  IRS_AUTHORIZATION_ADMIN: ["VERIFY_AUTHORIZATION", "APPROVE_AUTHORITY"],
  TAX_INTAKE_SPECIALIST: ["INTAKE_ONLY"],
  DATA_ENTRY_SPECIALIST: ["STRUCTURED_FIELDS_ONLY"],
  COMPLIANCE_OFFICER: ["POLICY_EXCEPTION_APPROVAL", "METADATA_REVIEW"],
  INFORMATION_SECURITY_OFFICER: ["SECURITY_APPROVAL", "KILL_SWITCH"],
  IRS_API_WORKER: ["EXECUTE_APPROVED_JOB"],
  TRANSCRIPT_PARSER_WORKER: ["PARSE_AUTHORIZED_EVIDENCE"],
  RECONCILIATION_WORKER: ["RECONCILE_VERIFIED_EVIDENCE"],
  AI_CASE_ASSISTANT: ["MINIMIZED_REDACTED_ANALYSIS"],
  COMMUNICATION_WORKER: ["DISPATCH_APPROVED_CLIENT_MESSAGE"],
  RELEASE_MANAGER: ["KILL_SWITCH", "RELEASE_GATE"]
};
