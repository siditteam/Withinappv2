import { useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository, recordSessionCompletion } from '@/data';
import type { PracticeSessionRow } from '@within/db';

export default function CompletionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const hasRecorded = useRef(false);

  const { data: session, loading, error } = useAsync<PracticeSessionRow | null>(
    () => contentRepository.getPracticeSession(id),
    [id]
  );

  useEffect(() => {
    if (!session || hasRecorded.current) return;
    hasRecorded.current = true;
    recordSessionCompletion({ practiceSessionId: session.id, durationSeconds: session.duration_seconds });
  }, [session]);

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

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <Text style={styles.title}>Complete</Text>
        <Text style={styles.body}>{session.title}</Text>
        {session.completion_suggestion ? (
          <Text style={styles.suggestion}>{session.completion_suggestion}</Text>
        ) : null}
      </View>

      <ListRow title="Back to Home" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
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
});
