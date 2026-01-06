import { Globe } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";
import { ThemedText } from "./ThemedText";
export default function Header() {
  const { i18n, t } = useTranslation();
  const toggleLanguage = () => {
    const nextLanguage = i18n.language === "en" ? "kh" : "en";
    i18n.changeLanguage(nextLanguage);
  };
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/icons/Main-logo-24.png")}
          style={styles.logoIcon}
        />
        <ThemedText style={styles.logoText}>PhsarOne</ThemedText>
      </View>
      <TouchableOpacity style={styles.languageIcon} onPress={toggleLanguage}>
        <Globe size={24} weight="duotone" />
        <ThemedText style={styles.languageTitle}>{t("lang_code")}</ThemedText>
      </TouchableOpacity>
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
    width: 30,
    height: 30,
  },
  logoText: {
    marginLeft: 5,
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.reds[750],
  },
  languageIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  languageTitle: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
});
