import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useConversations, Conversation } from '@src/hooks/useChat';
import useThemeColor from '@src/hooks/useThemeColor';
import { ThemedText } from '@src/components/shared_components/ThemedText';
import { Colors } from '@src/constants/Colors';
import { formatDistanceToNow } from 'date-fns';

export default function ChatScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const { userId } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'regular' | 'trade'>('regular');

  const { conversations, loading, error, refresh } = useConversations(activeTab);

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    // Determine the other participant in the chat
    const otherParticipant = userId === item.buyer_id ? item.seller : item.buyer;
    const isUnread = !!(item.unread_count && item.unread_count > 0);
    const lastMessage = item.last_message_content?.text || t("chat.start_conversation");
    const timeAgo = item.last_message_at 
      ? formatDistanceToNow(new Date(item.last_message_at), { addSuffix: true }) 
      : '';

    return (
      <TouchableOpacity
        style={[styles.conversationItem, { borderBottomColor: themeColors.border }]}
        onPress={() => {
          if (activeTab === 'regular') {
            router.push({
              pathname: "/chat/normal/[id]" as any,
              params: {
                id: item.product_id as string,
                sellerId: item.seller_id,
                sellerName: `${item.seller?.first_name || ''} ${item.seller?.last_name || ''}`,
                sellerAvatar: item.seller?.avatar_url,
                productTitle: item.product?.title,
                productThumbnail: item.product?.images?.[0],
                conversationId: item.id,
              }
            });
          } else {
            router.push({
              pathname: "/chat/trade/[id]" as any,
              params: {
                id: item.id,
                sellerId: item.seller_id,
                sellerName: `${item.seller?.first_name || ''} ${item.seller?.last_name || ''}`,
                sellerAvatar: item.seller?.avatar_url,
                conversationId: item.id,
              }
            });
          }
        }}
      >
        <Image
          source={{ uri: otherParticipant?.avatar_url || "https://via.placeholder.com/150" }}
          style={styles.avatar}
        />
        <View style={styles.content}>
          <View style={styles.row}>
            <ThemedText style={styles.name} numberOfLines={1}>
              {otherParticipant?.first_name} {otherParticipant?.last_name}
            </ThemedText>
            <ThemedText style={styles.time} numberOfLines={1}>
              {timeAgo}
            </ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText 
              style={[styles.lastMessage, isUnread && { fontWeight: '600', color: themeColors.text }]} 
              numberOfLines={1}
            >
              {lastMessage}
            </ThemedText>
            {isUnread && (
              <View style={[styles.unreadBadge, { backgroundColor: themeColors.tint }]}>
                <ThemedText style={styles.unreadText}>{item.unread_count}</ThemedText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>
          {t("chat.messages")} ({conversations.length})
        </ThemedText>
      </View>

      {/* Custom Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: themeColors.card }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'regular' && { backgroundColor: themeColors.tint }]}
          onPress={() => setActiveTab('regular')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'regular' && { color: 'white' }]}>
            {t("chat.regular")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'trade' && { backgroundColor: themeColors.tint }]}
          onPress={() => setActiveTab('trade')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'trade' && { color: 'white' }]}>
            {t("chat.trade")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {loading && !conversations.length ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={themeColors.tint} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} colors={[themeColors.tint]} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <ThemedText>{t("chat.no_conversations")}</ThemedText>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  time: {
    fontSize: 12,
    opacity: 0.5,
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.6,
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
});

