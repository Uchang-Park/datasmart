-- Fix: permission denied for table blog_posts (SELECT/UPDATE/DELETE for anon)
-- Run this in Supabase → SQL Editor

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete
  on table public.blog_posts
  to anon, authenticated;

-- Keep RLS policies (recreate if missing)
alter table public.blog_posts enable row level security;

drop policy if exists "anon_select_blog_posts" on public.blog_posts;
drop policy if exists "anon_insert_blog_posts" on public.blog_posts;
drop policy if exists "anon_update_blog_posts" on public.blog_posts;
drop policy if exists "anon_delete_blog_posts" on public.blog_posts;

create policy "anon_select_blog_posts" on public.blog_posts
  for select to anon using (true);
create policy "anon_insert_blog_posts" on public.blog_posts
  for insert to anon with check (true);
create policy "anon_update_blog_posts" on public.blog_posts
  for update to anon using (true) with check (true);
create policy "anon_delete_blog_posts" on public.blog_posts
  for delete to anon using (true);
