import DynamicPhosphorIcon from "@src/components/DynamicPhosphorIcon";
import { ThemedText } from "@src/components/ThemedText";
import { ThemedTextInput } from "@src/components/ThemedTextInput";
import { Colors } from "@src/constants/Colors";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface PriceAndDiscountFormProps {
  themeColors: ReturnType<typeof useThemeColor>;
  t: (key: string) => string;
  activeFont: string;
}

export default function PriceAndDiscountForm({
  themeColors,
  t,
  activeFont,
}: PriceAndDiscountFormProps) {
  const { draft, updateDraft } = useSellDraft();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencyItems, setCurrencyItems] = useState([
    { label: "USD", value: "USD" },
    { label: "KHR", value: "KHR" },
  ]);

  return (
    <>
      {/* Price Input and Currency Picker */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>
          {t("sellSection.Price")}
        </ThemedText>
        <View style={styles.priceAndCurrencyWrapper}>
          <ThemedTextInput
            style={[
              styles.input,
              styles.priceInput,
              {
                color: themeColors.text,
                borderColor: themeColors.border,
              },
            ]}
            value={draft.price}
            onChangeText={(text) => updateDraft("price", text)}
            keyboardType="numeric"
          />
          <DropDownPicker
            open={currencyOpen}
            value={draft.currency}
            items={currencyItems}
            setOpen={setCurrencyOpen}
            setValue={(callback) => {
              const value = callback(draft.currency);
              updateDraft("currency", value);
            }}
            setItems={setCurrencyItems}
            containerStyle={styles.currencyPickerContainer}
            style={{
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            }}
            textStyle={{
              color: themeColors.text,
              fontSize: 14,
              fontFamily: activeFont,
            }}
            placeholderStyle={{
              color: themeColors.text,
              fontSize: 14,
              fontFamily: activeFont,
            }}
            listItemLabelStyle={{
              color: themeColors.text,
              fontSize: 14,
              fontFamily: activeFont,
            }}
            selectedItemLabelStyle={{
              color: themeColors.text,
              fontSize: 14,
              fontFamily: activeFont,
            }}
            dropDownContainerStyle={{
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            }}
            ArrowUpIconComponent={({ style }) => (
              <DynamicPhosphorIcon name="CaretUp" size={20} color={themeColors.text} style={style} />
            )}
            ArrowDownIconComponent={({ style }) => (
              <DynamicPhosphorIcon name="CaretDown" size={20} color={themeColors.text} style={style} />
            )}
            TickIconComponent={({ style }) => (
              <DynamicPhosphorIcon name="Check" size={20} color={themeColors.text} style={style} />
            )}
            zIndex={4000}
          />
        </View>
      </View>

      {/* Negotiable Toggle */}
      <TouchableOpacity
        style={styles.negotiableToggle}
        onPress={() => updateDraft("negotiable", !draft.negotiable)}
      >
        <DynamicPhosphorIcon
          name={draft.negotiable ? "CheckSquare" : "Square"}
          size={28}
          color={draft.negotiable ? Colors.greens[500] : themeColors.text}
        />
        <ThemedText style={styles.negotiableText}>
          {t("sellSection.Negotiable")}
        </ThemedText>
      </TouchableOpacity>

      {/* Discount Options */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.inputLabel}>
          {t("sellSection.Discount")}
        </ThemedText>
        <View style={styles.discountOptionsContainer}>
          <TouchableOpacity
            style={[
              styles.discountOptionButton,
              draft.discountType === "none" && styles.selectedDiscountOption,
            ]}
            onPress={() => updateDraft("discountType", "none")}
          >
            <ThemedText
              style={draft.discountType === "none" && styles.selectedText}
            >
              {t("sellSection.None")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.discountOptionButton,
              draft.discountType === "percentage" &&
                styles.selectedDiscountOption,
            ]}
            onPress={() => updateDraft("discountType", "percentage")}
          >
            <ThemedText
              style={
                draft.discountType === "percentage" && styles.selectedText
              }
            >
              {t("sellSection.Percentage")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.discountOptionButton,
              draft.discountType === "fixed" && styles.selectedDiscountOption,
            ]}
            onPress={() => updateDraft("discountType", "fixed")}
          >
            <ThemedText
              style={draft.discountType === "fixed" && styles.selectedText}
            >
              {t("sellSection.FixedAmount")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {(draft.discountType === "percentage" ||
          draft.discountType === "fixed") && (
          <ThemedTextInput
            style={[
              styles.input,
              {
                color: themeColors.text,
                borderColor: themeColors.border,
                marginTop: 20,
              },
            ]}
            value={draft.discountValue}
            onChangeText={(text) => updateDraft("discountValue", text)}
            keyboardType="numeric"
            placeholder={
              draft.discountType === "percentage"
                ? t("sellSection.DiscountPercentagePlaceholder")
                : t("sellSection.DiscountFixedAmountPlaceholder")
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    height: 50,
  },
  priceAndCurrencyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 4000,
  },
  priceInput: {
    flex: 1,
    marginRight: 10,
  },
  currencyPickerContainer: {
    width: 100,
  },
  negotiableToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  negotiableText: {
    marginLeft: 10,
    fontSize: 18,
  },
  discountOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  discountOptionButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectedDiscountOption: {
    backgroundColor: Colors.light.tint,
  },
  selectedText: {
    color: Colors.light.background,
  },
});
