import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@src/components/ThemedText";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { formatPrice, Product } from "@src/types/productTypes";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ProductInfoSectionProps {
  product: Product;
  discountedPrice?: string;
  timeAgo: string;
  activeFont: string;
  t: (key: string) => string; // Translation function
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  product,
  discountedPrice,
  timeAgo,
  activeFont,
  t,
}) => {
  const themeColors = useThemeColor();

  return (
    <View style={styles.contentContainer}>
      {/* Title and Views */}
      <View style={styles.titleRow}>
        <ThemedText style={[styles.productName, { fontFamily: activeFont }]}>
          {product.title}
        </ThemedText>
        <View style={styles.viewsContainer}>
          <Ionicons name="eye-outline" size={16} color={themeColors.text} />
          <ThemedText style={styles.viewsText}>
            {product.views ?? 0} {t("productDetail.views")}
          </ThemedText>
        </View>
      </View>

      {/* Time ago */}
      <ThemedText style={styles.timeAgo}>{timeAgo}</ThemedText>

      {/* Price */}
      <View style={styles.priceContainer}>
        {discountedPrice ? (
          <>
            <ThemedText
              style={[styles.originalPrice, { color: themeColors.text + "60" }]}
            >
              {formatPrice(product.price, product.currency)}
            </ThemedText>
            <ThemedText style={styles.price}>
              {formatPrice(discountedPrice, product.currency)}
            </ThemedText>
            <View style={styles.discountBadge}>
              <ThemedText style={styles.discountText}>
                -
                {product.discountType === "percentage"
                  ? `${product.discountValue}%`
                  : formatPrice(product.discountValue || "0", product.currency)}
              </ThemedText>
            </View>
          </>
        ) : (
          <ThemedText style={styles.price}>
            {formatPrice(product.price, product.currency)}
          </ThemedText>
        )}
        {product.negotiable && (
          <View style={styles.negotiableBadge}>
            <ThemedText style={styles.negotiableText}>
              {t("productDetail.negotiable")}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  viewsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewsText: {
    fontSize: 14,
    opacity: 0.6,
  },
  timeAgo: {
    fontSize: 13,
    opacity: 0.5,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.greens[600],
  },
  originalPrice: {
    fontSize: 20,
    fontWeight: "500",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: Colors.reds[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  negotiableBadge: {
    backgroundColor: Colors.blues[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  negotiableText: {
    color: Colors.greens[500],
    fontSize: 13,
    fontWeight: "600",
  },
});

export default ProductInfoSection;
