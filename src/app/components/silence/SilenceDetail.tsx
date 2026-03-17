import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  getSilenceTotal,
  recoverInterruptedSession,
  formatSilenceTime,
} from "./silenceStorage";
import { PillTimer } from "./PillTimer";
import { WarpTransition } from "../session/WarpTransition";
import { glassCardClass, ctaBtnShadowClass } from "../../utils/glassStyles";

export default function SilenceDetail() {
  const navigate = useNavigate();
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  // On mount: recover any interrupted session, then read total
  useEffect(() => {
    recoverInterruptedSession();
    setTotalSeconds(getSilenceTotal());
  }, []);

  const glassCard = glassCardClass(theme);

  const handleEnter = () => {
    if (!transitioning) setTransitioning(true);
  };

  const handleWarpComplete = useCallback(() => {
    navigate("/silence/session");
  }, [navigate]);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        hasBackground
          ? "bg-transparent"
          : theme === "dark"
          ? "bg-[#0F1419]"
          : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
      }`}
    >
      {/* Warp transition overlay */}
      <AnimatePresence>
        {transitioning && <WarpTransition onComplete={handleWarpComplete} />}
      </AnimatePresence>

      {/* Header — slides left on transition */}
      <motion.div
        animate={transitioning ? { x: "-100%", opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-10 backdrop-blur-[20px] border-b ${
          theme === "dark"
            ? "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.1)]"
            : "bg-[rgba(255,255,255,0.6)] border-[rgba(255,255,255,0.3)]"
        }`}
      >
        <div className="p-4">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Content — slides left on transition */}
      <motion.div
        animate={transitioning ? { x: "-100%", opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col items-center justify-center p-6"
      >
        <div className="max-w-md w-full flex flex-col items-center">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mb-10 text-center"
          >
            <div
              className="absolute -inset-6 -z-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(91,138,114,0.25) 0%, rgba(74,93,184,0.1) 45%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <h1
              className={`mb-3 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Silence
            </h1>
            <p
              className={`text-[14px] font-extralight tracking-[0.02em] ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              A quiet witness to your stillness
            </p>
          </motion.div>

          {/* Cumulative timer display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4"
          >
            <PillTimer
              label={formatSilenceTime(totalSeconds)}
              theme={theme}
              breathing={false}
            />
          </motion.div>

          {/* Label under pill */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`text-[12px] tracking-[0.15em] uppercase mb-10 ${
              theme === "dark" ? "text-white/30" : "text-gray-400"
            }`}
          >
            Total Silence Time
          </motion.p>

          {/* Description card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mb-8 w-full"
          >
            <div
              className="absolute -inset-3 -z-10 pointer-events-none rounded-[24px]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(91,138,114,0.15) 0%, transparent 65%)",
                filter: "blur(30px)",
              }}
            />
            <div className={`rounded-[22px] p-5 ${glassCard}`}>
              <p
                className={`text-[15px] leading-[1.8] font-light text-center tracking-[0.015em] ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                No instructions, no guidance — just you and stillness. Your time
                here is remembered.
              </p>
            </div>
          </motion.div>

          {/* Enter Silence button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative w-full"
          >
            <div
              className="absolute -inset-2 -z-10 pointer-events-none rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(91,138,114,0.25) 0%, transparent 70%)",
                filter: "blur(15px)",
              }}
            />
            <button
              onClick={handleEnter}
              className={`w-full py-4 px-8 rounded-full font-light text-[16px] transition-all active:scale-[0.98] ${ctaBtnShadowClass} text-white bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] border border-[rgba(255,255,255,0.15)]`}
            >
              Enter Silence
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
