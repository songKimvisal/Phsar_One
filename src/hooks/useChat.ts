import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { supabase, createClerkSupabaseClient } from '../lib/supabase';
import { Database } from '../types/supabase';

// Define types for messages and conversations based on the Supabase schema
// (assuming `content` in messages is `jsonb` and `conversations` has `is_muted`)
export type Message = Database['public']['Tables']['messages']['Row'] & {
  sender?: Database['public']['Tables']['users']['Row'];
};
export type Conversation = Database['public']['Tables']['conversations']['Row'] & {
  buyer?: Database['public']['Tables']['users']['Row'];
  seller?: Database['public']['Tables']['users']['Row'];
  product?: Database['public']['Tables']['products']['Row'] & {
    images: string[];
  };
};

type MessageContent =
  | { type: 'text'; text: string }
  | { type: 'image'; url: string }
  | { type: 'location'; latitude: number; longitude: number; label?: string }
  | { type: 'voice'; url: string; duration?: number };

interface UseChatProps {
  productId?: string;
  sellerId?: string;
  conversationId?: string;
}

export function useChat({ productId, sellerId, conversationId: initialConversationId }: UseChatProps) {
  const { userId, getToken } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversationAndMessages = useCallback(async () => {
    if (!userId) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const authSupabase = createClerkSupabaseClient(token);

      let currentConversation: Conversation | null = null;

      if (initialConversationId) {
        // Fetch existing conversation by ID
        const { data, error: convError } = await authSupabase
          .from('conversations')
          .select('*, buyer:users(*), seller:users(*), product:products(id, title, images)')
          .eq('id', initialConversationId)
          .single();

        if (convError) throw convError;
        currentConversation = data;
      } else if (productId && sellerId) {
        // Find or create conversation for a product
        const { data, error: findError } = await authSupabase
          .from('conversations')
          .select('*, buyer:users(*), seller:users(*), product:products(id, title, images)')
          .eq('product_id', productId)
          .eq('seller_id', sellerId)
          .eq('buyer_id', userId)
          .single();

        if (findError && findError.code !== 'PGRST116') { // PGRST116 means no rows found
          throw findError;
        }

        if (data) {
          currentConversation = data;
        } else {
          // Create new conversation
          const { data: newConvData, error: createError } = await authSupabase
            .from('conversations')
            .insert({
              product_id: productId,
              seller_id: sellerId,
              buyer_id: userId,
            })
            .select('*, buyer:users(*), seller:users(*), product:products(id, title, images)')
            .single();

          if (createError) throw createError;
          currentConversation = newConvData;
        }
      }

      setConversation(currentConversation);

      if (currentConversation) {
        // Fetch messages for the conversation
        const { data: fetchedMessages, error: msgError } = await authSupabase
          .from('messages')
          .select('*, sender:users(*)')
          .eq('conversations_id', currentConversation.id)
          .order('created_at', { ascending: true });

        if (msgError) throw msgError;
        setMessages(fetchedMessages || []);
      }
    } catch (err: any) {
      console.error("Error fetching chat data:", err);
      setError(err.message || "Failed to load chat data.");
    } finally {
      setLoading(false);
    }
  }, [userId, getToken, productId, sellerId, initialConversationId]);

  useEffect(() => {
    fetchConversationAndMessages();
  }, [fetchConversationAndMessages]);

  // Realtime messages subscription
  useEffect(() => {
    if (!conversation?.id) return;

    const channel = supabase
      .channel(`messages:${conversation.id}`)
      .on<Message>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversations_id=eq.${conversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id]);


  const sendMessage = async (content: MessageContent) => {
    if (!userId || !conversation?.id) {
      throw new Error("Cannot send message: User not authenticated or conversation not found.");
    }

    try {
      const token = await getToken();
      const authSupabase = createClerkSupabaseClient(token);

      const { data, error: sendError } = await authSupabase
        .from('messages')
        .insert({
          conversations_id: conversation.id,
          sender_id: userId,
          content: content as Json, // Cast to Json as per schema
        })
        .select('*, sender:users(*)')
        .single();

      if (sendError) throw sendError;

      // Realtime subscription should handle updating the state, but we can also update locally for immediate feedback
      // setMessages((prev) => [...prev, data]);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message.");
      throw err;
    }
  };

  const markMessagesAsRead = async () => {
    if (!userId || !conversation?.id) return;

    try {
      const token = await getToken();
      const authSupabase = createClerkSupabaseClient(token);

      await authSupabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversations_id', conversation.id)
        .neq('sender_id', userId); // Mark messages from others as read
    } catch (err: any) {
      console.error("Error marking messages as read:", err);
    }
  };

  const toggleMuteConversation = async () => {
    if (!userId || !conversation?.id) return;

    try {
      const token = await getToken();
      const authSupabase = createClerkSupabaseClient(token);

      const newMuteStatus = !conversation.is_muted;
      const { data, error: updateError } = await authSupabase
        .from('conversations')
        .update({ is_muted: newMuteStatus })
        .eq('id', conversation.id)
        .select()
        .single();

      if (updateError) throw updateError;
      setConversation(data); // Update local state
    } catch (err: any) {
      console.error("Error toggling mute status:", err);
      setError(err.message || "Failed to toggle mute status.");
    }
  };

  const blockUser = async (userToBlockId: string) => {
    if (!userId) {
      throw new Error("User not authenticated.");
    }
    if (userId === userToBlockId) {
      throw new Error("Cannot block yourself.");
    }

    try {
      const token = await getToken();
      const authSupabase = createClerkSupabaseClient(token);

      const { error: blockError } = await authSupabase
        .from('blocked_users')
        .insert({
          blocker_id: userId,
          blocked_id: userToBlockId,
        });

      if (blockError) throw blockError;
      // Optionally, delete the conversation as well or just mark it as blocked
      // For now, just insert into blocked_users
      setError("User blocked successfully.");
    } catch (err: any) {
      console.error("Error blocking user:", err);
      setError(err.message || "Failed to block user.");
      throw err;
    }
  };

  const deleteConversation = async () => {
    if (!conversation?.id) return;

    try {
      const token = await getToken();
      const authSupabase = createClerkSupabaseClient(token);

      // Delete messages first due to foreign key constraints
      const { error: deleteMessagesError } = await authSupabase
        .from('messages')
        .delete()
        .eq('conversations_id', conversation.id);

      if (deleteMessagesError) throw deleteMessagesError;

      // Then delete the conversation
      const { error: deleteConversationError } = await authSupabase
        .from('conversations')
        .delete()
        .eq('id', conversation.id);

      if (deleteConversationError) throw deleteConversationError;

      setConversation(null);
      setMessages([]);
      setError("Conversation deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting conversation:", err);
      setError(err.message || "Failed to delete conversation.");
    }
  };


  return {
    conversation,
    messages,
    loading,
    error,
    sendMessage,
    markMessagesAsRead,
    toggleMuteConversation,
    blockUser,
    deleteConversation,
  };
}
