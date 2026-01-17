// Reset app - clear local database and sync state
import { db } from "./src/data/db/db";

export function resetApp() {
  console.log("🗑️ Resetting app...");
  
  try {
    // Clear all data
    db.execSync(`
      DELETE FROM favorites;
      DELETE FROM quotes;
      DELETE FROM fathers;
      DELETE FROM feedback_outbox;
      
      -- Reset sync state
      UPDATE sync_state 
      SET initialSyncCompleted = 0, 
          lastSyncAt = NULL 
      WHERE id = 1;
    `);
    
    console.log("✅ App reset complete!");
    console.log("ℹ️ Restart the app to see the sync screen");
  } catch (error) {
    console.error("❌ Error resetting app:", error);
  }
}
