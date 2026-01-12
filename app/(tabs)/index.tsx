import ProductCategory from "@/src/components/ProductCategory";

import SearchBar from "@src/components/SearchBar";
import useThemeColor from "@src/hooks/useThemeColor";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
export default function Index() {
  const themeColors = useThemeColor();
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <SearchBar />
          <ProductCategory />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
});
