import { supabase } from "./supabase";
import { Quote, QuoteInsert, QuoteUpdate } from "../types/database";

export interface GetQuotesOptions {
  fatherId?: string;
  isPublished?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getQuotes(options: GetQuotesOptions = {}): Promise<Quote[]> {
  let query = supabase
    .from("quotes")
    .select("*")
    .eq("deleted", false)
    .order("created_at", { ascending: false });

  if (options.fatherId) {
    query = query.eq("father_id", options.fatherId);
  }

  if (options.isPublished !== undefined) {
    query = query.eq("is_published", options.isPublished);
  }

  if (options.search) {
    query = query.or(`text_ka.ilike.%${options.search}%,text_ru.ilike.%${options.search}%`);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit ?? 50) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function getQuote(id: string): Promise<Quote | null> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
}

export async function createQuote(quote: Omit<QuoteInsert, "id" | "created_at" | "updated_at">): Promise<Quote> {
  const { data, error } = await supabase
    .from("quotes")
    .insert(quote)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateQuote(id: string, quote: QuoteUpdate): Promise<Quote> {
  const { data, error } = await supabase
    .from("quotes")
    .update(quote)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuote(id: string): Promise<void> {
  // Soft delete
  const { error } = await supabase
    .from("quotes")
    .update({ deleted: true })
    .eq("id", id);

  if (error) throw error;
}

export async function togglePublishQuote(id: string, isPublished: boolean): Promise<Quote> {
  return updateQuote(id, { is_published: isPublished });
}

export async function bulkTogglePublish(ids: string[], isPublished: boolean): Promise<void> {
  const { error } = await supabase
    .from("quotes")
    .update({ is_published: isPublished })
    .in("id", ids);

  if (error) throw error;
}

export async function bulkDeleteQuotes(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from("quotes")
    .update({ deleted: true })
    .in("id", ids);

  if (error) throw error;
}
