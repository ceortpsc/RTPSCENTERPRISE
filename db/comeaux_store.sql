-- Comeaux Clinical Supply & Print Co. -- PostgreSQL commerce registry
-- Designed for UUID-capable Postgres. Apply in a controlled migration tool before production.

create extension if not exists pgcrypto;

create schema if not exists comeaux;

create table if not exists comeaux.users (
  id uuid primary key default gen_random_uuid(),
  google_sub text unique,
  email text not null unique,
  display_name text,
  status text not null default 'active' check (status in ('active','disabled','review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists comeaux.roles (
  code text primary key,
  description text not null
);

insert into comeaux.roles(code,description) values
 ('customer','Retail customer'),
 ('fulfillment','Pick, pack, print and shipment operations'),
 ('catalog_manager','Catalog, pricing and inventory management'),
 ('fraud_reviewer','Transaction and account risk review'),
 ('admin','Store administration')
on conflict (code) do nothing;

create table if not exists comeaux.user_roles (
  user_id uuid references comeaux.users(id) on delete cascade,
  role_code text references comeaux.roles(code) on delete restrict,
  granted_at timestamptz not null default now(),
  granted_by uuid references comeaux.users(id),
  primary key (user_id, role_code)
);

create table if not exists comeaux.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null,
  quality_description text not null,
  regulated boolean not null default false,
  active boolean not null default true,
  google_sync_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists comeaux.skus (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references comeaux.products(id) on delete cascade,
  sku text not null unique,
  barcode text unique,
  size text,
  color text,
  price_cents integer not null check (price_cents >= 0),
  cost_cents integer check (cost_cents >= 0),
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  reorder_point integer not null default 0 check (reorder_point >= 0),
  fulfillment_class text not null check (fulfillment_class in ('stock','made-to-order','print-job')),
  lot_tracking boolean not null default false,
  expiration_tracking boolean not null default false,
  active boolean not null default true
);

create table if not exists comeaux.inventory_lots (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null references comeaux.skus(id) on delete cascade,
  manufacturer_lot text not null,
  expiration_date date,
  quantity integer not null check (quantity >= 0),
  received_at timestamptz not null default now(),
  recalled_at timestamptz,
  unique (sku_id, manufacturer_lot)
);

create table if not exists comeaux.customization_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  method text not null check (method in ('embroidery','dtf','sublimation','engraving','print')),
  schema_json jsonb not null,
  active boolean not null default true
);

create table if not exists comeaux.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references comeaux.users(id),
  status text not null check (status in ('draft','pending_payment','paid','risk_review','production','fulfilled','cancelled','refunded')),
  currency char(3) not null default 'USD',
  subtotal_cents integer not null default 0,
  tax_cents integer not null default 0,
  shipping_cents integer not null default 0,
  total_cents integer not null default 0,
  promised_ship_by timestamptz,
  delay_consent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists comeaux.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references comeaux.orders(id) on delete cascade,
  sku_id uuid not null references comeaux.skus(id),
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  customization_json jsonb,
  proof_hash text,
  proof_approved_at timestamptz
);

create table if not exists comeaux.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references comeaux.orders(id) on delete cascade,
  provider text not null,
  provider_payment_id text unique,
  amount_cents integer not null,
  status text not null,
  risk_status text,
  created_at timestamptz not null default now()
);

create table if not exists comeaux.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references comeaux.orders(id) on delete cascade,
  invoice_number text not null unique,
  issued_at timestamptz not null default now(),
  total_cents integer not null,
  snapshot_json jsonb not null
);

create table if not exists comeaux.receipts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references comeaux.orders(id) on delete cascade,
  receipt_number text not null unique,
  issued_at timestamptz not null default now(),
  payment_id uuid references comeaux.payments(id),
  snapshot_json jsonb not null
);

create table if not exists comeaux.fraud_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references comeaux.users(id),
  order_id uuid references comeaux.orders(id),
  provider text not null,
  provider_assessment_id text,
  action text not null,
  score numeric(4,3),
  decision text not null check (decision in ('allow','review','block')),
  reasons jsonb,
  created_at timestamptz not null default now()
);

create table if not exists comeaux.policy_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references comeaux.users(id),
  order_id uuid references comeaux.orders(id),
  policy_slug text not null,
  policy_version text not null,
  accepted_at timestamptz not null default now(),
  ip_hash text,
  user_agent_hash text
);

create table if not exists comeaux.google_merchant_sync (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid references comeaux.skus(id),
  resource_name text,
  status_code integer,
  success boolean not null,
  response_json jsonb,
  synced_at timestamptz not null default now()
);

create table if not exists comeaux.audit_log (
  id bigserial primary key,
  actor_user_id uuid references comeaux.users(id),
  event_type text not null,
  entity_type text not null,
  entity_id text not null,
  before_json jsonb,
  after_json jsonb,
  request_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_skus_product on comeaux.skus(product_id);
create index if not exists idx_orders_user_created on comeaux.orders(user_id, created_at desc);
create index if not exists idx_fraud_order on comeaux.fraud_assessments(order_id, created_at desc);
create index if not exists idx_audit_entity on comeaux.audit_log(entity_type, entity_id, created_at desc);

create or replace view comeaux.inventory_registry as
select p.name, p.category, p.regulated, s.sku, s.size, s.color, s.price_cents,
       s.quantity_on_hand, s.reorder_point, s.fulfillment_class,
       (s.quantity_on_hand <= s.reorder_point) as reorder_needed
from comeaux.products p
join comeaux.skus s on s.product_id = p.id
where p.active and s.active;

create or replace view comeaux.order_financial_registry as
select o.order_number, o.status, o.currency, o.subtotal_cents, o.tax_cents,
       o.shipping_cents, o.total_cents, o.created_at,
       coalesce(sum(case when p.status in ('succeeded','paid') then p.amount_cents else 0 end),0) as paid_cents
from comeaux.orders o
left join comeaux.payments p on p.order_id = o.id
group by o.id;
