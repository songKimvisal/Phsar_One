import { useTradeProducts } from "@/src/context/TradeProductsContext";
import ProductImageGallery from "@src/components/productDetails_components/ProductImageGallery";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { formatPrice } from "@src/types/productTypes";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CaretLeft,
  ClipboardText,
  MapPin,
  Phone,
  Tag,
} from "phosphor-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function TradeProductDetailScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { getProductById } = useTradeProducts();

  const product = getProductById(id as string);

  const formattedConditionKey = product?.condition
    ? product.condition.toLowerCase().replace(/\s+/g, "_")
    : "";

  const handleOpenMap = () => {
    if (product?.coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${product.coordinates.latitude},${product.coordinates.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber.replace(/[^0-9]/g, "")}`);
  };

  if (!product) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <ThemedText>{t("common.product_not_found")}</ThemedText>
      </SafeAreaView>
    );
  }

  // Get translated province name
  const provinceDisplay = product.province
    ? t(`provinces.${product.province}`)
    : product.province;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <StatusBar />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          style={[styles.header, { backgroundColor: themeColors.background }]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <CaretLeft size={24} color={themeColors.text} weight="bold" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            {product.title}
          </ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {/* Product Image Gallery */}
        <View style={styles.imageGalleryContainer}>
          <ProductImageGallery photos={product.images} />
          {product.condition && (
            <View
              style={[
                styles.conditionBadge,
                { backgroundColor: themeColors.primary },
              ]}
            >
              <ThemedText style={styles.conditionBadgeText}>
                {t(`conditions.${formattedConditionKey}`)}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Product Info Section */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <View style={styles.productTitlePriceRow}>
            <ThemedText style={styles.productTitle}>{product.title}</ThemedText>
            {product.originalPrice && (
              <ThemedText style={styles.productPrice}>
                {formatPrice(product.originalPrice ?? 0, "USD")}
              </ThemedText>
            )}
          </View>
          <ThemedText style={styles.sectionTitle}>
            {t("productDetail.description")}
          </ThemedText>
          <ThemedText style={styles.productDescription}>
            {product.description}
          </ThemedText>
        </View>

        {/* Specifications */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>
            {t("trade.specifications")}
          </ThemedText>

          <View style={styles.specRow}>
            <View style={styles.specLabelContainer}>
              <ClipboardText
                size={20}
                color={themeColors.text}
                weight="regular"
              />
              <ThemedText style={styles.specLabel}>
                {t("trade.condition")}
              </ThemedText>
            </View>
            <ThemedText style={styles.specValue}>
              {t(`conditions.${formattedConditionKey}`)}
            </ThemedText>
          </View>

          <View style={styles.specRow}>
            <View style={styles.specLabelContainer}>
              <Tag size={20} color={themeColors.text} weight="regular" />
              <ThemedText style={styles.specLabel}>
                {t("trade.original_price")}
              </ThemedText>
            </View>
            <ThemedText style={styles.specValue}>
              {formatPrice(product.originalPrice ?? 0, "USD")}
            </ThemedText>
          </View>

          <View style={styles.specRow}>
            <View style={styles.specLabelContainer}>
              <MapPin size={20} color={themeColors.text} weight="regular" />
              <ThemedText style={styles.specLabel}>
                {t("trade.location")}
              </ThemedText>
            </View>
            <ThemedText style={styles.specValue} numberOfLines={1}>
              {provinceDisplay}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[
              styles.viewMapButton,
              { backgroundColor: themeColors.primary },
            ]}
            onPress={handleOpenMap}
          >
            <ThemedText
              style={[
                styles.viewMapButtonText,
                { color: themeColors.primaryButtonText },
              ]}
            >
              {t("common.view_in_google_map")}
            </ThemedText>
          </TouchableOpacity>

          <View
            style={[
              styles.specDivider,
              { backgroundColor: themeColors.border },
            ]}
          />

          <View style={[styles.specRow, styles.phoneRow]}>
            <View style={styles.specLabelContainer}>
              <Phone size={20} color={themeColors.text} weight="regular" />
              <ThemedText style={styles.specLabel}>
                {t("trade.phone_number")}
              </ThemedText>
            </View>
            <View style={styles.phoneNumbersContainer}>
              {product.telephone?.split(" / ").map((number, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCall(number)}
                >
                  <ThemedText
                    style={[
                      styles.specValue,
                      { color: themeColors.link, fontWeight: "bold" },
                    ]}
                  >
                    {number.trim()}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Trade Preferences */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>
            {t("trade.trade_preferences")}
          </ThemedText>
          <ThemedText style={styles.tradePrefSubtitle}>
            {t("trade.trade_preferences_description")}
          </ThemedText>

          <View
            style={[
              styles.lookingForCard,
              {
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
              },
            ]}
          >
            <ThemedText style={styles.lookingForTitle}>
              {t("trade.looking_for")}
            </ThemedText>
            {product.lookingFor.map((item, index) => (
              <View key={index} style={styles.lookingForItem}>
                <ThemedText style={styles.lookingForItemName}>
                  {item.name}
                </ThemedText>
                {item.description && (
                  <ThemedText style={styles.lookingForItemDesc}>
                    {item.description}
                  </ThemedText>
                )}
              </View>
            ))}
          </View>

          <View
            style={[
              styles.estimatedValueContainer,
              {
                backgroundColor: themeColors.warningBackground,
                borderWidth: colorScheme === "light" ? 1 : 0,
                borderColor: "#ffeeba",
              },
            ]}
          >
            <ThemedText
              style={[
                styles.estimatedValueLabel,
                { color: Colors.yellows[900] },
              ]}
            >
              {t("trade.estimated_trade_value_range_label")}
            </ThemedText>
            <ThemedText
              style={[styles.estimatedValue, { color: Colors.yellows[900] }]}
            >
              {product.estimatedTradeValueRange}
            </ThemedText>
          </View>
        </View>

        {/* Owner Information */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>
            {t("productDetail.sellerInfo")}
          </ThemedText>
          <View style={styles.ownerInfoRow}>
            {product.owner?.avatar && (
              <Image
                source={{ uri: product.owner.avatar }}
                style={styles.ownerAvatar}
              />
            )}
            <View>
              <ThemedText style={styles.ownerName}>
                {product.owner?.name}
              </ThemedText>
              {product.owner?.isVerified && (
                <ThemedText style={styles.ownerVerified}>
                  {t("productDetail.verifiedSeller")}
                </ThemedText>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: themeColors.primary },
            ]}
            onPress={() => console.log("Chat with Owner")}
          >
            <ThemedText
              style={[
                styles.actionButtonText,
                { color: themeColors.primaryButtonText },
              ]}
            >
              {t("productDetail.chatSeller")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.secondaryActionButton,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
            onPress={() => console.log("Send Trade Offer")}
          >
            <ThemedText
              style={[styles.actionButtonText, { color: themeColors.text }]}
            >
              {t("trade.send_trade_offer")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Tip */}
        <View
          style={[
            styles.tipContainer,
            {
              backgroundColor: themeColors.warningBackground,
              borderWidth: colorScheme === "light" ? 1 : 0,
              borderColor: "#ffeeba",
            },
          ]}
        >
          <ThemedText style={styles.tipIcon}>💡</ThemedText>
          <ThemedText style={[styles.tipText, { color: Colors.yellows[900] }]}>
            {t("trade.trade_tip")}
          </ThemedText>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  imageGalleryContainer: {
    position: "relative",
    marginBottom: 16,
  },
  conditionBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  conditionBadgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  productTitlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginRight: 12,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.reds[500],
  },
  productDescription: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.7,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  specLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  specLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  specValue: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "right",
  },
  viewMapButton: {
    backgroundColor: Colors.reds[500],
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  viewMapButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  specDivider: {
    height: 1,
    marginVertical: 4,
    opacity: 0.3,
  },
  phoneRow: {
    alignItems: "flex-start",
    paddingTop: 12,
  },
  phoneNumbersContainer: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  tradePrefSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
    lineHeight: 20,
  },
  lookingForCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  lookingForTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  lookingForItem: {
    marginBottom: 8,
  },
  lookingForItemName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  lookingForItemDesc: {
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 20,
  },
  estimatedValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
  },
  estimatedValueLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  estimatedValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  ownerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  ownerVerified: {
    fontSize: 14,
    color: Colors.greens[500],
    fontWeight: "500",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryActionButton: {
    borderWidth: 1,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  tipIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
