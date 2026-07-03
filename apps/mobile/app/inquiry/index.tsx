import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { ExpandableRow } from '@/components/ExpandableRow';
import { FavoriteToggle } from '@/components/FavoriteToggle';
import { Screen } from '@/components/Screen';
import { ErrorState, EmptyState } from '@/components/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { contentRepository, recordInquiryCardExplored } from '@/data';
import type { InquiryCardRow, InquiryCategoryRow } from '@within/db';

interface InquiryData {
  categories: InquiryCategoryRow[];
  cards: InquiryCardRow[];
}

export default function InquiryScreen() {
  const { data, loading, error } = useAsync<InquiryData>(async () => {
    const [categories, cards] = await Promise.all([
      contentRepository.listInquiryCategories(),
      contentRepository.listInquiryCards(),
    ]);
    return { categories, cards };
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

  if (data.categories.length === 0) {
    return (
      <Screen>
        <EmptyState title="No inquiry cards yet" />
      </Screen>
    );
  }

  return (
    <Screen>
      {data.categories.map((category) => {
        const cards = data.cards.filter((card) => card.category_id === category.id);
        return (
          <View key={category.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            {category.description ? <Text style={styles.sectionSubtitle}>{category.description}</Text> : null}
            {cards.map((card) => (
              <ExpandableRow
                key={card.id}
                title={card.question ?? card.prompt}
                onToggle={(expanded) => {
                  // Opening a card counts as exploring it -- surfaced as
                  // inquiry progress on the Profile tab.
                  if (expanded) recordInquiryCardExplored(card.id);
                }}
              >
                {card.answer ? <Text style={styles.label}>{card.answer}</Text> : null}
                {card.explanation ? <Text style={styles.muted}>{card.explanation}</Text> : null}
                {card.reflection_prompt ? <Text style={styles.reflection}>{card.reflection_prompt}</Text> : null}
                <FavoriteToggle contentType="inquiry_card" contentId={card.id} />
              </ExpandableRow>
            ))}
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    lineHeight: 21,
  },
  muted: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  reflection: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
