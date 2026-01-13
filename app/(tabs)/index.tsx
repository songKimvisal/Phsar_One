import Header from "@/src/components/Header";
import ProductCategory from "@/src/components/ProductCategory";

import SearchBar from "@src/components/SearchBar";
import useThemeColor from "@src/hooks/useThemeColor";
import { ScrollView, StyleSheet, View } from "react-native";
export default function Index() {
  const themeColors = useThemeColor();
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Header />
        <SearchBar />
        <ProductCategory />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
});
