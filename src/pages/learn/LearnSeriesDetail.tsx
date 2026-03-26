import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useTheme } from "../../store/ThemeContext";
import { glassCardClass, glassSubtle } from "../../lib/glassStyles";
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

export default function LearnSeriesDetail() {
  const { id } = useParams();
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const navigate = useNavigate();

  const series = seriesData.find((s) => s.id === id);
  if (!series) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Series not found</p>
      </div>
    );
  }

  const completed = series.episodes.filter((e) => e.completed).length;
  const total = series.episodes.length;
  const glass = glassCardClass(theme);
  const subtle = glassSubtle(theme);

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
      <div className="flex items-center gap-3 mb-8 pt-2">
        <button
          onClick={() => navigate("/learn")}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            theme === "dark"
              ? "bg-white/8 border border-white/12"
              : "bg-white/50 border border-white/60"
          }`}
        >
          <ArrowLeft className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />
        </button>
      </div>

      {/* Series info */}
      <div className="mb-8 relative">
        {/* Glow */}
        <div
          className="absolute -inset-6 -z-10 pointer-events-none"
          style={{
            background:
              theme === "dark"
                ? "radial-gradient(ellipse at center, rgba(74,93,184,0.15) 0%, transparent 65%)"
                : "radial-gradient(ellipse at center, rgba(74,93,184,0.06) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
        />
        <h1
          className={`mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          {series.title}
        </h1>
        <p
          className={`text-[14px] font-extralight leading-[1.75] mb-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {series.description}
        </p>
        <div className="flex items-center gap-3">
          <span
            className={`text-[11px] tracking-[0.06em] uppercase px-2 py-0.5 rounded-full border ${depthColor(
              series.depth,
              theme
            )}`}
          >
            {series.depth}
          </span>
          <span
            className={`text-[13px] font-extralight ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {completed} / {total} completed
          </span>
        </div>

        {/* Progress bar */}
        <div
          className={`mt-4 h-[2px] rounded-full overflow-hidden ${
            theme === "dark" ? "bg-white/6" : "bg-black/5"
          }`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] transition-all"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {series.episodes.map((episode, index) => {
          return (
            <button
              key={episode.id}
              type="button"
              onClick={() => navigate(`/learn/${series.id}/${episode.id}`)}
              className={`w-full rounded-[18px] p-4 text-left transition-transform active:scale-[0.98] ${
                episode.completed ? subtle : glass
              }`}
            >
              <div className="flex items-start gap-3.5">
            {/* Status indicator */}
            <div className="flex-shrink-0 mt-0.5">
              {episode.completed ? (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3D5A80] to-[#5B8A72] flex items-center justify-center shadow-[0_0_10px_rgba(91,138,114,0.25)]">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              ) : (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    theme === "dark"
                      ? "border border-white/15"
                      : "border border-gray-300/60"
                  }`}
                >
                  <span
                    className={`text-[11px] font-light ${
                      theme === "dark" ? "text-white/30" : "text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-[15px] font-light leading-[1.5] ${
                  episode.completed
                    ? theme === "dark"
                      ? "text-white/40"
                      : "text-gray-400"
                    : theme === "dark"
                    ? "text-white/90"
                    : "text-gray-800"
                }`}
              >
                {episode.title}
              </p>
              {episode.subtitle && (
                <p
                  className={`text-[13px] font-extralight mt-0.5 ${
                    episode.completed
                      ? theme === "dark"
                        ? "text-white/20"
                        : "text-gray-300"
                      : theme === "dark"
                      ? "text-gray-500"
                      : "text-gray-500"
                  }`}
                >
                  {episode.subtitle}
                </p>
              )}
            </div>

            <div className="flex-shrink-0 mt-0.5">
              <Check
                className={`w-4 h-4 opacity-0 ${
                  theme === "dark" ? "text-white/40" : "text-gray-400"
                }`}
              />
            </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
