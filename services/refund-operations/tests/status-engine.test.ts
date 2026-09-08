import { strict as assert } from 'node:assert';
import { normalizeRefundStatus } from '../status-engine';

assert.equal(normalizeRefundStatus({}), 'INTAKE');
assert.equal(normalizeRefundStatus({ efileAcknowledged: true }), 'ACKNOWLEDGED');
assert.equal(normalizeRefundStatus({ clientReportedWmrStatus: 'RETURN_RECEIVED' }), 'PROCESSING');
assert.equal(normalizeRefundStatus({ authorizedIrsEvidenceStatus: 'REFUND_APPROVED' }), 'REFUND_APPROVED');
assert.equal(normalizeRefundStatus({ authorizedIrsEvidenceStatus: 'REFUND_SENT' }), 'REFUND_SENT');
assert.equal(normalizeRefundStatus({ reviewFlag: true }), 'REVIEW');
assert.equal(normalizeRefundStatus({ actionRequired: true }), 'ACTION_REQUIRED');
assert.equal(normalizeRefundStatus({ bankProductFunded: true }), 'FUNDED');
