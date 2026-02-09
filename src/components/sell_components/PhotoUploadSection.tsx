import { ThemedText } from "@src/components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface PhotoUploadSectionProps {
  themeColors: ReturnType<typeof useThemeColor>;
  photos: string[];
  onUpdatePhotos: (newPhotos: string[]) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PhotoUploadSection({
  themeColors,
  photos,
  onUpdatePhotos,
}: PhotoUploadSectionProps) {
  const { t } = useTranslation();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null); // Ref for FlatList

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (!result.canceled) {
      onUpdatePhotos([
        ...photos,
        ...result.assets.map((a) => a.uri),
      ]);
    }
  };

  const openPreview = (index: number) => {
    setSelectedImageIndex(index);
    setPreviewVisible(true);
    // Scroll to the selected image when opening the preview
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: false });
    }
  };

  const deleteCurrentImage = () => {
    const newPhotos = [...photos];
    newPhotos.splice(selectedImageIndex, 1);
    onUpdatePhotos(newPhotos);

    if (newPhotos.length === 0) {
      setPreviewVisible(false);
    } else if (selectedImageIndex >= newPhotos.length) {
      setSelectedImageIndex(newPhotos.length - 1);
    }
  };

  // Removed goToPrevious and goToNext functions

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.titleText}>
          {t("sellSection.Add_Photos")}
        </ThemedText>
        <View style={styles.photoCountBadge}>
          <ThemedText style={styles.photoCountText}>
            {photos.length}
          </ThemedText>
        </View>
      </View>

      <View style={styles.photosGridContainer}>
        {photos.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <TouchableOpacity
              onPress={() => openPreview(index)}
              activeOpacity={0.8}
            >
              <Image source={{ uri }} style={styles.imagePreview} />
              <View style={styles.imageOverlay} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                const newPhotos = [...photos];
                newPhotos.splice(index, 1);
                onUpdatePhotos(newPhotos);
              }}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.clearButtonText}>×</ThemedText>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.addPhotoButton,
            { borderColor: themeColors.text + "30" },
          ]}
          activeOpacity={0.7}
        >
          <View style={styles.addPhotoContent}>
            <ThemedText
              style={[styles.addPhotoIcon, { color: themeColors.text + "60" }]}
            >
              +
            </ThemedText>
            <ThemedText
              style={[styles.addPhotoText, { color: themeColors.text + "60" }]}
            >
              {t("sellSection.Add_Photos")}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      {/* Image Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalCounter}>
              {selectedImageIndex + 1} / {photos.length}
            </ThemedText>
            <TouchableOpacity
              onPress={() => setPreviewVisible(false)}
              style={styles.modalCloseButton}
            >
              <ThemedText style={styles.modalCloseText}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.modalImageWrapper}>
                <Image
                  source={{ uri: item }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            )}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.floor(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
              );
              setSelectedImageIndex(newIndex);
            }}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />

          <TouchableOpacity
            onPress={deleteCurrentImage}
            style={styles.modalDeleteButton}
          >
            <ThemedText style={styles.modalDeleteText}>
              {t("sellSection.Delete")}
            </ThemedText>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  photoCountBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: "center",
  },
  photoCountText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3b82f6",
  },
  photosGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageWrapper: {
    position: "relative",
    width: 105,
    height: 105,
    borderRadius: 12,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
  },
  clearButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "400",
    fontSize: 18,
    lineHeight: 20,
  },
  addPhotoButton: {
    width: 105,
    height: 105,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.01)",
  },
  addPhotoContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoIcon: {
    fontSize: 36,
    fontWeight: "300",
    marginBottom: 4,
  },
  addPhotoText: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalCounter: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    color: "white",
    fontSize: 28,
    fontWeight: "300",
  },
  modalImageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalDeleteButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    borderRadius: 12,
    alignItems: "center",
  },
  modalDeleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});