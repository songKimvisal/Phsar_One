import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@src/constants/Colors";
import { useTheme } from "@src/context/ThemeContext";
import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, View } from "react-native";
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
          source={require("@src/assets/icons/Wordmark.png")}
          style={styles.logoIcon}
          resizeMode="contain"
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
    backgroundColor: "transparent",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
  },
  logoIcon: {
    width: undefined,
    height: "100%",
    aspectRatio: 4
  },
  logoText: {
    marginLeft: 5,
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.reds[500],
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 50,
  },
});
