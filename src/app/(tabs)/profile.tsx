import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@src/components/ThemedText";
import { Colors } from "@src/constants/Colors";
import { useTheme } from "@src/context/ThemeContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  BellSimpleIcon,
  BookmarkSimpleIcon,
  CardholderIcon,
  CaretRightIcon,
  ChartBarIcon,
  ChartPieSliceIcon,
  CheckCircleIcon,
  ClockCounterClockwiseIcon,
  GearSixIcon,
  GlobeSimpleIcon,
  HeadsetIcon,
  MoonIcon,
  NotePencilIcon,
  PresentationChartIcon,
  SparkleIcon,
  StorefrontIcon,
  SunIcon,
  TagIcon,
  TagSimpleIcon,
  UserCircleIcon,
} from "phosphor-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { i18n, t } = useTranslation();
  const { theme, setMode } = useTheme();
  const themeColors = useThemeColor();
  const toggleLanguage = async () => {
    const nextLanguage = i18n.language === "kh" ? "en" : "kh";
    await i18n.changeLanguage(nextLanguage);
    await AsyncStorage.setItem("user-language", nextLanguage);
  };
  const router = useRouter();
  const toggleTheme = () => {
    setMode(theme === "light" ? "dark" : "light");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topActions}>
          {/* Subscription button */}
          <TouchableOpacity
            onPress={() => router.push("/subscription")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#E73121", "#8B1D14"]} // reds[500] → reds[700]
              start={{ x: 0, y: 0 }} // top
              end={{ x: 0, y: 1 }} // bottom
              style={styles.upgradeBtn}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ThemedText style={styles.upgradeText}>
                  {t("user_actions.upgrade")}
                </ThemedText>
                <SparkleIcon
                  size={16}
                  weight="fill"
                  color="#FFD230"
                  style={{ marginLeft: 4 }}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.rightIcons}>
            {/* Light/Dark mode */}
            <TouchableOpacity onPress={toggleTheme}>
              {theme == "light" ? (
                <MoonIcon size={24} weight="regular" color={themeColors.text} />
              ) : (
                <SunIcon size={24} weight="regular" color={themeColors.text} />
              )}
            </TouchableOpacity>

            {/* Switch Language */}
            <TouchableOpacity
              style={styles.languageIcon}
              onPress={toggleLanguage}
            >
              {theme == "light" ? (
                <GlobeSimpleIcon
                  size={24}
                  weight="regular"
                  color={themeColors.text}
                />
              ) : (
                <GlobeSimpleIcon
                  size={24}
                  weight="regular"
                  color={themeColors.text}
                />
              )}
              <ThemedText style={styles.languageTitle}>
                {t("navigation.toggle_language")}
              </ThemedText>
            </TouchableOpacity>

            {/* Notification */}
            <BellSimpleIcon
              size={28}
              color={themeColors.text}
              style={styles.iconBtn}
            />

            {/* Settings */}
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <GearSixIcon
                size={28}
                color={themeColors.text}
                style={[{ marginLeft: 15 }, styles.iconBtn]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. User Info */}
        <View style={styles.userInfo}>
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: themeColors.card },
            ]}
          >
            <UserCircleIcon size={60} color={themeColors.text} weight="fill" />
          </View>
          <View style={styles.userTextContainer}>
            <ThemedText style={styles.userName}>John Doe</ThemedText>
            <ThemedText style={styles.userType}>
              {t("user_actions.regular_account")}
            </ThemedText>
          </View>
        </View>

        {/* 3. My Listings */}
        <ProfileSection
          title={t("user_actions.myLists")}
          viewAllLabel={t("user_actions.viewAll")}
        >
          <GridItem
            icon={<TagIcon color={Colors.reds[500]} weight="fill" />}
            label={t("user_actions.active")}
          />
          <GridItem
            icon={<CheckCircleIcon color={Colors.reds[500]} weight="fill" />}
            label={t("user_actions.sold")}
          />
          <GridItem
            icon={<NotePencilIcon color={Colors.reds[500]} weight="fill" />}
            label={t("user_actions.drafts")}
          />
          <GridItem
            icon={
              <ClockCounterClockwiseIcon
                color={Colors.reds[500]}
                weight="fill"
              />
            }
            label={t("user_actions.expired")}
          />
        </ProfileSection>

        {/* 4. Dashboard */}
        <ProfileSection
          title={t("user_actions.dashboard")}
          viewAllLabel={t("user_actions.viewAll")}
        >
          <GridItem
            icon={<ChartPieSliceIcon size={28} color={themeColors.text} />}
            label={t("user_actions.overview")}
          />
          <GridItem
            icon={<ChartBarIcon size={28} color={themeColors.text} />}
            label={t("user_actions.insight")}
          />
          <GridItem
            icon={<TagSimpleIcon size={28} color={themeColors.text} />}
            label={t("user_actions.myTrade")}
          />
          <GridItem
            icon={<PresentationChartIcon size={28} color={themeColors.text} />}
            label={t("user_actions.performance")}
          />
        </ProfileSection>

        {/* 5. Footer Grid */}
        <View style={styles.footerGrid}>
          <GridItem
            icon={
              <ClockCounterClockwiseIcon size={26} color={themeColors.text} />
            }
            label={t("user_actions.history")}
          />
          <GridItem
            icon={<StorefrontIcon size={26} color={themeColors.text} />}
            label={t("user_actions.following")}
          />
          <GridItem
            icon={<BookmarkSimpleIcon size={26} color={themeColors.text} />}
            label={t("user_actions.bookMark")}
          />
          <GridItem
            icon={<CardholderIcon size={26} color={themeColors.text} />}
            label={t("user_actions.billing")}
          />
          <GridItem
            icon={<HeadsetIcon size={26} color={themeColors.text} />}
            label={t("user_actions.helpCenter")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable Section Component
function ProfileSection({
  title,
  children,
  viewAllLabel,
}: {
  title: string;
  children: React.ReactNode;
  viewAllLabel: string;
}) {
  const themeColors = useThemeColor();
  return (
    <View
      style={[
        styles.section,
        { borderBottomWidth: 1, borderBottomColor: themeColors.border },
      ]}
    >
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <TouchableOpacity style={styles.viewAll}>
          <ThemedText style={styles.viewAllText}>{viewAllLabel}</ThemedText>
          <CaretRightIcon size={14} color="#888" />
        </TouchableOpacity>
      </View>
      <View style={styles.gridRow}>{children}</View>
    </View>
  );
}

// Reusable Grid Item
function GridItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <TouchableOpacity style={styles.gridItem}>
      {icon}
      <ThemedText style={styles.gridLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  languageIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginLeft: 8,
    paddingVertical: 4,
  },
  languageTitle: {
    marginLeft: 5,
    fontWeight: "regular",
    fontSize: 12,
  },
  topActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  upgradeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  upgradeText: {
    color: "#FFF",
    fontWeight: "500",
    fontSize: 14,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 4, // Matches the touch area of your home icons
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  userTextContainer: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  userType: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 12,
    color: "#888",
    marginRight: 4,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  gridItem: {
    alignItems: "center",
    flex: 1,
  },
  gridLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  footerGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
});
