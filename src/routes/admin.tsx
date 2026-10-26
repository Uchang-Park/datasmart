import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { pageHead } from "@/components/site/metadata";
import { isAdminLoggedIn } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  head: () =>
    pageHead(
      "/admin",
      "관리자 — 데이터스마트",
      "데이터스마트 문의·상담 관리자 페이지입니다.",
    ),
  component: AdminPage,
});

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => isAdminLoggedIn());

  if (!loggedIn) {
    return <AdminLogin onSuccess={() => setLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={() => setLoggedIn(false)} />;
}
