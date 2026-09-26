import {lembagaPerekonomian, saranaDesa, mataPencaharian} from '@/data/dummy'
import {
  getPublicVillageDemographics,
  getPublicVillageGeography,
  getPublicVillageStatistics,
  getPublicVillageStructure,
} from '@/lib/queries/village'
import Image from 'next/image'
import {
  KelompokUmurBarChartWrapper,
  AgamaDoughnutChartWrapper,
  SukuDoughnutChartWrapper,
  StatusPernikahanPieChartWrapper,
  DistribusiWilayahBarChartWrapper,
  LembagaEkonomiDoughnutChartWrapper,
} from '@/components/charts/ChartsWrapper'

export const metadata = {
  title: 'Data Desa & Statistik Bajawali',
}

export default async function DataDesaPage() {
  const [statistics, geography, demographics, structure] = await Promise.all([
    getPublicVillageStatistics(),
    getPublicVillageGeography(),
    getPublicVillageDemographics(),
    getPublicVillageStructure(),
  ])
  const population = statistics.population
  const households = statistics.households
  const dusun = statistics.dusun
  const rt = statistics.rt
  const area = geography.area_ha.toLocaleString('id-ID', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
  const dataYear = statistics.data_year

  // Chart dan label mengikuti data demografi di Supabase, bukan angka manual.
  const occupations =
    demographics.occupations.length > 0
      ? demographics.occupations.map((item) => item.label)
      : mataPencaharian

  // Kartu kepala desa mengikuti tabel village_officials.
  const kepalaDesa = structure.officials.find(
    (official) => official.position === 'Kepala Desa'
  )

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between items-start mb-16">
          <div className="max-w-2xl">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-ink-400">
                Data Desa
              </span>
            </div>
            <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
              Data & Statistik
            </h1>
            <p className="text-ink-800 text-lg leading-relaxed mb-6">
              Halaman ini menyajikan statistik dan indikator Desa Bajawali dalam bentuk angka,
              grafik, dan keterangan sumber.
            </p>
          </div>

          {/* Profil Kepala Desa */}
          <div className="w-full lg:w-[380px] flex-shrink-0 bg-paper-50 border border-paper-200 p-6 md:p-8 rounded-2xl flex flex-col items-center text-center shadow-sm">
            <div className="w-28 h-28 relative rounded-full overflow-hidden border-4 border-white shadow-sm mb-4">
              <Image
                src={kepalaDesa?.photo_url || '/gambar/struktur/kepala-desa-bajawali.webp'}
                alt={kepalaDesa ? `Kepala Desa ${kepalaDesa.name}` : 'Kepala Desa Bajawali'}
                fill
                sizes="112px"
                className="object-cover object-top"
              />
            </div>
            <div className="mb-4">
              <h3 className="font-editorial text-2xl text-ink-950 mb-1">
                {kepalaDesa?.name || 'Kepala Desa Bajawali'}
              </h3>
              <div className="text-xs font-bold uppercase tracking-widest text-green-700">
                Kepala Desa Bajawali
              </div>
            </div>
            <div className="relative">
              <p className="text-ink-700 leading-relaxed italic text-[15px] relative z-10">
                &quot;Data dan statistik ini merupakan bentuk komitmen kami terhadap transparansi
                untuk membangun Desa Bajawali yang lebih terukur, maju, dan sejahtera.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* KPI Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="border-t border-paper-200 pt-6">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">
              Populasi
            </div>
            <div className="font-editorial text-4xl text-ink-950 mb-2">
              {population} <span className="text-lg text-ink-400 font-sans">jiwa</span>
            </div>
            <div className="text-xs text-ink-600 bg-paper-100 inline-block px-2 py-1 rounded-sm">
              Data Desa &bull; {dataYear}
            </div>
          </div>

          <div className="border-t border-paper-200 pt-6">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">
              Luas Wilayah
            </div>
            <div className="font-editorial text-4xl text-ink-950 mb-2">
              {area} <span className="text-lg text-ink-400 font-sans">Ha</span>
            </div>
            <div className="text-xs text-ink-600 bg-paper-100 inline-block px-2 py-1 rounded-sm">
              Profil Desa &bull; {dataYear}
            </div>
          </div>

          <div className="border-t border-paper-200 pt-6">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">
              Kepala Keluarga
            </div>
            <div className="font-editorial text-4xl text-ink-950 mb-2">
              {households} <span className="text-lg text-ink-400 font-sans">KK</span>
            </div>
            <div className="text-xs text-ink-600 bg-paper-100 inline-block px-2 py-1 rounded-sm">
              Data Desa
            </div>
          </div>

          <div className="border-t border-paper-200 pt-6">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">
              RT / Dusun
            </div>
            <div className="font-editorial text-4xl text-ink-950 mb-2">
              {rt}{' '}
              <span className="text-lg text-ink-400 font-sans">/ {dusun}</span>
            </div>
            <div className="text-xs text-ink-600 bg-paper-100 inline-block px-2 py-1 rounded-sm">
              Data Desa
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-8 lg:gap-12">
            {/* Chart: Demografi Kelompok Umur */}
            <div className="bg-paper-50 border border-paper-200 p-6 md:p-8 rounded-md">
              <div className="mb-6">
                <h3 className="font-editorial text-2xl text-ink-950 mb-2">
                  Kelompok Umur Penduduk
                </h3>
                <p className="text-sm text-ink-600">
                  Distribusi usia penduduk Desa Bajawali (Profil Desa {dataYear})
                </p>
              </div>
              <div className="h-[350px] w-full">
                <KelompokUmurBarChartWrapper rows={demographics.age_groups} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Chart: Lembaga Perekonomian */}
            <div className="lg:col-span-1 bg-paper-50 border border-paper-200 p-6 md:p-8 rounded-md flex flex-col">
              <div className="mb-6">
                <h3 className="font-editorial text-2xl text-ink-950 mb-2">Lembaga Perekonomian</h3>
                <p className="text-sm text-ink-600">Jumlah kelompok ekonomi desa.</p>
              </div>
              <div className="flex-1 h-[250px] w-full">
                <LembagaEkonomiDoughnutChartWrapper />
              </div>
            </div>

            {/* Mata Pencaharian */}
            <div className="lg:col-span-2 border border-paper-200 p-6 md:p-8 rounded-md flex flex-col justify-center bg-paper-100">
              <h3 className="font-editorial text-3xl text-ink-950 mb-4">Mata Pencaharian Warga</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {occupations.map((pekerjaan) => (
                  <span
                    key={pekerjaan}
                    className="text-sm font-semibold text-ink-800 bg-paper-50 border border-paper-200 px-3 py-1.5 rounded-full"
                  >
                    {pekerjaan}
                  </span>
                ))}
              </div>
              <p className="text-ink-800 leading-relaxed mb-6">
                Untuk mendukung perekonomian warga, Desa Bajawali memiliki{' '}
                {lembagaPerekonomian
                  .map((l) => `${l.jumlah} ${l.nama.toLowerCase()}`)
                  .join(', ')
                  .replace(/, ([^,]*)$/, ', dan $1')}
                .
              </p>
              <div className="text-sm font-semibold text-green-700">Pemerintah Desa Bajawali</div>
            </div>
          </div>

          {/* New Charts: Agama, Suku, Status Pernikahan, Wilayah */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-12 border-t border-paper-200">
            {/* Chart: Agama */}
            <div className="bg-paper-50 border border-paper-200 p-6 md:p-8 rounded-md flex flex-col">
              <div className="mb-6">
                <h3 className="font-editorial text-2xl text-ink-950 mb-2">Kepercayaan & Agama</h3>
                <p className="text-sm text-ink-600">Distribusi pemeluk agama (Profil Desa {dataYear})</p>
              </div>
              <div className="flex-1 h-[250px] w-full">
                <AgamaDoughnutChartWrapper rows={demographics.religions} />
              </div>
            </div>

            {/* Chart: Komposisi Suku */}
            <div className="bg-paper-50 border border-paper-200 p-6 md:p-8 rounded-md flex flex-col">
              <div className="mb-6">
                <h3 className="font-editorial text-2xl text-ink-950 mb-2">Komposisi Suku</h3>
                <p className="text-sm text-ink-600">Sebaran Suku Warga (Profil Desa {dataYear})</p>
              </div>
              <div className="flex-1 h-[250px] w-full">
                <SukuDoughnutChartWrapper rows={demographics.ethnicities} />
              </div>
            </div>

            {/* Chart: Status Pernikahan */}
            <div className="bg-paper-50 border border-paper-200 p-6 md:p-8 rounded-md flex flex-col">
              <div className="mb-6">
                <h3 className="font-editorial text-2xl text-ink-950 mb-2">Status Pernikahan</h3>
                <p className="text-sm text-ink-600">Kawin vs Belum Kawin (Profil Desa {dataYear})</p>
              </div>
              <div className="flex-1 h-[250px] w-full">
                <StatusPernikahanPieChartWrapper rows={demographics.marital_statuses} />
              </div>
            </div>

            {/* Chart: Wilayah */}
            <div className="bg-paper-50 border border-paper-200 p-6 md:p-8 rounded-md flex flex-col">
              <div className="mb-6">
                <h3 className="font-editorial text-2xl text-ink-950 mb-2">Distribusi Wilayah</h3>
                <p className="text-sm text-ink-600">Sebaran Populasi per Dusun (Profil Desa {dataYear})</p>
              </div>
              <div className="flex-1 h-[300px] w-full">
                <DistribusiWilayahBarChartWrapper rows={demographics.dusun_distribution} />
              </div>
            </div>
          </div>

          {/* Sarana & Prasarana */}
          <div className="pt-12 border-t border-paper-200">
            <div className="mb-8">
              <h3 className="font-editorial text-2xl md:text-3xl text-ink-950 mb-2">
                Sarana & Prasarana Desa
              </h3>
              <p className="text-sm text-ink-600">
                Fasilitas dan sarana desa berdasarkan Profil Desa {dataYear}.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {saranaDesa.map((kategori) => (
                <div
                  key={kategori.kategori}
                  className="bg-paper-50 border border-paper-200 p-6 rounded-md"
                >
                  <div className="text-xs font-bold uppercase tracking-widest text-green-700 mb-4">
                    {kategori.kategori}
                  </div>
                  <ul className="flex flex-col gap-3">
                    {kategori.items.map((item) => (
                      <li
                        key={item.nama}
                        className="flex items-baseline justify-between gap-3 border-b border-paper-200 pb-2 last:border-b-0 last:pb-0"
                      >
                        <span className="text-sm text-ink-800">{item.nama}</span>
                        {item.jumlah !== undefined ? (
                          <span className="font-editorial text-lg text-ink-950 whitespace-nowrap">
                            {item.jumlah}{' '}
                            <span className="text-xs font-sans text-ink-400">{item.satuan}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-ink-400">tersedia</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
