import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminBlogManager } from "@/components/admin/AdminBlogManager";
import { AdminNoticeManager } from "@/components/admin/AdminNoticeManager";
import { AdminPortfolioManager } from "@/components/admin/AdminPortfolioManager";
import { logoutAdmin } from "@/lib/admin-auth";
import {
  CHANNEL_LABELS,
  STATUS_LABELS,
  createInquiry,
  deleteInquiry,
  listInquiries,
  updateInquiryNotes,
  updateInquiryStatus,
  type Inquiry,
  type InquiryChannel,
  type InquiryStatus,
} from "@/lib/inquiry-service";
import { Briefcase, ClipboardList, LogOut, Megaphone, MessageCircle, Newspaper, Plus, RefreshCw, Trash2 } from "lucide-react";

type Props = {
  onLogout: () => void;
};

type ChannelFilter = InquiryChannel | "all";
type AdminTab = "inquiries" | "blog" | "notice" | "portfolio";

function formatDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<AdminTab>("inquiries");
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [formChannel, setFormChannel] = useState<InquiryChannel>("google_form");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await listInquiries(channel);
      setItems(rows);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "목록을 불러오지 못했습니다.";
      setError(
        msg.includes("Could not find the table") || msg.includes("relation")
          ? "Supabase에 inquiries 테이블이 없습니다. supabase/migrations/001_inquiries.sql 을 SQL Editor에서 실행하세요."
          : msg,
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [channel]);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    return {
      all: items.length,
      new: items.filter((i) => i.status === "new").length,
      in_progress: items.filter((i) => i.status === "in_progress").length,
      done: items.filter((i) => i.status === "done").length,
    };
  }, [items]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createInquiry({
        channel: formChannel,
        name: name.trim() || undefined,
        contact: contact.trim() || undefined,
        message: message.trim() || undefined,
      });
      setName("");
      setContact("");
      setMessage("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(id: string, status: InquiryStatus) {
    try {
      await updateInquiryStatus(id, status);
      setItems((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "상태 변경에 실패했습니다.");
    }
  }

  async function handleNotes(id: string, notes: string) {
    try {
      await updateInquiryNotes(id, notes);
      setItems((prev) => prev.map((row) => (row.id === id ? { ...row, notes } : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "메모 저장에 실패했습니다.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 문의 기록을 삭제할까요?")) return;
    try {
      await deleteInquiry(id);
      setItems((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  }

  function handleLogout() {
    logoutAdmin();
    onLogout();
  }

  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">관리자 대시보드</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              문의 내역과 데이터 뉴스 블로그를 Supabase에서 관리합니다.
            </p>
          </div>
          <div className="flex gap-2">
            {tab === "inquiries" && (
              <Button type="button" variant="outline" onClick={() => void load()}>
                <RefreshCw className="size-4" />
                새로고침
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={handleLogout}>
              <LogOut className="size-4" />
              로그아웃
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={tab === "inquiries" ? "default" : "outline"}
            onClick={() => setTab("inquiries")}
          >
            <ClipboardList className="size-4" />
            문의 관리
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === "blog" ? "default" : "outline"}
            onClick={() => setTab("blog")}
          >
            <Newspaper className="size-4" />
            블로그 관리
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === "notice" ? "default" : "outline"}
            onClick={() => setTab("notice")}
          >
            <Megaphone className="size-4" />
            공지하기 관리
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tab === "portfolio" ? "default" : "outline"}
            onClick={() => setTab("portfolio")}
          >
            <Briefcase className="size-4" />
            포트폴리오 관리
          </Button>
        </div>

        {tab === "blog" ? (
          <div className="mt-8">
            <AdminBlogManager />
          </div>
        ) : tab === "notice" ? (
          <div className="mt-8">
            <AdminNoticeManager />
          </div>
        ) : tab === "portfolio" ? (
          <div className="mt-8">
            <AdminPortfolioManager />
          </div>
        ) : (
          <>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            { label: "전체", value: counts.all },
            { label: "신규", value: counts.new },
            { label: "처리중", value: counts.in_progress },
            { label: "완료", value: counts.done },
          ].map((card) => (
            <div key={card.label} className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-2xl font-extrabold text-card-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ["all", "전체"],
              ["google_form", "구글폼 맞춤상담"],
              ["kakao", "카카오 오픈채팅"],
              ["other", "기타"],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={channel === value ? "default" : "outline"}
              onClick={() => setChannel(value)}
            >
              {value === "google_form" ? (
                <ClipboardList className="size-4" />
              ) : value === "kakao" ? (
                <MessageCircle className="size-4" />
              ) : null}
              {label}
            </Button>
          ))}
        </div>

        <form
          onSubmit={handleCreate}
          className="mt-8 rounded-lg border border-border bg-card p-6"
        >
          <h2 className="flex items-center gap-2 text-lg font-bold text-card-foreground">
            <Plus className="size-5 text-primary" />
            문의 수동 등록
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            카카오톡·구글폼으로 받은 상담을 여기 기록해 두면 대시보드에서 상태를 관리할 수 있습니다.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>채널</Label>
              <Select
                value={formChannel}
                onValueChange={(value) => setFormChannel(value as InquiryChannel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_form">구글폼 맞춤상담</SelectItem>
                  <SelectItem value="kakao">카카오 오픈채팅</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiry-name">이름</Label>
              <Input
                id="inquiry-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="문의자 이름"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inquiry-contact">연락처</Label>
              <Input
                id="inquiry-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="전화 / 이메일 / 카카오 ID"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="inquiry-message">문의 내용</Label>
              <Textarea
                id="inquiry-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="상담 요청 내용을 입력하세요"
                rows={3}
              />
            </div>
          </div>
          <Button type="submit" className="mt-4" disabled={saving}>
            {saving ? "등록 중..." : "등록하기"}
          </Button>
        </form>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-bold text-card-foreground">문의 목록</h2>
          </div>
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">불러오는 중...</p>
          ) : items.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">등록된 문의가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>일시</TableHead>
                  <TableHead>채널</TableHead>
                  <TableHead>이름 / 연락처</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>메모</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDate(row.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{CHANNEL_LABELS[row.channel]}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{row.name || "-"}</p>
                      <p className="text-xs text-muted-foreground">{row.contact || "-"}</p>
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {row.message || "-"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.status}
                        onValueChange={(value) => void handleStatus(row.id, value as InquiryStatus)}
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(STATUS_LABELS) as InquiryStatus[]).map((status) => (
                            <SelectItem key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        defaultValue={row.notes ?? ""}
                        rows={2}
                        className="min-w-[140px]"
                        onBlur={(e) => {
                          if ((row.notes ?? "") !== e.target.value) {
                            void handleNotes(row.id, e.target.value);
                          }
                        }}
                        placeholder="내부 메모"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="삭제"
                        onClick={() => void handleDelete(row.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
          </>
        )}
      </div>
    </section>
  );
}
