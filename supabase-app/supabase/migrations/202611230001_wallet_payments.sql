-- Wallet funding tables. Run this in the Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance_kobo bigint not null default 0 check (balance_kobo >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null unique,
  amount_kobo bigint not null check (amount_kobo > 0),
  currency text not null default 'NGN' check (currency = 'NGN'),
  status text not null default 'pending' check (status in ('pending','successful','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid not null unique references public.orders(id),
  provider text not null default 'paystack',
  provider_reference text not null unique,
  amount_kobo bigint not null check (amount_kobo > 0),
  currency text not null default 'NGN',
  status text not null check (status in ('successful','failed')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.orders enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Users can read own wallet" on public.wallets;
create policy "Users can read own wallet" on public.wallets for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders" on public.orders for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can read own transactions" on public.transactions;
create policy "Users can read own transactions" on public.transactions for select to authenticated using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, phone)
  values (new.id, new.raw_user_meta_data ->> 'display_name', new.phone)
  on conflict (id) do nothing;
  insert into public.wallets (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Service-role-only function. Row lock + unique transaction/order constraints make webhook retries idempotent.
create or replace function public.finalize_paystack_order(p_reference text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_order public.orders%rowtype;
begin
  select * into v_order from public.orders where reference = p_reference for update;
  if not found then return false; end if;
  if v_order.status = 'successful' then return true; end if;
  if v_order.status <> 'pending' then return false; end if;

  insert into public.wallets (user_id, balance_kobo) values (v_order.user_id, v_order.amount_kobo)
  on conflict (user_id) do update set balance_kobo = public.wallets.balance_kobo + excluded.balance_kobo, updated_at = now();
  insert into public.transactions (user_id, order_id, provider_reference, amount_kobo, currency, status)
  values (v_order.user_id, v_order.id, v_order.reference, v_order.amount_kobo, v_order.currency, 'successful');
  update public.orders set status = 'successful', updated_at = now() where id = v_order.id;
  return true;
end;
$$;

revoke all on function public.finalize_paystack_order(text) from public, anon, authenticated;
grant execute on function public.finalize_paystack_order(text) to service_role;

grant select on public.profiles, public.wallets, public.orders, public.transactions to authenticated;
grant update (display_name, phone, updated_at) on public.profiles to authenticated;
