-- Comeaux Clinical Supply -- preverified Texas professional registry seed
-- Apply after db/comeaux_store.sql and db/comeaux_professional_savings.sql.
-- Privacy: the full license number is intentionally NOT stored in this migration.
-- The credential is represented by SHA-256 + last four digits only.

create table if not exists comeaux.professional_registry (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  credential_kind text not null check (credential_kind in ('RN','LVN','APRN','CNA','MA')),
  credential_number_hash text not null,
  credential_last4 text not null,
  jurisdiction char(2) not null default 'TX' check (jurisdiction = 'TX'),
  regulator text not null,
  license_status text not null,
  compact_status text,
  original_issue_date date,
  current_issue_date date,
  expiration_date date,
  verification_source text not null,
  verification_reference text,
  verification_status text not null default 'verified' check (verification_status in ('pending','verified','expired','rejected')),
  evidence_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (credential_kind, credential_number_hash)
);

create table if not exists comeaux.account_creation_registry (
  id uuid primary key default gen_random_uuid(),
  professional_registry_id uuid not null unique references comeaux.professional_registry(id) on delete cascade,
  intended_account_type text not null default 'customer' check (intended_account_type in ('customer','employee')),
  intended_program_code text references comeaux.discount_programs(code),
  account_status text not null default 'preverified' check (account_status in ('preverified','linked','revoked')),
  linked_user_id uuid references comeaux.users(id) on delete set null,
  linked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

with upserted as (
  insert into comeaux.professional_registry (
    legal_name,
    credential_kind,
    credential_number_hash,
    credential_last4,
    jurisdiction,
    regulator,
    license_status,
    compact_status,
    original_issue_date,
    current_issue_date,
    expiration_date,
    verification_source,
    verification_reference,
    verification_status,
    evidence_json
  ) values (
    'COMEAUX, ALZORA MARTIN',
    'LVN',
    '3162b2b228827aa3f9935ec6d54096587aa25d30393ed301241b57778e6ce6ba',
    '6617',
    'TX',
    'Texas Board of Nursing',
    'Current',
    'Multistate',
    date '2015-06-30',
    date '2026-01-11',
    date '2028-02-29',
    'Texas BON Primary Source License Verification',
    'https://txbn.boardsofnursing.org/licenselookup',
    'verified',
    jsonb_build_object(
      'license_type_display', 'LVN/LPN',
      'primary_source_report', true,
      'evidence_origin', 'customer-supplied Texas BON primary-source report',
      'public_display', 'LVN • Current • Multistate • License ending 6617'
    )
  )
  on conflict (credential_kind, credential_number_hash) do update set
    legal_name = excluded.legal_name,
    license_status = excluded.license_status,
    compact_status = excluded.compact_status,
    original_issue_date = excluded.original_issue_date,
    current_issue_date = excluded.current_issue_date,
    expiration_date = excluded.expiration_date,
    verification_source = excluded.verification_source,
    verification_reference = excluded.verification_reference,
    verification_status = excluded.verification_status,
    evidence_json = excluded.evidence_json,
    updated_at = now()
  returning id
)
insert into comeaux.account_creation_registry (
  professional_registry_id,
  intended_account_type,
  intended_program_code,
  account_status
)
select id, 'customer', 'TX-CARE-VERIFIED', 'preverified'
from upserted
on conflict (professional_registry_id) do update set
  intended_program_code = excluded.intended_program_code,
  account_status = case
    when comeaux.account_creation_registry.linked_user_id is null then 'preverified'
    else comeaux.account_creation_registry.account_status
  end,
  updated_at = now();

create or replace function comeaux.link_preverified_professional_account(
  p_professional_registry_id uuid,
  p_user_id uuid,
  p_verified_by uuid default null
) returns uuid
language plpgsql
security definer
set search_path = comeaux, public
as $$
declare
  v_registry comeaux.professional_registry%rowtype;
  v_verification_id uuid;
  v_program_id uuid;
begin
  select * into v_registry
  from comeaux.professional_registry
  where id = p_professional_registry_id
    and verification_status = 'verified';

  if not found then
    raise exception 'Verified professional registry record not found';
  end if;

  select id into v_program_id
  from comeaux.discount_programs
  where code = 'TX-CARE-VERIFIED' and active = true;

  if v_program_id is null then
    raise exception 'TX-CARE-VERIFIED discount program is not active';
  end if;

  insert into comeaux.credential_verifications (
    user_id,
    credential_kind,
    credential_number_hash,
    credential_last4,
    credential_name,
    jurisdiction,
    regulator,
    verification_source,
    verification_reference,
    status,
    verified_at,
    verified_by,
    expires_at,
    evidence_json
  ) values (
    p_user_id,
    v_registry.credential_kind,
    v_registry.credential_number_hash,
    v_registry.credential_last4,
    v_registry.legal_name,
    v_registry.jurisdiction,
    v_registry.regulator,
    v_registry.verification_source,
    v_registry.verification_reference,
    'verified',
    now(),
    p_verified_by,
    (v_registry.expiration_date + time '23:59:59')::timestamptz,
    v_registry.evidence_json
  )
  on conflict (user_id, credential_kind, credential_number_hash) do update set
    credential_name = excluded.credential_name,
    regulator = excluded.regulator,
    verification_source = excluded.verification_source,
    verification_reference = excluded.verification_reference,
    status = 'verified',
    verified_at = excluded.verified_at,
    verified_by = excluded.verified_by,
    expires_at = excluded.expires_at,
    evidence_json = excluded.evidence_json,
    updated_at = now()
  returning id into v_verification_id;

  insert into comeaux.customer_discount_entitlements (
    user_id, program_id, verification_id, status, effective_at, expires_at
  ) values (
    p_user_id, v_program_id, v_verification_id, 'active', now(),
    (v_registry.expiration_date + time '23:59:59')::timestamptz
  )
  on conflict (user_id, program_id) do update set
    verification_id = excluded.verification_id,
    status = 'active',
    effective_at = now(),
    expires_at = excluded.expires_at,
    revoked_at = null,
    revoke_reason = null;

  update comeaux.account_creation_registry
  set linked_user_id = p_user_id,
      linked_at = now(),
      account_status = 'linked',
      updated_at = now()
  where professional_registry_id = p_professional_registry_id;

  return v_verification_id;
end;
$$;

create or replace view comeaux.professional_account_registry as
select
  pr.id as professional_registry_id,
  pr.legal_name,
  pr.credential_kind,
  pr.credential_last4,
  pr.jurisdiction,
  pr.regulator,
  pr.license_status,
  pr.compact_status,
  pr.expiration_date,
  pr.verification_status,
  acr.account_status,
  acr.intended_program_code,
  acr.linked_user_id,
  acr.linked_at
from comeaux.professional_registry pr
join comeaux.account_creation_registry acr
  on acr.professional_registry_id = pr.id;
