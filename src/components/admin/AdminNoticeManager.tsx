import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createNotice,
  deleteNotice,
  listNotices,
  updateNotice,
  type Notice,
  type NoticeInput,
} from "@/lib/notice-service";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

const emptyForm: NoticeInput = {
  title: "",
  content: "",
  published_at: new Date().toISOString().slice(0, 10),
  is_pinned: false,
};

export function AdminNoticeManager() {
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<NoticeInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await listNotices());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "목록을 불러오지 못했습니다.";
      setError(
        msg.includes("Could not find the table") || msg.includes("relation")
          ? "Supabase에 notices 테이블이 없습니다. supabase/migrations/007_notices.sql 을 SQL Editor에서 실행하세요."
          : msg.includes("permission denied")
            ? "notices 테이블 권한이 없습니다. 007_notices.sql 을 실행한 뒤 새로고침하세요."
            : msg,
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(item: Notice) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content,
      published_at: item.published_at,
      is_pinned: item.is_pinned,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      published_at: new Date().toISOString().slice(0, 10),
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload: NoticeInput = {
        title: form.title.trim(),
        content: form.content.trim(),
        published_at: form.published_at?.trim() || undefined,
        is_pinned: form.is_pinned ?? false,
      };
      if (editingId) {
        await updateNotice(editingId, payload);
      } else {
        await createNotice(payload);
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
    if (!confirm("이 공지를 삭제할까요?")) return;
    try {
      await deleteNotice(id);
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
          <h2 className="text-xl font-extrabold text-foreground">공지하기 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            회사 안내·공지 내용을 등록하고 수정·삭제할 수 있습니다.
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
          {editingId ? "공지 수정" : "공지 등록"}
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notice-title">제목</Label>
            <Input
              id="notice-title"
              required
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="공지 제목"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notice-date">게시일</Label>
            <Input
              id="notice-date"
              type="date"
              required
              value={form.published_at ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, published_at: e.target.value }))}
            />
          </div>
          <div className="flex items-end gap-2 pb-1">
            <Checkbox
              id="notice-pinned"
              checked={form.is_pinned ?? false}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, is_pinned: checked === true }))
              }
            />
            <Label htmlFor="notice-pinned" className="cursor-pointer">
              상단 고정
            </Label>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notice-content">내용</Label>
            <Textarea
              id="notice-content"
              required
              rows={6}
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="사용자에게 알릴 공지 내용을 입력하세요"
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
          <h3 className="font-bold text-card-foreground">등록된 공지 ({items.length})</h3>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">등록된 공지가 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>게시일</TableHead>
                <TableHead>제목 / 내용</TableHead>
                <TableHead>고정</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {item.published_at}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.content}</p>
                  </TableCell>
                  <TableCell>{item.is_pinned ? "고정" : "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="수정"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="삭제"
                        onClick={() => void handleDelete(item.id)}
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
