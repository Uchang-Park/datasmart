import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/content";
import { pageHead } from "@/components/site/metadata";

export const Route = createFileRoute("/about")({
  head: () => pageHead("/about", "회사 소개 — 데이터스마트", "데이터베이스 전문 서적을 집필한 수석 아키텍트가 이끄는 데이터 엔지니어링·AI·교육 전문 기업입니다."),
  component: About,
});
