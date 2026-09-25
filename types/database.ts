// =============================================
// Database Types for Supabase
// =============================================

export type UserRole = 'owner' | 'developer' | 'administrator'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type NewsCategory =
  | 'Pemerintahan'
  | 'Kegiatan Masyarakat'
  | 'Pembangunan'
  | 'Pertanian'
  | 'Pelayanan'
  | 'Pemuda'
  | 'Pendidikan/KKN'
  | 'Sosial-Budaya'

export const NEWS_CATEGORIES: NewsCategory[] = [
  'Pemerintahan',
  'Kegiatan Masyarakat',
  'Pembangunan',
  'Pertanian',
  'Pelayanan',
  'Pemuda',
  'Pendidikan/KKN',
  'Sosial-Budaya',
]

export interface News {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: NewsCategory
  image_url: string | null
  image_path: string | null
  author_id: string
  published_at: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  // Joined fields
  author?: Profile
}

export type GalleryCategory =
  | 'Pemerintahan'
  | 'Kegiatan Masyarakat'
  | 'Pembangunan'
  | 'Pelayanan'
  | 'Sosial'
  | 'Pendidikan'
  | 'Budaya'
  | 'Keagamaan'
  | 'Infrastruktur'
  | 'Kesehatan'
  | 'Pemuda'
  | 'Potensi Alam'
  | 'Lainnya'

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Pemerintahan',
  'Kegiatan Masyarakat',
  'Pembangunan',
  'Pelayanan',
  'Sosial',
  'Pendidikan',
  'Budaya',
  'Keagamaan',
  'Infrastruktur',
  'Kesehatan',
  'Pemuda',
  'Potensi Alam',
  'Lainnya',
]

export interface GalleryItem {
  id: string
  title: string
  caption: string | null
  category: GalleryCategory
  image_url: string
  image_path: string
  taken_at: string | null
  photographer: string | null
  is_published: boolean
  created_by: string
  created_at: string
  updated_at: string
  // Joined fields
  creator?: Profile
}

export type PotentialCategory =
  | 'Pertanian'
  | 'Perikanan'
  | 'UMKM'
  | 'Pariwisata'
  | 'Sumber Daya Alam'

export interface DesaProfile {
  id: number
  name: string
  head_name: string
  district: string
  regency: string
  province: string
  motto: string
  description: string
  history: string
  data_year: number
  created_at: string
  updated_at: string
}

export interface DesaGeography {
  id: number
  area_ha: number
  elevation: string
  rainfall: string
  temperature: string
  north_boundary: string
  east_boundary: string
  south_boundary: string
  west_boundary: string
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at: string
}

export interface DesaStatistics {
  id: number
  population: number
  male_population: number
  female_population: number
  households: number
  dusun: number
  rt: number
  data_year: number
  created_at: string
  updated_at: string
}

export interface DesaDemographics {
  id: number
  age_groups: Array<{ label: string; value: number }>
  religions: Array<{ label: string; value: number }>
  ethnicities: Array<{ label: string; value: number }>
  marital_statuses: Array<{ label: string; value: number }>
  occupations: Array<{ label: string; value: number | null }>
  dusun_distribution: Array<{ label: string; value: number }>
  created_at: string
  updated_at: string
}

export interface VillageOfficial {
  id: string
  name: string
  position: string
  photo_url: string | null
  photo_path: string | null
  period: string | null
  welcome_text: string | null
  dusun: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface VillageBpdMember {
  id: string
  name: string
  position: string
  photo_url: string | null
  photo_path: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface VillagePotential {
  id: string
  title: string
  slug: string
  category: PotentialCategory
  description: string
  content: string
  hero_image_url: string | null
  hero_image_path: string | null
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ContactInformation {
  id: number
  address: string
  email: string
  whatsapp: string
  service_hours: string
  latitude: number | null
  longitude: number | null
  google_maps_url: string | null
  created_at: string
  updated_at: string
}

export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  primary_action_label: string | null
  primary_action_href: string | null
  secondary_action_label: string | null
  secondary_action_href: string | null
  image_url: string | null
  image_path: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type DashboardActivityType = 'berita' | 'galeri'

export interface DashboardActivity {
  type: DashboardActivityType
  title: string
  date: string
  published: boolean
}

export interface DashboardCompletenessItem {
  label: string
  percentage: number
  detail: string
  href: string
}

export interface DashboardOverview {
  newsCount: number
  galleryCount: number
  usersCount: number
  potentialsCount: number
  officialsCount: number
  profileConfigured: boolean
  statisticsConfigured: boolean
  contactConfigured: boolean
  heroSlidesCount: number
  recentActivity: DashboardActivity[]
  completeness: DashboardCompletenessItem[]
}
