import DynamicPhosphorIcon from "@src/components/shared_components/DynamicPhosphorIcon";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { ThemedTextInput } from "@src/components/shared_components/ThemedTextInput";
import { Colors } from "@src/constants/Colors"; // Keep Colors import for now to reference red/blue color
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SellerContactFormProps {
  themeColors: ReturnType<typeof useThemeColor>;
  t: TFunction<"translation", undefined>; // Add this line
}

export default function SellerContactForm({
}: SellerContactFormProps) {
  const themeColors = useThemeColor(); // Get themeColors internally
  const { t } = useTranslation(); // Get t internally
  const { draft, updateDraft } = useSellDraft();

  return (
    <>
      <ThemedText
        style={[
          styles.sectionTitle,
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
            updateDraft("contact", {
              ...draft.contact,
              sellerName: text,
            })
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
                    color={themeColors.error}
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
                      color={themeColors.tint}
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
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    marginBottom: 10,
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
});
