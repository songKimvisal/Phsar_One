import { ThemedText } from "@src/components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
export default function TradeScreen() {
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <ThemedText>{t("trade_screen.title")}</ThemedText>
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
