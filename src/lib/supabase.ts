import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase"; // Assuming you generated types to this path

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// 1. Basic client for public data (e.g. browsing products)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

// 2. Authenticated client helper for Clerk
export const createClerkSupabaseClient = (clerkToken: string | null) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: clerkToken ? `Bearer ${clerkToken}` : "",
      },
    },
    auth: {
      persistSession: false,
    },
  });
};
