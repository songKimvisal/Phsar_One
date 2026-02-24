import { ThemedText } from "@src/components/shared_components/ThemedText";
import { MapPin } from "phosphor-react-native";
import React from "react";
import { Linking, Platform, TouchableOpacity, View } from "react-native";

interface Props {
  latitude: number;
  longitude: number;
  label?: string;
  isMe: boolean;
  themeColors: any;
  onDelete?: () => void;
}

export default function LocationMessage({
  latitude,
  longitude,
  label,
  isMe,
  themeColors,
  onDelete,
}: Props) {
  const openMap = () => {
    const url = Platform.select({
      ios: `maps:?q=${label || "Location"}&ll=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${label || "Location"}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={openMap}
      onLongPress={onDelete}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 14,
        backgroundColor: isMe
          ? "rgba(255,255,255,0.15)"
          : themeColors.background,
        borderWidth: 1,
        borderColor: themeColors.border + "40",
        maxWidth: 240,
        gap: 10,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: themeColors.primary + "20",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MapPin size={18} color={themeColors.primary} weight="fill" />
      </View>

      <View style={{ flex: 1 }}>
        <ThemedText numberOfLines={2} style={{ fontWeight: "600" }}>
          {label || "Shared location"}
        </ThemedText>

        <ThemedText style={{ fontSize: 11, opacity: 0.6 }}>
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </ThemedText>

        <ThemedText
          style={{ fontSize: 11, marginTop: 4, color: themeColors.primary }}
        >
          Tap to open map
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
