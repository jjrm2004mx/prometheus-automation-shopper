-- =====================================================================
-- Plataforma multi-tenant para personal shoppers
--
-- Principio: cada fila pertenece a un tenant y el aislamiento se resuelve
-- con RLS en la base, no ocultando pantallas en el front-end.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tenants
-- ---------------------------------------------------------------------

create table tenants (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  status        text not null default 'active' check (status in ('active','paused','cancelled')),
  locale        text not null default 'es-MX',
  -- El JSON sigue el shape de src/config/schema.ts. Se valida en la app.
  brand         jsonb not null default '{}'::jsonb,
  contact       jsonb not null default '{}'::jsonb,
  commerce      jsonb not null default '{}'::jsonb,
  exchange      jsonb not null default '{}'::jsonb,
  bank          jsonb not null default '{}'::jsonb,
  categories    jsonb not null default '[]'::jsonb,
  theme         jsonb not null default '{}'::jsonb,
  features      jsonb not null default '{}'::jsonb,
  content       jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table tenant_domains (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  hostname    text not null unique,
  is_primary  boolean not null default false,
  verified_at timestamptz
);

-- Quién puede administrar qué tenant.
create table tenant_members (
  tenant_id  uuid not null references tenants(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'owner' check (role in ('owner','staff')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

-- ---------------------------------------------------------------------
-- Operación
-- ---------------------------------------------------------------------

create table customers (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  name       text not null,
  phone      text not null,
  email      text,
  created_at timestamptz not null default now(),
  unique (tenant_id, phone)
);

create table orders (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references tenants(id) on delete cascade,
  customer_id    uuid references customers(id) on delete set null,
  -- Token opaco para el portal de la clienta. Sin cuenta, sin contraseña.
  public_token   text not null unique default encode(gen_random_bytes(24), 'hex'),
  status         text not null default 'draft'
                 check (status in ('draft','submitted','deposit_pending','deposit_confirmed',
                                   'scheduled','purchasing','awaiting_payment','paid',
                                   'packing','shipped','delivered','cancelled')),
  purchase_type  text check (purchase_type in ('reventa','personal')),
  experience     text,
  seller_context jsonb not null default '{}'::jsonb,
  budget_local   numeric(12,2),
  categories     text[] not null default '{}',
  details        jsonb not null default '{}'::jsonb,
  -- Tasa congelada al momento de cotizar: los números de la clienta no cambian
  -- bajo sus pies si el mercado se mueve.
  exchange_rate  numeric(12,4),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index on orders (tenant_id, status);
create index on orders (tenant_id, created_at desc);

create table appointments (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants(id) on delete cascade,
  order_id     uuid not null references orders(id) on delete cascade,
  window_date  date not null,
  window_label text not null,
  -- El calendario solo se libera cuando el apartado está confirmado.
  unlocked_at  timestamptz,
  status       text not null default 'pending'
               check (status in ('pending','confirmed','rescheduled','no_show','done')),
  created_at   timestamptz not null default now()
);

create table payments (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  order_id   uuid not null references orders(id) on delete cascade,
  kind       text not null check (kind in ('deposit','merchandise','shipping','adjustment')),
  amount     numeric(12,2) not null,
  currency   text not null,
  declared_at  timestamptz,
  confirmed_at timestamptz,
  confirmed_by uuid references auth.users(id),
  reference  text,
  created_at timestamptz not null default now()
);

create table shipments (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  order_id      uuid not null references orders(id) on delete cascade,
  address       jsonb not null,
  delivery_kind text not null default 'domicilio' check (delivery_kind in ('domicilio','sucursal')),
  carrier       text,
  tracking      text,
  shipped_at    timestamptz,
  delivered_at  timestamptz,
  cost_actual   numeric(12,2)
);

create table lots (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  slug        text not null,
  title       text not null,
  summary     text,
  price_local numeric(12,2) not null,
  media       jsonb not null default '[]'::jsonb,
  status      text not null default 'draft' check (status in ('draft','published','reserved','sold')),
  reserved_by uuid references customers(id),
  created_at  timestamptz not null default now(),
  unique (tenant_id, slug)
);

create table exchange_rates (
  id         bigserial primary key,
  base       text not null,
  quote      text not null,
  rate       numeric(12,4) not null,
  fetched_at timestamptz not null default now()
);

create index on exchange_rates (base, quote, fetched_at desc);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table tenants         enable row level security;
alter table tenant_domains  enable row level security;
alter table tenant_members  enable row level security;
alter table customers       enable row level security;
alter table orders          enable row level security;
alter table appointments    enable row level security;
alter table payments        enable row level security;
alter table shipments       enable row level security;
alter table lots            enable row level security;
alter table exchange_rates  enable row level security;

-- ¿El usuario autenticado administra este tenant?
create or replace function is_tenant_member(t uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from tenant_members m
    where m.tenant_id = t and m.user_id = auth.uid()
  );
$$;

-- Lectura pública: solo lo que el sitio necesita para pintarse.
create policy tenants_public_read on tenants
  for select to anon, authenticated
  using (status = 'active');

create policy domains_public_read on tenant_domains
  for select to anon, authenticated using (true);

create policy lots_public_read on lots
  for select to anon, authenticated
  using (status = 'published');

create policy rates_public_read on exchange_rates
  for select to anon, authenticated using (true);

-- Escritura y lectura de operación: solo miembros del tenant.
create policy tenants_member_write on tenants
  for update to authenticated using (is_tenant_member(id)) with check (is_tenant_member(id));

create policy members_self_read on tenant_members
  for select to authenticated using (user_id = auth.uid());

do $$
declare tbl text;
begin
  foreach tbl in array array['customers','orders','appointments','payments','shipments','lots']
  loop
    execute format($f$
      create policy %1$s_member_all on %1$s
        for all to authenticated
        using (is_tenant_member(tenant_id))
        with check (is_tenant_member(tenant_id));
    $f$, tbl);
  end loop;
end $$;

-- Las clientas anónimas NO leen `orders` directamente. El acceso por token
-- pasa por una Edge Function con service role que valida el token y devuelve
-- solo ese pedido — así el token nunca se convierte en una llave de tabla.

-- ---------------------------------------------------------------------
-- Utilidades
-- ---------------------------------------------------------------------

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger tenants_touch  before update on tenants for each row execute function touch_updated_at();
create trigger orders_touch   before update on orders  for each row execute function touch_updated_at();
