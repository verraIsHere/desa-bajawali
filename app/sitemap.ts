import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://desabajawali.id'

  // Halaman statis
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/profil',
    '/profil/visi-misi',
    '/profil/struktur-pemerintahan',
    '/profil/geografis',
    '/profil/demografi',
    '/profil/sejarah',
    '/data-desa',
    '/potensi',
    '/potensi/umkm',
    '/potensi/perikanan',
    '/potensi/sumber-daya-alam',
    '/potensi/pertanian',
    '/potensi/pariwisata',
    '/galeri',
    '/berita',
    '/kontak',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Berita dinamis dari Supabase
  try {
    const supabase = await createClient()
    const { data: news, error } = await supabase
      .from('news')
      .select('slug, published_at, created_at')
      .eq('is_published', true)

    if (error) {
      console.error('Error fetching news for sitemap:', error)
      return staticRoutes
    }

    const newsRoutes: MetadataRoute.Sitemap = (news ?? []).map(
      (item: { slug: string; published_at: string | null; created_at: string | null }) => ({
        url: `${baseUrl}/berita/${item.slug}`,
        lastModified: item.published_at
          ? new Date(item.published_at)
          : item.created_at
            ? new Date(item.created_at)
            : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })
    )

    return [...staticRoutes, ...newsRoutes]
  } catch (err) {
    console.error('Failed to generate dynamic sitemap entries:', err)
    return staticRoutes
  }
}
