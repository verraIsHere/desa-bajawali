import Link from "next/link";
import { NavigationChevron } from "@/components/ui/NavigationChevron";
import { mataPencaharian } from "@/data/dummy";

export const metadata = {
  title: "Potensi Perikanan Desa Bajawali",
};

export default function PotensiPerikananPage() {
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
              Perikanan
            </span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Perikanan Desa
          </h1>
          <p className="text-ink-800 text-lg leading-relaxed">
            Berdasarkan Profil Desa Bajawali Tahun 2026, sektor perikanan bukan merupakan mata pencaharian utama warga. Enam mata pencaharian yang tercatat adalah {mataPencaharian.map((m, i) => (
              <span key={m}>
                {i > 0 && i < mataPencaharian.length - 1 ? ', ' : i === mataPencaharian.length - 1 ? ', dan ' : ''}
                <strong>{m.toLowerCase()}</strong>
              </span>
            ))}.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border border-paper-200 bg-paper-50 p-6 rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Mata Pencaharian Tercatat</div>
              <div className="font-editorial text-4xl text-ink-950 mb-1">
                6 <span className="text-lg font-sans text-ink-400">sektor</span>
              </div>
              <p className="text-sm text-ink-600">Tanpa kategori nelayan atau perikanan.</p>
            </div>
            <div className="border border-paper-200 bg-paper-50 p-6 rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Kelompok Ternak</div>
              <div className="font-editorial text-4xl text-ink-950 mb-1">
                1 <span className="text-lg font-sans text-ink-400">kelompok</span>
              </div>
              <p className="text-sm text-ink-600">Lembaga peternakan desa yang tercatat pada profil.</p>
            </div>
            <div className="border border-paper-200 bg-paper-50 p-6 rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Sektor Andalan</div>
              <div className="font-editorial text-3xl text-ink-950 mb-1">Pertanian</div>
              <p className="text-sm text-ink-600">Kelapa sawit sebagai komoditas andalan warga.</p>
            </div>
          </div>

          <div className="prose prose-xl prose-p:text-ink-800 prose-headings:font-editorial prose-headings:text-ink-950 max-w-none">
            <h2>Kondisi Sektor Perikanan</h2>
            <p>
              Profil Desa 2026 mencatat ekonomi Desa Bajawali bertumpu pada pertanian dan perkebunan, dengan kelompok tani sebanyak 10 kelompok beserta 1 Gapoktan, 1 BUMDesa, dan 1 kelompok ternak. Kegiatan perikanan tidak tercatat sebagai salah satu dari enam mata pencaharian warga.
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
