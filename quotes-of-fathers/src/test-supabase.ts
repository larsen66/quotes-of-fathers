// Test Supabase connection
import { supabase } from "./services/supabase/supabase";

export async function testSupabaseConnection() {
  console.log("🧪 Testing Supabase connection...");
  console.log("---");

  try {
    // 1. Check URL
    console.log("✅ Supabase URL:", supabase.supabaseUrl);
    console.log("---");

    // 2. Test database connection - check fathers table
    console.log("📊 Testing database connection (fathers table)...");
    const { data: fathers, error: fathersError } = await supabase
      .from("fathers")
      .select("*")
      .limit(5);

    if (fathersError) {
      console.error("❌ Fathers table error:", fathersError.message);
    } else {
      console.log("✅ Fathers table accessible");
      console.log(`   Found ${fathers?.length || 0} fathers`);
      if (fathers && fathers.length > 0) {
        console.log("   Sample:", fathers[0]);
      }
    }
    console.log("---");

    // 3. Test quotes table
    console.log("📊 Testing quotes table...");
    const { data: quotes, error: quotesError } = await supabase
      .from("quotes")
      .select("*")
      .limit(5);

    if (quotesError) {
      console.error("❌ Quotes table error:", quotesError.message);
    } else {
      console.log("✅ Quotes table accessible");
      console.log(`   Found ${quotes?.length || 0} quotes`);
      if (quotes && quotes.length > 0) {
        console.log("   Sample:", quotes[0]);
      }
    }
    console.log("---");

    // 4. Test app_settings table
    console.log("📊 Testing app_settings table...");
    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (settingsError) {
      console.error("❌ App settings error:", settingsError.message);
    } else {
      console.log("✅ App settings accessible");
      console.log("   Subscriber count:", settings?.subscriber_count);
    }
    console.log("---");

    // 5. Test storage
    console.log("📦 Testing storage buckets...");
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

    if (storageError) {
      console.error("❌ Storage error:", storageError.message);
    } else {
      console.log("✅ Storage accessible");
      console.log("   Buckets:", buckets?.map(b => b.name).join(", "));
      const fathersBucket = buckets?.find(b => b.name === "fathers");
      if (fathersBucket) {
        console.log("   ✅ 'fathers' bucket exists");
      } else {
        console.log("   ⚠️ 'fathers' bucket not found");
      }
    }
    console.log("---");

    // 6. Test feedback insert (without actually inserting)
    console.log("📝 Testing feedback table access...");
    const { error: feedbackError } = await supabase
      .from("feedback")
      .select("*")
      .limit(1);

    if (feedbackError) {
      console.error("❌ Feedback table error:", feedbackError.message);
    } else {
      console.log("✅ Feedback table accessible");
    }
    console.log("---");

    console.log("✅ All Supabase tests completed!");
    return true;
  } catch (error: any) {
    console.error("❌ Connection test failed:", error.message);
    return false;
  }
}
