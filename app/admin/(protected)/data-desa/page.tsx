import {
  BarChart3,
  Database,
  Home,
  Map,
  MapPin,
  Users,
  UsersRound,
} from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import { desaInfo } from '@/data/dummy'
import { getVillageDataOverview } from '@/lib/queries/dashboard'

export const metadata = {
  title: 'Kelola Data Desa — CMS Desa Bajawali',
}

export default async function AdminDataDesaPage() {
  const overview = await getVillageDataOverview()
  const statistics = overview.statistics
  const demographics = overview.demographics

  const population = statistics?.population ?? Number(desaInfo.penduduk)
  const malePopulation = statistics?.male_population ?? Number(desaInfo.lakiLaki)
  const femalePopulation = statistics?.female_population ?? Number(desaInfo.perempuan)
  const households = statistics?.households ?? Number(desaInfo.kk)
  const dusun = statistics?.dusun ?? Number(desaInfo.dusun)
  const rt = statistics?.rt ?? Number(desaInfo.rt)
  const geography = overview.geography
  const areaLabel = geography
    ? geography.area_ha.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
    : desaInfo.luasWilayah
  const boundaries = [
    ['Utara', geography?.north_boundary || 'Desa Parabu'],
    ['Timur', geography?.east_boundary || 'Desa Karave, Kecamatan Bulutaba'],
    ['Selatan', geography?.south_boundary || 'HGU PT Unggul Widya Tek'],
    ['Barat', geography?.west_boundary || 'Desa Singgani'],
  ]

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
            Ringkasan statistik dan kelengkapan data kependudukan Desa Bajawali.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-md border border-paper-200 bg-white px-3 py-2 text-xs text-ink-500">
          <span className={`h-2 w-2 rounded-full ${statistics ? 'bg-green-600' : 'bg-amber-500'}`} />
          Sumber: {statistics ? 'Supabase' : 'Fallback lokal'}
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Penduduk" value={population} icon={<Users size={18} />} color="green" />
        <StatCard
          label="Kepala Keluarga"
          value={households}
          icon={<Home size={18} />}
          color="blue"
        />
        <StatCard label="Dusun" value={dusun} icon={<MapPin size={18} />} color="amber" />
        <StatCard label="RT" value={rt} icon={<UsersRound size={18} />} color="clay" />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-paper-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-green-50 text-green-700">
              <Users size={18} />
            </span>
            <div>
              <h3 className="font-semibold text-ink-950">Komposisi Penduduk</h3>
              <p className="text-xs text-ink-400">Profil Desa {statistics?.data_year ?? desaInfo.tahunData}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-paper-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-ink-400">Laki-laki</div>
              <div className="mt-2 font-editorial text-3xl text-ink-950">{malePopulation}</div>
            </div>
            <div className="rounded-md bg-paper-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-ink-400">Perempuan</div>
              <div className="mt-2 font-editorial text-3xl text-ink-950">{femalePopulation}</div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-paper-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-700">
              <BarChart3 size={18} />
            </span>
            <div>
              <h3 className="font-semibold text-ink-950">Kelengkapan Demografi</h3>
              <p className="text-xs text-ink-400">Data yang tersedia untuk chart publik</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              ['Kelompok umur', demographics?.age_groups?.length ?? 0],
              ['Agama dan kepercayaan', demographics?.religions?.length ?? 0],
              ['Suku', demographics?.ethnicities?.length ?? 0],
              ['Status pernikahan', demographics?.marital_statuses?.length ?? 0],
              ['Distribusi dusun', demographics?.dusun_distribution?.length ?? 0],
            ].map(([label, count]) => (
              <div key={String(label)} className="flex items-center justify-between border-b border-paper-100 pb-2 last:border-0 last:pb-0">
                <span className="text-sm text-ink-700">{label}</span>
                <span className={`text-xs font-semibold ${Number(count) > 0 ? 'text-green-700' : 'text-amber-600'}`}>
                  {Number(count) > 0 ? `${count} kelompok` : 'Belum diisi'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-paper-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 text-amber-700">
            <Map size={18} />
          </span>
          <div>
            <h3 className="font-semibold text-ink-950">Data Geografis</h3>
            <p className="text-xs text-ink-400">Luas wilayah, iklim, batas, dan koordinat</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-md bg-paper-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-400">Luas wilayah</div>
            <div className="mt-2 font-editorial text-2xl text-ink-950">{areaLabel} Ha</div>
          </div>
          <div className="rounded-md bg-paper-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-400">Ketinggian</div>
            <div className="mt-2 font-editorial text-2xl text-ink-950">
              {geography?.elevation || desaInfo.ketinggian}
            </div>
          </div>
          <div className="rounded-md bg-paper-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-400">Curah hujan</div>
            <div className="mt-2 font-editorial text-2xl text-ink-950">
              {geography?.rainfall || desaInfo.curahHujan}
            </div>
          </div>
          <div className="rounded-md bg-paper-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-ink-400">Suhu</div>
            <div className="mt-2 font-editorial text-2xl text-ink-950">
              {geography?.temperature || desaInfo.suhu}
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-paper-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {boundaries.map(([direction, boundary]) => (
            <div key={direction}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-ink-400">{direction}</div>
              <p className="mt-1 text-sm text-ink-700">{boundary}</p>
            </div>
          ))}
        </div>
        {geography?.latitude != null && geography.longitude != null && (
          <p className="mt-4 text-xs text-ink-400">
            Koordinat: {geography.latitude}, {geography.longitude}
          </p>
        )}
      </section>

      <div className="flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <Database size={18} className="mt-0.5 shrink-0" />
        <p>
          Form edit data akan ditambahkan pada tahap CMS berikutnya. Saat ini halaman ini sudah
          membaca ringkasan dari Supabase dan tetap menggunakan data lokal sebagai fallback.
        </p>
      </div>
    </div>
  )
}
