import Header from "@/src/components/home_components/Header";
import ProductCategory from "@/src/components/home_components/ProductCategory";
import RecentListings from "@/src/components/home_components/RecentListings";
import useThemeColor from "@src/hooks/useThemeColor";
import { useProducts } from "@src/hooks/useProducts";
import { useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const themeColors = useThemeColor();
  const { products, loading, refresh } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

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
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header />
        <ProductCategory />
        <RecentListings products={products} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {},
});
