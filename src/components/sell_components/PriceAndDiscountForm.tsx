import DynamicPhosphorIcon from "@src/components/DynamicPhosphorIcon";
import { ThemedText } from "@src/components/ThemedText";
import { ThemedTextInput } from "@src/components/ThemedTextInput";
import { Colors } from "@src/constants/Colors";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface PriceAndDiscountFormProps {
  themeColors: ReturnType<typeof useThemeColor>;
  t: TFunction<"translation", undefined>;
  activeFont: string; // Add this line
}

export default function PriceAndDiscountForm({
}: PriceAndDiscountFormProps) {
  const { draft, updateDraft } = useSellDraft();
  const themeColors = useThemeColor(); // Get themeColors internally
  const { t } = useTranslation(); // Get t internally
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
            setValue={(value) => updateDraft("currency", value)} // Simplified setValue
            setItems={setCurrencyItems}
            containerStyle={styles.currencyPickerContainer}
            style={{
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            }}
            textStyle={{
              color: themeColors.text,
              fontSize: 14,
              // fontFamily: activeFont, // Removed
            }}
            placeholderStyle={{
              color: themeColors.text,
              fontSize: 14,
              // fontFamily: activeFont, // Removed
            }}
            listItemLabelStyle={{
              color: themeColors.text,
              fontSize: 14,
              // fontFamily: activeFont, // Removed
            }}
            selectedItemLabelStyle={{
              color: themeColors.text,
              fontSize: 14,
              // fontFamily: activeFont, // Removed
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
          color={draft.negotiable ? themeColors.tint : themeColors.text} // Use themeColors.tint for active negotiable
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
              { borderColor: themeColors.border }, // Themed border color
              draft.discountType === "none" && { backgroundColor: themeColors.tint }, // Themed active background
            ]}
            onPress={() => updateDraft("discountType", "none")}
          >
            <ThemedText
              style={draft.discountType === "none" && { color: themeColors.primaryButtonText }} // Themed active text color
            >
              {t("sellSection.None")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.discountOptionButton,
              { borderColor: themeColors.border }, // Themed border color
              draft.discountType === "percentage" && { backgroundColor: themeColors.tint }, // Themed active background
            ]}
            onPress={() => updateDraft("discountType", "percentage")}
          >
            <ThemedText
              style={
                draft.discountType === "percentage" && { color: themeColors.primaryButtonText } // Themed active text color
              }
            >
              {t("sellSection.Percentage")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.discountOptionButton,
              { borderColor: themeColors.border }, // Themed border color
              draft.discountType === "fixed" && { backgroundColor: themeColors.tint }, // Themed active background
            ]}
            onPress={() => updateDraft("discountType", "fixed")}
          >
            <ThemedText
              style={draft.discountType === "fixed" && { color: themeColors.primaryButtonText }} // Themed active text color
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
    // borderColor: Colors.light.border, // Removed
  },
  // selectedDiscountOption: { // Removed
  //   backgroundColor: Colors.light.tint,
  // },
  // selectedText: { // Removed
  //   color: Colors.light.background,
  // },
});