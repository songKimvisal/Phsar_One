import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { ThemedTextInput } from "@src/components/shared_components/ThemedTextInput";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { toCamelCase } from "@src/utils/stringUtils";
import { TFunction } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

interface DynamicPostFieldsProps {
  fields: any[];
  themeColors: ReturnType<typeof useThemeColor>;
  t: TFunction<"translation", undefined>;
  activeFont: string;
}

export default function DynamicPostFields({ fields }: DynamicPostFieldsProps) {
  const { draft, updateDetail } = useSellDraft();
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  return (
    <>
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
                        `fieldOptions.${field.key}.${toCamelCase(option)}`,
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
                          `fieldOptions.${field.key}.${toCamelCase(option)}`,
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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerIOS: {
    height: 150,
    width: "100%",
  },
});
