import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../auth/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function completeAuth() {
      if (!supabase) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
        }

        const { error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        navigate("/", { replace: true });
      } catch (authError) {
        if (!isMounted) {
          return;
        }

        const message = authError instanceof Error ? authError.message : "Could not complete sign-in.";
        setError(message);
      }
    }

    completeAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] grid place-items-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
        <h1 className="text-2xl font-light tracking-[0.03em] mb-3">Finalizing sign in</h1>
        {error ? (
          <>
            <p className="text-sm text-[#FCA5A5] leading-relaxed mb-4">{error}</p>
            <button
              onClick={() => navigate("/login", { replace: true })}
              className="w-full rounded-xl bg-white/10 hover:bg-white/20 transition-colors py-3"
            >
              Return to login
            </button>
          </>
        ) : (
          <p className="text-sm text-white/75">Please wait while we connect your account...</p>
        )}
      </div>
    </div>
  );
}
