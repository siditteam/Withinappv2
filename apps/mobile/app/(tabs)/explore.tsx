import { ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ErrorState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository } from '@/data';
import type { AudioTalkRow, CommonSpaceRoomRow, LearnSeriesRow } from '@within/db';

interface ExploreData {
  rooms: CommonSpaceRoomRow[];
  series: LearnSeriesRow[];
  talks: AudioTalkRow[];
}

export default function ExploreScreen() {
  const router = useRouter();
  const { data, loading, error } = useAsync<ExploreData>(async () => {
    const [rooms, series, talks] = await Promise.all([
      contentRepository.listCommonSpaceRooms(),
      contentRepository.listLearnSeries(),
      contentRepository.listAudioTalks(),
    ]);
    return { rooms, series, talks };
  }, []);

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
      <Text style={styles.heading}>Explore</Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Common Space</Text>
        {data.rooms.map((room) => (
          <ListRow
            key={room.id}
            title={room.title}
            subtitle={room.description ?? undefined}
            onPress={() => router.push(`/rooms/${room.id}`)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Learn</Text>
        {data.series.map((series) => (
          <ListRow
            key={series.id}
            title={series.title}
            subtitle={series.description ?? undefined}
            onPress={() => router.push(`/learn/${series.id}`)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Audio Talks</Text>
        {data.talks.map((talk) => (
          <ListRow
            key={talk.id}
            title={talk.title}
            subtitle={talk.speaker ?? undefined}
            trailing={talk.duration_seconds ? `${Math.round(talk.duration_seconds / 60)} min` : undefined}
            onPress={() => router.push(`/talks/${talk.id}`)}
          />
        ))}
      </View>

      <Card>
        <Text style={styles.cardLabel}>Inner Circle</Text>
        <Text style={styles.cardBody}>
          A smaller, invite-only space for deeper practice. Inner Circle access isn't open yet --
          there's nothing to unlock here until that membership model exists.
        </Text>
      </Card>
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
