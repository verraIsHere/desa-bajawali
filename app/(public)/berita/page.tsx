import Image from "next/image";
import Link from "next/link";
import { beritaDummy } from "@/data/dummy";
import { getPublishedNews } from "@/lib/queries/news";
import { isSupabaseSource } from "@/lib/data-source";
import { NavigationChevron } from "@/components/ui/NavigationChevron";

export const metadata = {
  title: "Berita & Kegiatan Desa Bajawali",
};

export default async function BeritaPage() {
  const isSupabase = isSupabaseSource('news')
  
  let newsList = []
  
  if (isSupabase) {
    const supabaseNews = await getPublishedNews()
    newsList = supabaseNews.map(n => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      category: n.category,
      date: new Date(n.published_at || n.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      excerpt: n.excerpt,
      image: n.image_url || '/gambar/galeri/galeri_1.webp'
    }))
  } else {
    newsList = beritaDummy
  }

  if (newsList.length === 0) {
    newsList = beritaDummy
  }

  const featureNews = newsList[0];
  const remainingNews = newsList.slice(1);

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        <div className="mb-12">
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-4">
            Berita & Kegiatan
          </h1>
          <p className="text-ink-800 text-lg max-w-2xl">
            Dokumentasi kegiatan masyarakat, perkembangan pembangunan, dan informasi pelayanan di Desa Bajawali.
          </p>
        </div>

        {newsList.length === 0 ? (
          <div className="text-center py-24 border border-paper-200 rounded-lg bg-paper-50">
            <h3 className="text-xl font-editorial font-semibold text-ink-950">Belum ada berita</h3>
            <p className="text-ink-600 mt-2">Berita dan kegiatan terbaru akan tampil di sini.</p>
          </div>
        ) : (
          <>
            {/* Feature News */}
            {featureNews && (
              <Link href={`/berita/${featureNews.slug}`} className="group block mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-paper-50 border border-paper-200 rounded-md overflow-hidden hover:border-green-300 transition-colors">
                  <div className="relative aspect-[16/10] lg:aspect-square w-full">
                    <Image 
                      src={featureNews.image} 
                      alt={featureNews.title} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-green-700 px-3 py-1 rounded-sm">
                        {featureNews.category}
                      </span>
                      <span className="text-sm text-ink-600">{featureNews.date}</span>
                    </div>
                    <h2 className="font-editorial text-3xl md:text-4xl text-ink-950 font-semibold mb-4 group-hover:text-green-800 transition-colors leading-tight">
                      {featureNews.title}
                    </h2>
                    <p className="text-ink-800 text-lg mb-8 line-clamp-3">
                      {featureNews.excerpt}
                    </p>
                    <div className="text-sm font-semibold text-green-700 flex items-center gap-2">
                      Baca selengkapnya <NavigationChevron direction="next" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid News */}
            {remainingNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingNews.map((news) => (
                  <Link key={news.id} href={`/berita/${news.slug}`} className="group block border border-paper-200 rounded-md overflow-hidden bg-paper-50 hover:border-green-300 transition-colors flex-col flex h-full">
                    <div className="relative aspect-[16/10] w-full border-b border-paper-200">
                      <Image 
                        src={news.image} 
                        alt={news.title} 
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded-sm">
                          {news.category}
                        </span>
                        <span className="text-xs text-ink-400">{news.date}</span>
                      </div>
                      <h3 className="font-editorial text-xl text-ink-950 font-semibold mb-3 group-hover:text-green-800 transition-colors leading-snug">
                        {news.title}
                      </h3>
                      <p className="text-ink-600 text-sm line-clamp-2 mt-auto">
                        {news.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
