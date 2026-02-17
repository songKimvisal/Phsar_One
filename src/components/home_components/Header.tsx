import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import DynamicPhosphorIcon from "../shared_components/DynamicPhosphorIcon";
import { useRouter, Href } from "expo-router";

export default function Header() {
  const themeColors = useThemeColor();
  const router = useRouter();
  useTranslation();

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("@src/assets/icons/Wordmark.png")}
          style={styles.logoIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.iconsRight}>
        <TouchableOpacity onPress={() => router.push("/notifications" as Href)}>
          {/* Notification */}
          <DynamicPhosphorIcon name="Bell" size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
  },
  logoIcon: {
    width: undefined,
    height: "100%",
    aspectRatio: 4,
  },
  iconsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  languageIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  languageTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  iconBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
