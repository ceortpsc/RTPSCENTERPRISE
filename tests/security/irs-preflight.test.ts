import { strict as assert } from "node:assert";
import { test } from "node:test";
import { runPreflight } from "../../services/irs-evidence/preflight";

test("requires audit event and verified authority", () => {
  const result = runPreflight({ activeWorkforce: true, approvedPersona: true, trainingCurrent: true, credentialActive: true, assignedToCase: true, engagementAccepted: true, identityVerified: true, authorizationPresent: true, authorizationScopeVerified: false, authorizationCurrent: true, productAllowed: true, purposeOfUseValid: true, policyHold: false, requiredApprovalSatisfied: true, managedCredentialContextReady: true, withinRateLimits: true, auditEventCreated: false });
  assert.equal(result.approved, false);
  assert.ok(result.failed.includes("authorizationScopeVerified"));
  assert.ok(result.failed.includes("auditEventCreated"));
});
