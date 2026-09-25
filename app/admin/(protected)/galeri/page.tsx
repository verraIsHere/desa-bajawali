import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { getAllGallery } from '@/lib/queries/gallery'
import StatusBadge from '@/components/admin/StatusBadge'
import DeleteGalleryButton from './DeleteGalleryButton'
import Image from 'next/image'

export const metadata = {
  title: 'Kelola Galeri — CMS Desa Bajawali',
}

export default async function AdminGaleriPage() {
  const gallery = await getAllGallery()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink-950" style={{ fontFamily: 'var(--font-editorial), serif' }}>
            Kelola Galeri
          </h2>
          <p className="text-ink-600 text-sm mt-1">
            Daftar semua foto dan dokumentasi kegiatan desa.
          </p>
        </div>
        <Link
          href="/admin/galeri/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium rounded-md transition-colors text-sm"
        >
          <Plus size={16} />
          Tambah Foto
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {gallery.length === 0 ? (
          <div className="col-span-full py-12 text-center text-ink-500 bg-white border border-paper-200 rounded-lg">
            Belum ada foto. Silakan tambah foto baru.
          </div>
        ) : (
          gallery.map((item) => (
            <div key={item.id} className="bg-white border border-paper-200 rounded-lg overflow-hidden flex flex-col group">
              <div className="relative aspect-video w-full bg-paper-100 border-b border-paper-200">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Link
                    href={`/admin/galeri/${item.id}/edit`}
                    className="w-10 h-10 rounded-full bg-white text-ink-950 flex items-center justify-center hover:bg-green-50 hover:text-green-700 transition-colors"
                    title="Edit Foto"
                  >
                    <Pencil size={18} />
                  </Link>
                  <div className="w-10 h-10 rounded-full bg-white text-ink-950 flex items-center justify-center hover:bg-red-50 hover:text-red-700 transition-colors">
                    <DeleteGalleryButton id={item.id} imagePath={item.image_path} />
                  </div>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <StatusBadge published={item.is_published} />
                </div>
                <h3 className="font-semibold text-ink-950 text-sm mb-1 line-clamp-2" title={item.title}>
                  {item.title}
                </h3>
                <p className="text-xs text-ink-400 mt-auto pt-4 flex items-center justify-between">
                  <span>{item.creator?.full_name || 'Admin'}</span>
                  <span>
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
