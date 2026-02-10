import { useTranslation } from "react-i18next";
import { TextInput, TextInputProps } from "react-native";
import useThemeColor from "@src/hooks/useThemeColor";

export function ThemedTextInput({ style, ...props }: TextInputProps) {
  const { i18n } = useTranslation();
  const themeColors = useThemeColor();
  const fontFamily = i18n.language === "kh" ? "khmer-regular" : null;

  return (
    <TextInput
      style={[
        {
          borderWidth: 1,
          fontFamily: fontFamily ?? undefined,
          color: themeColors.text,
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
        style,
      ]}
      placeholderTextColor={themeColors.tabIconDefault}
      {...props}
    />
  );
}
