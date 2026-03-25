/**
 * ReturnTransition — The calm reverse of WarpTransition.
 * Plays when a meditation session ends, simulating a gentle
 * return from an inner journey back to the normal interface.
 *
 * Flow:
 *   0 – 1.0s   → Stillness pause (nothing visible, user absorbs the moment)
 *   1.0 – 2.3s → Background zooms outward, stars drift away from centre,
 *                 light streaks expand, centre glow fades
 *   2.3s        → onComplete fires (navigation to completion screen)
 *
 * The component is a fixed overlay rendered on top of the session screen.
 * The session screen itself fades its orb/controls while this plays.
 */

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import sessionBg from "../../../assets/Background Images/f115501a0383d22b2637ed75f2f3745c8e696a35.png";

interface ReturnTransitionProps {
  onComplete: () => void;
}

/* ─── Star particle data — fly outward from centre ─── */
function generateStars(count: number) {
  const stars: {
    id: number;
    endX: number;
    endY: number;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
  }[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const radius = 50 + Math.random() * 50;
    const endX = 50 + Math.cos(angle) * radius;
    const endY = 50 + Math.sin(angle) * radius;

    stars.push({
      id: i,
      endX,
      endY,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 0.25,
      duration: 0.9 + Math.random() * 0.4,
      opacity: 0.3 + Math.random() * 0.5,
    });
  }
  return stars;
}

/* ─── Light streak data — expand outward ─── */
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
      angle: (360 / count) * i + (Math.random() - 0.5) * 20,
      width: 0.8 + Math.random() * 1,
      delay: Math.random() * 0.15,
      opacity: 0.1 + Math.random() * 0.12,
    });
  }
  return streaks;
}

export function ReturnTransition({ onComplete }: ReturnTransitionProps) {
  const stars = useMemo(() => generateStars(24), []);
  const streaks = useMemo(() => generateStreaks(6), []);
  const [animating, setAnimating] = useState(false);

  // Phase 1: 1 second of stillness, then start animation
  useEffect(() => {
    const stillnessTimer = setTimeout(() => setAnimating(true), 1000);
    return () => clearTimeout(stillnessTimer);
  }, []);

  // Phase 2: after animation completes, fire onComplete
  useEffect(() => {
    if (!animating) return;
    const completeTimer = setTimeout(onComplete, 1350);
    return () => clearTimeout(completeTimer);
  }, [animating, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Background image — zooms outward gently ── */}
      {animating && (
        <motion.img
          src={sessionBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* ── Centre glow — fades and dissipates ── */}
      {animating && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 200,
            height: 200,
            background:
              "radial-gradient(circle, rgba(140,180,255,0.2) 0%, rgba(80,120,200,0.06) 45%, transparent 70%)",
            filter: "blur(35px)",
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        />
      )}

      {/* ── Light streaks expanding outward ── */}
      {animating &&
        streaks.map((s) => (
          <motion.div
            key={`rstreak-${s.id}`}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: s.width,
              height: "50%",
              background: `linear-gradient(to bottom, transparent 0%, rgba(180,210,255,${s.opacity}) 35%, rgba(255,255,255,${s.opacity * 1.3}) 50%, rgba(180,210,255,${s.opacity}) 65%, transparent 100%)`,
              transformOrigin: "center top",
              filter: "blur(1.5px)",
            }}
            initial={{
              rotate: s.angle,
              x: "-50%",
              y: "-50%",
              scaleY: 0.2,
              opacity: 0,
            }}
            animate={{
              scaleY: 2,
              opacity: [0, s.opacity * 1.5, 0],
            }}
            transition={{
              duration: 1.1,
              delay: s.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

      {/* ── Star particles drifting outward from centre ── */}
      {animating &&
        stars.map((star) => (
          <motion.div
            key={`rstar-${star.id}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: star.size,
              height: star.size,
              background: `rgba(200,220,255,${star.opacity})`,
              boxShadow: `0 0 ${star.size * 2.5}px rgba(160,200,255,${star.opacity * 0.4})`,
            }}
            initial={{
              left: "50%",
              top: "50%",
              scale: 1,
              opacity: star.opacity,
            }}
            animate={{
              left: `${star.endX}%`,
              top: `${star.endY}%`,
              scale: [1, 0.8, 0],
              opacity: [star.opacity, star.opacity * 0.6, 0],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay + 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}

      {/* ── Soft fade-to-transparent at the very end ── */}
      {animating && (
        <motion.div
          className="absolute inset-0"
          style={{ background: "rgba(15,20,25,0.01)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.3, delay: 0.2, ease: "easeIn" }}
        />
      )}
    </motion.div>
  );
}