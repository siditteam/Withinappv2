import { useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowLeft, Check, ChevronLeft } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../contexts/ThemeContext";
import { inquiries, inquiryGuidance } from "../../lib/inquiry/inquiryData";
import { WarpTransition } from "../session/WarpTransition";
import { glassCardClass, glassSubtle, ctaBtnShadowClass } from "../../utils/glassStyles";

export default function InquiryGuidance() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const [transitioning, setTransitioning] = useState(false);

  const duration = searchParams.get("duration") || "300";
  const inquiry = inquiries.find((i) => i.id === Number(id));

  if (!inquiry) {
    navigate("/inquiry");
    return null;
  }

  const glassCard = glassCardClass(theme);
  const glassSubtleClass = glassSubtle(theme);

  const sessionPath = `/inquiry/${id}/session?duration=${duration}`;

  const handleDragEnd = (_event: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -100 && !transitioning) {
      setTransitioning(true);
    }
  };

  const handleStart = () => {
    if (!transitioning) setTransitioning(true);
  };

  const handleWarpComplete = useCallback(() => {
    navigate(sessionPath);
  }, [navigate, sessionPath]);

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

      {/* Header */}
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
            onClick={() => navigate(`/inquiry/${id}`)}
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

      {/* Content — swipeable, slides left on transition */}
      <motion.div
        drag={transitioning ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ touchAction: "pan-y" }}
        animate={transitioning ? { x: "-100%", opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col items-center justify-center p-6"
      >
        <div className="max-w-md w-full">
          {/* Title */}
          <div className="relative mb-6">
            <div
              className="absolute -inset-6 -z-10 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${inquiry.color}30 0%, transparent 65%)`,
                filter: "blur(40px)",
              }}
            />
            <p
              className={`text-[12px] tracking-[0.15em] uppercase mb-3 ${
                theme === "dark" ? "text-white/40" : "text-gray-400"
              }`}
            >
              {inquiry.name}
            </p>
            <h1
              className={`mb-3 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              How Inquiry Works
            </h1>
          </div>

          {/* Guidance card */}
          <div className="relative mb-6">
            <div
              className="absolute -inset-3 -z-10 pointer-events-none rounded-[24px]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(91,138,114,0.18) 0%, rgba(74,93,184,0.08) 40%, transparent 65%)",
                filter: "blur(35px)",
              }}
            />
            <div className={`rounded-[22px] p-6 ${glassCard}`}>
              <div className="space-y-4">
                {inquiryGuidance.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                        theme === "dark"
                          ? "border-gray-600"
                          : "border-gray-300"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-[15px] font-light flex-1 leading-[1.75] ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reassurance box */}
          <div className="relative mb-8">
            <div
              className={`rounded-[18px] p-6 text-center ${glassSubtleClass}`}
            >
              <p
                className={`text-[15px] leading-[1.8] font-light tracking-[0.015em] ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                You do not need to reach any conclusion. Simply observe what
                arises.
              </p>
            </div>
          </div>

          {/* Start Inquiry button */}
          <div className="relative mb-6">
            <div
              className="absolute -inset-2 -z-10 pointer-events-none rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(91,138,114,0.25) 0%, transparent 70%)",
                filter: "blur(15px)",
              }}
            />
            <button
              onClick={handleStart}
              className={`w-full py-4 px-8 rounded-full font-light text-[16px] transition-all active:scale-[0.98] ${ctaBtnShadowClass} text-white bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] border border-[rgba(255,255,255,0.15)]`}
            >
              Start Inquiry
            </button>
          </div>

          {/* Swipe indicator */}
          <div className="flex items-center justify-center gap-2">
            <ChevronLeft
              className={`w-5 h-5 animate-pulse ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <span
              className={`text-[14px] font-light ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Swipe to start
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
