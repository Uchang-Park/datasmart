import { createFileRoute } from "@tanstack/react-router";
import { Education } from "@/components/site/content";
import { pageHead } from "@/components/site/metadata";

export const Route = createFileRoute("/education")({
  head: () => pageHead("/education", "데이터 교육 — 데이터스마트", "기업·공공기관 출강, 1:1 실무 코칭, SQLD·빅데이터분석기사 시험 대비 교육을 제공합니다."),
  component: Education,
});
