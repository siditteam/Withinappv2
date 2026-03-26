/**
 * SessionBackground — Full-bleed nebula image with slow-drifting
 * translucent overlays that give the background a subtle living feel.
 * Always dark-toned; session UIs should use light text on top.
 */

import { motion } from "motion/react";
import sessionBg from "../../assets/Background Images/f115501a0383d22b2637ed75f2f3745c8e696a35.png";

interface SessionBackgroundProps {
  /** Practice accent colour — tints the overlay gently */
  color?: string;
}

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

export function SessionBackground({ color = "#7A6F9B" }: SessionBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Base image — covers entire viewport */}
      <img
        src={sessionBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Soft darkening vignette at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(20,10,30,0.35) 100%)",
        }}
      />

      {/* Practice-tinted slow-drift overlay */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          top: "30%",
          left: "50%",
          x: "-50%",
          background: `radial-gradient(circle, ${rgba(color, 0.08)} 0%, ${rgba(color, 0.03)} 45%, transparent 70%)`,
          filter: "blur(60px)",
        }}
        animate={{
          y: ["-8%", "6%", "-8%"],
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary warm shimmer — drifts gently */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{
          bottom: "20%",
          left: "35%",
          background: `radial-gradient(circle, rgba(200,180,210,0.06) 0%, transparent 65%)`,
          filter: "blur(50px)",
        }}
        animate={{
          x: ["-6%", "6%", "-6%"],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}