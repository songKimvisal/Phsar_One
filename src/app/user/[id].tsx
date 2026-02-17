import { useAuth } from "@clerk/clerk-expo";
import ProductCard from "@src/components/category_components/ProductCard";
import { ThemedText } from "@src/components/shared_components/ThemedText";
import { Colors } from "@src/constants/Colors";
import useThemeColor from "@src/hooks/useThemeColor";
import { supabase } from "@src/lib/supabase";
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
} from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
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
  const { userId: currentUserId } = useAuth();
  const router = useRouter();
  const themeColors = useThemeColor();
  const { t } = useTranslation();

  const isOwnProfile = id === currentUserId;

  const [userData, setUserData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
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
          <ThemedText style={styles.userType}>Regular account</ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.roundBtn, { backgroundColor: themeColors.card }]}
        >
          <SquaresFourIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
      </View>

      <View style={styles.bioRow}>
        <ThemedText style={styles.bioText}>
          {userData?.bio || "No bio yet."}
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
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Followings</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: Colors.reds[500] }]}
          onPress={() =>
            isOwnProfile
              ? router.push("/user/edit" as Href)
              : console.log("Message user")
          }
        >
          <ThemedText style={styles.actionBtnText}>
            {isOwnProfile ? "Edit profile" : "Message"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Recent post</ThemedText>
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

    // Horizontal List Item
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
        <ActivityIndicator size="large" color={Colors.reds[500]} />
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
          <CaretLeftIcon size={28} color={themeColors.text} weight="bold" />
        </TouchableOpacity>
        <ThemedText style={styles.navTitle}>Profile</ThemedText>
        <TouchableOpacity style={styles.backBtn}>
          <DotsThreeIcon size={28} color={themeColors.text} weight="bold" />
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
            <ThemedText>No recent posts found.</ThemedText>
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
    gap: 20,
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
