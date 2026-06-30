import { ActivityIndicator } from 'react-native';

import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository } from '@/data';
import { formatDuration } from '@/utils/format';
import type { SilencePresetRow } from '@within/db';

export default function SilenceScreen() {
  const { data, loading, error } = useAsync<SilencePresetRow[]>(() => contentRepository.listSilencePresets(), []);

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
        <EmptyState title="No presets yet" />
      </Screen>
    );
  }

  return (
    <Screen>
      {data.map((preset) => (
        <ListRow
          key={preset.id}
          title={preset.title}
          subtitle={preset.description ?? undefined}
          trailing={formatDuration(preset.duration_seconds)}
        />
      ))}
    </Screen>
  );
}
