import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text } from '@/components/Themed';
import { ExpandableRow } from '@/components/ExpandableRow';
import { FavoriteToggle } from '@/components/FavoriteToggle';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository } from '@/data';
import type { LibraryItemRow } from '@within/db';

export default function LibraryScreen() {
  const { data, loading, error } = useAsync<LibraryItemRow[]>(() => contentRepository.listLibraryItems(), []);

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
        <EmptyState title="No library items yet" />
      </Screen>
    );
  }

  return (
    <Screen>
      {data.map((item) => (
        <ExpandableRow key={item.id} title={item.body} subtitle={item.author ?? undefined}>
          {item.meaning ? <Text style={styles.meaning}>{item.meaning}</Text> : null}
          {item.deeper_explanation ? <Text style={styles.deeper}>{item.deeper_explanation}</Text> : null}
          <FavoriteToggle contentType="library_item" contentId={item.id} />
        </ExpandableRow>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  meaning: {
    fontSize: 15,
    lineHeight: 21,
  },
  deeper: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
});
