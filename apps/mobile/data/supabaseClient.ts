import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { createDbClient, type WithinDbClient } from "@within/db";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Null when no project is configured -- the app falls back to the mock
// content repository in that case (see contentRepository.ts) rather than
// requiring credentials to run at all.
export const supabaseClient: WithinDbClient | null =
  supabaseUrl && supabaseAnonKey
    ? createDbClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

if (supabaseClient) {
  // Avoid refreshing the auth token while the app is backgrounded.
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabaseClient.auth.startAutoRefresh();
    } else {
      supabaseClient.auth.stopAutoRefresh();
    }
  });
}
