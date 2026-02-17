import { ThemedText } from "@src/components/shared_components/ThemedText";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { Href, Stack, useRouter } from "expo-router";
import { CaretLeftIcon, WarningDiamondIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SupportScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Help Center</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.subHeader}>
          <ThemedText style={styles.sectionTitle}>Opened tickets</ThemedText>
          <TouchableOpacity
            style={styles.newTicketBtn}
            onPress={() => router.push("/user/new_ticket" as Href)}
          >
            <ThemedText style={styles.newTicketText}>New ticket</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <WarningDiamondIcon size={60} color="#FFB800" weight="thin" />
          <ThemedText style={styles.emptyTitle}>You have no tickets</ThemedText>
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
    backgroundColor: "#FFF",
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
    backgroundColor: Colors.reds[500],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
  },
  newTicketText: {
    color: "#FFF",
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
