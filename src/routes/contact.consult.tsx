import { createFileRoute } from "@tanstack/react-router";
import { ConsultForm } from "@/components/site/ConsultForm";
import { pageHead } from "@/components/site/metadata";

export const Route = createFileRoute("/contact/consult")({
  head: () =>
    pageHead(
      "/contact/consult",
      "맞춤상담 신청 — 데이터스마트",
      "이름, 연락처, 문의 유형과 상담 내용을 남겨 주시면 맞춤 제안을 드립니다.",
    ),
  component: ConsultForm,
});
