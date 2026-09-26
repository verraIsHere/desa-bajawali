import { createClient } from '@/lib/supabase/server'
import type {
  DashboardActivity,
  DashboardCompletenessItem,
  DashboardOverview,
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

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>

async function countTable(
  supabase: ServerSupabaseClient,
  table: string,
  statusColumn?: 'is_active' | 'is_published',
) {
  const query = supabase.from(table).select('*', { count: 'exact', head: true })
  const result = statusColumn ? await query.eq(statusColumn, true) : await query

  if (result.error) return 0
  return result.count || 0
}

function getRecentActivity(
  news: Array<{ title: string; created_at: string; is_published: boolean }>,
  gallery: Array<{ title: string; created_at: string; is_published: boolean }>,
): DashboardActivity[] {
  return [
    ...news.map((item) => ({
      type: 'berita' as const,
      title: item.title,
      date: item.created_at,
      published: item.is_published,
    })),
    ...gallery.map((item) => ({
      type: 'galeri' as const,
      title: item.title,
      date: item.created_at,
      published: item.is_published,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const supabase = await createClient()

  const [
    newsCount,
    galleryCount,
    usersCount,
    potentialsCount,
    officialsCount,
    profileResult,
    statisticsResult,
    contactResult,
    heroSlidesCount,
    recentNewsResult,
    recentGalleryResult,
  ] = await Promise.all([
    countTable(supabase, 'news'),
    countTable(supabase, 'gallery'),
    countTable(supabase, 'profiles'),
    countTable(supabase, 'village_potentials', 'is_published'),
    countTable(supabase, 'village_officials', 'is_active'),
    supabase.from('desa_profile').select('*').limit(1).maybeSingle(),
    supabase.from('desa_statistics').select('*').limit(1).maybeSingle(),
    supabase.from('contact_information').select('*').limit(1).maybeSingle(),
    countTable(supabase, 'hero_slides', 'is_active'),
    supabase
      .from('news')
      .select('title, created_at, is_published')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('gallery')
      .select('title, created_at, is_published')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const profile = (profileResult.data as unknown as DesaProfile | null) ?? null
  const statistics = (statisticsResult.data as unknown as DesaStatistics | null) ?? null
  const contact = contactResult.data as { email?: string; whatsapp?: string } | null
  const recentActivity = getRecentActivity(
    (recentNewsResult.data as unknown as Array<{
      title: string
      created_at: string
      is_published: boolean
    }>) || [],
    (recentGalleryResult.data as unknown as Array<{
      title: string
      created_at: string
      is_published: boolean
    }>) || [],
  )

  const profileConfigured = Boolean(profile?.name && profile?.description && profile?.history)
  const statisticsConfigured = Boolean(
    statistics?.population && statistics?.households && statistics?.data_year,
  )
  const contactConfigured = Boolean(contact?.email && contact?.whatsapp)

  const completeness: DashboardCompletenessItem[] = [
    {
      label: 'Profil Desa',
      percentage: profileConfigured ? 100 : 0,
      detail: profileConfigured ? 'Lengkap' : 'Belum diisi',
      href: '/admin/website',
    },
    {
      label: 'Pemerintahan',
      percentage: Math.min(100, Math.round((officialsCount / 8) * 100)),
      detail: `${officialsCount} personel aktif`,
      href: '/admin/pemerintahan',
    },
    {
      label: 'Data Desa',
      percentage: statisticsConfigured ? 100 : 0,
      detail: statisticsConfigured ? `${statistics?.data_year}` : 'Belum diisi',
      href: '/admin/data-desa',
    },
    {
      label: 'Potensi Desa',
      percentage: Math.min(100, potentialsCount * 20),
      detail: `${potentialsCount} item`,
      href: '/admin/potensi',
    },
    {
      label: 'Kontak',
      percentage: contactConfigured ? 100 : 0,
      detail: contactConfigured ? 'Lengkap' : 'Belum diisi',
      href: '/admin/website',
    },
    {
      label: 'Hero Banner',
      percentage: Math.min(100, heroSlidesCount * 25),
      detail: `${heroSlidesCount} slide aktif`,
      href: '/admin/website',
    },
  ]

  return {
    newsCount,
    galleryCount,
    usersCount,
    potentialsCount,
    officialsCount,
    profileConfigured,
    statisticsConfigured,
    contactConfigured,
    heroSlidesCount,
    recentActivity,
    completeness,
  }
}

export async function getVillageDataOverview() {
  const supabase = await createClient()
  const [profileResult, geographyResult, statisticsResult, demographicsResult] =
    await Promise.all([
      supabase.from('desa_profile').select('*').limit(1).maybeSingle(),
      supabase.from('desa_geography').select('*').limit(1).maybeSingle(),
      supabase.from('desa_statistics').select('*').limit(1).maybeSingle(),
      supabase.from('desa_demographics').select('*').limit(1).maybeSingle(),
    ])

  return {
    profile: (profileResult.data as unknown as DesaProfile | null) ?? null,
    geography: (geographyResult.data as unknown as DesaGeography | null) ?? null,
    statistics: (statisticsResult.data as unknown as DesaStatistics | null) ?? null,
    demographics: (demographicsResult.data as unknown as DesaDemographics | null) ?? null,
  }
}

/**
 * Untuk halaman CMS: mengambil seluruh baris (aktif maupun non-aktif) agar
 * admin bisa mengelola status aktif. Membutuhkan policy RLS
 * "Authenticated can read all ..." di supabase-migration.sql.
 */
export async function getAdminStructure() {
  const supabase = await createClient()
  const [officialsResult, bpdResult] = await Promise.all([
    supabase.from('village_officials').select('*').order('sort_order', { ascending: true }),
    supabase.from('village_bpd').select('*').order('sort_order', { ascending: true }),
  ])

  return {
    officials: (officialsResult.data as unknown as VillageOfficial[] | null) ?? [],
    bpd: (bpdResult.data as unknown as VillageBpdMember[] | null) ?? [],
  }
}

export async function getContentOverview() {
  const supabase = await createClient()
  const [profileResult, officialsResult, bpdResult, potentialsResult, contactResult, heroResult] =
    await Promise.all([
      supabase.from('desa_profile').select('*').limit(1).maybeSingle(),
      supabase
        .from('village_officials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('village_bpd')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('village_potentials')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
      supabase.from('contact_information').select('*').limit(1).maybeSingle(),
      supabase
        .from('hero_slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ])

  return {
    profile: (profileResult.data as unknown as DesaProfile | null) ?? null,
    officials: (officialsResult.data as unknown as VillageOfficial[] | null) ?? [],
    bpd: (bpdResult.data as unknown as VillageBpdMember[] | null) ?? [],
    potentials: (potentialsResult.data as unknown as VillagePotential[] | null) ?? [],
    contact: (contactResult.data as unknown as ContactInformation | null) ?? null,
    heroSlides: (heroResult.data as unknown as HeroSlide[] | null) ?? [],
  }
}
