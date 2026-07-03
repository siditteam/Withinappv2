import { useRouter, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository } from '@/data';
import { formatDuration } from '@/utils/format';
import type { LearnEpisodeRow, LearnSeriesRow } from '@within/db';

interface SeriesData {
  series: LearnSeriesRow | null;
  episodes: LearnEpisodeRow[];
}

export default function LearnSeriesScreen() {
  const router = useRouter();
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();

  const { data, loading, error } = useAsync<SeriesData>(async () => {
    const [series, episodes] = await Promise.all([
      contentRepository.getLearnSeries(seriesId),
      contentRepository.listLearnEpisodes(seriesId),
    ]);
    return { series, episodes };
  }, [seriesId]);

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

  if (!data?.series) {
    return (
      <Screen>
        <EmptyState title="Series not found" />
      </Screen>
    );
  }

  const { series, episodes } = data;

  return (
    <Screen>
      <Text style={styles.title}>{series.title}</Text>
      {series.description ? <Text style={styles.body}>{series.description}</Text> : null}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Episodes</Text>
        {episodes.length === 0 ? (
          <EmptyState title="No episodes yet" message="Episodes for this series are on their way." />
        ) : (
          episodes.map((episode) => (
            <ListRow
              key={episode.id}
              title={episode.title}
              subtitle={`Episode ${episode.episode_number}`}
              trailing={episode.duration_seconds ? formatDuration(episode.duration_seconds) : undefined}
              onPress={() =>
                router.push({
                  pathname: '/learn/[seriesId]/[episodeId]',
                  params: { seriesId, episodeId: episode.id },
                })
              }
            />
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '600',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
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
});
