-- Enable RLS and add policies for blocked_users and conversation_blocks

-- blocked_users: allow users to insert their own blocks, view blocks involving them, and delete their own blocks
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view blocked_users" ON public.blocked_users;
CREATE POLICY "Users can view blocked_users"
ON public.blocked_users FOR SELECT
USING ((SELECT public.clerk_user_id()) IN (blocker_id, blocked_id));

DROP POLICY IF EXISTS "Users can insert blocked_users" ON public.blocked_users;
CREATE POLICY "Users can insert blocked_users"
ON public.blocked_users FOR INSERT
WITH CHECK ((SELECT public.clerk_user_id()) = blocker_id);

DROP POLICY IF EXISTS "Users can delete blocked_users" ON public.blocked_users;
CREATE POLICY "Users can delete blocked_users"
ON public.blocked_users FOR DELETE
USING ((SELECT public.clerk_user_id()) = blocker_id);

-- conversation_blocks: scoped to conversation participants and blocker
ALTER TABLE public.conversation_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view conversation_blocks" ON public.conversation_blocks;
CREATE POLICY "Users can view conversation_blocks"
ON public.conversation_blocks FOR SELECT
USING (
  (SELECT public.clerk_user_id()) = blocker_id
  OR EXISTS (
    SELECT 1 FROM public.conversations c WHERE c.id = conversation_blocks.conversation_id
    AND (SELECT public.clerk_user_id()) IN (c.buyer_id, c.seller_id)
  )
);

DROP POLICY IF EXISTS "Users can insert conversation_blocks" ON public.conversation_blocks;
CREATE POLICY "Users can insert conversation_blocks"
ON public.conversation_blocks FOR INSERT
WITH CHECK ((SELECT public.clerk_user_id()) = blocker_id);

DROP POLICY IF EXISTS "Users can delete conversation_blocks" ON public.conversation_blocks;
CREATE POLICY "Users can delete conversation_blocks"
ON public.conversation_blocks FOR DELETE
USING ((SELECT public.clerk_user_id()) = blocker_id);
