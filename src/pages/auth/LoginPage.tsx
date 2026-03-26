import { useState } from "react";
import { Navigate } from "react-router";
import { Apple } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../store/AuthContext";
import { useTheme } from "../../store/ThemeContext";
import { backgroundImages, bgStarTrails } from "../../lib/backgroundImages";
import { glassCardClass, glassSubtle } from "../../lib/glassStyles";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.95h5.5c-.24 1.27-.96 2.35-2.03 3.07l3.28 2.54c1.9-1.76 3-4.35 3-7.41 0-.72-.06-1.42-.18-2.1H12z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.95-.9 6.6-2.44l-3.28-2.54c-.9.61-2.06.98-3.32.98-2.55 0-4.72-1.72-5.5-4.03l-3.38 2.6A9.97 9.97 0 0 0 12 22z" />
      <path fill="#4A90E2" d="M6.5 13.97c-.2-.61-.32-1.27-.32-1.97s.12-1.36.32-1.97L3.12 7.43A9.95 9.95 0 0 0 2 12c0 1.61.38 3.13 1.12 4.57l3.38-2.6z" />
      <path fill="#FBBC05" d="M12 5.98c1.46 0 2.76.5 3.79 1.47l2.84-2.84C16.94 3.02 14.7 2 12 2A9.97 9.97 0 0 0 3.12 7.43l3.38 2.6C7.28 7.7 9.45 5.98 12 5.98z" />
    </svg>
  );
}

export default function LoginPage() {
  const { theme, backgroundTheme } = useTheme();
  const {
    isAuthenticated,
    isSupabaseConfigured,
    signInWithGoogle,
    signInWithApple,
    enableBypass,
    bypassEnabled,
    disableBypass,
  } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [busyProvider, setBusyProvider] = useState<"google" | "apple" | null>(null);

  const hasBackground = backgroundTheme !== "none";
  const currentBg = hasBackground ? (backgroundImages[backgroundTheme] || bgStarTrails) : null;
  const glassCard = glassCardClass(theme);
  const glassSubtleClass = glassSubtle(theme);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleOAuth(provider: "google" | "apple") {
    setError(null);
    setBusyProvider(provider);

    const result = provider === "google" ? await signInWithGoogle() : await signInWithApple();

    if (result.error) {
      setError(result.error);
      setBusyProvider(null);
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-[#0A0E27]" : "bg-[#E8EDF2]"}`}>
      <div
        className={`w-full max-w-[430px] min-h-screen shadow-2xl relative overflow-hidden ${
          theme === "dark" ? "bg-[#0F1419]" : "bg-[#F7F5F2]"
        }`}
      >
        {hasBackground && currentBg && (
          <div
            className="fixed inset-0 w-full max-w-[430px] mx-auto h-full z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${currentBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
        {hasBackground && currentBg && theme === "light" && (
          <div className="fixed inset-0 w-full max-w-[430px] mx-auto h-full z-0 pointer-events-none bg-white/60" />
        )}

        <div className="relative z-[1] p-6 pt-12">
          <div className="mb-8">
            <p className={`text-[11px] tracking-[0.3em] uppercase mb-3 ${theme === "dark" ? "text-white/50" : "text-[#4A647A]"}`}>
              Within
            </p>
            <h1 className={`${theme === "dark" ? "text-white" : "text-gray-900"} mb-3`}>
              Welcome back
            </h1>
            <p className={`text-[14px] font-extralight tracking-[0.015em] leading-[1.75] ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Continue your practice by signing in with your account.
            </p>
          </div>

          <div className={`rounded-[22px] p-4 ${glassCard}`}>
            <div className="space-y-3">
              <Button
                onClick={() => void handleOAuth("google")}
                disabled={!isSupabaseConfigured || busyProvider !== null}
                className={`w-full h-11 rounded-[16px] border ${
                  theme === "dark"
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/15"
                    : "border-gray-300 bg-white/70 text-gray-900 hover:bg-white"
                }`}
              >
                <GoogleIcon />
                {busyProvider === "google" ? "Connecting..." : "Continue with Google"}
              </Button>

              <Button
                onClick={() => void handleOAuth("apple")}
                disabled={!isSupabaseConfigured || busyProvider !== null}
                className="w-full h-11 rounded-[16px] bg-[#111827] text-white hover:bg-[#0b1220]"
              >
                <Apple className="size-[18px]" />
                {busyProvider === "apple" ? "Connecting..." : "Continue with Apple"}
              </Button>
            </div>

            <div className={`my-4 h-px ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`} />

            <Button
              onClick={enableBypass}
              variant="outline"
              className={`w-full h-10 rounded-[14px] ${
                theme === "dark"
                  ? "border-white/20 bg-white/[0.06] text-white/85 hover:bg-white/[0.1]"
                  : "border-gray-300 bg-white/50 text-gray-700 hover:bg-white"
              }`}
            >
              Bypass Login (Testing)
            </Button>

            {bypassEnabled && (
              <button
                onClick={disableBypass}
                className={`mt-3 w-full text-[13px] tracking-[0.04em] transition-colors ${
                  theme === "dark" ? "text-white/60 hover:text-white/85" : "text-[#4A647A] hover:text-[#142032]"
                }`}
              >
                Disable bypass mode
              </button>
            )}
          </div>

          <div className={`mt-4 rounded-[18px] p-4 ${glassSubtleClass}`}>
            {!isSupabaseConfigured ? (
              <p className={`text-[13px] leading-[1.75] ${theme === "dark" ? "text-amber-300/90" : "text-[#7A3E1D]"}`}>
                Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable OAuth login.
              </p>
            ) : (
              <p className={`text-[13px] leading-[1.75] ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
                Your progress and settings stay in sync once you sign in.
              </p>
            )}

            {error && (
              <p className="mt-3 text-[13px] leading-[1.75] text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
