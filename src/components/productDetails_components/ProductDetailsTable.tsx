import { ThemedText } from "@src/components/ThemedText";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface ProductDetailsTableProps {
  mainCategory: string;
  subCategory: string;
  productDetails: { [key: string]: string };
  activeFont: string;
}

const ProductDetailsTable: React.FC<ProductDetailsTableProps> = ({
  mainCategory,
  subCategory,
  productDetails,
  activeFont,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { fontFamily: activeFont }]}>
        {t("productDetail.details")}
      </ThemedText>

      <View style={styles.descriptionRow}>
        <ThemedText
          style={[styles.descriptionLabel, { fontFamily: activeFont }]}
        >
          {t("productDetail.mainCategory")}
        </ThemedText>
        <ThemedText
          style={[styles.descriptionValue, { fontFamily: activeFont }]}
        >
          {mainCategory}
        </ThemedText>
      </View>

      <View style={styles.descriptionRow}>
        <ThemedText
          style={[styles.descriptionLabel, { fontFamily: activeFont }]}
        >
          {t("productDetail.subCategory")}
        </ThemedText>
        <ThemedText
          style={[styles.descriptionValue, { fontFamily: activeFont }]}
        >
          {subCategory}
        </ThemedText>
      </View>

      {/* Dynamic Product Details from POST_FIELDS_MAP */}
      {Object.entries(productDetails).map(([key, value]) => (
        <View key={key} style={styles.descriptionRow}>
          <ThemedText
            style={[styles.descriptionLabel, { fontFamily: activeFont }]}
          >
            {t("fields." + key)}
          </ThemedText>
          <ThemedText
            style={[styles.descriptionValue, { fontFamily: activeFont }]}
          >
            {value}
          </ThemedText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  descriptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  descriptionLabel: {
    fontSize: 15,
    opacity: 0.6,
  },
  descriptionValue: {
    fontSize: 15,
    fontWeight: "500",
  },
});

export default ProductDetailsTable;
