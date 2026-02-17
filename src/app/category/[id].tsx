import DynamicPhosphorIcon from "@/src/components/shared_components/DynamicPhosphorIcon";
import { ThemedText } from "@/src/components/shared_components/ThemedText";
import { CAMBODIA_LOCATIONS } from "@/src/constants/CambodiaLocations";
import { CATEGORY_MAP } from "@/src/constants/CategoryData";
import EmptyState from "@src/components/category_components/EmptyState";
import ProductCard from "@src/components/category_components/ProductCard";
import useThemeColor from "@src/hooks/useThemeColor";
import { Product } from "@src/types/productTypes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CaretLeftIcon, FunnelIcon, MapPinIcon } from "phosphor-react-native";
import React, { useEffect, useMemo, useState } from "react";
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

const productConditions = ["new", "used", "like new", "good", "fair"];

const getShortName = (fullName: string): string => {
  if (!fullName) return "";
  const prefixes = ["Khan ", "Sangkat ", "District ", "Commune "];
  for (const prefix of prefixes) {
    if (fullName.startsWith(prefix)) {
      return fullName.substring(prefix.length);
    }
  }
  return fullName;
};

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
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
  const [sortByPrice, setSortByPrice] = useState<"asc" | "desc" | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null,
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showFilterSortDropdown, setShowFilterSortDropdown] = useState(false);

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
  }, [
    id,
    selectedSubCategory,
    selectedProvince,
    selectedDistrict,
    selectedCommune,
    sortByPrice,
    selectedCondition,
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Build API query
      let apiUrl = `YOUR_API_URL/products?mainCategory=${encodeURIComponent(title as string)}`;

      if (selectedSubCategory) {
        apiUrl += `&subCategory=${encodeURIComponent(selectedSubCategory)}`;
      }
      if (selectedProvince) {
        apiUrl += `&province=${encodeURIComponent(selectedProvince)}`;
      }
      if (selectedDistrict) {
        apiUrl += `&district=${encodeURIComponent(selectedDistrict)}`;
      }
      if (selectedCommune) {
        apiUrl += `&commune=${encodeURIComponent(selectedCommune)}`;
      }
      if (sortByPrice) {
        apiUrl += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
      }
      if (selectedCondition) {
        apiUrl += `&condition=${encodeURIComponent(selectedCondition)}`;
      }

      // If YOUR_API_URL is still the placeholder, use mock data directly
      if (apiUrl.startsWith("YOUR_API_URL")) {
        setProducts(getMockProducts());
        return;
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
    router.push({ pathname: "/product/[id]", params: { id: productId } });
  };

  const handleFilterPress = () => {
    setShowFilterSortDropdown((prev) => !prev);
    setShowLocationDropdown(false);
  };

  const handleLocationPress = () => {
    setShowLocationDropdown((prev) => !prev);
    setShowFilterSortDropdown(false);
  };

  const displayedSortByPrice = useMemo(() => {
    if (sortByPrice === "asc") {
      return t("common.price_low_to_high");
    } else if (sortByPrice === "desc") {
      return t("common.price_high_to_low");
    }
    return "";
  }, [sortByPrice, t]);

  const displayedCondition = useMemo(() => {
    if (selectedCondition) {
      return t(`conditions.${selectedCondition}`);
    }
    return "";
  }, [selectedCondition, t]);

  // Filter and sort products based on all selections
  const filteredProducts = useMemo(() => {
    let currentProducts = products;

    // Apply subcategory filter
    if (selectedSubCategory) {
      currentProducts = currentProducts.filter(
        (p) => p.subCategory === selectedSubCategory,
      );
    }

    // Apply location filters
    if (selectedProvince) {
      currentProducts = currentProducts.filter(
        (p) => p.address?.province === selectedProvince,
      );
    }
    if (selectedDistrict) {
      currentProducts = currentProducts.filter(
        (p) => p.address?.district === selectedDistrict,
      );
    }
    if (selectedCommune) {
      currentProducts = currentProducts.filter(
        (p) => p.address?.commune === selectedCommune,
      );
    }

    // Apply condition filter
    if (selectedCondition) {
      currentProducts = currentProducts.filter(
        (p) => p.details?.condition === selectedCondition,
      );
    }

    // Apply price sort
    if (sortByPrice) {
      currentProducts = [...currentProducts].sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        if (sortByPrice === "asc") {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      });
    }

    return currentProducts;
  }, [
    products,
    selectedSubCategory,
    selectedProvince,
    selectedDistrict,
    selectedCommune,
    selectedCondition,
    sortByPrice,
  ]);

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
          <CaretLeftIcon size={24} color={themeColors.text} />
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
                  weight="regular"
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
          style={[
            styles.filterBtn,
            { borderRightWidth: 1, borderRightColor: themeColors.border },
          ]}
          onPress={handleLocationPress}
        >
          <MapPinIcon
            size={18}
            color={
              selectedProvince || selectedDistrict || selectedCommune
                ? themeColors.tint
                : themeColors.text
            }
          />
          <ThemedText
            style={[
              styles.filterText,
              {
                fontFamily: activeFont,
                color:
                  selectedProvince || selectedDistrict || selectedCommune
                    ? themeColors.tint
                    : themeColors.text,
              },
            ]}
          >
            {selectedProvince
              ? (
                  CAMBODIA_LOCATIONS.find(
                    (p) => p.name_en === selectedProvince,
                  ) as any
                )?.[i18n.language === "kh" ? "name_km" : "name_en"] ||
                selectedProvince
              : t("fields.location")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={handleFilterPress}>
          <FunnelIcon
            size={18}
            color={
              sortByPrice || selectedCondition
                ? themeColors.tint
                : themeColors.text
            }
          />
          <ThemedText
            style={[
              styles.filterText,
              {
                fontFamily: activeFont,
                color:
                  sortByPrice || selectedCondition
                    ? themeColors.tint
                    : themeColors.text,
              },
            ]}
          >
            {displayedSortByPrice || displayedCondition
              ? `${displayedSortByPrice} ${displayedCondition}`.trim()
              : t("fields.filter_sort")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Filter/Sort Dropdown */}
      {showFilterSortDropdown && (
        <View
          style={[
            styles.dropdownContainer,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <ScrollView>
            <ThemedText
              style={[styles.dropdownSectionTitle, { fontFamily: activeFont }]}
            >
              {t("fields.sort_by_price")}
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                sortByPrice === "asc" && { backgroundColor: themeColors.tint },
              ]}
              onPress={() => {
                setSortByPrice("asc");
                setShowFilterSortDropdown(false);
              }}
            >
              <ThemedText
                style={[
                  styles.dropdownItemText,
                  sortByPrice === "asc" && { color: "#FFFFFF" },
                ]}
              >
                {t("common.price_low_to_high")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                sortByPrice === "desc" && { backgroundColor: themeColors.tint },
              ]}
              onPress={() => {
                setSortByPrice("desc");
                setShowFilterSortDropdown(false);
              }}
            >
              <ThemedText
                style={[
                  styles.dropdownItemText,
                  sortByPrice === "desc" && { color: "#FFFFFF" },
                ]}
              >
                {t("common.price_high_to_low")}
              </ThemedText>
            </TouchableOpacity>

            <ThemedText
              style={[
                styles.dropdownSectionTitle,
                { fontFamily: activeFont, marginTop: 10 },
              ]}
            >
              {t("fields.condition")}
            </ThemedText>
            {productConditions.map((condition) => (
              <TouchableOpacity
                key={condition}
                style={[
                  styles.dropdownItem,
                  selectedCondition === condition && {
                    backgroundColor: themeColors.tint,
                  },
                ]}
                onPress={() => {
                  setSelectedCondition(condition);
                  setShowFilterSortDropdown(false);
                }}
              >
                <ThemedText
                  style={[
                    styles.dropdownItemText,
                    selectedCondition === condition && { color: "#FFFFFF" },
                  ]}
                >
                  {t(`conditions.${condition}`)}
                </ThemedText>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSortByPrice(null);
                setSelectedCondition(null);
                setShowFilterSortDropdown(false);
              }}
            >
              <ThemedText style={{ color: themeColors.tint }}>
                {t("common.clear")}
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Location Dropdown */}
      {showLocationDropdown && (
        <View
          style={[
            styles.dropdownContainer,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <ScrollView>
            <ThemedText
              style={[styles.dropdownSectionTitle, { fontFamily: activeFont }]}
            >
              {t("location.province")}
            </ThemedText>
            {CAMBODIA_LOCATIONS.map((province) => (
              <TouchableOpacity
                key={province.name_en}
                style={[
                  styles.dropdownItem,
                  selectedProvince === province.name_en && {
                    backgroundColor: themeColors.tint,
                  },
                ]}
                onPress={() => {
                  setSelectedProvince(province.name_en);
                  setSelectedDistrict(null);
                  setSelectedCommune(null);
                  setShowLocationDropdown(false); // Close dropdown
                }}
              >
                <ThemedText
                  style={[
                    styles.dropdownItemText,
                    selectedProvince === province.name_en && {
                      color: "#FFFFFF",
                    },
                  ]}
                >
                  {i18n.language === "kh" ? province.name_km : province.name_en}
                </ThemedText>
              </TouchableOpacity>
            ))}

            {selectedProvince && (
              <>
                <ThemedText
                  style={[
                    styles.dropdownSectionTitle,
                    { fontFamily: activeFont, marginTop: 10 },
                  ]}
                >
                  {t("location.district")}
                </ThemedText>
                {CAMBODIA_LOCATIONS.find(
                  (p) => p.name_en === selectedProvince,
                )?.subdivisions.map((district) => (
                  <TouchableOpacity
                    key={district.name_en}
                    style={[
                      styles.dropdownItem,
                      selectedDistrict === getShortName(district.name_en) && {
                        backgroundColor: themeColors.tint,
                      },
                    ]}
                    onPress={() => {
                      setSelectedDistrict(getShortName(district.name_en));
                      setSelectedCommune(null);
                      setShowLocationDropdown(false);
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.dropdownItemText,
                        selectedDistrict === getShortName(district.name_en) && {
                          color: "#FFFFFF",
                        },
                      ]}
                    >
                      {i18n.language === "kh"
                        ? district.name_km
                        : district.name_en}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {selectedDistrict && (
              <>
                <ThemedText
                  style={[
                    styles.dropdownSectionTitle,
                    { fontFamily: activeFont, marginTop: 10 },
                  ]}
                >
                  {t("location.commune")}
                </ThemedText>
                {CAMBODIA_LOCATIONS.find((p) => p.name_en === selectedProvince)
                  ?.subdivisions.find((d) => d.name_en === selectedDistrict)
                  ?.subdivisions.map((commune) => (
                    <TouchableOpacity
                      key={commune.name_en}
                      style={[
                        styles.dropdownItem,
                        selectedCommune === getShortName(commune.name_en) && {
                          backgroundColor: themeColors.tint,
                        },
                      ]}
                      onPress={() => {
                        setSelectedCommune(getShortName(commune.name_en));
                        setShowLocationDropdown(false);
                      }}
                    >
                      <ThemedText
                        style={[
                          styles.dropdownItemText,
                          selectedCommune === getShortName(commune.name_en) && {
                            color: "#FFFFFF",
                          },
                        ]}
                      >
                        {i18n.language === "kh"
                          ? commune.name_km
                          : commune.name_en}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
              </>
            )}

            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedProvince(null);
                setSelectedDistrict(null);
                setSelectedCommune(null);
                setShowLocationDropdown(false);
              }}
            >
              <ThemedText style={{ color: themeColors.tint }}>
                {t("common.clear")}
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

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
          <ActivityIndicator size="small" color={themeColors.tint} />
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

// Mock data function
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
        condition: "like new",
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
    width: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  subCategoryContainer: {
    paddingVertical: 12,
  },
  subScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  subChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  subChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  filterBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16, // Added horizontal padding
  },
  filterBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  filterText: {
    fontSize: 14,
  },
  dropdownContainer: {
    position: "absolute",
    top: 140,
    left: 16,
    right: 16,
    maxHeight: 400,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 1000,
    padding: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  clearFiltersButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  resultsContainer: {
    padding: 16,
  },
  resultsText: {
    fontSize: 14,
    opacity: 0.7,
  },
  productList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
