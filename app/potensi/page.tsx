import Link from "next/link";
import Image from "next/image";
import { NavigationChevron } from "@/components/ui/NavigationChevron";
import { getPublicVillageGeography, getPublishedPotentials } from '@/lib/queries/village';

export const metadata = {
  title: "Potensi Desa Bajawali",
};

export default async function PotensiPage() {
  const [potentials, geography] = await Promise.all([
    getPublishedPotentials(),
    getPublicVillageGeography(),
  ])
  const agriculture = potentials.find((item) => item.slug === 'pertanian')
  const umkm = potentials.find((item) => item.slug === 'umkm')
  const pariwisata = potentials.find((item) => item.slug === 'pariwisata')
  const perikanan = potentials.find((item) => item.slug === 'perikanan')
  const sumberDayaAlam = potentials.find((item) => item.slug === 'sumber-daya-alam')
  const area = geography.area_ha.toLocaleString('id-ID', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-400">Potensi Desa</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Yang tumbuh dari tanah dan kerja masyarakat.
          </h1>
          <p className="text-ink-800 text-lg leading-relaxed">
            Potensi Desa Bajawali ditampilkan berdasarkan kondisi nyata wilayah dan aktivitas masyarakat. Hasil pertanian kelapa sawit menjadi komoditas andalan, ditemani berkembangnya UMKM, 10 kelompok tani, serta kekayaan budaya dan keagamaan warga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[700px]">
          
          {/* Pertanian (Besar) */}
          <Link href="/potensi/pertanian" className="group md:col-span-7 md:row-span-2 relative block overflow-hidden border border-paper-200 h-[350px] md:h-full">
            <Image 
              src="https://images.pexels.com/photos/1576398/pexels-photo-1576398.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Potensi Pertanian"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <span className="text-white/80 text-sm font-bold uppercase tracking-widest mb-3">01</span>
              <h2 className="font-editorial text-4xl text-white mb-3">{agriculture?.title || 'Pertanian'}</h2>
              <p className="text-white/90 mb-6 max-w-md text-lg hidden md:block">{agriculture?.description || 'Kelapa sawit sebagai komoditas andalan warga, ditopang 10 kelompok tani dan 1 Gapoktan.'}</p>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="border-b border-white group-hover:border-transparent transition-colors">Lihat detail</span> <span className="transition-transform group-hover:translate-x-1"><NavigationChevron direction="next" /></span>
              </div>
            </div>
          </Link>
          
          {/* UMKM */}
          <Link href="/potensi/umkm" className="group md:col-span-5 relative block overflow-hidden border border-paper-200 h-[250px] md:h-auto">
            <Image 
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop" 
              alt="UMKM"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">02</span>
              <h2 className="font-editorial text-2xl text-white mb-3">{umkm?.title || 'UMKM & Kriya'}</h2>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="border-b border-white group-hover:border-transparent transition-colors">Lihat detail</span> <span className="transition-transform group-hover:translate-x-1"><NavigationChevron direction="next" /></span>
              </div>
            </div>
          </Link>
          
          {/* Pariwisata */}
          <Link href="/potensi/pariwisata" className="group md:col-span-5 relative block overflow-hidden border border-paper-200 h-[250px] md:h-auto">
            <Image 
              src="https://images.unsplash.com/photo-1592659762303-90081d34b277?q=80&w=800&auto=format&fit=crop" 
              alt="Pariwisata"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">03</span>
              <h2 className="font-editorial text-2xl text-white mb-3">{pariwisata?.title || 'Pariwisata Alam'}</h2>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="border-b border-white group-hover:border-transparent transition-colors">Lihat detail</span> <span className="transition-transform group-hover:translate-x-1"><NavigationChevron direction="next" /></span>
              </div>
            </div>
          </Link>

        </div>
        
        {/* Sisanya: Perikanan & SDA menggunakan text-based card jika foto belum banyak */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Link href="/potensi/perikanan" className="group bg-paper-50 border border-paper-200 p-8 hover:border-green-300 transition-colors">
            <span className="text-ink-400 text-xs font-bold uppercase tracking-widest mb-3 block">04</span>
            <h2 className="font-editorial text-2xl text-ink-950 mb-3 group-hover:text-green-800 transition-colors">{perikanan?.title || 'Perikanan'}</h2>
            <p className="text-ink-600 mb-6">{perikanan?.description || 'Enam mata pencaharian warga tercatat pada profil desa; sektor perikanan bukan di antaranya.'}</p>
            <div className="text-sm font-semibold text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">Jelajahi <NavigationChevron direction="next" /></div>
          </Link>
          
          <Link href="/potensi/sumber-daya-alam" className="group bg-paper-50 border border-paper-200 p-8 hover:border-green-300 transition-colors">
            <span className="text-ink-400 text-xs font-bold uppercase tracking-widest mb-3 block">05</span>
            <h2 className="font-editorial text-2xl text-ink-950 mb-3 group-hover:text-green-800 transition-colors">{sumberDayaAlam?.title || 'Sumber Daya Alam'}</h2>
            <p className="text-ink-600 mb-6">Luas {area} Ha, ketinggian {geography.elevation}, curah hujan {geography.rainfall}, dan suhu {geography.temperature}.</p>
            <div className="text-sm font-semibold text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">Jelajahi <NavigationChevron direction="next" /></div>
          </Link>
        </div>

      </div>
    </div>
  );
}
