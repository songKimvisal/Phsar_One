import { ThemedText } from "@src/components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import {
  Product,
  calculateDiscountPrice,
  formatAddress,
  formatTimeAgo,
} from "@src/types/productTypes";
import { formatProductDetails } from "@src/utils/productUtils";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import BuyerSafetyGuidelines from "../../components/productDetails_components/BuyerSafetyGuidelines";
import ProductActionButtons from "../../components/productDetails_components/ProductActionButtons";
import ProductDescription from "../../components/productDetails_components/ProductDescription";
import ProductDetailsTable from "../../components/productDetails_components/ProductDetailsTable";
import ProductHeader from "../../components/productDetails_components/ProductHeader";
import ProductImageGallery from "../../components/productDetails_components/ProductImageGallery";
import ProductInfoSection from "../../components/productDetails_components/ProductInfoSection";
import ProductLocation from "../../components/productDetails_components/ProductLocation";
import SellerInfoSection from "../../components/productDetails_components/SellerInfoSection";

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

  const product = mockProducts.find((p) => p.id === id);

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
  const fullAddress = formatAddress(product.address);
  const timeAgo = formatTimeAgo(product.createdAt);

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
      <ProductHeader />

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
