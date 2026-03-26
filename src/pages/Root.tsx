import { Outlet, NavLink } from "react-router";
import { Home, Compass, User } from "lucide-react";
import { useTheme } from "../store/ThemeContext";

export default function Root() {
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";

  return (
    <div className={`h-screen flex flex-col max-w-md mx-auto ${
      hasBackground ? "bg-transparent" : theme === "dark" ? "bg-[#0F1419]" : "bg-[#F7F5F2]"
    }`}>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t py-3 safe-area-inset-bottom backdrop-blur-[20px] ${
        theme === "dark"
          ? "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.1)]"
          : hasBackground
            ? "bg-[rgba(255,255,255,0.4)] border-[rgba(255,255,255,0.2)]"
            : "bg-[rgba(255,255,255,0.7)] border-[rgba(200,200,200,0.3)]"
      }`}>
        <div className="flex items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 transition-colors ${
                isActive ? (theme === "dark" ? "text-[#5B8A72]" : "text-[#4A5DB8]") : (theme === "dark" ? "text-gray-500" : "text-gray-400")
              }`
            }
          >
            <Home className="w-6 h-6" />
            <span className="text-[11px] tracking-[0.04em]">Daily Practice</span>
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 transition-colors ${
                isActive ? (theme === "dark" ? "text-[#5B8A72]" : "text-[#4A5DB8]") : (theme === "dark" ? "text-gray-500" : "text-gray-400")
              }`
            }
          >
            <Compass className="w-6 h-6" />
            <span className="text-[11px] tracking-[0.04em]">Explore</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 transition-colors ${
                isActive ? (theme === "dark" ? "text-[#5B8A72]" : "text-[#4A5DB8]") : (theme === "dark" ? "text-gray-500" : "text-gray-400")
              }`
            }
          >
            <User className="w-6 h-6" />
            <span className="text-[11px] tracking-[0.04em]">Profile</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}