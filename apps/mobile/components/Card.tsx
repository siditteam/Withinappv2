import { StyleSheet, type ViewProps } from "react-native";

import { View, useThemeColor } from "@/components/Themed";

export function Card({ style, ...rest }: ViewProps) {
  const borderColor = useThemeColor({}, "border");
  const surface = useThemeColor({}, "surface");

  return <View style={[styles.card, { borderColor, backgroundColor: surface }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
});
