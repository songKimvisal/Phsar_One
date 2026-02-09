import ProductCard from "@src/components/category_components/ProductCard";
import { ThemedText } from "@src/components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { Product } from "@src/types/productTypes";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Mercedes CLA45",
    description:
      "Luxury sedan in excellent condition with low mileage. Perfect for city driving and long trips.",
    mainCategory: "Vehicles",
    subCategory: "Car",

    photos: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    ],

    price: "50000",
    currency: "KHR",
    negotiable: true,
    discountType: "percentage",
    discountValue: "5",
    address: {
      province: "Phnom Penh",
      district: "Sen Sok",
      commune: "Phnom Penh Thmey",
    },
    location: {
      latitude: 11.5564,
      longitude: 104.9282,
    },
    details: {
      brand: "Mercedes",
      model: "CLA45",
      year: "2023",
      mileage: "0",
      fuelType: "Petrol",
      transmission: "Manual",
      condition: "new",
    },
    contact: {
      sellerName: "Sarah Chen",
      phones: ["012 345 678", "098 765 432"],
      email: "sarah.chen@email.com",
    },
    views: 200,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: "active",
    seller: {
      id: "seller1",
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      verified: true,
      trusted: true,
      rating: 4.8,
      totalListings: 24,
    },
  },
  {
    id: "2",
    title: "Honda Dream 2024",
    description: "New Honda Dream 2024, excellent condition.",
    mainCategory: "Vehicles",
    subCategory: "Motorcycle",

    photos: [
      "https://images.unsplash.com/photo-1558981403-c5cb989c7442?w=800",
      "https://images.unsplash.com/photo-1598550774677-172545d166c3?w=800",
    ],
    price: "2500",

    currency: "USD",
    negotiable: false,
    discountType: "none",
    discountValue: "0",
    address: {
      province: "Kandal",
      district: "Takhmao",
      commune: "Prek Hou",
    },

    location: {
      latitude: 11.4927,
      longitude: 104.9403,
    },
    details: {
      brand: "Honda",
      model: "Dream",
      year: "2024",
      mileage: "0",
      fuelType: "Petrol",
      transmission: "Automatic",
      condition: "like new",
    },
    contact: {
      sellerName: "Sok Vuthy",
      phones: ["010 123 456"],
      email: "sok.vuthy@email.com",
    },
    views: 150,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: "active",
    seller: {
      id: "seller2",
      name: "Sok Vuthy",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      verified: true,
      trusted: false,
      rating: 4.5,
      totalListings: 18,
    },
  },
  {
    id: "3",
    title: "Apartment for Rent",
    description: "Spacious 2-bedroom apartment in city center.",
    mainCategory: "Real Estate",
    subCategory: "Apartment",
    photos: [
      "https://images.unsplash.com/photo-1493663184610-d8689945091b?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    price: "500",
    currency: "USD",
    negotiable: true,
    discountType: "none",
    discountValue: "0",
    address: {
      province: "Phnom Penh",
      district: "Chamkarmon",
      commune: "Boeung Keng Kang Ti Muoy",
    },
    location: {
      latitude: 11.545,
      longitude: 104.918,
    },
    details: {
      bedrooms: "2",
      bathrooms: "2",
      area: "80 sqm",
      furnished: "Yes",
      condition: "used",
      year: "2020",
    },
    contact: {
      sellerName: "Chanthou Real Estate",
      phones: ["077 888 999"],
      email: "chanthou.re@email.com",
    },
    views: 300,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    seller: {
      id: "seller3",
      name: "Chanthou Real Estate",
      avatar: "https://images.unsplash.com/photo-1549666014-99a531e28956?w=200",
      verified: true,
      trusted: true,
      rating: 4.9,
      totalListings: 50,
    },
  },
  {
    id: "4",
    title: "Dell XPS 15 Laptop",
    description: "High-performance laptop for professional use.",
    mainCategory: "Electronics",
    subCategory: "Laptop",

    photos: [
      "https://images.unsplash.com/photo-1588872657578-bcab8fcd6d67?w=800",
      "https://images.unsplash.com/photo-1574944933903-a15e6128540b?w=800",
    ],
    price: "1500",

    currency: "USD",
    negotiable: false,
    discountType: "percentage",
    discountValue: "10",
    address: {
      province: "Siem Reap",
      district: "Siem Reap",
      commune: "Sla Kram",
    },

    location: {
      latitude: 13.3601,
      longitude: 103.851,
    },
    details: {
      brand: "Dell",
      model: "XPS 15",
      processor: "Intel i7",
      ram: "16GB",
      storage: "512GB SSD",
      condition: "refurbished",
      year: "2022",
    },
    contact: {
      sellerName: "Tech Hub SR",
      phones: ["092 345 678"],
      email: "techhub.sr@email.com",
    },
    views: 220,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    seller: {
      id: "seller4",
      name: "Tech Hub SR",
      avatar:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200",
      verified: true,
      trusted: true,
      rating: 4.7,
      totalListings: 35,
    },
  },
];

export default function RecentListings() {
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const router = useRouter();

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => {
        router.push(`/product/${item.id}`);
      }}
    />
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
}

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
});
