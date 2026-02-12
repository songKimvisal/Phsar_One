import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface ThemedCardProps extends ViewProps {
  children: React.ReactNode;
}

export default function ThemedCard({
  children,
  style,
  ...rest
}: ThemedCardProps) {
  const themeColors = useThemeColor();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
});
