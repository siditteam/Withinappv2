import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import { Circle, Quote } from "lucide-react";
import { useMemo } from "react";
import { glassCardClass } from "../utils/glassStyles";
import { getEasySoulDuration } from "./soul/soulProgressStorage";
import { soulPractices } from "./soul/soulPracticeData";

const quotes = [
  { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { text: "Be still and know.", author: "Psalms 46:10" },
  { text: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Silence is the language of God, all else is poor translation.", author: "Rumi" },
  { text: "The soul always knows what to do to heal itself. The challenge is to silence the mind.", author: "Caroline Myss" },
  { text: "What you seek is seeking you.", author: "Rumi" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "Be where you are, not where you think you should be.", author: "Anonymous" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "To understand everything is to forgive everything.", author: "Buddha" },
];

export default function DailyPractice() {
  const { theme, backgroundTheme, practiceMode } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const navigate = useNavigate();

  const todayQuote = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return quotes[dayOfYear % quotes.length];
  }, []);

  const practiceButtons = [
    { id: 1, title: "Guided Practices", icon: "soul" as const, description: "Awareness", path: "/soul" },
    { id: 2, title: "Silence", icon: "silence" as const, description: "Silent meditation timer", path: "/silence" },
    { id: 3, title: "Inquiry", icon: "inquiry" as const, description: "Inner investigation", path: "/inquiry" },
    { id: 4, title: "Library", icon: "meditation" as const, description: "Guided practices", path: "/library" }
  ];

  const handlePracticeClick = (path: string | null) => {
    if (path) {
      navigate(path);
    }
  };

  const glassCard = glassCardClass(theme);
  const quickStartDuration = practiceMode === "easy" ? getEasySoulDuration().seconds : 300;
  const quickStartPractice = soulPractices[0];
  const quickStartPracticeId = quickStartPractice?.id ?? 1;
  const quickStartPracticeTitle = quickStartPractice?.title ?? "Still Sitting";

  // Glow colors for each practice card
  const glowColors = [
    "rgba(74,93,184,0.2)",   // soft blue
    "rgba(122,111,155,0.2)", // soft violet
    "rgba(91,138,114,0.2)",  // soft teal
    "rgba(107,142,158,0.18)" // soft cyan
  ];

  return (
    <div className={`p-6 pb-8 h-screen overflow-hidden flex flex-col ${
      hasBackground ? "bg-transparent" : theme === "dark" ? "bg-[#0F1419]" : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
    }`}>
      {/* App Name */}
      <div className="flex flex-col items-center mb-8 pt-4">
        <h1 className={`tracking-[0.35em] ${theme === "dark" ? "text-white" : "text-[#2A3580]"}`}>WITHIN</h1>
        <p className={`text-[11px] tracking-[0.3em] mt-2 font-extralight ${theme === "dark" ? "text-white/25" : "text-gray-400"}`}>Soul &middot; Body &middot; Mind</p>
      </div>

      {/* Primary Start Card */}
      <div className="mb-4 relative">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(74,93,184,0.2) 0%, rgba(122,111,155,0.1) 45%, transparent 75%)"
              : "radial-gradient(ellipse at center, rgba(74,93,184,0.11) 0%, rgba(122,111,155,0.06) 45%, transparent 75%)",
            filter: "blur(36px)",
            transform: "scale(1.08)",
          }}
        />
        <button
          onClick={() =>
            navigate(`/soul/${quickStartPracticeId}/session?duration=${quickStartDuration}&quickStart=1`)
          }
          className={`w-full rounded-[32px] px-6 py-7 text-center transition-transform active:scale-[0.98] ${glassCard}`}
        >
          <h2 className={`text-[30px] leading-none mb-4 ${theme === "dark" ? "text-white" : "text-[#2A3580]"}`}>
            Start Meditation
          </h2>
          <p className={`text-[19px] leading-none mb-5 ${theme === "dark" ? "text-white/70" : "text-[#5F6FB4]"}`}>
            Continue: {quickStartPracticeTitle}
          </p>
          <div className={`flex items-center justify-center gap-2 text-[17px] ${theme === "dark" ? "text-white/45" : "text-[#7A84B8]"}`}>
            <Circle className="w-3.5 h-3.5" />
            <span>3 min &middot; Beginner</span>
          </div>
        </button>
      </div>

      {/* Practice Buttons 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 flex-shrink-0 relative">
        {/* Glow halo behind the grid */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-0"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(74,93,184,0.18) 0%, rgba(122,111,155,0.1) 40%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(74,93,184,0.08) 0%, rgba(122,111,155,0.04) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {practiceButtons.map((practice, index) => (
          <div key={practice.id} className="relative z-[1]">
            {/* Individual card glow */}
            <div
              className="absolute inset-0 -z-10 pointer-events-none rounded-[22px]"
              style={{
                background: `radial-gradient(ellipse at center, ${glowColors[index]} 0%, transparent 70%)`,
                filter: "blur(30px)",
                transform: "scale(1.1)",
              }}
            />
            <button
              onClick={() => handlePracticeClick(practice.path)}
              className={`relative overflow-hidden rounded-[22px] transition-transform active:scale-[0.98] h-[116px] sm:h-[126px] text-left w-full ${glassCard}`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <h3 className={`text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{practice.title}</h3>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Quote of the Day Card */}
      <div className="mt-4 flex-1 min-h-0 relative">
        {/* Glow halo behind quote card */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(91,138,114,0.15) 0%, rgba(74,93,184,0.08) 50%, transparent 75%)"
              : "radial-gradient(ellipse at center, rgba(74,93,184,0.08) 0%, rgba(91,138,114,0.04) 50%, transparent 75%)",
            filter: "blur(50px)",
            transform: "scale(1.15)",
          }}
        />
        <div className={`rounded-[22px] overflow-hidden ${glassCard} p-6 h-full flex flex-col justify-center`}>
          <div className="flex items-center gap-2 mb-5">
            <Quote className={`w-4 h-4 ${theme === "dark" ? "text-white/40" : "text-[#4A5DB8]/60"}`} />
            <span className={`text-[11px] tracking-[0.2em] uppercase ${theme === "dark" ? "text-white/35" : "text-gray-400"}`}>Quote of the Day</span>
          </div>
          <p className={`text-[15px] font-extralight italic leading-[1.85] mb-5 ${theme === "dark" ? "text-white/85" : "text-gray-800"}`}>
            &ldquo;{todayQuote.text}&rdquo;
          </p>
          <p className={`text-[13px] font-extralight tracking-[0.03em] ${theme === "dark" ? "text-white/35" : "text-gray-400"}`}>
            — {todayQuote.author}
          </p>
        </div>
      </div>
    </div>
  );
}