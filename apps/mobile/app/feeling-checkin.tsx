import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text, useThemeColor } from '@/components/Themed';
import { Screen } from '@/components/Screen';
import { recordFeelingCheckin } from '@/data';

const FEELINGS = ['Calm', 'Anxious', 'Tired', 'Sad', 'Restless', 'Grateful', 'Overwhelmed', 'Content'];

export default function FeelingCheckinScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);

  async function handleSelect(feeling: string) {
    setSaving(feeling);
    await recordFeelingCheckin(feeling);
    router.back();
  }

  return (
    <Screen scroll={false}>
      <Text style={styles.title}>How are you feeling right now?</Text>
      <View style={styles.grid}>
        {FEELINGS.map((feeling) => (
          <FeelingChip
            key={feeling}
            label={feeling}
            disabled={saving !== null}
            onPress={() => handleSelect(feeling)}
          />
        ))}
      </View>
    </Screen>
  );
}

function FeelingChip({ label, onPress, disabled }: { label: string; onPress: () => void; disabled: boolean }) {
  const borderColor = useThemeColor({}, 'border');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.chip, { borderColor }, pressed && styles.chipPressed]}
    >
      <Text style={styles.chipLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  chipPressed: {
    opacity: 0.5,
  },
  chipLabel: {
    fontSize: 15,
  },
});
