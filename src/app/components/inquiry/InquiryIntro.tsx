import { useNavigate, useParams } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../contexts/ThemeContext";
import { inquiries, inquiryGuidance, durationOptions } from "./inquiryData";
import { glassCardClass, glassSubtle } from "../../utils/glassStyles";

export default function InquiryIntro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme, backgroundTheme, practiceMode } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const [guidanceOpen, setGuidanceOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(0);

  const inquiry = inquiries.find((i) => i.id === Number(id));

  if (!inquiry) {
    navigate("/inquiry");
    return null;
  }

  const glassCard = glassCardClass(theme);
  const glassSubtleClass = glassSubtle(theme);

  const handleDragEnd = (_event: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -100) {
      const duration = practiceMode === "easy"
        ? durationOptions[0].seconds
        : durationOptions[selectedDuration].seconds;
      navigate(
        `/inquiry/${id}/guidance?duration=${duration}`
      );
    }
  };

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
      {/* Header */}
      <div
        className={`sticky top-0 z-10 backdrop-blur-[20px] border-b ${
          theme === "dark"
            ? "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.1)]"
            : "bg-[rgba(255,255,255,0.6)] border-[rgba(255,255,255,0.3)]"
        }`}
      >
        <div className="p-4">
          <button
            onClick={() => navigate("/inquiry")}
            className={`flex items-center gap-2 transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content — swipeable */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ touchAction: "pan-y" }}
        className="flex-1 flex flex-col p-6"
      >
        {/* Title and essence */}
        <div className="relative mb-6">
          <div
            className="absolute -inset-6 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${inquiry.color}35 0%, ${inquiry.color}10 45%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
          <h1
            className={`mb-3 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {inquiry.name}
          </h1>
          <p
            className={`text-[14px] font-extralight italic tracking-[0.02em] ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {inquiry.essence}
          </p>
        </div>

        {/* Description card */}
        <div className="relative mb-5">
          <div
            className="absolute -inset-3 -z-10 pointer-events-none rounded-[24px]"
            style={{
              background: `radial-gradient(ellipse at center, ${inquiry.color}20 0%, transparent 65%)`,
              filter: "blur(30px)",
            }}
          />
          <div className={`rounded-[22px] p-6 ${glassCard}`}>
            <div
              className={`leading-[1.8] whitespace-pre-line font-light text-[15px] tracking-[0.015em] ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {inquiry.description}
            </div>
          </div>
        </div>

        {/* Instruction highlight */}
        <div className="relative mb-5">
          <div
            className="absolute -inset-3 -z-10 pointer-events-none rounded-[24px]"
            style={{
              background: `radial-gradient(ellipse at center, ${inquiry.color}25 0%, transparent 65%)`,
              filter: "blur(25px)",
            }}
          />
          <div
            className={`rounded-[22px] p-5 text-center ${
              theme === "dark"
                ? "bg-white/[0.04] border border-white/[0.08]"
                : "bg-white/40 border border-white/50"
            }`}
          >
            <p
              className={`text-[17px] font-extralight italic leading-[1.85] tracking-[0.02em] ${
                theme === "dark" ? "text-white/80" : "text-gray-700"
              }`}
            >
              "{inquiry.instruction}"
            </p>
          </div>
        </div>

        {/* Duration selector */}
        {practiceMode === "modify" && (
        <div className="mb-5">
          <p
            className={`text-[12px] tracking-[0.15em] uppercase mb-3 ${
              theme === "dark" ? "text-white/40" : "text-gray-400"
            }`}
          >
            Duration
          </p>
          <div className="flex gap-2">
            {durationOptions.map((opt, i) => (
              <button
                key={opt.seconds}
                onClick={() => setSelectedDuration(i)}
                className={`flex-1 py-2.5 rounded-full text-[14px] font-light transition-all active:scale-[0.96] ${
                  selectedDuration === i
                    ? "bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white border border-[rgba(255,255,255,0.15)] shadow-[0_4px_20px_rgba(91,138,114,0.3)]"
                    : theme === "dark"
                    ? "bg-white/[0.06] text-gray-400 border border-white/[0.1]"
                    : "bg-white/30 text-gray-500 border border-white/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Easy mode duration indicator */}
        {practiceMode === "easy" && (
          <div className="mb-5 flex items-center gap-2">
            <span className={`text-[12px] tracking-[0.15em] uppercase ${theme === "dark" ? "text-white/30" : "text-gray-400"}`}>
              Duration
            </span>
            <span className={`text-[14px] font-light ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>
              {durationOptions[0].label}
            </span>
          </div>
        )}

        {/* Before you begin — collapsible guidance */}
        <div className="mb-6">
          <button
            onClick={() => setGuidanceOpen(!guidanceOpen)}
            className={`w-full flex items-center justify-between rounded-[18px] p-4 transition-all ${glassSubtleClass}`}
          >
            <span
              className={`text-[14px] font-light ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Before you begin
            </span>
            {guidanceOpen ? (
              <ChevronUp
                className={`w-4 h-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
            ) : (
              <ChevronDown
                className={`w-4 h-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
            )}
          </button>
          <AnimatePresence>
            {guidanceOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div
                  className={`mt-2 rounded-[18px] p-5 space-y-3 ${glassSubtleClass}`}
                >
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
                        className={`text-[14px] font-light flex-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Swipe indicator */}
        <div className="flex items-center justify-center gap-2 pb-4">
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
            Swipe to continue
          </span>
        </div>
      </motion.div>
    </div>
  );
}