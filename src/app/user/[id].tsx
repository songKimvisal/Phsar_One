import { useAuth } from "@clerk/clerk-expo";
import ProductCard from "@src/components/category_components/ProductCard";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { createClerkSupabaseClient, supabase } from "@src/lib/supabase";
import {
  Href,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  CaretLeftIcon,
  DotsThreeIcon,
  PencilSimpleIcon,
  RowsIcon,
  SquaresFourIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId: currentUserId, getToken } = useAuth();
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  const isOwnProfile = id === currentUserId;

  const [userData, setUserData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Follow State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [togglingFollow, setTogglingFollow] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
      checkFollowStatus();
      fetchFollowCounts();
    }, [id]),
  );

  const fetchProfileData = async () => {
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (userError) throw userError;
      setUserData(user);

      const { data: userProducts, error: prodError } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (prodError) throw prodError;
      setProducts(userProducts || []);
    } catch (error) {
      console.error("Error fetching public profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!currentUserId || isOwnProfile) return;
    try {
      const { data } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", currentUserId)
        .eq("following_id", id)
        .single();

      setIsFollowing(!!data);
    } catch (error) {
      setIsFollowing(false);
    }
  };

  const fetchFollowCounts = async () => {
    try {
      const { count: followers } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", id);

      const { count: following } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", id);

      setFollowerCount(followers || 0);
      setFollowingCount(following || 0);
    } catch (error) {
      console.error("Error fetching follow counts:", error);
    }
  };

  const toggleFollow = async () => {
    if (!currentUserId) {
      Alert.alert("Sign In", "Please sign in to follow users.");
      return;
    }
    if (togglingFollow) return;

    try {
      setTogglingFollow(true);
      const token = await getToken();
      const authSupabase = createClerkSupabaseClient(token);

      if (isFollowing) {
        const { error } = await authSupabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", id);
        if (error) throw error;
        setIsFollowing(false);
        setFollowerCount((prev) => prev - 1);
      } else {
        const { error } = await authSupabase
          .from("follows")
          .insert({ follower_id: currentUserId, following_id: id });
        if (error) throw error;
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setTogglingFollow(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.userBasicRow}>
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: themeColors.card },
          ]}
        >
          {userData?.avatar_url ? (
            <Image
              source={{ uri: userData.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <ThemedText style={styles.avatarInitial}>
                {userData?.first_name?.[0]?.toUpperCase() || "?"}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.userInfoText}>
          <ThemedText style={styles.userName}>
            {userData?.first_name} {userData?.last_name}
          </ThemedText>
          <ThemedText style={styles.userType}>{t("user_actions.regular_account")}</ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.roundBtn, { backgroundColor: themeColors.card }]}
        >
          <SquaresFourIcon
            size={24}
            color={themeColors.text}
            weight="regular"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bioRow}>
        <ThemedText style={styles.bioText}>
          {userData?.bio || t("public_profile.no_bio")}
        </ThemedText>
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.editBioBtn}
            onPress={() => router.push("/user/edit" as Href)}
          >
            <PencilSimpleIcon size={16} color={themeColors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsActionRow}>
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() =>
              router.push({
                pathname: "/user/following",
                params: { id, type: "followers" },
              } as any)
            }
          >
            <ThemedText style={styles.statNumber}>{followerCount}</ThemedText>
            <ThemedText style={styles.statLabel}>{t("public_profile.followers")}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() =>
              router.push({
                pathname: "/user/following",
                params: { id, type: "following" },
              } as any)
            }
          >
            <ThemedText style={styles.statNumber}>{followingCount}</ThemedText>
            <ThemedText style={styles.statLabel}>{t("public_profile.followings")}</ThemedText>
          </TouchableOpacity>
        </View>

        {isOwnProfile ? (
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: themeColors.text + "20" }]}
            onPress={() => router.push("/user/edit" as Href)}
          >
            <ThemedText
              style={[styles.actionBtnText, { color: themeColors.text }]}
            >
              {t("public_profile.edit_profile")}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <View style={styles.otherUserActions}>
            <TouchableOpacity
              style={[
                styles.followBtn,
                { backgroundColor: isFollowing ? "#F3F4F6" : Colors.reds[500] },
              ]}
              onPress={toggleFollow}
              disabled={togglingFollow}
            >
              {isFollowing ? (
                <UserMinusIcon size={18} color="#374151" />
              ) : (
                <UserPlusIcon size={18} color="#FFF" />
              )}
              <ThemedText
                style={[
                  styles.followBtnText,
                  isFollowing && { color: "#374151" },
                ]}
              >
                {isFollowing ? t("public_profile.unfollow") : t("public_profile.follow")}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.messageBtn, { borderColor: Colors.reds[500] }]}
              onPress={() => console.log("Message user")}
            >
              <ThemedText
                style={[styles.messageBtnText, { color: Colors.reds[500] }]}
              >
                {t("public_profile.message")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>{t("public_profile.recent_post")}</ThemedText>
        <View style={styles.viewToggle}>
          <TouchableOpacity onPress={() => setViewMode("list")}>
            <RowsIcon
              size={24}
              color={themeColors.text}
              weight={viewMode === "list" ? "fill" : "regular"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewMode("grid")}>
            <SquaresFourIcon
              size={24}
              color={themeColors.text}
              weight={viewMode === "grid" ? "fill" : "regular"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderProductItem = ({ item }: { item: any }) => {
    const mappedProduct = {
      ...item,
      photos: item.images || [],
      createdAt: item.created_at,
      negotiable: item.is_negotiable,
      currency: item.metadata?.currency || "USD",
      address: {
        province: item.location_name,
        district: item.metadata?.district,
        commune: item.metadata?.commune,
      },
    };

    if (viewMode === "grid") {
      return (
        <View style={styles.gridItemWrapper}>
          <ProductCard
            product={mappedProduct as any}
            onPress={() => router.push(`/product/${item.id}` as Href)}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.listItem, { backgroundColor: themeColors.card }]}
        onPress={() => router.push(`/product/${item.id}` as Href)}
        activeOpacity={0.7}
      >
        <Image
          source={{
            uri: mappedProduct.photos[0] || "https://via.placeholder.com/150",
          }}
          style={styles.listImage}
        />
        <View style={styles.listInfo}>
          <View>
            <ThemedText style={styles.listTitle} numberOfLines={2}>
              {mappedProduct.title}
            </ThemedText>
            <ThemedText style={styles.listMetaText}>
              {mappedProduct.address.province} •{" "}
              {new Date(mappedProduct.createdAt).toLocaleDateString()}
            </ThemedText>
          </View>

          <ThemedText style={[styles.listPrice, { color: Colors.reds[500] }]}>
            {mappedProduct.currency === "USD" ? "$" : ""}
            {mappedProduct.price}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !userData) {
    return (
      <View
        style={[styles.center, { backgroundColor: themeColors.background }]}
      >
        <ActivityIndicator size="small" color={Colors.reds[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      edges={["top"]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
        <ThemedText style={styles.navTitle}>{t("public_profile.profile")}</ThemedText>
        <TouchableOpacity style={styles.backBtn}>
          <DotsThreeIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        numColumns={viewMode === "grid" ? 2 : 1}
        key={viewMode}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={viewMode === "grid" ? styles.gridRow : undefined}
        renderItem={renderProductItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ThemedText>{t("public_profile.no_posts")}</ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  backBtn: {
    padding: 8,
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  userBasicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: "700",
    opacity: 0.3,
  },
  userInfoText: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
  },
  userType: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 2,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  bioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  bioText: {
    fontSize: 16,
    opacity: 0.8,
  },
  editBioBtn: {
    padding: 4,
  },
  statsActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.5,
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 24,
    paddingVertical: 10,
    minWidth: 120,
    alignItems: "center",
  },
  actionBtnText: {
    color: Colors.reds[500],
    fontSize: 15,
    fontWeight: "600",
  },
  otherUserActions: {
    flexDirection: "row",
    gap: 6,
  },
  followBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  followBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  messageBtn: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  messageBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  viewToggle: {
    flexDirection: "row",
    gap: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
  gridRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  gridItemWrapper: {
    width: (width - 44) / 2,
    marginBottom: 12,
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
    padding: 40,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
