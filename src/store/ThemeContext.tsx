import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";
type BackgroundTheme = "none" | "starry-rain" | "blue-nebula" | "star-trails" | "light-rays";
type PracticeMode = "easy" | "modify";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (bg: BackgroundTheme) => void;
  practiceMode: PracticeMode;
  setPracticeMode: (mode: PracticeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Map backgrounds to their preferred theme for readability
const backgroundPreferredTheme: Record<BackgroundTheme, Theme | null> = {
  "none": null,           // no auto-switch
  "star-trails": "dark",
  "starry-rain": "dark",
  "blue-nebula": "dark",
  "light-rays": "light",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("divedeep-theme");
    return (saved as Theme) || "light";
  });

  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>(() => {
    const saved = localStorage.getItem("within-bg-theme");
    return (saved as BackgroundTheme) || "light-rays";
  });

  const [practiceMode, setPracticeMode] = useState<PracticeMode>(() => {
    const saved = localStorage.getItem("within-practice-mode");
    return (saved as PracticeMode) || "easy";
  });

  useEffect(() => {
    localStorage.setItem("divedeep-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("within-bg-theme", backgroundTheme);
  }, [backgroundTheme]);

  // Auto-switch theme when background changes
  useEffect(() => {
    const preferred = backgroundPreferredTheme[backgroundTheme];
    if (preferred && preferred !== theme) {
      setTheme(preferred);
    }
    // Only react to background changes, not theme changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundTheme]);

  useEffect(() => {
    localStorage.setItem("within-practice-mode", practiceMode);
  }, [practiceMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, backgroundTheme, setBackgroundTheme, practiceMode, setPracticeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}