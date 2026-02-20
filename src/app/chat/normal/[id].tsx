import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import { useTranslation } from 'react-i18next';
import { ChatCircleIcon, BellSlashIcon, BellSimpleRingingIcon, XIcon, UserMinusIcon, TrashIcon } from 'phosphor-react-native';

import { useChat, Message, Conversation } from '@src/hooks/useChat';
import useThemeColor from '@src/hooks/useThemeColor';
import { ThemedText } from '@src/components/shared_components/ThemedText';
import { formatPrice } from '@src/types/productTypes';
import { Colors } from '@src/constants/Colors';

export default function NormalProductChatScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const themeColors = useThemeColor();
  const { userId } = useAuth();
  const { t } = useTranslation();

  const {
    id: productId, // Product ID
    sellerId,     // Seller ID
    sellerName,
    sellerAvatar,
    productTitle,
    productThumbnail,
    productPrice,
    productCurrency,
  } = params;

  const {
    conversation,
    messages,
    loading,
    error,
    sendMessage,
    markMessagesAsRead,
    toggleMuteConversation,
    blockUser,
    deleteConversation,
  } = useChat({ productId: productId as string, sellerId: sellerId as string });

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (conversation?.id && messages.length > 0) {
      markMessagesAsRead();
    }
  }, [conversation?.id, messages]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);


  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    if (!conversation) {
      Alert.alert(t("common.error"), t("chat.conversation_not_ready"));
      return;
    }

    try {
      await sendMessage({ type: 'text', text: inputText.trim() });
      setInputText('');
    } catch (err) {
      Alert.alert(t("common.error"), err.message || t("chat.failed_to_send_message"));
    }
  };

  const handleBlockUser = async () => {
    if (!sellerId) return;
    Alert.alert(
      t("chat.block_user_title"),
      t("chat.block_user_confirmation", { userName: sellerName }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("chat.block"),
          style: "destructive",
          onPress: async () => {
            try {
              await blockUser(sellerId as string);
              Alert.alert(t("common.success"), t("chat.user_blocked_successfully"));
              router.back(); // Go back after blocking
            } catch (err) {
              Alert.alert(t("common.error"), err.message || t("chat.failed_to_block_user"));
            }
          },
        },
      ],
    );
  };

  const handleDeleteConversation = async () => {
    Alert.alert(
      t("chat.delete_conversation_title"),
      t("chat.delete_conversation_confirmation"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteConversation();
              Alert.alert(t("common.success"), t("chat.conversation_deleted_successfully"));
              router.back(); // Go back after deleting
            } catch (err) {
              Alert.alert(t("common.error"), err.message || t("chat.failed_to_delete_conversation"));
            }
          },
        },
      ],
    );
  };


  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.tint} />
        <ThemedText style={{ marginTop: 10 }}>{t("chat.loading_conversation")}</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ThemedText style={{ color: themeColors.error }}>{error}</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <ThemedText style={{ color: themeColors.link }}>{t("common.go_back")}</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const isMuted = conversation?.is_muted || false;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen
        options={{
          headerShown: false, // Custom header handled below
        }}
      />

      {/* Custom Chat Header */}
      <View style={[styles.header, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <XIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Image
            source={{ uri: sellerAvatar as string || "https://via.placeholder.com/150" }}
            style={styles.sellerAvatar}
          />
          <View>
            <ThemedText style={styles.sellerName}>{sellerName}</ThemedText>
            <View style={styles.statusContainer}>
              <View style={[styles.onlineIndicator, { backgroundColor: Colors.greens[500] }]} />
              <ThemedText style={styles.onlineText}>{t("chat.online")}</ThemedText>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={toggleMuteConversation} style={styles.headerButton}>
          {isMuted ? (
            <BellSlashIcon size={24} color={themeColors.text} weight="bold" />
          ) : (
            <BellSimpleRingingIcon size={24} color={themeColors.text} weight="bold" />
          )}
        </TouchableOpacity>
      </View>

      {/* Product Summary */}
      <TouchableOpacity
        style={[styles.productSummary, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
        onPress={() => router.push(`/product/${productId}`)}
      >
        <Image source={{ uri: productThumbnail as string || "https://via.placeholder.com/50" }} style={styles.productThumbnail} />
        <View style={styles.productInfo}>
          <ThemedText style={styles.productTitle} numberOfLines={1}>{productTitle}</ThemedText>
          {productPrice && productCurrency && (
            <ThemedText style={styles.productPrice}>{formatPrice(productPrice as string, productCurrency as "USD" | "KHR")}</ThemedText>
          )}
        </View>
      </TouchableOpacity>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMyMessage = item.sender_id === userId;
          const messageContent = item.content as Message['content']; // Cast to access properties

          return (
            <View
              style={[
                styles.messageBubble,
                isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
                { backgroundColor: isMyMessage ? themeColors.tint : themeColors.card },
              ]}
            >
              <ThemedText style={{ color: isMyMessage ? 'white' : themeColors.text }}>
                {(messageContent as MessageContent).text}
              </ThemedText>
              <Text style={[styles.messageTime, { color: isMyMessage ? 'rgba(255,255,255,0.7)' : themeColors.text + '70' }]}>
                {new Date(item.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.messagesList}
      />

      {/* Message Input and Actions */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={[styles.inputContainer, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
          <TextInput
            style={[styles.textInput, { backgroundColor: themeColors.background, color: themeColors.text }]}
            placeholder={t("chat.type_a_message")}
            placeholderTextColor={themeColors.text + '50'}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity onPress={handleSendMessage} style={[styles.sendButton, { backgroundColor: themeColors.tint }]}>
            <ThemedText style={styles.sendButtonText}>{t("chat.send")}</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={[styles.actionButtonsContainer, { backgroundColor: themeColors.card }]}>
          <TouchableOpacity style={styles.actionButton} onPress={handleBlockUser}>
            <UserMinusIcon size={20} color={themeColors.error} />
            <ThemedText style={[styles.actionButtonText, { color: themeColors.error }]}>{t("chat.block_user")}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteConversation}>
            <TrashIcon size={20} color={themeColors.text} />
            <ThemedText style={[styles.actionButtonText, { color: themeColors.text }]}>{t("chat.delete_conversation")}</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  onlineText: {
    fontSize: 12,
    opacity: 0.7,
  },
  productSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  productThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 12,
    color: Colors.reds[500],
    marginTop: 2,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  otherMessageBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 100, // Limit height for multiline input
    marginRight: 10,
    fontSize: 15,
  },
  sendButton: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    gap: 5,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
