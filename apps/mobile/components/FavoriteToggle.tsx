import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import { Text, useThemeColor } from "@/components/Themed";
import { isFavorite, toggleFavorite, type FavoriteContentType } from "@/data";

interface FavoriteToggleProps {
  contentType: FavoriteContentType;
  contentId: string;
}

// A quiet save/unsave text control -- saved items surface under
// Profile > Saved content.
export function FavoriteToggle({ contentType, contentId }: FavoriteToggleProps) {
  const textMuted = useThemeColor({}, "textMuted");
  // null until the stored state has loaded, so the label never flickers
  // from "Save" to "Saved".
  const [saved, setSaved] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    isFavorite(contentType, contentId).then((value) => {
      if (!cancelled) setSaved(value);
    });
    return () => {
      cancelled = true;
    };
  }, [contentType, contentId]);

  if (saved === null) return null;

  return (
    <Pressable
      onPress={async () => {
        setSaved(await toggleFavorite(contentType, contentId));
      }}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      hitSlop={8}
    >
      <Text style={[styles.label, { color: textMuted }]}>{saved ? "Saved" : "Save"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
  },
  pressed: {
    opacity: 0.5,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
