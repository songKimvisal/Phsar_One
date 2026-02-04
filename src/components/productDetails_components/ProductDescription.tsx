import { ThemedText } from "@src/components/ThemedText";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface ProductDescriptionProps {
  description?: string;
  activeFont: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  activeFont,
}) => {
  const { t } = useTranslation();

  if (!description) {
    return null;
  }

  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { fontFamily: activeFont }]}>
        {t("productDetail.description")}
      </ThemedText>
      <ThemedText style={[styles.descriptionText, { fontFamily: activeFont }]}>
        {description}
      </ThemedText>
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
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
});

export default ProductDescription;
