import { useNavigate } from "react-router";
import { ArrowLeft, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTheme } from "../../store/ThemeContext";
import { inquirySwipeCards } from "../../lib/inquiry/inquiryData";
import { glassCardClass } from "../../lib/glassStyles";

export default function InquiryList() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const activeInquiry = inquirySwipeCards[activeIndex];

  const glassCard = glassCardClass(theme);

  const moveToNext = () => {
    setDirection("next");
    setShowMeaning(false);
    setActiveIndex((prev) => (prev + 1) % inquirySwipeCards.length);
  };

  const moveToPrev = () => {
    setDirection("prev");
    setShowMeaning(false);
    setActiveIndex((prev) => (prev - 1 + inquirySwipeCards.length) % inquirySwipeCards.length);
  };

  const handleCardDragEnd = (_event: PointerEvent, info: { offset: { x: number; y: number } }) => {
    const { x, y } = info.offset;

    if (Math.abs(y) > Math.abs(x)) {
      if (y < -90) {
        setShowMeaning(true);
        return;
      }

      if (y > 90) {
        setShowMeaning(false);
        return;
      }
    }

    if (x > 120) {
      moveToPrev();
      return;
    }

    if (x < -120) {
      moveToNext();
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
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
      </div>

      {/* Title Section */}
      <div className="px-6 pt-6 pb-4">
        <h1
          className={`mb-3 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Inquiry
        </h1>
        <p
          className={`text-[14px] font-extralight tracking-[0.02em] ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Swipe left for next question. Swipe right for previous. Swipe up for further meaning.
        </p>
      </div>

      {/* Swipe Card */}
      <div className="px-6 pb-24 pt-2">
        <div className="relative">
          <div
            className="absolute -inset-4 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${activeInquiry.color}3A 0%, ${activeInquiry.color}10 50%, transparent 72%)`,
              filter: "blur(34px)",
            }}
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeInquiry.id}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleCardDragEnd}
              style={{ touchAction: "none" }}
              initial={{
                opacity: 0,
                x: direction === "next" ? 80 : -80,
                scale: 0.98,
              }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: direction === "next" ? -80 : 80,
                scale: 0.98,
              }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className={`rounded-[24px] p-6 min-h-[520px] select-none ${glassCard}`}
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <p className={`text-[11px] tracking-[0.16em] uppercase ${theme === "dark" ? "text-white/40" : "text-gray-500"}`}>
                  Inquiry {activeIndex + 1}/{inquirySwipeCards.length}
                </p>
                <div className={`px-3 py-1 rounded-full text-[11px] tracking-[0.08em] ${theme === "dark" ? "bg-white/[0.06] text-white/40" : "bg-white/60 text-gray-500"}`}>
                  {activeInquiry.title}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className={`text-[11px] tracking-[0.14em] uppercase mb-2 ${theme === "dark" ? "text-white/35" : "text-gray-500"}`}>
                    Question
                  </p>
                  <h2 className={`text-[26px] leading-[1.35] font-light ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {activeInquiry.question}
                  </h2>
                </div>

                <div>
                  <p className={`text-[11px] tracking-[0.14em] uppercase mb-2 ${theme === "dark" ? "text-white/35" : "text-gray-500"}`}>
                    Answer
                  </p>
                  <p className={`text-[16px] leading-[1.75] font-extralight ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>
                    {activeInquiry.answer}
                  </p>
                </div>

                <AnimatePresence initial={false}>
                  {showMeaning && (
                    <motion.div
                      initial={{ opacity: 0, y: 16, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 12, height: 0 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className={`overflow-hidden rounded-[18px] p-4 ${
                        theme === "dark"
                          ? "bg-white/[0.05] border border-white/[0.08]"
                          : "bg-white/65 border border-white/70"
                      }`}
                    >
                      <p className={`text-[11px] tracking-[0.14em] uppercase mb-2 ${theme === "dark" ? "text-white/35" : "text-gray-500"}`}>
                        Further Meaning
                      </p>
                      <p className={`text-[14px] leading-[1.8] font-extralight whitespace-pre-line ${theme === "dark" ? "text-white/75" : "text-gray-700"}`}>
                        {activeInquiry.furtherMeaning}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowMeaning((prev) => !prev)}
                  className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 text-[13px] transition-colors ${
                    theme === "dark"
                      ? "text-white/60 hover:text-white/85"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ChevronUp className={`w-4 h-4 transition-transform ${showMeaning ? "rotate-180" : ""}`} />
                  {showMeaning ? "Hide further meaning" : "Swipe up or tap to reveal further meaning"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}