import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "../../store/ThemeContext";
import { glassCardClass, glassSubtle } from "../../lib/glassStyles";

type FeelingZone = {
  key: string;
  label: string;
  color: string;
  min: number;
  max: number;
  routeCategory: string;
  routePath: string;
};

type FeelingSliderProps = {
  showBackButton?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
  onComplete?: (zone: FeelingZone) => void;
};

const ZONES: FeelingZone[] = [
  {
    key: "overwhelmed",
    label: "Overwhelmed",
    color: "#8B0000",
    min: 0,
    max: 0.15,
    routeCategory: "Energy & Stress Reset",
    routePath: "/silence",
  },
  {
    key: "anxious",
    label: "Anxious",
    color: "#E67E22",
    min: 0.15,
    max: 0.3,
    routeCategory: "Energy & Stress Reset",
    routePath: "/silence",
  },
  {
    key: "uneasy",
    label: "Uneasy",
    color: "#F1C40F",
    min: 0.3,
    max: 0.45,
    routeCategory: "Clarity of Mind",
    routePath: "/inquiry",
  },
  {
    key: "neutral",
    label: "Neutral",
    color: "#BDC3C7",
    min: 0.45,
    max: 0.55,
    routeCategory: "Desire & Direction",
    routePath: "/soul",
  },
  {
    key: "calm",
    label: "Calm",
    color: "#A3D5FF",
    min: 0.55,
    max: 0.7,
    routeCategory: "Living Meditation",
    routePath: "/learn",
  },
  {
    key: "relaxed",
    label: "Relaxed",
    color: "#5BC0BE",
    min: 0.7,
    max: 0.85,
    routeCategory: "Living Meditation",
    routePath: "/learn",
  },
  {
    key: "peaceful",
    label: "Peaceful",
    color: "#C3A6FF",
    min: 0.85,
    max: 1,
    routeCategory: "Beyond the Mind",
    routePath: "/inner-circle",
  },
];

function getZoneByProgress(progress: number): FeelingZone {
  return (
    ZONES.find((zone) => progress >= zone.min && progress < zone.max) ??
    ZONES[ZONES.length - 1]
  );
}

function triggerSelectionHaptic() {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(10);
  }
}

export default function FeelingSlider({
  showBackButton = true,
  cancelLabel,
  onCancel,
  onComplete,
}: FeelingSliderProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [progress, setProgress] = useState(0.55);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  const currentZone = useMemo(() => getZoneByProgress(progress), [progress]);
  const glassCard = glassCardClass(theme);
  const glassSubtleClass = glassSubtle(theme);

  function updateProgress(next: number) {
    const clamped = Math.min(Math.max(next, 0), 1);
    const nextZone = getZoneByProgress(clamped);
    const changed = nextZone.key !== currentZone.key;

    setProgress(clamped);
    setHasInteracted(true);

    if (changed) {
      setIsGlowing(true);
      triggerSelectionHaptic();
      window.setTimeout(() => setIsGlowing(false), 260);
    }
  }

  function onContinue() {
    if (!hasInteracted) {
      return;
    }

    if (onComplete) {
      onComplete(currentZone);
      return;
    }

    navigate(currentZone.routePath, {
      state: {
        feeling: currentZone.label,
        category: currentZone.routeCategory,
      },
    });
  }

  const sliderPercent = Math.round(progress * 100);
  const fillPercent = `${sliderPercent}%`;

  return (
    <div className={`min-h-screen p-6 ${theme === "dark" ? "bg-[#0F1419]" : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"}`}>
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-8 ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[14px]">Back</span>
        </button>
      )}

      <div className={`rounded-[22px] p-6 mb-5 ${glassCard}`}>
        <h1 className={`mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          How are you feeling?
        </h1>
        <p className={`text-[14px] font-extralight tracking-[0.015em] leading-[1.75] mb-5 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Move gently to reflect your current state.
        </p>

        <div className="mb-4">
          <p
            className="text-[24px] font-light tracking-[0.02em] text-center transition-colors duration-200"
            style={{ color: currentZone.color }}
          >
            {currentZone.label}
          </p>
        </div>

        <div className="relative mb-4">
          <div className="h-4 rounded-full overflow-hidden bg-white/10 relative">
            <div className="absolute inset-0 flex">
              <div className="h-full" style={{ backgroundColor: "#8B0000", flex: 1.2 }} />
              <div className="h-full" style={{ backgroundColor: "#E67E22", flex: 1.2 }} />
              <div className="h-full" style={{ backgroundColor: "#F1C40F", flex: 1.2 }} />
              <div className="h-full" style={{ backgroundColor: "#BDC3C7", flex: 1 }} />
              <div className="h-full" style={{ backgroundColor: "#A3D5FF", flex: 1.2 }} />
              <div className="h-full" style={{ backgroundColor: "#5BC0BE", flex: 1.2 }} />
              <div className="h-full" style={{ backgroundColor: "#C3A6FF", flex: 1.2 }} />
            </div>
            <div className="absolute inset-0 bg-white/18" />
            <div
              className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-150"
              style={{
                width: fillPercent,
                backgroundColor: currentZone.color,
                opacity: 0.22,
              }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={sliderPercent}
            onChange={(event) => updateProgress(Number(event.target.value) / 100)}
            aria-label="Feeling slider"
            className="w-full mt-3 accent-[#5B8A72]"
          />

          <div
            className="absolute top-[-6px] h-7 w-7 rounded-full border border-white/45 bg-white/90 transition-all duration-150 pointer-events-none"
            style={{
              left: `calc(${fillPercent} - 14px)`,
              boxShadow: isGlowing
                ? `0 0 0 8px ${currentZone.color}33, 0 0 20px ${currentZone.color}99`
                : `0 0 0 4px ${currentZone.color}22, 0 0 14px ${currentZone.color}66`,
            }}
          />
        </div>

        <div className={`flex justify-between text-[12px] font-light ${theme === "dark" ? "text-white/60" : "text-gray-500"}`}>
          <span>Stress</span>
          <span>Neutral</span>
          <span>Peaceful</span>
        </div>
      </div>

      <div className={`rounded-[18px] p-4 mb-6 ${glassSubtleClass}`}>
        <p className={`text-[13px] font-extralight leading-[1.75] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Suggested path: <span className={theme === "dark" ? "text-white" : "text-gray-900"}>{currentZone.routeCategory}</span>
        </p>
      </div>

      <button
        onClick={onContinue}
        disabled={!hasInteracted}
        className={`w-full min-h-[56px] rounded-full px-6 text-[16px] transition-all ${
          hasInteracted
            ? theme === "dark"
              ? "bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white active:scale-[0.99]"
              : "bg-gradient-to-r from-[#4A5DB8] to-[#5B8A72] text-white active:scale-[0.99]"
            : "bg-gray-400/40 text-white/80 cursor-not-allowed"
        }`}
      >
        {hasInteracted ? `Continue with ${currentZone.routeCategory}` : "Continue"}
      </button>

      {cancelLabel && onCancel && (
        <button
          onClick={onCancel}
          className={`w-full mt-3 text-[14px] tracking-[0.04em] transition-colors ${
            theme === "dark" ? "text-white/60 hover:text-white/85" : "text-[#4A647A] hover:text-[#142032]"
          }`}
        >
          {cancelLabel}
        </button>
      )}
    </div>
  );
}
