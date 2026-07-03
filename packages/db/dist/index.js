import { createClient } from "@supabase/supabase-js";
export const dbPackageName = "@within/db";
export function createDbClient(supabaseUrl, supabaseAnonKey, options) {
    return createClient(supabaseUrl, supabaseAnonKey, options);
}
export * from "./types";
