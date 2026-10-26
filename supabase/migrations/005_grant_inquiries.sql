-- Creates inquiries if missing, then grants anon privileges.
-- Run this in Supabase → SQL Editor (fixes: relation "public.inquiries" does not exist)

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('google_form', 'kakao', 'other')),
  name text,
  contact text,
  message text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_channel_idx on public.inquiries (channel);
create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.inquiries to anon, authenticated;

alter table public.inquiries enable row level security;

drop policy if exists "anon_select_inquiries" on public.inquiries;
drop policy if exists "anon_insert_inquiries" on public.inquiries;
drop policy if exists "anon_update_inquiries" on public.inquiries;
drop policy if exists "anon_delete_inquiries" on public.inquiries;

create policy "anon_select_inquiries" on public.inquiries
  for select to anon using (true);
create policy "anon_insert_inquiries" on public.inquiries
  for insert to anon with check (true);
create policy "anon_update_inquiries" on public.inquiries
  for update to anon using (true) with check (true);
create policy "anon_delete_inquiries" on public.inquiries
  for delete to anon using (true);
