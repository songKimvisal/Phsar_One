import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@src/components/ThemedText";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
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
    description:
      "This is a brand new Tesla Model Y with all the latest features. Low mileage and in pristine condition. A great deal!",
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
    description:
      "This is a brand new Tesla Model Y with all the latest features. Low mileage and in pristine condition. A great deal!",
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
    description:
      "This is a brand new Tesla Model Y with all the latest features. Low mileage and in pristine condition. A great deal!",
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
    description:
      "This is a brand new Tesla Model Y with all the latest features. Low mileage and in pristine condition. A great deal!",
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
    description:
      "This is a brand new Tesla Model Y with all the latest features. Low mileage and in pristine condition. A great deal!",
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
    description:
      "This is a brand new Tesla Model Y with all the latest features. Low mileage and in pristine condition. A great deal!",
  },
];

const ProductDetail = () => {
  const { id } = useLocalSearchParams();
  const themeColors = useThemeColor();
  const router = useRouter();

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Product Not Found" }} />
        <ThemedText>Product not found.</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: product.name,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                marginLeft: Platform.OS === "ios" ? 0 : 10,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
                size={24}
                color={themeColors.text}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Image source={{ uri: product.image }} style={styles.productImage} />

      <View style={styles.detailsContainer}>
        <ThemedText style={styles.productName}>{product.name}</ThemedText>
        <ThemedText style={[styles.productPrice, { color: Colors.reds[500] }]}>
          {product.price}
        </ThemedText>

        <View
          style={[styles.separator, { backgroundColor: themeColors.border }]}
        />

        <ThemedText style={styles.sectionTitle}>Details</ThemedText>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Condition</ThemedText>
          <ThemedText style={styles.detailValue}>
            {product.condition}
          </ThemedText>
        </View>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Year</ThemedText>
          <ThemedText style={styles.detailValue}>{product.year}</ThemedText>
        </View>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Location</ThemedText>
          <ThemedText style={styles.detailValue}>{product.location}</ThemedText>
        </View>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Posted</ThemedText>
          <ThemedText style={styles.detailValue}>{product.time} ago</ThemedText>
        </View>

        <View
          style={[styles.separator, { backgroundColor: themeColors.border }]}
        />

        <ThemedText style={styles.sectionTitle}>Description</ThemedText>
        <ThemedText style={styles.descriptionText}>
          {product.description}
        </ThemedText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productImage: {
    width: "100%",
    height: Dimensions.get("window").width, // Make image square
  },
  detailsContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  separator: {
    height: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    opacity: 0.6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default ProductDetail;
