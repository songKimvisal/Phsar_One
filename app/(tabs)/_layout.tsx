import i18n from "@/src/i18n";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Oxygen: require("@src/assets/fonts/Oxygen-Regular.ttf"),
    "Oxygen-Bold": require("@src/assets/fonts/Oxygen-Bold.ttf"),
    "khmer-regular": require("@src/assets/fonts/KantumruyPro-Regular.ttf"),
    "khmer-KantumruyPro-Bold": require("@src/assets/fonts/KantumruyPro-Bold.ttf"),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <I18nextProvider i18n={i18n}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </I18nextProvider>
  );
}
