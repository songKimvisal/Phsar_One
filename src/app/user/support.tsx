import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { Href, Stack, useRouter } from "expo-router";
import { CaretLeftIcon, WarningDiamondIcon } from "phosphor-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SupportScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={[styles.header, { backgroundColor: themeColors.background }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>
          {t("support_screen.help_center")}
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <View
        style={[styles.content, { backgroundColor: themeColors.background }]}
      >
        <View style={styles.subHeader}>
          <ThemedText style={styles.sectionTitle}>
            {t("support_screen.opened_tickets")}
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.newTicketBtn,
              { backgroundColor: themeColors.primary },
            ]}
            onPress={() => router.push("/user/new_ticket" as Href)}
          >
            <ThemedText
              style={[
                styles.newTicketText,
                { color: themeColors.primaryButtonText },
              ]}
            >
              {t("support_screen.new_ticket")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <WarningDiamondIcon size={60} color="#FFB800" weight="thin" />
          <ThemedText style={styles.emptyTitle}>
            {t("support_screen.no_tickets")}
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
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  newTicketBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
  },
  newTicketText: {
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    opacity: 0.8,
  },
});
