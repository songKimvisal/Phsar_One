import { ThemedText } from "@src/components/ThemedText";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
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
  HeadsetIcon,
  NotePencilIcon,
  PresentationChartIcon,
  StorefrontIcon,
  TagIcon,
  TagSimpleIcon,
  UserCircleIcon
} from "phosphor-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 1. Header with Upgrade and Settings */}
        <View style={styles.topActions}>
          <TouchableOpacity
            style={[styles.upgradeBtn, { backgroundColor: Colors.reds[500] }]}
          >
            <ThemedText style={styles.upgradeText}>
              {t("user_actions.upgrade")} ✨
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <BellSimpleIcon size={28} color={themeColors.text} style={styles.iconBtn} />
            <TouchableOpacity onPress={() => router.push('/settings')}>
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
              <ClockCounterClockwiseIcon color={Colors.reds[500]} weight="fill" />
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
            icon={<ClockCounterClockwiseIcon size={26} color={themeColors.text} />}
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
function GridItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.gridItem}>
      {icon}
      <ThemedText style={styles.gridLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
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
    fontWeight: "bold",
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
