import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { Stack, useRouter } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Focus input on mount after transition completes to prevent keyboard glitching
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      Keyboard.dismiss();
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View
        style={[styles.header, { backgroundColor: themeColors.background }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: themeColors.card,
              borderColor: themeColors.text + "15",
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: themeColors.text }]}
            placeholder="macbook"
            placeholderTextColor={themeColors.text + "50"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            onPress={handleSearch}
            style={styles.searchTextButton}
          >
            <ThemedText style={styles.searchText}>Search</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search results placeholder */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  searchTextButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchText: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.6,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
});
