import { ThemedText } from "@src/components/ThemedText";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface PhotoUploadSectionProps {
  themeColors: ReturnType<typeof useThemeColor>;
}

export default function PhotoUploadSection({
  themeColors,
}: PhotoUploadSectionProps) {
  const { draft, updateDraft } = useSellDraft();
  const { t } = useTranslation();

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

  return (
    <TouchableOpacity
      onPress={pickImage}
      style={[styles.photoContainer, { backgroundColor: themeColors.card }]}
    >
      <ThemedText style={styles.photoText}>
        {t("sellSection.Add_Photos")}({draft.photos.length})
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
