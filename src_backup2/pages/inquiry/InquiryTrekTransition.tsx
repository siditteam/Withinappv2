import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { glassCardClass, glassFloat, ctaBtnShadowClass } from "../../utils/glassStyles";

export default function InquiryTrekTransition() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon with glow halo */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(122,111,155,0.25) 0%, rgba(74,93,184,0.12) 40%, transparent 65%)",
              filter: "blur(35px)",
              transform: "scale(2.5)",
            }}
          />
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${glassFloat(theme)}`}>
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Message card with glow */}
        <div className="relative mb-8">
          <div
            className="absolute -inset-4 -z-10 pointer-events-none rounded-[24px]"
            style={{
              background: "radial-gradient(ellipse at center, rgba(91,138,114,0.18) 0%, rgba(122,111,155,0.1) 40%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          <div className={`rounded-[22px] p-8 ${glassCardClass(theme)}`}>
            <p className={`text-[15px] leading-[1.8] mb-7 font-light tracking-[0.015em] ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Inquiry prepares the mind for deeper exploration.
            </p>
            <p className={`text-[15px] leading-[1.8] mb-7 font-light tracking-[0.015em] ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Practicing inquiry daily strengthens awareness.
            </p>
            <p className={`text-[15px] leading-[1.8] font-light tracking-[0.015em] ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              You may notice that the Inner Trek experience becomes deeper the following day after inquiry practice.
            </p>
          </div>
        </div>

        {/* CTA with subtle glow */}
        <div className="relative">
          <div
            className="absolute -inset-2 -z-10 pointer-events-none rounded-full"
            style={{
              background: "radial-gradient(ellipse at center, rgba(91,138,114,0.25) 0%, transparent 70%)",
              filter: "blur(15px)",
            }}
          />
          <button
            onClick={() => navigate("/")}
            className={`w-full bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white py-4 px-8 rounded-full font-light text-[16px] transition-all active:scale-[0.98] ${ctaBtnShadowClass} mb-4 border border-[rgba(255,255,255,0.15)]`}
          >
            Begin Inner Trek
          </button>
        </div>

        <button
          onClick={() => navigate("/")}
          className={`text-[14px] transition-colors font-light ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
        >
          Return to home
        </button>
      </div>
    </div>
  );
}