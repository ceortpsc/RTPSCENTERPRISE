BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN CREATE TYPE data_classification AS ENUM ('PUBLIC','INTERNAL','CONFIDENTIAL','RESTRICTED_HR','RESTRICTED_PAYROLL','RESTRICTED_TAX_CREDENTIAL','RESTRICTED_IDENTITY_INFORMATION','RESTRICTED_CLIENT_TAXPAYER_INFORMATION'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE workflow_status AS ENUM ('RECEIVED','CLASSIFIED','ROUTED','DRAFTED','PENDING_CLIENT_INFORMATION','PENDING_SUPERVISOR_APPROVAL','DIRECTOR_AUTHORIZED','EXECUTIVE_EXCEPTION','PENDING_PAYMENT','IN_PROGRESS','SUBMITTED','DELIVERED','VERIFIED','RESOLVED','BLOCKED','ESCALATED','CLOSED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS app_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_subject text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  display_name text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS role (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text UNIQUE NOT NULL, name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS user_role (user_id uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE, role_id uuid NOT NULL REFERENCES role(id) ON DELETE CASCADE, granted_at timestamptz NOT NULL DEFAULT now(), granted_by uuid REFERENCES app_user(id), PRIMARY KEY(user_id,role_id));

CREATE TABLE IF NOT EXISTS support_intake (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id uuid NOT NULL DEFAULT gen_random_uuid(),
  received_at timestamptz NOT NULL DEFAULT now(),
  channel text NOT NULL CHECK(channel IN ('email','chat','phone','web','portal','social','internal')),
  authenticated_user_id uuid REFERENCES app_user(id),
  requester_name text,
  requester_contact_enc bytea,
  entity_id text NOT NULL,
  division_key text NOT NULL,
  department text NOT NULL,
  subject text NOT NULL,
  request_summary text NOT NULL,
  requested_outcome text NOT NULL,
  service_code text,
  notice_or_letter_number text,
  tax_years integer[] NOT NULL DEFAULT '{}',
  deadline_on_document date,
  identity_verified boolean NOT NULL DEFAULT false,
  authorization_verified boolean NOT NULL DEFAULT false,
  classification data_classification NOT NULL DEFAULT 'INTERNAL',
  risk text NOT NULL CHECK(risk IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  authority_state text NOT NULL,
  assigned_role text NOT NULL,
  status workflow_status NOT NULL DEFAULT 'RECEIVED'
);

CREATE TABLE IF NOT EXISTS approval (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_type text NOT NULL,
  object_id uuid NOT NULL,
  approval_label text NOT NULL,
  requested_by uuid REFERENCES app_user(id),
  approved_by uuid REFERENCES app_user(id),
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decision text CHECK(decision IN ('APPROVED','REJECTED','CANCELLED')),
  reason text
);

CREATE TABLE IF NOT EXISTS document_record (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text NOT NULL,
  owner_id uuid,
  title text NOT NULL,
  classification data_classification NOT NULL,
  storage_key text NOT NULL UNIQUE,
  sha256 text NOT NULL,
  version integer NOT NULL DEFAULT 1 CHECK(version > 0),
  watermark_policy text,
  expires_at timestamptz,
  created_by uuid REFERENCES app_user(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid REFERENCES app_user(id),
  actor_role text,
  entity_id text NOT NULL,
  division_key text,
  action text NOT NULL CHECK(action IN ('READ','CREATE','UPDATE','SEND','APPROVE','SUBMIT','EXPORT','DELETE','REVERSE')),
  object_type text NOT NULL,
  object_id text NOT NULL,
  arguments_hash text,
  before_hash text,
  after_hash text,
  tool_or_connector text,
  approval_id uuid REFERENCES approval(id),
  result text NOT NULL CHECK(result IN ('SUCCESS','PARTIAL','FAILED','DENIED')),
  reason_code text
);

CREATE OR REPLACE FUNCTION prevent_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'audit_event is append-only'; END; $$;
DROP TRIGGER IF EXISTS audit_event_no_update ON audit_event;
CREATE TRIGGER audit_event_no_update BEFORE UPDATE OR DELETE ON audit_event FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

CREATE INDEX IF NOT EXISTS idx_support_status ON support_intake(status, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_division ON support_intake(entity_id, division_key, department);
CREATE INDEX IF NOT EXISTS idx_audit_object ON audit_event(object_type, object_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_owner ON document_record(owner_type, owner_id, created_at DESC);
COMMIT;
