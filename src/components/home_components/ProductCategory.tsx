import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import {
    ArmchairIcon,
    BuildingsIcon,
    CarIcon,
    DesktopIcon,
    DeviceMobileIcon,
    LightningIcon,
    ShirtFoldedIcon,
    SparkleIcon,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
export default function ProductCategory() {
  const { t } = useTranslation();
  const themeColors = useThemeColor();
  const router = useRouter();
  const CATEGORIES = [
    { id: "1", nameKey: "smart_phone", icon: DeviceMobileIcon },
    { id: "2", nameKey: "vehicles", icon: CarIcon },
    { id: "3", nameKey: "beauty", icon: SparkleIcon },
    { id: "4", nameKey: "furniture", icon: ArmchairIcon },
    { id: "5", nameKey: "clothing", icon: ShirtFoldedIcon },
    { id: "6", nameKey: "computer", icon: DesktopIcon },
    { id: "7", nameKey: "real_estates", icon: BuildingsIcon },
    { id: "8", nameKey: "electronic", icon: LightningIcon },
  ];

  const handlePress = (id: string, nameKey: string) => {
    router.push({
      pathname: "/category/[id]",
      params: { id: id, title: t(`categories.${nameKey}`) },
    });
  };
  return (
    <View style={styles.categoryContainer}>
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
              <Icon size={16} color={themeColors.text}></Icon>
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
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
  },
  chipLabel: {
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: "400",
  },
});
