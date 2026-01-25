import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextProps } from "react-native";
import useThemeColor from "../hooks/useThemeColor";

export function ThemedText({ style, children, ...props }: TextProps) {
  const { i18n } = useTranslation();
  const themeColors = useThemeColor();

  const flattenStyle = StyleSheet.flatten(style);
  const fontWeight = flattenStyle?.fontWeight;

  let fontFamily;
  if (i18n.language === "kh") {
    fontFamily =
      fontWeight === "bold" ? "khmer-KantumruyPro-Bold" : "khmer-regular";
  } else {
    fontFamily = fontWeight === "bold" ? "Oxygen-Bold" : "Oxygen";
  }

  return (
    <Text style={[{ fontFamily, color: themeColors.text }, style]} {...props}>
      {children}
    </Text>
  );
}
