'use client'

import { usePathname } from 'next/navigation'

const breadcrumbMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/data-desa': 'Data Desa',
  '/admin/pemerintahan': 'Pemerintahan',
  '/admin/potensi': 'Potensi Desa',
  '/admin/berita': 'Berita',
  '/admin/berita/tambah': 'Tambah Berita',
  '/admin/galeri': 'Galeri',
  '/admin/galeri/tambah': 'Tambah Foto',
  '/admin/website': 'Profil & Website',
  '/admin/website/hero': 'Hero Banner',
  '/admin/website/kontak': 'Informasi Kontak',
  '/admin/pengguna': 'Pengguna',
  '/admin/profil': 'Profil Saya',
}

export default function AdminHeader() {
  const pathname = usePathname()

  // Build breadcrumb from current path
  const title = breadcrumbMap[pathname] ||
    (pathname.includes('/edit') ? 'Edit' : 'CMS')

  const parentPath = pathname.split('/').slice(0, -1).join('/')
  const parentTitle = breadcrumbMap[parentPath]

  return (
    <header className="bg-white border-b border-paper-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 ml-10 md:ml-0">
        {parentTitle && (
          <>
            <span className="text-sm text-ink-400">{parentTitle}</span>
            <span className="text-ink-400">/</span>
          </>
        )}
        <h1 className="text-lg font-semibold text-ink-950">{title}</h1>
      </div>
    </header>
  )
}
