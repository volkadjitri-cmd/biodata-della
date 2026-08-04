import fs from "fs";
import { IncomingForm } from "formidable";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;
const bucket = process.env.VITE_SUPABASE_BUCKET || "tugas-files";

if (!supabaseUrl || !serviceKey) {
  // runtime error will surface in deployments
  console.warn("Missing SUPABASE_SERVICE_KEY or VITE_SUPABASE_URL in env for upload function");
}

const supabase = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form parse error" });

    try {
      let file = files.file;
      if (Array.isArray(file)) file = file[0];
      if (!file) {
        console.warn("Upload: no file field in parsed files", files);
        return res.status(400).json({ error: "No file provided", files });
      }

      const possiblePathProps = [
        file.filepath,
        file.path,
        file.filePath,
        file.tempFilePath,
        file.tempfilepath,
        file.tempFilepath,
      ];
      const tempPath = possiblePathProps.find(Boolean);
      if (!tempPath) {
        console.warn("Upload: uploaded file missing temp path", file);
        return res.status(500).json({ error: "Uploaded file missing temp path", file });
      }

      const buffer = fs.readFileSync(tempPath);
      const safeName = (file.originalFilename || file.originalname || file.name || file.newFilename || "upload").replace(/\s+/g, "_");
      const path = `tasks/${Date.now()}_${safeName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, buffer, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message || uploadError });
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      const fileUrl = urlData?.publicUrl || "";

      // insert metadata into tugas table with service key
      const payload = {
        nama: fields.nama || "",
        kelas: fields.kelas || "",
        judul: fields.judul || "",
        file_path: path,
        file_name: safeName,
        file_url: fileUrl,
        catatan: fields.catatan || "",
      };

      const { data: inserted, error: insertError } = await supabase.from("tugas").insert([payload]).select("*").single();

      if (insertError) return res.status(500).json({ error: insertError.message || insertError });

      return res.json({ success: true, inserted });
    } catch (e) {
      return res.status(500).json({ error: e.message || String(e) });
    }
  });
}
