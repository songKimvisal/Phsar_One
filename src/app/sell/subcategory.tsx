import DynamicPhosphorIcon from "@src/components/shared_components/DynamicPhosphorIcon";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { CATEGORY_MAP } from "@src/constants/CategoryData";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CaretLeft, CaretRight } from "phosphor-react-native";

export default function SubcategoryScreen() {
  const { draft, updateDraft } = useSellDraft();
  const { t } = useTranslation();
  const router = useRouter();
  const themeColors = useThemeColor();
  const { categoryId: paramCategoryId } = useLocalSearchParams();

  useEffect(() => {
    if (paramCategoryId && draft.categoryId !== paramCategoryId) {
      updateDraft("categoryId", paramCategoryId as string);
    }
  }, [paramCategoryId]);

  const currentCategoryId = (paramCategoryId || draft.categoryId) as string;
  const categoryData = CATEGORY_MAP[currentCategoryId];

  const subCategoryData = Object.entries(categoryData?.sub || {}).map(([name, icon]) => ({
    name,
    icon,
  }));

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <CaretLeft size={28} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Category Info */}
      <View style={styles.categoryInfo}>
        <View style={styles.categoryIconContainer}>
          <DynamicPhosphorIcon 
            name={categoryData?.icon || "Shapes"} 
            size={40} 
            color={themeColors.text} 
            weight="fill"
          />
        </View>
        <View>
          <ThemedText style={styles.categoryTitle}>
            {t(`categories.${categoryData?.nameKey}`)}
          </ThemedText>
          <ThemedText style={styles.categorySubtitle}>
            {t("sellSection.Choose_Subcategory") || "Pick your subcategory"}
          </ThemedText>
        </View>
      </View>

      <FlatList
        data={subCategoryData}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.listItem,
              { backgroundColor: themeColors.card, borderColor: themeColors.text + "10" },
            ]}
            onPress={() => {
              updateDraft("subCategory", item.name);
              router.push("/sell/details");
            }}
          >
            <View style={styles.listItemLeft}>
              <View style={styles.subIconContainer}>
                <DynamicPhosphorIcon
                  name={item.icon}
                  size={24}
                  color={themeColors.text}
                />
              </View>
              <ThemedText style={styles.listItemText}>
                {t(`subcategories.${item.name}`)}
              </ThemedText>
            </View>
            <CaretRight size={20} color={themeColors.text} opacity={0.3} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 16,
  },
  categoryIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f5f5f5", // Light placeholder bg like Figma
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: "800",
  },
  categorySubtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  subIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
