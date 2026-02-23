import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { supabase } from "@src/lib/supabase";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { CaretLeftIcon, UsersIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FollowingScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [id, type]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data, error } = await (type === "followers"
        ? supabase
            .from("follows")
            .select("follower:users!follows_follower_id_fkey(*)")
            .eq("following_id", id)
        : supabase
            .from("follows")
            .select("following:users!follows_following_id_fkey(*)")
            .eq("follower_id", id));

      if (error) throw error;

      const extractedUsers = data.map((item: any) =>
        type === "followers" ? item.follower : item.following,
      );

      setUsers(extractedUsers || []);
    } catch (error) {
      console.error("Error fetching follows list:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.userCard, { backgroundColor: themeColors.card }]}
      onPress={() => router.push(`/user/${item.id}`)}
    >
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.avatar_url || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />
        <ThemedText style={styles.userName}>
          {item.first_name} {item.last_name}
        </ThemedText>
      </View>

      <View style={[styles.badge, { backgroundColor: themeColors.primary }]}>
        <ThemedText style={styles.badgeText}>{t("public_profile.following")}</ThemedText>
      </View>
    </TouchableOpacity>
  );

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
        <ThemedText style={styles.headerTitle}>
          {type === "followers" ? t("public_profile.followers") : t("public_profile.followings")}
        </ThemedText>
        <View style={{ width: 44 }} />
      </View>

      <View
        style={[styles.content, { backgroundColor: themeColors.background }]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={themeColors.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <UsersIcon size={60} color={themeColors.text} />
                <ThemedText style={styles.emptyTitle}>
                  {t("common.noProductsFound")}
                </ThemedText>
              </View>
            }
          />
        )}
      </View>
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
    flex: 1,
  },
  list: {
    padding: 8,
    gap: 12,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EEE",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyState: {
    paddingTop: 100,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    opacity: 0.3,
  },
});
