import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { listPortfoliosForPublic, type Portfolio } from "@/lib/portfolio-service";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export function PortfolioSection() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const rows = await listPortfoliosForPublic();
      if (!cancelled) {
        setItems(rows);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="border-t border-border bg-secondary/40 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <motion.div {...fadeUp} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <Briefcase className="size-4" />
            Portfolio
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">포트폴리오</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            데이터스마트가 수행한 프로젝트와 성과를 소개합니다. 각 항목에는 대표 이미지와 설명이
            포함됩니다.
          </p>
        </motion.div>

        {loading ? (
          <p className="mt-10 text-sm text-muted-foreground">포트폴리오를 불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border bg-card px-5 py-8 text-sm text-muted-foreground">
            아직 등록된 포트폴리오가 없습니다. 관리자 페이지에서 등록할 수 있습니다.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <motion.article
                key={item.id}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: Math.min(index * 0.06, 0.24) }}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-card-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
