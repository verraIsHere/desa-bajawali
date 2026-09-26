import Link from "next/link";
import { NavigationChevron } from "@/components/ui/NavigationChevron";
import { getPublicVillageProfile } from "@/lib/queries/village";

export const metadata = {
  title: "Profil Desa Bajawali",
};

export default async function ProfilIndexPage() {
  const profile = await getPublicVillageProfile();
  const menus = [
    { name: "Sejarah Desa", path: "/profil/sejarah", desc: "Menelusuri rekam jejak dan asal usul terbentuknya Desa Bajawali." },
    { name: "Moto & Program", path: "/profil/visi-misi", desc: "Moto desa dan lima bidang kerja pemerintahan Desa Bajawali." },
    { name: "Kondisi Geografis", path: "/profil/geografis", desc: "Informasi iklim, topografi, dan letak wilayah Desa Bajawali." },
    { name: "Demografi", path: "/profil/demografi", desc: "Statistik kependudukan, kelompok umur, dan sebaran wilayah." },
    { name: "Struktur Pemerintahan", path: "/profil/struktur-pemerintahan", desc: "Bagan organisasi dan aparatur Pemerintah Desa Bajawali." }
  ];

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        <div className="max-w-4xl mx-auto mb-16">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-400">Profil Desa</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Mengenal Lebih Dekat<br/>Desa Bajawali
          </h1>
          <p className="text-ink-800 text-xl leading-relaxed">
            {profile.description ||
              'Eksplorasi ragam informasi dasar, identitas, dan susunan pemerintahan yang menjadi fondasi berdirinya Desa Bajawali.'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {menus.map((menu, index) => (
            <Link 
              key={index} 
              href={menu.path}
              className="group block bg-paper-50 border border-paper-200 p-8 rounded-lg hover:border-green-700 hover:bg-green-700 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="font-editorial text-3xl text-ink-950 group-hover:text-white mb-3 transition-colors">
                {menu.name}
              </h2>
              <p className="text-ink-600 group-hover:text-green-50 mb-8 transition-colors text-lg">
                {menu.desc}
              </p>
              <div className="flex justify-end">
                <div className="w-10 h-10 rounded-full bg-paper-200 group-hover:bg-white flex items-center justify-center transition-colors">
                  <NavigationChevron
                    direction="next"
                    size={20}
                    className="text-ink-950 group-hover:text-green-800"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
