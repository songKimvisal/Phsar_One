import useThemeColor from "@src/hooks/useThemeColor";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductImageGalleryProps {
  photos: string[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  photos,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const themeColors = useThemeColor();

  const renderThumbnail = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => (
    <TouchableOpacity
      onPress={() => setSelectedImageIndex(index)}
      style={[
        styles.thumbnail,
        selectedImageIndex === index && {
          borderColor: themeColors.tint,
        },
      ]}
    >
      <Image source={{ uri: item }} style={styles.thumbnailImage} />
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.imageContainer,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Image
        source={{ uri: photos[selectedImageIndex] }}
        style={styles.mainImage}
        resizeMode="cover"
      />

      {/* Thumbnail Gallery */}
      <View style={styles.thumbnailContainer}>
        <FlatList
          data={photos}
          renderItem={renderThumbnail}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
  },
  mainImage: {
    width: "100%",
    height: Dimensions.get("window").width * 0.75,
  },
  thumbnailContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  thumbnailList: {
    gap: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
});

export default ProductImageGallery;
