import DynamicPhosphorIcon from "@/src/components/DynamicPhosphorIcon";
import { ThemedText } from "@/src/components/ThemedText";
import { CATEGORY_MAP } from "@/src/constants/CategoryData";
import useThemeColor from "@/src/hooks/useThemeColor";
import { Product } from "@/src/types/productTypes";
import EmptyState from "@src/components/category_components/EmptyState";
import ProductCard from "@src/components/category_components/ProductCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CaretLeft, Funnel, MapPin } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoryDetailScreen() {
  const { id, title } = useLocalSearchParams();
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t, i18n } = useTranslation();
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

  // State management
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null,
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get category data
  const categoryData = CATEGORY_MAP[id as string];
  const mainCategoryName = categoryData?.nameKey || "";

  const subCategoryData = Object.entries(categoryData?.sub || {}).map(
    ([name, icon]) => ({
      name,
      icon,
    }),
  );

  useEffect(() => {
    fetchProducts();
  }, [id, selectedSubCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Build API query
      let apiUrl = `YOUR_API_URL/products?mainCategory=${encodeURIComponent(title as string)}`;

      if (selectedSubCategory) {
        apiUrl += `&subCategory=${encodeURIComponent(selectedSubCategory)}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);

      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleSubCategoryPress = (subCategoryName: string) => {
    if (selectedSubCategory === subCategoryName) {
      setSelectedSubCategory(null);
    } else {
      setSelectedSubCategory(subCategoryName);
    }
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleFilterPress = () => {
    console.log("Open filter modal");
  };

  const handleLocationPress = () => {
    console.log("Open location filter");
  };

  // Filter products based on selection
  const filteredProducts = selectedSubCategory
    ? products.filter((p) => p.subCategory === selectedSubCategory)
    : products;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: themeColors.background,
            borderBottomColor: themeColors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <CaretLeft size={24} color={themeColors.text} />
        </TouchableOpacity>
        <ThemedText
          style={[
            styles.headerTitle,
            { fontFamily: activeFont, color: themeColors.text },
          ]}
        >
          {title}
        </ThemedText>
        <View style={styles.headerButton} />
      </View>

      {/* Subcategory Scroll */}
      <View style={styles.subCategoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subScroll}
        >
          {subCategoryData.map((subItem) => {
            const isSelected = selectedSubCategory === subItem.name;

            return (
              <TouchableOpacity
                key={subItem.name}
                style={[
                  styles.subChip,
                  {
                    backgroundColor: isSelected
                      ? themeColors.tint
                      : themeColors.card,
                    borderColor: isSelected
                      ? themeColors.tint
                      : themeColors.border,
                  },
                ]}
                onPress={() => handleSubCategoryPress(subItem.name)}
              >
                <DynamicPhosphorIcon
                  name={subItem.icon}
                  size={16}
                  color={isSelected ? "#FFFFFF" : themeColors.text}
                  weight="duotone"
                />
                <ThemedText
                  style={[
                    styles.subChipText,
                    {
                      fontFamily: activeFont,
                      color: isSelected ? "#FFFFFF" : themeColors.text,
                    },
                  ]}
                >
                  {t(`subcategories.${subItem.name}`)}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Bar */}
      <View
        style={[styles.filterBar, { borderBottomColor: themeColors.border }]}
      >
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={handleLocationPress}
        >
          <MapPin size={18} color={themeColors.text} />
          <ThemedText style={[styles.filterText, { fontFamily: activeFont }]}>
            {t("fields.location")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={handleFilterPress}>
          <Funnel size={18} color={themeColors.text} />
          <ThemedText style={[styles.filterText, { fontFamily: activeFont }]}>
            {t("fields.filter_sort")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <ThemedText style={[styles.resultsText, { fontFamily: activeFont }]}>
          {filteredProducts.length} {t("common.results")}
          {selectedSubCategory &&
            ` in ${t(`subcategories.${selectedSubCategory}`)}`}
        </ThemedText>
      </View>

      {/* Product List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.tint} />
        </View>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          message={
            selectedSubCategory
              ? t("common.noProductsInSubcategory")
              : t("common.noProducts")
          }
          onReset={
            selectedSubCategory ? () => setSelectedSubCategory(null) : undefined
          }
        />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </SafeAreaView>
  );
}

// Mock data function - remove this when you have real API
function getMockProducts(): Product[] {
  return [
    {
      id: "1",
      title: "Mercedes CLA45",
      description:
        "Luxury sedan in excellent condition with low mileage. Perfect for city driving and long trips.",
      mainCategory: "Vehicles",
      subCategory: "Car",

      photos: [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
      ],

      price: "50000",
      currency: "KHR",
      negotiable: true,
      discountType: "percentage",
      discountValue: "5",
      address: {
        province: "Phnom Penh",
        district: "Sen Sok",
        commune: "Phnom Penh Thmey",
      },
      location: {
        latitude: 11.5564,
        longitude: 104.9282,
      },
      details: {
        brand: "Mercedes",
        model: "CLA45",
        year: "2023",
        mileage: "0",
        fuelType: "Petrol",
        transmission: "Manual",
        condition: "new", // Added condition
      },
      contact: {
        sellerName: "Sarah Chen",
        phones: ["012 345 678", "098 765 432"],
        email: "sarah.chen@email.com",
      },
      views: 200,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: "active",
      seller: {
        id: "seller1",
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        verified: true,
        trusted: true,
        rating: 4.8,
        totalListings: 24,
      },
    },
    {
      id: "2",
      title: "Honda Dream 2024",
      description: "New Honda Dream 2024, excellent condition.",
      mainCategory: "Vehicles",
      subCategory: "Motorcycle",

      photos: [
        "https://images.unsplash.com/photo-1558981403-c5cb989c7442?w=800",
        "https://images.unsplash.com/photo-1598550774677-172545d166c3?w=800",
      ],
      price: "2500",

      currency: "USD",
      negotiable: false,
      discountType: "none",
      discountValue: "0",
      address: {
        province: "Kandal",
        district: "Takhmao",
        commune: "Prek Hou",
      },

      location: {
        latitude: 11.4927,
        longitude: 104.9403,
      },
      details: {
        brand: "Honda",
        model: "Dream",
        year: "2024",
        mileage: "0",
        fuelType: "Petrol",
        transmission: "Automatic",
        condition: "like new", // Added condition
      },
      contact: {
        sellerName: "Sok Vuthy",
        phones: ["010 123 456"],
        email: "sok.vuthy@email.com",
      },
      views: 150,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      status: "active",
      seller: {
        id: "seller2",
        name: "Sok Vuthy",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        verified: true,
        trusted: false,
        rating: 4.5,
        totalListings: 18,
      },
    },
    // Add more mock products as needed
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  subCategoryContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // Default light border, will be overridden by theme
  },
  subScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  subChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  subChipText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
  filterBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: "#eee", // Default light border, will be overridden by theme
  },
  filterBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4, // Added padding for better touch area
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsText: {
    fontSize: 13,
    opacity: 0.6,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
});
