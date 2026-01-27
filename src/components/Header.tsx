import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@src/context/ThemeContext";
import { Globe, Moon, Sun } from "phosphor-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";
import useThemeColor from "../hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
export default function Header() {
  const { i18n, t } = useTranslation();
  const { theme, setMode } = useTheme();
  const themesColors = useThemeColor();
  const toggleLanguage = async () => {
    const nextLanguage = i18n.language === "kh" ? "en" : "kh";
    await i18n.changeLanguage(nextLanguage);
    await AsyncStorage.setItem("user-language", nextLanguage);
  };
  const toggleTheme = () => {
    setMode(theme === "light" ? "dark" : "light");
  };
  return (
    <View
      style={[styles.container, { backgroundColor: themesColors.background }]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icons/Main-logo-24.png")}
          style={styles.logoIcon}
        />

        <Text style={styles.logoText}>PhsarOne</Text>
      </View>
      <View style={styles.toggleBtn}>
        <TouchableOpacity onPress={toggleTheme}>
          {theme == "light" ? (
            <Moon size={24} weight="duotone" color={themesColors.text} />
          ) : (
            <Sun size={24} weight="duotone" color={themesColors.text} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.languageIcon} onPress={toggleLanguage}>
          {theme == "light" ? (
            <Globe size={24} weight="duotone" color={themesColors.text} />
          ) : (
            <Globe size={24} weight="duotone" color={themesColors.text} />
          )}
          <ThemedText style={styles.languageTitle}>
            {t("navigation.toggle_language")}
          </ThemedText>
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
    backgroundColor: "transparent",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  logoIcon: {
    width: 32,
    height: 32,
  },
  logoText: {
    marginLeft: 5,
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.reds[500],
  },
  languageIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 10,
    paddingVertical: 4,
  },
  languageTitle: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 50,
  },
});
