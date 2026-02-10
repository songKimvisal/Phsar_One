import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextProps } from "react-native";
import useThemeColor from "@src/hooks/useThemeColor";

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
    // Use system default font for non-Khmer languages
    fontFamily = null;
  }

  return (
    <Text style={[{ fontFamily: fontFamily ?? undefined, color: themeColors.text }, style]} {...props}>
      {children}
    </Text>
  );
}
