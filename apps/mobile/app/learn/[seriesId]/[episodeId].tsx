import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Screen } from '@/components/Screen';
import { TrackPlayer } from '@/components/TrackPlayer';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository, type PlayableAudioSource } from '@/data';
import type { LearnEpisodeRow, LearnSeriesRow } from '@within/db';

interface EpisodeData {
  series: LearnSeriesRow | null;
  episode: LearnEpisodeRow | null;
  source: PlayableAudioSource | null;
}

export default function LearnEpisodeScreen() {
  const { seriesId, episodeId } = useLocalSearchParams<{ seriesId: string; episodeId: string }>();

  const { data, loading, error } = useAsync<EpisodeData>(async () => {
    const [series, episode] = await Promise.all([
      contentRepository.getLearnSeries(seriesId),
      contentRepository.getLearnEpisode(episodeId),
    ]);
    const source = episode?.audio_asset_id
      ? await contentRepository.getAudioSourceForMediaAsset(episode.audio_asset_id)
      : null;
    return { series, episode, source };
  }, [seriesId, episodeId]);

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

  if (!data?.episode) {
    return (
      <Screen>
        <EmptyState title="Episode not found" />
      </Screen>
    );
  }

  const { series, episode, source } = data;

  return (
    <Screen>
      <View style={styles.header}>
        {series ? <Text style={styles.seriesLabel}>{series.title}</Text> : null}
        <Text style={styles.title}>{episode.title}</Text>
        <Text style={styles.episodeNumber}>Episode {episode.episode_number}</Text>
      </View>

      {source !== null ? (
        <TrackPlayer trackId={episode.id} source={source} durationSeconds={episode.duration_seconds} />
      ) : (
        <EmptyState title="Not available yet" message="This episode's recording hasn't been added yet." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  seriesLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
  },
  episodeNumber: {
    fontSize: 14,
    opacity: 0.6,
  },
});
