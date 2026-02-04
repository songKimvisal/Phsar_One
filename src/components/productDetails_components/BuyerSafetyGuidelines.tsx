import { ThemedText } from "@src/components/ThemedText";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface BuyerSafetyGuidelinesProps {
  activeFont?: string;
}

const BuyerSafetyGuidelines: React.FC<BuyerSafetyGuidelinesProps> = ({
  activeFont,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.safetySection}>
      <ThemedText
        style={[
          styles.safetyTitle,
          activeFont ? { fontFamily: activeFont } : {},
        ]}
      >
        {t("productDetail.buyerSafetyGuidelines")}
      </ThemedText>
      <View style={styles.safetyList}>
        <ThemedText
          style={[
            styles.safetyItem,
            activeFont ? { fontFamily: activeFont } : {},
          ]}
        >
          1. {t("productDetail.safety1")}
        </ThemedText>
        <ThemedText
          style={[
            styles.safetyItem,
            activeFont ? { fontFamily: activeFont } : {},
          ]}
        >
          2. {t("productDetail.safety2")}
        </ThemedText>
        <ThemedText
          style={[
            styles.safetyItem,
            activeFont ? { fontFamily: activeFont } : {},
          ]}
        >
          3. {t("productDetail.safety3")}
        </ThemedText>
        <ThemedText
          style={[
            styles.safetyItem,
            activeFont ? { fontFamily: activeFont } : {},
          ]}
        >
          4. {t("productDetail.safety4")}
        </ThemedText>
        <ThemedText
          style={[
            styles.safetyItem,
            activeFont ? { fontFamily: activeFont } : {},
          ]}
        >
          5. {t("productDetail.safety5")}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safetySection: {
    marginHorizontal: 16,
    backgroundColor: "rgba(231, 76, 60, 0.05)",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#E74C3C",
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E74C3C",
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
