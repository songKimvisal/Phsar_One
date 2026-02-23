import { useTradeProducts } from "@/src/context/TradeProductsContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import SearchBar from "@src/components/shared_components/SearchBar";
import TradeProductCard from "@src/components/trade_components/TradeProductCard";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { Plus } from "phosphor-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TradeScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { t } = useTranslation();
  const { products } = useTradeProducts();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNewTrade = () => {
    // Navigate to the AddTradeProductScreen
    router.push("/trade/AddTradeProductScreen");
  };

  const productsToDisplay = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <SearchBar onSearch={handleSearch} />

      <FlatList
        data={productsToDisplay}
        renderItem={({ item }) => {
          const mappedProduct = {
            id: item.id,
            image: item.images[0],
            title: item.title,
            seller: item.seller,
            timeAgo: t(`time_ago.${item.timeAgo.unit}`, { count: item.timeAgo.value }),
            location: t(`provinces.${item.province}`),
            lookingFor: item.lookingFor.map((lf) => lf.name),
            condition: item.condition,
          };
          return (
            <TradeProductCard
              product={mappedProduct}
              onPress={() =>
                router.push({
                  pathname: "/trade/[id]",
                  params: { id: item.id },
                })
              }
            />
          );
        }}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.listContentContainer,
          { paddingBottom: bottomTabBarHeight + 120 },
        ]}
        columnWrapperStyle={styles.columnWrapper}
      />

      {/* Floating Action Button */}
      <TouchableOpacity

style={[styles.fab, { bottom: bottomTabBarHeight + 40 }]}
        onPress={handleAddNewTrade}
      >
        <Plus size={24} color="white" weight="bold" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    backgroundColor: Colors.reds[500],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
