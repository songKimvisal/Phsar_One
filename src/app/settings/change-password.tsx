import ActionStatusModal from "@src/components/shared_components/ActionStatusModal";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { useUser } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { CaretLeftIcon, EyeIcon, EyeSlashIcon } from "phosphor-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
  const themeColors = useThemeColor();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successVisible, setSuccessVisible] = useState(false);

  const onChangePasswordPress = async () => {
    if (!isLoaded || !user) return;

    if (!currentPassword.trim()) {
      setErrorMessage("Current password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      await (user as any).updatePassword({
        currentPassword,
        newPassword,
      });
      setSuccessVisible(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const rawMessage = err?.errors?.[0]?.message || err?.message || "";
      const message =
        rawMessage ||
        "We couldn't update your password right now. Please try again.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: themeColors.background }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ActionStatusModal
        visible={successVisible}
        hideHeaderTone
        title="Password updated"
        description="Your password has been changed successfully."
        actionLabel="Continue"
        onClose={() => {
          setSuccessVisible(false);
          router.back();
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Change password</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <ThemedText style={styles.title}>Change password</ThemedText>
          <ThemedText style={[styles.subtitle, { color: themeColors.text }]}>
            Set a new password for your account.
          </ThemedText>

          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Current password"
              placeholderTextColor={themeColors.tabIconDefault}
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={(value) => {
                setCurrentPassword(value);
                setErrorMessage("");
              }}
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword((value) => !value)}
            >
              {showCurrentPassword ? (
                <EyeSlashIcon size={20} color={themeColors.tabIconDefault} />
              ) : (
                <EyeIcon size={20} color={themeColors.tabIconDefault} />
              )}
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="New password"
              placeholderTextColor={themeColors.tabIconDefault}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={(value) => {
                setNewPassword(value);
                setErrorMessage("");
              }}
            />
            <TouchableOpacity onPress={() => setShowNewPassword((value) => !value)}>
              {showNewPassword ? (
                <EyeSlashIcon size={20} color={themeColors.tabIconDefault} />
              ) : (
                <EyeIcon size={20} color={themeColors.tabIconDefault} />
              )}
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: themeColors.card,
                borderColor: themeColors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              placeholder="Confirm new password"
              placeholderTextColor={themeColors.tabIconDefault}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setErrorMessage("");
              }}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((value) => !value)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon size={20} color={themeColors.tabIconDefault} />
              ) : (
                <EyeIcon size={20} color={themeColors.tabIconDefault} />
              )}
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <View
              style={[
                styles.errorCard,
                {
                  backgroundColor: `${themeColors.primary}12`,
                  borderColor: `${themeColors.primary}35`,
                },
              ]}
            >
              <ThemedText
                style={[styles.errorText, { color: themeColors.primary }]}
              >
                {errorMessage}
              </ThemedText>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: themeColors.primary },
              isLoading && { opacity: 0.7 },
            ]}
            onPress={onChangePasswordPress}
            disabled={isLoading}
          >
            <ThemedText style={styles.primaryButtonText}>
              {isLoading ? "Please wait..." : "Update password"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.72,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    minHeight: 58,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
