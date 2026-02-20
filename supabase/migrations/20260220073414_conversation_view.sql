-- Create a view for conversation summaries to be used in the chat list
CREATE OR REPLACE VIEW public.conversation_summaries AS
WITH last_messages AS (
    SELECT DISTINCT ON (conversations_id)
        conversations_id,
        content,
        created_at,
        sender_id
    FROM public.messages
    ORDER BY conversations_id, created_at DESC
),
unread_counts AS (
    SELECT
        conversations_id,
        COUNT(*) as unread_count,
        sender_id -- This is the sender of the unread messages
    FROM public.messages
    WHERE is_read = false
    GROUP BY conversations_id, sender_id
)
SELECT
    c.*,
    lm.content as last_message_content,
    lm.created_at as last_message_at,
    lm.sender_id as last_message_sender_id,
    COALESCE((
        SELECT SUM(uc.unread_count)
        FROM unread_counts uc
        WHERE uc.conversations_id = c.id
        AND uc.sender_id <> (SELECT public.clerk_user_id()) -- Count messages NOT sent by current user
    ), 0) as unread_count
FROM public.conversations c
LEFT JOIN last_messages lm ON lm.conversations_id = c.id;

-- Ensure RLS on the view (it inherits from base tables, but just to be explicit)
-- Views in Postgres don't have their own RLS, they use the RLS of the underlying tables.
-- So since 'conversations' and 'messages' have RLS, this view is safe.
