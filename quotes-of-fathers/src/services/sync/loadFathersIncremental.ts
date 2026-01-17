import { supabase } from "../supabase/supabase";
import { toServerFather, ServerFather } from "../supabase/types";

export async function loadFathersIncremental(lastSyncAt: string): Promise<ServerFather[]> {
  const { data, error } = await supabase
    .from("fathers")
    .select("*")
    .gt("updated_at", lastSyncAt);

  if (error) {
    console.error("Error loading fathers incrementally:", error);
    throw error;
  }

  return (data ?? []).map(toServerFather);
}
