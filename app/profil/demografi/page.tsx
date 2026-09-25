import { mataPencaharian } from "@/data/dummy";
import { NavigationChevron } from "@/components/ui/NavigationChevron";
import {
  getPublicVillageDemographics,
  getPublicVillageProfile,
  getPublicVillageStatistics,
} from '@/lib/queries/village';

export const metadata = {
  title: "Demografi Desa Bajawali",
};

export default async function DemografiPage() {
  const [profile, statistics, demographics] = await Promise.all([
    getPublicVillageProfile(),
    getPublicVillageStatistics(),
    getPublicVillageDemographics(),
  ])
  const ageGroups = demographics.age_groups.length > 0
    ? demographics.age_groups
    : [
        { label: '0-14', value: 119 },
        { label: '15-24', value: 143 },
        { label: '25-54', value: 346 },
        { label: '55-64', value: 102 },
        { label: '65+', value: 52 },
      ]
  const dusunDistribution = demographics.dusun_distribution.length > 0
    ? demographics.dusun_distribution
    : [
        { label: 'Dusun Kerta', value: 164 },
        { label: 'Dusun Makmur', value: 350 },
        { label: 'Dusun Lestari', value: 174 },
        { label: 'Dusun Mandiri', value: 77 },
      ]
  const topAgeGroup = ageGroups.reduce((largest, current) =>
    current.value > largest.value ? current : largest,
  )
  const youngestAge = ageGroups[0]?.value ?? 119
  const oldestAge = ageGroups[ageGroups.length - 1]?.value ?? 52

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-400">Profil Desa</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Kependudukan & Demografi
          </h1>
          
          <div className="prose prose-xl prose-p:text-ink-800 prose-headings:font-editorial prose-headings:text-ink-950 max-w-none mb-12">
            <p>
              Berdasarkan data profil tahun {statistics.data_year}, {profile.name} memiliki total penduduk sebanyak <strong>{statistics.population} jiwa</strong> yang tergabung dalam <strong>{statistics.households} Kepala Keluarga (KK)</strong>.
            </p>
            <p>
              Penduduk tersebar di {statistics.dusun} dusun dan {statistics.rt} Rukun Tetangga (RT). Mata pencaharian warga antara lain {mataPencaharian.map((m, i) => (
                <span key={m}>
                  {i > 0 && i < mataPencaharian.length - 1 ? ', ' : i === mataPencaharian.length - 1 ? ', dan ' : ''}
                  <strong>{m.toLowerCase()}</strong>
                </span>
              ))}, dengan sektor pertanian dan perkebunan sebagai penopang utama ekonomi wilayah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-paper-50 border border-paper-200 p-8 rounded-md">
              <div className="text-sm font-semibold text-ink-600 mb-2">Total Penduduk</div>
              <div className="font-editorial text-5xl font-semibold text-ink-950 mb-4">{statistics.population}</div>
              
              <div className="flex gap-4 border-t border-paper-200 pt-4 mt-6">
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-ink-400 mb-1">Laki-laki</div>
                  <div className="font-editorial text-2xl text-ink-950">{statistics.male_population}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-ink-400 mb-1">Perempuan</div>
                  <div className="font-editorial text-2xl text-ink-950">{statistics.female_population}</div>
                </div>
              </div>
            </div>

            <div className="bg-paper-50 border border-paper-200 p-8 rounded-md">
              <div className="text-sm font-semibold text-ink-600 mb-2">Kepala Keluarga</div>
              <div className="font-editorial text-5xl font-semibold text-ink-950 mb-4">
                {statistics.households} <span className="text-2xl text-ink-400 font-sans">KK</span>
              </div>
              
              <div className="flex gap-4 border-t border-paper-200 pt-4 mt-6">
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-ink-400 mb-1">Jumlah Dusun</div>
                  <div className="font-editorial text-2xl text-ink-950">{statistics.dusun}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-ink-400 mb-1">Jumlah RT</div>
                  <div className="font-editorial text-2xl text-ink-950">{statistics.rt}</div>
                </div>
              </div>
            </div>

            <div className="bg-paper-50 border border-paper-200 p-8 rounded-md md:col-span-2 lg:col-span-1">
              <div className="text-sm font-semibold text-ink-600 mb-2">Kelompok Umur Terbanyak</div>
              <div className="font-editorial text-5xl font-semibold text-ink-950 mb-4">
                {topAgeGroup.value} <span className="text-2xl text-ink-400 font-sans">jiwa</span>
              </div>
              
              <div className="flex gap-4 border-t border-paper-200 pt-4 mt-6">
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-ink-400 mb-1">Usia</div>
                  <div className="font-editorial text-2xl text-ink-950">{topAgeGroup.label}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-ink-400 mb-1">Usia 0–14</div>
                  <div className="font-editorial text-2xl text-ink-950">{youngestAge}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-ink-400 mb-1">Usia 65+</div>
                  <div className="font-editorial text-2xl text-ink-950">{oldestAge}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-paper-200 bg-paper-50 p-6 md:p-8 rounded-md">
            <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-4">
              Sebaran Penduduk per Dusun
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {dusunDistribution.map((dusun) => (
                <div key={dusun.label}>
                  <div className="font-editorial text-3xl text-ink-950 mb-1">{dusun.value}</div>
                  <div className="text-sm font-semibold text-ink-600">{dusun.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a href="/data-desa" className="inline-flex items-center justify-center gap-2 bg-transparent border border-paper-200 text-ink-800 hover:border-green-700 hover:text-green-700 px-6 py-3 rounded-md font-medium transition-colors">
              Lihat Analitik & Grafik Data Desa <NavigationChevron direction="next" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
