import { strict as assert } from "node:assert";
import { test } from "node:test";
import { assertInternalIrsPolicy } from "../../services/irs-evidence/policy";

test("blocks high-risk device sessions", () => {
  assert.throws(() => assertInternalIrsPolicy({
    workforceIdentity: "employee-synthetic",
    persona: "TAX_PRACTITIONER",
    tenantId: "tenant-synthetic",
    legalEntityId: "entity-synthetic",
    clientCaseId: "case-synthetic",
    dataClassification: "RESTRICTED_CLIENT_TAXPAYER",
    purposeOfUse: "REFUND_STATUS_RECONCILIATION",
    sessionAssurance: "MFA_VERIFIED",
    correlationId: "corr-synthetic",
    idempotencyKey: "idem-synthetic",
    deviceRiskLevel: "HIGH"
  }, "CREATE"), /high_risk_session_blocked/);
});
