/**
 * BreathingOrb — A multi-layered, slowly breathing visual anchor
 * for meditation sessions. Three concentric gradient layers expand
 * and contract at offset rhythms to produce a living, luminous orb.
 */

import { motion } from "motion/react";

interface BreathingOrbProps {
  /** Hex colour drawn from the practice (e.g. "#3D5A80") */
  color: string;
  theme: "dark" | "light";
  /** Whether the session is paused — orb holds still */
  paused?: boolean;
}

/* ── colour helpers ── */
const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
};

const rgba = (hex: string, a: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

export function BreathingOrb({ color, theme, paused = false }: BreathingOrbProps) {
  const isDark = theme === "dark";

  /* opacity multiplier — light mode keeps things much softer */
  const m = isDark ? 1 : 0.55;

  /* transition shared by all layers — smoothly pauses/resumes */
  const breathTransition = (duration: number, delay: number = 0) => ({
    duration,
    delay,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut" as const,
  });

  return (
    <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
      {/* ── Layer 3: outermost atmospheric wash ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          background: `radial-gradient(circle, ${rgba(color, 0.12 * m)} 0%, ${rgba(color, 0.04 * m)} 50%, transparent 72%)`,
          filter: "blur(30px)",
        }}
        animate={
          paused
            ? { scale: 1, opacity: 0.6 * m }
            : { scale: [1, 1.18, 1], opacity: [0.5 * m, 0.8 * m, 0.5 * m] }
        }
        transition={breathTransition(8, 0.4)}
      />

      {/* ── Layer 2: mid halo ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 140,
          height: 140,
          background: `radial-gradient(circle, ${rgba(color, 0.22 * m)} 0%, ${rgba(color, 0.08 * m)} 55%, transparent 75%)`,
          filter: "blur(16px)",
        }}
        animate={
          paused
            ? { scale: 1, opacity: 0.7 * m }
            : { scale: [1, 1.14, 1], opacity: [0.6 * m, 1 * m, 0.6 * m] }
        }
        transition={breathTransition(6)}
      />

      {/* ── Layer 1: bright inner core ── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 44,
          height: 44,
          background: `radial-gradient(circle, ${rgba(color, 0.45 * m)} 0%, ${rgba(color, 0.18 * m)} 60%, transparent 85%)`,
          filter: "blur(4px)",
        }}
        animate={
          paused
            ? { scale: 1, opacity: 0.8 * m }
            : { scale: [1, 1.2, 1], opacity: [0.7 * m, 1 * m, 0.7 * m] }
        }
        transition={breathTransition(6)}
      />

      {/* ── Luminous centre dot ── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8,
          height: 8,
          background: isDark ? rgba(color, 0.6) : rgba(color, 0.35),
          boxShadow: `0 0 20px ${rgba(color, 0.3 * m)}, 0 0 60px ${rgba(color, 0.12 * m)}`,
        }}
        animate={
          paused
            ? { scale: 1 }
            : { scale: [1, 1.3, 1] }
        }
        transition={breathTransition(6)}
      />
    </div>
  );
}
