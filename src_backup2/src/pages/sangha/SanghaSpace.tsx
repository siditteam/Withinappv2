import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Users, Circle } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { glassCardClass, glassElevated, glassSubtle, ctaBtnShadowClass } from "../../utils/glassStyles";

interface Group {
  id: string;
  name: string;
  intention: string;
  activeSitters: number;
  createdBy: string;
}

const MOCK_GROUPS: Group[] = [
  { id: "1", name: "Morning Stillness", intention: "Resting in awareness before the day begins", activeSitters: 34, createdBy: "Ananda" },
  { id: "2", name: "Heart Space", intention: "Opening to love without condition", activeSitters: 12, createdBy: "Maya" },
  { id: "3", name: "The Void", intention: "Sitting with the unknown", activeSitters: 87, createdBy: "Ravi" },
  { id: "4", name: "Breath Circle", intention: "Simply breathing together", activeSitters: 156, createdBy: "Lena" },
  { id: "5", name: "Presence", intention: "Being here, now", activeSitters: 8, createdBy: "Kai" },
];

function useSimulatedGlobalCount() {
  const [count, setCount] = useState(12_347);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(11_800, c + delta);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

export default function SanghaSpace() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const globalCount = useSimulatedGlobalCount();
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIntention, setNewIntention] = useState("");

  const glass = glassCardClass(theme);
  const elevated = glassElevated(theme);
  const subtle = glassSubtle(theme);

  const handleCreate = useCallback(() => {
    if (!newName.trim()) return;
    const g: Group = {
      id: Date.now().toString(),
      name: newName.trim(),
      intention: newIntention.trim() || "Silent presence",
      activeSitters: 1,
      createdBy: "You",
    };
    setGroups((prev) => [g, ...prev]);
    setNewName("");
    setNewIntention("");
    setShowCreate(false);
  }, [newName, newIntention]);

  const formatCount = (n: number) => n.toLocaleString();

  return (
    <div
      className={`min-h-screen p-6 pb-32 ${
        theme === "dark" ? "bg-[#0F1419]" : "bg-gradient-to-b from-[#F5F7FA] to-[#E8EDF2]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pt-2">
        <button
          onClick={() => navigate("/explore")}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            theme === "dark" ? "bg-white/8 border border-white/12" : "bg-white/50 border border-white/60"
          }`}
        >
          <ArrowLeft className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />
        </button>
        <h1 className={`tracking-[0.15em] ${theme === "dark" ? "text-white" : "text-[#2A3580]"}`}>SANGHA</h1>
      </div>

      {/* Global Live Counter — the hero */}
      <div className="relative mb-10">
        {/* Glow halo */}
        <div
          className="absolute -inset-6 -z-10 pointer-events-none"
          style={{
            background:
              theme === "dark"
                ? "radial-gradient(ellipse at center, rgba(91,138,114,0.25) 0%, rgba(74,93,184,0.12) 40%, transparent 70%)"
                : "radial-gradient(ellipse at center, rgba(91,138,114,0.12) 0%, rgba(74,93,184,0.06) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div className={`rounded-[22px] p-8 text-center ${elevated}`}>
          {/* Pulsing green dot */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            </span>
            <span
              className={`text-[12px] tracking-[0.08em] uppercase ${
                theme === "dark" ? "text-emerald-400/80" : "text-emerald-600/80"
              }`}
            >
              Live now
            </span>
          </div>

          {/* Count */}
          <p
            className={`text-[48px] font-extralight tracking-tight leading-none mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {formatCount(globalCount)}
          </p>
          <p
            className={`text-[14px] font-extralight tracking-[0.03em] ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            souls sitting in silence together
          </p>

          {/* Enter silence CTA */}
          <button
            onClick={() => navigate("/sangha/session")}
            className={`mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white text-[14px] font-light tracking-[0.04em] transition-transform active:scale-95 ${ctaBtnShadowClass}`}
          >
            Sit in silence
          </button>
        </div>
      </div>

      {/* Section: Groups */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>Meditation circles</h2>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
            theme === "dark" ? "bg-white/8 border border-white/15" : "bg-white/50 border border-white/60"
          }`}
        >
          <Plus className={`w-4 h-4 ${theme === "dark" ? "text-white" : "text-gray-700"}`} />
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className={`rounded-[22px] p-5 mb-5 ${glass}`}>
          <p className={`text-[12px] mb-3 tracking-[0.06em] uppercase ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            Create a circle
          </p>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Circle name"
            maxLength={32}
            className={`w-full rounded-xl px-4 py-2.5 mb-3 text-[14px] font-light outline-none ${
              theme === "dark"
                ? "bg-white/6 border border-white/10 text-white placeholder:text-gray-500"
                : "bg-white/50 border border-white/60 text-gray-900 placeholder:text-gray-400"
            }`}
          />
          <input
            value={newIntention}
            onChange={(e) => setNewIntention(e.target.value)}
            placeholder="Set an intention (optional)"
            maxLength={80}
            className={`w-full rounded-xl px-4 py-2.5 mb-4 text-[14px] font-light outline-none ${
              theme === "dark"
                ? "bg-white/6 border border-white/10 text-white placeholder:text-gray-500"
                : "bg-white/50 border border-white/60 text-gray-900 placeholder:text-gray-400"
            }`}
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim()}
            className={`w-full py-2.5 rounded-full text-[14px] font-light tracking-[0.03em] transition-all active:scale-95 disabled:opacity-40 ${
              theme === "dark"
                ? "bg-gradient-to-r from-[#3D5A80] to-[#5B8A72] text-white"
                : "bg-[#4A5DB8] text-white"
            } ${ctaBtnShadowClass}`}
          >
            Create circle
          </button>
        </div>
      )}

      {/* Group list */}
      <div className="space-y-3">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => navigate("/sangha/session", { state: { group: g } })}
            className={`w-full text-left rounded-[22px] p-4 transition-transform active:scale-[0.98] ${glass}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-[#3D5A80] to-[#5B8A72]"
                    : "bg-[#4A5DB8]"
                }`}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{g.name}</h3>
                </div>
                <p
                  className={`text-[13px] font-extralight leading-[1.6] mb-1.5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {g.intention}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span
                    className={`text-[12px] font-light ${
                      theme === "dark" ? "text-emerald-400/70" : "text-emerald-600/70"
                    }`}
                  >
                    {g.activeSitters} sitting
                  </span>
                  <span className={`text-[12px] ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>·</span>
                  <span className={`text-[12px] font-extralight ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                    by {g.createdBy}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
