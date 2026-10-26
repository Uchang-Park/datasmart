-- Company notices (공지하기)
-- Run in Supabase → SQL Editor

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  published_at date not null default (current_date),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notices_published_at_idx
  on public.notices (is_pinned desc, published_at desc, created_at desc);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.notices to anon, authenticated;

alter table public.notices enable row level security;

drop policy if exists "anon_select_notices" on public.notices;
drop policy if exists "anon_insert_notices" on public.notices;
drop policy if exists "anon_update_notices" on public.notices;
drop policy if exists "anon_delete_notices" on public.notices;

create policy "anon_select_notices" on public.notices
  for select to anon using (true);
create policy "anon_insert_notices" on public.notices
  for insert to anon with check (true);
create policy "anon_update_notices" on public.notices
  for update to anon using (true) with check (true);
create policy "anon_delete_notices" on public.notices
  for delete to anon using (true);
