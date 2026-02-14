import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import {
    Armchair,
    Buildings,
    Car,
    Desktop,
    DeviceMobile,
    Lightning,
    ShirtFolded,
    Sparkle,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
export default function ProductCategory() {
  const { t } = useTranslation();
  const themeColors = useThemeColor();
  const router = useRouter();
  const CATEGORIES = [
    { id: "1", nameKey: "smart_phone", icon: DeviceMobile },
    { id: "2", nameKey: "vehicles", icon: Car },
    { id: "3", nameKey: "beauty", icon: Sparkle },
    { id: "4", nameKey: "furniture", icon: Armchair },
    { id: "5", nameKey: "clothing", icon: ShirtFolded },
    { id: "6", nameKey: "computer", icon: Desktop },
    { id: "7", nameKey: "real_estates", icon: Buildings },
    { id: "8", nameKey: "electronic", icon: Lightning },
  ];

  const handlePress = (id: string, nameKey: string) => {
    router.push({
      pathname: "/category/[id]",
      params: { id: id, title: t(`categories.${nameKey}`) },
    });
  };
  return (
    <View style={styles.categoryContainer}>
      <ThemedText style={styles.categoryText}>
        {t("navigation.category")}
      </ThemedText>
      <View style={styles.chipContainer}>
        {CATEGORIES.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              onPress={() => handlePress(item.id, item.nameKey)}
              key={item.id}
              style={[
                styles.chip,
                {
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.card,
                },
              ]}
            >
              <Icon size={24} color={themeColors.text} weight="duotone"></Icon>
              <ThemedText style={styles.chipLabel}>
                {t(`categories.${item.nameKey}`)}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 28,
    borderWidth: 1,
  },
  chipLabel: {
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});
