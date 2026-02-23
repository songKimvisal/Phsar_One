import { ThemedText } from "@src/components/shared_components/ThemedText";
import PricingCard, {
    PricingPlan,
} from "@src/components/subscription/PricingCard";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTranslation } from "react-i18next";

export default function SubscriptionPage() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const [selectedPlanId, setSelectedPlanId] = useState("starter");

  const PRICING_PLANS: PricingPlan[] = [
    {
      id: "starter",
      name: t("subscription_screen.starter"),
      price: "4.99",
      features: [
        { text: t("subscription_screen.features.up_to_15_ads") },
        { text: t("subscription_screen.features.ads_active_30_days") },
        { text: t("subscription_screen.features.trade_swap_enabled") },
        { text: t("subscription_screen.features.view_chat_count") },
        { text: t("subscription_screen.features.free_weekly_boost") },
      ],
    },
    {
      id: "pro",
      name: t("subscription_screen.pro"),
      price: "14.99",
      features: [
        { text: t("subscription_screen.features.up_to_50_ads") },
        { text: t("subscription_screen.features.ads_active_60_days") },
        { text: t("subscription_screen.features.top_priority") },
        { text: t("subscription_screen.features.seller_profile") },
        { text: t("subscription_screen.features.5_boosts") },
      ],
    },
    {
      id: "business",
      name: t("subscription_screen.business"),
      price: "29.99",
      features: [
        { text: t("subscription_screen.features.unlimited_ads") },
        { text: t("subscription_screen.features.ads_active_120_days") },
        { text: t("subscription_screen.features.verified_badge") },
        { text: t("subscription_screen.features.advanced_analytics") },
        { text: t("subscription_screen.features.unlimited_boosts") },
      ],
    },
  ];

  const handleContinue = () => {
    // TODO: Implement Clerk checkout flow
    console.log("Continue with plan:", selectedPlanId);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>{t("subscription_screen.subscriptions")}</ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Pricing Card */}
      <PricingCard
        plans={PRICING_PLANS}
        selectedPlanId={selectedPlanId}
        onSelectPlan={setSelectedPlanId}
        onContinue={handleContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
});
