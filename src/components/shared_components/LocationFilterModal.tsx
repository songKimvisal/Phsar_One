import { CAMBODIA_LOCATIONS } from "@/src/constants/CambodiaLocations";
import useThemeColor from "@/src/hooks/useThemeColor";
import { CaretLeft } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@src/components/shared_components/ThemedText";

interface LocationFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (
    province: string | null,
    district: string | null,
    commune: string | null,
  ) => void;
  currentProvince: string | null;
  currentDistrict: string | null;
  currentCommune: string | null;
}

export default function LocationFilterModal({
  isVisible,
  onClose,
  onApplyFilters,
  currentProvince,
  currentDistrict,
  currentCommune,
}: LocationFilterModalProps) {
  const { t, i18n } = useTranslation();
  const themeColors = useThemeColor();
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

  const [selectedProvince, setSelectedProvince] = useState<string | null>(
    currentProvince,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    currentDistrict,
  );
  const [selectedCommune, setSelectedCommune] = useState<string | null>(
    currentCommune,
  );

  useEffect(() => {
    setSelectedProvince(currentProvince);
    setSelectedDistrict(currentDistrict);
    setSelectedCommune(currentCommune);
  }, [currentProvince, currentDistrict, currentCommune]);

  const handleApply = () => {
    onApplyFilters(selectedProvince, selectedDistrict, selectedCommune);
    onClose();
  };

  const handleClear = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedCommune(null);
  };

  const getDistricts = () => {
    if (!selectedProvince) return [];
    const provinceData = CAMBODIA_LOCATIONS.find(
      (loc) => loc.name_en === selectedProvince,
    );
    return provinceData?.subdivisions || [];
  };

  const getCommunes = () => {
    if (!selectedProvince || !selectedDistrict) return [];
    const provinceData = CAMBODIA_LOCATIONS.find(
      (loc) => loc.name_en === selectedProvince,
    );
    const districtData = provinceData?.subdivisions.find(
      (sub) => sub.name_en === selectedDistrict,
    );
    return districtData?.subdivisions || [];
  };

  const renderItem = ({ item, type }: { item: any; type: string }) => {
    const isSelected =
      (type === "province" && selectedProvince === item.name_en) ||
      (type === "district" && selectedDistrict === item.name_en) ||
      (type === "commune" && selectedCommune === item.name_en);

    return (
      <TouchableOpacity
        style={[
          styles.chip,
          {
            backgroundColor: isSelected ? themeColors.tint : themeColors.card,
            borderColor: isSelected ? themeColors.tint : themeColors.border,
          },
        ]}
        onPress={() => {
          if (type === "province") {
            setSelectedProvince(item.name_en);
            setSelectedDistrict(null);
            setSelectedCommune(null);
          } else if (type === "district") {
            setSelectedDistrict(item.name_en);
            setSelectedCommune(null);
          } else if (type === "commune") {
            setSelectedCommune(item.name_en);
          }
        }}
      >
        <ThemedText
          style={[
            styles.chipText,
            {
              fontFamily: activeFont,
              color: isSelected ? "#FFFFFF" : themeColors.text,
            },
          ]}
        >
          {item[`name_${i18n.language}`] || item.name_en}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        edges={["top"]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: themeColors.background,
              borderBottomColor: themeColors.border,
            },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <CaretLeft size={24} color={themeColors.text} />
          </TouchableOpacity>
          <ThemedText
            style={[
              styles.headerTitle,
              { fontFamily: activeFont, color: themeColors.text },
            ]}
          >
            {t("fields.filter_location")}
          </ThemedText>
          <TouchableOpacity onPress={handleClear} style={styles.headerButton}>
            <ThemedText style={{ color: themeColors.tint }}>
              {t("common.clear")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { fontFamily: activeFont }]}
            >
              {t("location.province")}
            </ThemedText>
            <View style={styles.chipsContainer}>
              {CAMBODIA_LOCATIONS.map((item) =>
                renderItem({ item, type: "province" }),
              )}
            </View>
          </View>

          {selectedProvince && (
            <View style={styles.section}>
              <ThemedText
                style={[styles.sectionTitle, { fontFamily: activeFont }]}
              >
                {t("location.district")}
              </ThemedText>
              <View style={styles.chipsContainer}>
                {getDistricts().map((item) =>
                  renderItem({ item, type: "district" }),
                )}
              </View>
            </View>
          )}

          {selectedDistrict && (
            <View style={styles.section}>
              <ThemedText
                style={[styles.sectionTitle, { fontFamily: activeFont }]}
              >
                {t("location.commune")}
              </ThemedText>
              <View style={styles.chipsContainer}>
                {getCommunes().map((item) =>
                  renderItem({ item, type: "commune" }),
                )}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>{t("common.apply")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 60,
    height: 24,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  applyButton: {
    backgroundColor: "#007AFF", // Example tint color
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
