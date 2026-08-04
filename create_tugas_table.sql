-- Buat tabel tugas untuk menyimpan data pengumpulan tugas PKWU
-- Jalankan SQL ini di Supabase SQL Editor

create table if not exists tugas (
  id bigserial primary key,
  nama text not null,
  kelas text not null,
  judul text not null,
  file_path text not null,
  file_name text not null,
  file_url text not null,
  catatan text,
  created_at timestamptz not null default now()
);
