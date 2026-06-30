import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Text, useThemeColor } from "@/components/Themed";

interface ExpandableRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function ExpandableRow({ title, subtitle, children }: ExpandableRowProps) {
  const [expanded, setExpanded] = useState(false);
  const borderColor = useThemeColor({}, "border");
  const textMuted = useThemeColor({}, "textMuted");

  return (
    <View style={[styles.container, { borderBottomColor: borderColor }]}>
      <Pressable onPress={() => setExpanded((value) => !value)} style={styles.header}>
        <View style={styles.textGroup}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: textMuted }]}>{subtitle}</Text> : null}
        </View>
        <Text style={[styles.chevron, { color: textMuted }]}>{expanded ? "⌃" : "⌄"}</Text>
      </Pressable>
      {expanded ? <View style={styles.detail}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
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
  chevron: {
    fontSize: 16,
  },
  detail: {
    paddingBottom: 16,
    gap: 10,
  },
});
