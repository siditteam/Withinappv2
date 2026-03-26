import { Quote } from "lucide-react";
import type { Reflection } from "./libraryData";
import { glassCardClass } from "../../lib/glassStyles";

interface ReflectionCardProps {
  reflection: Reflection;
  theme: "dark" | "light";
}

const traditionGlowMap: Record<string, string> = {
  Sufi: "rgba(122,111,155,0.2)",
  Bhakti: "rgba(155,100,120,0.18)",
  Buddhist: "rgba(91,138,114,0.2)",
  Taoist: "rgba(107,142,158,0.2)",
  Advaita: "rgba(74,93,184,0.2)",
  Sikh: "rgba(139,115,85,0.18)",
  Christian: "rgba(91,138,114,0.22)",
  Zen: "rgba(107,142,158,0.18)",
};

export function ReflectionCard({ reflection, theme }: ReflectionCardProps) {
  const glassCard = glassCardClass(theme);

  const glowColor =
    traditionGlowMap[reflection.tradition] || "rgba(91,138,114,0.2)";

  return (
    <div className="relative">
      {/* Glow halo behind card */}
      <div
        className="absolute -inset-6 -z-10 pointer-events-none rounded-[28px]"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 65%)`,
          filter: "blur(35px)",
          transform: "scale(1.1)",
        }}
      />

      <div className={`rounded-[22px] p-6 flex flex-col ${glassCard}`}>
        {/* Quote icon */}
        <div className="mb-4 flex-shrink-0">
          <Quote
            className={`w-5 h-5 ${
              theme === "dark" ? "text-white/20" : "text-[#4A5DB8]/30"
            }`}
          />
        </div>

        {/* Quote text — the visual focus */}
        <p
          className={`text-[20px] font-extralight italic leading-[1.8] tracking-[0.015em] mb-6 flex-shrink-0 ${
            theme === "dark" ? "text-white/90" : "text-gray-800"
          }`}
        >
          &ldquo;{reflection.quote}&rdquo;
        </p>

        {/* Author + Tradition */}
        <div className="mb-6 flex-shrink-0">
          <p
            className={`text-[14px] font-extralight tracking-[0.02em] mb-1.5 ${
              theme === "dark" ? "text-white/55" : "text-gray-600"
            }`}
          >
            {reflection.author}
          </p>
          <p
            className={`text-[12px] tracking-[0.08em] ${
              theme === "dark" ? "text-white/20" : "text-gray-400"
            }`}
          >
            {reflection.tradition} Tradition
          </p>
        </div>

        {/* Divider */}
        <div
          className={`h-px mb-6 flex-shrink-0 ${
            theme === "dark" ? "bg-white/[0.06]" : "bg-black/[0.04]"
          }`}
        />

        {/* Reflection paragraph */}
        <div className="flex-shrink-0">
          <p
            className={`text-[11px] tracking-[0.15em] uppercase mb-3 ${
              theme === "dark" ? "text-white/20" : "text-gray-400"
            }`}
          >
            Reflection
          </p>
          <p
            className={`text-[14px] font-extralight leading-[1.85] tracking-[0.015em] ${
              theme === "dark" ? "text-white/50" : "text-gray-500"
            }`}
          >
            {reflection.reflection}
          </p>
        </div>

        {/* Theme pill */}
        <div className="mt-5 flex justify-end flex-shrink-0">
          <span
            className={`text-[11px] tracking-[0.08em] uppercase px-2.5 py-1 rounded-full ${
              theme === "dark"
                ? "bg-white/[0.04] text-white/20 border border-white/[0.05]"
                : "bg-white/40 text-gray-400 border border-white/50"
            }`}
          >
            {reflection.theme}
          </span>
        </div>
      </div>
    </div>
  );
}