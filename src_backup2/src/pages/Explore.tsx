import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Headphones, Lightbulb, Play, Shield, Users, GraduationCap } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { glassCardClass, glassElevated } from "../utils/glassStyles";
import { seriesData } from "../lib/learn/learnData";

type ExploreAudioCard = {
  id: string;
  title: string;
  subtitle: string;
  reflection: string;
  durationLabel: string;
  accent: string;
  glow: string;
  typeLabel: string;
};

function useLiveCount() {
  const [count, setCount] = useState(12_347);
  useEffect(() => {
    const iv = setInterval(() => {
      setCount((c) => Math.max(11_800, c + Math.floor(Math.random() * 7) - 3));
    }, 3000);
    return () => clearInterval(iv);
  }, []);
  return count;
}

export default function Explore() {
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const navigate = useNavigate();
  const liveCount = useLiveCount();

  const glassCard = glassCardClass(theme);
  const elevatedCard = glassElevated(theme);

  const audioTalks: ExploreAudioCard[] = [
    {
      id: "talk-1",
      title: "Understanding the Self",
      subtitle: "Rupert Spira • Non-duality",
      reflection: "Just notice what is aware of the one who is listening.",
      durationLabel: "45 min",
      accent: "#7A6F9B",
      glow: "rgba(122,111,155,0.35)",
      typeLabel: "Audio talk",
    },
    {
      id: "talk-2",
      title: "The Direct Path",
      subtitle: "Greg Goode • Self-inquiry",
      reflection: "A direct invitation to stop seeking and turn toward what is here.",
      durationLabel: "38 min",
      accent: "#3D5A80",
      glow: "rgba(74,93,184,0.32)",
      typeLabel: "Audio talk",
    },
    {
      id: "talk-3",
      title: "Being Awareness",
      subtitle: "Joan Tollifson • Present moment",
      reflection: "There is nowhere to get to. Presence is the whole teaching.",
      durationLabel: "52 min",
      accent: "#5B8A72",
      glow: "rgba(91,138,114,0.32)",
      typeLabel: "Audio talk",
    },
  ];

  const audioSeries: ExploreAudioCard[] = seriesData.slice(0, 3).map((series, index) => {
    const firstEpisode = series.episodes[0];
    const accentPalette = ["#7A6F9B", "#5B8A72", "#3D5A80"];
    const glowPalette = ["rgba(122,111,155,0.34)", "rgba(91,138,114,0.32)", "rgba(74,93,184,0.32)"];

    return {
      id: `series-${series.id}`,
      title: series.title,
      subtitle: `${firstEpisode ? `Episode ${firstEpisode.id}` : "Series"} • ${series.depth}`,
      reflection: firstEpisode?.subtitle ?? series.description,
      durationLabel: `${series.episodes.length} episodes`,
      accent: accentPalette[index % accentPalette.length],
      glow: glowPalette[index % glowPalette.length],
      typeLabel: "Audio series",
    };
  });

  const todaysPractice = {
    title: "Resting in Being",
    instruction: "Simply notice what is aware of these words",
    duration: "12 min"
  };

  const todaysKnowledge = {
    title: "The Witness and the Witnessed",
    description: "Understanding the distinction between awareness and its objects",
    readTime: "5 min"
  };

  const renderAudioListItem = (item: ExploreAudioCard, onClick: () => void) => {
    return (
      <button
        key={item.id}
        onClick={onClick}
        className={`w-full text-left rounded-[22px] p-4 flex items-center gap-4 transition-transform active:scale-[0.98] ${glassCard}`}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${item.accent} 0%, rgba(255,255,255,0.2) 100%)`,
          }}
        >
          <Headphones className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
          <p className={`text-[14px] font-extralight tracking-[0.015em] truncate ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {item.subtitle}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[12px] font-light ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{item.durationLabel}</span>
            <span className={`text-[12px] ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>•</span>
            <span className={`text-[12px] font-light ${theme === "dark" ? "text-[#5B8A72]" : "text-[#4A5DB8]"}`}>
              {item.typeLabel}
            </span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-white/10 border border-white/15" : "bg-[#F0F2FF]/80"}`}>
          <Play className={`w-5 h-5 ml-0.5 ${theme === "dark" ? "text-[#5B8A72] fill-[#5B8A72]" : "text-[#4A5DB8] fill-[#4A5DB8]"}`} />
        </div>
      </button>
    );
  };

  return (
    <div className={`p-6 pb-8 min-h-screen ${
      hasBackground ? "bg-transparent" : theme === "dark" ? "bg-[#0F1419]" : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
    }`}>
      {/* App Name */}
      <div className="flex justify-center mb-10 pt-4">
        <h1 className={`tracking-[0.35em] ${theme === "dark" ? "text-white" : "text-[#2A3580]"}`}>WITHIN</h1>
      </div>

      {/* Sangha — Meditate Together Card */}
      <div className="mb-10 relative">
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(91,138,114,0.2) 0%, rgba(74,93,184,0.1) 45%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(91,138,114,0.1) 0%, rgba(74,93,184,0.05) 45%, transparent 70%)",
            filter: "blur(55px)",
          }}
        />
        <button
          onClick={() => navigate("/sangha")}
          className={`w-full text-left rounded-[22px] p-5 transition-transform active:scale-[0.98] ${elevatedCard}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-[#3D5A80] to-[#5B8A72]"
                  : "bg-gradient-to-br from-[#4A5DB8] to-[#5B8A72]"
              }`}
            >
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Sangha</h3>
              <p className={`text-[13px] font-extralight leading-[1.6] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Sit in silence with others
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className={`text-[12px] font-light ${theme === "dark" ? "text-emerald-400/70" : "text-emerald-600/70"}`}>
                  {liveCount.toLocaleString()} meditating now
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Learn — Structured Paths */}
      <div className="mb-10 relative">
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(122,111,155,0.18) 0%, rgba(74,93,184,0.08) 45%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(122,111,155,0.08) 0%, rgba(74,93,184,0.04) 45%, transparent 70%)",
            filter: "blur(55px)",
          }}
        />
        <button
          onClick={() => navigate("/learn")}
          className={`w-full text-left rounded-[22px] p-5 transition-transform active:scale-[0.98] ${glassCard}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-[#4A5DB8] to-[#7A6F9B]"
                  : "bg-gradient-to-br from-[#4A5DB8] to-[#8B7EC8]"
              }`}
            >
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Learn</h3>
              <p className={`text-[13px] font-extralight leading-[1.6] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Structured paths to understanding
              </p>
              <span className={`text-[12px] font-extralight mt-1 inline-block ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                9 series
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* The Inner Circle */}
      <div className="mb-10 relative">
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(201,169,110,0.12) 0%, rgba(139,105,20,0.05) 45%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(201,169,110,0.06) 0%, rgba(139,105,20,0.03) 45%, transparent 70%)",
            filter: "blur(55px)",
          }}
        />
        <button
          onClick={() => navigate("/inner-circle")}
          className={`w-full text-left rounded-[22px] p-5 transition-transform active:scale-[0.98] border ${
            theme === "dark"
              ? "bg-gradient-to-br from-[rgba(201,169,110,0.08)] to-[rgba(139,105,20,0.04)] border-[rgba(201,169,110,0.15)] backdrop-blur-sm"
              : "bg-gradient-to-br from-[rgba(201,169,110,0.06)] to-[rgba(139,105,20,0.03)] border-[rgba(139,105,20,0.1)] backdrop-blur-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#C9A96E] to-[#8B6914]">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={theme === "dark" ? "text-[#C9A96E]" : "text-[#8B6914]"}>The Inner Circle</h3>
              </div>
              <p className={`text-[13px] font-extralight leading-[1.6] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Deep transmissions for the ready
              </p>
              <span className={`text-[11px] font-extralight mt-1 inline-block tracking-[0.06em] uppercase ${theme === "dark" ? "text-[rgba(201,169,110,0.5)]" : "text-[rgba(139,105,20,0.5)]"}`}>
                By invitation
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Today's Practice */}
      <div className="mb-10 relative">
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(74,93,184,0.22) 0%, rgba(91,138,114,0.1) 45%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(74,93,184,0.1) 0%, rgba(91,138,114,0.05) 45%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <h2 className={`mb-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Today's practice</h2>
        <div className={`rounded-[22px] p-6 text-white ${elevatedCard} ${theme === "dark" ? "!bg-[rgba(47,53,72,0.6)]" : "!bg-gradient-to-br !from-[rgba(74,93,184,0.85)] !to-[rgba(107,124,216,0.85)]"}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center bg-white/10 border border-white/20">
              <Play className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-light text-white">{todaysPractice.title}</h3>
              <p className={`text-[14px] font-extralight ${theme === "dark" ? "opacity-70" : "opacity-90"}`}>{todaysPractice.duration}</p>
            </div>
          </div>
          <p className="text-[14px] opacity-90 italic font-extralight leading-[1.8] mb-5">&ldquo;{todaysPractice.instruction}&rdquo;</p>
          <button className={`px-6 py-2.5 rounded-full font-light text-[14px] transition-transform active:scale-95 ${theme === "dark" ? "bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white" : "bg-white/90 text-[#4A5DB8]"}`}>
            Begin practice
          </button>
        </div>
      </div>

      {/* Today's Knowledge */}
      <div className="mb-10 relative">
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(91,138,114,0.15) 0%, transparent 65%)"
              : "radial-gradient(ellipse at center, rgba(91,138,114,0.06) 0%, transparent 65%)",
            filter: "blur(45px)",
          }}
        />
        <h2 className={`mb-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Today's knowledge</h2>
        <div className={`rounded-[22px] p-5 ${glassCard}`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme === "dark" ? "bg-white/10 border border-white/15" : "bg-[#F0F2FF]/80"}`}>
              <Lightbulb className={`w-5 h-5 ${theme === "dark" ? "text-[#5B8A72]" : "text-[#4A5DB8]"}`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-light mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{todaysKnowledge.title}</h3>
              <p className={`text-[14px] mb-2.5 font-extralight leading-[1.75] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{todaysKnowledge.description}</p>
              <p className={`text-[12px] font-extralight tracking-[0.02em] ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{todaysKnowledge.readTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Talk Sessions */}
      <div className="mb-10 relative">
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(122,111,155,0.15) 0%, transparent 65%)"
              : "radial-gradient(ellipse at center, rgba(122,111,155,0.06) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
        />
        <h2 className={`mb-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Audio talks</h2>
        <div className="space-y-5">
          {audioTalks.map((talk) => renderAudioListItem(talk, () => navigate(`/explore/audio-talk/${talk.id}`)))}
        </div>
      </div>

      {/* Audio Series */}
      <div className="mb-10 relative">
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(74,93,184,0.15) 0%, rgba(91,138,114,0.08) 50%, transparent 68%)"
              : "radial-gradient(ellipse at center, rgba(74,93,184,0.06) 0%, rgba(91,138,114,0.04) 50%, transparent 68%)",
            filter: "blur(50px)",
          }}
        />
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-white/10 border border-white/15" : "bg-white/60 border border-white/70"}`}>
            <Headphones className={`w-5 h-5 ${theme === "dark" ? "text-white/75" : "text-[#4A5DB8]"}`} />
          </div>
          <div>
            <h2 className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>Audio series</h2>
            <p className={`text-[14px] font-extralight ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>Long-form listening journeys</p>
          </div>
        </div>
        <div className="space-y-5">
          {audioSeries.map((series) => renderAudioListItem(series, () => navigate(`/explore/audio-series/${series.id.replace(/^series-/, "")}`)))}
        </div>
      </div>

    </div>
  );
}