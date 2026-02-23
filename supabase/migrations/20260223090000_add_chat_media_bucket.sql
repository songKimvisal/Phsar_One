INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Chat media is public" ON storage.objects;
CREATE POLICY "Chat media is public"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-media');

DROP POLICY IF EXISTS "Authenticated users can upload chat media" ON storage.objects;
CREATE POLICY "Authenticated users can upload chat media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-media' AND (SELECT auth.role()) = 'authenticated');
