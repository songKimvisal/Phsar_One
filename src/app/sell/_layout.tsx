import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@src/context/ThemeContext";
import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity } from "react-native";
export default function SellLayout() {
  const { colors } = useTheme(); //
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "600" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="subcategory"
        options={{
          headerShown: true,
          title: t("sellSection.Choose_Subcategory"),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                marginLeft: Platform.OS === "ios" ? 0 : 10,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
                size={24}
                color={colors.text}
              />
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
