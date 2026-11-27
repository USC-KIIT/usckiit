import { createClient, type User } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"),
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export function isKiitEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith("@kiit.ac.in");
}

export function extractKiitRoll(email?: string | null): string {
  if (!email) return "";
  const prefix = email.trim().split("@")[0] ?? "";
  return /^\d{6,10}$/.test(prefix) ? prefix : prefix;
}

export function getGoogleFullName(user: User): string {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const full = (meta?.full_name as string | undefined) || (meta?.name as string | undefined) || "";
  return full.trim();
}

export async function signInWithKiitGoogle() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.",
    );
  }
  sessionStorage.setItem("hackabot-oauth-return", "1");
  const redirectTo = `${window.location.origin}/events/hackabot`;
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        hd: "kiit.ac.in",
        prompt: "select_account",
      },
    },
  });
}
