import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { listBlogPostsForPublic, type BlogPost } from "@/lib/blog-service";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const rows = await listBlogPostsForPublic();
      if (!cancelled) {
        setPosts(rows);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-background scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <motion.div {...fadeUp} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <Newspaper className="size-4" />
            Blog
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
            데이터 뉴스
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            DB·AI·RAG 등 데이터 분야의 최신 소식을 모았습니다. 카드의 링크를 누르면 원문 뉴스로
            이동합니다.
          </p>
        </motion.div>

        {loading ? (
          <p className="mt-10 text-sm text-muted-foreground">뉴스를 불러오는 중...</p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.a
                key={post.id}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: Math.min(index * 0.06, 0.24) }}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    {post.source && (
                      <p className="text-xs font-semibold text-primary">{post.source}</p>
                    )}
                    {post.published_at && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(post.published_at)}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-bold leading-snug text-card-foreground">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-4">
                  {post.summary}
                </p>
                <span className="mt-5 text-sm font-semibold text-primary">원문 보기</span>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
