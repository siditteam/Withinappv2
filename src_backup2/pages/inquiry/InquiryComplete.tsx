import { useNavigate, useParams } from "react-router";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "../../contexts/ThemeContext";
import { inquiries } from "../../lib/inquiry/inquiryData";
import { glassCardClass, ctaBtnShadowClass, glowIconShadow } from "../../utils/glassStyles";

export default function InquiryComplete() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();

  const inquiry = inquiries.find((i) => i.id === Number(id));

  if (!inquiry) {
    navigate("/inquiry");
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full text-center"
      >
        {/* Success icon with glow halo */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${inquiry.color}45 0%, ${inquiry.color}20 40%, transparent 65%)`,
              filter: "blur(35px)",
              transform: "scale(2.5)",
            }}
          />
          <div className={`w-20 h-20 bg-gradient-to-br from-[#3D5A80] to-[#5B8A72] rounded-full flex items-center justify-center mx-auto ${glowIconShadow()}`}>
            <Check className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`mb-3 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {inquiry.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`text-[14px] font-extralight tracking-[0.03em] mb-10 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Inquiry Complete
        </motion.p>

        {/* Instruction repeated */}
        <motion.div
          className="relative mb-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute -inset-4 -z-10 pointer-events-none rounded-[24px]"
            style={{
              background: `radial-gradient(ellipse at center, ${inquiry.color}22 0%, transparent 65%)`,
              filter: "blur(35px)",
            }}
          />
          <div
            className={`rounded-[22px] p-6 ${glassCardClass(theme)}`}
          >
            <p
              className={`text-[17px] font-extralight italic leading-[1.85] tracking-[0.02em] ${
                theme === "dark" ? "text-white/80" : "text-gray-700"
              }`}
            >
              "{inquiry.instruction}"
            </p>
          </div>
        </motion.div>

        {/* Continue to Trek button */}
        <motion.div
          className="relative mb-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute -inset-2 -z-10 pointer-events-none rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(91,138,114,0.25) 0%, transparent 70%)",
              filter: "blur(15px)",
            }}
          />
          <button
            onClick={() => navigate(`/inquiry/${id}/trek-transition`)}
            className={`w-full bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white py-4 px-8 rounded-full font-light text-[16px] transition-all active:scale-[0.98] ${ctaBtnShadowClass} border border-[rgba(255,255,255,0.15)]`}
          >
            Continue to Inner Trek
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={() => navigate("/inquiry")}
          className={`text-[14px] transition-colors font-light ${
            theme === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Return to inquiries
        </motion.button>
      </motion.div>
    </div>
  );
}