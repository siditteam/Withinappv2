import { useNavigate, useSearchParams } from "react-router";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../../contexts/ThemeContext";
import { formatSilenceTime } from "./silenceStorage";
import { PillTimer } from "./PillTimer";
import { glassCardClass, ctaBtnShadowClass, glowIconShadow } from "../../utils/glassStyles";

export default function SilenceComplete() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();

  const sessionSeconds = Number(searchParams.get("session")) || 0;
  const totalSeconds = Number(searchParams.get("total")) || 0;

  const glassCard = glassCardClass(theme);

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full flex flex-col items-center text-center"
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
              background:
                "radial-gradient(circle, rgba(91,138,114,0.4) 0%, rgba(74,93,184,0.2) 40%, transparent 65%)",
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
          Silence Complete
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`text-[14px] font-extralight tracking-[0.03em] mb-10 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          May this stillness stay with you
        </motion.p>

        {/* Session summary card */}
        {sessionSeconds > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-6 w-full"
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
                className={`text-[12px] tracking-[0.12em] uppercase mb-2 ${
                  theme === "dark" ? "text-white/30" : "text-gray-400"
                }`}
              >
                This Session
              </p>
              <p
                className={`text-[20px] font-light ${
                  theme === "dark" ? "text-white/90" : "text-gray-800"
                }`}
              >
                {formatSilenceTime(sessionSeconds)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Cumulative total pill */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2"
        >
          <PillTimer
            label={formatSilenceTime(totalSeconds)}
            theme={theme}
            breathing={false}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`text-[12px] tracking-[0.15em] uppercase mb-8 ${
            theme === "dark" ? "text-white/30" : "text-gray-400"
          }`}
        >
          Total Silence Time
        </motion.p>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8 w-full"
        >
          <div
            className="absolute -inset-4 -z-10 pointer-events-none rounded-[24px]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(91,138,114,0.12) 0%, transparent 65%)",
              filter: "blur(35px)",
            }}
          />
          <div className={`rounded-[22px] p-5 ${glassCard}`}>
            <p
              className={`text-[17px] font-extralight italic leading-[1.85] tracking-[0.02em] ${
                theme === "dark" ? "text-white/70" : "text-gray-600"
              }`}
            >
              "Silence is not the absence of something but the presence of
              everything."
            </p>
          </div>
        </motion.div>

        {/* Return button */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
            onClick={() => navigate("/")}
            className={`w-full bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white py-4 px-8 rounded-full font-light text-[16px] transition-all active:scale-[0.98] ${ctaBtnShadowClass} border border-[rgba(255,255,255,0.15)]`}
          >
            Return Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}