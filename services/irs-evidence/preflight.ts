export type PreflightInput = {
  activeWorkforce: boolean;
  approvedPersona: boolean;
  trainingCurrent: boolean;
  credentialActive: boolean;
  assignedToCase: boolean;
  engagementAccepted: boolean;
  identityVerified: boolean;
  authorizationPresent: boolean;
  authorizationScopeVerified: boolean;
  authorizationCurrent: boolean;
  productAllowed: boolean;
  purposeOfUseValid: boolean;
  policyHold: boolean;
  requiredApprovalSatisfied: boolean;
  managedCredentialContextReady: boolean;
  withinRateLimits: boolean;
  auditEventCreated: boolean;
};

export function runPreflight(input: PreflightInput) {
  const failed = Object.entries(input)
    .filter(([key, value]) => key === "policyHold" ? value === true : value !== true)
    .map(([key]) => key);
  return { approved: failed.length === 0, failed };
}
