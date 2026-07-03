import { useSyncExternalStore } from "react";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
export const audioPackageName = "@within/audio";
const idleSnapshot = {
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
    player = null;
    removeListener = null;
    snapshot = idleSnapshot;
    listeners = new Set();
    audioModeReady = null;
    getSnapshot() {
        return this.snapshot;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    async play(trackId, source) {
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
            const subscription = player.addListener("playbackStatusUpdate", (status) => {
                this.handleStatus(status);
            });
            this.removeListener = () => subscription.remove();
            player.play();
        }
        catch {
            this.update({ state: "error", errorMessage: "This audio couldn't be played." });
        }
    }
    pause() {
        if (!this.player || this.snapshot.state !== "playing")
            return;
        this.player.pause();
        this.update({ state: "paused" });
    }
    resume() {
        if (!this.player || this.snapshot.state !== "paused")
            return;
        this.player.play();
        this.update({ state: "playing" });
    }
    stop() {
        if (!this.player)
            return;
        this.player.pause();
        this.player.seekTo(0);
        this.update({ state: "stopped", positionSeconds: 0 });
    }
    async ensureAudioMode() {
        if (!this.audioModeReady) {
            this.audioModeReady = setAudioModeAsync({
                playsInSilentMode: true,
                shouldPlayInBackground: false,
                interruptionMode: "duckOthers",
            });
        }
        await this.audioModeReady;
    }
    handleStatus(status) {
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
    teardown() {
        this.removeListener?.();
        this.removeListener = null;
        this.player?.remove();
        this.player = null;
    }
    update(partial) {
        this.snapshot = { ...this.snapshot, ...partial };
        this.listeners.forEach((listener) => listener(this.snapshot));
    }
}
export const audioEngine = new AudioEngine();
export function useAudioEngineSnapshot() {
    return useSyncExternalStore((onStoreChange) => audioEngine.subscribe(onStoreChange), () => audioEngine.getSnapshot());
}
