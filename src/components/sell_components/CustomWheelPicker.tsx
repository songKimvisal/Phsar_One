import useThemeColor from "@src/hooks/useThemeColor";
import React, { useEffect, useRef } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "../shared_components/ThemedText";

const ITEM_HEIGHT = 50;

interface WheelPickerProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  label: string;
}

export default function CustomWheelPicker({
  options,
  selectedValue,
  onValueChange,
  label,
}: WheelPickerProps) {
  const themeColors = useThemeColor();
  const flatListRef = useRef<FlatList>(null);

  const paddedOptions = ["", ...options, ""];

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const value = options[index];
    if (value && value !== selectedValue) {
      onValueChange(value);
    }
  };

  useEffect(() => {
    const index = options.indexOf(selectedValue);
    if (index !== -1) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: index * ITEM_HEIGHT,
          animated: true,
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedValue, options]);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <ThemedText style={{ color: themeColors.primary }}>*</ThemedText>
      </View>

      <View
        style={[
          styles.pickerWrapper,
          {
            backgroundColor: themeColors.background,
            borderColor: themeColors.border,
          },
        ]}
      >
        <View
          style={[
            styles.highlight,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.primary + "30",
            },
          ]}
          pointerEvents="none"
        />

        <FlatList
          ref={flatListRef}
          data={paddedOptions}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          nestedScrollEnabled={true}
          removeClippedSubviews={false}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={({ item }) => {
            const isSelected = item === selectedValue;
            return (
              <View style={[styles.item, { height: ITEM_HEIGHT }]}>
                <ThemedText
                  style={[
                    styles.itemText,
                    { color: themeColors.tabIconDefault },
                    isSelected && {
                      color: themeColors.primary,
                      fontWeight: "700",
                      fontSize: 18,
                    },
                  ]}
                >
                  {item}
                </ThemedText>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  pickerWrapper: {
    height: ITEM_HEIGHT * 3,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  highlight: {
    position: "absolute",
    top: ITEM_HEIGHT,
    left: 8,
    right: 8,
    height: ITEM_HEIGHT,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 1,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
