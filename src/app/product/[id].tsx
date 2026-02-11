import BuyerSafetyGuidelines from "@src/components/productDetails_components/BuyerSafetyGuidelines";
import ProductActionButtons from "@src/components/productDetails_components/ProductActionButtons";
import ProductDescription from "@src/components/productDetails_components/ProductDescription";
import ProductDetailsTable from "@src/components/productDetails_components/ProductDetailsTable";
import ProductHeader from "@src/components/productDetails_components/ProductHeader";
import ProductImageGallery from "@src/components/productDetails_components/ProductImageGallery";
import ProductInfoSection from "@src/components/productDetails_components/ProductInfoSection";
import ProductLocation from "@src/components/productDetails_components/ProductLocation";
import SellerInfoSection from "@src/components/productDetails_components/SellerInfoSection";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { CAMBODIA_LOCATIONS } from "@src/constants/CambodiaLocations";
import useThemeColor from "@/src/hooks/useThemeColor";
import {
  Product,
  calculateDiscountPrice,
  formatTimeAgo,
} from "@/src/types/productTypes";
import { formatProductDetails } from "@src/utils/productUtils";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

// Mock product data - replace with your API call
const mockProducts: Product[] = [
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
      color: "White",
    },
    contact: {
      sellerName: "Sarah Chen",
      phones: ["012 345 678", "098 765 432"],
      email: "sarah.chen@email.com",
    },
    views: 200,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
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
];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const [isFavorite, setIsFavorite] = useState(false);

  const product = mockProducts.find((p) => p.id === id);

  const handleShare = () => {
    console.log("Sharing product...");
  };

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
    console.log("Toggling favorite:", !isFavorite);
  };

  const getLocalizedLocationName = (
    englishName: string | null | undefined,
    currentLanguage: string,
    level: "province" | "district" | "commune",
    provinceNameEn?: string | null,
    districtNameEn?: string | null,
  ): string | null => {
    if (!englishName) return null;

    const findLocalizedName = (
      locationArray: any[] | undefined,
      targetEnName: string,
    ) => {
      if (!locationArray) return null;

      const found = locationArray.find((item) => item.name_en === targetEnName);
      return found
        ? currentLanguage === "kh"
          ? found.name_km
          : found.name_en
        : null;
    };

    if (level === "province") {
      return findLocalizedName(CAMBODIA_LOCATIONS, englishName);
    } else if (level === "district" && provinceNameEn) {
      const province = CAMBODIA_LOCATIONS.find(
        (p) => p.name_en === provinceNameEn,
      );
      return findLocalizedName(province?.subdivisions, englishName);
    } else if (level === "commune" && provinceNameEn && districtNameEn) {
      const province = CAMBODIA_LOCATIONS.find(
        (p) => p.name_en === provinceNameEn,
      );
      const district = province?.subdivisions?.find(
        (d) => d.name_en === districtNameEn,
      );
      return findLocalizedName(district?.subdivisions, englishName);
    }
    return null;
  };

  if (!product) {
    return (
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Stack.Screen
          options={{ title: "Product Not Found", headerShown: false }}
        />
        <ThemedText style={styles.notFoundText}>Product not found.</ThemedText>
      </View>
    );
  }

  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

  const productDetails = formatProductDetails(
    product.subCategory,
    product.details,
  );

  const discountedPrice = calculateDiscountPrice(product);
  const formattedDiscountedPrice =
    discountedPrice !== null ? String(discountedPrice) : undefined;
  const localizedCommune = getLocalizedLocationName(
    product.address.commune,
    i18n.language,
    "commune",
    product.address.province,
    product.address.district,
  );
  const localizedDistrict = getLocalizedLocationName(
    product.address.district,
    i18n.language,
    "district",
    product.address.province,
  );
  const localizedProvince = getLocalizedLocationName(
    product.address.province,
    i18n.language,
    "province",
  );

  const fullAddress =
    [localizedCommune, localizedDistrict, localizedProvince]
      .filter(Boolean)
      .join(", ") || "N/A";
  const timeAgo = formatTimeAgo(product.createdAt, t);

  const handleCall = () => {
    if (product.contact.phones.length > 0) {
      const phoneNumber = String(product.contact.phones[0]).replace(/\s/g, "");
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleChat = () => {
    console.log("Open chat with seller");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <ProductHeader
        onShare={handleShare}
        onFavorite={handleFavorite}
        isFavorite={isFavorite}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        <ProductImageGallery photos={product.photos} />

        <ProductInfoSection
          product={product}
          discountedPrice={formattedDiscountedPrice}
          timeAgo={timeAgo}
          activeFont={activeFont}
          t={t}
        />

        {/* Location */}
        <ProductLocation
          fullAddress={fullAddress}
          location={product.location}
        />

        {/* Description */}
        <ProductDescription
          description={product.description}
          activeFont={activeFont}
        />

        {/* Product Details */}
        <ProductDetailsTable
          mainCategory={product.mainCategory}
          subCategory={product.subCategory}
          productDetails={productDetails}
          activeFont={activeFont}
        />

        {/* Seller Info */}
        <SellerInfoSection product={product} />

        {/* Action Buttons */}
        <ProductActionButtons
          onCallSeller={handleCall}
          onChatSeller={handleChat}
        />

        {/* Safety Guidelines */}
        <BuyerSafetyGuidelines />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  notFoundText: {
    textAlign: "center",
    marginTop: 50,
  },
});
