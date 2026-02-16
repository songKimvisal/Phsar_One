import { ThemedText } from "@src/components/shared_components/ThemedText";
import { ThemedTextInput } from "@src/components/shared_components/ThemedTextInput";
import { Colors } from "@src/constants/Colors";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { Check } from "phosphor-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function PriceAndDiscountForm() {
  const { draft, updateDraft } = useSellDraft();
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  return (
    <>
      {/* Pricing Section */}
      <View style={styles.fieldSection}>
        <View style={styles.labelRow}>
          <ThemedText style={styles.inputLabel}>Pricing</ThemedText>
          <ThemedText style={{ color: Colors.reds[500] }}>*</ThemedText>
        </View>
        <View style={styles.inputWrapper}>
          <ThemedTextInput
            style={[styles.input, { borderColor: "#E5E7EB" }]}
            value={draft.price}
            onChangeText={(text) => updateDraft("price", text)}
            keyboardType="numeric"
            placeholder="0.00"
          />
          <ThemedText style={styles.unitText}>$</ThemedText>
        </View>
      </View>

      {/* Negotiable Checkbox */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => updateDraft("negotiable", !draft.negotiable)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: "#E5E7EB" },
            draft.negotiable && {
              backgroundColor: Colors.reds[500],
              borderColor: Colors.reds[500],
            },
          ]}
        >
          {draft.negotiable && <Check size={16} color="#FFF" weight="bold" />}
        </View>
        <ThemedText style={styles.checkboxLabel}>Negotiable</ThemedText>
      </TouchableOpacity>

      {/* Discount Section */}
      <View style={styles.fieldSection}>
        <View style={styles.labelRow}>
          <ThemedText style={styles.inputLabel}>Discount</ThemedText>
          <ThemedText style={{ color: Colors.reds[500] }}>*</ThemedText>
        </View>
        <View style={styles.inputWrapper}>
          <ThemedTextInput
            style={[styles.input, { borderColor: "#E5E7EB" }]}
            value={draft.discountValue}
            onChangeText={(text) => updateDraft("discountValue", text)}
            keyboardType="numeric"
            placeholder="0.00"
          />
          <ThemedText style={styles.unitText}>$</ThemedText>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fieldSection: {
    marginBottom: 2,
  },
  labelRow: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFF",
    height: 44,
  },
  unitText: {
    position: "absolute",
    right: 16,
    fontSize: 18,
    fontWeight: "400",
    color: "#111827",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
});
