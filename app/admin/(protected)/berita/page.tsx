import Link from 'next/link'
import { Plus, Pencil, ExternalLink } from 'lucide-react'
import { getAllNews } from '@/lib/queries/news'
import StatusBadge from '@/components/admin/StatusBadge'
import DeleteNewsButton from './DeleteNewsButton'

export const metadata = {
  title: 'Kelola Berita — CMS Desa Bajawali',
}

export default async function AdminBeritaPage() {
  const news = await getAllNews()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink-950" style={{ fontFamily: 'var(--font-editorial), serif' }}>
            Kelola Berita
          </h2>
          <p className="text-ink-600 text-sm mt-1">
            Daftar semua berita, pengumuman, dan kegiatan desa.
          </p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium rounded-md transition-colors text-sm"
        >
          <Plus size={16} />
          Tambah Berita
        </Link>
      </div>

      <div className="bg-white border border-paper-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-ink-800">
            <thead className="bg-paper-100 text-ink-600 font-semibold uppercase tracking-wider text-xs border-b border-paper-200">
              <tr>
                <th className="px-6 py-4">Judul Berita</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal Buat</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-200">
              {news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-ink-500">
                    Belum ada berita. Silakan tambah berita baru.
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-paper-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink-950 line-clamp-1">{item.title}</div>
                      <div className="text-xs text-ink-400 mt-0.5">Penulis: {item.author?.full_name || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-paper-200 text-ink-800 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge published={item.is_published} />
                    </td>
                    <td className="px-6 py-4 text-ink-600">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {item.is_published && (
                        <a
                          href={`/berita/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded text-ink-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Lihat Publikasi"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <Link
                        href={`/admin/berita/${item.id}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded text-ink-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        title="Edit Berita"
                      >
                        <Pencil size={16} />
                      </Link>
                      <DeleteNewsButton id={item.id} imagePath={item.image_path} title={item.title} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
