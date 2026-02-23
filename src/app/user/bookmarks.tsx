import { useAuth } from "@clerk/clerk-expo";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import useThemeColor from "@src/hooks/useThemeColor";
import { createClerkSupabaseClient } from "@src/lib/supabase";
import { Href, Stack, useFocusEffect, useRouter } from "expo-router";
import { BookmarkSimpleIcon, CaretLeftIcon } from "phosphor-react-native";
import React, { useCallback, useState } from "react";
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

export default function BookmarksScreen() {
  const { userId, getToken } = useAuth();
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t } = useTranslation();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchBookmarks();
      }
    }, [userId]),
  );

  const fetchBookmarks = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const token = await getToken();
      const authSupabase = createClerkSupabaseClient(token);

      const { data, error } = await authSupabase
        .from("favorites")
        .select(
          `
          id,
          product:products (
            *,
            seller:users (*)
          )
        `,
        )
        .eq("user_id", userId as string)
        .not("product_id", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const extractedProducts = data
        ?.map((item: any) => item.product)
        .filter((p: any) => p !== null);

      setBookmarks(extractedProducts || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProductItem = ({ item }: { item: any }) => {
    const mainImage = item.images?.[0] || "https://via.placeholder.com/150";

    return (
      <TouchableOpacity
        style={[styles.listItem, { backgroundColor: themeColors.card }]}
        onPress={() => router.push(`/product/${item.id}` as Href)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: mainImage }} style={styles.listImage} />
        <View style={styles.listInfo}>
          <View>
            <ThemedText style={styles.listTitle} numberOfLines={2}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.listMetaText}>
              {item.location_name} •{" "}
              {new Date(item.created_at).toLocaleDateString()}
            </ThemedText>
          </View>

          <ThemedText
            style={[styles.listPrice, { color: themeColors.primary }]}
          >
            {item.metadata?.currency === "KHR" ? "៛" : "$"}
            {item.price}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

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
          <CaretLeftIcon size={28} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>
          {t("bookmarks_screen.bookmarks")}
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
            data={bookmarks}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <BookmarkSimpleIcon
                  size={60}
                  color={themeColors.text}
                  weight="thin"
                />
                <ThemedText style={styles.emptyTitle}>
                  {t("bookmarks_screen.no_bookmarks")}
                </ThemedText>
                <ThemedText style={styles.emptySubtitle}>
                  {t("bookmarks_screen.no_bookmarks_subtitle")}
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
    paddingVertical: 16,
    paddingBottom: 40,
  },
  listItem: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    padding: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  listImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  listInfo: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  listPrice: {
    fontSize: 18,
    fontWeight: "700",
  },
  listMetaText: {
    fontSize: 13,
    opacity: 0.5,
  },
  emptyState: {
    paddingTop: 100,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    opacity: 0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.3,
    textAlign: "center",
    marginTop: 8,
  },
});
