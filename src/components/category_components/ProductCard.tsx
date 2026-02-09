import { ThemedText } from "@/src/components/ThemedText";
import { Colors } from "@/src/constants/Colors";
import useThemeColor from "@/src/hooks/useThemeColor";
import { Product } from "@/src/types/productTypes"; 
import { formatPrice, formatTimeAgo } from "@/src/utils/productUtils"; 
import { Ionicons } from "@expo/vector-icons";
import { CAMBODIA_LOCATIONS } from "@src/constants/CambodiaLocations";
import { MapPin } from "phosphor-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { toCamelCase } from "@/src/utils/stringUtils"; 
import { getLocalizedLocationName } from "@/src/utils/locationUtils"; 

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const themeColors = useThemeColor();
  const { t, i18n } = useTranslation();

  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoritePress = () => {
    setIsFavorite((prev) => !prev);
  };

  const timeAgo = formatTimeAgo(product.createdAt, t);
  const mainImage = product.photos[0] || "https://via.placeholder.com/300";

  // Calculate if there's a discount
  const hasDiscount = product.discountType !== "none";
  const discountPercentage =
    product.discountType === "percentage" ? product.discountValue : null;

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
    null,
  );
  const localizedProvince = getLocalizedLocationName(
    product.address.province,
    i18n.language,
    "province",
    null, 
    null,
  );

  const fullAddress = [localizedCommune, localizedDistrict, localizedProvince].filter(Boolean).join(", ") || "N/A";
  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image Container */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: mainImage }} style={styles.productImage} />

        {/* Discount Badge */}
        {hasDiscount && discountPercentage && (
          <View style={[styles.discountBadge, {backgroundColor: themeColors.tint}]}>
            <ThemedText style={styles.discountText}>
              -{discountPercentage}%
            </ThemedText>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? Colors.reds[500] : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        {/* Title */}
        <ThemedText
          style={styles.productName}
          numberOfLines={1}
        >
          {product.title}
        </ThemedText>

        {/* Meta: Time, Location, and Views */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItemContainer}>
            <ThemedText
              style={[
                styles.productMeta,
                { opacity: 0.6 },
              ]}
            >
              {timeAgo}
            </ThemedText>
          </View>

          {fullAddress && (
            <>
              <ThemedText
                style={[
                  styles.productMeta,
                  { opacity: 0.6 },
                ]}
              >
                {" "}
                •{" "}
              </ThemedText>
              <View style={styles.metaItemContainer}>
                <MapPin
                  size={12}
                  color={themeColors.text}
                  style={styles.mapPinIcon}
                />
                <ThemedText
                  style={[
                    styles.productMeta,
                    { opacity: 0.6 },
                  ]}
                  numberOfLines={1}
                >
                  {fullAddress}
                </ThemedText>
              </View>
            </>
          )}
        </View>

        {/* Condition and Year (if available in details) */}
        {(product.details?.condition || product.details?.year) && (
          <ThemedText
            style={[
              styles.productMeta,
              { opacity: 0.6 },
            ]}
          >
            {[
              product.details?.condition
                ? t(
                    `fieldOptions.condition.${toCamelCase(product.details.condition)}`,
                  )
                : "",
              product.details?.year || "",
            ]
              .filter(Boolean)
              .join(` ${t("common.separator_bullet")} `)}
          </ThemedText>
        )}

        {/* Price and Negotiable Badge */}
        <View style={styles.priceRow}>
          <ThemedText
            style={[
              styles.productPrice,
              {
                color: themeColors.tint, 
                fontWeight: "bold",
              },
            ]}
          >
            {formatPrice(product.price, product.currency)}
          </ThemedText>
          {product.negotiable && (
            <View
              style={[
                styles.negotiableBadge,
                {
                  backgroundColor: themeColors.tint + "20", 
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.negotiableText,
                  {
                    color: themeColors.tint, 
                  },
                ]}
              >
                {t("productDetail.negotiable")}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  productCard: {
    borderRadius: 6,
    width: "48%",
    marginBottom: 6,
    overflow: "hidden",
    borderWidth: 1,
  },
  imageWrapper: {
    width: "100%",
    height: 120,
    position: "relative",
    backgroundColor: "#f0f0f0",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  productMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 6,
    flexWrap: "wrap",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  negotiableBadge: {
    backgroundColor: Colors.blues[100],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  negotiableText: {
    fontSize: 9,
    color: Colors.blues[700],
    fontWeight: "600",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    flexWrap: "wrap", 
  },
  metaItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mapPinIcon: {
    marginRight: 2,
  },
});
