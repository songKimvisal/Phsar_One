import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
export default function ProductCategory() {
  const { t } = useTranslation();
  return (
    <View style={styles.categoryContainer}>
      <ThemedText style={styles.categoryText}>{t("categories")}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
