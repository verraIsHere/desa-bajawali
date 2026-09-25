import Link from "next/link";
import { NavigationChevron } from "@/components/ui/NavigationChevron";
import { lembagaPerekonomian } from "@/data/dummy";

export const metadata = {
  title: "Potensi Pertanian Desa Bajawali",
};

export default function PotensiPertanianPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        {/* Header/Hero Article */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/potensi" className="text-xs font-bold uppercase tracking-widest text-ink-400 hover:text-green-700 transition-colors">
              Potensi Desa
            </Link>
            <span className="text-ink-400 text-xs"><NavigationChevron direction="next" /></span>
            <span className="text-xs font-bold uppercase tracking-widest text-ink-950">
              Pertanian
            </span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Pertanian & Perkebunan
          </h1>
          <p className="text-ink-800 text-lg leading-relaxed">
            Sektor pertanian dan perkebunan merupakan tulang punggung perekonomian sebagian besar masyarakat Desa Bajawali, dengan hasil pertanian kelapa sawit sebagai komoditas andalan.
          </p>
        </div>

        {/* Feature Image */}
        {/* <div className="relative aspect-[21/9] w-full mb-16 border border-paper-200 rounded-md overflow-hidden">
          <Image 
            src="https://images.pexels.com/photos/1576398/pexels-photo-1576398.jpeg?auto=compress&cs=tinysrgb&w=1200" 
            alt="Pertanian Desa Bajawali" 
            fill
            className="object-cover"
          />
        </div> */}

        {/* Article Body */}
        <div className="max-w-4xl mx-auto prose prose-xl prose-p:text-ink-800 prose-headings:font-editorial prose-headings:text-ink-950 max-w-none">
          <h2>Komoditas Andalan</h2>
          <p>
            Hasil pertanian kelapa sawit menjadi komoditas andalan masyarakat Desa Bajawali. Meningkatnya daya beli masyarakat menandakan sektor pertanian dan perkebunan terus tumbuh sebagai penopang ekonomi warga.
          </p>
          <p>
            Secara mata pencaharian, sebagian besar warga bekerja sebagai petani pekebun dan buruh tani, yang didukung oleh berkembangnya usaha mikro, kecil, dan menengah (UMKM) di masyarakat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 not-prose">
            <div className="border border-paper-200 p-6 rounded-md bg-paper-50">
              <div className="font-editorial text-3xl text-ink-950 mb-2">Kelapa Sawit</div>
              <p className="text-sm text-ink-600">Komoditas pertanian andalan masyarakat Desa Bajawali.</p>
            </div>
            <div className="border border-paper-200 p-6 rounded-md bg-paper-50">
              <div className="font-editorial text-3xl text-ink-950 mb-2">10 Kelompok Tani</div>
              <p className="text-sm text-ink-600">Didukung 1 Gapoktan, 1 BUMDesa, dan 1 kelompok ternak.</p>
            </div>
          </div>

          <h2>Dukungan Lembaga Desa</h2>
          <p>
            Pengelolaan pertanian didukung lembaga perekonomian desa berikut:
          </p>
          <ul>
            {lembagaPerekonomian.map((l) => (
              <li key={l.nama}>
                <strong>{l.nama}:</strong> {l.jumlah} {l.satuan}
              </li>
            ))}
          </ul>
          <p>
            Melalui kelompok tani tersebut, warga terus berupaya saling mendukung untuk meningkatkan kapasitas produksi dan mengelola lahan secara berkelanjutan.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-20 pt-8 border-t border-paper-200 flex justify-center">
          <Link href="/potensi" className="group inline-flex items-center justify-center gap-3 bg-green-700 text-white hover:bg-green-800 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-[0_8px_30px_rgb(8,118,83,0.3)] hover:-translate-y-1">
            <NavigationChevron
              direction="previous"
              size={20}
              className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
            />
            Kembali ke Daftar Potensi
          </Link>
        </div>

      </div>
    </div>
  );
}
