import { ThemedText } from "@src/components/shared_components/ThemedText";
import { ThemedTextInput } from "@src/components/shared_components/ThemedTextInput";
import { Colors } from "@src/constants/Colors";
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View style={styles.header}>
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
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder=""
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <ThemedTextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              placeholder=""
            />
          </View>

          <TouchableOpacity style={styles.filePicker}>
            <PlusCircleIcon
              size={24}
              color={themeColors.text}
              weight="regular"
            />
            <ThemedText style={styles.filePickerText}>
              Choose file(s)
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendBtn} onPress={() => {}}>
            <ThemedText style={styles.sendBtnText}>Send</ThemedText>
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
    backgroundColor: "#FFF",
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
    color: "#111827",
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    borderWidth: 0,
    backgroundColor: "#E5E7EB80", // Light gray subtle background
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  filePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB80",
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
    backgroundColor: Colors.reds[500],
    paddingVertical: 12,
    borderRadius: 99,
    alignItems: "center",
  },
  sendBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
