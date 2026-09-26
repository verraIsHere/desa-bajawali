import { desaInfo } from "@/data/dummy";

export const metadata = {
  title: "Moto & Program Desa Bajawali",
};

const bidangKerja = [
  {
    no: "01",
    judul: "Pemerintahan",
    desc: "Penyelenggaraan pemerintahan desa meliputi penghasilan tetap dan tunjangan kepala desa serta perangkat desa, jaminan sosial, operasional pemerintah desa dan BPD, musyawarah desa, penyusunan RPJMDesa dan RKPDesa, hingga penyampaian informasi kepada masyarakat.",
  },
  {
    no: "02",
    judul: "Pembangunan",
    desc: "Penyelenggaraan PAUD/TK/TPA milik desa, pengelolaan perpustakaan dan taman baca, penyelenggaraan Pos Kesehatan Desa dan Posyandu, pemeliharaan serta pembangunan jalan desa, gorong-gorong, dan selokan.",
  },
  {
    no: "03",
    judul: "Kemasyarakatan",
    desc: "Penyelenggaraan Pos Keamanan Desa, penyelenggaraan keagamaan, pemeliharaan sarana dan prasarana kepemudaan serta olahraga milik desa, dan pembinaan PKK.",
  },
  {
    no: "04",
    judul: "Pemberdayaan Masyarakat",
    desc: "Peningkatan kapasitas kepala desa, peningkatan kapasitas perangkat desa, dan peningkatan kapasitas BPD.",
  },
  {
    no: "05",
    judul: "Penanggulangan Bencana, Darurat dan Mendesak",
    desc: "Kegiatan penanggulangan bencana dan penanganan keadaan darurat di wilayah Desa Bajawali.",
  },
];

export default function VisiMisiPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-400">Profil Desa</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Moto & Program Desa
          </h1>
          <div className="w-24 h-1 bg-green-700 mx-auto mb-12"></div>
          
          <div className="bg-paper-100 p-8 md:p-16 border border-paper-200 rounded-lg">
            <h2 className="text-sm font-bold uppercase tracking-widest text-green-700 mb-6">Moto Desa Bajawali</h2>
            <blockquote className="font-editorial text-3xl md:text-5xl text-ink-950 leading-relaxed font-semibold">
              &quot;{desaInfo.moto}&quot;
            </blockquote>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-widest text-green-700 mb-3 text-center">Bidang Kerja Pemerintah Desa</h2>
          <p className="text-ink-600 text-center mb-8">
            Lima bidang kegiatan yang menjadi fokus penyelenggaraan pemerintahan Desa Bajawali.
          </p>
          
          <div className="flex flex-col gap-6">
            {bidangKerja.map((bidang) => (
              <div key={bidang.no} className="flex gap-6 bg-paper-50 border border-paper-200 p-6 md:p-8 rounded-md">
                <div className="font-editorial text-4xl text-ink-400">{bidang.no}</div>
                <div>
                  <h3 className="font-editorial text-xl font-semibold text-ink-950 mb-2">{bidang.judul}</h3>
                  <p className="text-ink-800">{bidang.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
