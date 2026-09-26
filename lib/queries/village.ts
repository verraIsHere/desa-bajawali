import { createClient } from '@/lib/supabase/server'
import { isSupabaseSource } from '@/lib/data-source'
import { desaInfo } from '@/data/dummy'
import type {
  ContactInformation,
  DesaDemographics,
  DesaGeography,
  DesaProfile,
  DesaStatistics,
  HeroSlide,
  VillageBpdMember,
  VillageOfficial,
  VillagePotential,
} from '@/types/database'

const fallbackTimestamp = '2026-01-01T00:00:00+08:00'

const strukturPhotoDir = '/gambar/struktur'

// Foto perangkat desa disimpan di public/gambar/struktur dengan nama file
// mengikuti nama pejabat. Dipakai sebagai fallback ketika photo_url kosong.
const localOfficialPhotos: Record<string, string> = {
  'ketut langga': `${strukturPhotoDir}/kepala-desa-bajawali.webp`,
  'kadek wijaya': `${strukturPhotoDir}/Kadek Wijaya.webp`,
  'i gede andi suardika': `${strukturPhotoDir}/I GEDE ANDI SUARDIKA.webp`,
  'andreas stevanus h': `${strukturPhotoDir}/Andreas Stevanus H.webp`,
  'i gede agus puja': `${strukturPhotoDir}/igede Agus puja.webp`,
  meilisa: `${strukturPhotoDir}/Meilisa.webp`,
  'ni komang ayu tantri': `${strukturPhotoDir}/Ni km ayu Tantri.webp`,
  'ni made pipi saphira': `${strukturPhotoDir}/NI MADE PIPI SAPHIRA.webp`,
  'i ketut agus darmadi': `${strukturPhotoDir}/I ketut agus darmadi.webp`,
  'ni komang suartini': `${strukturPhotoDir}/Ni Komang Suartini.webp`,
  'i wayan juli antara': `${strukturPhotoDir}/I Wayan Juli Antara.webp`,
  'kadek rikin': `${strukturPhotoDir}/Kadek Rikin.webp`,
}

const normalizeName = (name: string) =>
  name
    .replace(/,.*$/, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

function withLocalPhoto<T extends { name: string; photo_url: string | null; photo_path: string | null }>(
  official: T,
): T {
  if (official.photo_url || official.photo_path) return official
  const localPhoto = localOfficialPhotos[normalizeName(official.name)]
  if (!localPhoto) return official
  return { ...official, photo_url: localPhoto, photo_path: localPhoto }
}

const fallbackProfile: DesaProfile = {
  id: 1,
  name: desaInfo.name,
  head_name: desaInfo.kepalaDesa,
  district: desaInfo.kecamatan,
  regency: desaInfo.kabupaten,
  province: desaInfo.provinsi,
  motto: desaInfo.moto,
  description:
    'Desa Bajawali berada di Kecamatan Lariang, Kabupaten Pasangkayu, Provinsi Sulawesi Barat. Website ini menjadi ruang informasi digital untuk mengenal profil desa, kehidupan masyarakat, potensi wilayah, kegiatan, dan perkembangan Desa Bajawali.',
  history:
    'Desa Bajawali terletak di Kecamatan Lariang, Kabupaten Pasangkayu, Provinsi Sulawesi Barat. Pada awalnya wilayah ini merupakan hutan belantara yang kemudian dibuka melalui program transmigrasi PIR. Warga ditempatkan pada periode 26 Desember 1991 sampai 12 Maret 1993 dan berada di bawah UPT Baras VII. Pada 26 Februari 1997, Desa Bajawali diserahkan kepada Pemerintah Daerah dan menjadi Desa Definitif. Nama Bajawali berasal dari kata Sanskerta JAVA dan BALI yang berarti kelahiran dan tempat berpijak.',
  data_year: Number(desaInfo.tahunData),
  created_at: fallbackTimestamp,
  updated_at: fallbackTimestamp,
}

const fallbackGeography: DesaGeography = {
  id: 1,
  area_ha: 7125.816,
  elevation: desaInfo.ketinggian,
  rainfall: desaInfo.curahHujan,
  temperature: desaInfo.suhu,
  north_boundary: 'Desa Parabu',
  east_boundary: 'Desa Karave, Kecamatan Bulutaba',
  south_boundary: 'HGU PT Unggul Widya Tek',
  west_boundary: 'Desa Singgani',
  latitude: -1.4904673,
  longitude: 119.3656846,
  created_at: fallbackTimestamp,
  updated_at: fallbackTimestamp,
}

const fallbackStatistics: DesaStatistics = {
  id: 1,
  population: Number(desaInfo.penduduk),
  male_population: Number(desaInfo.lakiLaki),
  female_population: Number(desaInfo.perempuan),
  households: Number(desaInfo.kk),
  dusun: Number(desaInfo.dusun),
  rt: Number(desaInfo.rt),
  data_year: Number(desaInfo.tahunData),
  created_at: fallbackTimestamp,
  updated_at: fallbackTimestamp,
}

const fallbackDemographics: DesaDemographics = {
  id: 1,
  age_groups: [
    { label: '0-14', value: 119 },
    { label: '15-24', value: 143 },
    { label: '25-54', value: 346 },
    { label: '55-64', value: 102 },
    { label: '65+', value: 52 },
  ],
  religions: [
    { label: 'Islam', value: 146 },
    { label: 'Hindu', value: 586 },
    { label: 'Kristen', value: 7 },
    { label: 'Katholik', value: 24 },
  ],
  ethnicities: [
    { label: 'Bali', value: 585 },
    { label: 'Bugis', value: 59 },
    { label: 'Jawa', value: 75 },
    { label: 'Tator', value: 34 },
    { label: 'Mandar', value: 3 },
  ],
  marital_statuses: [
    { label: 'Kawin', value: 419 },
    { label: 'Belum Kawin', value: 319 },
  ],
  occupations: [
    { label: 'Petani Pekebun', value: null },
    { label: 'Peternak', value: null },
    { label: 'Pedagang', value: null },
    { label: 'Buruh Tani', value: null },
    { label: 'Kontruksi', value: null },
    { label: 'Pegawai', value: null },
  ],
  dusun_distribution: [
    { label: 'Dusun Kerta', value: 164 },
    { label: 'Dusun Makmur', value: 350 },
    { label: 'Dusun Lestari', value: 174 },
    { label: 'Dusun Mandiri', value: 77 },
  ],
  created_at: fallbackTimestamp,
  updated_at: fallbackTimestamp,
}

const fallbackContact: ContactInformation = {
  id: 1,
  address: 'Kantor Desa Bajawali, Kecamatan Lariang, Kabupaten Pasangkayu, Provinsi Sulawesi Barat',
  email: 'desabajawali2@gmail.com',
  whatsapp: '+62 857-5606-3460',
  service_hours: 'Senin–Jumat: 08.00–15.00 WITA',
  latitude: -1.4904673,
  longitude: 119.3656846,
  google_maps_url:
    'https://www.google.com/maps/place/Bajawali,+Kec.+Lariang,+Kab.+Pasangkayu,+Sulawesi+Barat',
  created_at: fallbackTimestamp,
  updated_at: fallbackTimestamp,
}

const fallbackHeroSlides: HeroSlide[] = [
  {
    id: 'fallback-1',
    title: 'Selamat Datang di Website Desa Bajawali',
    subtitle: 'DESA BAJAWALI · KECAMATAN LARIANG',
    description: 'Ruang informasi digital untuk mengenal profil desa, kehidupan masyarakat, potensi wilayah, dan perkembangan Desa Bajawali.',
    primary_action_label: 'Profil Desa',
    primary_action_href: '/profil',
    secondary_action_label: 'Informasi Desa',
    secondary_action_href: '/data-desa',
    image_url: '/gambar/background/background_1.webp',
    image_path: '/gambar/background/background_1.webp',
    sort_order: 1,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-2',
    title: 'Potensi Pertanian & Alam yang Melimpah',
    subtitle: 'KEKAYAAN ALAM DESA',
    description: 'Mendukung ekonomi warga melalui hasil bumi unggulan dan menjaga keseimbangan alam untuk kehidupan yang berkelanjutan.',
    primary_action_label: 'Lihat Potensi',
    primary_action_href: '/potensi/pertanian',
    secondary_action_label: 'Galeri Desa',
    secondary_action_href: '/galeri',
    image_url: '/gambar/background/background_2baru.webp',
    image_path: '/gambar/background/background_2baru.webp',
    sort_order: 2,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-3',
    title: 'Gotong Royong Membangun Desa',
    subtitle: 'KEGIATAN MASYARAKAT',
    description: 'Kolaborasi antara pemerintah desa dan warga untuk mewujudkan lingkungan yang aman, bersih, dan sejahtera bagi semua.',
    primary_action_label: 'Kabar Desa',
    primary_action_href: '/berita',
    secondary_action_label: 'Hubungi Kami',
    secondary_action_href: '/kontak',
    image_url: '/gambar/background/background_3.webp',
    image_path: '/gambar/background/background_3.webp',
    sort_order: 3,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
]

const fallbackPotentials: VillagePotential[] = [
  {
    id: 'fallback-1',
    title: 'Pertanian & Perkebunan',
    slug: 'pertanian',
    category: 'Pertanian',
    description: 'Kelapa sawit sebagai komoditas andalan masyarakat Desa Bajawali.',
    content: 'Sektor pertanian dan perkebunan merupakan tulang punggung ekonomi masyarakat.',
    hero_image_url: null,
    hero_image_path: null,
    is_published: true,
    sort_order: 1,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-2',
    title: 'UMKM & Ekonomi Desa',
    slug: 'umkm',
    category: 'UMKM',
    description: 'Ekonomi desa ditopang BUMDesa, kelompok tani, Gapoktan, dan kelompok ternak.',
    content: 'Penggerak ekonomi warga mencakup usaha mikro, kecil, dan menengah.',
    hero_image_url: null,
    hero_image_path: null,
    is_published: true,
    sort_order: 2,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-3',
    title: 'Pariwisata Alam',
    slug: 'pariwisata',
    category: 'Pariwisata',
    description: 'Potensi alam dan budaya yang dapat dikelola secara berkelanjutan.',
    content: 'Potensi wisata alam dan budaya Desa Bajawali.',
    hero_image_url: null,
    hero_image_path: null,
    is_published: true,
    sort_order: 3,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
]

const fallbackOfficials: VillageOfficial[] = [
  {
    id: 'fallback-official-1',
    name: 'Ketut Langga, S.Ag',
    position: 'Kepala Desa',
    photo_url: '/gambar/struktur/kepala-desa-bajawali.webp',
    photo_path: '/gambar/struktur/kepala-desa-bajawali.webp',
    period: '2025',
    welcome_text:
      'Memimpin penyelenggaraan pemerintahan, pembangunan, pembinaan kemasyarakatan, dan pemberdayaan masyarakat desa.',
    dusun: null,
    sort_order: 1,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-2',
    name: 'Kadek Wijaya',
    position: 'Sekretaris Desa',
    photo_url: null,
    photo_path: null,
    period: null,
    welcome_text: null,
    dusun: null,
    sort_order: 2,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-3',
    name: 'I Gede Andi Suardika',
    position: 'Kaur Umum dan Perencanaan',
    photo_url: '/gambar/struktur/I GEDE ANDI SUARDIKA.webp',
    photo_path: '/gambar/struktur/I GEDE ANDI SUARDIKA.webp',
    period: null,
    welcome_text: null,
    dusun: null,
    sort_order: 3,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-4',
    name: 'Andreas Stevanus H',
    position: 'Kaur Keuangan',
    photo_url: null,
    photo_path: null,
    period: null,
    welcome_text: null,
    dusun: null,
    sort_order: 4,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-5',
    name: 'I Gede Agus Puja',
    position: 'Kasi Pemerintah',
    photo_url: '/gambar/struktur/igede Agus puja.webp',
    photo_path: '/gambar/struktur/igede Agus puja.webp',
    period: null,
    welcome_text: null,
    dusun: null,
    sort_order: 5,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-6',
    name: 'Meilisa',
    position: 'Kasi Kesra & Pelayanan',
    photo_url: '/gambar/struktur/Meilisa.webp',
    photo_path: '/gambar/struktur/Meilisa.webp',
    period: null,
    welcome_text: null,
    dusun: null,
    sort_order: 6,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-7',
    name: 'Ni Komang Ayu Tantri',
    position: 'Staf Kaur Keuangan',
    photo_url: '/gambar/struktur/Ni km ayu Tantri.webp',
    photo_path: '/gambar/struktur/Ni km ayu Tantri.webp',
    period: null,
    welcome_text: null,
    dusun: null,
    sort_order: 7,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-8',
    name: 'Ni Made Pipi Saphira',
    position: 'Staf Kasi Kesra',
    photo_url: '/gambar/struktur/NI MADE PIPI SAPHIRA.webp',
    photo_path: '/gambar/struktur/NI MADE PIPI SAPHIRA.webp',
    period: null,
    welcome_text: null,
    dusun: null,
    sort_order: 8,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-9',
    name: 'I Ketut Agus Darmadi',
    position: 'Kepala Dusun',
    photo_url: '/gambar/struktur/I ketut agus darmadi.webp',
    photo_path: '/gambar/struktur/I ketut agus darmadi.webp',
    period: null,
    welcome_text: null,
    dusun: 'Kerta',
    sort_order: 9,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-10',
    name: 'Ni Komang Suartini',
    position: 'Kepala Dusun',
    photo_url: '/gambar/struktur/Ni Komang Suartini.webp',
    photo_path: '/gambar/struktur/Ni Komang Suartini.webp',
    period: null,
    welcome_text: null,
    dusun: 'Makmur',
    sort_order: 10,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-11',
    name: 'I Wayan Juli Antara',
    position: 'Kepala Dusun',
    photo_url: null,
    photo_path: null,
    period: null,
    welcome_text: null,
    dusun: 'Lestari',
    sort_order: 11,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
  {
    id: 'fallback-official-12',
    name: 'Kadek Rikin',
    position: 'Kepala Dusun',
    photo_url: null,
    photo_path: null,
    period: null,
    welcome_text: null,
    dusun: 'Mandiri',
    sort_order: 12,
    is_active: true,
    created_at: fallbackTimestamp,
    updated_at: fallbackTimestamp,
  },
]

const fallbackBpd: VillageBpdMember[] = [
  ['I Made Mantik, S.Ag.', 'Ketua'],
  ['H. Imam Suhadi', 'Wakil Ketua'],
  ['Ni Kadek Arnila Wati', 'Sekretaris'],
  ['I Gede Sugiarto', 'Anggota'],
  ['I Kadek Perdi Arisona', 'Anggota'],
].map(([name, position], index) => ({
  id: `fallback-bpd-${index + 1}`,
  name,
  position,
  photo_url: null,
  photo_path: null,
  sort_order: index + 1,
  is_active: true,
  created_at: fallbackTimestamp,
  updated_at: fallbackTimestamp,
}))

async function getClient() {
  try {
    return await createClient()
  } catch {
    return null
  }
}

async function getSingle<T>(table: string): Promise<T | null> {
  const supabase = await getClient()
  if (!supabase) return null

  const { data, error } = await supabase.from(table).select('*').limit(1).maybeSingle()
  if (error || !data) return null
  return data as unknown as T
}

async function getList<T>(table: string, orderColumn = 'sort_order'): Promise<T[]> {
  const supabase = await getClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderColumn, { ascending: true })
  if (error || !data) return []
  return data as unknown as T[]
}

export async function getPublicVillageProfile(): Promise<DesaProfile> {
  if (!isSupabaseSource('profile')) return fallbackProfile
  return (await getSingle<DesaProfile>('desa_profile')) ?? fallbackProfile
}

export async function getPublicVillageGeography(): Promise<DesaGeography> {
  if (!isSupabaseSource('infrastructure')) return fallbackGeography
  return (await getSingle<DesaGeography>('desa_geography')) ?? fallbackGeography
}

export async function getPublicVillageStatistics(): Promise<DesaStatistics> {
  if (!isSupabaseSource('demographic')) return fallbackStatistics
  return (await getSingle<DesaStatistics>('desa_statistics')) ?? fallbackStatistics
}

export async function getPublicVillageDemographics(): Promise<DesaDemographics> {
  if (!isSupabaseSource('demographic')) return fallbackDemographics
  return (await getSingle<DesaDemographics>('desa_demographics')) ?? fallbackDemographics
}

export async function getPublicContactInformation(): Promise<ContactInformation> {
  if (!isSupabaseSource('website')) return fallbackContact
  return (await getSingle<ContactInformation>('contact_information')) ?? fallbackContact
}

export async function getPublicHeroSlides(): Promise<HeroSlide[]> {
  if (!isSupabaseSource('website')) return fallbackHeroSlides
  const slides = await getList<HeroSlide>('hero_slides')
  const activeSlides = slides.filter((slide) => slide.is_active)
  return activeSlides.length > 0 ? activeSlides : fallbackHeroSlides
}

export async function getPublishedPotentials(): Promise<VillagePotential[]> {
  if (!isSupabaseSource('potential')) return fallbackPotentials
  const potentials = await getList<VillagePotential>('village_potentials')
  const publishedPotentials = potentials.filter((potential) => potential.is_published)
  return publishedPotentials.length > 0 ? publishedPotentials : fallbackPotentials
}

export async function getPublicVillageStructure() {
  if (!isSupabaseSource('government')) {
    return {
      officials: fallbackOfficials.map(withLocalPhoto),
      bpd: fallbackBpd,
    }
  }

  const [officials, bpd] = await Promise.all([
    getList<VillageOfficial>('village_officials'),
    getList<VillageBpdMember>('village_bpd'),
  ])
  const activeOfficials = officials.filter((official) => official.is_active)
  const activeBpd = bpd.filter((member) => member.is_active)

  return {
    officials:
      activeOfficials.length > 0 ? activeOfficials.map(withLocalPhoto) : fallbackOfficials.map(withLocalPhoto),
    bpd: activeBpd.length > 0 ? activeBpd : fallbackBpd,
  }
}
