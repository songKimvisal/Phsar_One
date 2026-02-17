import { useTranslation } from "react-i18next";
import { TextInput, TextInputProps } from "react-native";
import useThemeColor from "@src/hooks/useThemeColor";

export function ThemedTextInput({ style, ...props }: TextInputProps) {
  const themeColors = useThemeColor();

  return (
    <TextInput
      style={[
        {
          borderWidth: 1,
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
