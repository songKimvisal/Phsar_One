import { ThemedTextInput } from "@src/components/shared_components/ThemedTextInput";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { MagnifyingGlassIcon } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  return (
    <View
      style={[styles.searchContainer, { backgroundColor: themeColors.card }]}
    >
      <ThemedTextInput
        placeholder={t("navigation.search")}
        style={styles.searchInput}
        onChangeText={onSearch}
      />

      <TouchableOpacity style={styles.iconContainer}>
        <MagnifyingGlassIcon size={24} weight="regular" color="white" />
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
    borderWidth: 0,
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
