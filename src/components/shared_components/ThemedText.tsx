import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextProps } from "react-native";
import useThemeColor from "@src/hooks/useThemeColor";

export function ThemedText({ style, children, ...props }: TextProps) {
  const themeColors = useThemeColor();

  return (
    <Text style={[{ color: themeColors.text }, style]} {...props}>
      {children}
    </Text>
  );
}
