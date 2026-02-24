import { ThemedText } from "@src/components/shared_components/ThemedText";
import { useRouter } from "expo-router";
import { ArrowLeftIcon, DotsThreeVerticalIcon } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function ChatHeader({
  name,
  isOnline,
  themeColors,
  onOptionsPress,
}: any) {
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: themeColors.border,
        backgroundColor: themeColors.card,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={22} color={themeColors.text} />
        </TouchableOpacity>
        <View>
          <ThemedText style={{ fontWeight: "600" }}>{name}</ThemedText>
          {isOnline && (
            <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>
              Online
            </ThemedText>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={onOptionsPress}>
        <DotsThreeVerticalIcon
          size={22}
          color={themeColors.text}
          weight="bold"
        />
      </TouchableOpacity>
    </View>
  );
}
