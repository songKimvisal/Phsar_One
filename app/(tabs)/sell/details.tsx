import { Picker } from "@react-native-picker/picker";
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
  useColorScheme,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function ProductDetailsForm() {
  const { draft, updateDraft, updateDetail } = useSellDraft();
  const { t } = useTranslation();
  const fields = POST_FIELDS_MAP[draft.subCategory] || [];
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
          style={[
            styles.photoContainer,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.border,
            },
          ]}
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
                      backgroundColor: themeColors.card,
                      borderColor: themeColors.border,
                    },
                  ]}
                  value={draft.details[field.key] || ""}
                  onChangeText={(text) => updateDetail(field.key, text)}
                  keyboardType={fieldType === "number" ? "numeric" : "default"}
                  placeholderTextColor={themeColors.text}
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

        {/* Location Picker */}
        <ThemedText style={styles.locationTitle}>
          {t("sellSection.Pin_Location")}
        </ThemedText>
        <ThemedText
          style={[styles.locationHint, { color: isDark ? "#aaa" : "#666" }]}
        >
          Tap on the map to set your location
        </ThemedText>
        <MapView
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={[
            styles.map,
            {
              borderColor: isDark ? "#444" : "#ccc",
            },
          ]}
          initialRegion={{
            latitude: draft.location.latitude || 11.5564,
            longitude: draft.location.longitude || 104.9282,
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
            <Marker
              coordinate={{
                latitude: draft.location.latitude,
                longitude: draft.location.longitude,
              }}
              title="Your Location"
              draggable
              onDragEnd={(e) =>
                updateDraft("location", {
                  ...draft.location,
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                })
              }
            />
          )}
        </MapView>

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
    paddingTop: 60,
  },
  photoContainer: {
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
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
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  pickerIOS: {
    height: 150,
    width: "100%",
  },
  locationTitle: {
    marginTop: 20,
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  locationHint: {
    fontSize: 14,
    marginBottom: 10,
  },
  map: {
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  submitBtn: {
    backgroundColor: Colors.reds[500],
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  submitBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
