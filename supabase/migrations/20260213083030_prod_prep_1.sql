CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    target_user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT cannot_review_self CHECK (reviewer_id <> target_user_id)
);  

CREATE TABLE public.reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    target_user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    target_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT must_report_something CHECK (target_user_id IS NOT NULL OR target_product_id IS NOT NULL)
);

CREATE TABLE public.blocked_users (
    blocker_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    blocked_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT cannot_block_self CHECK (blocker_id <> blocked_id)
); 

ALTER TABLE PUBLIC.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE PUBLIC.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE PUBLIC.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE PUBLIC.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT USING ((SELECT public.clerk_user_id()) = user_id);

CREATE POLICY "Users can send notifications"
ON public.notifications FOR INSERT WITH CHECK ((SELECT public.clerk_user_id()) <> user_id);

CREATE POLICY "Reviews are public"
ON public.reviews FOR SELECT USING (TRUE);

CREATE POLICY "Users can write reviews"
ON public.reviews FOR INSERT WITH CHECK ((SELECT public.clerk_user_id()) = reviewer_id);

CREATE POLICY "Users can delete their own reviews"
ON public.reviews FOR DELETE USING ((SELECT public.clerk_user_id()) = reviewer_id);

CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT WITH CHECK ((SELECT public.clerk_user_id()) = reporter_id);

CREATE POLICY "Users can see who they blocked"
ON public.blocked_users FOR SELECT USING ((SELECT public.clerk_user_id()) = blocker_id);

CREATE POLICY "Users can block people"
ON public.blocked_users FOR INSERT WITH CHECK ((SELECT public.clerk_user_id()) = blocker_id);

CREATE POLICY "Users can unblock people"
ON public.blocked_users FOR DELETE USING ((SELECT public.clerk_user_id()) = blocker_id);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_reviews_target ON public.reviews(target_user_id);