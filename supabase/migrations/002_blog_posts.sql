-- Run this in Supabase → SQL Editor
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  url text not null,
  source text,
  published_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_published_at_idx
  on public.blog_posts (published_at desc nulls last);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.blog_posts to anon, authenticated;

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

-- Seed: 데이터·AI 관련 뉴스 5건 (이미 있으면 건너뜀)
insert into public.blog_posts (title, summary, url, source, published_at)
select * from (values
  (
    'KAIST, 관계형·그래프 DB를 통합한 Chimera 공개',
    'KAIST 연구팀이 관계형 DB와 그래프 DB를 하나로 통합한 Chimera를 발표했습니다. 복잡한 그래프-관계형 질의를 기존 대비 최대 수백 배 빠르게 처리해 산업 현장 AI 서비스에 바로 적용할 수 있을 것으로 기대됩니다.',
    'https://news.kaist.ac.kr/newsen/html/news/?mng_no=51530&mode=V',
    'KAIST News',
    '2025-09-08'::date
  ),
  (
    '제논, 한국가스공사에 하이브리드 LLM·RAG 구축',
    '제논이 한국가스공사의 사내 전용 생성형 AI 사업을 수주했습니다. 온프레미스 환경에서 LLM과 RAG를 결합하고, 내부·외부 모델을 선택적으로 쓰는 하이브리드 구조를 공공 에너지 기관에 도입합니다.',
    'https://www.ddaily.co.kr/page/view/2025091009525931252',
    '디지털데일리',
    '2025-09-10'::date
  ),
  (
    'MariaDB, Agentic AI를 위한 통합 클라우드 DB 플랫폼 발표',
    'MariaDB Enterprise Platform 2026이 네이티브 벡터 검색, 내장 RAG, AI 에이전트를 하나의 클라우드 DB 플랫폼에 통합했습니다. 별도 벡터 DB 없이도 에이전틱 애플리케이션 개발을 가속화하는 것이 목표입니다.',
    'https://mariadb.com/newsroom/press-releases/mariadb-unveils-unified-cloud-database-platform-designed-to-accelerate-agentic-ai-application-development/',
    'MariaDB',
    '2025-10-22'::date
  ),
  (
    'KAIST·GraphAI, AkasicDB로 AI 환각 줄이고 정확도 78% 향상',
    '벡터·그래프·관계형 DB를 단일 DBMS로 통합한 AkasicDB와 Omni RAG가 공개됐습니다. 기존 RAG 대비 답변 정확도를 최대 78% 높이고 복잡한 검색 처리 속도도 크게 개선했다고 발표했습니다.',
    'https://www.eurekalert.org/news-releases/1132514',
    'EurekAlert!',
    '2026-06-18'::date
  ),
  (
    '그래파이, 차세대 AI 데이터베이스 AkasicDB 1.0 출시',
    '엔터프라이즈 AI 데이터 인프라 기업 그래파이가 그래프·벡터·관계형 DB를 한 엔진으로 통합한 AkasicDB 1.0을 출시했습니다. Omni RAG로 문서 의미·개체 관계·구조화 조건을 동시에 활용해 환각을 줄입니다.',
    'https://graphai.io/news/akasicdb-1-0-launch/',
    'GraphAI',
    '2026-07-09'::date
  )
) as v(title, summary, url, source, published_at)
where not exists (select 1 from public.blog_posts limit 1);
