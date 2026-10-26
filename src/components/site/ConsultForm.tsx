import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInquiry } from "@/lib/inquiry-service";
import { ArrowLeft, CheckCircle2, ClipboardList } from "lucide-react";

const INQUIRY_TYPES = [
  "DB 구축 & 성능 최적화",
  "RAG 기반 AI 시스템",
  "데이터 시각화 & 대시보드",
  "데이터 교육",
  "자격증 시험 대비",
  "기타",
] as const;

export function ConsultForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [inquiryType, setInquiryType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!inquiryType) {
      setError("문의 유형을 선택해 주세요.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createInquiry({
        channel: "google_form",
        name: name.trim(),
        contact: contact.trim(),
        message: `[문의 유형: ${inquiryType}]\n${message.trim()}`,
      });
      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "제출에 실패했습니다.";
      setError(
        msg.includes("Could not find the table") || msg.includes("relation")
          ? "상담 저장용 테이블이 아직 없습니다. Supabase에서 inquiries SQL을 실행한 뒤 다시 시도해 주세요."
          : msg,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section className="bg-hero min-h-[65vh] scroll-mt-16">
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
          <CheckCircle2 className="size-12 text-cyan-soft" />
          <h1 className="mt-5 text-2xl font-extrabold text-navy-foreground">
            상담 신청이 접수되었습니다
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-navy-foreground/70">
            남겨 주신 내용을 확인한 뒤 24시간 이내에 연락드리겠습니다.
          </p>
          <Button asChild className="mt-8">
            <Link to="/contact">뉴스 및 문의하기로 돌아가기</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-hero min-h-[65vh] scroll-mt-16">
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-20">
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-foreground/70 transition-colors hover:text-navy-foreground"
        >
          <ArrowLeft className="size-4" />
          뉴스 및 문의하기로 돌아가기
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 rounded-lg border border-navy-foreground/15 bg-navy-foreground/5 p-7 backdrop-blur sm:p-9"
        >
          <div className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/20 text-cyan-soft">
            <ClipboardList className="size-5" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-navy-foreground">맞춤상담 신청</h1>
          <p className="mt-2 text-sm text-cyan-soft">구글폼 1:1 상담 신청</p>
          <p className="mt-2 text-sm text-navy-foreground/60">
            프로젝트 개요를 남겨주시면 맞춤 제안을 드립니다.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="consult-name" className="text-navy-foreground">
                이름
              </Label>
              <Input
                id="consult-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="성함 또는 담당자명"
                className="border-navy-foreground/20 bg-navy-foreground/5 text-navy-foreground placeholder:text-navy-foreground/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consult-contact" className="text-navy-foreground">
                연락처
              </Label>
              <Input
                id="consult-contact"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="전화번호 또는 이메일"
                className="border-navy-foreground/20 bg-navy-foreground/5 text-navy-foreground placeholder:text-navy-foreground/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-navy-foreground">문의 유형</Label>
              <Select value={inquiryType} onValueChange={setInquiryType}>
                <SelectTrigger className="border-navy-foreground/20 bg-navy-foreground/5 text-navy-foreground">
                  <SelectValue placeholder="문의 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {INQUIRY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="consult-message" className="text-navy-foreground">
                문의 내용
              </Label>
              <Textarea
                id="consult-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="프로젝트 현황, 희망 일정, 궁금한 점을 적어 주세요"
                className="border-navy-foreground/20 bg-navy-foreground/5 text-navy-foreground placeholder:text-navy-foreground/40"
              />
            </div>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <Button type="submit" className="w-full rounded-full" disabled={submitting}>
              {submitting ? "제출 중..." : "상담 신청하기"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
