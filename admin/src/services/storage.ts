import { supabase } from "./supabase";

const BUCKET_NAME = "fathers";

export interface UploadResult {
  path: string;
  publicUrl: string;
}

export async function uploadImage(
  file: File,
  folder: "avatars" | "profiles"
): Promise<UploadResult> {
  // Generate unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename);

  return {
    path: filename,
    publicUrl: data.publicUrl,
  };
}

export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) throw error;
}

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return data.publicUrl;
}
