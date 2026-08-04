-- Supabase SQL untuk memperbolehkan upload anon ke bucket `tugas-files`
-- Jalankan di Supabase SQL Editor (Project > SQL Editor > New query)

-- 1) Pastikan tabel tugas ada; aktifkan RLS dan tambahkan policy untuk insert/select sementara
ALTER TABLE public.tugas ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_public_select_on_tugas
  ON public.tugas
  FOR SELECT
  USING (true);

CREATE POLICY allow_public_insert_on_tugas
  ON public.tugas
  FOR INSERT
  WITH CHECK (true);

-- 2) Tambahkan policy untuk storage.objects agar pengguna anonim dapat meng-upload ke bucket `tugas-files`
-- (Supabase menyimpan metadata objek di schema `storage` table `objects`)

-- Pastikan RLS aktif pada tabel metadata objek storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_anon_insert_on_storage_objects
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'tugas-files' AND (auth.role() = 'anon' OR auth.role() = 'authenticated')
  );

-- Opsional: jika ingin mengizinkan membaca metadata untuk semua
CREATE POLICY allow_public_select_on_storage_objects
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'tugas-files');

-- CATATAN KEAMANAN:
-- Kebijakan di atas bersifat longgar (mengizinkan anonymous insert/select untuk bucket `tugas-files`).
-- Untuk produksi, pertimbangkan membatasi inserts hanya untuk role tertentu atau menggunakan Supabase Edge Function yang
-- menjalankan upload dengan `service_role` key, atau membuat RLS yang memeriksa klaim pengguna.
