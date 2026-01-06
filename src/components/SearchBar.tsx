import useThemeColor from "@src/hooks/useThemeColor";
import { MagnifyingGlass } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/Colors";

export default function SearchBar() {
  const themeColors = useThemeColor(); // Gets colors based on Light/Dark mode
  const { t, i18n } = useTranslation();

  const activeFont = i18n.language === "km" ? "khmer-regular" : "Oxygen";

  return (
    <View
      style={[
        styles.searchContainer,
        { backgroundColor: themeColors.card }, // Dynamic background
      ]}
    >
      <TextInput
        placeholder={t("search")}
        placeholderTextColor={themeColors.tabIconDefault} // Dim color for placeholder
        style={[
          styles.searchInput,
          {
            fontFamily: activeFont,
            color: themeColors.text, // Dynamic text color
          },
        ]}
      />

      {/* Search Button using your Reds[500] */}
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
    paddingRight: 6, // Space for the button
    // Shadow/Elevation for Light Mode
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
    backgroundColor: Colors.reds[500], // Brand Red
    alignItems: "center",
    justifyContent: "center",
  },
});
