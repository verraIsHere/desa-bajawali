import { Landmark, ShieldCheck, UserRound, UsersRound } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import { getContentOverview } from '@/lib/queries/dashboard'

export const metadata = {
  title: 'Kelola Pemerintahan — CMS Desa Bajawali',
}

export default async function AdminPemerintahanPage() {
  const overview = await getContentOverview()
  const officials = overview.officials
  const head = officials.find((item) => item.position === 'Kepala Desa')
  const devices = officials.filter(
    (item) => item.position !== 'Kepala Desa' && item.position !== 'Kepala Dusun',
  )
  const dusun = officials.filter((item) => item.position === 'Kepala Dusun')

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl font-bold text-ink-950"
          style={{ fontFamily: 'var(--font-editorial), serif' }}
        >
          Kelola Pemerintahan
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Struktur kepala desa, perangkat desa, kepala dusun, dan BPD.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Kepala Desa"
          value={head ? 1 : 0}
          icon={<Landmark size={18} />}
          color="green"
        />
        <StatCard label="Perangkat Desa" value={devices.length} icon={<UserRound size={18} />} color="blue" />
        <StatCard label="Kepala Dusun" value={dusun.length} icon={<UsersRound size={18} />} color="amber" />
        <StatCard label="Anggota BPD" value={overview.bpd.length} icon={<ShieldCheck size={18} />} color="clay" />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="rounded-lg border border-paper-200 bg-white p-6 xl:col-span-3">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400">
                Struktur
              </div>
              <h3 className="mt-2 font-editorial text-2xl text-ink-950">Perangkat Desa</h3>
            </div>
            <span className="text-xs text-ink-400">{devices.length} personel</span>
          </div>
          {devices.length === 0 ? (
            <EmptyState label="Data perangkat desa belum tersedia." />
          ) : (
            <div className="divide-y divide-paper-100">
              {devices.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{item.name}</p>
                    <p className="mt-1 text-xs text-ink-400">{item.position}</p>
                  </div>
                  <span className="rounded bg-green-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-paper-200 bg-white p-6 xl:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-700">
              <Landmark size={18} />
            </span>
            <div>
              <h3 className="font-semibold text-ink-950">Kepala Desa</h3>
              <p className="text-xs text-ink-400">Profil pemimpin desa</p>
            </div>
          </div>
          {head ? (
            <div className="rounded-md bg-green-950 p-5 text-white">
              <p className="text-lg font-semibold">{head.name}</p>
              <p className="mt-1 text-xs text-green-200">{head.position}</p>
              {head.period && <p className="mt-4 text-xs text-white/60">Periode {head.period}</p>}
              {head.welcome_text && (
                <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/75">
                  {head.welcome_text}
                </p>
              )}
            </div>
          ) : (
            <EmptyState label="Data kepala desa belum tersedia." />
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OfficialList title="Kepala Dusun" items={dusun} emptyLabel="Data kepala dusun belum tersedia." />
        <OfficialList title="Anggota BPD" items={overview.bpd} emptyLabel="Data BPD belum tersedia." />
      </div>

      <div className="flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <Landmark size={18} className="mt-0.5 shrink-0" />
        <p>
          Struktur ini sudah terhubung ke tabel Supabase dan siap dikembangkan menjadi form edit
          pada tahap CRUD CMS berikutnya.
        </p>
      </div>
    </div>
  )
}

function OfficialList({
  title,
  items,
  emptyLabel,
}: {
  title: string
  items: Array<{ id: string; name: string; position: string; dusun?: string | null }>
  emptyLabel: string
}) {
  return (
    <section className="rounded-lg border border-paper-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-ink-950">{title}</h3>
        <span className="text-xs text-ink-400">{items.length} orang</span>
      </div>
      {items.length === 0 ? (
        <EmptyState label={emptyLabel} />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-md bg-paper-50 p-3">
              <p className="text-sm font-medium text-ink-800">{item.name}</p>
              <p className="mt-1 text-xs text-ink-400">
                {item.dusun ? `Dusun ${item.dusun}` : item.position}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-paper-200 py-8 text-center text-sm text-ink-400">
      {label}
    </div>
  )
}
