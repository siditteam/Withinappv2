/**
 * WarpTransition — A cinematic fullscreen overlay that plays when
 * the user presses "Begin". Simulates traveling through a tunnel of
 * light into a deeper state of awareness.
 *
 * - Blue radial gradient image zooms inward
 * - ~28 star particles converge toward the centre
 * - 8 light streaks radiate inward
 * - After ~1.35s the onComplete callback fires (navigation)
 */

import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import sessionBg from "../../assets/Background Images/f115501a0383d22b2637ed75f2f3745c8e696a35.png";

interface WarpTransitionProps {
  /** Called after the warp animation finishes */
  onComplete: () => void;
}

/* ─── Star particle data (pre-generated for consistency) ─── */
function generateStars(count: number) {
  const stars: {
    id: number;
    startX: number;
    startY: number;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
  }[] = [];

  for (let i = 0; i < count; i++) {
    // Random angle from centre
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    // Start far from centre
    const radius = 55 + Math.random() * 45; // 55-100% from centre
    const startX = 50 + Math.cos(angle) * radius;
    const startY = 50 + Math.sin(angle) * radius;

    stars.push({
      id: i,
      startX,
      startY,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 0.15,
      duration: 0.8 + Math.random() * 0.5,
      opacity: 0.4 + Math.random() * 0.6,
    });
  }
  return stars;
}

/* ─── Light streak data ─── */
function generateStreaks(count: number) {
  const streaks: {
    id: number;
    angle: number;
    width: number;
    delay: number;
    opacity: number;
  }[] = [];

  for (let i = 0; i < count; i++) {
    streaks.push({
      id: i,
      angle: (360 / count) * i + (Math.random() - 0.5) * 15,
      width: 1 + Math.random() * 1.5,
      delay: Math.random() * 0.1,
      opacity: 0.15 + Math.random() * 0.2,
    });
  }
  return streaks;
}

export function WarpTransition({ onComplete }: WarpTransitionProps) {
  const stars = useMemo(() => generateStars(28), []);
  const streaks = useMemo(() => generateStreaks(8), []);

  // Fire the completion callback
  useEffect(() => {
    const timer = setTimeout(onComplete, 1350);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* ── Deep blue tunnel background — zooms in ── */}
      <motion.img
        src={sessionBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        initial={{ scale: 1.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Centre glow that intensifies ── */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, rgba(140,180,255,0.25) 0%, rgba(60,100,200,0.08) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1.8, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* ── Light streaks converging to centre ── */}
      {streaks.map((s) => (
        <motion.div
          key={`streak-${s.id}`}
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            width: s.width,
            height: "60%",
            background: `linear-gradient(to bottom, transparent 0%, rgba(180,210,255,${s.opacity}) 40%, rgba(255,255,255,${s.opacity * 1.5}) 50%, rgba(180,210,255,${s.opacity}) 60%, transparent 100%)`,
            transformOrigin: "center top",
            filter: "blur(1px)",
          }}
          initial={{
            rotate: s.angle,
            x: "-50%",
            y: "-50%",
            scaleY: 2,
            opacity: 0,
          }}
          animate={{
            scaleY: 0.3,
            opacity: [0, s.opacity * 2, 0],
          }}
          transition={{
            duration: 1.1,
            delay: s.delay + 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      {/* ── Star particles flying inward ── */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: star.size,
            height: star.size,
            background: `rgba(200,220,255,${star.opacity})`,
            boxShadow: `0 0 ${star.size * 3}px rgba(160,200,255,${star.opacity * 0.5})`,
          }}
          initial={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            scale: 0.5,
            opacity: 0,
          }}
          animate={{
            left: "50%",
            top: "50%",
            scale: [0.5, 1.5, 0],
            opacity: [0, star.opacity, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay + 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      {/* ── Final centre flash ── */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 120,
          height: 120,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(160,200,255,0.1) 50%, transparent 70%)",
          filter: "blur(20px)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2.5, 4], opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.3, delay: 0.3, ease: "easeOut" }}
      />
    </motion.div>
  );
}