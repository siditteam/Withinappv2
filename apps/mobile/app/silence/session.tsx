import { useEffect, useRef, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { ControlButton } from '@/components/ControlButton';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository, recordSilenceCompletion } from '@/data';
import { formatClock, formatDuration } from '@/utils/format';
import { audioEngine } from '@within/audio';

// The bell is app chrome, not content, so it ships bundled instead of
// resolving through a media asset.
const BELL_SOURCE = require('../../assets/audio/sample-bell.wav');

interface SitConfig {
  title: string;
  durationSeconds: number;
  bellIntervalSeconds: number | null;
  silencePresetId: string | null;
}

// Reached either from a silence preset (`presetId`) or with an explicit
// duration, e.g. a Common Space silence room passing its own length.
export default function SilenceSessionScreen() {
  const params = useLocalSearchParams<{ presetId?: string; durationSeconds?: string; title?: string }>();

  const { data: config, loading, error } = useAsync<SitConfig | null>(async () => {
    if (params.presetId) {
      const preset = await contentRepository.getSilencePreset(params.presetId);
      if (!preset) return null;
      return {
        title: preset.title,
        durationSeconds: preset.duration_seconds,
        bellIntervalSeconds: preset.bell_interval_seconds,
        silencePresetId: preset.id,
      };
    }
    const duration = Number(params.durationSeconds);
    if (!Number.isFinite(duration) || duration <= 0) return null;
    return {
      title: params.title ?? 'Silence',
      durationSeconds: Math.round(duration),
      bellIntervalSeconds: null,
      silencePresetId: null,
    };
  }, [params.presetId, params.durationSeconds, params.title]);

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

  if (!config) {
    return (
      <Screen>
        <EmptyState title="Sit not found" />
      </Screen>
    );
  }

  return <SilenceTimer config={config} />;
}

function SilenceTimer({ config }: { config: SitConfig }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(config.durationSeconds);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState<{ elapsedSeconds: number } | null>(null);
  const hasRecorded = useRef(false);

  function end(elapsedSeconds: number, playBell: boolean) {
    if (hasRecorded.current) return;
    hasRecorded.current = true;
    if (playBell) {
      audioEngine.play('silence-bell-final', BELL_SOURCE);
    }
    if (elapsedSeconds > 0) {
      // Records the time actually sat, not the planned duration.
      recordSilenceCompletion({ silencePresetId: config.silencePresetId, durationSeconds: elapsedSeconds });
    }
    setEnded({ elapsedSeconds });
  }

  useEffect(() => {
    if (paused || ended) return;
    const interval = setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, ended]);

  useEffect(() => {
    if (ended) return;
    if (remaining === 0) {
      end(config.durationSeconds, true);
      return;
    }
    const elapsed = config.durationSeconds - remaining;
    if (
      config.bellIntervalSeconds &&
      elapsed > 0 &&
      elapsed % config.bellIntervalSeconds === 0
    ) {
      audioEngine.play(`silence-bell-${elapsed}`, BELL_SOURCE);
    }
  }, [remaining, ended, config]);

  // Don't leave a bell ringing behind when the screen unmounts.
  useEffect(() => {
    return () => audioEngine.stop();
  }, []);

  if (ended) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <Text style={styles.title}>Complete</Text>
          <Text style={styles.body}>{config.title}</Text>
          {ended.elapsedSeconds > 0 ? (
            <Text style={styles.suggestion}>You sat for {formatDuration(ended.elapsedSeconds)}.</Text>
          ) : null}
        </View>
        <ListRow title="Back to Home" onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.clock}>{formatClock(remaining)}</Text>
        <Text style={styles.stateLabel}>{paused ? 'Paused' : 'In silence'}</Text>
      </View>

      <View style={styles.controls}>
        {paused ? (
          <ControlButton label="Resume" onPress={() => setPaused(false)} />
        ) : (
          <ControlButton label="Pause" onPress={() => setPaused(true)} />
        )}
        <ControlButton label="End Sit" onPress={() => end(config.durationSeconds - remaining, false)} />
      </View>
    </Screen>
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
  stateLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  body: {
    fontSize: 17,
    opacity: 0.8,
  },
  suggestion: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 12,
  },
});
