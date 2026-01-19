import { ThemeProvider } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [languageLoaded, setLanguageLoaded] = useState(false);
  const [loaded, error] = useFonts({
    Oxygen: require("@src/assets/fonts/Oxygen-Regular.ttf"),
    "Oxygen-Bold": require("@src/assets/fonts/Oxygen-Bold.ttf"),
    "khmer-regular": require("@src/assets/fonts/KantumruyPro-Regular.ttf"),
    "khmer-KantumruyPro-Bold": require("@src/assets/fonts/KantumruyPro-Bold.ttf"),
  });
  const loadSavedLanguage = useCallback(async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("user-language");
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
    } catch (e) {
      console.error("Failed to load language", e);
    } finally {
      setLanguageLoaded(true);
    }
  }, []);
  useEffect(() => {
    loadSavedLanguage();
  }, [loadSavedLanguage]);
  useEffect(() => {
    if ((loaded || error) && languageLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, languageLoaded]);
  if (!loaded && !error && !languageLoaded) {
    return null;
  }
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <Slot />
      </I18nextProvider>
    </ThemeProvider>
  );
}
