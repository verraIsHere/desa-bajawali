import { Landmark, ShieldCheck, UserRound, UsersRound } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import TabsNav, { resolveTabId, type AdminTab } from '@/components/admin/TabsNav'
import StructureManager from '@/components/admin/forms/StructureManager'
import { getAdminStructure } from '@/lib/queries/dashboard'

export const metadata = {
  title: 'Kelola Pemerintahan — CMS Desa Bajawali',
}

export default async function AdminPemerintahanPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [structure, params] = await Promise.all([getAdminStructure(), searchParams])
  const officials = structure.officials
  const bpd = structure.bpd

  const head = officials.find((item) => item.position === 'Kepala Desa' && item.is_active)
  const devices = officials.filter(
    (item) => item.position !== 'Kepala Desa' && item.position !== 'Kepala Dusun',
  )
  const dusun = officials.filter((item) => item.position === 'Kepala Dusun')

  const tabs: AdminTab[] = [
    { id: 'kepala-desa', label: 'Kepala Desa', icon: <Landmark size={15} /> },
    { id: 'perangkat', label: 'Perangkat Desa', icon: <UserRound size={15} />, badge: devices.length },
    { id: 'kepala-dusun', label: 'Kepala Dusun', icon: <UsersRound size={15} />, badge: dusun.length },
    { id: 'bpd', label: 'BPD', icon: <ShieldCheck size={15} />, badge: bpd.length },
  ]

  const activeTab = resolveTabId(tabs, params.tab)

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
          Struktur kepala desa, perangkat desa, kepala dusun, dan BPD. Semua perubahan langsung tampil
          di halaman struktur pemerintahan.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Kepala Desa"
          value={head ? 1 : 0}
          icon={<Landmark size={18} />}
          color="green"
        />
        <StatCard
          label="Perangkat Desa"
          value={devices.length}
          icon={<UserRound size={18} />}
          color="blue"
        />
        <StatCard
          label="Kepala Dusun"
          value={dusun.length}
          icon={<UsersRound size={18} />}
          color="amber"
        />
        <StatCard label="Anggota BPD" value={bpd.length} icon={<ShieldCheck size={18} />} color="clay" />
      </section>

      <TabsNav basePath="/admin/pemerintahan" tabs={tabs} activeId={activeTab} />

      {activeTab === 'kepala-desa' ? (
        <StructureManager
          kind="officials"
          scope="kepala-desa"
          items={officials}
          description="Tambah kepala desa baru akan menonaktifkan kepala desa sebelumnya secara otomatis."
        />
      ) : null}

      {activeTab === 'perangkat' ? (
        <StructureManager
          kind="officials"
          scope="perangkat"
          items={officials}
          description="Sekretaris, kaur, kasi, dan staf perangkat desa."
        />
      ) : null}

      {activeTab === 'kepala-dusun' ? (
        <StructureManager
          kind="officials"
          scope="kepala-dusun"
          items={officials}
          description="Setiap kepala dusun tampil dengan nama dusunnya pada halaman publik."
        />
      ) : null}

      {activeTab === 'bpd' ? (
        <StructureManager
          kind="bpd"
          scope="bpd"
          items={bpd}
          description="Susunan pengurus Badan Permusyawaratan Desa."
        />
      ) : null}
    </div>
  )
}
