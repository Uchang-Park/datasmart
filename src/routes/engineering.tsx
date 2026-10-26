import { createFileRoute } from "@tanstack/react-router";
import { Engineering } from "@/components/site/content";
import { pageHead } from "@/components/site/metadata";

export const Route = createFileRoute("/engineering")({
  head: () => pageHead("/engineering", "데이터 분석 & AI 구축 — 데이터스마트", "대용량 DB 설계와 성능 튜닝, RAG 기반 AI 시스템, 데이터 시각화와 대시보드 구축을 제공합니다."),
  component: Engineering,
});
