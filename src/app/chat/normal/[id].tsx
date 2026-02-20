import { useAuth } from "@clerk/clerk-expo";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  BellSlashIcon,
  CaretLeftIcon,
  DotsThreeVerticalIcon,
  MicrophoneIcon,
  PhoneIcon,
  PlusIcon,
} from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@src/components/shared_components/ThemedText";
import { Colors } from "@src/constants/Colors";
import { Message, useChat } from "@src/hooks/useChat";
import useThemeColor from "@src/hooks/useThemeColor";

export default function NormalProductChatScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const themeColors = useThemeColor();
  const { userId } = useAuth();
  const { t } = useTranslation();

  const {
    id: productId, // Product ID
    sellerId, // Seller ID
    sellerName,
    sellerAvatar,
    conversationId: initialConversationId,
  } = params;

  const {
    conversation,
    messages,
    loading,
    error,
    sendMessage,
    markMessagesAsRead,
    toggleMuteConversation,
  } = useChat({
    productId: productId as string,
    sellerId: sellerId as string,
    conversationId: initialConversationId as string,
  });

  const [inputText, setInputText] = useState("");
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
    if (inputText.trim() === "") return;
    if (!conversation) {
      Alert.alert(t("common.error"), t("chat.conversation_not_ready"));
      return;
    }

    try {
      await sendMessage({ type: "text", text: inputText.trim() });
      setInputText("");
    } catch (err: any) {
      Alert.alert(
        t("common.error"),
        err.message || t("chat.failed_to_send_message"),
      );
    }
  };

  const handleCallUser = () => {
    const otherUser =
      userId === conversation?.buyer_id
        ? conversation?.seller
        : conversation?.buyer;
    if (otherUser?.phone) {
      Linking.openURL(`tel:${otherUser.phone}`);
    } else {
      Alert.alert(t("common.error"), t("chat.phone_not_available"));
    }
  };

  if (loading && !conversation) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <ActivityIndicator size="large" color={themeColors.tint} />
        <ThemedText style={{ marginTop: 10 }}>
          {t("chat.loading_conversation")}
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <ThemedText style={{ color: themeColors.error }}>{error}</ThemedText>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <ThemedText style={{ color: themeColors.link }}>
            {t("common.go_back")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const isMuted =
    userId === conversation?.buyer_id
      ? conversation?.buyer_muted
      : conversation?.seller_muted;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Stack.Screen
        options={{
          headerShown: false, // Custom header handled below
        }}
      />

      {/* Custom Chat Header (Matches direct-message.png) */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: themeColors.card,
            borderBottomColor: themeColors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <CaretLeftIcon size={24} color={themeColors.text} weight="bold" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Image
            source={{
              uri:
                (sellerAvatar as string) || "https://via.placeholder.com/150",
            }}
            style={styles.sellerAvatar}
          />
          <View>
            <ThemedText style={styles.sellerName}>{sellerName}</ThemedText>
            {/* Online status could be dynamically updated here if we have last_online_at */}
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.onlineIndicator,
                  { backgroundColor: Colors.greens[500] },
                ]}
              />
              <ThemedText style={styles.onlineText}>
                {t("chat.online")}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleCallUser}
            style={styles.headerButton}
          >
            <PhoneIcon size={24} color={themeColors.text} weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleMuteConversation}
            style={styles.headerButton}
          >
            {isMuted ? (
              <BellSlashIcon size={24} color={themeColors.text} weight="bold" />
            ) : (
              <DotsThreeVerticalIcon
                size={24}
                color={themeColors.text}
                weight="bold"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isMyMessage = item.sender_id === userId;
          const messageContent = item.content as any;

          return (
            <View
              style={[
                styles.messageContainer,
                isMyMessage
                  ? styles.myMessageContainer
                  : styles.otherMessageContainer,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isMyMessage
                    ? styles.myMessageBubble
                    : styles.otherMessageBubble,
                  {
                    backgroundColor: isMyMessage
                      ? themeColors.tint
                      : themeColors.card,
                  },
                ]}
              >
                <ThemedText
                  style={{ color: isMyMessage ? "white" : themeColors.text }}
                >
                  {messageContent.text}
                </ThemedText>
              </View>
              <Text
                style={[styles.messageTime, { color: themeColors.text + "70" }]}
              >
                {new Date(item.created_at || "").toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.messagesList}
      />

      {/* Message Input (Matches direct-message.png) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: themeColors.background,
              borderTopColor: themeColors.border,
            },
          ]}
        >
          <TouchableOpacity style={styles.plusButton}>
            <PlusIcon size={24} color={themeColors.text} />
          </TouchableOpacity>

          <View
            style={[
              styles.textInputWrapper,
              { backgroundColor: themeColors.card },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: themeColors.text }]}
              placeholder={t("chat.type_a_message")}
              placeholderTextColor={themeColors.text + "50"}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>

          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.micButton}
          >
            {inputText.trim() === "" ? (
              <MicrophoneIcon size={24} color={themeColors.text} />
            ) : (
              <ThemedText
                style={{ color: themeColors.tint, fontWeight: "700" }}
              >
                {t("chat.send")}
              </ThemedText>
            )}
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
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#eee",
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "500",
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
  messageContainer: {
    marginBottom: 8,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: "80%",
  },
  myMessageBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  otherMessageBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 2,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 5,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  plusButton: {
    padding: 6,
    marginRight: 6,
  },
  textInputWrapper: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 4,
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
  micButton: {
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  sendButton: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "600",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    gap: 5,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
