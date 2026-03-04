import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase"; // Assuming you generated types to this path

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Avoid hard-crashing the bundle when env vars are missing.
// This keeps the app bootable so auth and routing can initialize, while
// surfacing a clear warning that Supabase env config is required.
const resolvedSupabaseUrl =
  supabaseUrl && supabaseUrl.trim().length > 0
    ? supabaseUrl
    : "https://placeholder.supabase.co";
const resolvedSupabaseAnonKey =
  supabaseAnonKey && supabaseAnonKey.trim().length > 0
    ? supabaseAnonKey
    : "missing-anon-key";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Configure these in your Expo env.",
  );
}

// 1. Basic client for public data (e.g. browsing products)
export const supabase = createClient<Database>(
  resolvedSupabaseUrl,
  resolvedSupabaseAnonKey,
  {
  auth: {
    persistSession: false,
  },
});

// 2. Authenticated client helper for Clerk
export const createClerkSupabaseClient = (clerkToken: string | null) => {
  return createClient<Database>(
    resolvedSupabaseUrl,
    resolvedSupabaseAnonKey,
    {
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
