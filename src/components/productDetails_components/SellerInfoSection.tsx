import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@src/components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { Product } from "@src/types/productTypes";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface SellerInfoSectionProps {
  product: Product;
}

const SellerInfoSection: React.FC<SellerInfoSectionProps> = ({ product }) => {
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  const handleCall = () => {
    if (product.contact.phones.length > 0) {
      const phoneNumber = String(product.contact.phones[0]).replace(/\s/g, "");
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  return (
    <View style={styles.sellerSection}>
      <ThemedText style={styles.sectionTitle}>
        {t("productDetail.sellerInfo")}
      </ThemedText>

      <View style={styles.sellerInfo}>
        {product.seller?.avatar ? (
          <Image
            source={{ uri: product.seller.avatar }}
            style={styles.sellerAvatar}
          />
        ) : (
          <View style={[styles.sellerAvatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={24} color={themeColors.text} />
          </View>
        )}

        <View style={styles.sellerDetails}>
          <View style={styles.sellerNameRow}>
            <ThemedText style={styles.sellerName}>
              {product.contact.sellerName}
            </ThemedText>
            {product.seller?.verified && (
              <Ionicons name="checkmark-circle" size={16} color="#4A90E2" />
            )}
          </View>

          <View style={styles.badgesContainer}>
            {product.seller?.verified && (
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={12} color="#4A90E2" />
                <ThemedText style={styles.badgeText}>
                  {t("productDetail.verifiedSeller")}
                </ThemedText>
              </View>
            )}
            {product.seller?.trusted && (
              <View style={styles.badge}>
                <Ionicons name="ribbon" size={12} color="#4A90E2" />
                <ThemedText style={styles.badgeText}>
                  {t("productDetail.trustedSeller")}
                </ThemedText>
              </View>
            )}
          </View>

          {product.seller?.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <ThemedText style={styles.ratingText}>
                {product.seller.rating} ({product.seller.totalListings}{" "}
                listings)
              </ThemedText>
            </View>
          )}
        </View>

        {product.seller && (
          <TouchableOpacity>
            <ThemedText style={styles.viewProfileText}>
              {t("productDetail.viewProfile")}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Contact Information */}
      <View style={styles.contactInfo}>
        {product.contact.phones.map((phone, index) => (
          <View key={index} style={styles.contactRow}>
            <Ionicons name="call-outline" size={16} color={themeColors.text} />
            <ThemedText style={styles.contactText}>{phone}</ThemedText>
          </View>
        ))}
        {product.contact.email && (
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={16} color={themeColors.text} />
            <ThemedText style={styles.contactText}>
              {product.contact.email}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sellerSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  sellerDetails: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  badgesContainer: {
    flexDirection: "column",
    gap: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#4A90E2",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    opacity: 0.7,
  },
  viewProfileText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
  contactInfo: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default SellerInfoSection;
