import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

// Supabase configuration
const SUPABASE_URL = "https://kprqbfxzbclouateifeh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_iTXQOpOdhAD3jHFnkLxhVQ_kSztD4zI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
