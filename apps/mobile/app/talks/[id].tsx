import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { FavoriteToggle } from '@/components/FavoriteToggle';
import { Screen } from '@/components/Screen';
import { TrackPlayer } from '@/components/TrackPlayer';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository, type PlayableAudioSource } from '@/data';
import type { AudioTalkRow } from '@within/db';

interface TalkData {
  talk: AudioTalkRow | null;
  source: PlayableAudioSource | null;
}

export default function AudioTalkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, loading, error } = useAsync<TalkData>(async () => {
    const talk = await contentRepository.getAudioTalk(id);
    const source = talk?.audio_asset_id
      ? await contentRepository.getAudioSourceForMediaAsset(talk.audio_asset_id)
      : null;
    return { talk, source };
  }, [id]);

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

  if (!data?.talk) {
    return (
      <Screen>
        <EmptyState title="Talk not found" />
      </Screen>
    );
  }

  const { talk, source } = data;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{talk.title}</Text>
        {talk.speaker ? <Text style={styles.speaker}>{talk.speaker}</Text> : null}
      </View>

      {talk.description ? <Text style={styles.body}>{talk.description}</Text> : null}

      <FavoriteToggle contentType="audio_talk" contentId={talk.id} />

      {source !== null ? (
        <TrackPlayer trackId={talk.id} source={source} durationSeconds={talk.duration_seconds} />
      ) : (
        <EmptyState title="Not available yet" message="This talk's recording hasn't been added yet." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
  },
  speaker: {
    fontSize: 14,
    opacity: 0.6,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
});
