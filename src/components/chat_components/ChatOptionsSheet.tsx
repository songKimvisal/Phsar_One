import { ThemedText } from "@src/components/shared_components/ThemedText";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

export default function ChatOptionsSheet({
  visible,
  onClose,
  onMute,
  onBlock,
  themeColors,
  isMuted,
}: any) {
  const { t } = useTranslation();

  const handleMutePress = async () => {
    try {
      if (onMute) await onMute();
    } catch (e) {
      // swallow - parent will handle errors
    } finally {
      if (onClose) onClose();
    }
  };

  const handleBlockPress = async () => {
    try {
      if (onBlock) await onBlock();
    } catch (e) {
      // swallow - parent will handle errors
    } finally {
      if (onClose) onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
        onPress={onClose}
      >
        <View
          style={{
            marginTop: "auto",
            backgroundColor: themeColors.card,
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TouchableOpacity onPress={handleMutePress}>
            <ThemedText style={{ paddingVertical: 12 }}>
              {isMuted
                ? t("chat.unmute_notifications")
                : t("chat.mute_notifications")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBlockPress}>
            <ThemedText style={{ paddingVertical: 12, color: "#EF4444" }}>
              {t("chat.block")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <ThemedText style={{ paddingVertical: 12 }}>
              {t("common.cancel")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
