import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';

import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository } from '@/data';
import { formatDuration } from '@/utils/format';
import type { PracticeSessionRow } from '@within/db';

export default function PracticeListScreen() {
  const router = useRouter();
  const { data, loading, error } = useAsync<PracticeSessionRow[]>(
    () => contentRepository.listPracticeSessions(),
    []
  );

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

  if (data.length === 0) {
    return (
      <Screen>
        <EmptyState title="No practices yet" message="Check back soon." />
      </Screen>
    );
  }

  return (
    <Screen>
      {data.map((session) => (
        <ListRow
          key={session.id}
          title={session.title}
          subtitle={session.description ?? undefined}
          trailing={formatDuration(session.duration_seconds)}
          onPress={() => router.push(`/practice/${session.id}`)}
        />
      ))}
    </Screen>
  );
}
