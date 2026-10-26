import { supabase } from "@/lib/supabase";

export type Notice = {
  id: string;
  title: string;
  content: string;
  published_at: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type NoticeInput = {
  title: string;
  content: string;
  published_at?: string | undefined;
  is_pinned?: boolean | undefined;
};

function throwIfError(error: { message: string; hint?: string | null } | null) {
  if (!error) return;
  const hint = error.hint ? ` (${error.hint})` : "";
  throw new Error(`${error.message}${hint}`);
}

export async function listNotices() {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  throwIfError(error);
  return (data ?? []) as Notice[];
}

export async function listNoticesForPublic() {
  try {
    return await listNotices();
  } catch {
    return [];
  }
}

export async function createNotice(input: NoticeInput) {
  const { data, error } = await supabase
    .from("notices")
    .insert({
      title: input.title,
      content: input.content,
      published_at: input.published_at || new Date().toISOString().slice(0, 10),
      is_pinned: input.is_pinned ?? false,
    })
    .select()
    .single();

  throwIfError(error);
  return data as Notice;
}

export async function updateNotice(id: string, input: NoticeInput) {
  const { data, error } = await supabase
    .from("notices")
    .update({
      title: input.title,
      content: input.content,
      published_at: input.published_at || new Date().toISOString().slice(0, 10),
      is_pinned: input.is_pinned ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  throwIfError(error);
  return data as Notice;
}

export async function deleteNotice(id: string) {
  const { error } = await supabase.from("notices").delete().eq("id", id);
  throwIfError(error);
}
