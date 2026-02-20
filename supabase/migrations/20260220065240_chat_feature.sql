-- Alter messages table: Change content column to jsonb
ALTER TABLE public.messages
ALTER COLUMN content TYPE jsonb USING content::jsonb;

-- Alter conversations table: Add per-user mute columns
ALTER TABLE public.conversations
DROP COLUMN IF EXISTS is_muted,
ADD COLUMN IF NOT EXISTS buyer_muted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS seller_muted BOOLEAN DEFAULT FALSE;

-- Alter users table: Add last_online_at column
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS last_online_at TIMESTAMPTZ;

-- Create a function to update last_online_at
CREATE OR REPLACE FUNCTION public.handle_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_online_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update last_online_at on user activity
DROP TRIGGER IF EXISTS on_user_activity ON public.users;
CREATE TRIGGER on_user_activity
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_user_activity();

-- RLS POLICIES FOR CONVERSATIONS --

-- Enable RLS (already enabled in previous migration, but being safe)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them cleanly
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can start a conversation" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their own conversation settings" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.conversations;

CREATE POLICY "Users can view their own conversations"
ON public.conversations FOR SELECT
USING ((SELECT public.clerk_user_id()) IN (buyer_id, seller_id));

CREATE POLICY "Users can start a conversation"
ON public.conversations FOR INSERT
WITH CHECK ((SELECT public.clerk_user_id()) = buyer_id);

CREATE POLICY "Users can update their own conversation settings"
ON public.conversations FOR UPDATE
USING ((SELECT public.clerk_user_id()) IN (buyer_id, seller_id))
WITH CHECK ((SELECT public.clerk_user_id()) IN (buyer_id, seller_id));

CREATE POLICY "Users can delete their own conversations"
ON public.conversations FOR DELETE
USING ((SELECT public.clerk_user_id()) IN (buyer_id, seller_id));

-- RLS POLICIES FOR MESSAGES --

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can mark messages as read" ON public.messages;
DROP POLICY IF EXISTS "Users can delete messages in their conversations" ON public.messages;

CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversations
        WHERE id = conversations_id
        AND (SELECT public.clerk_user_id()) IN (buyer_id, seller_id)
    )
);

CREATE POLICY "Users can send messages to their conversations"
ON public.messages FOR INSERT
WITH CHECK (
    (SELECT public.clerk_user_id()) = sender_id
    AND EXISTS (
        SELECT 1 FROM public.conversations
        WHERE id = conversations_id
        AND (SELECT public.clerk_user_id()) IN (buyer_id, seller_id)
    )
);

CREATE POLICY "Users can mark messages as read"
ON public.messages FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.conversations
        WHERE id = conversations_id
        AND (SELECT public.clerk_user_id()) IN (buyer_id, seller_id)
    )
)
WITH CHECK (
    -- Only allow marking messages from OTHERS as read
    (SELECT public.clerk_user_id()) <> sender_id
);

CREATE POLICY "Users can delete messages in their conversations"
ON public.messages FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.conversations
        WHERE id = conversations_id
        AND (SELECT public.clerk_user_id()) IN (buyer_id, seller_id)
    )
);
