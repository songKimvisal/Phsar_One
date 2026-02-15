import DynamicPostFields from "@src/components/sell_components/DynamicPostFields";
import PriceAndDiscountForm from "@src/components/sell_components/PriceAndDiscountForm";
import AddressDropdowns from "@src/components/shared_components/AddressDropdowns";
import LocationPickerMap from "@src/components/shared_components/LocationPickerMap";
import PhotoUploadSection from "@src/components/shared_components/PhotoUploadSection";
import SellerContactForm from "@src/components/shared_components/SellerContactForm";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { Colors } from "@src/constants/Colors";
import { POST_FIELDS_MAP } from "@src/constants/postFields";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { usePostProduct } from "@src/hooks/usePostProduct";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailsForm() {
  const { draft, updateDraft } = useSellDraft();
  const { t, i18n } = useTranslation();
  const fields = POST_FIELDS_MAP[draft.subCategory] || [];
  const themeColors = useThemeColor();
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "undefined";
  
  const { postProduct, isPosting } = usePostProduct();
  const router = useRouter();

  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

  const handleConfirmLocation = (location: {
    latitude: number;
    longitude: number;
  }) => {
    setIsLocationConfirmed(true);
    updateDraft("location", location);
    console.log("Location confirmed:", location);
  };

  const handlePost = async () => {
    if (!draft.photos || draft.photos.length === 0) {
      Alert.alert(t("common.error"), "Please upload at least one photo.");
      return;
    }

    try {
      await postProduct(draft);
      Alert.alert(t("common.success"), "Your product has been posted!");
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Post handle error:", error);
      Alert.alert(t("common.error"), error.message || "Failed to post product.");
    }
  };

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
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
              <PhotoUploadSection
                themeColors={themeColors}
                photos={draft.photos}
                onUpdatePhotos={(newPhotos) => updateDraft("photos", newPhotos)}
              />

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
              <LocationPickerMap
                themeColors={themeColors}
                t={t}
                onConfirmLocation={handleConfirmLocation}
                currentDraft={draft}
                onUpdateDraft={(key, value) => updateDraft(key as any, value)}
              />

              {/* Province/Capital, Khan/District, Sangkat/Commune Dropdowns */}
              <AddressDropdowns
                themeColors={themeColors}
                t={t}
                activeFont={activeFont}
                currentDraft={draft} // Pass current draft
                onUpdateDraft={updateDraft} // Pass update function
              />

              {/* Seller Contact Detail Section */}
              <SellerContactForm themeColors={themeColors} t={t} />

              <TouchableOpacity 
                style={[styles.submitBtn, isPosting && { opacity: 0.7 }]} 
                onPress={handlePost}
                disabled={isPosting}
              >
                <ThemedText style={styles.submitBtnText}>
                  {isPosting ? "Posting..." : t("sellSection.Post_Now")}
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
