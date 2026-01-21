import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";

export default function SellLayout() {
  const { colors } = useTheme(); //
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background }, //
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "600" },
        headerShadowVisible: false, // Cleaner look for modern apps
      }}
    >
      <Stack.Screen
        name="subcategory"
        options={{
          title: t("sellSection.Choose_Subcategory"), //
          headerLeft: () => (
            <TouchableOpacity
              // Use replace to ensure you go back to the correct Tab entry point
              onPress={() => router.replace("/(tabs)/sell")}
              style={{
                paddingRight: 15, // Increase touch area
                paddingVertical: 5,
              }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: t("sellSection.Product_Details"),
          headerBackButtonDisplayMode: "generic",
        }}
      />
    </Stack>
  );
}
