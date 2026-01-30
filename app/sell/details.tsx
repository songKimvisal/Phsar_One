import { Picker } from "@react-native-picker/picker";
import DynamicPhosphorIcon from "@src/components/DynamicPhosphorIcon";
import { ThemedText } from "@src/components/ThemedText";
import { ThemedTextInput } from "@src/components/ThemedTextInput";
import { CAMBODIA_LOCATIONS } from "@src/constants/CambodiaLocations";
import { Colors } from "@src/constants/Colors";
import { POST_FIELDS_MAP } from "@src/constants/postFields";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
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
import DropDownPicker from "react-native-dropdown-picker";
import MapView, { Marker } from "react-native-maps";

const DEFAULT_REGION = {
  latitude: 11.5564,
  longitude: 104.9282,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function ProductDetailsForm() {
  const { draft, updateDraft, updateDetail } = useSellDraft();
  const { t } = useTranslation();
  const fields = POST_FIELDS_MAP[draft.subCategory] || [];
  const [mapRegion, setMapRegion] = useState(
    draft.location.latitude && draft.location.longitude
      ? {
          latitude: draft.location.latitude,
          longitude: draft.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : DEFAULT_REGION,
  );
  const [selectedProvince, setSelectedProvince] = useState(
    draft.province || null,
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    draft.district || null,
  );
  const [selectedCommune, setSelectedCommune] = useState(draft.commune || null);

  const [provinceOpen, setProvinceOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [communeOpen, setCommuneOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  // Initialize dropdown items
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

  const [currencyItems, setCurrencyItems] = useState([
    { label: "USD", value: "USD" },
    { label: "KHR", value: "KHR" },
  ]);

  const initialProvinces = CAMBODIA_LOCATIONS.map((p) => ({
    label: currentLang === "kh" ? p.name_km : p.name_en,
    value: p.name_en,
  }));

  const initialDistricts = selectedProvince
    ? CAMBODIA_LOCATIONS.find(
        (p) => p.name_en === selectedProvince,
      )?.subdivisions.map((d) => ({
        label: currentLang === "kh" ? d.name_km : d.name_en,
        value: d.name_en,
      })) || []
    : [];

  const initialCommunes =
    selectedDistrict && selectedProvince
      ? CAMBODIA_LOCATIONS.find((p) => p.name_en === selectedProvince)
          ?.subdivisions.find((d) => d.name_en === selectedDistrict)
          ?.subdivisions.map((c) => ({
            label: currentLang === "kh" ? c.name_km : c.name_en,
            value: c.name_en,
          })) || []
      : [];

  const [provinceItems, setProvinceItems] = useState(initialProvinces);
  const [districtItems, setDistrictItems] = useState(initialDistricts);
  const [communeItems, setCommuneItems] = useState(initialCommunes);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      if (
        draft.location.latitude === DEFAULT_REGION.latitude &&
        draft.location.longitude === DEFAULT_REGION.longitude
      ) {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const newLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        updateDraft("location", newLocation);
        setMapRegion({
          ...newLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        setMapRegion({
          latitude: draft.location.latitude,
          longitude: draft.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, []);
  useEffect(() => {
    // Provinces
    setProvinceItems(
      CAMBODIA_LOCATIONS.map((p) => ({
        label: currentLang === "kh" ? p.name_km : p.name_en,
        value: p.name_en,
      })),
    );

    // Districts
    if (selectedProvince) {
      const districts =
        CAMBODIA_LOCATIONS.find(
          (p) => p.name_en === selectedProvince,
        )?.subdivisions.map((d) => ({
          label: currentLang === "kh" ? d.name_km : d.name_en,
          value: d.name_en,
        })) || [];
      setDistrictItems(districts);
    } else {
      setDistrictItems([]);
    }

    // Communes
    if (selectedProvince && selectedDistrict) {
      const communes =
        CAMBODIA_LOCATIONS.find((p) => p.name_en === selectedProvince)
          ?.subdivisions.find((d) => d.name_en === selectedDistrict)
          ?.subdivisions.map((c) => ({
            label: currentLang === "kh" ? c.name_km : c.name_en,
            value: c.name_en,
          })) || [];
      setCommuneItems(communes);
    } else {
      setCommuneItems([]);
    }
  }, [currentLang, selectedProvince, selectedDistrict]);
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
            <TouchableOpacity
              onPress={pickImage}
              style={[
                styles.photoContainer,
                { backgroundColor: themeColors.card },
              ]}
            >
              <ThemedText style={styles.photoText}>
                {t("sellSection.Add_Photos")}({draft.photos.length})
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
                      keyboardType={
                        fieldType === "number" ? "numeric" : "default"
                      }
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
                          fontFamily: activeFont,
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
                              fontFamily: activeFont,
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
                    draft.discountType === "none" &&
                      styles.selectedDiscountOption,
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
                    draft.discountType === "fixed" &&
                      styles.selectedDiscountOption,
                  ]}
                  onPress={() => updateDraft("discountType", "fixed")}
                >
                  <ThemedText
                    style={
                      draft.discountType === "fixed" && styles.selectedText
                    }
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

            {/* Location Picker */}
            <ThemedText style={styles.locationTitle}>
              {t("sellSection.Pin_Location")}
            </ThemedText>
            <MapView
              style={styles.map}
              region={mapRegion}
              onRegionChangeComplete={(region) => setMapRegion(region)}
              onPress={(e) => {
                const newLocation = {
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                };
                updateDraft("location", newLocation);
                setMapRegion({
                  ...newLocation,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }}
            >
              <Marker coordinate={draft.location} />
            </MapView>

            {/* Province/Capital Dropdown */}

            <View style={[styles.inputGroup, { zIndex: 3000 }]}>
              <ThemedText style={[styles.inputLabel, { marginBottom: 10 }]}>
                {t("sellSection.ProvinceCapital")}
              </ThemedText>
              <DropDownPicker
                open={provinceOpen}
                value={selectedProvince}
                items={provinceItems}
                setOpen={setProvinceOpen}
                setValue={setSelectedProvince}
                setItems={setProvinceItems}
                placeholder={`Select ${t("sellSection.ProvinceCapital")}`}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                dropDownDirection="BOTTOM"
                zIndex={3000}
                zIndexInverse={1000}
                maxHeight={300}
                style={{
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                }}
                textStyle={{
                  color: themeColors.text,
                  fontSize: 16,
                  fontFamily: activeFont,
                }}
                placeholderStyle={{
                  color: themeColors.text,
                  fontSize: 16,
                  fontFamily: activeFont,
                }}
                listItemLabelStyle={{
                  color: themeColors.text,
                  fontSize: 16,
                  fontFamily: activeFont,
                }}
                selectedItemLabelStyle={{
                  color: themeColors.text,
                  fontSize: 16,
                  fontFamily: activeFont,
                }}
                dropDownContainerStyle={{
                  backgroundColor: themeColors.card,
                  borderColor: themeColors.border,
                }}
                onOpen={() => {
                  setDistrictOpen(false);
                  setCommuneOpen(false);
                }}
                onSelectItem={(item) => {
                  if (item && item.value) {
                    updateDraft("province", item.value);
                    setSelectedDistrict(null);
                    updateDraft("district", "");
                    setSelectedCommune(null);
                    updateDraft("commune", "");

                    // Update district items based on selected province
                    const newDistricts =
                      CAMBODIA_LOCATIONS.find(
                        (p) => p.name_en === item.value,
                      )?.subdivisions.map((d) => ({
                        label: currentLang === "km" ? d.name_km : d.name_en,
                        value: d.name_en,
                      })) || [];
                    setDistrictItems(newDistricts);
                    setCommuneItems([]);
                  }
                }}
              />
            </View>

            {/* Khan/District Dropdown */}
            {selectedProvince && (
              <View
                style={[
                  styles.inputGroup,
                  { zIndex: 2000, marginTop: provinceOpen ? 250 : 0 },
                ]}
              >
                <ThemedText style={[styles.inputLabel, { marginBottom: 10 }]}>
                  {t("sellSection.KhanDistrict")}
                </ThemedText>
                <DropDownPicker
                  open={districtOpen}
                  value={selectedDistrict}
                  items={districtItems}
                  setOpen={setDistrictOpen}
                  setValue={setSelectedDistrict}
                  setItems={setDistrictItems}
                  placeholder={`Select ${t("sellSection.KhanDistrict")}`}
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                  dropDownDirection="BOTTOM"
                  zIndex={2000}
                  zIndexInverse={2000}
                  maxHeight={300}
                  style={{
                    backgroundColor: themeColors.card,
                    borderColor: themeColors.border,
                  }}
                  textStyle={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontFamily: activeFont,
                  }}
                  placeholderStyle={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontFamily: activeFont,
                  }}
                  listItemLabelStyle={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontFamily: activeFont,
                  }}
                  selectedItemLabelStyle={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontFamily: activeFont,
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: themeColors.card,
                    borderColor: themeColors.border,
                  }}
                  onOpen={() => {
                    setProvinceOpen(false);
                    setCommuneOpen(false);
                  }}
                  onSelectItem={(item) => {
                    if (item && item.value) {
                      updateDraft("district", item.value);
                      setSelectedCommune(null);
                      updateDraft("commune", "");

                      // Update commune items based on selected district
                      const newCommunes =
                        CAMBODIA_LOCATIONS.find(
                          (p) => p.name_en === selectedProvince,
                        )
                          ?.subdivisions.find((d) => d.name_en === item.value)
                          ?.subdivisions.map((c) => ({
                            label: currentLang === "km" ? c.name_km : c.name_en,
                            value: c.name_en,
                          })) || [];
                      setCommuneItems(newCommunes);
                    }
                  }}
                />
              </View>
            )}

            {/* Sangkat/Commune Dropdown */}
            {selectedDistrict && (
              <View
                style={[
                  styles.inputGroup,
                  { zIndex: 1000, marginTop: districtOpen ? 250 : 0 },
                ]}
              >
                <ThemedText style={[styles.inputLabel, { marginBottom: 10 }]}>
                  {t("sellSection.SangkatCommune")}
                </ThemedText>
                <DropDownPicker
                  open={communeOpen}
                  value={selectedCommune}
                  items={communeItems}
                  setOpen={setCommuneOpen}
                  setValue={setSelectedCommune}
                  setItems={setCommuneItems}
                  placeholder={`Select ${t("sellSection.SangkatCommune")}`}
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                  dropDownDirection="BOTTOM"
                  zIndex={1000}
                  zIndexInverse={3000}
                  maxHeight={300}
                  style={{
                    backgroundColor: themeColors.card,
                    borderColor: themeColors.border,
                  }}
                  textStyle={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontFamily: activeFont,
                  }}
                  placeholderStyle={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontFamily: activeFont,
                  }}
                  listItemLabelStyle={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontFamily: activeFont,
                  }}
                  selectedItemLabelStyle={{
                    color: themeColors.text,
                    fontSize: 16,
                    fontFamily: activeFont,
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: themeColors.card,
                    borderColor: themeColors.border,
                  }}
                  onOpen={() => {
                    setProvinceOpen(false);
                    setDistrictOpen(false);
                  }}
                  onSelectItem={(item) => {
                    if (item && item.value) {
                      updateDraft("commune", item.value);
                    }
                  }}
                />
              </View>
            )}

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
    height: 50,
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
