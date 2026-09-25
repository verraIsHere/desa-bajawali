import Image from "next/image";
import { NavigationChevron } from "@/components/ui/NavigationChevron";

export const metadata = {
  title: "Sejarah Desa Bajawali",
};

export default function SejarahPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-400">Profil Desa</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Sejarah Desa Bajawali
          </h1>
          
          <div className="relative aspect-[21/9] w-full mb-12 border border-paper-200 rounded-md overflow-hidden">
            <Image 
              src="/gambar/background/background_1.webp" 
              alt="Sejarah Desa Bajawali" 
              fill
              className="object-cover"
            />
          </div>

          <div className="prose prose-xl prose-p:text-ink-800 prose-headings:font-editorial prose-headings:text-ink-950 max-w-none">
            <p className="text-xl font-medium text-ink-950 leading-relaxed mb-8">
              Desa Bajawali terletak di Kecamatan Lariang, Kabupaten Pasangkayu, Provinsi Sulawesi Barat. Pada awalnya wilayah ini merupakan hutan belantara yang kemudian dibuka oleh pemerintah untuk menjadi pemukiman melalui program transmigrasi PIR.
            </p>
            
            <h2>Tujuan Program Transmigrasi</h2>
            <p>
              Program transmigrasi PIR tersebut bertujuan untuk penyebaran jumlah penduduk serta mengentaskan kemiskinan. Warga transmigrasi ditempatkan di wilayah tersebut pada periode <strong>26 Desember 1991</strong> sampai dengan <strong>12 Maret 1993</strong>.
            </p>
            
            <h2>Perjalanan Menjadi Desa Definitif</h2>
            <p>
              Sebelum menjadi desa definitif, Desa Bajawali berada di bawah naungan binaan Departemen Transmigrasi dengan nama <strong>UPT Baras VII</strong>. Pada tanggal <strong>26 Februari 1997</strong>, Pemerintah melalui Departemen Transmigrasi menyerahkan Desa Bajawali kepada Pemerintah Daerah berdasarkan Surat Keputusan <strong>Nomor: Ba.61/M/11/1997</strong>. Sejak saat itu, Desa Bajawali menjadi Desa Definitif.
            </p>

            <div className="my-12 border-l-4 border-green-700 pl-6 py-2 bg-paper-100 italic text-ink-600">
              &quot;Pada tahun tersebut masyarakat bermusyawarah untuk merumuskan nama yang terbaik bagi Pemukiman Eks Transmigrasi (UPT Baras VII), dan dari hasil musyawarah tersebut disepakati nama BAJAWALI.&quot;
            </div>

            <h2>Makna Nama Bajawali</h2>
            <p>
              Menurut dokumen, secara etimologi nama Bajawali berasal dari kata Sanskerta, yaitu <strong>JAVA</strong> dan <strong>BALI</strong>, yang memiliki makna:
            </p>

            <div className="not-prose my-8 border border-paper-200 bg-paper-50 p-8 text-center rounded-md">
              <div className="text-xs font-bold uppercase tracking-widest text-green-700 mb-3">Makna Bajawali</div>
              <div className="font-editorial text-3xl md:text-4xl text-ink-950">
                Kelahiran dan Tempat Berpijak
              </div>
            </div>

            <h2>Kondisi Saat Ini</h2>
            <p>
              Kini, Desa Bajawali terus berbenah menuju desa yang mandiri dan berdaya saing dengan moto <strong>BAJAWALIKU JAYA</strong>. Melalui kolaborasi antara pemerintah desa dan warga, berbagai potensi lokal terus digali, baik dari sektor pertanian maupun pemberdayaan UMKM.
            </p>
          </div>
          
          <div className="mt-16 pt-8 border-t border-paper-200 flex justify-between items-center">
            <div className="text-sm text-ink-600">Terakhir diperbarui: 2026</div>
            <a href="/profil/struktur-pemerintahan" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors">
              Lihat Struktur Pemerintahan <NavigationChevron direction="next" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
