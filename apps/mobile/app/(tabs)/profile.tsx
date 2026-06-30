import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert, StyleSheet, View as RNView } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import {
  clearAllLocalData,
  contentRepository,
  getFeelingCheckins,
  getProgress,
  getSessionLogs,
  type LocalFeelingCheckin,
  type LocalProgress,
  type LocalSessionLog,
} from '@/data';
import { formatDuration } from '@/utils/format';

interface ProfileData {
  progress: LocalProgress;
  sessionLogs: LocalSessionLog[];
  feelingCheckins: LocalFeelingCheckin[];
  practiceTitles: Record<string, string>;
}

export default function ProfileScreen() {
  const [data, setData] = useState<ProfileData | null>(null);

  const load = useCallback(async () => {
    const [progress, sessionLogs, feelingCheckins, practiceSessions] = await Promise.all([
      getProgress(),
      getSessionLogs(),
      getFeelingCheckins(),
      contentRepository.listPracticeSessions(),
    ]);
    const practiceTitles = Object.fromEntries(practiceSessions.map((session) => [session.id, session.title]));
    setData({ progress, sessionLogs, feelingCheckins, practiceTitles });
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function handleReset() {
    Alert.alert('Reset local data?', 'This clears your local streak, history, and check-ins on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await clearAllLocalData();
          load();
        },
      },
    ]);
  }

  if (!data) {
    return <Screen />;
  }

  const { progress, sessionLogs, feelingCheckins, practiceTitles } = data;

  return (
    <Screen>
      <Text style={styles.heading}>Profile</Text>

      <Card style={styles.statsGrid}>
        <Stat label="Current streak" value={`${progress.currentStreakDays} ${progress.currentStreakDays === 1 ? 'day' : 'days'}`} />
        <Stat label="Total meditation time" value={formatDuration(progress.totalMeditationSeconds)} />
        <Stat label="Total silence time" value={formatDuration(progress.totalSilenceSeconds)} />
        <Stat label="Completed sessions" value={`${progress.completedSessionsCount}`} />
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Inquiry progress</Text>
        <EmptyState title="Nothing yet" message="Inquiry progress tracking is coming in a later phase." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Saved content</Text>
        <EmptyState title="Nothing saved yet" message="Items you save from Library and Inquiry will show up here." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Feeling history</Text>
        {feelingCheckins.length === 0 ? (
          <EmptyState title="No check-ins yet" message="Use Feeling Check-in from Home to start a log." />
        ) : (
          [...feelingCheckins]
            .reverse()
            .slice(0, 10)
            .map((checkin) => (
              <ListRow
                key={checkin.id}
                title={checkin.feeling}
                subtitle={new Date(checkin.createdAt).toLocaleString()}
              />
            ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Practice history</Text>
        {sessionLogs.length === 0 ? (
          <EmptyState title="No sessions yet" message="Completed sessions will show up here." />
        ) : (
          [...sessionLogs]
            .reverse()
            .slice(0, 10)
            .map((log) => (
              <ListRow
                key={log.id}
                title={practiceTitles[log.practiceSessionId] ?? 'Practice session'}
                subtitle={new Date(log.completedAt).toLocaleString()}
                trailing={formatDuration(log.durationSeconds)}
              />
            ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Settings</Text>
        <ListRow title="Reset local data" onPress={handleReset} />
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <RNView style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </RNView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: '600',
  },
  section: {
    gap: 0,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
    marginBottom: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stat: {
    width: '50%',
    paddingVertical: 8,
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
});
