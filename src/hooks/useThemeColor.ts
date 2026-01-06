import { useTheme } from "@src/context/ThemeContext";

export default function useThemeColor() {
  const { colors } = useTheme();

  return colors;
}
