import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextProps } from "react-native";
import useThemeColor from "@src/hooks/useThemeColor";

export function ThemedText({ style, children, ...props }: TextProps) {
  const themeColors = useThemeColor();
  const { i18n } = useTranslation();
  
  const isKhmer = i18n.language === "kh";
  const fontFamily = isKhmer ? "khmer-regular" : undefined;

  return (
    <Text 
      style={[
        { color: themeColors.text }, 
        fontFamily ? { fontFamily } : {},
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
}
