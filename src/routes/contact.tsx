import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/content";
import { pageHead } from "@/components/site/metadata";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("/contact", "뉴스 및 문의하기 — 데이터스마트", "데이터·AI 뉴스, 회사 공지, 맞춤상담·오픈채팅 문의를 제공합니다."),
  component: Contact,
});
