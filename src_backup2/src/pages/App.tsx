import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import logoEntryVideo from "../assets/LOGO ENTRY.mp4";

const INTRO_SEEN_KEY = "within-intro-seen";

export default function App() {
  const [showIntro, setShowIntro] = useState(
    () => localStorage.getItem(INTRO_SEEN_KEY) !== "1",
  );

  const dismissIntro = () => {
    localStorage.setItem(INTRO_SEEN_KEY, "1");
    setShowIntro(false);
  };

  useEffect(() => {
    if (!showIntro) {
      return;
    }

    const fallback = window.setTimeout(dismissIntro, 4500);
    return () => window.clearTimeout(fallback);
  }, [showIntro]);

  if (showIntro) {
    return (
      <button
        type="button"
        className="startup-intro"
        onClick={dismissIntro}
        aria-label="Skip intro"
      >
        <video
          className="startup-intro__video"
          src={logoEntryVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={dismissIntro}
          onError={dismissIntro}
        />
      </button>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
