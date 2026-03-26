import { useNavigate } from "react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getSilenceTotal,
  setSilenceTotal,
  markSessionStart,
  clearSessionStart,
  formatSilenceTime,
} from "../../lib/silence/silenceStorage";
import { BreathingOrb } from "../session/BreathingOrb";
import { SessionBackground } from "../session/SessionBackground";
import { ReturnTransition } from "../session/ReturnTransition";
import { btnGlass } from "../../lib/glassStyles";

/* Silence uses a calm teal-blue blend */
const SILENCE_COLOR = "#4A7A8A";

export default function SilenceSession() {
  const navigate = useNavigate();

  const baseTotal = useRef(getSilenceTotal());
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [exiting, setExiting] = useState(false);
  const exitingRef = useRef(false);

  // Mark session start in localStorage for crash recovery
  useEffect(() => {
    markSessionStart();
    return () => {
      const currentElapsed = elapsedRef.current;
      if (currentElapsed > 0) {
        setSilenceTotal(baseTotal.current + currentElapsed);
        clearSessionStart();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const elapsedRef = useRef(elapsed);
  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  // Timer tick
  useEffect(() => {
    if (isPaused || exiting) return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, exiting]);

  // Persist total every 5 seconds
  useEffect(() => {
    if (elapsed > 0 && elapsed % 5 === 0 && !isPaused) {
      setSilenceTotal(baseTotal.current + elapsed);
    }
  }, [elapsed, isPaused]);

  // Fade controls after 4 seconds of active session
  useEffect(() => {
    if (exiting) return;
    if (isPaused) {
      setShowControls(true);
      return;
    }
    setShowControls(true);
    const timeout = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timeout);
  }, [isPaused, elapsed, exiting]);

  const initiateExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    // Persist final total before transition
    const finalTotal = baseTotal.current + elapsedRef.current;
    setSilenceTotal(finalTotal);
    clearSessionStart();
    setExiting(true);
    setIsPaused(true);
    setShowControls(false);
  }, []);

  const handleReturnComplete = useCallback(() => {
    const finalTotal = baseTotal.current + elapsedRef.current;
    navigate(`/silence/complete?session=${elapsedRef.current}&total=${finalTotal}`);
  }, [navigate]);

  const handlePause = useCallback(() => {
    setIsPaused((p) => !p);
    setShowControls(true);
  }, []);

  const handleTap = () => {
    if (exiting) return;
    if (!showControls && !isPaused) {
      setShowControls(true);
    }
  };

  const currentTotal = baseTotal.current + elapsed;

  return (
    <div
      className="fixed inset-0 flex flex-col select-none overflow-hidden"
      onClick={handleTap}
    >
      {/* Ambient background */}
      <SessionBackground color={SILENCE_COLOR} />

      {/* Return transition overlay */}
      <AnimatePresence>
        {exiting && <ReturnTransition onComplete={handleReturnComplete} />}
      </AnimatePresence>

      {/* "Silence" label — barely visible */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 0.6 : 2.5 }}
        className="absolute top-8 left-6 z-10 text-[11px] tracking-[0.2em] uppercase text-white/10"
      >
        Silence
      </motion.p>

      {/* ─── Main centre content ─── */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-8"
        animate={exiting ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        {/* Lifetime total — quiet above the orb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: exiting ? 0.6 : 1.5, delay: exiting ? 0 : 0.5 }}
          className="mb-10"
        >
          <span className="text-[13px] font-extralight tracking-[0.15em] text-white/20">
            {formatSilenceTime(currentTotal)}
          </span>
        </motion.div>

        {/* Breathing Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: exiting ? 0 : 1,
            scale: exiting ? 0.7 : 1,
          }}
          transition={{ duration: exiting ? 1.5 : 2.5, ease: "easeOut" }}
        >
          <BreathingOrb color={SILENCE_COLOR} theme="dark" paused={isPaused || exiting} />
        </motion.div>

        {/* Session elapsed — beneath orb */}
        <AnimatePresence>
          {showControls && !exiting && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-10 text-[12px] tracking-[0.1em] text-white/20"
            >
              {elapsed > 0
                ? `this session: ${formatSilenceTime(elapsed)}`
                : "session started"}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Bottom controls ─── */}
      <AnimatePresence>
        {showControls && !exiting && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
            className="pb-12 flex items-center justify-center gap-6"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePause();
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${btnGlass("dark")} text-white/50`}
            >
              {isPaused ? (
                <div className="w-0 h-0 border-l-[9px] border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5 border-l-white/60" />
              ) : (
                <div className="flex gap-[3px]">
                  <div className="w-[2.5px] h-3.5 rounded-full bg-white/50" />
                  <div className="w-[2.5px] h-3.5 rounded-full bg-white/50" />
                </div>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                initiateExit();
              }}
              className="px-6 py-2.5 rounded-full text-[13px] font-extralight tracking-[0.05em] transition-all active:scale-95 text-white/30 hover:text-white/50"
            >
              End
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}