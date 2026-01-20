import { ThemedText } from "@/src/components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
export default function SellScreen() {
  const themeColors = useThemeColor();
  const { t, i18n } = useTranslation();
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
      }}
    >
      <View style={styles.container}>
        <ThemedText style={styles.title}>
          {t("sellSection.What_are_you_selling?")}
        </ThemedText>
      </View>
      <View style={styles.grid}>
        <Card title={t("categories.vehicles")} onPress={() => {}} />
        <Card title={t("categories.smart_phone")} onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

function Card({ title, onPress }: { title: string; onPress: () => void }) {
  const themeColors = useThemeColor();
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.card }]}
      onPress={onPress}
    >
      <ThemedText style={styles.cardText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "47%",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  cardText: { fontSize: 16, fontWeight: "500" },
});
