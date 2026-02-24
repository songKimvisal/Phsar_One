import { PaperPlaneRight } from "phosphor-react-native";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export default function ChatInputBar({
  value,
  onChange,
  onSend,
  themeColors,
}: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: themeColors.border,
        backgroundColor: themeColors.card,
        alignItems: "center",
        gap: 10,
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Type a message..."
        style={{
          flex: 1,
          backgroundColor: themeColors.background,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 20,
          color: themeColors.text,
        }}
      />
      <TouchableOpacity onPress={onSend}>
        <PaperPlaneRight size={22} color={themeColors.primary} />
      </TouchableOpacity>
    </View>
  );
}
