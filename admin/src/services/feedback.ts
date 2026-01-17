import { supabase } from "./supabase";
import { Feedback } from "../types/database";

export async function getFeedback(): Promise<Feedback[]> {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getFeedbackItem(id: string): Promise<Feedback | null> {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function markFeedbackAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("feedback")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw error;
}

export async function getUnreadFeedbackCount(): Promise<number> {
  const { count, error } = await supabase
    .from("feedback")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) throw error;
  return count ?? 0;
}

export async function deleteFeedback(id: string): Promise<void> {
  const { error } = await supabase
    .from("feedback")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
