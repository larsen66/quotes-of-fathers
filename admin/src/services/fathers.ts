import { supabase } from "./supabase";
import { Father, FatherInsert, FatherUpdate } from "../types/database";

export async function getFathers(): Promise<Father[]> {
  const { data, error } = await supabase
    .from("fathers")
    .select("*")
    .eq("deleted", false)
    .order("order", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return data ?? [];
}

export async function getFather(id: string): Promise<Father | null> {
  const { data, error } = await supabase
    .from("fathers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
}

export async function createFather(father: Omit<FatherInsert, "id" | "created_at" | "updated_at">): Promise<Father> {
  const { data, error } = await supabase
    .from("fathers")
    .insert(father)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFather(id: string, father: FatherUpdate): Promise<Father> {
  const { data, error } = await supabase
    .from("fathers")
    .update(father)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFather(id: string): Promise<void> {
  // Soft delete
  const { error } = await supabase
    .from("fathers")
    .update({ deleted: true })
    .eq("id", id);

  if (error) throw error;
}

export async function getQuotesCountByFather(fatherId: string): Promise<number> {
  const { count, error } = await supabase
    .from("quotes")
    .select("*", { count: "exact", head: true })
    .eq("father_id", fatherId)
    .eq("deleted", false);

  if (error) throw error;
  return count ?? 0;
}
