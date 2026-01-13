import CustomTabs from "@/src/components/CustomTabs";
import { useTheme } from "@/src/context/ThemeContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function TabLayout() {
  const { theme } = useTheme();
  const themeColors = useThemeColor();

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <CustomTabs />
      <StatusBar style={theme === "light" ? "dark" : "light"} />
    </View>
  );
}
