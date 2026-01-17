import { supabase } from "../supabase/supabase";
import { toServerFather, ServerFather } from "../supabase/types";

export async function loadFathers(): Promise<ServerFather[]> {
  const { data, error } = await supabase
    .from("fathers")
    .select("*")
    .eq("deleted", false)
    .order("order", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("Error loading fathers:", error);
    throw error;
  }

  return (data ?? []).map(toServerFather);
}
