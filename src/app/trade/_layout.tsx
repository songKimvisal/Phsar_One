import TradeProductsProvider from "@/src/context/TradeProductsContext";
import TradeDraftProvider from "@src/context/TradeDraftContext";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function TradeStackLayout() {
  return (
    <TradeProductsProvider>
      <TradeDraftProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="AddTradeProductScreen"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
          </Stack>
        </View>
      </TradeDraftProvider>
    </TradeProductsProvider>
  );
}
