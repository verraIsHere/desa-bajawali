import Link from "next/link";
import { NavigationChevron } from "@/components/ui/NavigationChevron";
import { desaInfo, batasWilayah, mataPencaharian } from "@/data/dummy";

export const metadata = {
  title: "Potensi Sumber Daya Alam Desa Bajawali",
};

export default function PotensiSumberDayaAlamPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/potensi" className="text-xs font-bold uppercase tracking-widest text-ink-400 hover:text-green-700 transition-colors">
              Potensi Desa
            </Link>
            <span className="text-ink-400 text-xs"><NavigationChevron direction="next" /></span>
            <span className="text-xs font-bold uppercase tracking-widest text-ink-950">
              Sumber Daya Alam
            </span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Sumber Daya Alam
          </h1>
          <p className="text-ink-800 text-lg leading-relaxed">
            Desa Bajawali membentang seluas {desaInfo.luasWilayah} Ha pada ketinggian {desaInfo.ketinggian} mdpl, dengan curah hujan {desaInfo.curahHujan} dan suhu rata-rata {desaInfo.suhu} yang menunjang kegiatan pertanian dan perkebunan warga.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="border border-paper-200 bg-paper-50 p-6 rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Luas Wilayah</div>
              <div className="font-editorial text-3xl text-ink-950 mb-1">
                {desaInfo.luasWilayah} <span className="text-lg font-sans text-ink-400">Ha</span>
              </div>
            </div>
            <div className="border border-paper-200 bg-paper-50 p-6 rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Ketinggian</div>
              <div className="font-editorial text-3xl text-ink-950 mb-1">{desaInfo.ketinggian}</div>
            </div>
            <div className="border border-paper-200 bg-paper-50 p-6 rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Curah Hujan</div>
              <div className="font-editorial text-3xl text-ink-950 mb-1">{desaInfo.curahHujan}</div>
            </div>
          </div>

          <div className="prose prose-xl prose-p:text-ink-800 prose-headings:font-editorial prose-headings:text-ink-950 max-w-none">
            <h2>Kondisi Wilayah</h2>
            <p>
              Suhu rata-rata wilayah {desaInfo.suhu} dengan curah hujan {desaInfo.curahHujan} menciptakan kondisi alam yang mendukung aktivitas warga. Hasil pertanian kelapa sawit menjadi komoditas andalan yang dikelola dari sumber daya alam desa.
            </p>

            <h2>Batas Wilayah</h2>
            <ul>
              {batasWilayah.map((b) => (
                <li key={b.arah}>
                  <strong>{b.arah}:</strong> {b.batas}
                </li>
              ))}
            </ul>

            <h2>Pengelolaan Berkelanjutan</h2>
            <p>
              Partisipasi masyarakat dalam gotong royong menjaga kebersihan fasilitas umum dan lingkungan menjadi modal sosial dalam mengelola sumber daya alam desa secara berkelanjutan, ditopang oleh mata pencaharian warga yang bergantung pada lahan, antara lain {mataPencaharian.slice(0, 2).map((m) => m.toLowerCase()).join(" dan ")}.
            </p>
          </div>

          <div className="mt-12">
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
    </div>
  );
}
