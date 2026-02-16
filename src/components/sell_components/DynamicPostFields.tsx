import { ThemedText } from "@src/components/shared_components/ThemedText";
import { ThemedTextInput } from "@src/components/shared_components/ThemedTextInput";
import { Colors } from "@src/constants/Colors";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { TFunction } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface DynamicPostFieldsProps {
  fields: any[];
  themeColors: ReturnType<typeof useThemeColor>;
  t: TFunction<"translation", undefined>;
  activeFont: string;
}

export default function DynamicPostFields({ fields }: DynamicPostFieldsProps) {
  const { draft, updateDetail, updateDraft } = useSellDraft();
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  const renderLabel = (field: any) => (
    <View style={styles.labelRow}>
      <ThemedText style={styles.inputLabel}>
        {t(`fields.${field.key}`)}
      </ThemedText>
      {field.required && (
        <ThemedText style={{ color: Colors.reds[500] }}>*</ThemedText>
      )}
    </View>
  );

  return (
    <>
      {/* Title Section */}
      <View style={styles.fieldSection}>
        <View style={styles.labelRow}>
          <ThemedText style={styles.inputLabel}>Title</ThemedText>
          <ThemedText style={{ color: Colors.reds[500] }}>*</ThemedText>
        </View>
        <ThemedTextInput
          style={[styles.input, { borderColor: "#E5E7EB" }]}
          placeholder="e.g., Car for Sale"
          value={draft.title}
          onChangeText={(text) => updateDraft("title", text)}
        />
      </View>

      {/* Description Section */}
      <View style={styles.fieldSection}>
        <View style={styles.labelRow}>
          <ThemedText style={styles.inputLabel}>Description</ThemedText>
        </View>
        <ThemedTextInput
          style={[styles.input, styles.textArea, { borderColor: "#E5E7EB" }]}
          placeholder="Describe your item ......"
          multiline
          numberOfLines={4}
          value={draft.description}
          onChangeText={(text) => updateDraft("description", text)}
        />
        <ThemedText style={styles.hintText}>
          Add details about condition, features, or any other relevant
          information
        </ThemedText>
      </View>

      <ThemedText style={styles.groupHeader}>
        {t(`subcategories.${draft.subCategory}`) || draft.subCategory} Details
      </ThemedText>

      {fields.map((field) => {
        const fieldType = field.type || "text";
        const currentValue = draft.details[field.key];

        return (
          <View key={field.key} style={styles.fieldSection}>
            {renderLabel(field)}

            {(fieldType === "text" || fieldType === "number") && (
              <View style={styles.inputWrapper}>
                <ThemedTextInput
                  style={[styles.input, { borderColor: "#E5E7EB" }]}
                  value={currentValue || ""}
                  onChangeText={(text) => updateDetail(field.key, text)}
                  keyboardType={fieldType === "number" ? "numeric" : "default"}
                  placeholder={field.key === "model" ? "Camry" : ""}
                />
                {field.key === "mileage" && (
                  <ThemedText style={styles.unitText}>KM</ThemedText>
                )}
              </View>
            )}

            {fieldType === "select" && field.options && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipScroll}
                contentContainerStyle={styles.chipContent}
              >
                {field.options.map((option: string) => {
                  const isSelected = currentValue === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => updateDetail(field.key, option)}
                      activeOpacity={0.7}
                    >
                      <ThemedText
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {option}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  fieldSection: {
    marginBottom: 2,
  },
  labelRow: {
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    gap: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  groupHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFF",
    height: 44,
  },
  unitText: {
    position: "absolute",
    right: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  hintText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 8,
    lineHeight: 18,
  },
  chipScroll: {},
  chipContent: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
    minWidth: 90,
    alignItems: "center",
  },
  chipSelected: {
    borderColor: Colors.reds[500],
    backgroundColor: "#FFF",
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  chipTextSelected: {
    color: Colors.reds[500],
    fontWeight: "600",
  },
});
