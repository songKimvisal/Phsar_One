import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { Tabs } from "expo-router";
import {
  ArrowsClockwise,
  ChatCircleDots,
  House,
  PlusCircle,
  UserCircle,
} from "phosphor-react-native";
import { useTranslation } from "react-i18next";
import { Image, Text } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const themeColors = useThemeColor();
  const { i18n, t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const activeFont = i18n.language === "kh" ? "khmer-regular" : "Oxygen";
  const iconSize = {
    home: 26,
    trade: 26,
    sell: 26,
    chat: 26,
    profile: 26,
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.reds[500],
        tabBarIconStyle: {
          marginTop: 5,
        },
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          marginLeft: 16,
          marginRight: 16,
          elevation: 0,
          backgroundColor: themeColors.background, // Changed from themeColors.card to themeColors.background
          borderRadius: 40,
          height: 70,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          borderTopWidth: 0,
          bottom: bottom + 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("navigation.home"),
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <Image
                source={require("@src/assets/icons/Main-logo-24.png")}
                style={{ width: size, height: size }}
              />
            ) : (
              <House size={iconSize.home} color={color} />
            ),
          tabBarLabel: ({ color: labelColor }) => (
            <Text style={{ fontSize: 12, fontFamily: activeFont, color: labelColor }}>
              {t("navigation.home")}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: t("navigation.trade"),
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <ArrowsClockwise
                size={iconSize.trade}
                color={color}
                weight="fill"
              />
            ) : (
              <ArrowsClockwise size={iconSize.trade} color={color} />
            ),
          tabBarLabel: ({ color: labelColor }) => (
            <Text style={{ fontSize: 12, fontFamily: activeFont, color: labelColor }}>
              {t("navigation.trade")}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: t("navigation.sell"),
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <PlusCircle size={iconSize.sell} color={color} weight="fill" />
            ) : (
              <PlusCircle size={iconSize.sell} color={color} />
            ),
          tabBarLabel: ({ color: labelColor }) => (
            <Text style={{ fontSize: 12, fontFamily: activeFont, color: labelColor }}>
              {t("navigation.sell")}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t("navigation.chat"),
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <ChatCircleDots
                size={iconSize.chat}
                color={color}
                weight="fill"
              />
            ) : (
              <ChatCircleDots size={iconSize.chat} color={color} />
            ),
          tabBarLabel: ({ color: labelColor }) => (
            <Text style={{ fontSize: 12, fontFamily: activeFont, color: labelColor }}>
              {t("navigation.chat")}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("navigation.profile"),
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <UserCircle size={iconSize.profile} color={color} weight="fill" />
            ) : (
              <UserCircle size={iconSize.profile} color={color} />
            ),
          tabBarLabel: ({ color: labelColor }) => (
            <Text style={{ fontSize: 12, fontFamily: activeFont, color: labelColor }}>
              {t("navigation.profile")}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
