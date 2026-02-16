import DynamicPhosphorIcon from "@src/components/shared_components/DynamicPhosphorIcon";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { CATEGORY_MAP } from "@src/constants/CategoryData";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubcategoryScreen() {
  const { draft, updateDraft } = useSellDraft();
  const { t } = useTranslation();
  const router = useRouter();
  const themeColors = useThemeColor();
  const { categoryId: paramCategoryId } = useLocalSearchParams();
  const handleBack = () => {
    router.replace("/(tabs)/sell");
  };

  console.log("SubcategoryScreen - paramCategoryId:", paramCategoryId);
  console.log(
    "SubcategoryScreen - draft.categoryId (before update):",
    draft.categoryId,
  );

  useEffect(() => {
    if (paramCategoryId && draft.categoryId !== paramCategoryId) {
      updateDraft("categoryId", paramCategoryId);
    }
  }, [paramCategoryId, draft.categoryId, updateDraft]);

  const currentCategoryId = draft.categoryId || paramCategoryId;

  console.log("SubcategoryScreen - currentCategoryId:", currentCategoryId);

  const subCategoryData = Object.entries(
    CATEGORY_MAP[currentCategoryId as string]?.sub || {},
  ).map(([name, icon]) => ({
    name,
    icon,
  }));

  console.log("SubcategoryScreen - subCategoryData:", subCategoryData);

  if (!currentCategoryId) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: themeColors.background, justifyContent: "center" },
        ]}
      >
        <ThemedText style={{ textAlign: "center" }}>
          {t("common.loading")}...
        </ThemedText>
        <TouchableOpacity onPress={handleBack} style={{ marginTop: 10 }}>
          <ThemedText style={{ color: "red", textAlign: "center" }}>
            Go Back
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themeColors.background, flex: 1 },
      ]}
    >
      <FlatList
        style={{ marginTop: 20, paddingHorizontal: 16 }}
        data={subCategoryData}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.listItem,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => {
              updateDraft("subCategory", item.name);
              router.push("/sell/details");
            }}
          >
            <DynamicPhosphorIcon
              name={item.icon}
              size={24}
              color={themeColors.text}
              weight="regular"
            />
            <ThemedText style={{ marginLeft: 10 }}>
              {t(`subcategories.${item.name}`)}
            </ThemedText>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  listItem: {
    padding: 20,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
});
