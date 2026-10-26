import { createFileRoute } from "@tanstack/react-router";
import { Hub } from "@/components/site/content";
import { pageHead } from "@/components/site/metadata";

export const Route = createFileRoute("/")({
  head: () => pageHead("/", "데이터스마트(data smart) — 데이터 엔지니어링·AI·교육", "전문 서적 저자의 데이터베이스 구축, RAG AI, 맞춤형 데이터 교육 서비스를 만나보세요."),
  component: Hub,
});
