import useThemeColor from "@src/hooks/useThemeColor";
import { MagnifyingGlass } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";

export default function SearchBar() {
  const themeColors = useThemeColor();
  const { t, i18n } = useTranslation();

  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

  return (
    <View
      style={[styles.searchContainer, { backgroundColor: themeColors.card }]}
    >
      <TextInput
        placeholder={t("navigation.search")}
        placeholderTextColor={themeColors.tabIconDefault}
        style={[
          styles.searchInput,
          {
            fontFamily: activeFont,
            color: themeColors.text,
          },
        ]}
      />

      <TouchableOpacity style={styles.iconContainer}>
        <MagnifyingGlass size={20} weight="bold" color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    height: 50,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  iconContainer: {
    height: 38,
    width: 52,
    borderRadius: 25,
    backgroundColor: Colors.reds[500],
    alignItems: "center",
    justifyContent: "center",
  },
});
