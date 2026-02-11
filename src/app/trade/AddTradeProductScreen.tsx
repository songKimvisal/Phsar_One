import AddressDropdowns from "@src/components/shared_components/AddressDropdowns";
import DynamicPhosphorIcon from "@src/components/shared_components/DynamicPhosphorIcon";
import LocationPickerMap from "@src/components/shared_components/LocationPickerMap";
import PhotoUploadSection from "@src/components/shared_components/PhotoUploadSection";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { Colors } from "@src/constants/Colors";
import { useTradeDraft } from "@src/context/TradeDraftContext";
import { useTradeProducts } from "@src/context/TradeProductsContext";
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

export default function AddTradeProductScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t, i18n } = useTranslation();
  const { draft, updateDraft, resetDraft } = useTradeDraft();
  const { addProduct } = useTradeProducts();

  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen"; // Define activeFont

  // Product Information
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");

  // Trade Preferences
  const [lookingForName, setLookingForName] = useState("");
  const [lookingForDescription, setLookingForDescription] = useState("");

  // Trade Value Estimation
  const [estimatedMinValue, setEstimatedMinValue] = useState("");
  const [estimatedMaxValue, setEstimatedMaxValue] = useState("");

  // Contact Information
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);

  // Location state
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

  const conditionOptions = [
    { label: t("condition.brand_new"), value: "Brand New" },
    { label: t("condition.good"), value: "Good" },
    { label: t("condition.fair"), value: "Fair" },
    { label: t("condition.poor"), value: "Poor" },
  ];

  const handleConfirmLocation = (location: {
    latitude: number;
    longitude: number;
  }) => {
    setIsLocationConfirmed(true);
    updateDraft("location", location);
  };

  const handleAddPhoneNumber = () => {
    if (phoneNumbers.length < 3) {
      setPhoneNumbers([...phoneNumbers, ""]);
    } else {
      Alert.alert(t("error"), "You can add up to 3 phone numbers.");
    }
  };

  const handleUpdatePhoneNumber = (text: string, index: number) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = text;
    setPhoneNumbers(newPhoneNumbers);
  };

  const handleRemovePhoneNumber = (index: number) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers.splice(index, 1);
    setPhoneNumbers(newPhoneNumbers);
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert(t("error"), "Please enter a product title");
      return false;
    }
    if (!description.trim()) {
      Alert.alert(t("error"), "Please enter a product description");
      return false;
    }
    if (!condition) {
      Alert.alert(t("error"), "Please select a condition");
      return false;
    }
    if (draft.photos.length === 0) {
      Alert.alert(t("error"), "Please add at least one photo");
      return false;
    }
    if (!lookingForName.trim()) {
      Alert.alert(
        t("error"),
        "Please enter the name of the item you're looking for",
      );
      return false;
    }
    if (!estimatedMinValue.trim() || !estimatedMaxValue.trim()) {
      Alert.alert(t("error"), "Please enter estimated trade value range");
      return false;
    }
    const minVal = parseFloat(estimatedMinValue);
    const maxVal = parseFloat(estimatedMaxValue);
    if (isNaN(minVal) || isNaN(maxVal)) {
      Alert.alert(t("error"), "Please enter valid numbers for trade value");
      return false;
    }
    if (minVal > maxVal) {
      Alert.alert(
        t("error"),
        "Minimum value cannot be greater than maximum value",
      );
      return false;
    }
    if (!draft.province || !draft.district) {
      Alert.alert(t("error"), "Please select your location");
      return false;
    }
    if (!isLocationConfirmed) {
      Alert.alert(t("error"), "Please confirm your location on the map");
      return false;
    }
    if (phoneNumbers.length === 0) {
      Alert.alert(t("error"), "Please add at least one phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Convert province to camelCase format
    const provinceKey =
      draft.province
        ?.replace(/\s+/g, "")
        .replace(/^./, (str) => str.toLowerCase()) || "phnomPenh";

    // Convert condition to lowercase
    const conditionLower = condition.toLowerCase().replace(/\s+/g, "_");

    // Create new trade product matching the expected format
    const newProduct = {
      id: Date.now().toString(),
      images: draft.photos,
      title: title.trim(),
      seller: "Current User",
      timeAgo: { value: 0, unit: "minutes" as "minutes" },
      lookingFor: [
        {
          name: lookingForName.trim(),
          description: lookingForDescription.trim(),
        },
      ],
      condition: conditionLower,
      originalPrice: originalPrice ? parseFloat(originalPrice) : 0,
      province: provinceKey,
      district: draft.district || "",
      commune: draft.commune || "",
      coordinates: draft.location,
      description: description.trim(),
      telephone: phoneNumbers.join(", "),
      estimatedTradeValueRange: `$${estimatedMinValue} - $${estimatedMaxValue}`,
      owner: {
        name: "Current User",
        isVerified: false,
        avatar: "https://via.placeholder.com/150",
      },
      postedDate: new Date().toISOString(),
    };

    try {
      addProduct(newProduct);

      Alert.alert(
        t("success"),
        "Your trade product has been posted successfully!",
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
    } catch (error) {
      console.error("Error posting product:", error);
      Alert.alert(t("error"), "Failed to post product. Please try again.");
    }
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
            photos={draft.photos}
            onUpdatePhotos={(newPhotos) => updateDraft("photos", newPhotos)}
            themeColors={themeColors}
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

            {/* Looking For Item Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("trade.item_name")} *
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
                value={lookingForName}
                onChangeText={setLookingForName}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("trade.item_description")} ({t("optional")})
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
                placeholder={t("trade.item_description_placeholder")}
                placeholderTextColor={themeColors.text + "60"}
                value={lookingForDescription}
                onChangeText={setLookingForDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Trade Value Estimation */}
            <View
              style={[styles.divider, { backgroundColor: themeColors.border }]}
            />

            <ThemedText style={[styles.sectionTitle, { marginTop: 20 }]}>
              {t("trade.estimated_trade_value_range")} *
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              {t("trade.estimated_trade_value_range_description")}
            </ThemedText>

            <View style={styles.valueRangeContainer}>
              <View style={[styles.valueInputWrapper, { flex: 1 }]}>
                <ThemedText style={styles.inputLabel}>
                  {t("trade.minimum_value")}
                </ThemedText>
                <View style={styles.currencyInputContainer}>
                  <ThemedText
                    style={[styles.currencySymbol, { color: themeColors.text }]}
                  >
                    $
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      styles.valueInput,
                      {
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text,
                      },
                    ]}
                    placeholder="1200"
                    placeholderTextColor={themeColors.text + "60"}
                    value={estimatedMinValue}
                    onChangeText={setEstimatedMinValue}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.rangeSeparator}>
                <ThemedText style={styles.rangeSeparatorText}></ThemedText>
              </View>

              <View style={[styles.valueInputWrapper, { flex: 1 }]}>
                <ThemedText style={styles.inputLabel}>
                  {t("trade.maximum_value")}
                </ThemedText>
                <View style={styles.currencyInputContainer}>
                  <ThemedText
                    style={[styles.currencySymbol, { color: themeColors.text }]}
                  >
                    $
                  </ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      styles.valueInput,
                      {
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text,
                      },
                    ]}
                    placeholder="1500"
                    placeholderTextColor={themeColors.text + "60"}
                    value={estimatedMaxValue}
                    onChangeText={setEstimatedMaxValue}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Display estimated range if both values are entered */}
            {estimatedMinValue && estimatedMaxValue && (
              <View
                style={[
                  styles.estimatedRangeDisplay,
                  { backgroundColor: themeColors.background },
                ]}
              >
                <ThemedText style={styles.estimatedRangeLabel}>
                  {t("trade.estimated_range")}:
                </ThemedText>
                <ThemedText
                  style={[
                    styles.estimatedRangeValue,
                    { color: Colors.reds[500] },
                  ]}
                >
                  ${estimatedMinValue} - ${estimatedMaxValue}
                </ThemedText>
              </View>
            )}
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
              currentDraft={draft}
              onUpdateDraft={(key, value) => updateDraft(key as any, value)}
              themeColors={themeColors}
              t={t}
              activeFont={activeFont}
            />

            <LocationPickerMap
              onConfirmLocation={handleConfirmLocation}
              currentDraft={draft}
              onUpdateDraft={(key, value) => updateDraft(key as any, value)}
              themeColors={themeColors}
              t={t}
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

            {phoneNumbers.map((phone, index) => (
              <View key={index} style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>
                  {t("trade.phone_number")} {index + 1}
                </ThemedText>
                <View style={styles.phoneInputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.phoneInput,
                      {
                        backgroundColor: themeColors.background,
                        borderColor: themeColors.border,
                        color: themeColors.text,
                      },
                    ]}
                    value={phone}
                    onChangeText={(text) =>
                      handleUpdatePhoneNumber(text, index)
                    }
                    keyboardType="phone-pad"
                    placeholder={t("trade.phone_number_placeholder")}
                    placeholderTextColor={themeColors.text + "60"}
                  />
                  {phoneNumbers.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemovePhoneNumber(index)}
                      style={styles.removeBtn}
                    >
                      <DynamicPhosphorIcon
                        name="Trash"
                        size={24}
                        color={Colors.reds[500]}
                      />
                    </TouchableOpacity>
                  )}
                  {index === phoneNumbers.length - 1 &&
                    phoneNumbers.length < 3 && (
                      <TouchableOpacity
                        onPress={handleAddPhoneNumber}
                        style={styles.addPhoneIconBtn}
                      >
                        <DynamicPhosphorIcon
                          name="PlusCircle"
                          size={24}
                          color={themeColors.tint}
                        />
                      </TouchableOpacity>
                    )}
                </View>
              </View>
            ))}
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
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneInput: {
    flex: 1,
  },
  addPhoneIconBtn: {
    marginLeft: 10,
  },
  removeBtn: {
    marginLeft: 10,
  },
  divider: {
    height: 1,
  },
  valueRangeContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },

  valueInputWrapper: {
    flex: 1,
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    position: "absolute",
    left: 12,
    fontSize: 16,
    fontWeight: "600",
    zIndex: 1,
  },
  valueInput: {
    paddingLeft: 28,
  },
  rangeSeparator: {
    paddingBottom: 12,
  },
  rangeSeparatorText: {
    fontSize: 20,
    fontWeight: "600",
  },
  estimatedRangeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  estimatedRangeLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  estimatedRangeValue: {
    fontSize: 16,
    fontWeight: "700",
  },
});
