import { useTranslation } from "react-i18next";
import { Text, TextProps } from "react-native";
import useThemeColor from "../hooks/useThemeColor";

export function ThemedText({ style, children, ...props }: TextProps) {
  const { i18n } = useTranslation();
  const themeColors = useThemeColor();
  const fontFamily = i18n.language === "kh" ? "khmer-regular" : "Oxygen";

  return (
    <Text style={[{ fontFamily, color: themeColors.text }, style]} {...props}>
      {children}
    </Text>
  );
}

