import { Pressable, StyleSheet, View, type GestureResponderEvent } from "react-native";

import { Text, useThemeColor } from "@/components/Themed";

interface ListRowProps {
  title: string;
  subtitle?: string;
  trailing?: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export function ListRow({ title, subtitle, trailing, onPress, disabled }: ListRowProps) {
  const borderColor = useThemeColor({}, "border");
  const textMuted = useThemeColor({}, "textMuted");

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: borderColor },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: textMuted }]}>{subtitle}</Text> : null}
      </View>
      {trailing ? <Text style={[styles.trailing, { color: textMuted }]}>{trailing}</Text> : null}
      {onPress ? <Text style={[styles.chevron, { color: textMuted }]}>{"›"}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  pressed: {
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.4,
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 13,
  },
  trailing: {
    fontSize: 13,
  },
  chevron: {
    fontSize: 20,
  },
});
