import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Heart, Pause, Play, Sparkles, Square } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { glassCardClass } from "../utils/glassStyles";
import { useBackgroundTrack } from "../utils/useBackgroundTrack";
import { AmbientAudioControls } from "./session/AmbientAudioControls";
import { seriesData } from "./learn/learnData";

const accentPalette = ["#7A6F9B", "#5B8A72", "#3D5A80", "#8B7355"];
const glowPalette = [
  "rgba(122,111,155,0.34)",
  "rgba(91,138,114,0.32)",
  "rgba(74,93,184,0.32)",
  "rgba(139,115,85,0.3)",
];

export default function AudioSeriesPlayer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const ambientAudio = useBackgroundTrack(isPlaying, { volume: 0.14 });

  const seriesIndex = seriesData.findIndex((item) => item.id === id);
  const series = seriesIndex >= 0 ? seriesData[seriesIndex] : null;

  const playerMeta = useMemo(() => {
    if (!series) return null;

    const firstEpisode = series.episodes[0];
    return {
      title: series.title,
      subtitle: `${firstEpisode ? `Episode ${firstEpisode.id}` : "Series"} • ${series.depth}`,
      reflection: firstEpisode?.subtitle ?? series.description,
      durationLabel: `${series.episodes.length} episodes`,
      accent: accentPalette[seriesIndex % accentPalette.length],
      glow: glowPalette[seriesIndex % glowPalette.length],
    };
  }, [series, seriesIndex]);

  if (!series || !playerMeta) {
    navigate("/explore");
    return null;
  }

  const glassCard = glassCardClass(theme);

  return (
    <div
      className={`min-h-screen p-6 pb-10 ${
        hasBackground
          ? "bg-transparent"
          : theme === "dark"
          ? "bg-[#0F1419]"
          : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
      }`}
    >
      <div className="flex items-center justify-between mb-8 pt-4">
        <button
          onClick={() => navigate("/explore")}
          className={`w-11 h-11 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-white/10 border border-white/15 text-white/75" : "bg-white/60 border border-white/70 text-gray-700"}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <p className={`text-[11px] uppercase tracking-[0.24em] ${theme === "dark" ? "text-white/40" : "text-gray-500"}`}>
          Audio series
        </p>
        <AmbientAudioControls
          theme={theme}
          isMuted={ambientAudio.isMuted}
          onToggleMuted={ambientAudio.toggleMuted}
          volume={ambientAudio.volume}
          onVolumeChange={ambientAudio.setVolume}
          className="min-w-[110px] justify-end"
        />
      </div>

      <div className="relative">
        <div
          className="absolute -inset-6 -z-10 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${playerMeta.glow} 0%, transparent 68%)`,
            filter: "blur(52px)",
          }}
        />
        <div
          className={`rounded-[30px] overflow-hidden p-6 sm:p-8 relative ${glassCard}`}
          style={{
            background:
              theme === "dark"
                ? `linear-gradient(180deg, rgba(18,22,34,0.28) 0%, rgba(18,22,34,0.62) 100%), linear-gradient(135deg, ${playerMeta.accent}55 0%, rgba(255,255,255,0.04) 45%, rgba(5,10,20,0.32) 100%)`
                : `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.36) 100%), linear-gradient(135deg, ${playerMeta.accent}33 0%, rgba(255,255,255,0.42) 50%, rgba(255,245,235,0.35) 100%)`,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-90"
            style={{
              background:
                "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 22%, transparent 40%), radial-gradient(circle at 50% 52%, rgba(255,255,255,0.12) 0%, transparent 30%)",
            }}
          />

          <div className="relative z-[1] text-center pt-6 pb-2">
            <h1 className={`text-[28px] sm:text-[36px] leading-tight mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {playerMeta.title}
            </h1>
            <p className={`text-[16px] sm:text-[20px] mb-6 ${theme === "dark" ? "text-white/70" : "text-gray-600"}`}>
              {playerMeta.subtitle}
            </p>
            <p className={`text-[16px] italic font-extralight leading-[1.8] mb-10 ${theme === "dark" ? "text-white/55" : "text-gray-600"}`}>
              &ldquo;{playerMeta.reflection}&rdquo;
            </p>

            <div className="flex justify-center mb-10">
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="relative w-36 h-36 rounded-full flex items-center justify-center transition-transform active:scale-[0.96]"
                style={{
                  background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.34) 0%, ${playerMeta.accent}66 45%, rgba(255,255,255,0.12) 100%)`,
                  boxShadow: `0 0 30px ${playerMeta.glow}, 0 0 70px ${playerMeta.glow.replace("0.3", "0.18")}`,
                }}
              >
                <div className="absolute inset-[2px] rounded-full border border-white/50" />
                {isPlaying ? (
                  <Pause className="w-14 h-14 text-white" />
                ) : (
                  <Play className="w-14 h-14 ml-1 text-white fill-white" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 mb-8">
              <button
                onClick={() => setIsPlaying(true)}
                className={`px-4 py-2.5 rounded-full flex items-center gap-2 transition-transform active:scale-[0.96] ${theme === "dark" ? "bg-white/10 border border-white/15 text-white/75" : "bg-white/60 border border-white/70 text-gray-700"}`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-[13px] font-light tracking-[0.04em]">AI Play</span>
              </button>
              <button
                onClick={() => setIsLiked((prev) => !prev)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-[0.94] ${theme === "dark" ? "bg-white/10 border border-white/15" : "bg-white/60 border border-white/70"}`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-[#FF7A90] text-[#FF7A90]" : theme === "dark" ? "text-white/70" : "text-gray-700"}`} />
              </button>
              <button
                onClick={() => setIsPlaying(false)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-[0.94] ${theme === "dark" ? "bg-white/10 border border-white/15" : "bg-white/60 border border-white/70"}`}
              >
                <Square className={`w-4 h-4 ${theme === "dark" ? "text-white/70 fill-white/70" : "text-gray-700 fill-gray-700"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 mb-8">
              <span className={`text-[14px] ${theme === "dark" ? "text-white/45" : "text-gray-500"}`}>0:00</span>
              <div className={`flex-1 h-[4px] rounded-full overflow-hidden ${theme === "dark" ? "bg-white/15" : "bg-white/70"}`}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: isPlaying ? "34%" : "0%",
                    background: `linear-gradient(90deg, rgba(255,255,255,0.95) 0%, ${playerMeta.accent} 100%)`,
                  }}
                />
              </div>
              <span className={`text-[14px] ${theme === "dark" ? "text-white/75" : "text-gray-700"}`}>{playerMeta.durationLabel}</span>
            </div>

            <div className={`rounded-[22px] p-5 text-left ${theme === "dark" ? "bg-white/6 border border-white/10" : "bg-white/55 border border-white/70"}`}>
              <p className={`text-[11px] uppercase tracking-[0.2em] mb-3 ${theme === "dark" ? "text-white/35" : "text-gray-500"}`}>
                Episodes
              </p>
              <div className="space-y-3">
                {series.episodes.slice(0, 5).map((episode) => (
                  <div key={episode.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className={`${theme === "dark" ? "text-white/85" : "text-gray-900"}`}>{episode.title}</p>
                      {episode.subtitle ? (
                        <p className={`text-[13px] font-extralight ${theme === "dark" ? "text-white/45" : "text-gray-500"}`}>
                          {episode.subtitle}
                        </p>
                      ) : null}
                    </div>
                    <span className={`text-[12px] ${theme === "dark" ? "text-white/35" : "text-gray-500"}`}>#{episode.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}