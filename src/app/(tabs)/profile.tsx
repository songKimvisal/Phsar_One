import DynamicPhosphorIcon from "@/src/components/shared_components/DynamicPhosphorIcon";
import { useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { Colors } from "@src/constants/Colors";
import { useTheme } from "@src/context/ThemeContext";
import useThemeColor from "@src/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
    BookmarkSimpleIcon,
    CardholderIcon,
    CaretRightIcon,
    ChartBarIcon,
    ChartPieSliceIcon,
    CheckFatIcon,
    ClockCountdownIcon,
    ClockCounterClockwiseIcon,
    GearSixIcon,
    HeadsetIcon,
    MoonIcon,
    PencilSimpleLineIcon,
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
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user } = useUser();
  const { i18n, t } = useTranslation();
  const { theme, setMode } = useTheme();
  const themeColors = useThemeColor();

  const fullName = user?.fullName || user?.firstName || "User";
  const userImageUrl = user?.imageUrl;

  const router = useRouter();
  const toggleTheme = () => {
    setMode(theme === "light" ? "dark" : "light");
  };

  const toggleLanguage = async () => {
    const nextLanguage = i18n.language === "kh" ? "en" : "kh";
    await i18n.changeLanguage(nextLanguage);
    await AsyncStorage.setItem("user-language", nextLanguage);
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
              colors={["#E73121", "#8B1D14"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
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
            <TouchableOpacity
              style={styles.languageIcon}
              onPress={toggleLanguage}
            >
              <DynamicPhosphorIcon
                name="GlobeSimple"
                size={24}
                weight="regular"
                color={themeColors.text}
              />
              <ThemedText style={styles.languageTitle}>
                {t("navigation.toggle_language")}
              </ThemedText>
            </TouchableOpacity>

            {/* Light/Dark mode */}
            <TouchableOpacity onPress={toggleTheme}>
              {theme == "light" ? (
                <MoonIcon size={24} weight="regular" color={themeColors.text} />
              ) : (
                <SunIcon size={24} weight="regular" color={themeColors.text} />
              )}
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <GearSixIcon size={28} color={themeColors.text} />
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
            {userImageUrl ? (
              <Image
                source={{ uri: userImageUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <UserCircleIcon
                size={60}
                color={themeColors.text}
                weight="fill"
              />
            )}
          </View>
          <View style={styles.userTextContainer}>
            <ThemedText style={styles.userName}>{fullName}</ThemedText>
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
            icon={<CheckFatIcon color={Colors.reds[500]} weight="fill" />}
            label={t("user_actions.sold")}
          />
          <GridItem
            icon={
              <PencilSimpleLineIcon color={Colors.reds[500]} weight="fill" />
            }
            label={t("user_actions.drafts")}
          />
          <GridItem
            icon={<ClockCountdownIcon color={Colors.reds[500]} weight="fill" />}
            label={t("user_actions.expired")}
          />
        </ProfileSection>

        {/* 4. Dashboard */}
        <ProfileSection
          title={t("user_actions.dashboard")}
          viewAllLabel={t("user_actions.viewAll")}
        >
          <GridItem
            icon={<ChartPieSliceIcon size={24} color={themeColors.text} />}
            label={t("user_actions.overview")}
          />
          <GridItem
            icon={<ChartBarIcon size={24} color={themeColors.text} />}
            label={t("user_actions.insight")}
          />
          <GridItem
            icon={<TagSimpleIcon size={24} color={themeColors.text} />}
            label={t("user_actions.myTrade")}
          />
          <GridItem
            icon={<PresentationChartIcon size={24} color={themeColors.text} />}
            label={t("user_actions.performance")}
          />
        </ProfileSection>

        {/* 5. Footer Grid */}
        <View
          style={[styles.footerGrid, { backgroundColor: themeColors.card }]}
        >
          <GridItem
            icon={<StorefrontIcon size={24} color={themeColors.text} />}
            label={t("user_actions.following")}
          />
          <GridItem
            icon={
              <ClockCounterClockwiseIcon size={24} color={themeColors.text} />
            }
            label={t("user_actions.history")}
          />
          <GridItem
            icon={<BookmarkSimpleIcon size={24} color={themeColors.text} />}
            label={t("user_actions.bookMark")}
          />
          <GridItem
            icon={<CardholderIcon size={24} color={themeColors.text} />}
            label={t("user_actions.billing")}
          />
          <GridItem
            icon={<HeadsetIcon size={24} color={themeColors.text} />}
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
    <View style={[styles.section, { backgroundColor: themeColors.card }]}>
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
    gap: 12,
    alignItems: "center",
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
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
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
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderCurve: "continuous",
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
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
    marginHorizontal: 16,
    borderRadius: 16,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
});
