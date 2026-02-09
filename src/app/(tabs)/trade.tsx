import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import TradeHeader from "@src/components/trade_components/TradeHeader";
import TradeProductCard from "@src/components/trade_components/TradeProductCard";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { Plus } from "phosphor-react-native";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Placeholder for product type, adjust as per actual data structure
interface TradeProduct {
  id: string;
  image: string;
  title: string;
  seller: string;
  timeAgo: string;
  location: string;
  lookingFor: string[];
  condition: string;
}

const DUMMY_TRADE_PRODUCTS: TradeProduct[] = [
  {
    id: "1",
    image:
      "https://imgs.search.brave.com/xwNZhHGydKTcMrOfpJW2CVcIZSDfkMCz-SaN0oQYUlE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ3/ODYxMDY1Mi9waG90/by9oY21jLXZpZXRu/YW0tbWFjYm9vay1w/cm8tMTQtaW5jaGVz/LW0yLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1yN24zWldr/NUtiSUVXNk1tcEFH/V2FYc1VJS3ZMLUtn/c2tJNmZTLXQ1anY0/PQ",
    title: "MacBook Pro M1",
    seller: "Sarah Chen",
    timeAgo: "2 hours ago",
    location: "Sen Sok",
    lookingFor: ["Gaming Laptop", "ROG", "MSI"],
    condition: "Good",
  },
  {
    id: "2",
    image:
      "https://imgs.search.brave.com/xwNZhHGydKTcMrOfpJW2CVcIZSDfkMCz-SaN0oQYUlE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ3/ODYxMDY1Mi9waG90/by9oY21jLXZpZXRu/YW0tbWFjYm9vay1w/cm8tMTQtaW5jaGVz/LW0yLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1yN24zWldr/NUtiSUVXNk1tcEFH/V2FYc1VJS3ZMLUtn/c2tJNmZTLXQ1anY0/PQ",
    title: "Steam Deck",
    seller: "By Lina",
    timeAgo: "2 hours ago",
    location: "Sen Sok",
    lookingFor: ["Handheld Gaming Device"],
    condition: "Good",
  },
  {
    id: "3",
    image:
      "https://imgs.search.brave.com/xwNZhHGydKTcMrOfpJW2CVcIZSDfkMCz-SaN0oQYUlE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ3/ODYxMDY1Mi9waG90/by9oY21jLXZpZXRu/YW0tbWFjYm9vay1w/cm8tMTQtaW5jaGVz/LW0yLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1yN24zWldr/NUtiSUVXNk1tcEFH/V2FYc1VJS3ZMLUtn/c2tJNmZTLXQ1anY0/PQ",
    title: "MacBook Pro M1",
    seller: "By Sarah Chen",
    timeAgo: "2 hours ago",
    location: "Sen Sok",
    lookingFor: ["Gaming Laptop", "ROG", "MSI"],
    condition: "Good",
  },
  {
    id: "4",
    image:
      "https://imgs.search.brave.com/xwNZhHGydKTcMrOfpJW2CVcIZSDfkMCz-SaN0oQYUlE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ3/ODYxMDY1Mi9waG90/by9oY21jLXZpZXRu/YW0tbWFjYm9vay1w/cm8tMTQtaW5jaGVz/LW0yLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1yN24zWldr/NUtiSUVXNk1tcEFH/V2FYc1VJS3ZMLUtn/c2tJNmZTLXQ1anY0/PQ",
    title: "Steam Deck",
    seller: "By Lina",
    timeAgo: "2 hours ago",
    location: "Sen Sok",
    lookingFor: ["Handheld Gaming Device"],
    condition: "Good",
  },
  {
    id: "5",
    image:
      "https://imgs.search.brave.com/xwNZhHGydKTcMrOfpJW2CVcIZSDfkMCz-SaN0oQYUlE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ3/ODYxMDY1Mi9waG90/by9oY21jLXZpZXRu/YW0tbWFjYm9vay1w/cm8tMTQtaW5jaGVz/LW0yLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1yN24zWldr/NUtiSUVXNk1tcEFH/V2FYc1VJS3ZMLUtn/c2tJNmZTLXQ1anY0/PQ",
    title: "MacBook Pro M1",
    seller: "Sarah Chen",
    timeAgo: "2 hours ago",
    location: "Sen Sok",
    lookingFor: ["Gaming Laptop", "ROG", "MSI"],
    condition: "Good",
  },
  {
    id: "6",
    image:
      "https://imgs.search.brave.com/xwNZhHGydKTcMrOfpJW2CVcIZSDfkMCz-SaN0oQYUlE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ3/ODYxMDY1Mi9waG90/by9oY21jLXZpZXRu/YW0tbWFjYm9vay1w/cm8tMTQtaW5jaGVz/LW0yLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1yN24zWldr/NUtiSUVXNk1tcEFH/V2FYc1VJS3ZMLUtn/c2tJNmZTLXQ1anY0/PQ",
    title: "MacBook Pro M1",
    seller: "Sarah Chen",
    timeAgo: "2 hours ago",
    location: "Sen Sok",
    lookingFor: ["Gaming Laptop", "ROG", "MSI"],
    condition: "Good",
  },
];

export default function TradeScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const bottomTabBarHeight = useBottomTabBarHeight();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddNewTrade = () => {
    // Navigate to the AddTradeProductScreen
    router.push("/trade/AddTradeProductScreen");
  };

  const productsToDisplay = DUMMY_TRADE_PRODUCTS.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <TradeHeader onSearch={handleSearch} />

      <FlatList
        data={productsToDisplay}
        renderItem={({ item }) => (
          <TradeProductCard
            product={item}
            onPress={() => console.log("Product pressed:", item.id)}
          />
        )}
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
        style={{
          position: "absolute",
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          right: 20,
          bottom: bottomTabBarHeight + 40,
          backgroundColor: Colors.reds[500],
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
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
    marginBottom: 0,
  },
});
