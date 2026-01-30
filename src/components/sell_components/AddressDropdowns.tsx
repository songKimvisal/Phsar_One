import { ThemedText } from "@src/components/ThemedText";
import DynamicPhosphorIcon from "@src/components/DynamicPhosphorIcon";
import { CAMBODIA_LOCATIONS } from "@src/constants/CambodiaLocations";
import { useSellDraft } from "@src/context/SellDraftContext";
import useThemeColor from "@src/hooks/useThemeColor";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface AddressDropdownsProps {
  themeColors: ReturnType<typeof useThemeColor>;
  t: (key: string) => string;
  activeFont: string;
}

export default function AddressDropdowns({
  themeColors,
  t,
  activeFont,
}: AddressDropdownsProps) {
  const { draft, updateDraft } = useSellDraft();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

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

  return (
    <>
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
          ArrowUpIconComponent={({ style }) => (
            <DynamicPhosphorIcon name="CaretUp" size={20} color={themeColors.text} style={style} />
          )}
          ArrowDownIconComponent={({ style }) => (
            <DynamicPhosphorIcon name="CaretDown" size={20} color={themeColors.text} style={style} />
          )}
          TickIconComponent={({ style }) => (
            <DynamicPhosphorIcon name="Check" size={20} color={themeColors.text} style={style} />
          )}
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
                CAMBODIA_LOCATIONS.find((p) => p.name_en === item.value)
                  ?.subdivisions.map((d) => ({
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
                      ArrowUpIconComponent={({ style }) => (
                        <DynamicPhosphorIcon name="CaretUp" size={20} color={themeColors.text} style={style} />
                      )}
                      ArrowDownIconComponent={({ style }) => (
                        <DynamicPhosphorIcon name="CaretDown" size={20} color={themeColors.text} style={style} />
                      )}
                      TickIconComponent={({ style }) => (
                        <DynamicPhosphorIcon name="Check" size={20} color={themeColors.text} style={style} />
                      )}
                      onOpen={() => {
                        setProvinceOpen(false);
                        setCommuneOpen(false);
                      }}
                      onSelectItem={(item) => {              if (item && item.value) {
                updateDraft("district", item.value);
                setSelectedCommune(null);
                updateDraft("commune", "");

                // Update commune items based on selected district
                const newCommunes =
                  CAMBODIA_LOCATIONS.find((p) => p.name_en === selectedProvince)
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
                      ArrowUpIconComponent={({ style }) => (
                        <DynamicPhosphorIcon name="CaretUp" size={20} color={themeColors.text} style={style} />
                      )}
                      ArrowDownIconComponent={({ style }) => (
                        <DynamicPhosphorIcon name="CaretDown" size={20} color={themeColors.text} style={style} />
                      )}
                      TickIconComponent={({ style }) => (
                        <DynamicPhosphorIcon name="Check" size={20} color={themeColors.text} style={style} />
                      )}
                      onOpen={() => {
                        setProvinceOpen(false);
                        setDistrictOpen(false);
                      }}
                      onSelectItem={(item) => {              if (item && item.value) {
                updateDraft("commune", item.value);
              }
            }}
          />
        </View>
      )}
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
});
