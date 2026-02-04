import PricingCard, {
  PricingPlan,
} from "@src/components/subscription/PricingCard";
import { ThemedText } from "@src/components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "4.99",
    features: [
      { text: "Up to 15 active ads" },
      { text: "Ads active for 30 days" },
      { text: "Trade & swap enabled" },
      { text: "View count & chat count" },
      { text: "1 free weekly boost" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "14.99",
    features: [
      { text: "Up to 50 active ads" },
      { text: "Ads active for 60 days" },
      { text: "Top search priority" },
      { text: "Seller profile with rating & reviews" },
      { text: "5 boosts / month" },
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "29.99",
    features: [
      { text: "Unlimited ads" },
      { text: "Ads active for 120 days" },
      { text: "Verified business badge" },
      { text: "Advanced analytics" },
      { text: "Unlimited boosts" },
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const [selectedPlanId, setSelectedPlanId] = useState("starter");

  const handleContinue = () => {
    // TODO: Implement Clerk checkout flow
    console.log("Continue with plan:", selectedPlanId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <CaretLeftIcon size={24} color={themeColors.text} weight="regular" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Subscriptions</ThemedText>
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
