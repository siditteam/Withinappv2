import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository, type PlayableAudioSource } from '@/data';
import { formatClock } from '@/utils/format';
import { audioEngine, useAudioEngineSnapshot } from '@within/audio';
import type { PracticeSessionRow } from '@within/db';

export default function AudioSessionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const snapshot = useAudioEngineSnapshot();

  const { data: session, loading, error } = useAsync<PracticeSessionRow | null>(
    () => contentRepository.getPracticeSession(id),
    [id]
  );

  useEffect(() => {
    if (!session?.audio_asset_id) return;

    let cancelled = false;
    contentRepository.getAudioSourceForMediaAsset(session.audio_asset_id).then((source: PlayableAudioSource | null) => {
      if (!cancelled && source !== null) {
        audioEngine.play(session.id, source);
      }
    });

    return () => {
      cancelled = true;
      audioEngine.stop();
    };
  }, [session]);

  useEffect(() => {
    if (snapshot.state === 'finished' && snapshot.trackId === id) {
      router.replace(`/practice/${id}/complete`);
    }
  }, [snapshot.state, snapshot.trackId, id, router]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorState />
      </Screen>
    );
  }

  if (!session) {
    return (
      <Screen>
        <EmptyState title="Practice not found" />
      </Screen>
    );
  }

  if (snapshot.state === 'error') {
    return (
      <Screen>
        <ErrorState message={snapshot.errorMessage ?? undefined} />
      </Screen>
    );
  }

  const remaining = Math.max(0, snapshot.durationSeconds - snapshot.positionSeconds);

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <Text style={styles.title}>{session.title}</Text>

        {snapshot.state === 'loading' ? (
          <ActivityIndicator style={styles.clockSpacing} />
        ) : (
          <Text style={styles.clock}>{formatClock(remaining)}</Text>
        )}

        <Text style={styles.stateLabel}>{stateLabel(snapshot.state)}</Text>
      </View>

      <View style={styles.controls}>
        {snapshot.state === 'playing' ? (
          <ControlButton label="Pause" onPress={() => audioEngine.pause()} />
        ) : (
          <ControlButton
            label="Resume"
            onPress={() => audioEngine.resume()}
            disabled={snapshot.state !== 'paused'}
          />
        )}
        <ControlButton
          label="End Session"
          onPress={() => {
            audioEngine.stop();
            router.replace(`/practice/${id}/complete`);
          }}
        />
      </View>
    </Screen>
  );
}

function stateLabel(state: string): string {
  switch (state) {
    case 'loading':
      return 'Preparing audio';
    case 'playing':
      return 'Playing';
    case 'paused':
      return 'Paused';
    default:
      return '';
  }
}

function ControlButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const borderColor = useThemeColor({}, 'border');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { borderColor },
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  clock: {
    fontSize: 56,
    fontWeight: '300',
  },
  clockSpacing: {
    marginVertical: 20,
  },
  stateLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 12,
  },
  button: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
});
