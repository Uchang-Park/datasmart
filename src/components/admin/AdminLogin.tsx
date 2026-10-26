import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/lib/admin-auth";
import { LockKeyhole } from "lucide-react";

type Props = {
  onSuccess: () => void;
};

export function AdminLogin({ onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (loginAdmin(username.trim(), password)) {
      setError("");
      onSuccess();
      return;
    }
    setError("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="inline-flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
          <LockKeyhole className="size-5" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-card-foreground">관리자 로그인</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          문의·상담 내역을 관리하려면 로그인하세요.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-username">아이디</Label>
            <Input
              id="admin-username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">비밀번호</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
      </div>
    </section>
  );
}
