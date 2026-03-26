import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../auth/supabaseClient";

const AUTH_BYPASS_KEY = "within-auth-bypass";

type OAuthProvider = "google" | "apple";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  bypassEnabled: boolean;
  isAuthenticated: boolean;
  isSupabaseConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithApple: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  enableBypass: () => void;
  disableBypass: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function signInWithProvider(provider: OAuthProvider) {
  if (!supabase) {
    return { error: "Supabase is not configured yet." };
  }

  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });

  return { error: error?.message ?? null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bypassEnabled, setBypassEnabled] = useState(
    localStorage.getItem(AUTH_BYPASS_KEY) === "1",
  );

  useEffect(() => {
    if (bypassEnabled) {
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) {
          return;
        }
        setUser(data.session?.user ?? null);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [bypassEnabled]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      bypassEnabled,
      isAuthenticated: bypassEnabled || Boolean(user),
      isSupabaseConfigured,
      signInWithGoogle: () => signInWithProvider("google"),
      signInWithApple: () => signInWithProvider("apple"),
      signOut: async () => {
        localStorage.removeItem(AUTH_BYPASS_KEY);
        setBypassEnabled(false);
        setUser(null);

        if (supabase) {
          await supabase.auth.signOut();
        }
      },
      enableBypass: () => {
        localStorage.setItem(AUTH_BYPASS_KEY, "1");
        setBypassEnabled(true);
      },
      disableBypass: () => {
        localStorage.removeItem(AUTH_BYPASS_KEY);
        setBypassEnabled(false);
      },
    }),
    [bypassEnabled, loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
