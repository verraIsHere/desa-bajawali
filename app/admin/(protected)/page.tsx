import Link from 'next/link'
import {
  ArrowUpRight,
  Database,
  FileText,
  Image as ImageIcon,
  Landmark,
  MapPin,
  Newspaper,
  Plus,
} from 'lucide-react'
import { NavigationChevron } from '@/components/ui/NavigationChevron'
import StatCard from '@/components/admin/StatCard'
import { getDashboardOverview } from '@/lib/queries/dashboard'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export default async function AdminDashboardPage() {
  const overview = await getDashboardOverview()
  const recentNews = overview.recentActivity.filter((activity) => activity.type === 'berita')

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-lg bg-green-950 p-6 text-white md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-green-300">
              Dashboard CMS
            </div>
            <h2 className="font-editorial text-3xl !text-white font-semibold leading-tight md:text-4xl">
              Selamat datang, Administrator.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
              Kelola informasi Desa Bajawali dari satu tempat: profil, data, pemerintahan,
              konten, dan website.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs text-white/60">
            <span className="h-2 w-2 rounded-full bg-green-300" />
            <span>{overview.usersCount} pengguna</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Supabase + local fallback</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Berita"
          value={overview.newsCount}
          icon={<Newspaper size={18} />}
          color="green"
        />
        <StatCard
          label="Galeri"
          value={overview.galleryCount}
          icon={<ImageIcon size={18} />}
          color="blue"
        />
        <StatCard
          label="Potensi Desa"
          value={overview.potentialsCount}
          icon={<Landmark size={18} />}
          color="clay"
        />
        <StatCard
          label="Data Desa"
          value={overview.statisticsConfigured ? 'Siap' : 'Belum'}
          icon={<Database size={18} />}
          color="amber"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="rounded-lg border border-paper-200 bg-white p-6 xl:col-span-3">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400">
                Kelengkapan Data
              </div>
              <h3 className="mt-2 font-editorial text-2xl text-ink-950">Konten Website</h3>
            </div>
            <span className="text-xs text-ink-400">
              {overview.completeness.filter((item) => item.percentage === 100).length}/
              {overview.completeness.length} siap
            </span>
          </div>

          <div className="space-y-5">
            {overview.completeness.map((item) => (
              <Link key={item.label} href={item.href} className="group block">
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-ink-800 group-hover:text-green-700">
                    {item.label}
                  </span>
                  <span className="text-xs text-ink-400">{item.detail}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-paper-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.percentage === 100 ? 'bg-green-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-paper-200 bg-white p-6 xl:col-span-2">
          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-400">
              Aksi Cepat
            </div>
            <h3 className="mt-2 font-editorial text-2xl text-ink-950">Mulai Pengelolaan</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {[
              { href: '/admin/data-desa', label: 'Kelola Data Desa', icon: Database },
              { href: '/admin/pemerintahan', label: 'Kelola Pemerintahan', icon: Landmark },
              { href: '/admin/website', label: 'Kelola Website', icon: MapPin },
              { href: '/admin/berita/tambah', label: 'Tambah Berita', icon: Plus },
              { href: '/admin/galeri/tambah', label: 'Upload Foto', icon: Plus },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center justify-between gap-3 rounded-md border border-paper-200 p-3 transition-colors hover:border-green-300 hover:bg-green-50/50"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-green-700">
                      <Icon size={16} />
                    </span>
                    <span className="text-sm font-medium text-ink-800">{action.label}</span>
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="text-ink-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-green-700"
                  />
                </Link>
              )
            })}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-paper-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400">
                Konten Terbaru
              </div>
              <h3 className="mt-2 font-editorial text-2xl text-ink-950">Berita Terbaru</h3>
            </div>
            <Link
              href="/admin/berita"
              className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800"
            >
              Semua <NavigationChevron direction="next" />
            </Link>
          </div>
          {recentNews.length === 0 ? (
            <EmptyActivity label="Belum ada berita." />
          ) : (
            <div className="space-y-3">
              {recentNews.slice(0, 3).map((activity) => (
                <Link
                  key={`${activity.type}-${activity.date}-${activity.title}`}
                  href="/admin/berita"
                  className="flex items-center gap-3 border-b border-paper-100 pb-3 last:border-0 last:pb-0"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-green-50 text-green-700">
                    <Newspaper size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink-800">{activity.title}</span>
                    <span className="mt-1 flex items-center gap-2 text-[11px] text-ink-400">
                      {formatDate(activity.date)}
                      <StatusPill published={activity.published} />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-paper-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400">
                Aktivitas Terakhir
              </div>
              <h3 className="mt-2 font-editorial text-2xl text-ink-950">Aktivitas CMS</h3>
            </div>
            <Link
              href="/admin/galeri"
              className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800"
            >
              Galeri <NavigationChevron direction="next" />
            </Link>
          </div>
          {overview.recentActivity.length === 0 ? (
            <EmptyActivity label="Belum ada aktivitas." />
          ) : (
            <div className="space-y-3">
              {overview.recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={`${activity.type}-${activity.date}-${activity.title}`}
                  className="flex items-center gap-3 border-b border-paper-100 pb-3 last:border-0 last:pb-0"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                      activity.type === 'berita'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {activity.type === 'berita' ? <Newspaper size={15} /> : <ImageIcon size={15} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink-800">{activity.title}</span>
                    <span className="mt-1 block text-[11px] text-ink-400">
                      {activity.type === 'berita' ? 'Berita' : 'Galeri'} · {formatDate(activity.date)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatusPill({ published }: { published: boolean }) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
        published ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {published ? 'Published' : 'Draft'}
    </span>
  )
}

function EmptyActivity({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-paper-200 py-10 text-center">
      <FileText size={20} className="mb-2 text-ink-400" />
      <p className="text-sm text-ink-400">{label}</p>
    </div>
  )
}
