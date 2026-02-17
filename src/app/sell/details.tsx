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
import { usePostProduct } from "@src/hooks/usePostProduct";
import useThemeColor from "@src/hooks/useThemeColor";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailsForm() {
  const { draft, updateDraft, setDraft, resetDraft } = useSellDraft();
  const { t, i18n } = useTranslation();
  const { editId } = useLocalSearchParams<{ editId: string }>();
  const [isInitialLoading, setIsInitialLoading] = useState(!!editId);
  
  const fields = POST_FIELDS_MAP[draft.subCategory] || [];
  const themeColors = useThemeColor();
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "undefined";

  const { postProduct, updateProduct, fetchProductForEdit, isPosting } = usePostProduct();
  const router = useRouter();

  // Load existing product if editId is provided
  useEffect(() => {
    if (editId) {
      const loadProduct = async () => {
        try {
          setIsInitialLoading(true);
          const data = await fetchProductForEdit(editId);
          setDraft(data);
        } catch (error) {
          Alert.alert("Error", "Failed to load product details.");
          router.back();
        } finally {
          setIsInitialLoading(false);
        }
      };
      loadProduct();
    } else {
      // If not editing, ensure we have a clean draft if it was previously used
      // Note: Be careful with resetDraft here if users navigate back/forth between subcategory and details
    }
  }, [editId]);

  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

  const handleConfirmLocation = (location: {
    latitude: number;
    longitude: number;
  }) => {
    setIsLocationConfirmed(true);
    updateDraft("location", location);
  };

  const handlePost = async () => {
    if (!draft.photos || draft.photos.length === 0) {
      Alert.alert(t("common.error"), "Please upload at least one photo.");
      return;
    }

    try {
      if (editId) {
        await updateProduct(editId, draft);
        Alert.alert(t("common.success"), "Your product has been updated!");
      } else {
        await postProduct(draft);
        Alert.alert(t("common.success"), "Your product has been posted!");
      }
      resetDraft();
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Post handle error:", error);
      Alert.alert(
        t("common.error"),
        error.message || "Failed to save product.",
      );
    }
  };

  if (isInitialLoading) {
    return (
      <View style={[styles.center, { backgroundColor: "#F9FAFB" }]}>
        <ActivityIndicator size="large" color={Colors.reds[500]} />
        <ThemedText style={{ marginTop: 12 }}>Loading details...</ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#FFF" }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <CaretLeftIcon size={28} color={themeColors.text} weight="bold" />
        </TouchableOpacity>

        <ThemedText style={styles.headerTitle}>
          {editId ? "Edit Listing" : (t(`subcategories.${draft.subCategory}`) || draft.subCategory)}
        </ThemedText>

        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#F9FAFB" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          data={[{ key: "formContent" }]}
          renderItem={() => null}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListHeaderComponent={
            <View style={styles.formContainer}>
              {/* Card 1: Main Info & Photos */}
              <View
                style={[styles.card, { backgroundColor: themeColors.card }]}
              >
                <PhotoUploadSection
                  themeColors={themeColors}
                  photos={draft.photos}
                  onUpdatePhotos={(newPhotos) =>
                    updateDraft("photos", newPhotos)
                  }
                />

                <DynamicPostFields
                  fields={fields}
                  themeColors={themeColors}
                  t={t}
                  activeFont={activeFont}
                />
              </View>

              {/* Card 2: Pricing */}
              <View
                style={[styles.card, { backgroundColor: themeColors.card }]}
              >
                <ThemedText style={styles.sectionTitle}>
                  {t("sellSection.Price")}
                </ThemedText>
                <PriceAndDiscountForm />
              </View>

              {/* Card 3: Location */}
              <View
                style={[styles.card, { backgroundColor: themeColors.card }]}
              >
                <ThemedText style={styles.sectionTitle}>
                  {t("sellSection.Pin_Location")}
                </ThemedText>
                <LocationPickerMap
                  themeColors={themeColors}
                  t={t}
                  onConfirmLocation={handleConfirmLocation}
                  currentDraft={draft}
                  onUpdateDraft={(key, value) => updateDraft(key as any, value)}
                />

                <AddressDropdowns
                  themeColors={themeColors}
                  t={t}
                  activeFont={activeFont}
                  currentDraft={draft}
                  onUpdateDraft={updateDraft}
                />
              </View>

              {/* Card 4: Contact Detail */}
              <View
                style={[styles.card, { backgroundColor: themeColors.card }]}
              >
                <ThemedText style={styles.sectionTitle}>
                  {t("sellSection.SellerContactDetail")}
                </ThemedText>
                <SellerContactForm themeColors={themeColors} t={t} />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => router.back()}
                >
                  <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.submitBtn, isPosting && { opacity: 0.7 }]}
                  onPress={handlePost}
                  disabled={isPosting}
                >
                  <ThemedText style={styles.submitBtnText}>
                    {isPosting ? "Saving..." : (editId ? "Update" : "Save")}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          }
          keyExtractor={(item) => item.key}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  backButton: {
    padding: 8,
  },
  formContainer: {
    padding: 8,
    gap: 16,
  },
  card: {
    padding: 12,
    borderRadius: 16,
    borderCurve: "continuous",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 99,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: Colors.reds[500],
    paddingVertical: 14,
    borderRadius: 99,
    alignItems: "center",
  },
  submitBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
