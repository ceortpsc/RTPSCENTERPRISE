# IRS Evidence Module Release Gates

No live data request route may be enabled until every condition below is recorded as complete:

- Applicable IRS API product formally approved for the organization and exact use case.
- Current registered Client ID and approved credential method configured in managed secrets.
- Current official technical documentation, sandbox/test process, and production enrollment reviewed.
- Form 2848/8821 scope verification tested.
- Employee persona, credential, training, assignment and case-access checks live.
- Worker permissions allow only approved products/routes.
- Sensitive results encrypted, hashed, classified and retained under policy.
- Audit record created before external request and linked to human approval.
- No public route can reach taxpayer data.
- Tenant/object/property authorization tests pass.
- Rate limit, idempotency, retry, dead-letter and kill-switch tests pass.
- Compliance, Security, Tax Operations and Executive approvals recorded.
- UI and documentation do not claim access broader than formally approved.
