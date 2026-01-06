import Header from "@src/components/Header";
import SearchBar from "@src/components/SearchBar";
import { ScrollView, StyleSheet, View } from "react-native";
export default function Index() {
  return (
    <>
      <ScrollView>
        <Header />
        <View style={styles.container}>
          <SearchBar />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
