import Header from "@/src/components/home_components/Header";
import ProductCategory from "@/src/components/home_components/ProductCategory";
import RecentListings from "@/src/components/home_components/RecentListings";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { useProducts } from "@src/hooks/useProducts";
import useThemeColor from "@src/hooks/useThemeColor";
import { Href, useRouter } from "expo-router";
import { MagnifyingGlassIcon } from "phosphor-react-native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const themeColors = useThemeColor();
  const { products, loading, refresh } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/search" as Href)}
          style={[
            styles.searchBar,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.text + "15",
            },
          ]}
        >
          <ThemedText style={styles.searchPlaceholder}>Search...</ThemedText>
          <MagnifyingGlassIcon size={22} color={themeColors.text} />
        </TouchableOpacity>

        <ProductCategory />
        <RecentListings products={products} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {},
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  searchPlaceholder: {
    opacity: 0.5,
    fontSize: 16,
  },
});
