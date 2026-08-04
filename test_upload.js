import fs from 'fs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const bucket = process.env.VITE_SUPABASE_BUCKET || 'tugas-files';

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  try {
    const fileBuffer = fs.readFileSync('sample.txt');
    const path = `tasks/test_${Date.now()}.txt`;
    console.log('Uploading to', bucket, path);
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
    if (urlError) console.error('getPublicUrl error', urlError);
    else console.log('Public URL:', urlData.publicUrl);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

run();
