# IRS Evidence Test Plan

Required suites before production enablement:

1. Tenant/entity isolation and object-level authorization.
2. Employee status, persona, case assignment and step-up authentication.
3. Expired/revoked/superseded Form 2848/8821 authority.
4. Purpose-of-use and data-minimization enforcement.
5. Managed client credential isolation and no raw-secret logging.
6. Idempotency, rate limiting, retry and dead-letter behavior.
7. Evidence payload hashing, encryption references and immutability.
8. Parser accuracy against synthetic transcript fixtures.
9. Reconciliation variance detection and human resolution requirement.
10. AI policy blocks for external send, IRS access and case closure.
11. Worker kill switch and unsupported-product fail-closed behavior.
12. Audit event ordering before execution.
13. Secure client communication exact-body approval.
14. Incident response, restore and disaster-recovery exercises.
15. Negative test proving no public route reaches taxpayer evidence.
