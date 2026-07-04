import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database, WithinDbClient } from "@within/db";

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Auth (and therefore editing) only exists when a Supabase project is
// configured; without credentials the console runs in read-only mock mode.
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Per-request client bound to the caller's auth cookies, so RLS sees the
// signed-in admin (drafts, writes) instead of the anonymous role.
export async function createSupabaseServerClient(): Promise<WithinDbClient> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured");
  }
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Session refresh still happens in src/proxy.ts, which can write.
        }
      },
    },
  });
}
