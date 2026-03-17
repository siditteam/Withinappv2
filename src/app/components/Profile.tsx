import { Trophy, Clock, Target, ChevronRight, Bell, HelpCircle, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "../contexts/ThemeContext";
import { glassCardClass, glassElevated, glowIconShadow } from "../utils/glassStyles";

export default function Profile() {
  const navigate = useNavigate();
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";

  const glassCard = glassCardClass(theme);
  const stats = [
    { icon: Clock, label: "Lifetime meditation", value: "127h 34m", glowColor: "rgba(91,138,114,0.2)" },
    { icon: Target, label: "Practices completed", value: "243", glowColor: "rgba(122,111,155,0.2)" },
    { icon: Trophy, label: "Inquiries explored", value: "64", glowColor: "rgba(107,142,158,0.2)" },
  ];

  const menuItems = [
    { icon: Bell, label: "Notifications", color: theme === "dark" ? "text-[#5B8A72]" : "text-[#4A5DB8]", action: () => {} },
    { icon: Settings, label: "Settings", color: theme === "dark" ? "text-gray-400" : "text-gray-600", action: () => navigate("/settings") },
    { icon: HelpCircle, label: "Help & Support", color: theme === "dark" ? "text-gray-400" : "text-gray-600", action: () => {} },
    { icon: LogOut, label: "Log out", color: "text-red-400", action: () => {} },
  ];

  return (
    <div className={`p-6 pb-8 min-h-screen ${
      hasBackground ? "bg-transparent" : theme === "dark" ? "bg-gradient-to-b from-[#0F1419] to-[#1A1F2E]" : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
    }`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`mb-8 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Profile</h1>
        
        {/* User Info */}
        <div className="flex items-center gap-4 mb-6 relative">
          {/* Glow behind avatar */}
          <div
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(91,138,114,0.25) 0%, rgba(61,90,128,0.15) 40%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <div className="w-20 h-20 bg-gradient-to-br from-[#3D5A80] to-[#5B8A72] rounded-full flex items-center justify-center text-white text-[26px] font-light relative z-[1]" style={{ boxShadow: "0 0 24px rgba(91,138,114,0.3), 0 8px 20px rgba(61,90,128,0.15)" }}>
            JD
          </div>
          <div className="relative z-[1]">
            <h2 className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>John Doe</h2>
            <p className={`text-[14px] font-extralight tracking-[0.015em] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Diving deep since January 2024</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 relative">
        {/* Section glow */}
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(91,138,114,0.15) 0%, rgba(122,111,155,0.08) 40%, transparent 65%)"
              : "radial-gradient(ellipse at center, rgba(91,138,114,0.06) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}
        />
        <h3 className={`mb-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Your journey</h3>
        <div className="space-y-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="relative">
                <div
                  className="absolute -inset-1 -z-10 pointer-events-none rounded-[22px]"
                  style={{
                    background: `radial-gradient(ellipse at center, ${theme === "dark" ? stat.glowColor : stat.glowColor.replace("0.2", "0.08")} 0%, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />
                <div className={`rounded-[22px] p-4 flex items-center gap-4 ${glassCard}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-white/10 border border-white/15" : index === 0 ? "bg-[#E8F5E9]/80" : index === 1 ? "bg-[#F3E5F5]/80" : "bg-[#E1F5FE]/80"
                  } ${index === 0 ? "text-[#5B8A72]" : index === 1 ? "text-[#7A6F9B]" : "text-[#6B8E9E]"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-[14px] font-extralight tracking-[0.015em] ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</p>
                    <p className={`text-[20px] font-light ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone */}
      <div className="mb-8 relative">
        {/* Milestone glow */}
        <div
          className="absolute -inset-4 -z-10 pointer-events-none"
          style={{
            background: theme === "dark"
              ? "radial-gradient(ellipse at center, rgba(74,93,184,0.2) 0%, rgba(122,111,155,0.1) 45%, transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(74,93,184,0.08) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <h3 className={`mb-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Recent milestone</h3>
        <div className={`rounded-[22px] p-6 text-white ${glassCard} ${theme === "dark" ? "!bg-[rgba(47,53,72,0.6)]" : "!bg-gradient-to-br !from-[rgba(74,93,184,0.85)] !to-[rgba(107,124,216,0.85)]"}`}>
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-8 h-8" />
            <div>
              <h4 className="font-light">100 Hours</h4>
              <p className={`text-[14px] font-light ${theme === "dark" ? "opacity-80" : "opacity-90"}`}>Reached 100 lifetime meditation hours</p>
            </div>
          </div>
          <p className={`text-[12px] italic font-light ${theme === "dark" ? "opacity-70" : "opacity-75"}`}>
            "The journey of a thousand miles continues with each single step"
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className={`w-full rounded-[22px] p-4 flex items-center justify-between transition-transform active:scale-98 ${glassCard}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${item.color}`} />
                <span className={`text-[16px] font-light ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.label}</span>
              </div>
              <ChevronRight className={`w-5 h-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
            </button>
          );
        })}
      </div>

      {/* App Version */}
      <div className="mt-8 text-center">
        <p className={`text-[14px] font-light ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>Within v1.0.0</p>
      </div>
    </div>
  );
}