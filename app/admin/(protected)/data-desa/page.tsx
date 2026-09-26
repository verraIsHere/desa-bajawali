import { BarChart3, Database, Home, Map, MapPin, Users, UsersRound } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import TabsNav, { resolveTabId, type AdminTab } from '@/components/admin/TabsNav'
import DemographicsForm from '@/components/admin/forms/DemographicsForm'
import GeographyForm from '@/components/admin/forms/GeographyForm'
import StatisticsForm from '@/components/admin/forms/StatisticsForm'
import { desaInfo } from '@/data/dummy'
import { getVillageDataOverview } from '@/lib/queries/dashboard'

export const metadata = {
  title: 'Kelola Data Desa — CMS Desa Bajawali',
}

const TABS: AdminTab[] = [
  { id: 'statistik', label: 'Statistik', icon: <Database size={15} /> },
  { id: 'demografi', label: 'Demografi', icon: <BarChart3 size={15} /> },
  { id: 'geografis', label: 'Geografis', icon: <Map size={15} /> },
]

export default async function AdminDataDesaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [overview, params] = await Promise.all([getVillageDataOverview(), searchParams])
  const activeTab = resolveTabId(TABS, params.tab)

  const statistics = overview.statistics
  const demographics = overview.demographics
  const geography = overview.geography

  const population = statistics?.population ?? Number(desaInfo.penduduk)
  const households = statistics?.households ?? Number(desaInfo.kk)
  const dusun = statistics?.dusun ?? Number(desaInfo.dusun)
  const rt = statistics?.rt ?? Number(desaInfo.rt)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            className="text-2xl font-bold text-ink-950"
            style={{ fontFamily: 'var(--font-editorial), serif' }}
          >
            Kelola Data Desa
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            Statistik, demografi, dan data geografis yang dipakai seluruh halaman publik.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-md border border-paper-200 bg-white px-3 py-2 text-xs text-ink-500">
          <span className={`h-2 w-2 rounded-full ${statistics ? 'bg-green-600' : 'bg-amber-500'}`} />
          Sumber: {statistics ? 'Supabase' : 'Fallback lokal'}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Penduduk" value={population} icon={<Users size={18} />} color="green" />
        <StatCard label="Kepala Keluarga" value={households} icon={<Home size={18} />} color="blue" />
        <StatCard label="Dusun" value={dusun} icon={<MapPin size={18} />} color="amber" />
        <StatCard label="RT" value={rt} icon={<UsersRound size={18} />} color="clay" />
      </section>

      <TabsNav basePath="/admin/data-desa" tabs={TABS} activeId={activeTab} />

      {activeTab === 'statistik' ? <StatisticsForm initialData={statistics} /> : null}
      {activeTab === 'demografi' ? <DemographicsForm initialData={demographics} /> : null}
      {activeTab === 'geografis' ? <GeographyForm initialData={geography} /> : null}
    </div>
  )
}
