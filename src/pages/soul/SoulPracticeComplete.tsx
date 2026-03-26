import { useNavigate, useParams, useSearchParams } from "react-router";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTheme } from "../../store/ThemeContext";
import { soulPractices } from "../../lib/soul/soulPracticeData";
import { incrementSoulCompleted, getEasySoulDuration, markPracticeCompleted } from "../../lib/soul/soulProgressStorage";
import { glassCardClass, ctaBtnShadowClass, glowIconShadow } from "../../lib/glassStyles";

export default function SoulPracticeComplete() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { theme, practiceMode } = useTheme();
  const [showSilenceSuggestion, setShowSilenceSuggestion] = useState(false);

  const practice = soulPractices.find((p) => p.id === Number(id));

  const isQuickStartFlow = searchParams.get("quickStart") === "1";
  const modifyModeDuration = Number(searchParams.get("duration")) || 300;

  // Increment completed count on mount (once per completion)
  useEffect(() => {
    incrementSoulCompleted();
    if (practice) markPracticeCompleted(practice.id);
    if (practiceMode === "easy") {
      const { atCap } = getEasySoulDuration();
      if (atCap) {
        setShowSilenceSuggestion(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!practice || !isQuickStartFlow) return;

    const nextId = practice.id + 1;
    const lastPracticeId = soulPractices[soulPractices.length - 1]?.id ?? practice.id;
    if (nextId > lastPracticeId) return;

    const duration =
      practiceMode === "easy" ? getEasySoulDuration().seconds : modifyModeDuration;

    const timer = setTimeout(() => {
      navigate(`/soul/${nextId}/session?duration=${duration}&quickStart=1`);
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate, practice, practiceMode, isQuickStartFlow, modifyModeDuration]);

  if (!practice) {
    navigate("/soul");
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full text-center"
      >
        {/* Success icon with glow halo */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${practice.color}45 0%, ${practice.color}20 40%, transparent 65%)`,
              filter: "blur(35px)",
              transform: "scale(2.5)",
            }}
          />
          <div className={`w-20 h-20 bg-gradient-to-br from-[#3D5A80] to-[#5B8A72] rounded-full flex items-center justify-center mx-auto ${glowIconShadow()}`}>
            <Check className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`mb-3 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {practice.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`text-[14px] font-extralight tracking-[0.03em] mb-10 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Practice Complete
        </motion.p>

        {/* Instruction repeated */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute -inset-4 -z-10 pointer-events-none rounded-[24px]"
            style={{
              background: `radial-gradient(ellipse at center, ${practice.color}22 0%, transparent 65%)`,
              filter: "blur(35px)",
            }}
          />
          <div
            className={`rounded-[22px] p-6 ${glassCardClass(theme)}`}
          >
            <p
              className={`text-[17px] font-extralight italic leading-[1.85] tracking-[0.02em] ${
                theme === "dark" ? "text-white/80" : "text-gray-700"
              }`}
            >
              "{practice.instruction}"
            </p>
          </div>
        </motion.div>

        {/* Silence suggestion when at 30 min cap */}
        {showSilenceSuggestion && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-6"
          >
            <div
              className="absolute -inset-3 -z-10 pointer-events-none rounded-[24px]"
              style={{
                background: "radial-gradient(ellipse at center, rgba(91,138,114,0.18) 0%, transparent 65%)",
                filter: "blur(30px)",
              }}
            />
            <div
              className={`rounded-[22px] p-5 ${
                theme === "dark"
                  ? "bg-[#5B8A72]/[0.08] border border-[#5B8A72]/20"
                  : "bg-[#5B8A72]/[0.06] border border-[#5B8A72]/15"
              }`}
            >
              <p
                className={`text-[14px] font-extralight leading-[1.8] tracking-[0.015em] mb-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                You've reached 30 minutes — the fullness of guided practice. The real journey now is sitting with yourself in Silence. No guidance, no timer, just you learning the luxury of your own presence.
              </p>
              <button
                onClick={() => navigate("/silence")}
                className={`text-[14px] font-light transition-colors ${
                  theme === "dark" ? "text-[#5B8A72] hover:text-[#7BB09A]" : "text-[#3D5A80] hover:text-[#5B8A72]"
                }`}
              >
                Enter Silence &rarr;
              </button>
            </div>
          </motion.div>
        )}

        {/* Return button */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
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
            onClick={() => navigate("/soul")}
            className={`w-full bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white py-4 px-8 rounded-full font-light text-[16px] transition-all active:scale-[0.98] ${ctaBtnShadowClass} border border-[rgba(255,255,255,0.15)]`}
          >
            Return to Practices
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}