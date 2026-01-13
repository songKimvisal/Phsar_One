import CustomTabs from "@/src/components/CustomTabs";
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useThemeColor from "@src/hooks/useThemeColor";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { View } from "react-native";
function MainLayout() {
  const { theme } = useTheme();
  const themeColors = useThemeColor();

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <CustomTabs />
      <StatusBar style={theme === "light" ? "dark" : "light"} />
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Oxygen: require("@src/assets/fonts/Oxygen-Regular.ttf"),
    "Oxygen-Bold": require("@src/assets/fonts/Oxygen-Bold.ttf"),
    "khmer-regular": require("@src/assets/fonts/KantumruyPro-Regular.ttf"),
    "khmer-KantumruyPro-Bold": require("@src/assets/fonts/KantumruyPro-Bold.ttf"),
  });
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("user-language");
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }
      } catch (e) {
        console.error("Failed to load language", e);
      }
    };
    loadSavedLanguage();
  }, []);
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <MainLayout />
      </I18nextProvider>
    </ThemeProvider>
  );
}
