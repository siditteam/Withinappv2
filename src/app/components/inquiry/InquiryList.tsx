import { useNavigate } from "react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { inquiries } from "./inquiryData";
import { glassCardClass } from "../../utils/glassStyles";

export default function InquiryList() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const glowColors = [
    "rgba(74,93,184,0.2)",
    "rgba(91,138,114,0.2)",
    "rgba(122,111,155,0.2)",
    "rgba(107,142,158,0.18)",
    "rgba(139,115,85,0.18)",
  ];

  const freeIds = new Set([1, 2, 3]);

  const glassCard = glassCardClass(theme);

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
          Short investigations to awaken awareness
        </p>
      </div>

      {/* Activities List */}
      <div className="px-6 pb-24 space-y-3">
        {inquiries.map((inquiry, index) => {
          const isFree = freeIds.has(inquiry.id);

          return (
            <div key={inquiry.id} className="relative">
              {/* Card glow halo */}
              <div
                className="absolute -inset-2 -z-10 pointer-events-none rounded-[24px]"
                style={{
                  background: `radial-gradient(ellipse at center, ${glowColors[index % glowColors.length]} 0%, transparent 70%)`,
                  filter: "blur(25px)",
                }}
              />
              <button
                onClick={() => navigate(`/inquiry/${inquiry.id}`)}
                className={`w-full rounded-[22px] p-5 transition-all hover:shadow-2xl active:scale-[0.98] text-left relative ${glassCard}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`mb-1.5 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {inquiry.name}
                    </h3>
                    <p
                      className={`text-[14px] font-extralight tracking-[0.015em] ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {inquiry.essence}
                    </p>
                  </div>
                  {!isFree && (
                    <div
                      className={`ml-4 p-2 rounded-full flex-shrink-0 ${
                        theme === "dark"
                          ? "bg-white/[0.06] border border-white/[0.1]"
                          : "bg-white/40 border border-white/50"
                      }`}
                    >
                      <Lock
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}