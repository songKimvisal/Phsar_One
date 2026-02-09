import { CAMBODIA_LOCATIONS } from "@src/constants/CambodiaLocations";

export const getLocalizedLocationName = (
  englishName: string | null | undefined,
  currentLanguage: string,
  level: "province" | "district" | "commune",
  provinceNameEn?: string | null,
  districtNameEn?: string | null,
): string | null => {
  if (!englishName) return null;

  const findLocalizedName = (
    locationArray: any[] | undefined,
    targetEnName: string,
  ) => {
    if (!locationArray) return null;
    const found = locationArray.find((item) => item.name_en === targetEnName);
    return found
      ? currentLanguage === "kh"
        ? found.name_km
        : found.name_en
      : null;
  };

  if (level === "province") {
    return findLocalizedName(CAMBODIA_LOCATIONS, englishName);
  } else if (level === "district" && provinceNameEn) {
    const province = CAMBODIA_LOCATIONS.find(
      (p) => p.name_en === provinceNameEn,
    );
    return findLocalizedName(province?.subdivisions, englishName);
  } else if (level === "commune" && provinceNameEn && districtNameEn) {
    const province = CAMBODIA_LOCATIONS.find(
      (p) => p.name_en === provinceNameEn,
    );
    const district = province?.subdivisions?.find(
      (d) => d.name_en === districtNameEn,
    );
    return findLocalizedName(district?.subdivisions, englishName);
  }
  return null;
};