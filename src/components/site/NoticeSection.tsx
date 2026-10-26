import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Pin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listNoticesForPublic, type Notice } from "@/lib/notice-service";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NoticeSection() {
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const rows = await listNoticesForPublic();
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
    <section id="notices" className="border-t border-border bg-secondary/40 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <motion.div {...fadeUp} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <Megaphone className="size-4" />
            Notice
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">공지하기</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            데이터스마트에서 안내드리는 공지사항입니다.
          </p>
        </motion.div>

        {loading ? (
          <p className="mt-10 text-sm text-muted-foreground">공지를 불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border bg-card px-5 py-8 text-sm text-muted-foreground">
            등록된 공지가 없습니다. 관리자 페이지에서 등록할 수 있습니다.
          </p>
        ) : (
          <motion.div
            {...fadeUp}
            className="mt-10 overflow-hidden rounded-lg border border-border bg-card"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">번호</TableHead>
                  <TableHead className="min-w-[140px]">제목</TableHead>
                  <TableHead className="w-40 whitespace-nowrap">공지일시</TableHead>
                  <TableHead>내용</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1.5">
                        {item.is_pinned && (
                          <Pin className="mt-0.5 size-3.5 shrink-0 text-primary" aria-label="고정" />
                        )}
                        <span className="font-semibold text-card-foreground">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDateTime(item.published_at)}
                    </TableCell>
                    <TableCell className="max-w-md whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {item.content}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>
    </section>
  );
}
