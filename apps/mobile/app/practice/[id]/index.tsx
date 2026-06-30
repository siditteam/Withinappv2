import { useRouter, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository, recordPracticeStarted } from '@/data';
import { formatDuration } from '@/utils/format';
import type { PracticeSessionRow } from '@within/db';

export default function PracticeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, loading, error } = useAsync<PracticeSessionRow | null>(
    () => contentRepository.getPracticeSession(id),
    [id]
  );

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

  if (!data) {
    return (
      <Screen>
        <EmptyState title="Practice not found" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.duration}>{formatDuration(data.duration_seconds)}</Text>

      {data.description ? <Text style={styles.body}>{data.description}</Text> : null}

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Meaning</Text>
        <Text style={styles.body}>{data.meaning}</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>When to use this</Text>
        <Text style={styles.body}>{data.motive}</Text>
      </View>

      <ListRow
        title="Begin"
        onPress={async () => {
          await recordPracticeStarted(data.id);
          router.push(`/practice/${data.id}/session`);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '600',
  },
  duration: {
    fontSize: 14,
    opacity: 0.6,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
});
