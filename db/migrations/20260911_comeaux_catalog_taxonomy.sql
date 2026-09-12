-- Comeaux Clinical Supply catalog taxonomy / images / pricing migration
create table if not exists comeaux.brands (
  id uuid primary key default gen_random_uuid(), name text not null unique,
  tier text not null check (tier in ('house','premium','mid-tier','budget','specialty')),
  reference_price_range text, reseller_authorization_required boolean not null default false,
  active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists comeaux.taxonomy_terms (
  id uuid primary key default gen_random_uuid(),
  taxonomy text not null check (taxonomy in ('brand-tier','fit-type','fabric-type','product-type','category','tag')),
  code text not null, label text not null, parent_code text, sort_order integer not null default 0,
  active boolean not null default true, unique (taxonomy, code)
);
alter table comeaux.products
  add column if not exists brand_id uuid references comeaux.brands(id),
  add column if not exists product_type text,
  add column if not exists fit_type text,
  add column if not exists fabric_types jsonb not null default '[]'::jsonb,
  add column if not exists catalog_status text not null default 'active',
  add column if not exists reseller_authorization_required boolean not null default false,
  add column if not exists price_kind text not null default 'retail',
  add column if not exists price_checked_at date,
  add column if not exists image_source text,
  add column if not exists source_url text;
alter table comeaux.products drop constraint if exists products_catalog_status_check;
alter table comeaux.products add constraint products_catalog_status_check check (catalog_status in ('active','authorization-hold'));
alter table comeaux.products drop constraint if exists products_price_kind_check;
alter table comeaux.products add constraint products_price_kind_check check (price_kind in ('retail','market-reference','starting-at'));
create table if not exists comeaux.product_images (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references comeaux.products(id) on delete cascade,
  url text not null, alt_text text not null, source_type text not null check (source_type in ('house-artwork','supplier','supplied-reference')),
  is_primary boolean not null default false, merchant_eligible boolean not null default false, rights_verified boolean not null default false,
  source_url text, created_at timestamptz not null default now()
);
create unique index if not exists uq_product_primary_image on comeaux.product_images(product_id) where is_primary;
create table if not exists comeaux.product_taxonomy (
  product_id uuid not null references comeaux.products(id) on delete cascade,
  taxonomy_term_id uuid not null references comeaux.taxonomy_terms(id) on delete cascade,
  primary key (product_id, taxonomy_term_id)
);
create table if not exists comeaux.price_history (
  id bigserial primary key, sku_id uuid references comeaux.skus(id) on delete cascade,
  amount_cents integer not null check (amount_cents >= 0), currency char(3) not null default 'USD',
  price_kind text not null check (price_kind in ('retail','market-reference','starting-at','cost','sale')),
  source text not null, source_url text, effective_at timestamptz not null default now(), expires_at timestamptz,
  created_by uuid references comeaux.users(id)
);
create index if not exists idx_price_history_sku_effective on comeaux.price_history(sku_id, effective_at desc);
create index if not exists idx_products_catalog_status on comeaux.products(catalog_status, category);
insert into comeaux.taxonomy_terms(taxonomy,code,label,sort_order) values
 ('brand-tier','house','House',10),('brand-tier','premium','Premium',20),('brand-tier','mid-tier','Mid-Tier',30),('brand-tier','budget','Budget',40),('brand-tier','specialty','Specialty',50),
 ('fit-type','modern','Modern Fit',10),('fit-type','classic','Classic Fit',20),('fit-type','athletic','Athletic Fit',30),('fit-type','plus','Plus Size',40),('fit-type','unisex','Unisex',50),('fit-type','layering','Layering',60),
 ('fabric-type','4way-stretch','4-way stretch',10),('fabric-type','moisture-wicking','Moisture-wicking',20),('fabric-type','antimicrobial','Antimicrobial',30),('fabric-type','cotton-blend','Cotton blend',40),('fabric-type','recycled','Recycled fabric',50),
 ('product-type','tops','Tops',10),('product-type','pants','Pants',20),('product-type','joggers','Joggers',30),('product-type','jackets','Jackets',40),('product-type','sets','Sets',50),('product-type','lab-coats','Lab Coats',60),('product-type','underscrubs','Underscrubs',70),('product-type','name-badges','Name Badges',80),('product-type','wound-care','Wound Care',90),('product-type','print-services','Print Services',100)
on conflict (taxonomy,code) do update set label=excluded.label, sort_order=excluded.sort_order;
insert into comeaux.brands(name,tier,reference_price_range,reseller_authorization_required) values
 ('Comeaux Clinical','house','Store pricing',false),('FIGS','premium','$60–$120 reference range',true),('Jaanuu','premium','$40–$90 reference range',true),('Fabletics Scrubs','premium','Product-specific reference pricing',true),('Barco / Grey''s Anatomy','mid-tier','$25–$45 reference range',true),('Healing Hands','mid-tier','$25–$40 reference range',true),('Koi','mid-tier','$30–$50 reference range',true),('Med Couture','mid-tier','$20–$40 reference range',true),('Barco One','specialty','Product-specific reference pricing',true),('Cherokee','budget','$18–$35 reference range',true),('Dickies Medical','budget','Supplier quote required',true),('WonderWink','budget','Supplier quote required',true),('Landau','budget','Supplier quote required',true),('WonderWink Plus','specialty','Supplier quote required',true),('Koi Next Gen','specialty','Supplier quote required',true)
on conflict (name) do update set tier=excluded.tier, reference_price_range=excluded.reference_price_range, reseller_authorization_required=excluded.reseller_authorization_required, updated_at=now();
create or replace view comeaux.catalog_registry as
select p.id product_id,p.name,p.slug,p.category,b.name brand,b.tier brand_tier,p.product_type,p.fit_type,p.fabric_types,p.catalog_status,p.reseller_authorization_required,p.google_sync_enabled,s.sku,s.price_cents,p.price_kind,p.price_checked_at,s.quantity_on_hand,s.fulfillment_class,img.url primary_image_url,img.rights_verified image_rights_verified
from comeaux.products p left join comeaux.brands b on b.id=p.brand_id left join comeaux.skus s on s.product_id=p.id and s.active left join comeaux.product_images img on img.product_id=p.id and img.is_primary where p.active;
create or replace view comeaux.merchant_eligible_catalog as select * from comeaux.catalog_registry where catalog_status='active' and google_sync_enabled and coalesce(reseller_authorization_required,false)=false and quantity_on_hand>0;
