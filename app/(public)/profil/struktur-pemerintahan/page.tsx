import Image from 'next/image'
import { getPublicVillageStructure } from '@/lib/queries/village'

export const metadata = {title: 'Struktur Pemerintahan Desa Bajawali'}

const getInitials = (nama: string) =>
  nama
    .replace(/,.*$/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

export default async function StrukturPemerintahanPage() {
  const { officials, bpd } = await getPublicVillageStructure()
  const kepalaDesa = officials.find((official) => official.position === 'Kepala Desa')
  const perangkatDesa = officials
    .filter(
      (official) =>
        official.position !== 'Kepala Desa' && official.position !== 'Kepala Dusun',
    )
    .map((official) => ({
      jabatan: official.position,
      nama: official.name,
      foto: official.photo_url || undefined,
    }))
  const kepalaDusun = officials
    .filter((official) => official.position === 'Kepala Dusun')
    .map((official) => ({
      dusun: official.dusun ? `Kadus ${official.dusun}` : 'Kepala Dusun',
      nama: official.name,
      foto: official.photo_url || undefined,
    }))

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-ink-400">
                Profil Desa
              </span>
            </div>
            <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8 text-center">
              Struktur Pemerintahan
            </h1>
            <p className="text-ink-800 text-lg text-center max-w-2xl mx-auto mb-6">
              Sistem pemerintahan dan kelembagaan yang mengatur jalannya administrasi, pembangunan,
              dan pelayanan masyarakat di Desa Bajawali.
            </p>
            <p className="text-xs text-ink-400 text-center max-w-2xl mx-auto mb-16">
              Berdasarkan SK Kepala Desa Lampiran 4 Nomor 01 Tahun 2025 tentang Struktur Organisasi
              Pemerintah Desa.
            </p>
          </div>

          {/* Kepala Desa */}
          <section className="mb-20">
            <div className="bg-paper-50 border border-paper-200 rounded-md overflow-hidden">
              <div className="grid md:grid-cols-[280px_1fr]">
                {/* Foto */}
                <div className="relative h-[360px] md:h-[400px] bg-paper-200">
                  <Image
                    src={kepalaDesa?.photo_url || '/gambar/struktur/kepala-desa-bajawali.webp'}
                    alt={kepalaDesa ? `Kepala Desa ${kepalaDesa.name}` : 'Kepala Desa Bajawali'}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 280px"
                  />
                </div>
                {/* Informasi */}
                <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-green-700 mb-3">
                    Kepala Desa
                  </span>
                  <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl font-semibold text-ink-950 leading-tight mb-5">
                    {kepalaDesa?.name || 'Ketut Langga, S.Ag'}
                  </h2>
                  <div className="w-12 h-px bg-paper-300 mb-5" />
                  <p className="text-ink-600 text-base md:text-lg leading-relaxed max-w-xl">
                    {kepalaDesa?.welcome_text ||
                      'Memimpin penyelenggaraan pemerintahan desa, pelaksanaan pembangunan desa, pembinaan kemasyarakatan desa, dan pemberdayaan masyarakat desa.'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Perangkat Desa */}
          <section className="mb-16">
            <div className="mb-10">
              <div className="flex items-center gap-4">
                <h3 className="font-editorial text-2xl md:text-3xl text-ink-950 whitespace-nowrap">
                  Perangkat Desa
                </h3>
                <div className="h-px bg-paper-200 flex-1" />
              </div>
              <p className="text-ink-500 text-sm mt-3 max-w-xl">
                Unsur pelaksana yang mendukung penyelenggaraan pemerintahan dan pelayanan masyarakat
                di Desa Bajawali.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {perangkatDesa.map((perangkat) => (
                <div
                  key={`${perangkat.jabatan}-${perangkat.nama}`}
                  className="bg-paper-50 border border-paper-200 rounded-md p-5 md:p-6 text-center"
                >
                  <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-5 overflow-hidden rounded-full border-4 border-white shadow-sm bg-paper-200 flex items-center justify-center">
                    {perangkat.foto ? (
                      <Image
                        src={perangkat.foto}
                        alt={`Foto ${perangkat.nama}`}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span className="font-editorial text-2xl md:text-3xl text-ink-500">
                        {getInitials(perangkat.nama)}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-green-700 mb-2">
                    {perangkat.jabatan}
                  </div>
                  <h4 className="font-editorial text-xl md:text-2xl font-semibold text-ink-950">
                    {perangkat.nama}
                  </h4>
                </div>
              ))}
            </div>
          </section>

          {/* Kepala Dusun */}
          <section className="mb-16">
            <div className="mb-10">
              <div className="flex items-center gap-4">
                <h3 className="font-editorial text-2xl md:text-3xl text-ink-950 whitespace-nowrap">
                  Kepala Dusun
                </h3>
                <div className="h-px bg-paper-200 flex-1" />
              </div>
              <p className="text-ink-500 text-sm mt-3 max-w-xl">
                Pemimpin wilayah di masing-masing dusun yang menaungi 8 RT di Desa Bajawali.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {kepalaDusun.map((dusun) => (
                <div
                  key={dusun.dusun}
                  className="bg-paper-50 border border-paper-200 rounded-md p-5 md:p-6 text-center"
                >
                  <div className="relative w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full border-4 border-white shadow-sm bg-paper-200 flex items-center justify-center">
                    {dusun.foto ? (
                      <Image
                        src={dusun.foto}
                        alt={`Foto ${dusun.nama}`}
                        fill
                        sizes="80px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span className="font-editorial text-xl text-ink-500">
                        {getInitials(dusun.nama)}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-green-700 mb-2">
                    {dusun.dusun}
                  </div>
                  <h4 className="font-editorial text-xl font-semibold text-ink-950">
                    {dusun.nama}
                  </h4>
                </div>
              ))}
            </div>
          </section>

          {/* BPD */}
          <section>
            <div className="mb-10">
              <div className="flex items-center gap-4">
                <h3 className="font-editorial text-2xl md:text-3xl text-ink-950 whitespace-nowrap">
                  Badan Permusyawaratan Desa
                </h3>
                <div className="h-px bg-paper-200 flex-1" />
              </div>
              <p className="text-ink-500 text-sm mt-3 max-w-xl">
                Susunan pengurus BPD Bajawali sebagai mitra pemerintah desa.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {bpd.map((anggota) => (
                <div
                  key={`${anggota.position}-${anggota.name}`}
                  className="bg-paper-50 border border-paper-200 rounded-md p-5 md:p-6 text-center"
                >
                  <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-green-700 mb-2">
                    {anggota.position}
                  </div>
                  <h4 className="font-editorial text-xl md:text-2xl font-semibold text-ink-950">
                    {anggota.name}
                  </h4>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
