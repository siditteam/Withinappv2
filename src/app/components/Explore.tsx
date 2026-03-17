import { BookOpen, Headphones, Lightbulb, Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTheme } from "../contexts/ThemeContext";
import { glassCardClass, glassElevated } from "../utils/glassStyles";

export default function Explore() {
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";

  const glassCard = glassCardClass(theme);
  const elevatedCard = glassElevated(theme);

  const writings = [
    {
      id: 1,
      title: "The Nature of Awareness",
      author: "Rupert Spira",
      readTime: "8 min read",
      excerpt: "Awareness is not an experience but that which knows all experience...",
      image: "https://images.unsplash.com/photo-1625395694544-079d163b769b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBtZWRpdGF0aW5nJTIwc3Vuc2V0fGVufDF8fHx8MTc3MzE0OTEwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 2,
      title: "Beyond the Seeking Mind",
      author: "Adyashanti",
      readTime: "6 min read",
      excerpt: "The end of seeking is the beginning of finding what you already are...",
      image: "https://images.unsplash.com/photo-1617844580965-4cb9f0ba3e6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBmb3Jlc3QlMjBjYWxtfGVufDF8fHx8MTc3MzExMjI4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 3,
      title: "The Primacy of Presence",
      author: "Eckhart Tolle",
      readTime: "10 min read",
      excerpt: "Presence is the key to freedom from the prison of psychological time...",
      image: "https://images.unsplash.com/photo-1628087234845-254f15abd82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHN1bnJpc2UlMjBtZWRpdGF0aW9ufGVufDF8fHx8MTc3MzE0OTExMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const audioTalks = [
    { id: 1, title: "Understanding the Self", speaker: "Rupert Spira", duration: "45 min", topic: "Non-duality" },
    { id: 2, title: "The Direct Path", speaker: "Greg Goode", duration: "38 min", topic: "Self-inquiry" },
    { id: 3, title: "Being Awareness", speaker: "Joan Tollifson", duration: "52 min", topic: "Present moment" }
  ];

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

  const glowColors = [
    "rgba(74,93,184,0.18)",  // blue
    "rgba(122,111,155,0.18)", // violet
    "rgba(91,138,114,0.18)",  // teal
  ];

  return (
    <div className={`p-6 pb-8 min-h-screen ${
      hasBackground ? "bg-transparent" : theme === "dark" ? "bg-[#0F1419]" : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
    }`}>
      {/* App Name */}
      <div className="flex justify-center mb-10 pt-4">
        <h1 className={`tracking-[0.35em] ${theme === "dark" ? "text-white" : "text-[#2A3580]"}`}>WITHIN</h1>
      </div>

      {/* Today's Practice */}
      <div className="mb-10 relative">
        {/* Glow halo */}
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
        <div className="space-y-3">
          {audioTalks.map((talk, index) => (
            <div
              key={talk.id}
              className={`rounded-[22px] p-4 flex items-center gap-4 transition-transform active:scale-98 ${glassCard}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${theme === "dark" ? "bg-gradient-to-br from-[#3D5A80] to-[#5B8A72]" : "bg-[#4A5DB8]"}`}>
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>{talk.title}</h3>
                <p className={`text-[14px] font-extralight tracking-[0.015em] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{talk.speaker}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[12px] font-light ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{talk.duration}</span>
                  <span className={`text-[12px] ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>•</span>
                  <span className={`text-[12px] font-light ${theme === "dark" ? "text-[#5B8A72]" : "text-[#4A5DB8]"}`}>{talk.topic}</span>
                </div>
              </div>
              <button className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-white/10 border border-white/15" : "bg-[#F0F2FF]/80"}`}>
                <Play className={`w-5 h-5 ml-0.5 ${theme === "dark" ? "text-[#5B8A72] fill-[#5B8A72]" : "text-[#4A5DB8] fill-[#4A5DB8]"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Seeds of Insight - New Writings */}
      <div className="relative">
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(74,93,184,0.12) 0%, rgba(107,142,158,0.08) 40%, transparent 65%)"
              : "radial-gradient(ellipse at center, rgba(74,93,184,0.06) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
        />
        <h2 className={`mb-1.5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Seeds of insight</h2>
        <p className={`text-[14px] mb-5 font-extralight tracking-[0.02em] ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>New writings to contemplate</p>
        <div className="space-y-4">
          {writings.map((article, index) => (
            <div
              key={article.id}
              className="relative"
            >
              {/* Subtle per-card glow */}
              <div
                className="absolute -inset-2 -z-10 pointer-events-none rounded-[22px]"
                style={{
                  background: `radial-gradient(ellipse at center, ${glowColors[index % glowColors.length]} 0%, transparent 70%)`,
                  filter: "blur(25px)",
                }}
              />
              <div
                className={`rounded-[22px] overflow-hidden transition-transform active:scale-98 ${glassCard}`}
              >
                <div className="h-40 w-full">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                    <span className={`text-[12px] font-light ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{article.readTime}</span>
                  </div>
                  <h3 className={`mb-1.5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{article.title}</h3>
                  <p className={`text-[14px] mb-2.5 font-extralight leading-[1.75] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{article.excerpt}</p>
                  <p className={`text-[12px] font-extralight tracking-[0.02em] ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>by {article.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}