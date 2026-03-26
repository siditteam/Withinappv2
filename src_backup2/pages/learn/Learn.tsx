import { useNavigate } from "react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { glassCardClass } from "../../utils/glassStyles";
import { seriesData } from "../../lib/learn/learnData";

const depthColor = (depth: string, theme: string) => {
  if (theme === "dark") {
    return depth === "Beginner"
      ? "text-emerald-400/70 border-emerald-400/20 bg-emerald-400/8"
      : depth === "Intermediate"
      ? "text-amber-400/70 border-amber-400/20 bg-amber-400/8"
      : "text-purple-400/70 border-purple-400/20 bg-purple-400/8";
  }
  return depth === "Beginner"
    ? "text-emerald-700/70 border-emerald-600/20 bg-emerald-50/60"
    : depth === "Intermediate"
    ? "text-amber-700/70 border-amber-600/20 bg-amber-50/60"
    : "text-purple-700/70 border-purple-600/20 bg-purple-50/60";
};

export default function Learn() {
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const navigate = useNavigate();
  const glass = glassCardClass(theme);

  return (
    <div
      className={`min-h-screen p-6 pb-32 ${
        hasBackground
          ? "bg-transparent"
          : theme === "dark"
          ? "bg-[#0F1419]"
          : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 pt-2">
        <button
          onClick={() => navigate("/explore")}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-white/8 border border-white/12"
              : "bg-white/50 border border-white/60"
          }`}
        >
          <ArrowLeft className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />
        </button>
        <h1 className={`tracking-[0.15em] ${theme === "dark" ? "text-white" : "text-[#2A3580]"}`}>
          LEARN
        </h1>
      </div>
      <p
        className={`text-[14px] font-extralight tracking-[0.02em] mb-10 ml-[52px] ${
          theme === "dark" ? "text-gray-500" : "text-gray-500"
        }`}
      >
        Structured paths to understanding
      </p>

      {/* Series list */}
      <div className="space-y-3">
        {seriesData.map((series) => {
          const completed = series.episodes.filter((e) => e.completed).length;
          const total = series.episodes.length;
          const progress = completed / total;

          return (
            <button
              key={series.id}
              onClick={() => navigate(`/learn/${series.id}`)}
              className={`w-full text-left rounded-[22px] p-5 transition-transform active:scale-[0.98] ${glass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3
                      className={`truncate ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {series.title}
                    </h3>
                  </div>
                  <p
                    className={`text-[13px] font-extralight leading-[1.6] mb-3 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {series.description}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[11px] tracking-[0.06em] uppercase px-2 py-0.5 rounded-full border ${depthColor(
                        series.depth,
                        theme
                      )}`}
                    >
                      {series.depth}
                    </span>
                    <span
                      className={`text-[12px] font-extralight ${
                        theme === "dark" ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {total} episodes
                    </span>
                    {completed > 0 && (
                      <>
                        <span
                          className={`text-[12px] ${
                            theme === "dark" ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          ·
                        </span>
                        <span
                          className={`text-[12px] font-light ${
                            theme === "dark" ? "text-emerald-400/60" : "text-emerald-600/60"
                          }`}
                        >
                          {completed}/{total}
                        </span>
                      </>
                    )}
                  </div>
                  {/* Subtle progress bar */}
                  {completed > 0 && (
                    <div
                      className={`mt-3 h-[2px] rounded-full overflow-hidden ${
                        theme === "dark" ? "bg-white/6" : "bg-black/5"
                      }`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] transition-all"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                <ChevronRight
                  className={`w-5 h-5 flex-shrink-0 mt-1 ${
                    theme === "dark" ? "text-white/20" : "text-gray-300"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
