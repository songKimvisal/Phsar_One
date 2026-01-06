import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

export default function useThemeColor(): typeof Colors.light {
  const theme = useColorScheme() ?? "light";
  return Colors[theme];
}
