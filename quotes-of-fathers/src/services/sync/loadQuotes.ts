import { supabase } from "../supabase/supabase";
import { toServerQuote, ServerQuote } from "../supabase/types";

export async function loadQuotes(): Promise<ServerQuote[]> {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("is_published", true)
    .eq("deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading quotes:", error);
    throw error;
  }

  return (data ?? []).map(toServerQuote);
}
