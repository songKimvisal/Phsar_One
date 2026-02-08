import { ThemedText } from "@src/components/ThemedText";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { Clock, MapPin, User } from "phosphor-react-native";
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
const CARD_WIDTH = (width - 48) / 2;

export default function TradeProductCard({
  product,
  onPress,
}: TradeProductCardProps) {
  const themeColors = useThemeColor();
  const { t, i18n } = useTranslation();
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

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
              { backgroundColor: Colors.reds[500] },
            ]}
          >
            <ThemedText
              style={[styles.conditionText, { fontFamily: activeFont }]}
            >
              {t(`trade_screen.condition_${product.condition.toLowerCase()}`)}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <ThemedText
          style={[styles.productTitle, { fontFamily: activeFont }]}
          numberOfLines={1}
        >
          {product.title}
        </ThemedText>

        {/* Seller Info */}
        <View style={styles.metaRow}>
          <User size={14} color={themeColors.text} weight="fill" />
          <ThemedText style={[styles.metaText, { fontFamily: activeFont }]}>
            {product.seller}
          </ThemedText>
        </View>

        {/* Time and Location */}
        <View style={styles.metaRow}>
          <Clock size={14} color={themeColors.text} weight="fill" />
          <ThemedText style={[styles.metaText, { fontFamily: activeFont }]}>
            {product.timeAgo}
          </ThemedText>
          <MapPin
            size={14}
            color={themeColors.text}
            weight="fill"
            style={styles.locationIcon}
          />
          <ThemedText style={[styles.metaText, { fontFamily: activeFont }]}>
            {product.location}
          </ThemedText>
        </View>

        {/* Looking For */}
        <View
          style={[
            styles.lookingForContainer,
            { backgroundColor: themeColors.secondaryBackground },
          ]}
        >
          <ThemedText
            style={[styles.lookingForLabel, { fontFamily: activeFont }]}
          >
            {t("trade_screen.looking_for")}
          </ThemedText>
          <ThemedText
            style={[styles.lookingForText, { fontFamily: activeFont }]}
            numberOfLines={1}
          >
            {product.lookingFor.filter(Boolean).join(", ")}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    borderRadius: 8, // Increased radius for a softer look
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12, // Slightly increased vertical spacing
  },
  imageWrapper: {
    width: "100%",
    height: 120,
    backgroundColor: "#f0f0f0", // Placeholder background
    position: "relative",
    borderTopLeftRadius: 8, // Match card radius
    borderTopRightRadius: 8, // Match card radius
    overflow: "hidden", // Ensure image respects rounded corners
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
    paddingVertical: 3, // Slightly reduced vertical padding
    borderRadius: 10, // More rounded corners
  },
  conditionText: {
    color: "#FFFFFF",
    fontSize: 11, // Slightly smaller font
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 12, // Increased padding
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4, // Increased vertical spacing between meta rows
    gap: 6, // Increased gap between icon and text
  },
  metaText: {
    fontSize: 12,
    opacity: 0.7,
  },
  locationIcon: {
    marginLeft: 8,
  },
  lookingForContainer: {
    marginTop: 8,
    padding: 10, // Increased padding
    borderRadius: 8, // More rounded corners
  },
  lookingForLabel: {
    fontSize: 11,
    fontWeight: "bold",
    opacity: 0.7,
    marginBottom: 2,
  },
  lookingForText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
