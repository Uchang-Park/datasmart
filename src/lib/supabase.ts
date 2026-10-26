import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"];
const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

export const isSupabaseConfigured = Boolean(url && key);

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase env missing: set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env (and Vercel → Environment Variables)",
  );
}

// createClient throws if url is empty — that crashes the whole SSR bundle on Vercel
// when env vars are not set yet. Use a inert placeholder so the site can still boot.
export const supabase: SupabaseClient = createClient(
  url || "https://placeholder.supabase.co",
  key || "public-anon-key",
);
