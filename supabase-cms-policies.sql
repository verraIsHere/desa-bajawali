-- =============================================
-- CMS: RLS policy tambahan (Jalankan script ini
-- di Supabase SQL Editor sebelum memakai CMS)
-- =============================================
-- Jalankan file ini TERPISAH dari supabase-migration.sql.
-- supabase-migration.sql berisi seed data, jadi menjalankannya ulang akan
-- menimpa perubahan yang sudah dilakukan lewat dashboard.
--
-- Masalah yang diperbaiki:
--   Policy SELECT lama untuk anon DAN authenticated memakai
--   USING (is_active = true), sehingga admin CMS tidak bisa melihat
--   data yang disembunyikan. Akibatnya data non-aktif tidak bisa diedit
--   maupun ditampilkan lagi.
--
-- Di PostgreSQL beberapa policy permissive untuk perintah yang sama
-- digabung dengan OR, sehingga policy di bawah membuat authenticated
-- bisa membaca semua baris, tanpa relaxing hak akses anon.

-- 1. Admin bisa melihat seluruh perangkat desa (aktif & non-aktif)
DROP POLICY IF EXISTS "Authenticated can read all village officials" ON public.village_officials;
CREATE POLICY "Authenticated can read all village officials" ON public.village_officials FOR SELECT TO authenticated USING (true);

-- 2. Admin bisa melihat seluruh anggota BPD (aktif & non-aktif)
DROP POLICY IF EXISTS "Authenticated can read all village bpd" ON public.village_bpd;
CREATE POLICY "Authenticated can read all village bpd" ON public.village_bpd FOR SELECT TO authenticated USING (true);

-- 3. Admin bisa melihat seluruh hero slide (aktif & non-aktif)
DROP POLICY IF EXISTS "Authenticated can read all hero slides" ON public.hero_slides;
CREATE POLICY "Authenticated can read all hero slides" ON public.hero_slides FOR SELECT TO authenticated USING (true);

-- 4. Admin bisa melihat seluruh potensi desa (publish & draft)
DROP POLICY IF EXISTS "Authenticated can read all village potentials" ON public.village_potentials;
CREATE POLICY "Authenticated can read all village potentials" ON public.village_potentials FOR SELECT TO authenticated USING (true);

-- Verifikasi (jalankan setelah script di atas):
-- SELECT policyname, cmd, roles::text FROM pg_policies
--  WHERE tablename IN ('village_officials','village_bpd','hero_slides','village_potentials')
--  ORDER BY tablename, policyname;
