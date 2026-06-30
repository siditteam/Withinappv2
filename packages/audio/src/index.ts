import { useSyncExternalStore } from "react";
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioSource, type AudioStatus } from "expo-audio";

export const audioPackageName = "@within/audio" as const;

export type AudioEngineState = "idle" | "loading" | "playing" | "paused" | "stopped" | "finished" | "error";

export interface AudioEngineSnapshot {
  readonly state: AudioEngineState;
  readonly trackId: string | null;
  readonly positionSeconds: number;
  readonly durationSeconds: number;
  readonly errorMessage: string | null;
}

type Listener = (snapshot: AudioEngineSnapshot) => void;

const idleSnapshot: AudioEngineSnapshot = {
  state: "idle",
  trackId: null,
  positionSeconds: 0,
  durationSeconds: 0,
  errorMessage: null,
};

// There is exactly one of these for the whole app -- AudioEngine is never
// constructed directly, only accessed through the exported `audioEngine`
// singleton below, so there is only ever one audio instance/state machine.
class AudioEngine {
  private player: AudioPlayer | null = null;
  private removeListener: (() => void) | null = null;
  private snapshot: AudioEngineSnapshot = idleSnapshot;
  private listeners = new Set<Listener>();
  private audioModeReady: Promise<void> | null = null;

  getSnapshot(): AudioEngineSnapshot {
    return this.snapshot;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async play(trackId: string, source: AudioSource): Promise<void> {
    if (this.player && this.snapshot.trackId === trackId && this.snapshot.state === "paused") {
      this.player.play();
      this.update({ state: "playing" });
      return;
    }

    this.teardown();
    this.update({ ...idleSnapshot, state: "loading", trackId });

    try {
      await this.ensureAudioMode();
      const player = createAudioPlayer(source);
      this.player = player;
      const subscription = player.addListener("playbackStatusUpdate", (status: AudioStatus) => {
        this.handleStatus(status);
      });
      this.removeListener = () => subscription.remove();
      player.play();
    } catch {
      this.update({ state: "error", errorMessage: "This audio couldn't be played." });
    }
  }

  pause(): void {
    if (!this.player || this.snapshot.state !== "playing") return;
    this.player.pause();
    this.update({ state: "paused" });
  }

  resume(): void {
    if (!this.player || this.snapshot.state !== "paused") return;
    this.player.play();
    this.update({ state: "playing" });
  }

  stop(): void {
    if (!this.player) return;
    this.player.pause();
    this.player.seekTo(0);
    this.update({ state: "stopped", positionSeconds: 0 });
  }

  private async ensureAudioMode(): Promise<void> {
    if (!this.audioModeReady) {
      this.audioModeReady = setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: "duckOthers",
      });
    }
    await this.audioModeReady;
  }

  private handleStatus(status: AudioStatus): void {
    if (status.didJustFinish) {
      // Distinct from "stopped" (user-initiated) so listeners can tell a
      // track playing all the way through apart from being cut short.
      this.update({ state: "finished", positionSeconds: 0 });
      return;
    }
    this.update({
      positionSeconds: status.currentTime ?? 0,
      durationSeconds: status.duration ?? 0,
      state: status.playing ? "playing" : this.snapshot.state,
    });
  }

  private teardown(): void {
    this.removeListener?.();
    this.removeListener = null;
    this.player?.remove();
    this.player = null;
  }

  private update(partial: Partial<AudioEngineSnapshot>): void {
    this.snapshot = { ...this.snapshot, ...partial };
    this.listeners.forEach((listener) => listener(this.snapshot));
  }
}

export const audioEngine = new AudioEngine();

export function useAudioEngineSnapshot(): AudioEngineSnapshot {
  return useSyncExternalStore(
    (onStoreChange) => audioEngine.subscribe(onStoreChange),
    () => audioEngine.getSnapshot(),
  );
}
