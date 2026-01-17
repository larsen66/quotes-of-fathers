// Test data synchronization from Supabase
import { supabase } from "./services/supabase/supabase";
import { toServerFather, toServerQuote } from "./services/supabase/types";

export async function testDataSync() {
  console.log("🔄 Testing data synchronization...");
  console.log("---");

  try {
    // 1. Load fathers
    console.log("👥 Loading fathers from Supabase...");
    const { data: fathersData, error: fathersError } = await supabase
      .from("fathers")
      .select("*")
      .eq("deleted", false)
      .order("order", { ascending: true });

    if (fathersError) {
      console.error("❌ Error loading fathers:", fathersError.message);
      return false;
    }

    const fathers = (fathersData || []).map(toServerFather);
    console.log(`✅ Loaded ${fathers.length} fathers`);
    fathers.forEach((f, i) => {
      console.log(`   ${i + 1}. ${f.name.ka} (${f.name.ru || 'no ru'})`);
    });
    console.log("---");

    // 2. Load quotes
    console.log("💬 Loading quotes from Supabase...");
    const { data: quotesData, error: quotesError } = await supabase
      .from("quotes")
      .select("*")
      .eq("is_published", true)
      .eq("deleted", false)
      .order("created_at", { ascending: false });

    if (quotesError) {
      console.error("❌ Error loading quotes:", quotesError.message);
      return false;
    }

    const quotes = (quotesData || []).map(toServerQuote);
    console.log(`✅ Loaded ${quotes.length} quotes`);
    
    // Group by father
    const quotesByFather: Record<string, number> = {};
    quotes.forEach(q => {
      quotesByFather[q.fatherId] = (quotesByFather[q.fatherId] || 0) + 1;
    });

    console.log("   Quotes per father:");
    fathers.forEach(f => {
      const count = quotesByFather[f.id] || 0;
      console.log(`   - ${f.name.ka}: ${count} quotes`);
    });
    console.log("---");

    // 3. Show sample quotes
    console.log("📖 Sample quotes:");
    quotes.slice(0, 3).forEach((q, i) => {
      const father = fathers.find(f => f.id === q.fatherId);
      console.log(`   ${i + 1}. "${q.text.ka}"`);
      console.log(`      (${q.text.ru || 'no ru'})`);
      console.log(`      - ${father?.name.ka || 'Unknown'}`);
    });
    console.log("---");

    // 4. Load app settings
    console.log("⚙️ Loading app settings...");
    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (settingsError) {
      console.error("❌ Error loading settings:", settingsError.message);
    } else {
      console.log(`✅ Subscriber count: ${settings.subscriber_count}`);
    }
    console.log("---");

    console.log("✅ Data sync test completed successfully!");
    console.log(`   Total: ${fathers.length} fathers, ${quotes.length} quotes`);
    
    return true;
  } catch (error: any) {
    console.error("❌ Data sync test failed:", error.message);
    return false;
  }
}
