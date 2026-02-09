import TradeDraftProvider from "@src/context/TradeDraftContext";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function TradeStackLayout() {
  return (
    <TradeDraftProvider>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="AddTradeProductScreen"
            options={{ headerShown: false }}
          />
        </Stack>
      </View>
    </TradeDraftProvider>
  );
}
