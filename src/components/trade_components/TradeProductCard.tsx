import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { Clock, MagnifyingGlass, MapPin, User } from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

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

interface TradeProductCardProps {
  product: TradeProduct;
  onPress: () => void;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 38) / 2;

export default function TradeProductCard({
  product,
  onPress,
}: TradeProductCardProps) {
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  const styles = getStyles(themeColors);

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        { backgroundColor: themeColors.card, borderColor: themeColors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Product Image and Condition Badge */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        {product.condition && (
          <View
            style={[
              styles.conditionBadge,
              { backgroundColor: themeColors.error },
            ]}
          >
            <ThemedText style={styles.conditionText}>
              {t(`trade_screen.condition_${product.condition.toLowerCase()}`)}
            </ThemedText>
          </View>
        )}
      </View>
      {/* Product Info */}
      <View style={styles.infoContainer}>
        <ThemedText style={styles.productTitle} numberOfLines={1}>
          {product.title}
        </ThemedText>
        {/* Seller Info */}
        <View style={styles.metaRow}>
          <User size={14} color={themeColors.text} weight="fill" />
          <ThemedText style={styles.metaText}>{product.seller}</ThemedText>
        </View>
        <View style={styles.metaRow}>
          <Clock size={14} color={themeColors.text} weight="fill" />
          <ThemedText style={styles.metaText}>{product.timeAgo}</ThemedText>
          <MapPin
            size={14}
            color={themeColors.text}
            weight="fill"
            style={styles.locationIcon}
          />
          <ThemedText style={styles.metaText}>{product.location}</ThemedText>
        </View>
        {/* Looking For */}
        <View
          style={[
            styles.lookingForContainer,
            { backgroundColor: themeColors.secondaryBackground },
          ]}
        >
          <View style={styles.lookingForHeader}>
            <MagnifyingGlass size={14} color={themeColors.text} weight="fill" />
            <ThemedText style={styles.lookingForLabel}>
              {t("trade_screen.looking_for")}
            </ThemedText>
          </View>
          <ThemedText style={styles.lookingForText}>
            {product.lookingFor.filter(Boolean).join(", ")}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColor>) =>
  StyleSheet.create({
    cardContainer: {
      width: CARD_WIDTH,
      borderRadius: 8,
      borderWidth: 1,
      overflow: "hidden",
      marginBottom: 12,
    },
    imageWrapper: {
      width: "100%",
      height: 120,
      backgroundColor: themeColors.border + "10",
      position: "relative",
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      overflow: "hidden",
    },
    productImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    conditionBadge: {
      position: "absolute",
      top: 8,
      right: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    conditionText: {
      color: themeColors.primaryButtonText,
      fontSize: 11,
      fontWeight: "bold",
      lineHeight: 14,
    },
    infoContainer: {
      padding: 12,
    },
    productTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      lineHeight: 20,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      gap: 6,
    },
    metaText: {
      fontSize: 12,
      opacity: 0.7,
      flexShrink: 1,
      lineHeight: 16,
    },
    locationIcon: {
      marginLeft: 8,
    },
    lookingForContainer: {
      marginTop: 8,
      padding: 10,
      borderRadius: 8,
    },
    lookingForLabel: {
      fontSize: 11,
      fontWeight: "bold",
      opacity: 0.7,
      flexShrink: 1,
      lineHeight: 14, // Explicit line height
    },
    lookingForHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 2,
    },
    lookingForText: {
      fontSize: 12,
      fontWeight: "600",
      lineHeight: 16, // Explicit line height
    },
  });
