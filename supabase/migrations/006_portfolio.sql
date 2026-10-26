-- Portfolio table + Storage bucket
-- Run in Supabase → SQL Editor

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_path text not null,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolios_sort_order_idx
  on public.portfolios (sort_order asc, created_at desc);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.portfolios to anon, authenticated;

alter table public.portfolios enable row level security;

drop policy if exists "anon_select_portfolios" on public.portfolios;
drop policy if exists "anon_insert_portfolios" on public.portfolios;
drop policy if exists "anon_update_portfolios" on public.portfolios;
drop policy if exists "anon_delete_portfolios" on public.portfolios;

create policy "anon_select_portfolios" on public.portfolios
  for select to anon using (true);
create policy "anon_insert_portfolios" on public.portfolios
  for insert to anon with check (true);
create policy "anon_update_portfolios" on public.portfolios
  for update to anon using (true) with check (true);
create policy "anon_delete_portfolios" on public.portfolios
  for delete to anon using (true);

-- Public Storage bucket for portfolio images
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "anon_read_portfolio_images" on storage.objects;
drop policy if exists "anon_upload_portfolio_images" on storage.objects;
drop policy if exists "anon_update_portfolio_images" on storage.objects;
drop policy if exists "anon_delete_portfolio_images" on storage.objects;

create policy "anon_read_portfolio_images" on storage.objects
  for select to anon
  using (bucket_id = 'portfolio');

create policy "anon_upload_portfolio_images" on storage.objects
  for insert to anon
  with check (bucket_id = 'portfolio');

create policy "anon_update_portfolio_images" on storage.objects
  for update to anon
  using (bucket_id = 'portfolio')
  with check (bucket_id = 'portfolio');

create policy "anon_delete_portfolio_images" on storage.objects
  for delete to anon
  using (bucket_id = 'portfolio');
