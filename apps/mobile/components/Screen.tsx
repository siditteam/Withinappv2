import { ScrollView, StyleSheet, View, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColor } from "@/components/Themed";

type ScreenProps = ScrollViewProps & {
  scroll?: boolean;
};

export function Screen({ scroll = true, contentContainerStyle, children, ...rest }: ScreenProps) {
  const backgroundColor = useThemeColor({}, "background");

  if (!scroll) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor }]} edges={["top", "left", "right"]}>
        <View style={[styles.content, contentContainerStyle as object]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor }]} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 24,
  },
});
