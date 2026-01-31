-- Complete setup for new Supabase project
-- Run this in order in Supabase SQL Editor

-- 1. Create roles table
create table public.roles (
  id serial primary key,
  role_name text not null unique
);

-- 2. Create users table with username and email support
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  username text unique,
  email text unique,
  role_id integer references public.roles (id),
  created_at timestamptz default now()
);

-- 3. Insert default roles
insert into public.roles (role_name)
values ('Admin'), ('Manager'), ('User')
on conflict (role_name) do nothing;

-- 4. Enable RLS on users table
alter table public.users enable row level security;

-- 5. Create RLS policies for users table
create policy "Users can view their own profile"
on public.users
for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.users
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert their own profile"
on public.users
for insert
with check (auth.uid() = id);

create policy "Allow username lookup for login"
on public.users
for select
using (auth.role() = 'authenticated');

-- 6. Create indexes
create unique index users_username_idx on public.users (username);
create unique index users_email_idx on public.users (email);

-- 7. Create core domain tables
create table public.production_records (
  id bigserial primary key,
  record_date date not null,
  category text not null,
  quantity numeric(12,2) not null,
  notes text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz default now(),
  is_deleted boolean default false,
  deleted_at timestamptz,
  deleted_by uuid references auth.users (id)
);

alter table public.production_records enable row level security;

create policy "Data entry manage own production"
on public.production_records
for all
using (auth.uid() = created_by and is_deleted = false)
with check (auth.uid() = created_by);

create policy "Management manage all production"
on public.production_records
for all
using (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
)
with check (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
);

-- 8. Create sales table
create table public.sales (
  id bigserial primary key,
  receipt_no text not null unique,
  sale_date date not null,
  product_type text not null,
  quantity numeric(12,2) not null,
  unit_price numeric(12,2) not null,
  total_amount numeric(12,2) not null,
  payment_method text not null,
  amount_paid numeric(12,2) not null default 0,
  outstanding_balance numeric(12,2) not null default 0,
  customer_name text,
  notes text,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz default now(),
  is_deleted boolean default false,
  deleted_at timestamptz,
  deleted_by uuid references auth.users (id)
);

alter table public.sales enable row level security;

create policy "Data entry manage own sales"
on public.sales
for all
using (auth.uid() = created_by and is_deleted = false)
with check (auth.uid() = created_by);

create policy "Management manage all sales"
on public.sales
for all
using (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
)
with check (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
);

-- 9. Create expenses table
create table public.expenses (
  id bigserial primary key,
  expense_date date not null,
  expense_type text not null,
  description text,
  amount numeric(12,2) not null,
  payment_method text not null,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz default now(),
  is_deleted boolean default false,
  deleted_at timestamptz,
  deleted_by uuid references auth.users (id)
);

alter table public.expenses enable row level security;

create policy "Data entry manage own expenses"
on public.expenses
for all
using (auth.uid() = created_by and is_deleted = false)
with check (auth.uid() = created_by);

create policy "Management manage all expenses"
on public.expenses
for all
using (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
)
with check (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
);

-- 10. Create materials usage table
create table public.materials_usage (
  id bigserial primary key,
  usage_date date not null,
  material_type text not null,
  quantity_used numeric(12,2) not null,
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz default now(),
  is_deleted boolean default false,
  deleted_at timestamptz,
  deleted_by uuid references auth.users (id)
);

alter table public.materials_usage enable row level security;

create policy "Data entry manage own materials usage"
on public.materials_usage
for all
using (auth.uid() = created_by and is_deleted = false)
with check (auth.uid() = created_by);

create policy "Management manage all materials usage"
on public.materials_usage
for all
using (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
)
with check (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
);

-- 11. Create materials inventory bought table
create table public.materials_inventory_bought (
  id bigserial primary key,
  vendor_name text,
  purchase_date date not null,
  b_preform numeric(12,2) default 0,
  s_preform numeric(12,2) default 0,
  big_caps numeric(12,2) default 0,
  small_caps numeric(12,2) default 0,
  plastic numeric(12,2) default 0,
  total_cost numeric(14,2),
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz default now(),
  is_deleted boolean default false,
  deleted_at timestamptz,
  deleted_by uuid references auth.users (id)
);

alter table public.materials_inventory_bought enable row level security;

create policy "Data entry manage own inventory bought"
on public.materials_inventory_bought
for all
using (auth.uid() = created_by and is_deleted = false)
with check (auth.uid() = created_by);

create policy "Management manage all inventory bought"
on public.materials_inventory_bought
for all
using (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
)
with check (
  exists (
    select 1
    from public.users u
    join public.roles r on r.id = u.role_id
    where u.id = auth.uid()
      and r.role_name in ('Admin', 'Manager')
  )
);

-- 12. Disable email confirmation in Supabase Auth settings
-- Go to Authentication → Settings → Enable email confirmations = OFF
