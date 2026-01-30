import DynamicPhosphorIcon from "@src/components/DynamicPhosphorIcon";
import { ThemedText } from "@src/components/ThemedText";
import AddressDropdowns from "@src/components/sell_components/AddressDropdowns";
import DynamicPostFields from "@src/components/sell_components/DynamicPostFields";
import LocationPickerMap from "@src/components/sell_components/LocationPickerMap";
import PhotoUploadSection from "@src/components/sell_components/PhotoUploadSection";
import PriceAndDiscountForm from "@src/components/sell_components/PriceAndDiscountForm";
import SellerContactForm from "@src/components/sell_components/SellerContactForm";
import { Colors } from "@src/constants/Colors";
import { POST_FIELDS_MAP } from "@src/constants/postFields";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductDetailsForm() {
  const { draft } = useSellDraft();
  const { t, i18n } = useTranslation();
  const fields = POST_FIELDS_MAP[draft.subCategory] || [];
  const themeColors = useThemeColor();
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          data={[{ key: "formContent" }]}
          renderItem={() => null}
          ListHeaderComponent={
            <View style={[styles.formContainer]}>
              {/* Photo Section */}
              <PhotoUploadSection themeColors={themeColors} />

              {/* Dynamic Fields from postFields.ts */}
              <DynamicPostFields
                fields={fields}
                themeColors={themeColors}
                t={t}
                activeFont={activeFont}
              />

              {/* Price Input, Currency Picker, Negotiable Toggle, Discount Options */}
              <PriceAndDiscountForm
                themeColors={themeColors}
                t={t}
                activeFont={activeFont}
              />

              {/* Location Picker */}
              <LocationPickerMap themeColors={themeColors} t={t} />

              {/* Province/Capital, Khan/District, Sangkat/Commune Dropdowns */}
              <AddressDropdowns
                themeColors={themeColors}
                t={t}
                activeFont={activeFont}
              />

              {/* Seller Contact Detail Section */}
              <SellerContactForm themeColors={themeColors} t={t} />

              <TouchableOpacity style={styles.submitBtn} onPress={() => {}}>
                <ThemedText style={styles.submitBtnText}>
                  {t("sellSection.Post_Now")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          }
          keyExtractor={(item) => item.key}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 16,
  },
  submitBtn: {
    backgroundColor: Colors.reds[500],
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});