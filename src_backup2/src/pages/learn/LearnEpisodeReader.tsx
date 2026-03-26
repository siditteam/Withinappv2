import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { seriesData } from "../../lib/learn/learnData";
import { getEpisodeContent } from "../../lib/learn/learnContent";

export default function LearnEpisodeReader() {
  const { id, episodeId } = useParams();
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const series = seriesData.find((s) => s.id === id);
  const episodeIndex = series?.episodes.findIndex((e) => e.id === episodeId) ?? -1;
  const episode = series?.episodes[episodeIndex];
  const nextEpisode = series?.episodes[episodeIndex + 1];
  const [content, setContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);

  // Scroll to top when episode changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [episodeId]);

  useEffect(() => {
    if (!series || !episode) {
      setContent("");
      return;
    }

    let cancelled = false;
    setLoadingContent(true);

    getEpisodeContent(series.id, episode.id)
      .then((loaded) => {
        if (!cancelled) {
          setContent(loaded);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingContent(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [series?.id, episode?.id]);

  if (!series || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Episode not found</p>
      </div>
    );
  }

  const total = series.episodes.length;
  const progress = ((episodeIndex + 1) / total) * 100;

  return (
    <div
      className={`flex flex-col min-h-screen ${
        hasBackground
          ? "bg-transparent"
          : theme === "dark"
          ? "bg-[#0F1419]"
          : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
      }`}
    >
      {/* Fixed header */}
      <div
        className={`sticky top-0 z-10 px-5 pt-4 pb-3 ${
          theme === "dark"
            ? "bg-[#0F1419]/80 backdrop-blur-xl border-b border-white/6"
            : "bg-white/70 backdrop-blur-xl border-b border-black/6"
        } ${hasBackground ? "!bg-transparent !border-transparent backdrop-blur-xl" : ""}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(`/learn/${series.id}`)}
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              theme === "dark"
                ? "bg-white/8 border border-white/12"
                : "bg-white/50 border border-white/60"
            }`}
          >
            <ArrowLeft className={`w-4 h-4 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />
          </button>
          <div className="flex-1 min-w-0">
            <p
              className={`text-[11px] uppercase tracking-[0.14em] font-light truncate ${
                theme === "dark" ? "text-white/35" : "text-gray-400"
              }`}
            >
              {series.title}
            </p>
            <p
              className={`text-[13px] font-light truncate ${
                theme === "dark" ? "text-white/70" : "text-gray-700"
              }`}
            >
              Episode {episodeIndex + 1} of {total}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className={`h-[2px] rounded-full overflow-hidden ${
            theme === "dark" ? "bg-white/8" : "bg-black/8"
          }`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pt-6 pb-36">
        {/* Episode title */}
        <div className="mb-6">
          <h1
            className={`text-[22px] font-light leading-[1.4] mb-1.5 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {episode.title}
          </h1>
          {episode.subtitle && (
            <p
              className={`text-[14px] font-extralight ${
                theme === "dark" ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {episode.subtitle}
            </p>
          )}
        </div>

        {/* Divider */}
        <div
          className={`h-px w-12 rounded-full mb-7 ${
            theme === "dark" ? "bg-white/15" : "bg-gray-300"
          }`}
        />

        {/* Episode body */}
        <p
          className={`text-[15px] font-extralight leading-[1.9] whitespace-pre-line ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {loadingContent
            ? "Loading episode content..."
            : content || "Content for this episode will be available soon."}
        </p>
      </div>

      {/* Fixed bottom action */}
      <div
        className={`fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 ${
          theme === "dark"
            ? "bg-gradient-to-t from-[#0F1419] via-[#0F1419]/90 to-transparent"
            : "bg-gradient-to-t from-white via-white/90 to-transparent"
        } ${hasBackground ? "from-transparent via-transparent" : ""}`}
      >
        {nextEpisode ? (
          <button
            onClick={() => navigate(`/learn/${series.id}/${nextEpisode.id}`)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-[18px] text-white"
            style={{
              background: "linear-gradient(135deg, #3D5A80 0%, #5B8A72 100%)",
              boxShadow: "0 4px 24px rgba(61,90,128,0.35)",
            }}
          >
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/60 mb-0.5">Next Episode</p>
              <p className="text-[14px] font-light leading-[1.3]">{nextEpisode.title}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 flex-shrink-0" />
          </button>
        ) : (
          <button
            onClick={() => navigate(`/learn/${series.id}`)}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-[18px] text-white"
            style={{
              background: "linear-gradient(135deg, #3D5A80 0%, #5B8A72 100%)",
              boxShadow: "0 4px 24px rgba(61,90,128,0.35)",
            }}
          >
            <p className="text-[14px] font-light">Series Complete — Back to Overview</p>
          </button>
        )}
      </div>
    </div>
  );
}
