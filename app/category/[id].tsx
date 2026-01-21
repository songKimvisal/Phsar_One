import DynamicPhosphorIcon from "@/src/components/DynamicPhosphorIcon"; // Import DynamicPhosphorIcon
import { ThemedText } from "@/src/components/ThemedText";
import { CATEGORY_MAP } from "@/src/constants/CategoryData";
import useThemeColor from "@/src/hooks/useThemeColor";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CaretLeft, Funnel, MapPin } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function CategoryDetailScreen() {
  const { id, title } = useLocalSearchParams();
  const router = useRouter();
  const themeColors = useThemeColor();
  // Correct the subCategories data structure
  const subCategoryData = Object.entries(
    CATEGORY_MAP[id as string]?.sub || {},
  ).map(([name, icon]) => ({
    name,
    icon,
  }));
  const { t, i18n } = useTranslation();
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
      }}
    >
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <CaretLeft size={28} color={themeColors.text} />
          </TouchableOpacity>
          <ThemedText style={[styles.headerTitle, { fontFamily: activeFont }]}>
            {title}
          </ThemedText>
          <View style={{ width: 28 }} />
        </View>

        {/* Subcategory Scroll */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subScroll}
          >
            {subCategoryData.map(
              (
                subItem, // Use subCategoryData and subItem
              ) => (
                <TouchableOpacity
                  key={subItem.name} // Key by subItem.name
                  style={[
                    styles.subChip,
                    {
                      backgroundColor: themeColors.card,
                      borderColor: themeColors.border,
                    },
                  ]} // Use themeColors.border
                >
                  <DynamicPhosphorIcon
                    name={subItem.icon} // Use the icon name from subItem
                    size={16} // Adjust size as needed
                    color={themeColors.text}
                    weight="duotone"
                  />
                  <ThemedText
                    style={[
                      { fontSize: 13, fontFamily: activeFont, marginLeft: 6 },
                    ]}
                  >
                    {t(`subcategories.${subItem.name}`)}
                  </ThemedText>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
        </View>

        {/* Filter Bar */}
        <View
          style={[styles.filterBar, { borderBottomColor: themeColors.border }]}
        >
          <TouchableOpacity style={styles.filterBtn}>
            <MapPin size={18} color={themeColors.text} />
            <ThemedText style={[styles.filterText, { fontFamily: activeFont }]}>
              {t("fields.location")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Funnel size={18} color={themeColors.text} />
            <ThemedText style={[styles.filterText, { fontFamily: activeFont }]}>
              {t("fields.filter_sort")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  subScroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  subChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "center",
    borderWidth: 1,
    flexDirection: "row", // Arrange icon and text horizontally
    alignItems: "center", // Align items vertically in the center
  },
  filterBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  filterBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  filterText: { fontSize: 14, fontWeight: "500" },
});
