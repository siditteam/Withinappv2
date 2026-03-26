import { useNavigate } from "react-router";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../store/ThemeContext";
import {
  filterReflections,
  getAuthors,
  getTraditions,
  getThemes,
  type Reflection,
} from "../../lib/library/libraryData";
import { ReflectionCard } from "../../components/library/ReflectionCard";
import { glassCardClass, glassSubtle } from "../../lib/glassStyles";

type FilterTab = "author" | "tradition" | "theme";

export default function Library() {
  const navigate = useNavigate();
  const { theme, backgroundTheme } = useTheme();
  const hasBackground = backgroundTheme !== "none";

  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedTradition, setSelectedTradition] = useState<string | null>(
    null,
  );
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>("author");
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );

  const authorsList = useMemo(() => getAuthors(), []);
  const traditionsList = useMemo(() => getTraditions(), []);
  const themesList = useMemo(() => getThemes(), []);

  const cards = useMemo(
    () => filterReflections(selectedAuthor, selectedTradition, selectedTheme),
    [selectedAuthor, selectedTradition, selectedTheme],
  );

  // Scroll ref for the card area
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleFilterAuthor = useCallback(
    (author: string | null) => {
      setSelectedAuthor((prev) => (prev === author ? null : author));
      setCurrentIndex(0);
      setSwipeDirection(null);
      scrollToTop();
    },
    [scrollToTop],
  );

  const handleFilterTradition = useCallback(
    (tradition: string | null) => {
      setSelectedTradition((prev) =>
        prev === tradition ? null : tradition,
      );
      setCurrentIndex(0);
      setSwipeDirection(null);
      scrollToTop();
    },
    [scrollToTop],
  );

  const handleFilterTheme = useCallback(
    (t: string | null) => {
      setSelectedTheme((prev) => (prev === t ? null : t));
      setCurrentIndex(0);
      setSwipeDirection(null);
      scrollToTop();
    },
    [scrollToTop],
  );

  const clearFilters = useCallback(() => {
    setSelectedAuthor(null);
    setSelectedTradition(null);
    setSelectedTheme(null);
    setCurrentIndex(0);
    setSwipeDirection(null);
    scrollToTop();
  }, [scrollToTop]);

  const goNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setSwipeDirection("left");
      setCurrentIndex((i) => i + 1);
      scrollToTop();
    }
  }, [currentIndex, cards.length, scrollToTop]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setSwipeDirection("right");
      setCurrentIndex((i) => i - 1);
      scrollToTop();
    }
  }, [currentIndex, scrollToTop]);

  // Touch swipe handler
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isHorizontalSwipe.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isHorizontalSwipe.current !== null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
    // Determine dominant direction after enough movement
    if (dx > 8 || dy > 8) {
      isHorizontalSwipe.current = dx > dy;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !isHorizontalSwipe.current) {
      touchStartRef.current = null;
      isHorizontalSwipe.current = null;
      return;
    }
    const diff = touchStartRef.current.x - e.changedTouches[0].clientX;
    const threshold = 50;
    if (diff > threshold) goNext();
    else if (diff < -threshold) goPrev();
    touchStartRef.current = null;
    isHorizontalSwipe.current = null;
  };

  // Mouse drag handler for desktop
  const mouseStartRef = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartRef.current === null) return;
    const diff = mouseStartRef.current - e.clientX;
    const threshold = 50;
    if (diff > threshold) goNext();
    else if (diff < -threshold) goPrev();
    mouseStartRef.current = null;
  };

  const currentCard: Reflection | undefined = cards[currentIndex];
  const hasActiveFilters = selectedAuthor || selectedTradition || selectedTheme;
  const activeFilterCount =
    (selectedAuthor ? 1 : 0) +
    (selectedTradition ? 1 : 0) +
    (selectedTheme ? 1 : 0);

  const glassCard = glassCardClass(theme);
  const glassSubtleClass = glassSubtle(theme);

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "author", label: "Author" },
    { key: "tradition", label: "Tradition" },
    { key: "theme", label: "Theme" },
  ];

  const getFilterPills = () => {
    switch (activeFilterTab) {
      case "author":
        return { items: authorsList, selected: selectedAuthor, handler: handleFilterAuthor };
      case "tradition":
        return { items: traditionsList, selected: selectedTradition, handler: handleFilterTradition };
      case "theme":
        return { items: themesList, selected: selectedTheme, handler: handleFilterTheme };
    }
  };

  const pillData = getFilterPills();

  return (
    <div
      className={`h-screen flex flex-col overflow-hidden ${
        hasBackground
          ? "bg-transparent"
          : theme === "dark"
            ? "bg-[#0F1419]"
            : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
      }`}
    >
      {/* Header */}
      <div
        className={`flex-shrink-0 z-20 backdrop-blur-[20px] border-b ${
          theme === "dark"
            ? "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.1)]"
            : "bg-[rgba(255,255,255,0.6)] border-[rgba(255,255,255,0.3)]"
        }`}
      >
        <div className="p-4 flex items-center justify-between">
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

          <h3
            className={`font-light ${
              theme === "dark" ? "text-white/70" : "text-gray-700"
            }`}
          >
            Library
          </h3>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              showFilters || hasActiveFilters
                ? "bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white"
                : theme === "dark"
                  ? "bg-white/[0.06] text-gray-400 border border-white/[0.1]"
                  : "bg-white/30 text-gray-500 border border-white/50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#5B8A72] rounded-full flex items-center justify-center">
                <span className="text-[9px] text-white">{activeFilterCount}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden z-10 flex-shrink-0"
          >
            <div
              className={`px-4 pt-3 pb-4 border-b ${glassSubtleClass}`}
            >
              {/* Active filter summary + clear */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between mb-3">
                  <p
                    className={`text-[12px] tracking-[0.1em] ${
                      theme === "dark" ? "text-white/40" : "text-gray-400"
                    }`}
                  >
                    {cards.length} reflection{cards.length !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={clearFilters}
                    className={`flex items-center gap-1 text-[12px] transition-colors ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <X className="w-3 h-3" />
                    Clear all
                  </button>
                </div>
              )}

              {/* Filter tabs */}
              <div className="flex gap-1 mb-3">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilterTab(tab.key)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-light transition-all ${
                      activeFilterTab === tab.key
                        ? theme === "dark"
                          ? "bg-white/[0.1] text-white/80"
                          : "bg-white/50 text-gray-700"
                        : theme === "dark"
                          ? "text-white/30"
                          : "text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-1.5">
                {pillData.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => pillData.handler(item)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-light transition-all active:scale-95 ${
                      pillData.selected === item
                        ? "bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white border border-[rgba(255,255,255,0.15)] shadow-[0_2px_10px_rgba(91,138,114,0.25)]"
                        : theme === "dark"
                          ? "bg-white/[0.06] text-gray-400 border border-white/[0.08]"
                          : "bg-white/30 text-gray-500 border border-white/40"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable card area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="flex flex-col items-center justify-start px-6 pt-6 pb-4 min-h-full">
          {cards.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p
                  className={`text-[16px] font-light mb-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No reflections match these filters
                </p>
                <button
                  onClick={clearFilters}
                  className={`px-6 py-2 rounded-full text-[14px] font-light transition-all ${glassCard} ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard.id}
                  initial={{
                    opacity: 0,
                    x:
                      swipeDirection === "left"
                        ? 60
                        : swipeDirection === "right"
                          ? -60
                          : 0,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: swipeDirection === "left" ? -60 : 60,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <ReflectionCard reflection={currentCard} theme={theme} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      {cards.length > 0 && (
        <div
          className={`flex-shrink-0 py-4 flex flex-col items-center gap-2 border-t backdrop-blur-[12px] ${
            theme === "dark"
              ? "bg-[rgba(0,0,0,0.2)] border-[rgba(255,255,255,0.04)]"
              : "bg-[rgba(255,255,255,0.3)] border-[rgba(255,255,255,0.2)]"
          }`}
        >
          <div className="flex items-center gap-6">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                currentIndex === 0
                  ? "opacity-20 cursor-default"
                  : "opacity-70"
              } ${
                theme === "dark"
                  ? "bg-white/[0.06] text-white border border-white/[0.08]"
                  : "bg-white/30 text-gray-600 border border-white/40"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 12L6 8L10 4" />
              </svg>
            </button>

            <p
              className={`text-[12px] tracking-[0.1em] tabular-nums ${
                theme === "dark" ? "text-white/30" : "text-gray-400"
              }`}
            >
              {currentIndex + 1} / {cards.length}
            </p>

            <button
              onClick={goNext}
              disabled={currentIndex === cards.length - 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                currentIndex === cards.length - 1
                  ? "opacity-20 cursor-default"
                  : "opacity-70"
              } ${
                theme === "dark"
                  ? "bg-white/[0.06] text-white border border-white/[0.08]"
                  : "bg-white/30 text-gray-600 border border-white/40"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 4L10 8L6 12" />
              </svg>
            </button>
          </div>

          <p
            className={`text-[11px] tracking-[0.05em] ${
              theme === "dark" ? "text-white/15" : "text-gray-300"
            }`}
          >
            swipe to explore
          </p>
        </div>
      )}
    </div>
  );
}