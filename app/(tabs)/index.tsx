import Header from "@src/components/Header";
import SearchBar from "@src/components/SearchBar";
import useThemeColor from "@src/hooks/useThemeColor";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
export default function Index() {
  const themeColors = useThemeColor();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView>
        <Header />
        <SearchBar />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
