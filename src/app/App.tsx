import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import logoEntryVideo from "../assets/LOGO ENTRY.mp4";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const fallback = window.setTimeout(() => setShowIntro(false), 9000);
    return () => window.clearTimeout(fallback);
  }, []);

  if (showIntro) {
    return (
      <div className="startup-intro" role="presentation" aria-hidden="true">
        <video
          className="startup-intro__video"
          src={logoEntryVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setShowIntro(false)}
          onError={() => setShowIntro(false)}
        />
      </div>
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
