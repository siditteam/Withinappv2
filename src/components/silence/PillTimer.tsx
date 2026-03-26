/* ──────────────────────────────────────────
   Pill-shaped timer display (SVG)
   ────────────────────────────────────────── */

// Pill geometry
const PILL_W = 280;
const PILL_H = 80;
const RX = PILL_H / 2; // 40
const STROKE = 5;
const PAD = STROKE + 4;
const VB_W = PILL_W + PAD * 2;
const VB_H = PILL_H + PAD * 2;

// Perimeter for dash animation
const STRAIGHT = 2 * (PILL_W - PILL_H);
const CIRCLE = Math.PI * PILL_H;
const PERIMETER = STRAIGHT + CIRCLE;

interface PillTimerProps {
  /** Human-readable time label displayed inside the pill */
  label: string;
  theme: "dark" | "light";
  /** 0→1 progress ring (omit or set to -1 for no progress) */
  progress?: number;
  /** Subtle breathing glow while session is active */
  breathing?: boolean;
}

export function PillTimer({
  label,
  theme,
  progress = -1,
  breathing = false,
}: PillTimerProps) {
  const showProgress = progress >= 0 && progress <= 1;
  const offset = showProgress ? PERIMETER * (1 - progress) : PERIMETER;

  const trackColor =
    theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const innerBg =
    theme === "dark" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.35)";
  const outerRing =
    theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow behind the pill */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(91,138,114,0.25) 0%, rgba(74,93,184,0.12) 50%, transparent 70%)",
          filter: "blur(40px)",
          transform: "scale(1.6)",
          ...(breathing
            ? {
                animation: "silenceBreath 6s ease-in-out infinite",
              }
            : {}),
        }}
      />

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width={VB_W}
        height={VB_H}
        className="overflow-visible"
      >
        <defs>
          <linearGradient
            id="pill-progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#3D5A80" />
            <stop offset="50%" stopColor="#5B8A72" />
            <stop offset="100%" stopColor="#4A8FA8" />
          </linearGradient>
          <filter
            id="pill-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="4"
              floodColor="rgba(0,0,0,0.25)"
            />
          </filter>
        </defs>

        {/* Outer bezel ring */}
        <rect
          x={PAD - 3}
          y={PAD - 3}
          width={PILL_W + 6}
          height={PILL_H + 6}
          rx={RX + 3}
          ry={RX + 3}
          fill="none"
          stroke={outerRing}
          strokeWidth={2}
        />

        {/* Inner fill */}
        <rect
          x={PAD}
          y={PAD}
          width={PILL_W}
          height={PILL_H}
          rx={RX}
          ry={RX}
          fill={innerBg}
          filter="url(#pill-shadow)"
        />

        {/* Track */}
        <rect
          x={PAD}
          y={PAD}
          width={PILL_W}
          height={PILL_H}
          rx={RX}
          ry={RX}
          fill="none"
          stroke={trackColor}
          strokeWidth={STROKE}
        />

        {/* Progress stroke (visible when progress >= 0) */}
        {showProgress && (
          <rect
            x={PAD}
            y={PAD}
            width={PILL_W}
            height={PILL_H}
            rx={RX}
            ry={RX}
            fill="none"
            stroke="url(#pill-progress-gradient)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={PERIMETER}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s linear",
              filter: "drop-shadow(0 0 6px rgba(91,138,114,0.5))",
            }}
          />
        )}

        {/* Text label */}
        <text
          x={PAD + PILL_W / 2}
          y={PAD + PILL_H / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={theme === "dark" ? "#ffffff" : "#1a1a2e"}
          fontSize="18"
          fontWeight="200"
          fontFamily="'Inter', -apple-system, sans-serif"
          letterSpacing="1.5"
        >
          {label}
        </text>
      </svg>

      {/* Breathing keyframes injected inline */}
      {breathing && (
        <style>{`
          @keyframes silenceBreath {
            0%, 100% { opacity: 0.7; transform: scale(1.5); }
            50%      { opacity: 1;   transform: scale(1.7); }
          }
        `}</style>
      )}
    </div>
  );
}