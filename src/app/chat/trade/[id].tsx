import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TradeProductChatScreen() {
  const params = useLocalSearchParams();
  const { id, sellerId, sellerName, sellerAvatar, productTitle, productThumbnail, productPrice, productCurrency } = params;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: sellerName || "Trade Chat" }} />
      <View style={styles.content}>
        <Text style={styles.title}>Trade Product Chat Screen</Text>
        <Text>Product ID: {id}</Text>
        <Text>Seller ID: {sellerId}</Text>
        <Text>Seller Name: {sellerName}</Text>
        <Text>Product Title: {productTitle}</Text>
        {productPrice && productCurrency && (
          <Text>Price: {productCurrency === "USD" ? "$" : "៛"}{productPrice}</Text>
        )}
        <Text>Product Thumbnail: {productThumbnail ? "Available" : "N/A"}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
