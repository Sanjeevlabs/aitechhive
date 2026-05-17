-- scripts/supabase-schema.sql
-- One-time setup. Run in Supabase SQL Editor after creating the project.

-- ============================================================
-- 1. Profiles (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. Saves
-- ============================================================
create table if not exists public.saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

alter table public.saves enable row level security;

create policy "users see own saves"
  on public.saves for select
  using (auth.uid() = user_id);

create policy "users insert own saves"
  on public.saves for insert
  with check (auth.uid() = user_id);

create policy "users delete own saves"
  on public.saves for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 3. Dismissed
-- ============================================================
create table if not exists public.dismissed (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  dismissed_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

alter table public.dismissed enable row level security;

create policy "users see own dismissed"
  on public.dismissed for select
  using (auth.uid() = user_id);

create policy "users insert own dismissed"
  on public.dismissed for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- 4. Shares
-- ============================================================
create table if not exists public.shares (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  shared_at timestamptz not null default now()
);

alter table public.shares enable row level security;

create policy "users see own shares"
  on public.shares for select
  using (auth.uid() = user_id);

create policy "users insert own shares"
  on public.shares for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- 5. Indexes
-- ============================================================
create index if not exists idx_saves_user on public.saves(user_id, saved_at desc);
create index if not exists idx_dismissed_user on public.dismissed(user_id);
create index if not exists idx_shares_user on public.shares(user_id, shared_at desc);
