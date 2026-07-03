import { Pressable, StyleSheet } from "react-native";

import { Text, useThemeColor } from "@/components/Themed";

interface ControlButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ControlButton({ label, onPress, disabled }: ControlButtonProps) {
  const borderColor = useThemeColor({}, "border");

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { borderColor },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  pressed: {
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.3,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
  },
});
