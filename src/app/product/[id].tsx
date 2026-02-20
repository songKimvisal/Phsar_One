import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Href, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import useThemeColor from "@/src/hooks/useThemeColor";
import {
  Product,
  calculateDiscountPrice,
  formatTimeAgo,
} from "@/src/types/productTypes";
import { createClerkSupabaseClient } from "@src/lib/supabase";
import { formatProductDetails } from "@src/utils/productUtils";
import { CAMBODIA_LOCATIONS } from "@src/constants/CambodiaLocations";
import { useProductDetails } from "@src/hooks/useProductDetails";

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
import { Colors } from "@src/constants/Colors";
import { ChatCircleIcon, ArrowsClockwiseIcon } from "phosphor-react-native";

type ProductChatType = 'normal' | 'trade';

// New component for the chat type toggle
const ProductTypeToggle: React.FC<{
  currentType: ProductChatType;
  onToggle: (type: ProductChatType) => void;
  themeColors: ReturnType<typeof useThemeColor>;
  t: (key: string) => string;
}> = ({ currentType, onToggle, themeColors, t }) => {
  const isNormalChat = currentType === 'normal';
  return (
    <View style={[toggleStyles.container, { borderColor: themeColors.border }]}>
      <TouchableOpacity
        style={[
          toggleStyles.button,
          isNormalChat && { backgroundColor: themeColors.tint },
        ]}
        onPress={() => onToggle('normal')}
      >
        <ChatCircleIcon size={18} color={isNormalChat ? 'white' : themeColors.text} weight={isNormalChat ? "fill" : "regular"} />
        <ThemedText style={[toggleStyles.buttonText, { color: isNormalChat ? 'white' : themeColors.text }]}>
          {t("chat.normal_product_chat")}
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          toggleStyles.button,
          !isNormalChat && { backgroundColor: themeColors.tint },
        ]}
        onPress={() => onToggle('trade')}
      >
        <ArrowsClockwiseIcon size={18} color={!isNormalChat ? 'white' : themeColors.text} weight={!isNormalChat ? "fill" : "regular"} />
        <ThemedText style={[toggleStyles.buttonText, { color: !isNormalChat ? 'white' : themeColors.text }]}>
          {t("chat.trade_product_chat")}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 99,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const themeColors = useThemeColor();
  const { t, i18n } = useTranslation();
  const { userId, getToken } = useAuth();
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(false);
  const { product: rawProduct, loading } = useProductDetails(id as string);
  const [productChatType, setProductChatType] = useState<ProductChatType>('normal'); // New state

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: themeColors.background },
        ]}
      >
        <ActivityIndicator size="small" color="#E44336" />
      </View>
    );
  }

  if (!rawProduct) {
    return (
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <Stack.Screen
          options={{ title: t("common.product_not_found"), headerShown: false }}
        />
        <ThemedText style={styles.notFoundText}>{t("common.product_not_found")}</ThemedText>
      </View>
    );
  }

  const isOwner = userId === rawProduct.seller_id;

  const product: Product = {
    ...rawProduct,
    id: rawProduct.id,
    photos: rawProduct.images || [],
    createdAt: rawProduct.created_at,
    negotiable: rawProduct.is_negotiable,
    currency: rawProduct.metadata?.currency || "USD",
    mainCategory: rawProduct.metadata?.mainCategory || "",
    subCategory: rawProduct.metadata?.subCategory || "",
    address: {
      province: rawProduct.location_name || "",
      district: rawProduct.metadata?.district || "",
      commune: rawProduct.metadata?.commune || "",
    },
    location: rawProduct.metadata?.location || { latitude: 0, longitude: 0 },
    details: rawProduct.metadata || {},
    contact: {
      sellerName: rawProduct.seller?.first_name || "Unknown",
      phones: rawProduct.seller?.phone ? [rawProduct.seller.phone] : [],
      email: rawProduct.seller?.email || "",
    },
    seller: {
      id: rawProduct.seller?.id,
      name: rawProduct.seller?.first_name || "Seller",
      avatar: rawProduct.seller?.avatar_url,
      verified: true,
      trusted: true,
      rating: 5.0,
      totalListings: 1,
    },
  };

  const handleShare = () => {
    console.log("Sharing product...");
  };

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleCall = () => {
    if (product.contact.phones.length > 0) {
      const phoneNumber = String(product.contact.phones[0]).replace(/\s/g, "");
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  // Modified handleChat to use productChatType
  const handleChat = (type: ProductChatType) => {
    if (type === 'normal') {
      router.push({
        pathname: "/chat/normal/[id]",
        params: {
          id: product.id,
          sellerId: product.seller?.id,
          sellerName: product.seller?.name,
          sellerAvatar: product.seller?.avatar,
          productTitle: product.title,
          productThumbnail: product.photos[0],
          productPrice: product.price,
          productCurrency: product.currency,
        },
      } as Href);
    } else if (type === 'trade') {
      router.push({
        pathname: "/chat/trade/[id]",
        params: {
          id: product.id,
          sellerId: product.seller?.id,
          sellerName: product.seller?.name,
          sellerAvatar: product.seller?.avatar,
          productTitle: product.title,
          productThumbnail: product.photos[0],
          productPrice: product.price,
          productCurrency: product.currency,
        },
      } as Href);
    }
  };

  const handleEdit = () => {
    router.push(`/sell/details?editId=${product.id}` as Href);
  };

  const handleDelete = async () => {
    Alert.alert(
      t("common.delete"),
      t("common.confirm_delete"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const token = await getToken();
              const authSupabase = createClerkSupabaseClient(token);
              const { error } = await authSupabase
                .from("products")
                .delete()
                .eq("id", product.id);
              if (error) throw error;
              router.replace("/(tabs)");
            } catch (err) {
              Alert.alert(t("common.error"), t("common.failed_to_delete_listing"));
            }
          },
        },
      ],
    );
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
    if (level === "province")
      return findLocalizedName(CAMBODIA_LOCATIONS, englishName);
    if (level === "district" && provinceNameEn) {
      const province = CAMBODIA_LOCATIONS.find(
        (p) => p.name_en === provinceNameEn,
      );
      return findLocalizedName(province?.subdivisions, englishName);
    }
    if (level === "commune" && provinceNameEn && districtNameEn) {
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

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ProductHeader
        onShare={handleShare}
        onFavorite={handleFavorite}
        isFavorite={isFavorite}
      />

      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 100 }} // Space for sticky footer
          showsVerticalScrollIndicator={false}
        >
          <ProductImageGallery photos={product.photos} />

          <ProductInfoSection
            product={product}
            discountedPrice={formattedDiscountedPrice}
            timeAgo={timeAgo}
            activeFont={activeFont}
            t={t}
          />

          <ProductLocation
            fullAddress={fullAddress}
            location={product.location}
          />

          <ProductDescription
            description={product.description}
            activeFont={activeFont}
          />

          <ProductDetailsTable
            mainCategory={product.mainCategory}
            subCategory={product.subCategory}
            productDetails={productDetails}
            activeFont={activeFont}
          />

          <SellerInfoSection
            product={product}
            onViewProfile={() =>
              router.push(`/user/${product.seller?.id}` as Href)
            }
          />

          <BuyerSafetyGuidelines />
        </ScrollView>

        {/* Sticky Footer */}
        <View
          style={[
            styles.stickyFooter,
            { backgroundColor: themeColors.background },
          ]}
        >
          {!isOwner && (
            <ProductTypeToggle
              currentType={productChatType}
              onToggle={setProductChatType}
              themeColors={themeColors}
              t={t}
            />
          )}
          <ProductActionButtons
            isOwner={isOwner}
            onCallSeller={handleCall}
            onChatSeller={() => handleChat(productChatType)} // Pass productChatType to handleChat
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  notFoundText: {
    textAlign: "center",
    marginTop: 50,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    elevation: 10,
  },
});
