-- Alter messages table: Change content column to jsonb
ALTER TABLE public.messages
ALTER COLUMN content TYPE jsonb USING content::jsonb;

-- Alter conversations table: Add is_muted column
ALTER TABLE public.conversations
ADD COLUMN is_muted BOOLEAN DEFAULT FALSE;

-- Alter users table: Add last_online_at column
ALTER TABLE public.users
ADD COLUMN last_online_at TIMESTAMPTZ;

-- Optional: Create a function to update last_online_at
CREATE OR REPLACE FUNCTION public.update_last_online_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_online_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a trigger to update last_online_at on user activity (e.g., login, profile update)
-- This would need to be integrated with your authentication flow or user profile updates.
-- For example, if you update the user table on login:
-- CREATE TRIGGER update_user_last_online_at
-- BEFORE UPDATE ON public.users
-- FOR EACH ROW EXECUTE FUNCTION public.update_last_online_at();
