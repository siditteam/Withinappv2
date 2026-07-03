import { useRouter, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository } from '@/data';
import { formatDuration } from '@/utils/format';
import type { CommonSpaceRoomRow } from '@within/db';

export default function CommonSpaceRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: room, loading, error } = useAsync<CommonSpaceRoomRow | null>(
    () => contentRepository.getCommonSpaceRoom(id),
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

  if (!room) {
    return (
      <Screen>
        <EmptyState title="Room not found" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>{room.title}</Text>
      {room.duration_seconds ? (
        <Text style={styles.duration}>{formatDuration(room.duration_seconds)}</Text>
      ) : null}

      {room.description ? <Text style={styles.body}>{room.description}</Text> : null}

      {room.purpose ? (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Purpose</Text>
          <Text style={styles.body}>{room.purpose}</Text>
        </View>
      ) : null}

      <Card>
        <Text style={styles.fieldLabel}>A note on presence</Text>
        <Text style={styles.body}>
          Shared live presence isn't built yet, so this room won't show who else is here. You can
          still practice with the room's intention on your own.
        </Text>
      </Card>

      {room.room_type === 'silence' && room.duration_seconds ? (
        <ListRow
          title="Sit in silence"
          trailing={formatDuration(room.duration_seconds)}
          onPress={() =>
            router.push({
              pathname: '/silence/session',
              params: { durationSeconds: String(room.duration_seconds), title: room.title },
            })
          }
        />
      ) : null}

      {room.room_type === 'guided_practice' && room.practice_session_id ? (
        <ListRow
          title="Open this room's practice"
          onPress={() => router.push(`/practice/${room.practice_session_id}`)}
        />
      ) : null}
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
