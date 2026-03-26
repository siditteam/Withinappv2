import { Volume2, VolumeX } from "lucide-react";

type AmbientAudioControlsProps = {
  className?: string;
  isMuted: boolean;
  onToggleMuted: () => void;
  onVolumeChange: (volume: number) => void;
  theme: "dark" | "light";
  volume: number;
};

export function AmbientAudioControls({
  className = "",
  isMuted,
  onToggleMuted,
  onVolumeChange,
  theme,
  volume,
}: AmbientAudioControlsProps) {
  const shellClass = theme === "dark"
    ? "bg-white/8 border border-white/12 text-white/75"
    : "bg-white/60 border border-white/70 text-gray-700";

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full px-3 py-2 backdrop-blur-xl ${shellClass} ${className}`.trim()}
    >
      <button
        type="button"
        onClick={onToggleMuted}
        className="flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-[0.94]"
        aria-label={isMuted ? "Unmute ambient audio" : "Mute ambient audio"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(event) => onVolumeChange(Number(event.target.value))}
        className="h-1.5 w-20 accent-[#7AA6FF]"
        aria-label="Ambient audio volume"
      />
    </div>
  );
}