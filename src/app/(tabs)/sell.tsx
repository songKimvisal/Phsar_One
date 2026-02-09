import DynamicPhosphorIcon from "@src/components/DynamicPhosphorIcon"; // Import DynamicPhosphorIcon
import { ThemedText } from "@src/components/ThemedText";
import { CATEGORY_MAP } from "@src/constants/CategoryData";
import { useSellDraft } from "@src/context/SellDraftContext";
import { useTheme } from "@src/context/ThemeContext";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SellScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { updateDraft, resetDraft } = useSellDraft();
  const handleCategoryPress = (id: string) => {
    updateDraft("categoryId", id);
    router.push({ pathname: "/sell/subcategory", params: { categoryId: id } });
  };

  const categories = Object.keys(CATEGORY_MAP).map((id) => ({
    id,
    ...CATEGORY_MAP[id],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <ThemedText style={styles.title}>
          {t("sellSection.What_are_you_selling?")}
        </ThemedText>

        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => handleCategoryPress(item.id)}
            >
              <DynamicPhosphorIcon
                name={item.icon}
                size={32}
                color={colors.text}
                weight="duotone"
              />
              <ThemedText style={styles.cardText}>
                {t(`categories.${item.nameKey}`)}
              </ThemedText>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 10, flex: 1 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  card: {
    flex: 1,
    padding: 20,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 8,
  },
  cardText: { fontSize: 14, fontWeight: "500", textAlign: "center" },
});
