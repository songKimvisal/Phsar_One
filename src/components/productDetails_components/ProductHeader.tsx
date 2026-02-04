import { Ionicons } from "@expo/vector-icons";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

interface ProductHeaderProps {
  // Define any props if needed, e.g., for share/heart functionality
}

const ProductHeader: React.FC<ProductHeaderProps> = () => {
  const router = useRouter();
  const themeColors = useThemeColor();

  return (
    <View
      style={[styles.header, { backgroundColor: themeColors.background }]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.headerButton}
      >
        <Ionicons
          name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
          size={24}
          color={themeColors.text}
        />
      </TouchableOpacity>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="heart-outline" size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
});

export default ProductHeader;
