import { createSupabaseServerClient, supabaseConfigured } from "@/lib/supabase/server";

export type AdminSession =
  // Mock mode: no project, no auth -- open read-only preview.
  | { mode: "mock" }
  // Configured but signed out; src/proxy.ts should have redirected already.
  | { mode: "signed-out" }
  | { mode: "signed-in"; email: string; isAdmin: boolean };

export async function getAdminSession(): Promise<AdminSession> {
  if (!supabaseConfigured) {
    return { mode: "mock" };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { mode: "signed-out" };
  }

  // RLS lets a user read their own admin_roles row, so this works for
  // non-admins too (it just comes back empty).
  const { data: role } = await supabase
    .from("admin_roles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { mode: "signed-in", email: user.email ?? user.id, isAdmin: role !== null };
}
