import AsyncStorage from "@react-native-async-storage/async-storage";
import DynamicPhosphorIcon from "@src/components/shared_components/DynamicPhosphorIcon";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Header() {
  const themeColors = useThemeColor();
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const nextLanguage = i18n.language === "kh" ? "en" : "kh";
    await i18n.changeLanguage(nextLanguage);
    await AsyncStorage.setItem("user-language", nextLanguage);
  };

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
        <TouchableOpacity style={styles.languageIcon} onPress={toggleLanguage}>
          <DynamicPhosphorIcon
            name="GlobeSimple"
            size={24}
            weight="regular"
            color={themeColors.text}
          />
          <ThemedText style={styles.languageTitle}>
            {t("navigation.toggle_language")}
          </ThemedText>
        </TouchableOpacity>

        {/* Notification */}
        <DynamicPhosphorIcon
          name="BellSimple"
          size={28}
          color={themeColors.text}
          style={styles.iconBtn}
        />
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
