/**
 * audioEngine.ts
 *
 * Singleton audio engine for guided session playback.
 *
 * Manages two independent HTMLAudioElement instances:
 *   - voice  : the guided narration track (full volume)
 *   - background : the ambient track (lower volume, looped)
 *
 * Guarantees:
 *   - No overlapping playback: any prior session is fully stopped before a new one starts.
 *   - Clean teardown on stop: src cleared, events removed, elements released.
 *   - Independent volume and mute control per channel.
 */

import { getSessionAudio, guidedSessions } from "../lib/audioConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SessionKey = keyof typeof guidedSessions;

export interface AudioEngineState {
  isPlaying: boolean;
  isPaused: boolean;
  sessionKey: SessionKey | null;
  durationMinutes: number | null;
  voiceVolume: number;
  backgroundVolume: number;
}

type StateListener = (state: AudioEngineState) => void;

// ─── Default volumes ──────────────────────────────────────────────────────────

const DEFAULT_VOICE_VOLUME = 1.0;
/** Background sits at 0.28 — audible ambience without competing with the voice. */
const DEFAULT_BG_VOLUME = 0.28;

// ─── Fade helper ──────────────────────────────────────────────────────────────

/**
 * Smoothly ramp an audio element's volume from its current level to `target`
 * over `durationMs` milliseconds using requestAnimationFrame.
 * Returns a cancel function that stops the ramp immediately.
 */
function fadeTo(
  el: HTMLAudioElement,
  target: number,
  durationMs: number,
  onComplete?: () => void,
): () => void {
  const start = el.volume;
  const delta = target - start;
  let startTime: number | null = null;
  let rafId: number;

  function step(now: number) {
    if (startTime === null) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    // ease-out cubic for a natural feel
    const eased = 1 - Math.pow(1 - progress, 3);
    el.volume = Math.min(1, Math.max(0, start + delta * eased));
    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      onComplete?.();
    }
  }

  rafId = requestAnimationFrame(step);
  return () => cancelAnimationFrame(rafId);
}

// ─── Engine ───────────────────────────────────────────────────────────────────

class AudioEngine {
  private voice: HTMLAudioElement | null = null;
  private background: HTMLAudioElement | null = null;

  /** Cancel function for any in-progress background fade. */
  private cancelBgFade: (() => void) | null = null;
  /** Cancel function for any in-progress voice fade. */
  private cancelVoiceFade: (() => void) | null = null;

  private _voiceVolume = DEFAULT_VOICE_VOLUME;
  private _bgVolume = DEFAULT_BG_VOLUME;

  private _state: AudioEngineState = {
    isPlaying: false,
    isPaused: false,
    sessionKey: null,
    durationMinutes: null,
    voiceVolume: DEFAULT_VOICE_VOLUME,
    backgroundVolume: DEFAULT_BG_VOLUME,
  };

  private listeners = new Set<StateListener>();

  // ── State helpers ──────────────────────────────────────────────────────────

  private setState(patch: Partial<AudioEngineState>) {
    this._state = { ...this._state, ...patch };
    this.listeners.forEach((fn) => fn(this._state));
  }

  getState(): AudioEngineState {
    return { ...this._state };
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ── Internal helpers ───────────────────────────────────────────────────────

  private createAudio(src: string, loop = false, volume = 1.0): HTMLAudioElement {
    const el = new Audio();
    el.preload = "auto";
    el.src = src;
    el.loop = loop;
    el.volume = Math.min(1, Math.max(0, volume));
    return el;
  }

  /** Cancel any running fades so they don't fire on stale elements. */
  private cancelAllFades(): void {
    this.cancelBgFade?.();
    this.cancelBgFade = null;
    this.cancelVoiceFade?.();
    this.cancelVoiceFade = null;
  }

  /** Fully stop and release an audio element. */
  private teardown(el: HTMLAudioElement | null): void {
    if (!el) return;
    el.pause();
    el.src = "";
    el.load(); // reset network state
  }

  /** Stop both channels and release all resources. */
  private teardownAll(): void {
    this.cancelAllFades();
    this.teardown(this.voice);
    this.teardown(this.background);
    this.voice = null;
    this.background = null;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Start a guided session.
   * Stops any currently playing audio first, then loads and plays both tracks.
   *
   * @param sessionKey  - Key from `guidedSessions` (e.g. "witness", "breathing")
   * @param durationMinutes - Duration in minutes (5 | 10 | 22 or any stored duration)
   */
  async playSessionAudio(sessionKey: SessionKey, durationMinutes: number): Promise<void> {
    console.log(`[AudioEngine] playSessionAudio — sessionKey="${sessionKey}" duration=${durationMinutes} min`);

    // Stop anything already playing — no overlap
    this.teardownAll();
    this.setState({ isPlaying: false, isPaused: false });

    const audio = getSessionAudio(sessionKey, durationMinutes);

    // DEBUG: log resolved audio object and paths
    console.log("[AudioEngine] getSessionAudio result:", audio);
    if (audio) {
      console.log("[AudioEngine] voice URL    :", audio.voice);
      console.log("[AudioEngine] background URL:", audio.background);
    }

    if (!audio) {
      console.warn(`[AudioEngine] No audio found for session "${sessionKey}" at ${durationMinutes} min`);
      return;
    }

    // Voice plays at full target volume immediately
    this.voice = this.createAudio(audio.voice, false, this._voiceVolume);

    // DEBUG: voice element lifecycle events
    this.voice.onloadeddata = () => console.log("[AudioEngine] voice → loadeddata");
    this.voice.oncanplay    = () => console.log("[AudioEngine] voice → canplay");
    this.voice.onplay       = () => console.log("[AudioEngine] voice → play");
    this.voice.onerror      = () => console.error("[AudioEngine] voice → error", this.voice?.error);

    // DEBUG: background audio disabled — testing voice-only playback
    // this.background = this.createAudio(audio.background, true, 0);

    // When voice ends, stop cleanly
    this.voice.addEventListener("ended", () => {
      this._fadeOutAndStop();
    }, { once: true });

    this.setState({
      isPlaying: true,
      isPaused: false,
      sessionKey,
      durationMinutes,
    });

    // Play voice only
    const results = await Promise.allSettled([
      this.voice.play(),
      // this.background.play(),  // DEBUG: disabled
    ]);

    const anyBlocked = results.some((r) => r.status === "rejected");
    if (anyBlocked) {
      console.warn("[AudioEngine] Autoplay blocked.");
      this.setState({ isPlaying: false, isPaused: true });
      return;
    }

    // DEBUG: background fade disabled
    // const bg = this.background;
    // const targetBgVol = this._bgVolume;
    // this.cancelBgFade = fadeTo(bg, targetBgVol, 2500);
  }

  /** Fade out both tracks then tear everything down. */
  private _fadeOutAndStop(): void {
    const voice = this.voice;
    const bg = this.background;

    this.cancelAllFades();

    let pending = 0;
    const done = () => {
      pending--;
      if (pending <= 0) {
        this.teardownAll();
        this.setState({
          isPlaying: false,
          isPaused: false,
          sessionKey: null,
          durationMinutes: null,
        });
      }
    };

    if (voice) {
      pending++;
      this.cancelVoiceFade = fadeTo(voice, 0, 400, done);
    }
    if (bg) {
      pending++;
      this.cancelBgFade = fadeTo(bg, 0, 2000, done);
    }
    if (pending === 0) {
      this.teardownAll();
      this.setState({ isPlaying: false, isPaused: false, sessionKey: null, durationMinutes: null });
    }
  }

  /**
   * Pause both channels with a quick background fade-down.
   * State is preserved so resumeAudio() can restore it.
   */
  pauseAudio(): void {
    if (!this._state.isPlaying) return;
    this.cancelAllFades();
    // Fade background down quickly before pausing
    const bg = this.background;
    if (bg) {
      this.cancelBgFade = fadeTo(bg, 0, 600, () => bg.pause());
    }
    this.voice?.pause();
    this.setState({ isPlaying: false, isPaused: true });
  }

  /**
   * Resume from a paused state — background fades back in.
   */
  async resumeAudio(): Promise<void> {
    if (!this._state.isPaused) return;
    const results = await Promise.allSettled([
      this.voice?.play(),
      this.background?.play(),
    ]);
    const anyBlocked = results.some((r) => r.status === "rejected");
    if (!anyBlocked) {
      this.setState({ isPlaying: true, isPaused: false });
      // Fade background back in over 1.5 s
      if (this.background) {
        const bg = this.background;
        this.cancelBgFade = fadeTo(bg, this._bgVolume, 1500);
      }
    }
  }

  /**
   * Fully stop playback: fade out voice quickly, fade out background slowly,
   * then release all resources. No abrupt cuts.
   */
  stopAudio(): void {
    if (!this.voice && !this.background) return;
    this._fadeOutAndStop();
  }

  // ── Volume control ─────────────────────────────────────────────────────────

  setVoiceVolume(volume: number): void {
    this._voiceVolume = Math.min(1, Math.max(0, volume));
    if (this.voice) this.voice.volume = this._voiceVolume;
    this.setState({ voiceVolume: this._voiceVolume });
  }

  setBackgroundVolume(volume: number): void {
    this._bgVolume = Math.min(1, Math.max(0, volume));
    if (this.background) this.background.volume = this._bgVolume;
    this.setState({ backgroundVolume: this._bgVolume });
  }

  muteVoice(muted: boolean): void {
    if (this.voice) this.voice.muted = muted;
  }

  muteBackground(muted: boolean): void {
    if (this.background) this.background.muted = muted;
  }
}

// ─── Singleton export ─────────────────────────────────────────────────────────

export const audioEngine = new AudioEngine();
