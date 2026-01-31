import { useTheme } from "@/src/context/ThemeContext";
import { StatusBar } from "expo-status-bar";

export default function ThemedStatusBar() {
  const { colors, theme } = useTheme();

  return (
    <StatusBar
      style={theme === "dark" ? "light" : "dark"}
      backgroundColor={colors.background}
    />
  );
}
