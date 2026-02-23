import { ThemedText } from "@src/components/shared_components/ThemedText";
import { ThemedTextInput } from "@src/components/shared_components/ThemedTextInput";
import useThemeColor from "@src/hooks/useThemeColor";
import { Stack, useRouter } from "expo-router";
import { CaretLeftIcon, PlusCircleIcon } from "phosphor-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewTicketScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={[styles.header, { backgroundColor: themeColors.background }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>New ticket</ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Subject</ThemedText>
            <ThemedTextInput
              style={[
                styles.input,
                {
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  borderWidth: 1,
                },
              ]}
              value={subject}
              onChangeText={setSubject}
              placeholder=""
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <ThemedTextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border,
                  borderWidth: 1,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              placeholder=""
            />
          </View>

          <TouchableOpacity
            style={[
              styles.filePicker,
              {
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
                borderWidth: 1,
                borderStyle: "dashed",
              },
            ]}
          >
            <PlusCircleIcon
              size={24}
              color={themeColors.text}
              weight="regular"
            />
            <ThemedText style={styles.filePickerText}>
              Choose file(s)
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: themeColors.primary }]}
            onPress={() => {}}
          >
            <ThemedText
              style={[
                styles.sendBtnText,
                { color: themeColors.primaryButtonText },
              ]}
            >
              Send
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  backBtn: {
    padding: 8,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    borderWidth: 0,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  filePicker: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    borderCurve: "continuous",
    gap: 12,
  },
  filePickerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  sendBtn: {
    paddingVertical: 12,
    borderRadius: 99,
    alignItems: "center",
  },
  sendBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
