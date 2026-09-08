type ApprovedIrsJob = {
  requestId: string;
  caseId: string;
  product: "TDS" | "TIN_MATCHING" | "SOR";
  approvalStatus: "APPROVED";
  authorizationScopeVerified: true;
  employeeEligibilityVerified: true;
  purposeOfUse: string;
  auditEventId: string;
  idempotencyKey: string;
};

export async function executeApprovedIrsJob(job: ApprovedIrsJob) {
  if (process.env.IRS_KILL_SWITCH !== "false") {
    return { status: "BLOCKED", reason: "irs_worker_kill_switch_enabled" } as const;
  }
  if (process.env.IRS_LIVE_ENABLED !== "true") {
    return { status: "BLOCKED", reason: "live_irs_connectivity_disabled" } as const;
  }
  if (!process.env.IRS_CLIENT_ID_REF || !process.env.IRS_CREDENTIAL_REF) {
    return { status: "BLOCKED", reason: "managed_irs_credentials_unavailable" } as const;
  }

  // No IRS endpoint is embedded in source. A formally approved product adapter
  // must be injected from environment-controlled configuration after release review.
  const adapter = process.env.IRS_PRODUCT_ADAPTER_URL;
  if (!adapter) return { status: "BLOCKED", reason: "approved_product_adapter_missing" } as const;

  return { status: "READY_FOR_MANAGED_ADAPTER", requestId: job.requestId, product: job.product, adapter } as const;
}
