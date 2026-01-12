import { ThemedText } from "@/src/components/ThemedText";
import useThemeColor from "@/src/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";

export default function ChatScreen() {
  const themeColors = useThemeColor();
  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <ThemedText>Chat Screen</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
