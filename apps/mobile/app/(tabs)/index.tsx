import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ErrorState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository, getLastActivity, type LocalActivity } from '@/data';
import type { PracticeSessionRow, QuoteRow } from '@within/db';

interface HomeData {
  practiceSessions: PracticeSessionRow[];
  quoteOfTheDay: QuoteRow | null;
}

export default function HomeScreen() {
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState<LocalActivity | null>(null);

  const { data, loading, error } = useAsync<HomeData>(async () => {
    const [practiceSessions, quoteOfTheDay] = await Promise.all([
      contentRepository.listPracticeSessions(),
      contentRepository.getQuoteOfTheDay(),
    ]);
    return { practiceSessions, quoteOfTheDay };
  }, []);

  useFocusEffect(
    useCallback(() => {
      getLastActivity().then(setLastActivity);
    }, [])
  );

  const featuredPractice = data?.practiceSessions[0] ?? null;
  const lastPractice = lastActivity
    ? data?.practiceSessions.find((session) => session.id === lastActivity.practiceSessionId)
    : null;

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen>
        <ErrorState />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.heading}>Within</Text>

      <Card>
        <Text style={styles.cardLabel}>Continue Where You Left Off</Text>
        {lastPractice ? (
          <>
            <Text style={styles.cardTitle}>{lastPractice.title}</Text>
            <ListRow title="Resume" onPress={() => router.push(`/practice/${lastPractice.id}`)} />
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>No recent practice</Text>
            <Text style={styles.cardSubtitle}>Complete a session and your next step will appear here.</Text>
          </>
        )}
      </Card>

      <Card>
        <Text style={styles.cardLabel}>Start Meditation</Text>
        <Text style={styles.cardTitle}>{featuredPractice?.title ?? 'A guided practice'}</Text>
        <Text style={styles.cardSubtitle}>{featuredPractice?.description}</Text>
        <ListRow
          title="Begin"
          onPress={() => {
            if (featuredPractice) router.push(`/practice/${featuredPractice.id}`);
          }}
          disabled={!featuredPractice}
        />
      </Card>

      {data.quoteOfTheDay ? (
        <Card>
          <Text style={styles.cardLabel}>Quote of the Day</Text>
          <Text style={styles.quote}>{data.quoteOfTheDay.body}</Text>
        </Card>
      ) : null}

      <View style={styles.section}>
        <ListRow
          title="Guided Practices"
          subtitle={`${data.practiceSessions.length} practices`}
          onPress={() => router.push('/practice')}
        />
        <ListRow title="Silence" onPress={() => router.push('/silence')} />
        <ListRow title="Inquiry" onPress={() => router.push('/inquiry')} />
        <ListRow title="Library" onPress={() => router.push('/library')} />
        <ListRow title="Feeling Check-in" onPress={() => router.push('/feeling-checkin')} />
      </View>
    </Screen>
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
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  quote: {
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});
