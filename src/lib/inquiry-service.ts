import { supabase } from "@/lib/supabase";

export type InquiryChannel = "google_form" | "kakao" | "other";
export type InquiryStatus = "new" | "in_progress" | "done";

export type Inquiry = {
  id: string;
  channel: InquiryChannel;
  name: string | null;
  contact: string | null;
  message: string | null;
  status: InquiryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type InquiryInsert = {
  channel: InquiryChannel;
  name?: string | undefined;
  contact?: string | undefined;
  message?: string | undefined;
  status?: InquiryStatus | undefined;
  notes?: string | undefined;
};

export const CHANNEL_LABELS: Record<InquiryChannel, string> = {
  google_form: "구글폼 맞춤상담",
  kakao: "카카오 오픈채팅",
  other: "기타",
};

export const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "신규",
  in_progress: "처리중",
  done: "완료",
};

export async function listInquiries(channel?: InquiryChannel | "all") {
  let query = supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (channel && channel !== "all") {
    query = query.eq("channel", channel);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Inquiry[];
}

export async function createInquiry(input: InquiryInsert) {
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      channel: input.channel,
      name: input.name ?? null,
      contact: input.contact ?? null,
      message: input.message ?? null,
      status: input.status ?? "new",
      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Inquiry;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const { data, error } = await supabase
    .from("inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Inquiry;
}

export async function updateInquiryNotes(id: string, notes: string) {
  const { data, error } = await supabase
    .from("inquiries")
    .update({ notes, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Inquiry;
}

export async function deleteInquiry(id: string) {
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw error;
}
