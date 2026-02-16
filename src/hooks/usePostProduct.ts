import { useAuth } from "@clerk/clerk-expo";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { useState } from "react";
import { createClerkSupabaseClient } from "../lib/supabase";

// Mapping frontend category keys ("1", "2"...) to the fixed database UUIDs
const CATEGORY_UUID_MAP: Record<string, string> = {
  "1": "10000000-0000-0000-0000-000000000001", // smart_phone
  "2": "20000000-0000-0000-0000-000000000001", // vehicles
  "3": "30000000-0000-0000-0000-000000000001", // beauty
  "4": "40000000-0000-0000-0000-000000000001", // furniture
  "5": "50000000-0000-0000-0000-000000000001", // clothing
  "6": "60000000-0000-0000-0000-000000000001", // computer
  "7": "70000000-0000-0000-0000-000000000001", // real_estates
  "8": "80000000-0000-0000-0000-000000000001", // electronic
};

export function usePostProduct() {
  const { getToken, userId } = useAuth();
  const [isPosting, setIsPosting] = useState(false);

  const uploadImage = async (uri: string, supabase: any) => {
    try {
      if (!userId) throw new Error("User ID is missing. Please sign in again.");

      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      
      // 1. Read file as Base64 (Legacy method is safest for binary data in Expo)
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      console.log(`Uploading ${base64.length} bytes to bucket: product-images`);

      // 2. Upload to Supabase Storage using decoded ArrayBuffer
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, decode(base64), {
          contentType: "image/jpeg",
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const postProduct = async (draft: any) => {
    if (!userId) throw new Error("User ID is missing. Please sign in again.");
    
    setIsPosting(true);
    try {
      const token = await getToken();
      const supabase = createClerkSupabaseClient(token);

      console.log("Draft state before post:", JSON.stringify(draft, null, 2));

      // 1. Map category
      const dbCategoryId = CATEGORY_UUID_MAP[draft.categoryId] || null;

      // 2. Upload all images first
      const imageUrls = await Promise.all(
        draft.photos.map((uri: string) => uploadImage(uri, supabase))
      );

      // 3. Prepare the data
      const productData = {
        seller_id: userId as string,
        category_id: dbCategoryId,
        title: draft.title || `${draft.subCategory} Listing`,
        description: draft.description,
        price: parseFloat(draft.price) || 0,
        is_negotiable: draft.negotiable || false,
        images: imageUrls,
        location_name: draft.province || "Unknown",
        metadata: {
          ...draft.details,
          currency: draft.currency,
          district: draft.district,
          commune: draft.commune,
          location: draft.location,
          mainCategory: draft.mainCategory,
          subCategory: draft.subCategory
        },
        status: 'active'
      };

      // 4. Insert into database
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Post error:", error);
      throw error;
    } finally {
      setIsPosting(false);
    }
  };

  return { postProduct, isPosting };
}
