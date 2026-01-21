import { useTranslation } from "react-i18next";
import { TextInput, TextInputProps } from "react-native";
import useThemeColor from "../hooks/useThemeColor";

export function ThemedTextInput({ style, ...props }: TextInputProps) {
  const { i18n } = useTranslation();
  const themeColors = useThemeColor();
  const fontFamily = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

  return (
    <TextInput
      style={[{ fontFamily, color: themeColors.text }, style]}
      placeholderTextColor={themeColors.tabIconDefault}
      {...props}
    />
  );
}
