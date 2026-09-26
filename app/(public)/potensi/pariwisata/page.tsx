import Link from "next/link";
import { NavigationChevron } from "@/components/ui/NavigationChevron";

export const metadata = {
  title: "Potensi Pariwisata & Budaya Desa Bajawali",
};

const kesenian = [
  { nama: "Kelompok Seni Gamelan", jumlah: 2, satuan: "grup" },
  { nama: "Kelompok Seni Tari", jumlah: 3, satuan: "grup" },
  { nama: "Upacara Adat", jumlah: 2, satuan: "grup" },
];

const peribadatan = [
  { nama: "Pura", jumlah: 6, satuan: "unit" },
  { nama: "Masjid", jumlah: 1, satuan: "unit" },
  { nama: "Mushola", jumlah: 2, satuan: "unit" },
];

export default function PotensiPariwisataPage() {
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
              Pariwisata & Budaya
            </span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Pariwisata & Budaya Desa
          </h1>
          <p className="text-ink-800 text-lg leading-relaxed">
            Kekayaan budaya Desa Bajawali tumbuh dari masyarakat yang menganut budaya ketimuran, ramah tamah, dan menjunjung sopan santun, diperkuat oleh kehidupan beragama serta kesenian yang hidup di setiap dusun.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {kesenian.map((k) => (
              <div key={k.nama} className="border border-paper-200 bg-paper-50 p-6 rounded-md">
                <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">
                  {k.nama}
                </div>
                <div className="font-editorial text-4xl text-ink-950 mb-1">
                  {k.jumlah} <span className="text-lg font-sans text-ink-400">{k.satuan}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="prose prose-xl prose-p:text-ink-800 prose-headings:font-editorial prose-headings:text-ink-950 max-w-none">
            <h2>Potensi Budaya</h2>
            <ul>
              <li>Menganut budaya ketimuran.</li>
              <li>Ramah tamah.</li>
              <li>Sopan santun.</li>
            </ul>

            <h2>Potensi Keagamaan</h2>
            <p>
              Tingkat kehidupan beragama di Desa Bajawali sangat tinggi, dengan kerukunan antar umat beragama serta kerukunan antar umat beragama dengan pemerintah yang sangat harmonis.
            </p>
            <div className="not-prose grid grid-cols-3 gap-4 my-8">
              {peribadatan.map((p) => (
                <div key={p.nama} className="border border-paper-200 bg-paper-50 p-5 rounded-md text-center">
                  <div className="font-editorial text-3xl text-ink-950 mb-1">{p.jumlah}</div>
                  <div className="text-sm font-semibold text-ink-600">{p.nama}</div>
                  <div className="text-xs text-ink-400">{p.satuan}</div>
                </div>
              ))}
            </div>

            <h2>Sarana Kesenian</h2>
            <p>
              Kesenian tradisional dikelola melalui kelompok seni gamelan, kelompok seni tari, dan kelompok upacara adat yang menjadi daya tarik budaya Desa Bajawali.
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
