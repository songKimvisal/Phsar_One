import { useAuth } from "@clerk/clerk-expo";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { Stack, useRouter } from "expo-router";
import {
  BellIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CreditCardIcon,
  GearSixIcon,
  HeadphonesIcon,
  InfoIcon,
  LockIcon,
  MapPinIcon,
  UserCircleIcon,
} from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  onPress?: () => void;
  showSeparator?: boolean;
}

const SettingItem = ({
  icon: Icon,
  label,
  onPress,
  showSeparator = true,
}: SettingItemProps) => {
  const themeColors = useThemeColor();
  return (
    <View>
      <TouchableOpacity
        style={styles.item}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.itemLeft}>
          <Icon size={24} color={themeColors.text} weight="regular" />
          <ThemedText style={styles.itemLabel}>{label}</ThemedText>
        </View>
        <CaretRightIcon size={20} color={themeColors.text} />
      </TouchableOpacity>
      {showSeparator && (
        <View
          style={[
            styles.separator,
            { backgroundColor: themeColors.text + "10" },
          ]}
        />
      )}
    </View>
  );
};

export default function SettingsScreen() {
  const themeColors = useThemeColor();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error: any) {
      console.error("Sign out error:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header with White Status Bar */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#FFF" }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Settings</ThemedText>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Group 1 */}
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <SettingItem icon={MapPinIcon} label="My addresses" />
          <SettingItem icon={UserCircleIcon} label="Account and security" />
          <SettingItem
            icon={CreditCardIcon}
            label="Payment settings"
            showSeparator={false}
          />
        </View>

        {/* Group 2 */}
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <SettingItem icon={GearSixIcon} label="General" />
          <SettingItem icon={BellIcon} label="Notifications" />
          <SettingItem icon={LockIcon} label="Privacy" showSeparator={false} />
        </View>

        {/* Group 3 */}
        <View style={[styles.card, { backgroundColor: themeColors.card }]}>
          <SettingItem icon={HeadphonesIcon} label="Help and feedback" />
          <SettingItem
            icon={InfoIcon}
            label="About PhsarOne"
            showSeparator={false}
          />
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={[
            styles.signOutButton,
            { backgroundColor: themeColors.primary },
          ]}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[styles.signOutText, { color: themeColors.background }]}
          >
            Sign out
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#FFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  backButton: {
    padding: 8,
  },
  card: {
    borderRadius: 16,
    borderCurve: "continuous",
    overflow: "hidden",
    elevation: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingVertical: 18,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
    marginLeft: 52, // Aligns with text start
  },
  signOutButton: {
    borderRadius: 99,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "400",
  },
});
