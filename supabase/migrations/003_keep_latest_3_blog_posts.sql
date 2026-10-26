-- Optional: keep only the 3 most recent blog posts in Supabase
delete from public.blog_posts
where id not in (
  select id
  from public.blog_posts
  order by published_at desc nulls last, created_at desc
  limit 3
);
