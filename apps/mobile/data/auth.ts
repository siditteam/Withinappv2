import { supabaseClient } from "./supabaseClient";

// Guests get a real (anonymous) Supabase auth user, which is what makes the
// profiles trigger and owner-scoped RLS policies from Phase 1 apply to them
// too. Returns null when no Supabase project is configured (mock mode).
export async function ensureSession(): Promise<string | null> {
  if (!supabaseClient) return null;

  const { data: existing } = await supabaseClient.auth.getSession();
  if (existing.session) return existing.session.user.id;

  const { data, error } = await supabaseClient.auth.signInAnonymously();
  if (error) {
    console.warn("Within: anonymous sign-in failed:", error.message);
    return null;
  }
  return data.user?.id ?? null;
}
