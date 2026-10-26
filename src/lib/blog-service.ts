import { supabase } from "@/lib/supabase";

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostInput = {
  title: string;
  summary: string;
  url: string;
  source?: string | undefined;
  published_at?: string | undefined;
};

/** 공개 화면·폴백용 최신 뉴스 3건 */
export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: "fallback-1",
    title: "그래파이, 차세대 AI 데이터베이스 AkasicDB 1.0 출시",
    summary:
      "엔터프라이즈 AI 데이터 인프라 기업 그래파이가 그래프·벡터·관계형 DB를 한 엔진으로 통합한 AkasicDB 1.0을 출시했습니다. Omni RAG로 문서 의미·개체 관계·구조화 조건을 동시에 활용해 환각을 줄입니다.",
    url: "https://graphai.io/news/akasicdb-1-0-launch/",
    source: "GraphAI",
    published_at: "2026-07-09",
    created_at: "2026-07-09T00:00:00.000Z",
    updated_at: "2026-07-09T00:00:00.000Z",
  },
  {
    id: "fallback-2",
    title: "KAIST·GraphAI, AkasicDB로 AI 환각 줄이고 정확도 78% 향상",
    summary:
      "벡터·그래프·관계형 DB를 단일 DBMS로 통합한 AkasicDB와 Omni RAG가 공개됐습니다. 기존 RAG 대비 답변 정확도를 최대 78% 높이고 복잡한 검색 처리 속도도 크게 개선했다고 발표했습니다.",
    url: "https://www.eurekalert.org/news-releases/1132514",
    source: "EurekAlert!",
    published_at: "2026-06-18",
    created_at: "2026-06-18T00:00:00.000Z",
    updated_at: "2026-06-18T00:00:00.000Z",
  },
  {
    id: "fallback-3",
    title: "MariaDB, Agentic AI를 위한 통합 클라우드 DB 플랫폼 발표",
    summary:
      "MariaDB Enterprise Platform 2026이 네이티브 벡터 검색, 내장 RAG, AI 에이전트를 하나의 클라우드 DB 플랫폼에 통합했습니다. 별도 벡터 DB 없이도 에이전틱 애플리케이션 개발을 가속화하는 것이 목표입니다.",
    url: "https://mariadb.com/newsroom/press-releases/mariadb-unveils-unified-cloud-database-platform-designed-to-accelerate-agentic-ai-application-development/",
    source: "MariaDB",
    published_at: "2025-10-22",
    created_at: "2025-10-22T00:00:00.000Z",
    updated_at: "2025-10-22T00:00:00.000Z",
  },
];

function throwIfError(error: { message: string; hint?: string | null } | null) {
  if (!error) return;
  const hint = error.hint ? ` (${error.hint})` : "";
  throw new Error(`${error.message}${hint}`);
}

export async function listBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  throwIfError(error);
  return (data ?? []) as BlogPost[];
}

/** 공개 화면: 최신 3건만. DB 실패·빈 테이블이면 폴백 3건 */
export async function listBlogPostsForPublic() {
  try {
    const rows = await listBlogPosts();
    const latest = rows.slice(0, 3);
    return latest.length > 0 ? latest : FALLBACK_BLOG_POSTS;
  } catch {
    return FALLBACK_BLOG_POSTS;
  }
}

export async function createBlogPost(input: BlogPostInput) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: input.title,
      summary: input.summary,
      url: input.url,
      source: input.source ?? null,
      published_at: input.published_at || null,
    })
    .select()
    .single();

  throwIfError(error);
  return data as BlogPost;
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: input.title,
      summary: input.summary,
      url: input.url,
      source: input.source ?? null,
      published_at: input.published_at || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  throwIfError(error);
  return data as BlogPost;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  throwIfError(error);
}
