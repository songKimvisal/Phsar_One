import { ThemedText } from "@/src/components/ThemedText";
import { CATEGORY_MAP } from "@/src/constants/CategoryData";
import { Colors } from "@/src/constants/Colors";
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
  const subCategories = CATEGORY_MAP[id as string]?.sub || [];
  const { t, i18n } = useTranslation();
  const activeFont = i18n.language === "km" ? "khmer-regular" : "Oxygen";

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
            {subCategories.map((sub) => (
              <TouchableOpacity
                key={sub}
                style={[styles.subChip, { backgroundColor: themeColors.card }]}
              >
                <ThemedText style={[{ fontSize: 13, fontFamily: activeFont }]}>
                  {t(sub)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Bar */}
        <View
          style={[styles.filterBar, { borderBottomColor: themeColors.border }]}
        >
          <TouchableOpacity style={styles.filterBtn}>
            <MapPin size={18} color={themeColors.text} />
            <ThemedText style={[styles.filterText, { fontFamily: activeFont }]}>
              {t("location")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Funnel size={18} color={themeColors.text} />
            <ThemedText style={[styles.filterText, { fontFamily: activeFont }]}>
              {t("filter_sort")}
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
    borderColor: Colors.light.border,
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
