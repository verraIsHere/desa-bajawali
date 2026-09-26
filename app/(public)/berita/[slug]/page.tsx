import Image from "next/image";
import Link from "next/link";
import { beritaDummy } from "@/data/dummy";
import { notFound } from "next/navigation";
import { getNewsBySlug, getPublishedNews } from "@/lib/queries/news";
import { isSupabaseSource } from "@/lib/data-source";
import type { Metadata } from 'next'
import { NavigationChevron } from '@/components/ui/NavigationChevron'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const isSupabase = isSupabaseSource('news')
  
  let title = 'Berita Desa Bajawali'
  let excerpt = 'Informasi terbaru dari Desa Bajawali.'

  if (isSupabase) {
    const news = await getNewsBySlug(slug)
    if (news) {
      title = news.title
      excerpt = news.excerpt
    } else {
      const fallbackNews = beritaDummy.find((item) => item.slug === slug)
      if (fallbackNews) {
        title = fallbackNews.title
        excerpt = fallbackNews.excerpt
      }
    }
  } else {
    const news = beritaDummy.find((n) => n.slug === slug);
    if (news) {
      title = news.title
      excerpt = news.excerpt
    }
  }

  return {
    title: `${title} - Desa Bajawali`,
    description: excerpt,
  }
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isSupabase = isSupabaseSource('news')
  
  let newsData = null
  let relatedNewsList = []

  if (isSupabase) {
    const news = await getNewsBySlug(slug)
    if (news) {
      newsData = {
        id: news.id,
        title: news.title,
        category: news.category,
        date: new Date(news.published_at || news.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        excerpt: news.excerpt,
        contentHTML: news.content, // HTML from TipTap
        image: news.image_url || '/gambar/galeri/galeri_1.webp',
        author: news.author?.full_name || 'Admin Desa'
      }

      const allNews = await getPublishedNews()
      if (allNews.length > 0) {
        relatedNewsList = allNews.filter((item) => item.id !== news.id).slice(0, 2).map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          category: item.category,
          date: new Date(item.published_at || item.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          image: item.image_url || '/gambar/galeri/galeri_1.webp'
        }))
      } else {
        relatedNewsList = beritaDummy.filter((item) => item.id !== news.id).slice(0, 2).map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          category: item.category,
          date: item.date,
          image: item.image
        }))
      }
    } else {
      const fallbackNews = beritaDummy.find((item) => item.slug === slug)
      if (!fallbackNews) notFound()

      newsData = {
        id: fallbackNews.id,
        title: fallbackNews.title,
        category: fallbackNews.category,
        date: fallbackNews.date,
        excerpt: fallbackNews.excerpt,
        content: fallbackNews.content,
        image: fallbackNews.image,
        author: 'Admin Desa'
      }
      relatedNewsList = beritaDummy.filter((item) => item.id !== fallbackNews.id).slice(0, 2).map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        category: item.category,
        date: item.date,
        image: item.image
      }))
    }
  } else {
    const news = beritaDummy.find((n) => n.slug === slug);
    if (!news) notFound()
      
    newsData = {
      id: news.id,
      title: news.title,
      category: news.category,
      date: news.date,
      excerpt: news.excerpt,
      content: news.content,
      image: news.image,
      author: 'Admin Desa'
    }

    relatedNewsList = beritaDummy.filter((n) => n.id !== news.id).slice(0, 2).map(n => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      category: n.category,
      date: n.date,
      image: n.image
    }))
  }

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        {/* Breadcrumb & Category */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/berita" className="text-xs font-bold uppercase tracking-widest text-ink-400 hover:text-green-700 transition-colors">
              Berita
            </Link>
            <span className="text-ink-400 text-xs"><NavigationChevron direction="next" /></span>
            <span className="text-xs font-bold uppercase tracking-widest text-green-700">
              {newsData.category}
            </span>
          </div>
          
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-6">
            {newsData.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-ink-600 border-t border-b border-paper-200 py-3">
            <div><strong>Penulis:</strong> {newsData.author}</div>
            <div>&bull;</div>
            <div>{newsData.date}</div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-4xl mx-auto relative aspect-[21/9] w-full mb-12 border border-paper-200 rounded-md overflow-hidden bg-paper-100">
          <Image 
            src={newsData.image} 
            alt={newsData.title} 
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto prose prose-xl prose-p:text-ink-800 prose-headings:font-editorial prose-headings:text-ink-950 prose-a:text-green-700 prose-img:rounded-lg max-w-none">
          <p className="text-xl font-medium text-ink-950 leading-relaxed mb-8">
            {newsData.excerpt}
          </p>
          
          {newsData.contentHTML ? (
            <div dangerouslySetInnerHTML={{ __html: newsData.contentHTML }} />
          ) : (
            <>
              <p>{newsData.content}</p>
              <p>Pemerintah desa terus berkomitmen untuk memberikan pelayanan dan informasi yang transparan bagi seluruh warga Desa Bajawali. Dukungan dari masyarakat sangat dibutuhkan untuk menyukseskan program-program ke depan.</p>
            </>
          )}
        </div>

        {/* Related News */}
        {relatedNewsList.length > 0 && (
          <div className="max-w-4xl mx-auto mt-24 pt-12 border-t border-paper-200">
            <h3 className="font-editorial text-2xl text-ink-950 mb-8">Berita Terkait</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedNewsList.map((related) => (
                <Link key={related.id} href={`/berita/${related.slug}`} className="group flex gap-4 items-start">
                  <div className="w-1/3 aspect-[4/3] relative rounded-md overflow-hidden border border-paper-200 shrink-0 bg-paper-100">
                    <Image 
                      src={related.image} 
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-1">{related.category}</div>
                    <h4 className="font-editorial text-lg text-ink-950 font-semibold leading-snug group-hover:text-green-800 transition-colors mb-1 line-clamp-2">
                      {related.title}
                    </h4>
                    <div className="text-xs text-ink-400">{related.date}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
