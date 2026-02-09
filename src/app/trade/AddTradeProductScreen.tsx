import { ThemedText } from "@src/components/ThemedText";
import AddressDropdowns from "@src/components/sell_components/AddressDropdowns";
import LocationPickerMap from "@src/components/sell_components/LocationPickerMap";
import PhotoUploadSection from "@src/components/sell_components/PhotoUploadSection";
import { Colors } from "@src/constants/Colors";
import { useTradeDraft } from "@src/context/TradeDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { X } from "phosphor-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TradeItem {
  name: string;
  description: string;
}

export default function AddTradeProductScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const { draft, updateDraft, resetDraft } = useTradeDraft();

  // Product Information
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");

  // Trade Preferences
  const [lookingForItems, setLookingForItems] = useState<TradeItem[]>([]);
  const [currentLookingFor, setCurrentLookingFor] = useState("");
  const [currentLookingForDesc, setCurrentLookingForDesc] = useState("");

  // Contact Information
  const [phoneNumber, setPhoneNumber] = useState("");

  // Location state
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

  const activeFont = "System"; // Replace with your font logic

  const conditionOptions = [
    { label: t("condition.brand_new"), value: "Brand New" },
    { label: t("condition.excellent"), value: "Excellent" },
    { label: t("condition.good"), value: "Good" },
    { label: t("condition.fair"), value: "Fair" },
    { label: t("condition.poor"), value: "Poor" },
  ];

  const handleAddLookingForItem = () => {
    if (currentLookingFor.trim()) {
      setLookingForItems([
        ...lookingForItems,
        {
          name: currentLookingFor.trim(),
          description: currentLookingForDesc.trim(),
        },
      ]);
      setCurrentLookingFor("");
      setCurrentLookingForDesc("");
    }
  };

  const handleRemoveLookingForItem = (index: number) => {
    const newItems = [...lookingForItems];
    newItems.splice(index, 1);
    setLookingForItems(newItems);
  };

  const handleConfirmLocation = (location: {
    latitude: number;
    longitude: number;
  }) => {
    setIsLocationConfirmed(true);
    updateDraft("location", location);
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert(t("error"), t("Please enter a product title"));
      return false;
    }
    if (!description.trim()) {
      Alert.alert(t("error"), t("Please enter a product description"));
      return false;
    }
    if (!condition) {
      Alert.alert(t("error"), t("Please select a condition"));
      return false;
    }
    if (draft.photos.length === 0) {
      Alert.alert(t("error"), t("Please add at least one photo"));
      return false;
    }
    if (lookingForItems.length === 0) {
      Alert.alert(
        t("error"),
        t("Please add at least one item you're looking for"),
      );
      return false;
    }
    if (!draft.province || !draft.district) {
      Alert.alert(t("error"), t("Please select your location"));
      return false;
    }
    if (!isLocationConfirmed) {
      Alert.alert(t("error"), t("Please confirm your location on the map"));
      return false;
    }
    if (!phoneNumber.trim()) {
      Alert.alert(t("error"), t("Please enter your phone number"));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Prepare the trade product data
    const tradeProduct = {
      title,
      description,
      condition,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      photos: draft.photos,
      lookingFor: lookingForItems,
      location: {
        province: draft.province,
        district: draft.district,
        commune: draft.commune,
        coordinates: draft.location,
      },
      phoneNumber,
      createdAt: new Date().toISOString(),
    };

    console.log("Trade Product Data:", tradeProduct);

    // TODO: Submit to your backend API
    // await api.createTradeProduct(tradeProduct);

    Alert.alert(
      t("success"),
      t("Your trade product has been posted successfully!"),
      [
        {
          text: "OK",
          onPress: () => {
            resetDraft();
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: themeColors.card,
              borderBottomColor: themeColors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <X size={24} color={themeColors.text} weight="bold" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>
            {t("trade.add_new_product")}
          </ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Photo Upload Section */}
          <PhotoUploadSection
            themeColors={themeColors}
            photos={draft.photos}
            onUpdatePhotos={(newPhotos) => updateDraft("photos", newPhotos)}
          />

          {/* Product Information Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <ThemedText style={styles.sectionTitle}>
              {t("trade.product_information")}
            </ThemedText>

            {/* Title */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("trade.product_title")} *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                placeholder={t("trade.product_title_placeholder")}
                placeholderTextColor={themeColors.text + "60"}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("trade.description")} *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                placeholder={t("trade.description_placeholder")}
                placeholderTextColor={themeColors.text + "60"}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Condition */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("trade.condition")} *
              </ThemedText>
              <View style={styles.conditionContainer}>
                {conditionOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.conditionButton,
                      {
                        backgroundColor:
                          condition === option.value
                            ? Colors.reds[500]
                            : themeColors.background,
                        borderColor:
                          condition === option.value
                            ? Colors.reds[500]
                            : themeColors.border,
                      },
                    ]}
                    onPress={() => setCondition(option.value)}
                  >
                    <ThemedText
                      style={[
                        styles.conditionText,
                        {
                          color:
                            condition === option.value
                              ? "#FFFFFF"
                              : themeColors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Original Price (Optional) */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("trade.original_price")} ({t("optional")})
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                placeholder={t("trade.original_price_placeholder")}
                placeholderTextColor={themeColors.text + "60"}
                value={originalPrice}
                onChangeText={setOriginalPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Trade Preferences Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <ThemedText style={styles.sectionTitle}>
              {t("trade.looking_for")} *
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              {t("trade.looking_for_description")}
            </ThemedText>

            {/* Current Looking For Items */}
            {lookingForItems.length > 0 && (
              <View style={styles.lookingForList}>
                {lookingForItems.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.lookingForItem,
                      { backgroundColor: themeColors.background },
                    ]}
                  >
                    <View style={styles.lookingForItemContent}>
                      <ThemedText style={styles.lookingForItemName}>
                        {item.name}
                      </ThemedText>
                      {item.description ? (
                        <ThemedText style={styles.lookingForItemDesc}>
                          {item.description}
                        </ThemedText>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveLookingForItem(index)}
                      style={styles.removeItemButton}
                    >
                      <X size={18} color={themeColors.text} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Add New Looking For Item */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("trade.item_name")}
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                placeholder={t("trade.item_name_placeholder")}
                placeholderTextColor={themeColors.text + "60"}
                value={currentLookingFor}
                onChangeText={setCurrentLookingFor}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("trade.item_description")} ({t("optional")})
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                placeholder={t("trade.item_description_placeholder")}
                placeholderTextColor={themeColors.text + "60"}
                value={currentLookingForDesc}
                onChangeText={setCurrentLookingForDesc}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.addItemButton,
                { backgroundColor: Colors.reds[500] },
              ]}
              onPress={handleAddLookingForItem}
              disabled={!currentLookingFor.trim()}
            >
              <ThemedText style={styles.addItemButtonText}>
                {t("trade.add_item")}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Location Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <ThemedText style={styles.sectionTitle}>
              {t("trade.location")} *
            </ThemedText>

            <AddressDropdowns
              themeColors={themeColors}
              t={t}
              activeFont={activeFont}
              currentDraft={draft}
              onUpdateDraft={(key, value) => updateDraft(key as any, value)}
            />

            <LocationPickerMap
              themeColors={themeColors}
              t={t}
              onConfirmLocation={handleConfirmLocation}
              currentDraft={draft}
              onUpdateDraft={(key, value) => updateDraft(key as any, value)}
            />
          </View>

          {/* Contact Information Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <ThemedText style={styles.sectionTitle}>
              {t("trade.contact_information")}
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("trade.phone_number")} *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.background,
                    borderColor: themeColors.border,
                    color: themeColors.text,
                  },
                ]}
                placeholder={t("trade.phone_number_placeholder")}
                placeholderTextColor={themeColors.text + "60"}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: Colors.reds[500] }]}
            onPress={handleSubmit}
          >
            <ThemedText style={styles.submitButtonText}>
              {t("trade.post_trade_product")}
            </ThemedText>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  conditionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  conditionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  lookingForList: {
    marginBottom: 16,
  },
  lookingForItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  lookingForItemContent: {
    flex: 1,
  },
  lookingForItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  lookingForItemDesc: {
    fontSize: 14,
    opacity: 0.6,
  },
  removeItemButton: {
    padding: 4,
  },
  addItemButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addItemButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
