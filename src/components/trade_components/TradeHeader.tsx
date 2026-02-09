import { ThemedTextInput } from "@src/components/ThemedTextInput";
import useThemeColor from "@src/hooks/useThemeColor";
import { MagnifyingGlass } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface TradeHeaderProps {
  onSearch: (query: string) => void;
}

export default function TradeHeader({ onSearch }: TradeHeaderProps) {
  const themeColors = useThemeColor();
  const { t } = useTranslation(); // Removed i18n from destructuring as activeFont is removed
  // const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen"; // Removed

  const styles = getStyles(themeColors);

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Search Bar */}
      <View
        style={[
          styles.searchBarContainer,
          {
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
          },
        ]}
      >
        <ThemedTextInput
          placeholder={t("trade_screen.search_placeholder")}
          style={styles.searchInput} // Removed fontFamily
          onChangeText={onSearch}
        />
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={() => onSearch("")}
        >
          <MagnifyingGlass
            size={24}
            weight="regular"
            color={themeColors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border, // Themed border color
  },
  searchBarContainer: {
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    fontSize: 16,
    paddingRight: 10,
  },
  searchIconContainer: {
    paddingHorizontal: 10,
  },
});
