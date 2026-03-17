import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { backgroundImages, bgStarTrails } from "./backgroundImages";

function AppContainer() {
  const { theme, backgroundTheme } = useTheme();

  const hasBackground = backgroundTheme !== "none";
  const currentBg = hasBackground ? (backgroundImages[backgroundTheme] || bgStarTrails) : null;

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-[#0A0E27]" : "bg-[#E8EDF2]"}`}>
      <div
        className={`w-full max-w-[430px] min-h-screen shadow-2xl relative overflow-hidden ${
          hasBackground
            ? theme === "dark" ? "bg-[#0F1419]" : "bg-[#F7F5F2]"
            : theme === "dark" ? "bg-[#0F1419]" : "bg-[#F7F5F2]"
        }`}
      >
        {/* Fixed background image */}
        {hasBackground && currentBg && (
          <div
            className="fixed inset-0 w-full max-w-[430px] mx-auto h-full z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${currentBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
        {/* Light mode overlay to soften background images */}
        {hasBackground && currentBg && theme === "light" && (
          <div className="fixed inset-0 w-full max-w-[430px] mx-auto h-full z-0 pointer-events-none bg-white/60" />
        )}
        <div className="relative z-[1]">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContainer />
    </ThemeProvider>
  );
}