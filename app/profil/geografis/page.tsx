import {
  getPublicVillageGeography,
  getPublicVillageProfile,
  getPublicVillageStatistics,
} from '@/lib/queries/village';

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15953.872540417176!2d119.3557826934073!3d-1.4906304759257518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d8cf9abf9303445%3A0xcc92ae06702c7a48!2sBajawali%2C%20Kec.%20Lariang%2C%20Kab.%20Pasangkayu%2C%20Sulawesi%20Barat!5e0!3m2!1sid!2sid!4v1790131615917!5m2!1sid!2sid";

export const metadata = {
  title: "Kondisi Geografis Desa Bajawali",
};

export default async function GeografisPage() {
  const [profile, geography, statistics] = await Promise.all([
    getPublicVillageProfile(),
    getPublicVillageGeography(),
    getPublicVillageStatistics(),
  ])
  const boundaries = [
    { arah: 'Utara', batas: geography.north_boundary },
    { arah: 'Timur', batas: geography.east_boundary },
    { arah: 'Selatan', batas: geography.south_boundary },
    { arah: 'Barat', batas: geography.west_boundary },
  ]
  const area = geography.area_ha.toLocaleString('id-ID', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        <div className="max-w-4xl mx-auto mb-16">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-400">Profil Desa</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Kondisi Geografis
          </h1>
          
          <div className="prose prose-xl prose-p:text-ink-800 prose-headings:font-editorial prose-headings:text-ink-950 max-w-none">
            <p className="text-xl font-medium text-ink-950 leading-relaxed mb-8">
              Secara administratif, {profile.name} berada di wilayah Kecamatan {profile.district}, Kabupaten {profile.regency}, Provinsi {profile.province}.
            </p>
            
            <p>
              Desa Bajawali memiliki luas wilayah sebesar <strong>{area} Ha</strong> yang terbagi menjadi {statistics.dusun} dusun dan {statistics.rt} RT, dengan seluruh wilayahnya berada pada ketinggian {geography.elevation} meter di atas permukaan laut.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 not-prose">
              <div className="border border-paper-200 p-6 rounded-md">
                <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Iklim</div>
                <div className="font-editorial text-2xl text-ink-950 mb-2">{geography.temperature}</div>
                <p className="text-sm text-ink-600">Suhu rata-rata dengan curah hujan {geography.rainfall}.</p>
              </div>
              <div className="border border-paper-200 p-6 rounded-md">
                <div className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Topografi</div>
                <div className="font-editorial text-2xl text-ink-950 mb-2">{geography.elevation}</div>
                <p className="text-sm text-ink-600">Ketinggian wilayah dari permukaan laut.</p>
              </div>
            </div>

            <h2>Batas Wilayah</h2>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {boundaries.map((batas) => (
                <div key={batas.arah} className="border border-paper-200 bg-paper-50 p-5 rounded-md">
                  <div className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1">
                    {batas.arah}
                  </div>
                  <div className="font-editorial text-lg text-ink-950">{batas.batas}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peta Mini */}
        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="font-editorial text-2xl text-ink-950 mb-6">Peta Lokasi</h3>
          <div className="h-[400px] w-full bg-paper-200 border border-paper-200 rounded-lg overflow-hidden relative">
            <iframe
              src={MAP_EMBED_URL}
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Peta Lokasi Desa Bajawali"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute top-4 right-4 z-[400] bg-white/90 p-3 text-xs shadow-sm border border-paper-200 rounded-md">
              <p className="font-semibold text-ink-950">Koordinat Referensi</p>
              <p className="text-ink-600">
                {geography.latitude ?? '-1.4904673'}, {geography.longitude ?? '119.3656846'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
