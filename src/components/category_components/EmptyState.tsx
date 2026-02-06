import { ThemedText } from "@/src/components/ThemedText";
import useThemeColor from "@/src/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  message: string;
  onReset?: () => void;
}

export default function EmptyState({ message, onReset }: EmptyStateProps) {
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: themeColors.border + "30",
            borderColor: themeColors.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={50}
          color={themeColors.text}
          style={{ opacity: 0.4 }}
        />
      </View>
      <ThemedText style={[styles.message, { color: themeColors.text }]}>
        {message}
      </ThemedText>
      {onReset && (
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: themeColors.tint }]}
          onPress={onReset}
        >
          <ThemedText style={[styles.resetButtonText, { color: "#FFFFFF" }]}>
            {t("common.showAll")}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 22,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: "bold",
  },
});
