import { Sprout } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import { getPublishedPotentials } from '@/lib/queries/village'

export const metadata = {
  title: 'Kelola Potensi Desa — CMS Desa Bajawali',
}

export default async function AdminPotensiPage() {
  const potentials = await getPublishedPotentials()

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl font-bold text-ink-950"
          style={{ fontFamily: 'var(--font-editorial), serif' }}
        >
          Kelola Potensi Desa
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Kategori potensi yang dapat dikelola dan ditayangkan di website publik.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Potensi" value={potentials.length} icon={<Sprout size={18} />} color="green" />
        <StatCard
          label="Dipublikasikan"
          value={potentials.filter((item) => item.is_published).length}
          icon={<Sprout size={18} />}
          color="blue"
        />
        <StatCard
          label="Kategori"
          value={new Set(potentials.map((item) => item.category)).size}
          icon={<Sprout size={18} />}
          color="clay"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {potentials.map((item) => (
          <article key={item.id} className="rounded-lg border border-paper-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="rounded bg-green-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-green-700">
                {item.category}
              </span>
              <span
                className={`rounded px-2 py-1 text-[10px] font-semibold ${
                  item.is_published ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {item.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            <h3 className="mt-4 font-editorial text-xl text-ink-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.description}</p>
            <p className="mt-4 text-xs text-ink-400">/{'potensi'}/{item.slug}</p>
          </article>
        ))}
      </section>

      <div className="flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <Sprout size={18} className="mt-0.5 shrink-0" />
        <p>
          Daftar ini membaca data Supabase dengan fallback lokal. Form tambah dan edit potensi
          akan tersedia pada tahap CRUD konten berikutnya.
        </p>
      </div>
    </div>
  )
}
