import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Text } from "@/components/Themed";
import { ControlButton } from "@/components/ControlButton";
import { ErrorState } from "@/components/EmptyState";
import { formatClock, formatDuration } from "@/utils/format";
import type { PlayableAudioSource } from "@/data";
import { audioEngine, useAudioEngineSnapshot } from "@within/audio";

interface TrackPlayerProps {
  trackId: string;
  source: PlayableAudioSource;
  // Duration from the content row, shown before playback starts (the engine
  // only knows the real duration once the track is loaded).
  durationSeconds?: number | null;
}

// Play/pause controls for listening content (talks, learn episodes) --
// unlike practice sessions, playback is user-initiated, not automatic.
export function TrackPlayer({ trackId, source, durationSeconds }: TrackPlayerProps) {
  const snapshot = useAudioEngineSnapshot();
  const isCurrent = snapshot.trackId === trackId;

  // There is no mini-player, so audio must not outlive the screen that
  // started it. Only stop if this track still owns the engine.
  useEffect(() => {
    return () => {
      if (audioEngine.getSnapshot().trackId === trackId) {
        audioEngine.stop();
      }
    };
  }, [trackId]);

  if (isCurrent && snapshot.state === "error") {
    return <ErrorState message={snapshot.errorMessage ?? undefined} />;
  }

  const playing = isCurrent && snapshot.state === "playing";
  const loading = isCurrent && snapshot.state === "loading";
  const paused = isCurrent && snapshot.state === "paused";
  const finished = isCurrent && snapshot.state === "finished";

  const clock =
    isCurrent && snapshot.durationSeconds > 0
      ? `${formatClock(snapshot.positionSeconds)} / ${formatClock(snapshot.durationSeconds)}`
      : durationSeconds
        ? formatDuration(durationSeconds)
        : null;

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator /> : clock ? <Text style={styles.clock}>{clock}</Text> : null}
      <View style={styles.controls}>
        {playing ? (
          <ControlButton label="Pause" onPress={() => audioEngine.pause()} />
        ) : (
          // play() resumes when this track is paused, otherwise starts fresh.
          <ControlButton
            label={paused ? "Resume" : finished ? "Play Again" : "Play"}
            onPress={() => audioEngine.play(trackId, source)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 24,
  },
  clock: {
    fontSize: 32,
    fontWeight: "300",
  },
  controls: {
    flexDirection: "row",
    gap: 16,
  },
});
