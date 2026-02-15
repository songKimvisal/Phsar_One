import Header from "@/src/components/home_components/Header";
import ProductCategory from "@/src/components/home_components/ProductCategory";
import RecentListings from "@/src/components/home_components/RecentListings";
import useThemeColor from "@src/hooks/useThemeColor";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const themeColors = useThemeColor();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Header />
        <ProductCategory />
        <RecentListings />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {},
});
