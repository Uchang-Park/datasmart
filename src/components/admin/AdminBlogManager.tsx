import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createBlogPost,
  deleteBlogPost,
  listBlogPosts,
  updateBlogPost,
  type BlogPost,
  type BlogPostInput,
} from "@/lib/blog-service";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

const emptyForm: BlogPostInput = {
  title: "",
  summary: "",
  url: "",
  source: "",
  published_at: "",
};

export function AdminBlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<BlogPostInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(await listBlogPosts());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "목록을 불러오지 못했습니다.";
      setError(
        msg.includes("Could not find the table") || msg.includes("relation")
          ? "Supabase에 blog_posts 테이블이 없습니다. supabase/migrations/002_blog_posts.sql 을 SQL Editor에서 실행하세요."
          : msg.includes("permission denied")
            ? "blog_posts 테이블 권한이 없습니다. supabase/migrations/004_grant_blog_posts.sql 을 SQL Editor에서 실행한 뒤 새로고침하세요."
            : msg,
      );
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      summary: post.summary,
      url: post.url,
      source: post.source ?? "",
      published_at: post.published_at ?? "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload: BlogPostInput = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        url: form.url.trim(),
        source: form.source?.trim() || undefined,
        published_at: form.published_at?.trim() || undefined,
      };
      if (editingId) {
        await updateBlogPost(editingId, payload);
      } else {
        await createBlogPost(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 블로그 글을 삭제할까요?")) return;
    try {
      await deleteBlogPost(id);
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">블로그 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            데이터 뉴스 제목·요약·원문 링크를 등록하고 수정·삭제할 수 있습니다.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => void load()}>
          <RefreshCw className="size-4" />
          새로고침
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-card-foreground">
          <Plus className="size-5 text-primary" />
          {editingId ? "뉴스 수정" : "뉴스 등록"}
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="blog-title">제목</Label>
            <Input
              id="blog-title"
              required
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="뉴스 제목"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blog-source">출처</Label>
            <Input
              id="blog-source"
              value={form.source ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, source: e.target.value }))}
              placeholder="예: KAIST News"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blog-date">발행일</Label>
            <Input
              id="blog-date"
              type="date"
              value={form.published_at ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, published_at: e.target.value }))}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="blog-url">뉴스 링크 (URL)</Label>
            <Input
              id="blog-url"
              type="url"
              required
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="blog-summary">요약</Label>
            <Textarea
              id="blog-summary"
              required
              rows={4}
              value={form.summary}
              onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
              placeholder="카드에 보일 요약 문단"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "저장 중..." : editingId ? "수정 저장" : "등록하기"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              취소
            </Button>
          )}
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-bold text-card-foreground">등록된 뉴스 ({posts.length})</h3>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">불러오는 중...</p>
        ) : posts.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">등록된 뉴스가 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>발행일</TableHead>
                <TableHead>제목 / 출처</TableHead>
                <TableHead>링크</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {post.published_at ?? "-"}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.source ?? "-"}</p>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-sm text-primary hover:underline"
                    >
                      {post.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="수정"
                        onClick={() => startEdit(post)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="삭제"
                        onClick={() => void handleDelete(post.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
