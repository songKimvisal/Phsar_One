import { X } from "phosphor-react-native";
import React from "react";
import { Image, Modal, TouchableOpacity, View } from "react-native";

export default function ImageViewerModal({ visible, uri, onClose }: any) {
  return (
    <Modal visible={visible} transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "80%" }}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={onClose}
          style={{ position: "absolute", top: 50, right: 20 }}
        >
          <X size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
