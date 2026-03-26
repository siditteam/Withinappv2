import { useNavigate, useParams, useSearchParams } from "react-router";
import { X, Check } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { soulPractices, universalGuidance } from "../../lib/soul/soulPracticeData";
import { BreathingOrb } from "../session/BreathingOrb";
import { SessionBackground } from "../session/SessionBackground";
import { ReturnTransition } from "../session/ReturnTransition";
import { AmbientAudioControls } from "../session/AmbientAudioControls";
import { glassFloat, btnGlass } from "../../lib/glassStyles";
import { useBackgroundTrack } from "../../lib/useBackgroundTrack";
import { audioEngine, type SessionKey } from "../../services/audioEngine";
import { getSessionAudio } from "../../lib/audioConfig";

/** Practices that have a guided voice track in audioConfig */
const SESSION_KEY_MAP: Record<number, SessionKey> = {
  1: "witness",
  2: "breathing",
  3: "boredom",
};

type SessionPhase = "instruction" | "experience" | "closing";

export default function SoulPracticeSession() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const durationParam = Number(searchParams.get("duration")) || 300;
  const practice = soulPractices.find((p) => p.id === Number(id));

  const [seconds, setSeconds] = useState(durationParam);
  const [isPaused, setIsPaused] = useState(false);
  const [phase, setPhase] = useState<SessionPhase>("instruction");
  const [controlsVisible, setControlsVisible] = useState(true);
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitingRef = useRef(false);

  // Resolve whether this practice has a guided voice + background track
  const sessionKey = practice ? SESSION_KEY_MAP[practice.id] : undefined;
  const durationMinutes = Math.round(durationParam / 60);
  const hasGuidedAudio = Boolean(
    sessionKey && getSessionAudio(sessionKey, durationMinutes),
  );

  // Background-channel controls (used by AmbientAudioControls regardless of path)
  const [bgVolume, setBgVolume] = useState(0.18);
  const [bgMuted, setBgMuted] = useState(false);

  // Fallback ambient track — active only for practices without guided audio
  const ambientAudio = useBackgroundTrack(!hasGuidedAudio && !isPaused && !exiting, { volume: 0.18 });

  // Start audioEngine when session mounts (guided practices only)
  useEffect(() => {
    if (!hasGuidedAudio || !sessionKey) return;
    audioEngine.playSessionAudio(sessionKey, durationMinutes);
    return () => { audioEngine.stopAudio(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep audioEngine in sync with pause / exit state
  useEffect(() => {
    if (!hasGuidedAudio) return;
    if (isPaused || exiting) {
      audioEngine.pauseAudio();
    } else {
      audioEngine.resumeAudio();
    }
  }, [isPaused, exiting, hasGuidedAudio]);

  // Bridge: background volume / mute → correct audio path
  const handleBgVolumeChange = (vol: number) => {
    setBgVolume(vol);
    if (hasGuidedAudio) {
      audioEngine.setBackgroundVolume(vol);
    } else {
      ambientAudio.setVolume(vol);
    }
  };

  const handleBgToggleMuted = () => {
    if (hasGuidedAudio) {
      const next = !bgMuted;
      setBgMuted(next);
      audioEngine.muteBackground(next);
    } else {
      ambientAudio.toggleMuted();
    }
  };

  // Transition from instruction to experience after 8 seconds
  useEffect(() => {
    if (phase !== "instruction") return;
    const t = setTimeout(() => setPhase("experience"), 8000);
    return () => clearTimeout(t);
  }, [phase]);

  const isQuickStartFlow = searchParams.get("quickStart") === "1";
  const completePath = `/soul/${id}/complete?duration=${durationParam}${
    isQuickStartFlow ? "&quickStart=1" : ""
  }`;

  const handleReturnComplete = useCallback(() => {
    navigate(completePath);
  }, [navigate, completePath]);

  const initiateExit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    setIsPaused(true);
    setControlsVisible(false);
  }, []);

  // Transition to closing phase when 10 seconds remain
  useEffect(() => {
    if (phase === "experience" && seconds <= 10 && seconds > 0) {
      setPhase("closing");
    }
  }, [seconds, phase]);

  // Timer
  useEffect(() => {
    if (isPaused || seconds <= 0 || exiting) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => initiateExit(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, seconds, exiting, initiateExit]);

  // Auto-hide controls after 5s of active experience
  useEffect(() => {
    if (exiting) return;
    if (isPaused || phase !== "experience") {
      setControlsVisible(true);
      return;
    }
    setControlsVisible(true);
    const timeout = setTimeout(() => setControlsVisible(false), 5000);
    return () => clearTimeout(timeout);
  }, [isPaused, phase, seconds, exiting]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleScreenTap = () => {
    if (exiting) return;
    if (!controlsVisible && !isPaused && phase === "experience") {
      setControlsVisible(true);
    }
  };

  if (!practice) {
    navigate("/soul");
    return null;
  }

  const isDark = true;

  return (
    <div
      className="fixed inset-0 flex flex-col select-none overflow-hidden"
      onClick={handleScreenTap}
    >
      {/* Ambient background */}
      <SessionBackground color={practice.color} />

      {/* Return transition overlay */}
      <AnimatePresence>
        {exiting && <ReturnTransition onComplete={handleReturnComplete} />}
      </AnimatePresence>

      {/* Close button */}
      <AnimatePresence>
        {controlsVisible && !exiting && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/soul");
            }}
            className="absolute top-8 right-6 z-30 w-9 h-9 rounded-full flex items-center justify-center transition-all bg-white/[0.06] text-white/30 hover:text-white/50"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {controlsVisible && !exiting && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="absolute top-20 right-6 z-30"
          >
            <AmbientAudioControls
              theme="dark"
              isMuted={hasGuidedAudio ? bgMuted : ambientAudio.isMuted}
              onToggleMuted={handleBgToggleMuted}
              volume={hasGuidedAudio ? bgVolume : ambientAudio.volume}
              onVolumeChange={handleBgVolumeChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guidance toggle */}
      <AnimatePresence>
        {controlsVisible && !exiting && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => {
              e.stopPropagation();
              setGuidanceOpen(!guidanceOpen);
            }}
            className="absolute top-8 left-6 z-30 px-3 py-1.5 rounded-full text-[11px] tracking-[0.1em] transition-all bg-white/[0.06] text-white/30 hover:text-white/50"
          >
            {guidanceOpen ? "Close" : "Guide"}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Guidance overlay */}
      <AnimatePresence>
        {guidanceOpen && !exiting && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute top-16 left-6 right-6 z-20"
          >
            <div className={`rounded-[22px] p-5 space-y-3 ${glassFloat("dark")}`}>
              <p className="text-[11px] tracking-[0.15em] uppercase mb-3 text-white/30">
                Reminders
              </p>
              {universalGuidance.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/15">
                    <Check className="w-2.5 h-2.5 text-white/30" />
                  </div>
                  <p className="text-[13px] font-extralight leading-[1.7] flex-1 text-white/50">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main centre content ─── */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-8"
        animate={exiting ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        {/* Practice label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: exiting ? 0.8 : 2, delay: exiting ? 0 : 0.5 }}
          className="text-[11px] tracking-[0.2em] uppercase mb-10 text-white/15"
        >
          {practice.title}
        </motion.p>

        {/* Instruction text */}
        <div className="relative w-full max-w-[320px] mb-8" style={{ minHeight: 60 }}>
          <AnimatePresence mode="wait">
            {(phase === "instruction" || phase === "closing") && !exiting && (
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="text-center text-[19px] font-extralight italic leading-[1.9] tracking-[0.02em] text-white/65"
              >
                &ldquo;{practice.instruction}&rdquo;
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Breathing Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: exiting ? 0 : 1,
            scale: exiting ? 0.7 : 1,
          }}
          transition={{ duration: exiting ? 1.5 : 2, ease: "easeOut" }}
        >
          <BreathingOrb color={practice.color} theme="dark" paused={isPaused || exiting} />
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: exiting ? 0.6 : 1.5, delay: exiting ? 0 : 1 }}
          className="mt-10"
        >
          <span className="text-[15px] font-extralight tracking-[0.15em] text-white/20">
            {formatTime(seconds)}
          </span>
        </motion.div>
      </motion.div>

      {/* ─── Bottom controls ─── */}
      <AnimatePresence>
        {controlsVisible && !exiting && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pb-12 flex items-center justify-center gap-6"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
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