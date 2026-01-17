import { supabase } from "./supabase";
import { AppSettings } from "../types/database";

export async function getAppSettings(): Promise<AppSettings> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;
  return data;
}

export async function updateSubscriberCount(count: number): Promise<AppSettings> {
  const { data, error } = await supabase
    .from("app_settings")
    .update({ subscriber_count: count })
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data;
}
