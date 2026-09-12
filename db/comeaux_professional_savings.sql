-- Comeaux Clinical Supply -- Texas healthcare professional verification and savings
-- Apply only to the dedicated Comeaux storefront database after db/comeaux_store.sql.

create table if not exists comeaux.credential_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references comeaux.users(id) on delete cascade,
  credential_kind text not null check (credential_kind in ('RN','LVN','APRN','CNA','MA')),
  credential_number_hash text not null,
  credential_last4 text not null,
  credential_name text not null,
  jurisdiction char(2) not null default 'TX' check (jurisdiction = 'TX'),
  regulator text not null,
  verification_source text not null,
  verification_reference text,
  status text not null default 'pending' check (status in ('pending','verified','expired','rejected')),
  verified_at timestamptz,
  verified_by uuid references comeaux.users(id),
  expires_at timestamptz,
  rejection_reason text,
  evidence_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, credential_kind, credential_number_hash)
);

create table if not exists comeaux.discount_programs (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null,
  discount_bps integer not null check (discount_bps between 0 and 10000),
  stackable boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  rules_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into comeaux.discount_programs(code,name,description,discount_bps,stackable,rules_json)
values (
  'TX-CARE-VERIFIED',
  'Nurses of Texas & Care Team Savings',
  'Independent retail savings program for verified Texas RN, LVN, APRN, CNA and Medication Aide customers.',
  1000,
  false,
  '{"jurisdiction":"TX","credentials":["RN","LVN","APRN","CNA","MA"],"revalidate_days":365,"excluded_categories":["print-services"]}'::jsonb
)
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  discount_bps = excluded.discount_bps,
  stackable = excluded.stackable,
  rules_json = excluded.rules_json,
  updated_at = now();

create table if not exists comeaux.customer_discount_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references comeaux.users(id) on delete cascade,
  program_id uuid not null references comeaux.discount_programs(id) on delete cascade,
  verification_id uuid references comeaux.credential_verifications(id) on delete set null,
  status text not null default 'active' check (status in ('active','paused','expired','revoked')),
  effective_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  revoke_reason text,
  created_at timestamptz not null default now(),
  unique(user_id, program_id)
);

create table if not exists comeaux.promotion_campaigns (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value integer not null check (discount_value >= 0),
  audience text not null default 'all' check (audience in ('all','verified-care-team','nurse','care-team')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  stackable boolean not null default false,
  max_redemptions integer,
  max_redemptions_per_user integer default 1,
  active boolean not null default true,
  rules_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists comeaux.discount_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references comeaux.users(id),
  order_id uuid not null references comeaux.orders(id) on delete cascade,
  program_id uuid references comeaux.discount_programs(id),
  campaign_id uuid references comeaux.promotion_campaigns(id),
  amount_cents integer not null check (amount_cents >= 0),
  applied_basis_points integer,
  created_at timestamptz not null default now(),
  check (program_id is not null or campaign_id is not null)
);

create index if not exists idx_credential_verifications_user_status
  on comeaux.credential_verifications(user_id, status, expires_at);
create index if not exists idx_discount_entitlements_user_status
  on comeaux.customer_discount_entitlements(user_id, status, expires_at);
create index if not exists idx_promo_active_window
  on comeaux.promotion_campaigns(active, starts_at, ends_at);
create index if not exists idx_discount_redemptions_user
  on comeaux.discount_redemptions(user_id, created_at desc);

create or replace view comeaux.verified_healthcare_discount_accounts as
select
  u.id as user_id,
  u.email,
  cv.credential_kind,
  cv.credential_last4,
  cv.regulator,
  cv.verification_source,
  cv.verified_at,
  cv.expires_at as verification_expires_at,
  dp.code as program_code,
  dp.discount_bps,
  e.status as entitlement_status,
  e.expires_at as entitlement_expires_at
from comeaux.users u
join comeaux.customer_discount_entitlements e on e.user_id = u.id
join comeaux.discount_programs dp on dp.id = e.program_id
join comeaux.credential_verifications cv on cv.id = e.verification_id
where cv.status = 'verified'
  and e.status = 'active'
  and (cv.expires_at is null or cv.expires_at > now())
  and (e.expires_at is null or e.expires_at > now());
