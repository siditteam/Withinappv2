import { useState } from "react";
import { ArrowLeft, Moon, Sun, Check, Zap, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import { backgroundImages } from "../backgroundImages";
import { getEasySoulDuration, getSoulCompletedCount } from "./soul/soulProgressStorage";
import { glassCardClass, glassSubtle } from "../utils/glassStyles";

const backgroundOptions = [
  { id: "none" as const, label: "Basic" },
  { id: "star-trails" as const, label: "Star Trails" },
  { id: "starry-rain" as const, label: "Starry Rain" },
  { id: "blue-nebula" as const, label: "Blue Nebula" },
  { id: "light-rays" as const, label: "Light Rays" },
];

export default function Settings() {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const bypassEnabled = localStorage.getItem("within-auth-bypass") === "1";
  const { theme, toggleTheme, backgroundTheme, setBackgroundTheme, practiceMode, setPracticeMode } = useTheme();

  const glassCard = glassCardClass(theme);
  const glassSubtleClass = glassSubtle(theme);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-transparent" : backgroundTheme !== "none" ? "bg-transparent" : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 backdrop-blur-[20px] border-b ${theme === "dark" ? "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.1)]" : "bg-[rgba(255,255,255,0.6)] border-[rgba(255,255,255,0.3)]"}`}>
        <div className="p-4">
          <button
            onClick={() => navigate("/profile")}
            className={`flex items-center gap-2 transition-colors ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"}`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[14px]">Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h1 className={`mb-10 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Settings
        </h1>

        {/* Appearance Section */}
        <div className="mb-6 relative">
          <div
            className="absolute -inset-4 -z-10 pointer-events-none"
            style={{
              background: theme === "dark"
                ? "radial-gradient(ellipse at center, rgba(91,138,114,0.15) 0%, transparent 65%)"
                : "radial-gradient(ellipse at center, rgba(91,138,114,0.06) 0%, transparent 65%)",
              filter: "blur(45px)",
            }}
          />
          <h2 className={`mb-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Appearance
          </h2>
          
          <div className={`rounded-[22px] p-4 ${glassCard}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-[#5B8A72]" />
                ) : (
                  <Sun className="w-5 h-5 text-[#EA9836]" />
                )}
                <div>
                  <h3 className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Theme
                  </h3>
                  <p className={`text-[14px] font-extralight tracking-[0.015em] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {theme === "dark" ? "Dark mode" : "Light mode"}
                  </p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === "dark" ? "bg-[#5B8A72]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${
                    theme === "dark" ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Background Theme Section */}
        <div className="mb-6 relative">
          <div
            className="absolute -inset-4 -z-10 pointer-events-none"
            style={{
              background: theme === "dark"
                ? "radial-gradient(ellipse at center, rgba(122,111,155,0.15) 0%, rgba(74,93,184,0.08) 40%, transparent 65%)"
                : "radial-gradient(ellipse at center, rgba(122,111,155,0.06) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />
          <h2 className={`mb-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Background
          </h2>
          <p className={`text-[14px] font-extralight tracking-[0.015em] mb-5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Choose a background for your experience
          </p>

          <div className="grid grid-cols-3 gap-3">
            {backgroundOptions.map((bg) => {
              const isSelected = backgroundTheme === bg.id;
              const isBasic = bg.id === "none";

              return (
                <button
                  key={bg.id}
                  onClick={() => setBackgroundTheme(bg.id)}
                  className={`relative rounded-[18px] overflow-hidden aspect-[3/4] border-2 transition-all ${
                    isSelected
                      ? "border-[#5B8A72] shadow-[0_0_12px_rgba(91,138,114,0.4)] scale-[1.02]"
                      : theme === "dark"
                        ? "border-white/10 hover:border-white/30"
                        : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {isBasic ? (
                    <div
                      className={`absolute inset-0 flex items-center justify-center ${
                        theme === "dark"
                          ? "bg-gradient-to-b from-[#1A1F2E] to-[#0F1419]"
                          : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 ${theme === "dark" ? "border-white/20" : "border-gray-300"}`} />
                    </div>
                  ) : (
                    <img
                      src={backgroundImages[bg.id]}
                      alt={bg.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className={`absolute inset-0 ${isBasic ? "" : "bg-gradient-to-t from-black/70 via-transparent to-transparent"}`} />
                  <span className={`absolute bottom-2 left-0 right-0 text-center text-[12px] ${
                    isBasic
                      ? theme === "dark" ? "text-white/70" : "text-gray-500"
                      : "text-white/90"
                  }`}>
                    {bg.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#5B8A72] flex items-center justify-center shadow-[0_0_10px_rgba(91,138,114,0.4)]">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className={`rounded-[22px] p-4 ${glassSubtleClass}`}>
          <p className={`text-[14px] font-extralight leading-[1.75] tracking-[0.015em] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Background themes work in both light and dark mode. Choose "Basic" for a clean solid look, or pick an image that supports your contemplative practice.
          </p>
        </div>

        {/* Practice Mode Section */}
        <div className="mt-8 mb-6 relative">
          <div
            className="absolute -inset-4 -z-10 pointer-events-none"
            style={{
              background: theme === "dark"
                ? "radial-gradient(ellipse at center, rgba(74,93,184,0.15) 0%, rgba(122,111,155,0.08) 40%, transparent 65%)"
                : "radial-gradient(ellipse at center, rgba(74,93,184,0.06) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />
          <h2 className={`mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Practice Mode
          </h2>
          <p className={`text-[14px] font-extralight tracking-[0.015em] mb-5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Choose how you'd like to approach your sessions
          </p>

          <div className="flex gap-3">
            {/* Easy */}
            <button
              onClick={() => setPracticeMode("easy")}
              className={`flex-1 rounded-[22px] p-4 transition-all active:scale-[0.98] text-left ${
                practiceMode === "easy"
                  ? "bg-gradient-to-br from-[#3D5A80]/30 to-[#5B8A72]/20 border-2 border-[#5B8A72]/50 shadow-[0_0_20px_rgba(91,138,114,0.2)]"
                  : glassCard
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  practiceMode === "easy"
                    ? "bg-gradient-to-r from-[#3D5A80] to-[#5B8A72]"
                    : theme === "dark" ? "bg-white/[0.06] border border-white/[0.1]" : "bg-white/40 border border-white/50"
                }`}>
                  <Zap className={`w-4 h-4 ${practiceMode === "easy" ? "text-white" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <h3 className={`font-light ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Easy
                </h3>
              </div>
              <p className={`text-[12px] font-light leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Durations are chosen for you. Just begin and let the practice unfold.
              </p>
              {practiceMode === "easy" && (
                <div className="mt-3 flex justify-end">
                  <div className="w-5 h-5 rounded-full bg-[#5B8A72] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </button>

            {/* Modify */}
            <button
              onClick={() => setPracticeMode("modify")}
              className={`flex-1 rounded-[22px] p-4 transition-all active:scale-[0.98] text-left ${
                practiceMode === "modify"
                  ? "bg-gradient-to-br from-[#3D5A80]/30 to-[#5B8A72]/20 border-2 border-[#5B8A72]/50 shadow-[0_0_20px_rgba(91,138,114,0.2)]"
                  : glassCard
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  practiceMode === "modify"
                    ? "bg-gradient-to-r from-[#3D5A80] to-[#5B8A72]"
                    : theme === "dark" ? "bg-white/[0.06] border border-white/[0.1]" : "bg-white/40 border border-white/50"
                }`}>
                  <SlidersHorizontal className={`w-4 h-4 ${practiceMode === "modify" ? "text-white" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <h3 className={`font-light ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Modify
                </h3>
              </div>
              <p className={`text-[12px] font-light leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                Choose your own duration before each session. Full control over timing.
              </p>
              {practiceMode === "modify" && (
                <div className="mt-3 flex justify-end">
                  <div className="w-5 h-5 rounded-full bg-[#5B8A72] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Default durations info (shown in Easy mode) */}
          {practiceMode === "easy" && (
            <div className={`mt-4 rounded-[18px] p-4 ${glassSubtleClass}`}>
              <p className={`text-[12px] tracking-[0.12em] uppercase mb-3 ${theme === "dark" ? "text-white/30" : "text-gray-400"}`}>
                Default Durations
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[14px] font-light ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Inquiry</span>
                  <span className={`text-[14px] font-light ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>3 min</span>
                </div>
                <div className={`h-px ${theme === "dark" ? "bg-white/[0.04]" : "bg-black/[0.04]"}`} />
                <div className="flex items-center justify-between">
                  <span className={`text-[14px] font-light ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Guided Practices</span>
                  <span className={`text-[14px] font-light ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>{getEasySoulDuration().label}</span>
                </div>
                <p className={`text-[12px] font-light leading-relaxed ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  Grows with you: 10 min → 15 → 20 → 25 → 30 min cap. {getSoulCompletedCount()} practice{getSoulCompletedCount() !== 1 ? "s" : ""} completed.
                  {getEasySoulDuration().atCap && " Beyond 30 min, Silence becomes your teacher."}
                </p>
                <div className={`h-px ${theme === "dark" ? "bg-white/[0.04]" : "bg-black/[0.04]"}`} />
                <div className="flex items-center justify-between">
                  <span className={`text-[14px] font-light ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Silence</span>
                  <span className={`text-[14px] font-light ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Open-ended</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="mt-8 mb-6 relative">
          <h2 className={`mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Account
          </h2>
          <p className={`text-[14px] font-extralight tracking-[0.015em] mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {bypassEnabled ? "Bypass mode is active for testing." : "You are signed in with your account."}
          </p>

          <button
            onClick={async () => {
              if (isSigningOut) {
                return;
              }

              setIsSigningOut(true);
              try {
                navigate("/logout", { replace: true });
              } finally {
                setIsSigningOut(false);
              }
            }}
            disabled={isSigningOut}
            className={`w-full rounded-[18px] p-3 text-[14px] transition-colors border ${
              theme === "dark"
                ? "border-white/15 bg-white/8 text-white/85 hover:bg-white/10"
                : "border-gray-300 bg-white/60 text-gray-700 hover:bg-white"
            } ${isSigningOut ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}