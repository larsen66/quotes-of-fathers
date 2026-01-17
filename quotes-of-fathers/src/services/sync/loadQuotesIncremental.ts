import { supabase } from "../supabase/supabase";
import { toServerQuote, ServerQuote } from "../supabase/types";

export async function loadQuotesIncremental(lastSyncAt: string): Promise<ServerQuote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .gt("updated_at", lastSyncAt);

  if (error) {
    console.error("Error loading quotes incrementally:", error);
    throw error;
  }

  return (data ?? []).map(toServerQuote);
}
