import { Picker } from "@react-native-picker/picker";
import DynamicPhosphorIcon from "@src/components/DynamicPhosphorIcon";
import { ThemedText } from "@src/components/ThemedText";
import { ThemedTextInput } from "@src/components/ThemedTextInput";
import { Colors } from "@src/constants/Colors";
import { POST_FIELDS_MAP } from "@src/constants/postFields";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function ProductDetailsForm() {
  const { draft, updateDraft, updateDetail } = useSellDraft();
  const { t } = useTranslation();
  const fields = POST_FIELDS_MAP[draft.subCategory] || [];
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      updateDraft("photos", [
        ...draft.photos,
        ...result.assets.map((a) => a.uri),
      ]);
    }
  };
  const themeColors = useThemeColor();
  const optionToKey = (str: string) => {
    if (!str) return "";
    const parts = str.split(" ");
    return (
      parts[0].toLowerCase() +
      parts
        .slice(1)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView style={[styles.formContainer]}>
        {/* Photo Section */}
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.photoContainer, { backgroundColor: themeColors.card }]}
        >
          <ThemedText style={styles.photoText}>
            Add Photos ({draft.photos.length})
          </ThemedText>
        </TouchableOpacity>

        {/* Dynamic Fields from postFields.ts */}
        {fields.map((field) => {
          const fieldType = field.type || "text";
          return (
            <View key={field.key} style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t(`fields.${field.key}`)}
              </ThemedText>
              {(fieldType === "text" || fieldType === "number") && (
                <ThemedTextInput
                  style={[
                    styles.input,
                    {
                      color: themeColors.text,
                      borderColor: themeColors.border,
                    },
                  ]}
                  value={draft.details[field.key] || ""}
                  onChangeText={(text) => updateDetail(field.key, text)}
                  keyboardType={fieldType === "number" ? "numeric" : "default"}
                />
              )}
              {fieldType === "select" &&
              field.options &&
              Platform.OS === "ios" ? (
                <View
                  style={[
                    styles.pickerContainer,
                    {
                      backgroundColor: themeColors.card,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <Picker
                    selectedValue={draft.details[field.key] || ""}
                    onValueChange={(itemValue) =>
                      updateDetail(field.key, itemValue)
                    }
                    style={[
                      styles.pickerIOS,
                      {
                        color: themeColors.text,
                        backgroundColor: themeColors.card,
                      },
                    ]}
                    itemStyle={{
                      color: themeColors.text,
                    }}
                  >
                    <Picker.Item
                      label={`Select ${t(`fields.${field.key}`)}`}
                      value=""
                      color={themeColors.text}
                    />
                    {field.options.map((option: string) => (
                      <Picker.Item
                        key={option}
                        label={t(
                          `fieldOptions.${field.key}.${optionToKey(option)}`,
                          option,
                        )}
                        value={option}
                        color={themeColors.text}
                      />
                    ))}
                  </Picker>
                </View>
              ) : (
                fieldType === "select" &&
                field.options && (
                  <View
                    style={[
                      styles.pickerContainer,
                      {
                        backgroundColor: themeColors.card,
                        borderColor: themeColors.border,
                      },
                    ]}
                  >
                    <Picker
                      selectedValue={draft.details[field.key] || ""}
                      onValueChange={(itemValue) =>
                        updateDetail(field.key, itemValue)
                      }
                      style={[
                        styles.picker,
                        {
                          color: themeColors.text,
                          backgroundColor: themeColors.card,
                        },
                      ]}
                      dropdownIconColor={themeColors.text}
                    >
                      <Picker.Item
                        label={`Select ${t(`fields.${field.key}`)}`}
                        value=""
                        color={themeColors.text}
                      />
                      {field.options.map((option: string) => (
                        <Picker.Item
                          key={option}
                          label={t(
                            `fieldOptions.${field.key}.${optionToKey(option)}`,
                            option,
                          )}
                          value={option}
                          color={themeColors.text}
                        />
                      ))}
                    </Picker>
                  </View>
                )
              )}
            </View>
          );
        })}

        {/* Price Input and Negotiable Toggle */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>
            {t("sellSection.Price")}
          </ThemedText>
          <View style={styles.priceContainer}>
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
            <TouchableOpacity
              style={styles.negotiableToggle}
              onPress={() => updateDraft("negotiable", !draft.negotiable)}
            >
              <DynamicPhosphorIcon
                name={draft.negotiable ? "CheckCircle" : "Circle"}
                size={24}
                color={draft.negotiable ? Colors.greens[500] : themeColors.text}
              />
              <ThemedText style={styles.negotiableText}>
                {t("sellSection.Negotiable")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

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
                  marginTop: 10,
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

        {/* Location Picker */}
        <ThemedText style={styles.locationTitle}>
          {t("sellSection.Pin_Location")}
        </ThemedText>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: draft.location.latitude,
            longitude: draft.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={(e) =>
            updateDraft("location", {
              ...draft.location,
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            })
          }
        >
          {draft.location.latitude && draft.location.longitude && (
            <Marker coordinate={draft.location} />
          )}
        </MapView>

        {/* Seller Contact Detail Section */}
        <ThemedText
          style={[
            styles.locationTitle,
            { fontSize: 25, marginBottom: 30, fontWeight: "bold" },
          ]}
        >
          {t("sellSection.SellerContactDetail")}
        </ThemedText>

        {/* Seller Name Input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>
            {t("sellSection.SellerName")}
          </ThemedText>
          <ThemedTextInput
            style={[
              styles.input,
              {
                color: themeColors.text,
                borderColor: themeColors.border,
              },
            ]}
            value={draft.contact.sellerName}
            onChangeText={(text) =>
              updateDraft("contact", { ...draft.contact, sellerName: text })
            }
          />
        </View>

        {/* Phone Number Inputs */}
        {Array.isArray(draft.contact?.phones) &&
          draft.contact.phones.map((phone, index) => (
            <View key={index} style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                {t("sellSection.PhoneNumber")} {index + 1}
              </ThemedText>
              <View style={styles.phoneInputContainer}>
                <ThemedTextInput
                  style={[
                    styles.input,
                    styles.phoneInput,
                    {
                      color: themeColors.text,
                      borderColor: themeColors.border,
                    },
                  ]}
                  value={phone}
                  onChangeText={(text) => {
                    const newPhones = [...draft.contact.phones];
                    newPhones[index] = text;
                    updateDraft("contact", {
                      ...draft.contact,
                      phones: newPhones,
                    });
                  }}
                  keyboardType="phone-pad"
                />
                {draft.contact.phones.length > 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      const newPhones = [...draft.contact.phones];
                      newPhones.splice(index, 1);
                      updateDraft("contact", {
                        ...draft.contact,
                        phones: newPhones,
                      });
                    }}
                    style={styles.removeBtn}
                  >
                    <DynamicPhosphorIcon
                      name="Trash"
                      size={24}
                      color={Colors.reds[500]}
                    />
                  </TouchableOpacity>
                )}
                {index === draft.contact.phones.length - 1 &&
                  draft.contact.phones.length < 3 && (
                    <TouchableOpacity
                      onPress={() => {
                        const newPhones = [...draft.contact.phones, ""];
                        updateDraft("contact", {
                          ...draft.contact,
                          phones: newPhones,
                        });
                      }}
                      style={styles.addPhoneIconBtn}
                    >
                      <DynamicPhosphorIcon
                        name="PlusCircle"
                        size={24}
                        color={Colors.blues[500]}
                      />
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          ))}

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>
            {t("sellSection.Email")}
          </ThemedText>
          <ThemedTextInput
            style={[
              styles.input,
              {
                color: themeColors.text,
                borderColor: themeColors.border,
              },
            ]}
            value={draft.contact.email}
            onChangeText={(text) =>
              updateDraft("contact", { ...draft.contact, email: text })
            }
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={() => {}}>
          <ThemedText style={styles.submitBtnText}>
            {t("sellSection.Post_Now")}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 16,
  },
  photoContainer: {
    height: 150,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  photoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
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
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  locationTitle: { marginTop: 20, fontSize: 16, marginBottom: 10 },
  map: { height: 200, borderRadius: 10, marginBottom: 20 },
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
  pickerIOS: {
    height: 150,
    width: "100%",
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
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    flex: 1,
  },
  negotiableToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  negotiableText: {
    marginLeft: 5,
    fontSize: 16,
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
