import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Shield, Lock, ChevronRight, Star, Eye, Infinity, Flame } from "lucide-react";
import { useTheme } from "../../store/ThemeContext";
import { glassCardClass, glassElevated, glassSubtle, ctaBtnShadowClass } from "../../lib/glassStyles";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const tiers = [
  {
    id: "adept",
    name: "Adept",
    price: "$750",
    period: "lifetime",
    subtitle: "For the sincere practitioner",
    description: "Deep techniques refined over centuries, transmitted without distortion. Direct access to practices that dissolve the boundary between knower and known.",
    features: [
      "12 advanced technique transmissions",
      "Monthly live guidance sessions",
      "Private contemplation library",
      "Direct teacher Q&A access",
    ],
  },
  {
    id: "elder",
    name: "Elder",
    price: "$2,500",
    period: "lifetime",
    subtitle: "For those who have walked the path",
    description: "The deepest teachings require the deepest readiness. These transmissions operate at the level of direct knowing — beyond concept, beyond method.",
    features: [
      "Everything in Adept",
      "24 elder-level transmissions",
      "One-on-one guidance sessions",
      "Access to the Silent Retreat archive",
      "Private elder community circle",
    ],
  },
  {
    id: "source",
    name: "Source",
    price: "$5,000",
    period: "lifetime",
    subtitle: "For the one who is ready to disappear",
    description: "There is nothing left to learn here — only to be. These transmissions are not techniques. They are the direct pointing at what you already are.",
    features: [
      "Everything in Elder",
      "Unrestricted archive access",
      "Personal transmission sessions",
      "Annual silent retreat invitation",
      "Direct lineage transmissions",
      "Lifetime access to all future teachings",
    ],
  },
];

const teachings = [
  {
    id: "1",
    title: "The Dissolution of the Observer",
    level: "Adept",
    locked: true,
    icon: Eye,
    description: "When the one who watches disappears, what remains?",
  },
  {
    id: "2",
    title: "The Fire That Burns Itself",
    level: "Adept",
    locked: true,
    icon: Flame,
    description: "The ultimate practice consumes the practitioner",
  },
  {
    id: "3",
    title: "The Sourceless Source",
    level: "Elder",
    locked: true,
    icon: Infinity,
    description: "Before the first thought, before the first breath",
  },
  {
    id: "4",
    title: "The Final Transmission",
    level: "Source",
    locked: true,
    icon: Star,
    description: "The teaching that cannot be taught",
  },
];

export default function InnerCircle() {
  const navigate = useNavigate();
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const glass = glassCardClass(theme);
  const elevated = glassElevated(theme);
  const subtle = glassSubtle(theme);

  const goldAccent = theme === "dark" ? "text-[#C9A96E]" : "text-[#8B6914]";
  const goldBg = theme === "dark"
    ? "bg-gradient-to-br from-[rgba(201,169,110,0.15)] to-[rgba(139,105,20,0.08)] border-[rgba(201,169,110,0.2)]"
    : "bg-gradient-to-br from-[rgba(201,169,110,0.1)] to-[rgba(139,105,20,0.05)] border-[rgba(139,105,20,0.15)]";
  const goldGlow = theme === "dark"
    ? "radial-gradient(ellipse at center, rgba(201,169,110,0.15) 0%, rgba(139,105,20,0.06) 45%, transparent 70%)"
    : "radial-gradient(ellipse at center, rgba(201,169,110,0.08) 0%, rgba(139,105,20,0.03) 45%, transparent 70%)";

  return (
    <div
      className={`min-h-screen pb-32 ${
        hasBackground
          ? "bg-transparent"
          : theme === "dark"
          ? "bg-[#0B0E13]"
          : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
      }`}
    >
      {/* Hero */}
      <div className="relative h-[280px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1600631864543-3220a348c5bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZ29sZCUyMGFic3RyYWN0JTIwbHV4dXJ5JTIwbWluaW1hbHxlbnwxfHx8fDE3NzM3ODQ3NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Inner Circle"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: theme === "dark"
              ? "linear-gradient(to bottom, rgba(11,14,19,0.3) 0%, rgba(11,14,19,0.85) 70%, rgba(11,14,19,1) 100%)"
              : "linear-gradient(to bottom, rgba(245,247,250,0.2) 0%, rgba(245,247,250,0.8) 70%, rgba(245,247,250,1) 100%)",
          }}
        />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className={`absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center z-10 ${
            theme === "dark"
              ? "bg-black/40 border border-white/12 backdrop-blur-sm"
              : "bg-white/50 border border-white/60 backdrop-blur-sm"
          }`}
        >
          <ArrowLeft className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className={`w-5 h-5 ${goldAccent}`} />
            <span className={`text-[12px] tracking-[0.2em] uppercase ${goldAccent}`}>
              The Inner Circle
            </span>
          </div>
          <h1 className={`mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Beyond the Path
          </h1>
          <p
            className={`text-[14px] font-extralight leading-[1.8] max-w-[340px] ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            The deepest teachings are not hidden. They simply require the readiness to receive them.
          </p>
        </div>
      </div>

      <div className="px-6">
        {/* Philosophy statement */}
        <div className="relative my-8">
          <div
            className="absolute -inset-6 -z-10 pointer-events-none"
            style={{ background: goldGlow, filter: "blur(50px)" }}
          />
          <div className={`rounded-[22px] p-6 border ${goldBg}`}>
            <p
              className={`text-[14px] font-extralight leading-[2] italic text-center ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              &ldquo;This is not a course. It is not a program. It is a transmission between beings — without agenda, without hierarchy, only with a shared recognition of what we truly are.&rdquo;
            </p>
          </div>
        </div>

        {/* Locked teachings preview */}
        <div className="mb-10">
          <h2 className={`mb-1.5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Transmissions
          </h2>
          <p
            className={`text-[13px] font-extralight mb-5 ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            A glimpse of what awaits within
          </p>
          <div className="space-y-2.5">
            {teachings.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  className={`rounded-[18px] p-4 flex items-center gap-3.5 ${subtle}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${goldBg}`}
                  >
                    <Icon className={`w-5 h-5 ${goldAccent}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[14px] font-light truncate ${
                          theme === "dark" ? "text-white/70" : "text-gray-700"
                        }`}
                      >
                        {t.title}
                      </p>
                      <Lock
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          theme === "dark" ? "text-white/20" : "text-gray-300"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-[12px] font-extralight mt-0.5 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {t.description}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] tracking-[0.06em] uppercase px-2 py-0.5 rounded-full border flex-shrink-0 ${goldBg} ${goldAccent}`}
                  >
                    {t.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Membership tiers */}
        <div className="mb-8">
          <h2 className={`mb-1.5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Choose Your Depth
          </h2>
          <p
            className={`text-[13px] font-extralight mb-6 ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            One-time lifetime membership
          </p>

          <div className="space-y-4">
            {tiers.map((tier) => {
              const isSelected = selectedTier === tier.id;
              const isSource = tier.id === "source";

              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(isSelected ? null : tier.id)}
                  className={`w-full text-left rounded-[22px] transition-all duration-300 ${
                    isSelected ? "scale-[1.01]" : "active:scale-[0.98]"
                  }`}
                >
                  <div className="relative">
                    {/* Gold glow for source tier */}
                    {isSource && (
                      <div
                        className="absolute -inset-3 -z-10 pointer-events-none rounded-[26px]"
                        style={{ background: goldGlow, filter: "blur(35px)" }}
                      />
                    )}

                    <div
                      className={`rounded-[22px] p-5 border transition-all duration-300 ${
                        isSelected
                          ? isSource
                            ? theme === "dark"
                              ? "bg-gradient-to-br from-[rgba(201,169,110,0.12)] to-[rgba(139,105,20,0.06)] border-[rgba(201,169,110,0.3)] backdrop-blur-md"
                              : "bg-gradient-to-br from-[rgba(201,169,110,0.08)] to-[rgba(139,105,20,0.04)] border-[rgba(139,105,20,0.25)] backdrop-blur-md"
                            : elevated
                          : glass
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`${
                                isSource
                                  ? goldAccent
                                  : theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {tier.name}
                            </h3>
                            {isSource && (
                              <Star
                                className={`w-4 h-4 ${goldAccent}`}
                                fill="currentColor"
                              />
                            )}
                          </div>
                          <p
                            className={`text-[12px] font-extralight ${
                              theme === "dark" ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            {tier.subtitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-[22px] font-light ${
                              isSource
                                ? goldAccent
                                : theme === "dark"
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {tier.price}
                          </p>
                          <p
                            className={`text-[11px] font-extralight ${
                              theme === "dark" ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            {tier.period}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className={`text-[13px] font-extralight leading-[1.8] mb-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {tier.description}
                      </p>

                      {/* Expanded features */}
                      {isSelected && (
                        <div className="space-y-2 mb-4">
                          {tier.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <div
                                className={`w-1 h-1 rounded-full flex-shrink-0 ${
                                  isSource
                                    ? "bg-[#C9A96E]"
                                    : theme === "dark"
                                    ? "bg-white/30"
                                    : "bg-gray-400"
                                }`}
                              />
                              <p
                                className={`text-[13px] font-extralight ${
                                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {f}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA when selected */}
                      {isSelected && (
                        <div
                          className={`mt-2 rounded-full py-3 text-center text-[14px] font-light transition-all ${
                            isSource
                              ? `bg-gradient-to-r from-[#C9A96E] to-[#8B6914] text-white ${ctaBtnShadowClass}`
                              : `bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white ${ctaBtnShadowClass}`
                          }`}
                        >
                          Request Membership
                        </div>
                      )}

                      {!isSelected && (
                        <div className="flex items-center justify-end">
                          <ChevronRight
                            className={`w-4 h-4 ${
                              theme === "dark" ? "text-white/20" : "text-gray-300"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust note */}
        <div className="text-center px-4 pb-6">
          <p
            className={`text-[12px] font-extralight leading-[1.8] ${
              theme === "dark" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            No subscriptions. No renewals. One commitment.
            <br />
            Membership is reviewed to ensure readiness.
          </p>
        </div>
      </div>
    </div>
  );
}