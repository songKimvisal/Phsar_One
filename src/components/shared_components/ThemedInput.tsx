import useThemeColor from "@src/hooks/useThemeColor";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface ThemedInputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  required?: boolean;
}

export default function ThemedInput({
  label,
  containerStyle,
  inputStyle,
  labelStyle,
  required = false,
  placeholderTextColor,
  ...rest
}: ThemedInputProps) {
  const themeColors = useThemeColor();

  return (
    <View style={[styles.inputGroup, containerStyle]}>
      {label && (
        <ThemedText style={[styles.inputLabel, labelStyle]}>
          {label} {required && "*"}
        </ThemedText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: themeColors.background,
            borderColor: themeColors.border,
            color: themeColors.text,
          },
          inputStyle,
        ]}
        placeholderTextColor={placeholderTextColor || themeColors.text + "60"}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
});
