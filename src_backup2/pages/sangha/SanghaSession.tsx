import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { X, Pause, Play } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { btnGlass } from "../../utils/glassStyles";

function useSimulatedCount(base: number) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const iv = setInterval(() => {
      setCount((c) => {
        const d = Math.floor(Math.random() * 5) - 2;
        return Math.max(1, c + d);
      });
    }, 4000);
    return () => clearInterval(iv);
  }, []);
  return count;
}

export default function SanghaSession() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const group = (location.state as any)?.group;

  const globalCount = useSimulatedCount(group ? group.activeSitters + 1 : 12_348);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!paused) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleEnd = useCallback(() => {
    navigate("/sangha");
  }, [navigate]);

  const btn = btnGlass(theme);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(ellipse at 50% 40%, rgba(91,138,114,0.15) 0%, rgba(26,32,44,1) 60%)"
              : "radial-gradient(ellipse at 50% 40%, rgba(91,138,114,0.12) 0%, rgba(235,240,245,1) 60%)",
        }}
      />

      {/* Close button */}
      <button
        onClick={handleEnd}
        className={`absolute top-12 right-6 w-10 h-10 rounded-full flex items-center justify-center z-10 ${btn}`}
      >
        <X className={`w-5 h-5 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`} />
      </button>

      {/* Group name if any */}
      {group && (
        <p
          className={`absolute top-14 left-6 text-[13px] font-light tracking-[0.04em] ${
            theme === "dark" ? "text-white/40" : "text-gray-500"
          }`}
        >
          {group.name}
        </p>
      )}

      {/* Central breathing orb with live count */}
      <div className="flex flex-col items-center">
        {/* Orb */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-8">
          {/* Outer pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(circle, rgba(91,138,114,0.12) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(91,138,114,0.08) 0%, transparent 70%)",
              animationDuration: "4s",
            }}
          />
          {/* Inner orb */}
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(circle at 40% 35%, rgba(91,138,114,0.25) 0%, rgba(61,90,128,0.15) 50%, transparent 80%)"
                  : "radial-gradient(circle at 40% 35%, rgba(91,138,114,0.18) 0%, rgba(74,93,184,0.1) 50%, transparent 80%)",
              boxShadow:
                theme === "dark"
                  ? "0 0 60px rgba(91,138,114,0.15), 0 0 120px rgba(61,90,128,0.08)"
                  : "0 0 60px rgba(91,138,114,0.1), 0 0 120px rgba(74,93,184,0.05)",
              animation: "sanghaBreath 8s ease-in-out infinite",
            }}
          >
            <div className="text-center">
              {/* Green live dot */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                </span>
              </div>
              <p
                className={`text-[32px] font-extralight tracking-tight leading-none ${
                  theme === "dark" ? "text-white/90" : "text-gray-800"
                }`}
              >
                {globalCount.toLocaleString()}
              </p>
              <p
                className={`text-[11px] font-extralight tracking-[0.06em] mt-1 ${
                  theme === "dark" ? "text-white/35" : "text-gray-400"
                }`}
              >
                sitting together
              </p>
            </div>
          </div>
        </div>

        {/* Timer */}
        <p
          className={`text-[36px] font-extralight tracking-wider mb-2 ${
            theme === "dark" ? "text-white/70" : "text-gray-600"
          }`}
        >
          {formatTime(elapsed)}
        </p>
        <p
          className={`text-[13px] font-extralight tracking-[0.05em] mb-10 ${
            theme === "dark" ? "text-white/30" : "text-gray-400"
          }`}
        >
          {paused ? "paused" : "in silence"}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPaused((p) => !p)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90 ${btn}`}
          >
            {paused ? (
              <Play className={`w-6 h-6 ml-0.5 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`} />
            ) : (
              <Pause className={`w-6 h-6 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`} />
            )}
          </button>
          <button
            onClick={handleEnd}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] transition-transform active:scale-90 shadow-[0_0_20px_rgba(91,138,114,0.25)]"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes sanghaBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
