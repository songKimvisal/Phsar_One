import Header from "@/src/components/home_components/Header";
import ProductCategory from "@/src/components/home_components/ProductCategory";
import RecentListings from "@/src/components/home_components/RecentListings";
import SearchBar from "@src/components/SearchBar";
import useThemeColor from "@src/hooks/useThemeColor";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
export default function Index() {
  const themeColors = useThemeColor();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Header />
        <SearchBar />
        <ProductCategory />
        <RecentListings />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {},
});
