import Link from "next/link";
import { NavigationChevron } from "@/components/ui/NavigationChevron";
import { lembagaPerekonomian, mataPencaharian } from "@/data/dummy";

export const metadata = {
  title: "Potensi UMKM Desa Bajawali",
};

export default function PotensiUmkmPage() {
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
              UMKM
            </span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            UMKM & Ekonomi Desa
          </h1>
          <p className="text-ink-800 text-lg leading-relaxed">
            Potensi ekonomi Desa Bajawali ditopang oleh meningkatnya daya beli masyarakat, hasil pertanian kelapa sawit sebagai komoditas andalan, serta berkembangnya usaha mikro, kecil, dan menengah (UMKM) di masyarakat.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border border-paper-200 bg-paper-50 p-6 rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Lembaga Ekonomi</div>
              <div className="font-editorial text-3xl text-ink-950 mb-1">1 BUMDesa</div>
              <p className="text-sm text-ink-600">Badan Usaha Milik Desa yang dikelola pemerintah desa.</p>
            </div>
            <div className="border border-paper-200 bg-paper-50 p-6 rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Kelompok Usaha</div>
              <div className="font-editorial text-3xl text-ink-950 mb-1">10 Kelompok Tani</div>
              <p className="text-sm text-ink-600">Didukung 1 Gapoktan dan 1 kelompok ternak.</p>
            </div>
            <div className="border border-paper-200 bg-paper-50 p-6 rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Mata Pencaharian</div>
              <div className="font-editorial text-3xl text-ink-950 mb-1">6 Sektor</div>
              <p className="text-sm text-ink-600">Termasuk pedagang sebagai penggerak ekonomi warga.</p>
            </div>
          </div>

          <div className="prose prose-xl prose-p:text-ink-800 prose-headings:font-editorial prose-headings:text-ink-950 max-w-none">
            <h2>Penggerak Ekonomi Warga</h2>
            <p>
              Mata pencaharian penduduk Desa Bajawali terdiri dari {mataPencaharian.map((m, i) => (
                <span key={m}>
                  {i > 0 && i < mataPencaharian.length - 1 ? ', ' : i === mataPencaharian.length - 1 ? ', dan ' : ''}
                  <strong>{m.toLowerCase()}</strong>
                </span>
              ))}. Perdagangan dan usaha mikro tumbuh seiring meningkatnya daya beli masyarakat serta hasil pertanian kelapa sawit sebagai komoditas andalan.
            </p>

            <h2>Lembaga Perekonomian Desa</h2>
            <ul>
              {lembagaPerekonomian.map((l) => (
                <li key={l.nama}>
                  <strong>{l.nama}:</strong> {l.jumlah} {l.satuan}
                </li>
              ))}
            </ul>
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
