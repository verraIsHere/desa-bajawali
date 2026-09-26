import GalleryFilter from "@/components/gallery/GalleryFilter";
import type { GalleryPhoto } from "@/components/gallery/GalleryFilter";
import { galeriDummy } from "@/data/dummy";
import { getPublishedGallery } from "@/lib/queries/gallery";
import { isSupabaseSource } from "@/lib/data-source";

export const metadata = {
  title: "Galeri Dokumentasi Desa Bajawali",
};

export default async function GaleriPage() {
  const isSupabase = isSupabaseSource('gallery')
  
  let galleryList: GalleryPhoto[] = []
  
  if (isSupabase) {
    const supabaseGallery = await getPublishedGallery()
    galleryList = supabaseGallery.map(g => ({
      id: g.id,
      url: g.image_url,
      caption: g.title, // Map title to caption for UI display
      category: g.category,
    }))
  } else {
    galleryList = galeriDummy
  }

  if (galleryList.length === 0) {
    galleryList = galeriDummy
  }

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        <div className="mb-12">
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-4">
            Galeri Dokumentasi
          </h1>
          <p className="text-ink-800 text-lg max-w-2xl">
            Rekam jejak visual kegiatan masyarakat, keindahan alam, dan perkembangan Desa Bajawali.
          </p>
        </div>

        {galleryList.length === 0 ? (
          <div className="text-center py-24 border border-paper-200 rounded-lg bg-paper-50">
            <h3 className="text-xl font-editorial font-semibold text-ink-950">Belum ada foto</h3>
            <p className="text-ink-600 mt-2">Foto kegiatan akan tampil di sini.</p>
          </div>
        ) : (
          <GalleryFilter photos={galleryList} />
        )}

      </div>
    </div>
  );
}
