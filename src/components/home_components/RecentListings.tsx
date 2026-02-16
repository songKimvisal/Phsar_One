import ProductCard from "@src/components/category_components/ProductCard";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface RecentListingsProps {
  products: any[];
  loading: boolean;
}

export default function RecentListings({
  products,
  loading,
}: RecentListingsProps) {
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#E44336" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.center}>
        <ThemedText>
          {t("category.no_products") || "No products found"}
        </ThemedText>
      </View>
    );
  }

  const renderProduct = (item: any) => (
    <ProductCard
      key={item.id}
      product={{
        ...item,
        photos:
          item.images && item.images.length > 0
            ? item.images
            : ["https://via.placeholder.com/300"],
        createdAt: item.created_at,
        negotiable: item.is_negotiable,
        currency: item.metadata?.currency || "USD",
        mainCategory: item.metadata?.mainCategory || "",
        subCategory: item.metadata?.subCategory || "",
        address: {
          province: item.location_name || "",
          district: item.metadata?.district || "",
          commune: item.metadata?.commune || "",
        },
        details: item.metadata || {},
      }}
      onPress={() => {
        router.push(`/product/${item.id}`);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>
        {t("home_screen.recent_listings")}
      </ThemedText>
      <View style={styles.row}>
        {products.map((item) => (
          <View key={item.id} style={styles.productItem}>
            {renderProduct(item)}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginHorizontal: 6,
    marginBottom: 64,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  productItem: {
    flex: 1,
    minWidth: "45%",
    maxWidth: "50%",
    aspectRatio: 0.85,
  },
});
