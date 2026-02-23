import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { Stack, useRouter } from "expo-router";
import { BellSlashIcon, CaretLeftIcon } from "phosphor-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{t("notifications_screen.notifications")}</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <View style={[styles.content, { backgroundColor: "#F9FAFB" }]}>
        <View style={styles.emptyState}>
          <View style={styles.iconCircle}>
            <BellSlashIcon size={40} color={themeColors.text} />
          </View>
          <ThemedText style={styles.emptyTitle}>
            {t("notifications_screen.no_notifications")}
          </ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            {t("notifications_screen.no_notifications_subtitle")}
          </ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  backBtn: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.03)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    opacity: 0.8,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.5,
    textAlign: "center",
    lineHeight: 20,
  },
});
