ALTER TABLE public.products DROP CONSTRAINT products_status_check;
ALTER TABLE public.products ADD CONSTRAINT products_status_check
    CHECK (status IN ('active', 'traded', 'hidden', 'expired', 'draft'));

ALTER TABLE public.trades DROP CONSTRAINT trades_status_check;
ALTER TABLE public.trades ADD CONSTRAINT trades_status_check
    CHECK (status IN ('active', 'traded', 'hidden', 'expired', 'draft'));

CREATE TABLE public.follows (
    follower_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    following_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT cannot_follow_self CHECK (follower_id <> following_id)
);

CREATE TABLE public.view_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    trade_id uuid REFERENCES public.trades(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT must_view_something CHECK (product_id IS NOT NULL OR trade_id IS NOT NULL)
);

CREATE TABLE public.analytics_views (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    trade_id uuid REFERENCES public.trades(id) ON DELETE CASCADE,
    viewer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.trade_offers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id uuid REFERENCES public.trades(id) ON DELETE CASCADE NOT NULL,
    bidder_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    offered_item_desc TEXT NOT NULL,
    cash_adjustment NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.view_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own follows" ON public.follows FOR SELECT USING ((SELECT public.clerk_user_id()) = follower_id);
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK ((SELECT public.clerk_user_id()) = follower_id);
CREATE POLICY "Users can unfollow others" ON public.follows FOR DELETE USING ((SELECT public.clerk_user_id()) = follower_id);

CREATE POLICY "Users can see their own history" ON public.view_history FOR SELECT USING ((SELECT public.clerk_user_id()) = user_id);
CREATE POLICY "Users can log their own history" ON public.view_history FOR INSERT WITH CHECK ((SELECT public.clerk_user_id()) = user_id);

CREATE POLICY "Analytics are viewable by owners" ON public.analytics_views FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND seller_id = (SELECT public.clerk_user_id())) OR
    EXISTS (SELECT 1 FROM public.trades WHERE id = trade_id AND owner_id = (SELECT public.clerk_user_id()))
);

CREATE POLICY "Anyone can log a view" ON public.analytics_views FOR INSERT WITH CHECK (
    product_id IS NOT NULL OR trade_id IS NOT NULL
);

CREATE POLICY "Trade offers viewable by bidder and owner" ON public.trade_offers FOR SELECT USING (
    (SELECT public.clerk_user_id()) = bidder_id OR
    EXISTS (SELECT 1 FROM public.trades WHERE id = trade_id AND owner_id = (SELECT public.clerk_user_id()))
);

CREATE POLICY "Users can bid on trades" ON public.trade_offers FOR INSERT WITH CHECK ((SELECT public.clerk_user_id()) = bidder_id);

CREATE TRIGGER on_trade_offers_updated BEFORE UPDATE ON public.trade_offers FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE INDEX idx_view_history_user ON public.view_history(user_id);
CREATE INDEX idx_analytics_product ON public.analytics_views(product_id);
CREATE INDEX idx_trade_offers_trade ON public.trade_offers(trade_id);