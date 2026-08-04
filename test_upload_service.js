import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
const bucket = process.env.VITE_SUPABASE_BUCKET || 'tugas-files';

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  console.error('Please add both values to your .env file to test server-side uploads.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

async function run() {
  try {
    const fileBuffer = fs.readFileSync('sample.txt');
    const path = `tasks/service_test_${Date.now()}.txt`;
    console.log('Testing upload to bucket:', bucket);
    console.log('Upload path:', path);

    const { data, error } = await supabase.storage.from(bucket).upload(path, fileBuffer, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Upload error:', error);
      process.exit(1);
    }

    console.log('Upload success:', data);
    const { data: urlData, error: urlError } = supabase.storage.from(bucket).getPublicUrl(path);
    if (urlError) {
      console.error('getPublicUrl error:', urlError);
      process.exit(1);
    }

    console.log('Public URL:', urlData.publicUrl);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

run();