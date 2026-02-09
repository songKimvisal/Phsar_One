import { ThemedText } from "@src/components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface BuyerSafetyGuidelinesProps {}

const BuyerSafetyGuidelines: React.FC<BuyerSafetyGuidelinesProps> = () => {
  const { t } = useTranslation();
  const themeColors = useThemeColor();

  return (
    <View
      style={[
        styles.safetySection,
        {
          backgroundColor: themeColors.error + "05",
          borderLeftColor: themeColors.error,
        },
      ]}
    >
      <ThemedText style={[styles.safetyTitle, { color: themeColors.error }]}>
        {t("productDetail.buyerSafetyGuidelines")}
      </ThemedText>
      <View style={styles.safetyList}>
        <ThemedText style={styles.safetyItem}>
          1. {t("productDetail.safety1")}
        </ThemedText>
        <ThemedText style={styles.safetyItem}>
          2. {t("productDetail.safety2")}
        </ThemedText>
        <ThemedText style={styles.safetyItem}>
          3. {t("productDetail.safety3")}
        </ThemedText>
        <ThemedText style={styles.safetyItem}>
          4. {t("productDetail.safety4")}
        </ThemedText>
        <ThemedText style={styles.safetyItem}>
          5. {t("productDetail.safety5")}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safetySection: {
    marginHorizontal: 16,

    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: "bold",

    marginBottom: 12,
  },
  safetyList: {
    gap: 8,
  },
  safetyItem: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.8,
  },
});

export default BuyerSafetyGuidelines;
