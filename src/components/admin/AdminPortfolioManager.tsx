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
  createPortfolio,
  deletePortfolio,
  listPortfolios,
  updatePortfolio,
  type Portfolio,
} from "@/lib/portfolio-service";
import { ImagePlus, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

type FormState = {
  title: string;
  description: string;
  sort_order: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  sort_order: "0",
};

export function AdminPortfolioManager() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingImagePath, setEditingImagePath] = useState<string>("");
  const [editingImageUrl, setEditingImageUrl] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await listPortfolios());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "목록을 불러오지 못했습니다.";
      setError(
        msg.includes("Could not find the table") || msg.includes("relation")
          ? "Supabase에 portfolios 테이블이 없습니다. supabase/migrations/006_portfolio.sql 을 SQL Editor에서 실행하세요."
          : msg.includes("permission denied") || msg.includes("Bucket not found")
            ? "포트폴리오 테이블/Storage 권한이 없습니다. 006_portfolio.sql 을 실행한 뒤 새로고침하세요."
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

  useEffect(() => {
    if (!file) {
      setPreview(editingImageUrl);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, editingImageUrl]);

  function startEdit(item: Portfolio) {
    setEditingId(item.id);
    setEditingImagePath(item.image_path);
    setEditingImageUrl(item.image_url);
    setFile(null);
    setForm({
      title: item.title,
      description: item.description,
      sort_order: String(item.sort_order),
    });
  }

  function resetForm() {
    setEditingId(null);
    setEditingImagePath("");
    setEditingImageUrl("");
    setFile(null);
    setPreview("");
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!editingId && !file) {
      setError("포트폴리오 이미지를 선택해 주세요.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        sort_order: Number(form.sort_order) || 0,
      };
      if (editingId) {
        await updatePortfolio(editingId, payload, {
          file: file ?? undefined,
          previousImagePath: editingImagePath,
        });
      } else if (file) {
        await createPortfolio(payload, file);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: Portfolio) {
    if (!confirm("이 포트폴리오를 삭제할까요? Storage 이미지도 함께 삭제됩니다.")) return;
    try {
      await deletePortfolio(item);
      if (editingId === item.id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground">포트폴리오 관리</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            이미지 1장과 설명을 등록합니다. 이미지는 Supabase Storage(portfolio 버킷)에 저장됩니다.
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
          {editingId ? "포트폴리오 수정" : "포트폴리오 등록"}
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="portfolio-title">제목</Label>
            <Input
              id="portfolio-title"
              required
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="프로젝트 제목"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio-order">정렬 순서</Label>
            <Input
              id="portfolio-order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((prev) => ({ ...prev, sort_order: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio-image">이미지 {editingId ? "(변경 시에만 선택)" : ""}</Label>
            <Input
              id="portfolio-image"
              type="file"
              accept="image/*"
              required={!editingId}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="portfolio-description">내용</Label>
            <Textarea
              id="portfolio-description"
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="프로젝트 개요, 역할, 성과 등을 적어 주세요"
            />
          </div>
          {preview && (
            <div className="md:col-span-2">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <ImagePlus className="size-4" />
                미리보기
              </p>
              <img
                src={preview}
                alt="미리보기"
                className="max-h-56 rounded-lg border border-border object-cover"
              />
            </div>
          )}
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
          <h3 className="font-bold text-card-foreground">등록된 포트폴리오 ({items.length})</h3>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">불러오는 중...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">등록된 포트폴리오가 없습니다.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이미지</TableHead>
                <TableHead>제목 / 내용</TableHead>
                <TableHead>순서</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="size-16 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </TableCell>
                  <TableCell>{item.sort_order}</TableCell>
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
                        onClick={() => void handleDelete(item)}
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
