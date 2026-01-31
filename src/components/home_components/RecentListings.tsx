import { ThemedText } from "@src/components/ThemedText";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const mockProducts = [
  {
    id: "1",
    name: "Tesla Model Y",
    image:
      "https://imgs.search.brave.com/sV7JFaCPLNsD9Nry7_LwZc0EuC753WjLK82oOUFJpmc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmNhcmJ1enpp/bWFnZXMuY29tL3dv/cmRwcmVzcy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8xMS8y/MDIzLTIwMjQtdGVz/bGEtbW9kZWwteS1l/eHRlcmlvci0zLmpw/Zz9xPTQ5JmZpdD1j/cm9wJnc9ODI1JmRw/cj0y",
    time: "24m",
    location: "BKK, Phnom Penh",
    condition: "New",
    year: "2025",
    price: "$500",
  },
  {
    id: "2",
    name: "Tesla Model Y",
    image:
      "https://imgs.search.brave.com/sV7JFaCPLNsD9Nry7_LwZc0EuC753WjLK82oOUFJpmc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmNhcmJ1enpp/bWFnZXMuY29tL3dv/cmRwcmVzcy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8xMS8y/MDIzLTIwMjQtdGVz/bGEtbW9kZWwteS1l/eHRlcmlvci0zLmpw/Zz9xPTQ5JmZpdD1j/cm9wJnc9ODI1JmRw/cj0y",
    time: "24m",

    location: "BKK, Phnom Penh",
    condition: "New",
    year: "2025",
    price: "$500",
  },
  {
    id: "3",
    name: "Tesla Model Y",
    image:
      "https://imgs.search.brave.com/sV7JFaCPLNsD9Nry7_LwZc0EuC753WjLK82oOUFJpmc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmNhcmJ1enpp/bWFnZXMuY29tL3dv/cmRwcmVzcy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8xMS8y/MDIzLTIwMjQtdGVz/bGEtbW9kZWwteS1l/eHRlcmlvci0zLmpw/Zz9xPTQ5JmZpdD1j/cm9wJnc9ODI1JmRw/cj0y",
    time: "24m",

    location: "BKK, Phnom Penh",
    condition: "New",
    year: "2025",
    price: "$500",
  },
  {
    id: "4",
    name: "Tesla Model Y",
    image:
      "https://imgs.search.brave.com/sV7JFaCPLNsD9Nry7_LwZc0EuC753WjLK82oOUFJpmc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmNhcmJ1enpp/bWFnZXMuY29tL3dv/cmRwcmVzcy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8xMS8y/MDIzLTIwMjQtdGVz/bGEtbW9kZWwteS1l/eHRlcmlvci0zLmpw/Zz9xPTQ5JmZpdD1j/cm9wJnc9ODI1JmRw/cj0y",
    time: "24m",

    location: "BKK, Phnom Penh",
    condition: "New",
    year: "2025",
    price: "$500",
  },
  {
    id: "5",
    name: "Tesla Model Y",
    image:
      "https://imgs.search.brave.com/sV7JFaCPLNsD9Nry7_LwZc0EuC753WjLK82oOUFJpmc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmNhcmJ1enpp/bWFnZXMuY29tL3dv/cmRwcmVzcy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8xMS8y/MDIzLTIwMjQtdGVz/bGEtbW9kZWwteS1l/eHRlcmlvci0zLmpw/Zz9xPTQ5JmZpdD1j/cm9wJnc9ODI1JmRw/cj0y",
    time: "24m",

    location: "BKK, Phnom Penh",
    condition: "New",
    year: "2025",
    price: "$500",
  },
  {
    id: "6",
    name: "Tesla Model Y",
    image:
      "https://imgs.search.brave.com/sV7JFaCPLNsD9Nry7_LwZc0EuC753WjLK82oOUFJpmc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmNhcmJ1enpp/bWFnZXMuY29tL3dv/cmRwcmVzcy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyNC8xMS8y/MDIzLTIwMjQtdGVz/bGEtbW9kZWwteS1l/eHRlcmlvci0zLmpw/Zz9xPTQ5JmZpdD1j/cm9wJnc9ODI1JmRw/cj0y",
    time: "24m",

    location: "BKK, Phnom Penh",
    condition: "New",
    year: "2025",
    price: "$500",
  },
];

const RecentListings = () => {
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const router = useRouter();

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/product/[id]",
          params: { id: item.id },
        })
      }
      style={[
        styles.productCard,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
        },
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName} numberOfLines={1}>
          {item.name}
        </ThemedText>
        <ThemedText
          style={[styles.productMeta, { opacity: 0.6 }]}
          numberOfLines={1}
        >
          {item.time} • {item.location}
        </ThemedText>
        <ThemedText style={[styles.productMeta, { opacity: 0.6 }]}>
          {item.condition} • {item.year}
        </ThemedText>
        <ThemedText style={[styles.productPrice, { color: Colors.reds[500] }]}>
          {item.price}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>
        {t("home_screen.recent_listings")}
      </ThemedText>
      <FlatList
        data={mockProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 16,
  },
  row: {
    justifyContent: "space-evenly",
  },
  productCard: {
    borderRadius: 6,
    width: "48%",
    marginBottom: 6,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default RecentListings;
