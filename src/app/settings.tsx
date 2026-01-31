import { useAuth } from "@clerk/clerk-expo";
import { ThemedText } from "@src/components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { X } from "phosphor-react-native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function SettingsScreen() {
  const themeColors = useThemeColor();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      console.log('Signing out...')
      await signOut()
      console.log('Signed out successfully')
      // Navigate to auth screen after signing out
      router.replace('/(auth)/sign-in')
    } catch (error: any) {
      console.error('Sign out error:', error)

      // Check if it's a rate limit error
      if (error?.clerkError && error?.status === 429) {
        const waitMinutes = error?.retryAfter ? Math.ceil(error.retryAfter / 60) : 'a few'
        alert(`Too many requests. Please wait ${waitMinutes} minute(s) before trying again.`)
      } else {
        alert('Failed to sign out. Please try again.')
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Settings</ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={28} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  signOutButton: {
    backgroundColor: '#E44336',
    padding: 12,
    borderRadius: 99,
    alignItems: 'center',
    marginTop: 2,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
