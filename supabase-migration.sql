-- =============================================
-- Supabase Migration Script — Desa Bajawali CMS
-- =============================================
-- Jalankan script ini di Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run

-- 1. Enable UUID extension (biasanya sudah aktif)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 2. Tabel Profiles
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'administrator' CHECK (role IN ('owner', 'developer', 'administrator')),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    'administrator'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 3. Tabel News
-- =============================================
CREATE TABLE IF NOT EXISTS public.news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Pemerintahan',
  image_url TEXT,
  image_path TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER on_news_updated
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Index for slug lookup
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(is_published, published_at DESC);

-- =============================================
-- 4. Tabel Gallery
-- =============================================
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  caption TEXT,
  category TEXT NOT NULL DEFAULT 'Lainnya',
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  taken_at DATE,
  photographer TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER on_gallery_updated
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery(is_published, created_at DESC);

-- =============================================
-- 5. Row Level Security (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- News policies
CREATE POLICY "Published news are viewable by everyone"
  ON public.news FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all news"
  ON public.news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert news"
  ON public.news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update news"
  ON public.news FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete news"
  ON public.news FOR DELETE
  TO authenticated
  USING (true);

-- Gallery policies
CREATE POLICY "Published gallery items are viewable by everyone"
  ON public.gallery FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all gallery items"
  ON public.gallery FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert gallery items"
  ON public.gallery FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery items"
  ON public.gallery FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete gallery items"
  ON public.gallery FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- 6. Storage Bucket
-- =============================================
-- Buat bucket 'desa-bajawali' via Dashboard → Storage → Create Bucket
-- Atau jalankan ini:
INSERT INTO storage.buckets (id, name, public)
VALUES ('desa-bajawali', 'desa-bajawali', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access for desa-bajawali bucket"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'desa-bajawali');

CREATE POLICY "Authenticated users can upload to desa-bajawali bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'desa-bajawali');

CREATE POLICY "Authenticated users can update in desa-bajawali bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'desa-bajawali');

CREATE POLICY "Authenticated users can delete from desa-bajawali bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'desa-bajawali');

-- =============================================
-- 7. Setelah menjalankan script ini:
-- =============================================
-- 1. Buka Dashboard → Authentication → Users
-- 2. Pastikan user yang sudah ada terdaftar
-- 3. Buka SQL Editor, jalankan:
--
--    UPDATE public.profiles
--    SET role = 'owner', full_name = 'Nama Anda'
--    WHERE email = 'email_anda@example.com';
--
-- Ganti email_anda@example.com dengan email user yang terdaftar.

-- =============================================
-- 8. Tabel Data Utama CMS Desa
-- =============================================
-- Jalankan section ini setelah section profiles/news/gallery di atas.
-- Script menggunakan IF NOT EXISTS dan ON CONFLICT sehingga aman dijalankan ulang.

CREATE TABLE IF NOT EXISTS public.desa_profile (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL,
  head_name TEXT NOT NULL DEFAULT '',
  district TEXT NOT NULL DEFAULT '',
  regency TEXT NOT NULL DEFAULT '',
  province TEXT NOT NULL DEFAULT '',
  motto TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  history TEXT NOT NULL DEFAULT '',
  data_year INTEGER NOT NULL DEFAULT 2026,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.desa_geography (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  area_ha NUMERIC(12, 3) NOT NULL DEFAULT 0,
  elevation TEXT NOT NULL DEFAULT '',
  rainfall TEXT NOT NULL DEFAULT '',
  temperature TEXT NOT NULL DEFAULT '',
  north_boundary TEXT NOT NULL DEFAULT '',
  east_boundary TEXT NOT NULL DEFAULT '',
  south_boundary TEXT NOT NULL DEFAULT '',
  west_boundary TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.desa_statistics (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  population INTEGER NOT NULL DEFAULT 0,
  male_population INTEGER NOT NULL DEFAULT 0,
  female_population INTEGER NOT NULL DEFAULT 0,
  households INTEGER NOT NULL DEFAULT 0,
  dusun INTEGER NOT NULL DEFAULT 0,
  rt INTEGER NOT NULL DEFAULT 0,
  data_year INTEGER NOT NULL DEFAULT 2026,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.desa_demographics (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  age_groups JSONB NOT NULL DEFAULT '[]'::jsonb,
  religions JSONB NOT NULL DEFAULT '[]'::jsonb,
  ethnicities JSONB NOT NULL DEFAULT '[]'::jsonb,
  marital_statuses JSONB NOT NULL DEFAULT '[]'::jsonb,
  occupations JSONB NOT NULL DEFAULT '[]'::jsonb,
  dusun_distribution JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.village_officials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  photo_path TEXT,
  period TEXT,
  welcome_text TEXT,
  dusun TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (position, name)
);

CREATE TABLE IF NOT EXISTS public.village_bpd (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  photo_url TEXT,
  photo_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (position, name)
);

CREATE TABLE IF NOT EXISTS public.village_potentials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  hero_image_url TEXT,
  hero_image_path TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_information (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  address TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  service_hours TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  google_maps_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hero_slides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  primary_action_label TEXT,
  primary_action_href TEXT,
  secondary_action_label TEXT,
  secondary_action_href TEXT,
  image_url TEXT,
  image_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated-at triggers
DROP TRIGGER IF EXISTS on_desa_profile_updated ON public.desa_profile;
CREATE TRIGGER on_desa_profile_updated BEFORE UPDATE ON public.desa_profile
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_desa_geography_updated ON public.desa_geography;
CREATE TRIGGER on_desa_geography_updated BEFORE UPDATE ON public.desa_geography
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_desa_statistics_updated ON public.desa_statistics;
CREATE TRIGGER on_desa_statistics_updated BEFORE UPDATE ON public.desa_statistics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_desa_demographics_updated ON public.desa_demographics;
CREATE TRIGGER on_desa_demographics_updated BEFORE UPDATE ON public.desa_demographics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_village_officials_updated ON public.village_officials;
CREATE TRIGGER on_village_officials_updated BEFORE UPDATE ON public.village_officials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_village_bpd_updated ON public.village_bpd;
CREATE TRIGGER on_village_bpd_updated BEFORE UPDATE ON public.village_bpd
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_village_potentials_updated ON public.village_potentials;
CREATE TRIGGER on_village_potentials_updated BEFORE UPDATE ON public.village_potentials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_contact_information_updated ON public.contact_information;
CREATE TRIGGER on_contact_information_updated BEFORE UPDATE ON public.contact_information
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_hero_slides_updated ON public.hero_slides;
CREATE TRIGGER on_hero_slides_updated BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_village_officials_active_order
  ON public.village_officials(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_village_bpd_active_order
  ON public.village_bpd(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_village_potentials_published_order
  ON public.village_potentials(is_published, sort_order);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order
  ON public.hero_slides(is_active, sort_order);

-- RLS untuk tabel data utama
ALTER TABLE public.desa_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desa_geography ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desa_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desa_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_bpd ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.village_potentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read desa profile" ON public.desa_profile;
CREATE POLICY "Public can read desa profile" ON public.desa_profile FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read desa geography" ON public.desa_geography;
CREATE POLICY "Public can read desa geography" ON public.desa_geography FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read desa statistics" ON public.desa_statistics;
CREATE POLICY "Public can read desa statistics" ON public.desa_statistics FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read desa demographics" ON public.desa_demographics;
CREATE POLICY "Public can read desa demographics" ON public.desa_demographics FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read active village officials" ON public.village_officials;
CREATE POLICY "Public can read active village officials" ON public.village_officials FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "Public can read active village bpd" ON public.village_bpd;
CREATE POLICY "Public can read active village bpd" ON public.village_bpd FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "Public can read published village potentials" ON public.village_potentials;
CREATE POLICY "Public can read published village potentials" ON public.village_potentials FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "Public can read contact information" ON public.contact_information;
CREATE POLICY "Public can read contact information" ON public.contact_information FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read active hero slides" ON public.hero_slides;
CREATE POLICY "Public can read active hero slides" ON public.hero_slides FOR SELECT TO anon, authenticated USING (is_active = true);

-- Authenticated users dapat mengelola seluruh data CMS utama.
DROP POLICY IF EXISTS "Authenticated can manage desa profile" ON public.desa_profile;
CREATE POLICY "Authenticated can manage desa profile" ON public.desa_profile FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can manage desa geography" ON public.desa_geography;
CREATE POLICY "Authenticated can manage desa geography" ON public.desa_geography FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can manage desa statistics" ON public.desa_statistics;
CREATE POLICY "Authenticated can manage desa statistics" ON public.desa_statistics FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can manage desa demographics" ON public.desa_demographics;
CREATE POLICY "Authenticated can manage desa demographics" ON public.desa_demographics FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can manage village officials" ON public.village_officials;
CREATE POLICY "Authenticated can manage village officials" ON public.village_officials FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can manage village bpd" ON public.village_bpd;
CREATE POLICY "Authenticated can manage village bpd" ON public.village_bpd FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can manage village potentials" ON public.village_potentials;
CREATE POLICY "Authenticated can manage village potentials" ON public.village_potentials FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can manage contact information" ON public.contact_information;
CREATE POLICY "Authenticated can manage contact information" ON public.contact_information FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can manage hero slides" ON public.hero_slides;
CREATE POLICY "Authenticated can manage hero slides" ON public.hero_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- 9. Seed Data CMS Desa
-- =============================================
-- Data mengikuti data/dummy.ts dan halaman publik saat ini.

INSERT INTO public.desa_profile
  (id, name, head_name, district, regency, province, motto, description, history, data_year)
VALUES (
  1,
  'Desa Bajawali',
  'Ketut Langga, S.Ag',
  'Lariang',
  'Pasangkayu',
  'Sulawesi Barat',
  'BAJAWALIKU JAYA',
  'Desa Bajawali berada di Kecamatan Lariang, Kabupaten Pasangkayu, Provinsi Sulawesi Barat. Website ini menjadi ruang informasi digital untuk mengenal profil desa, kehidupan masyarakat, potensi wilayah, kegiatan, dan perkembangan Desa Bajawali.',
  'Desa Bajawali terletak di Kecamatan Lariang, Kabupaten Pasangkayu, Provinsi Sulawesi Barat. Pada awalnya wilayah ini merupakan hutan belantara yang kemudian dibuka melalui program transmigrasi PIR. Warga ditempatkan pada periode 26 Desember 1991 sampai 12 Maret 1993 dan berada di bawah UPT Baras VII. Pada 26 Februari 1997, Desa Bajawali diserahkan kepada Pemerintah Daerah dan menjadi Desa Definitif. Nama Bajawali berasal dari kata Sanskerta JAVA dan BALI yang berarti kelahiran dan tempat berpijak.',
  2026
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  head_name = EXCLUDED.head_name,
  district = EXCLUDED.district,
  regency = EXCLUDED.regency,
  province = EXCLUDED.province,
  motto = EXCLUDED.motto,
  description = EXCLUDED.description,
  history = EXCLUDED.history,
  data_year = EXCLUDED.data_year;

INSERT INTO public.desa_geography
  (id, area_ha, elevation, rainfall, temperature, north_boundary, east_boundary, south_boundary, west_boundary, latitude, longitude)
VALUES (
  1,
  7125.816,
  '0–500 mdpl',
  '177,5 mm/tahun',
  '22°C–31°C',
  'Desa Parabu',
  'Desa Karave, Kecamatan Bulutaba',
  'HGU PT Unggul Widya Tek',
  'Desa Singgani',
  -1.4904673,
  119.3656846
)
ON CONFLICT (id) DO UPDATE SET
  area_ha = EXCLUDED.area_ha,
  elevation = EXCLUDED.elevation,
  rainfall = EXCLUDED.rainfall,
  temperature = EXCLUDED.temperature,
  north_boundary = EXCLUDED.north_boundary,
  east_boundary = EXCLUDED.east_boundary,
  south_boundary = EXCLUDED.south_boundary,
  west_boundary = EXCLUDED.west_boundary,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

INSERT INTO public.desa_statistics
  (id, population, male_population, female_population, households, dusun, rt, data_year)
VALUES (1, 835, 436, 399, 257, 4, 8, 2026)
ON CONFLICT (id) DO UPDATE SET
  population = EXCLUDED.population,
  male_population = EXCLUDED.male_population,
  female_population = EXCLUDED.female_population,
  households = EXCLUDED.households,
  dusun = EXCLUDED.dusun,
  rt = EXCLUDED.rt,
  data_year = EXCLUDED.data_year;

INSERT INTO public.desa_demographics
  (id, age_groups, religions, ethnicities, marital_statuses, occupations, dusun_distribution)
VALUES (
  1,
  '[{"label":"0-14","value":119},{"label":"15-24","value":143},{"label":"25-54","value":346},{"label":"55-64","value":102},{"label":"65+","value":52}]'::jsonb,
  '[{"label":"Islam","value":146},{"label":"Hindu","value":586},{"label":"Kristen","value":7},{"label":"Katholik","value":24}]'::jsonb,
  '[{"label":"Bali","value":585},{"label":"Bugis","value":59},{"label":"Jawa","value":75},{"label":"Tator","value":34},{"label":"Mandar","value":3}]'::jsonb,
  '[{"label":"Kawin","value":419},{"label":"Belum Kawin","value":319}]'::jsonb,
  '[{"label":"Petani Pekebun","value":null},{"label":"Peternak","value":null},{"label":"Pedagang","value":null},{"label":"Buruh Tani","value":null},{"label":"Kontruksi","value":null},{"label":"Pegawai","value":null}]'::jsonb,
  '[{"label":"Dusun Kerta","value":164},{"label":"Dusun Makmur","value":350},{"label":"Dusun Lestari","value":174},{"label":"Dusun Mandiri","value":77}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  age_groups = EXCLUDED.age_groups,
  religions = EXCLUDED.religions,
  ethnicities = EXCLUDED.ethnicities,
  marital_statuses = EXCLUDED.marital_statuses,
  occupations = EXCLUDED.occupations,
  dusun_distribution = EXCLUDED.dusun_distribution;

INSERT INTO public.village_officials
  (name, position, photo_url, photo_path, period, welcome_text, dusun, sort_order, is_active)
VALUES
  ('Ketut Langga, S.Ag', 'Kepala Desa', '/gambar/struktur/kepala-desa-bajawali.webp', '/gambar/struktur/kepala-desa-bajawali.webp', '2025', 'Memimpin penyelenggaraan pemerintahan, pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat desa.', NULL, 1, true),
  ('Kadek Wijaya', 'Sekretaris Desa', NULL, NULL, NULL, NULL, NULL, 2, true),
  ('I Gede Andi Suardika', 'Kaur Umum dan Perencanaan', '/gambar/struktur/I GEDE ANDI SUARDIKA.webp', '/gambar/struktur/I GEDE ANDI SUARDIKA.webp', NULL, NULL, NULL, 3, true),
  ('Andreas Stevanus H', 'Kaur Keuangan', NULL, NULL, NULL, NULL, NULL, 4, true),
  ('I Gede Agus Puja', 'Kasi Pemerintah', '/gambar/struktur/igede Agus puja.webp', '/gambar/struktur/igede Agus puja.webp', NULL, NULL, NULL, 5, true),
  ('Meilisa', 'Kasi Kesra & Pelayanan', '/gambar/struktur/Meilisa.webp', '/gambar/struktur/Meilisa.webp', NULL, NULL, NULL, 6, true),
  ('Ni Komang Ayu Tantri', 'Staf Kaur Keuangan', '/gambar/struktur/Ni km ayu Tantri.webp', '/gambar/struktur/Ni km ayu Tantri.webp', NULL, NULL, NULL, 7, true),
  ('Ni Made Pipi Saphira', 'Staf Kasi Kesra', '/gambar/struktur/NI MADE PIPI SAPHIRA.webp', '/gambar/struktur/NI MADE PIPI SAPHIRA.webp', NULL, NULL, NULL, 8, true),
  ('I Ketut Agus Darmadi', 'Kepala Dusun', '/gambar/struktur/I ketut agus darmadi.webp', '/gambar/struktur/I ketut agus darmadi.webp', NULL, NULL, 'Kerta', 9, true),
  ('Ni Komang Suartini', 'Kepala Dusun', '/gambar/struktur/Ni Komang Suartini.webp', '/gambar/struktur/Ni Komang Suartini.webp', NULL, NULL, 'Makmur', 10, true),
  ('I Wayan Juli Antara', 'Kepala Dusun', NULL, NULL, NULL, NULL, 'Lestari', 11, true),
  ('Kadek Rikin', 'Kepala Dusun', NULL, NULL, NULL, NULL, 'Mandiri', 12, true)
ON CONFLICT (position, name) DO UPDATE SET
  photo_url = EXCLUDED.photo_url,
  photo_path = EXCLUDED.photo_path,
  period = EXCLUDED.period,
  welcome_text = EXCLUDED.welcome_text,
  dusun = EXCLUDED.dusun,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

INSERT INTO public.village_bpd
  (name, position, photo_url, photo_path, sort_order, is_active)
VALUES
  ('I Made Mantik, S.Ag.', 'Ketua', NULL, NULL, 1, true),
  ('H. Imam Suhadi', 'Wakil Ketua', NULL, NULL, 2, true),
  ('Ni Kadek Arnila Wati', 'Sekretaris', NULL, NULL, 3, true),
  ('I Gede Sugiarto', 'Anggota', NULL, NULL, 4, true),
  ('I Kadek Oerdi Arisona', 'Anggota', NULL, NULL, 5, true)
ON CONFLICT (position, name) DO UPDATE SET
  photo_url = EXCLUDED.photo_url,
  photo_path = EXCLUDED.photo_path,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

INSERT INTO public.village_potentials
  (title, slug, category, description, content, hero_image_url, hero_image_path, is_published, sort_order)
VALUES
  ('Pertanian & Perkebunan', 'pertanian', 'Pertanian', 'Kelapa sawit sebagai komoditas andalan masyarakat Desa Bajawali.', 'Sektor pertanian dan perkebunan merupakan tulang punggung ekonomi masyarakat.', 'https://images.pexels.com/photos/1576398/pexels-photo-1576398.jpeg?auto=compress&cs=tinysrgb&w=1200', NULL, true, 1),
  ('UMKM & Ekonomi Desa', 'umkm', 'UMKM', 'Ekonomi desa ditopang BUMDesa, kelompok tani, Gapoktan, dan kelompok ternak.', 'Penggerak ekonomi warga mencakup usaha mikro, kecil, dan menengah.', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop', NULL, true, 2),
  ('Pariwisata Alam', 'pariwisata', 'Pariwisata', 'Potensi alam dan budaya yang dapat dikelola secara berkelanjutan.', 'Potensi wisata alam dan budaya Desa Bajawali.', NULL, NULL, true, 3),
  ('Perikanan', 'perikanan', 'Perikanan', 'Informasi sektor perikanan Desa Bajawali.', 'Sektor perikanan Desa Bajawali.', NULL, NULL, true, 4),
  ('Sumber Daya Alam', 'sumber-daya-alam', 'Sumber Daya Alam', 'Luas wilayah, ketinggian, curah hujan, dan suhu Desa Bajawali.', 'Sumber daya alam Desa Bajawali.', NULL, NULL, true, 5)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  hero_image_url = EXCLUDED.hero_image_url,
  hero_image_path = EXCLUDED.hero_image_path,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.contact_information
  (id, address, email, whatsapp, service_hours, latitude, longitude, google_maps_url)
VALUES (
  1,
  'Kantor Desa Bajawali, Kecamatan Lariang, Kabupaten Pasangkayu, Provinsi Sulawesi Barat',
  'desabajawali2@gmail.com',
  '+62 857-5606-3460',
  'Senin–Jumat: 08.00–15.00 WITA',
  -1.4904673,
  119.3656846,
  'https://www.google.com/maps/place/Bajawali,+Kec.+Lariang,+Kab.+Pasangkayu,+Sulawesi+Barat'
)
ON CONFLICT (id) DO UPDATE SET
  address = EXCLUDED.address,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  service_hours = EXCLUDED.service_hours,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  google_maps_url = EXCLUDED.google_maps_url;

INSERT INTO public.hero_slides
  (id, title, subtitle, description, primary_action_label, primary_action_href, secondary_action_label, secondary_action_href, image_url, image_path, sort_order, is_active)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Selamat Datang di Website Desa Bajawali', 'DESA BAJAWALI · KECAMATAN LARIANG', 'Ruang informasi digital untuk mengenal profil desa, kehidupan masyarakat, potensi wilayah, dan perkembangan Desa Bajawali secara transparan dan aktual.', 'Profil Desa', '/profil', 'Informasi Desa', '/data-desa', '/gambar/background/background_1.webp', '/gambar/background/background_1.webp', 1, true),
  ('10000000-0000-0000-0000-000000000002', 'Potensi Pertanian & Alam yang Melimpah', 'KEKAYAAN ALAM DESA', 'Mendukung ekonomi warga melalui hasil bumi unggulan dan menjaga keseimbangan alam untuk kehidupan yang berkelanjutan.', 'Lihat Potensi', '/potensi/pertanian', 'Galeri Desa', '/galeri', '/gambar/background/background_2baru.webp', '/gambar/background/background_2baru.webp', 2, true),
  ('10000000-0000-0000-0000-000000000003', 'Gotong Royong Membangun Desa', 'KEGIATAN MASYARAKAT', 'Kolaborasi antara pemerintah desa dan warga untuk mewujudkan lingkungan yang aman, bersih, dan sejahtera bagi semua.', 'Kabar Desa', '/berita', 'Hubungi Kami', '/kontak', '/gambar/background/background_3.webp', '/gambar/background/background_3.webp', 3, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  primary_action_label = EXCLUDED.primary_action_label,
  primary_action_href = EXCLUDED.primary_action_href,
  secondary_action_label = EXCLUDED.secondary_action_label,
  secondary_action_href = EXCLUDED.secondary_action_href,
  image_url = EXCLUDED.image_url,
  image_path = EXCLUDED.image_path,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- Seed berita lokal agar dashboard/public listing tidak kosong.
INSERT INTO public.news
  (title, slug, excerpt, content, category, image_url, image_path, published_at, is_published)
VALUES
  ('Penyerahan Hibah Motor kepada Umat Hindu dan Umat Islam', 'penyerahan-hibah-motor-kepada-umat-hindu-dan-umat-islam', E'Pemerintah Desa Bajawali melaksanakan penyerahan hibah kendaraan motor kepada umat Hindu dan umat Islam sebagai bagian dari dukungan terhadap kegiatan keagamaan dan pelayanan masyarakat di Desa Bajawali.', E'Pemerintah Desa Bajawali melaksanakan penyerahan hibah kendaraan motor kepada umat Hindu dan umat Islam sebagai bagian dari dukungan terhadap kegiatan keagamaan dan pelayanan masyarakat di Desa Bajawali. Penyerahan ini diharapkan dapat membantu menunjang mobilitas serta pelaksanaan kegiatan keagamaan masing-masing umat, sekaligus memperkuat kerukunan antarumat beragama yang selama ini terjalin dengan baik di Desa Bajawali.\n\nHibah kendaraan tersebut diharapkan dimanfaatkan sebaik-baiknya untuk mendukung operasional kegiatan kemasyarakatan, antara lain antar-jemput pelaksanaan kegiatan keagamaan, distribusi bantuan, serta mobilitas pengurus organisasi keagamaan di lingkungan desa. Penyerahan dilakukan secara simbolis di Kantor Desa Bajawali dan dihadiri oleh perangkat desa beserta tokoh masyarakat dari masing-masing umat.', 'Pemerintahan', '/gambar/galeri/galeri_2.webp', '/gambar/galeri/galeri_2.webp', '2026-09-22T08:00:00+08', true),
  ('Penyerahan BPJS Ketenagakerjaan kepada Pegawainsara', 'penyerahan-bpjs-ketenagakerjaan-kepada-pegawainsara', E'Pemerintah Desa Bajawali melaksanakan kegiatan penyerahan BPJS Ketenagakerjaan kepada Pegawainsara sebagai bentuk perhatian terhadap perlindungan dan jaminan sosial bagi masyarakat yang menjalankan peran dalam kegiatan keagamaan.', E'Pemerintah Desa Bajawali melaksanakan kegiatan penyerahan BPJS Ketenagakerjaan kepada Pegawainsara sebagai bentuk perhatian terhadap perlindungan dan jaminan sosial bagi masyarakat yang menjalankan peran dalam kegiatan keagamaan. Melalui kepesertaan BPJS Ketenagakerjaan, diharapkan penerima memperoleh perlindungan dalam menjalankan aktivitasnya serta dapat melaksanakan tugas dan pengabdian kepada masyarakat dengan lebih aman.\n\nKegiatan penyerahan ini sekaligus menjadi ajang sosialisasi tentang manfaat program jaminan sosial ketenagakerjaan, mulai dari jaminan kecelakaan kerja, jaminan hari tua, hingga santunan bagi peserta dan ahli warisnya. Dengan adanya perlindungan tersebut, para penerima diharapkan tidak lagi ragu dalam menjalankan tugas lapangan yang menuntut aktivitas fisik.\n\nPemerintah Desa Bajawali berkomitmen untuk terus memperluas cakupan perlindungan jaminan sosial bagi warganya, agar setiap pihak yang berkontribusi bagi kemajuan desa merasa aman dan dijamin kesejahteraannya.', 'Pemerintahan', '/gambar/galeri/galeri_6.webp', '/gambar/galeri/galeri_6.webp', '2026-09-22T08:00:00+08', true),
  ('Sosialisasi Surat Tanda Daftar Budidaya (STD-B)', 'sosialisasi-surat-tanda-daftar-budidaya-std-b', E'Desa Bajawali mengikuti kegiatan sosialisasi Surat Tanda Daftar Budidaya (STD-B) tingkat berkebun dalam rangka penanganan Dana Bagi Hasil (DBH) Sawit Kabupaten Pasangkayu.', E'Desa Bajawali mengikuti kegiatan sosialisasi Surat Tanda Daftar Budidaya (STD-B) tingkat berkebun dalam rangka penanganan Dana Bagi Hasil (DBH) Sawit Kabupaten Pasangkayu. Kegiatan ini diselenggarakan oleh Dinas Perkebunan dan Peternakan Kabupaten Pasangkayu Tahun Anggaran 2026 sebagai upaya memberikan pemahaman kepada masyarakat mengenai pendataan dan administrasi kegiatan budidaya perkebunan, khususnya yang berkaitan dengan komoditas kelapa sawit.\n\nSosialisasi memaparkan tata cara pengurusan STD-B, mulai dari persyaratan dokumen, alur pendaftaran, hingga peran kelompok pekebun dalam pendataan lahan. STD-B sendiri menjadi dokumen penting sebagai bukti legalitas usaha budidaya pekebun, yang sekaligus menjadi salah satu prasyarat dalam penyaluran Dana Bagi Hasil (DBH) Sawit kepada daerah.\n\nBagi pekebun Desa Bajawali, kegiatan ini memberikan kejelasan langkah administrasi yang harus dilakukan agar hak atas hasil kebun mereka dapat tercatat dan terlayani dengan baik. Pemerintah Desa Bajawali akan mendampingi warga dalam proses pendataan tersebut, sehingga seluruh pekebun di desa dapat terdaftar dan memperoleh manfaatnya.', 'Pertanian', '/gambar/galeri/galeri_9.webp', '/gambar/galeri/galeri_9.webp', '2026-09-22T08:00:00+08', true)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  image_path = EXCLUDED.image_path,
  published_at = EXCLUDED.published_at,
  is_published = EXCLUDED.is_published;

-- Seed galeri lokal. ID dibuat deterministik agar seed aman dijalankan ulang.
INSERT INTO public.gallery
  (id, title, caption, category, image_url, image_path, is_published)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Peringatan Hari Ulang Tahun (Dirgahayu) RI ke-80', 'Peringatan Hari Ulang Tahun (Dirgahayu) RI ke-80', 'Kegiatan Masyarakat', '/gambar/galeri/galeri_1.webp', '/gambar/galeri/galeri_1.webp', true),
  ('00000000-0000-0000-0000-000000000002', 'Penyerahan Bantuan Hibah Sepeda Motor untuk Umat Hindu', 'Penyerahan Bantuan Hibah Sepeda Motor untuk Umat Hindu', 'Keagamaan', '/gambar/galeri/galeri_2.webp', '/gambar/galeri/galeri_2.webp', true),
  ('00000000-0000-0000-0000-000000000003', 'Penyerahan Bantuan Hibah Sepeda Motor untuk Umat Islam', 'Penyerahan Bantuan Hibah Sepeda Motor untuk Umat Islam', 'Keagamaan', '/gambar/galeri/galeri_3.webp', '/gambar/galeri/galeri_3.webp', true),
  ('00000000-0000-0000-0000-000000000004', 'Foto Kebersamaan dan Dokumentasi Bersama Warga', 'Foto Kebersamaan dan Dokumentasi Bersama Warga', 'Kegiatan Masyarakat', '/gambar/galeri/galeri_4.webp', '/gambar/galeri/galeri_4.webp', true),
  ('00000000-0000-0000-0000-000000000005', 'Aksi Gotong Royong Penambalan Jalan Berlubang', 'Aksi Gotong Royong Penambalan Jalan Berlubang', 'Infrastruktur', '/gambar/galeri/galeri_5.webp', '/gambar/galeri/galeri_5.webp', true),
  ('00000000-0000-0000-0000-000000000006', 'Penyerahan Kartu BPJS Ketenagakerjaan bagi Pegawai', 'Penyerahan Kartu BPJS Ketenagakerjaan bagi Pegawai', 'Pemerintahan', '/gambar/galeri/galeri_6.webp', '/gambar/galeri/galeri_6.webp', true),
  ('00000000-0000-0000-0000-000000000007', 'Dokumentasi Silaturahmi dan Kebersamaan Warga', 'Dokumentasi Silaturahmi dan Kebersamaan Warga', 'Kegiatan Masyarakat', '/gambar/galeri/galeri_7.webp', '/gambar/galeri/galeri_7.webp', true),
  ('00000000-0000-0000-0000-000000000008', 'Pelaksanaan Kegiatan Kelas Ibu Hamil Desa Bajawali', 'Pelaksanaan Kegiatan Kelas Ibu Hamil Desa Bajawali', 'Kesehatan', '/gambar/galeri/galeri_8.webp', '/gambar/galeri/galeri_8.webp', true),
  ('00000000-0000-0000-0000-000000000009', 'Sosialisasi Surat Tanda Daftar Budidaya (STD-B)', 'Sosialisasi Surat Tanda Daftar Budidaya (STD-B)', 'Pemerintahan', '/gambar/galeri/galeri_9.webp', '/gambar/galeri/galeri_9.webp', true),
  ('00000000-0000-0000-0000-000000000010', 'Peringatan Hari Pramuka Desa Bajawali', 'Peringatan Hari Pramuka Desa Bajawali', 'Pemuda', '/gambar/galeri/galeri_10.webp', '/gambar/galeri/galeri_10.webp', true),
  ('00000000-0000-0000-0000-000000000011', 'Gotong Royong Pembersihan Area Kantor Desa', 'Gotong Royong Pembersihan Area Kantor Desa', 'Pemerintahan', '/gambar/galeri/galeri_11.webp', '/gambar/galeri/galeri_11.webp', true),
  ('00000000-0000-0000-0000-000000000012', 'Panen Kelapa Sawit Bersama secara Gotong Royong', 'Panen Kelapa Sawit Bersama secara Gotong Royong', 'Potensi Alam', '/gambar/galeri/galeri_12.webp', '/gambar/galeri/galeri_12.webp', true),
  ('00000000-0000-0000-0000-000000000013', 'Pemanenan Kelapa Sawit oleh Petani Desa Bajawali', 'Pemanenan Kelapa Sawit oleh Petani Desa Bajawali', 'Potensi Alam', '/gambar/galeri/galeri_13.webp', '/gambar/galeri/galeri_13.webp', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  caption = EXCLUDED.caption,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  image_path = EXCLUDED.image_path,
  is_published = EXCLUDED.is_published;

-- =============================================
-- 10. Verifikasi Data CMS
-- =============================================
-- Jalankan query berikut setelah migration:
--
-- SELECT * FROM public.desa_profile;
-- SELECT * FROM public.desa_geography;
-- SELECT * FROM public.desa_statistics;
-- SELECT * FROM public.desa_demographics;
-- SELECT * FROM public.village_officials ORDER BY sort_order;
-- SELECT * FROM public.village_bpd ORDER BY sort_order;
-- SELECT * FROM public.village_potentials ORDER BY sort_order;
-- SELECT * FROM public.contact_information;
-- SELECT * FROM public.hero_slides ORDER BY sort_order;
