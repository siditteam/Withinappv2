import { StyleSheet, View } from "react-native";

import { Text, useThemeColor } from "@/components/Themed";

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  const textMuted = useThemeColor({}, "textMuted");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={[styles.message, { color: textMuted }]}>{message}</Text> : null}
    </View>
  );
}

export function ErrorState({ message = "Something didn't load. Please try again in a moment." }: { message?: string }) {
  return <EmptyState title="Couldn't load this" message={message} />;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
  },
});
