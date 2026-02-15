INSERT INTO storage.buckets (id, name, public)
VALUES
    ('product-images', 'product-images', TRUE),
    ('trade-images', 'trade-images', TRUE),
    ('avatars', 'avatars', TRUE),
    ('payment-proofs', 'payment-proofs', TRUE);

CREATE POLICY "Product images are public" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Users can upload product images" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND (SELECT auth.role()) = 'authenticated');

CREATE POLICY "Users can delete their own product images" ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND (SELECT public.clerk_user_id()) = (storage.foldername(name))[1]);

CREATE POLICY "Avatars are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND (SELECT public.clerk_user_id()) = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own payment proofs" ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs' AND (SELECT public.clerk_user_id()) = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload payment proofs" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs' AND (SELECT public.clerk_user_id()) = (storage.foldername(name))[1]);