-- Apply once in the existing Supabase project before enabling newsletter signup.
-- API access is server-only; no subscriber reads/writes are granted to anon/authenticated.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'subscribed' check(status in ('subscribed','unsubscribed')),
  consent_version text not null default 'working-notes-2026-11',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  unsubscribe_token_hash text not null unique
);
create table if not exists public.newsletter_signup_limits (
  bucket text primary key,
  attempts integer not null default 0,
  expires_at timestamptz not null
);
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_signup_limits enable row level security;
revoke all on public.newsletter_subscribers from anon, authenticated;
revoke all on public.newsletter_signup_limits from anon, authenticated;
grant all on public.newsletter_subscribers to service_role;
grant all on public.newsletter_signup_limits to service_role;
create or replace function public.newsletter_subscribe(p_email text,p_bucket text,p_token_hash text)
returns text language plpgsql security definer set search_path=public as $$
declare count_attempts integer; inserted_id uuid;
begin
  if p_email is null or length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or p_token_hash !~ '^[a-f0-9]{64}$' or p_bucket !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid signup';
  end if;
  insert into public.newsletter_signup_limits(bucket,attempts,expires_at) values(p_bucket,1,now()+interval '1 day')
  on conflict(bucket) do update set attempts=newsletter_signup_limits.attempts+1 returning attempts into count_attempts;
  if count_attempts>8 then return 'rate_limited'; end if;
  insert into public.newsletter_subscribers(email,unsubscribe_token_hash) values(lower(trim(p_email)),p_token_hash)
  on conflict(email) do nothing returning id into inserted_id;
  delete from public.newsletter_signup_limits where expires_at<now();
  if inserted_id is null then return 'existing'; end if;
  return 'created';
end;
$$;
revoke all on function public.newsletter_subscribe(text,text,text) from public,anon,authenticated;
grant execute on function public.newsletter_subscribe(text,text,text) to service_role;
