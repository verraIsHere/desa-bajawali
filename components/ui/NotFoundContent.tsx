import Link from 'next/link'
import { NavigationChevron } from '@/components/ui/NavigationChevron'

const shortcuts = [
  { label: 'Profil Desa', href: '/profil' },
  { label: 'Data Desa', href: '/data-desa' },
  { label: 'Potensi Desa', href: '/potensi' },
  { label: 'Berita', href: '/berita' },
]

/**
 * Tampilan 404 yang dipakai baik oleh route group publik (dengan navbar/footer)
 * maupun oleh route yang tidak cocok sama sekali (tanpa chrome publik).
 */
export default function NotFoundContent() {
  return (
    <section className="border-b border-paper-200 bg-paper-50">
      <div className="container mx-auto px-5 py-20 md:py-28 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-ink-400">
            404 / Halaman tidak ditemukan
          </div>

          <h1 className="font-editorial text-4xl font-semibold leading-tight text-ink-950 md:text-5xl">
            Halaman yang Anda cari tidak tersedia.
          </h1>

          <p className="mt-4 text-ink-800">
            Alamat yang Anda buka mungkin sudah berubah atau tidak pernah ada. Silakan kembali ke
            beranda atau gunakan menu di bawah untuk melanjutkan menjelajah Desa Bajawali.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
            >
              <NavigationChevron direction="previous" />
              Kembali ke beranda
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              Hubungi kami <NavigationChevron direction="next" />
            </Link>
          </div>

          <div className="mt-12 border-t border-paper-200 pt-6">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">
              Menu cepat
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {shortcuts.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-ink-600 transition-colors hover:text-green-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
