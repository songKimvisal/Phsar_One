import { Stack } from "expo-router";
import TradeDraftProvider from "@src/context/TradeDraftContext"; // Import the provider

export default function TradeStackLayout() {
  return (
    <TradeDraftProvider> // Wrap the Stack with the provider
      <Stack>
        <Stack.Screen name="AddTradeProductScreen" options={{ headerShown: false, title: "Add Trade Product" }} />
      </Stack>
    </TradeDraftProvider>
  );
}
