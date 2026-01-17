/**
 * Script to upload test images to Supabase Storage
 * Run: node upload-images.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://kprqbfxzbclouateifeh.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service key needed for upload

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_KEY environment variable is required');
  console.log('Set it with: export SUPABASE_SERVICE_KEY="your-service-key"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET_NAME = 'fathers';
const ASSETS_DIR = path.join(__dirname, '../quotes-of-fathers/assets');

const images = [
  { local: 'father-1.png', remote: 'father-1.png' },
  { local: 'father-2.png', remote: 'father-2.png' },
  { local: 'father-3.png', remote: 'father-3.png' },
  { local: 'father-4.png', remote: 'father-4.png' },
];

async function uploadImages() {
  console.log('🚀 Starting image upload to Supabase Storage...\n');

  for (const image of images) {
    const localPath = path.join(ASSETS_DIR, image.local);
    
    // Check if file exists
    if (!fs.existsSync(localPath)) {
      console.log(`⚠️  Skipping ${image.local}: file not found`);
      continue;
    }

    // Read file
    const fileBuffer = fs.readFileSync(localPath);
    const remotePath = image.remote;

    console.log(`📤 Uploading ${image.local} → ${remotePath}...`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(remotePath, fileBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error(`❌ Failed to upload ${image.local}:`, error.message);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(remotePath);

    console.log(`✅ Uploaded: ${urlData.publicUrl}\n`);
  }

  console.log('✅ Image upload completed!');
  console.log('\nNext steps:');
  console.log('1. Run seed-test-data-fixed.sql to update database with correct URLs');
  console.log('2. Test the mobile app');
}

// Run the upload
uploadImages().catch(error => {
  console.error('❌ Upload failed:', error);
  process.exit(1);
});
