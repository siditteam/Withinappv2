import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { Alert, StyleSheet, View as RNView } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import {
  clearAllLocalData,
  contentRepository,
  getExploredInquiryCardIds,
  getFavorites,
  getFeelingCheckins,
  getProgress,
  getSessionLogs,
  type LocalFavorite,
  type LocalFeelingCheckin,
  type LocalProgress,
  type LocalSessionLog,
} from '@/data';
import { formatDuration } from '@/utils/format';

interface ProfileData {
  progress: LocalProgress;
  sessionLogs: LocalSessionLog[];
  feelingCheckins: LocalFeelingCheckin[];
  favorites: LocalFavorite[];
  exploredInquiryCount: number;
  inquiryCardCount: number;
  practiceTitles: Record<string, string>;
  silenceTitles: Record<string, string>;
  inquiryTitles: Record<string, string>;
  libraryTitles: Record<string, string>;
  talkTitles: Record<string, string>;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);

  const load = useCallback(async () => {
    const [
      progress,
      sessionLogs,
      feelingCheckins,
      favorites,
      exploredInquiryCardIds,
      practiceSessions,
      silencePresets,
      inquiryCards,
      libraryItems,
      audioTalks,
    ] = await Promise.all([
      getProgress(),
      getSessionLogs(),
      getFeelingCheckins(),
      getFavorites(),
      getExploredInquiryCardIds(),
      contentRepository.listPracticeSessions(),
      contentRepository.listSilencePresets(),
      contentRepository.listInquiryCards(),
      contentRepository.listLibraryItems(),
      contentRepository.listAudioTalks(),
    ]);
    const cardIds = new Set(inquiryCards.map((card) => card.id));
    setData({
      progress,
      sessionLogs,
      feelingCheckins,
      favorites,
      // Only count cards that still exist, so unpublishing a card can't
      // leave progress above the total.
      exploredInquiryCount: exploredInquiryCardIds.filter((id) => cardIds.has(id)).length,
      inquiryCardCount: inquiryCards.length,
      practiceTitles: Object.fromEntries(practiceSessions.map((session) => [session.id, session.title])),
      silenceTitles: Object.fromEntries(silencePresets.map((preset) => [preset.id, preset.title])),
      inquiryTitles: Object.fromEntries(inquiryCards.map((card) => [card.id, card.question ?? card.prompt])),
      libraryTitles: Object.fromEntries(libraryItems.map((item) => [item.id, item.title ?? item.body])),
      talkTitles: Object.fromEntries(audioTalks.map((talk) => [talk.id, talk.title])),
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function handleReset() {
    Alert.alert('Reset local data?', 'This clears your local streak, history, check-ins, and saved items on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await clearAllLocalData();
          load();
        },
      },
    ]);
  }

  if (!data) {
    return <Screen />;
  }

  const {
    progress,
    sessionLogs,
    feelingCheckins,
    favorites,
    exploredInquiryCount,
    inquiryCardCount,
    practiceTitles,
    silenceTitles,
    inquiryTitles,
    libraryTitles,
    talkTitles,
  } = data;

  function logTitle(log: LocalSessionLog): string {
    if (log.kind === 'silence') {
      return (log.silencePresetId && silenceTitles[log.silencePresetId]) || 'Silence';
    }
    return (log.practiceSessionId && practiceTitles[log.practiceSessionId]) || 'Practice session';
  }

  function favoriteRow(favorite: LocalFavorite): { title: string; subtitle: string } {
    switch (favorite.contentType) {
      case 'inquiry_card':
        return { title: inquiryTitles[favorite.contentId] ?? 'Inquiry card', subtitle: 'Inquiry' };
      case 'library_item':
        return { title: libraryTitles[favorite.contentId] ?? 'Library item', subtitle: 'Library' };
      case 'audio_talk':
        return { title: talkTitles[favorite.contentId] ?? 'Audio talk', subtitle: 'Audio Talk' };
      case 'practice_session':
        return { title: practiceTitles[favorite.contentId] ?? 'Practice', subtitle: 'Practice' };
      case 'silence_preset':
        return { title: silenceTitles[favorite.contentId] ?? 'Silence', subtitle: 'Silence' };
      default:
        return { title: 'Saved item', subtitle: 'Saved' };
    }
  }

  return (
    <Screen>
      <Text style={styles.heading}>Profile</Text>

      <Card style={styles.statsGrid}>
        <Stat label="Current streak" value={`${progress.currentStreakDays} ${progress.currentStreakDays === 1 ? 'day' : 'days'}`} />
        <Stat label="Total meditation time" value={formatDuration(progress.totalMeditationSeconds)} />
        <Stat label="Total silence time" value={formatDuration(progress.totalSilenceSeconds)} />
        <Stat label="Completed sessions" value={`${progress.completedSessionsCount}`} />
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Inquiry progress</Text>
        {inquiryCardCount === 0 ? (
          <EmptyState title="No inquiry cards yet" />
        ) : (
          <Card>
            <Text style={styles.statValue}>
              {exploredInquiryCount} of {inquiryCardCount}
            </Text>
            <Text style={styles.statLabel}>questions opened</Text>
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Saved content</Text>
        {favorites.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            message="Items you save from Library, Inquiry, and Audio Talks will show up here."
          />
        ) : (
          [...favorites]
            .reverse()
            .slice(0, 10)
            .map((favorite) => {
              const row = favoriteRow(favorite);
              // Only types with their own detail screen are navigable;
              // library items and inquiry cards live inside their lists.
              const href =
                favorite.contentType === 'audio_talk'
                  ? (`/talks/${favorite.contentId}` as const)
                  : favorite.contentType === 'practice_session'
                    ? (`/practice/${favorite.contentId}` as const)
                    : null;
              return (
                <ListRow
                  key={`${favorite.contentType}:${favorite.contentId}`}
                  title={row.title}
                  subtitle={row.subtitle}
                  onPress={href ? () => router.push(href) : undefined}
                />
              );
            })
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Feeling history</Text>
        {feelingCheckins.length === 0 ? (
          <EmptyState title="No check-ins yet" message="Use Feeling Check-in from Home to start a log." />
        ) : (
          [...feelingCheckins]
            .reverse()
            .slice(0, 10)
            .map((checkin) => (
              <ListRow
                key={checkin.id}
                title={checkin.feeling}
                subtitle={new Date(checkin.createdAt).toLocaleString()}
              />
            ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Practice history</Text>
        {sessionLogs.length === 0 ? (
          <EmptyState title="No sessions yet" message="Completed sessions will show up here." />
        ) : (
          [...sessionLogs]
            .reverse()
            .slice(0, 10)
            .map((log) => (
              <ListRow
                key={log.id}
                title={logTitle(log)}
                subtitle={new Date(log.completedAt).toLocaleString()}
                trailing={formatDuration(log.durationSeconds)}
              />
            ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Settings</Text>
        <ListRow title="Reset local data" onPress={handleReset} />
      </View>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <RNView style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </RNView>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stat: {
    width: '50%',
    paddingVertical: 8,
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
});
