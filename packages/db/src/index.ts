import { createClient, type SupabaseClient, type SupabaseClientOptions } from "@supabase/supabase-js";
import type { Database } from "./types";

export const dbPackageName = "@within/db" as const;

export type WithinDbClient = SupabaseClient<Database>;

export function createDbClient(
  supabaseUrl: string,
  supabaseAnonKey: string,
  options?: SupabaseClientOptions<"public">,
): WithinDbClient {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, options);
}

export * from "./types";
export * from "./mockContent";
