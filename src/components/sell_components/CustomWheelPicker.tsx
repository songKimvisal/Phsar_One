import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { ThemedText } from '../shared_components/ThemedText';
import { Colors } from '@src/constants/Colors';

const ITEM_HEIGHT = 50; // Increased for better touch target

interface WheelPickerProps {
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  label: string;
}

export default function CustomWheelPicker({ options, selectedValue, onValueChange, label }: WheelPickerProps) {
  const flatListRef = useRef<FlatList>(null);
  
  // For a 3-item visible area, we need 1 empty item at start/end to center the real items
  const paddedOptions = ['', ...options, ''];

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
      // Small delay to ensure FlatList is ready
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
        <ThemedText style={{ color: Colors.reds[500] }}>*</ThemedText>
      </View>
      
      <View style={styles.pickerWrapper}>
        {/* Selection Highlight - pointerEvents none ensures it doesn't block scrolling */}
        <View style={styles.highlight} pointerEvents="none" />
        
        <FlatList
          ref={flatListRef}
          data={paddedOptions}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          nestedScrollEnabled={true} // Crucial for Android within another ScrollView
          removeClippedSubviews={false} // Fix for disappearing items in nested lists
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
                <ThemedText style={[
                  styles.itemText,
                  isSelected && styles.selectedItemText
                ]}>
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
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  pickerWrapper: {
    height: ITEM_HEIGHT * 3, // Exactly 3 items tall
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: ITEM_HEIGHT, // The middle item
    left: 8,
    right: 8,
    height: ITEM_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.reds[500] + '30',
    zIndex: 1, // Visual only, pointerEvents="none" handles touch
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  itemText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  selectedItemText: {
    color: Colors.reds[500],
    fontWeight: '700',
    fontSize: 18,
  },
});
