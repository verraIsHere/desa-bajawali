import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { getPublicContactInformation } from '@/lib/queries/village';

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15953.872540417176!2d119.3557826934073!3d-1.4906304759257518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d8cf9abf9303445%3A0xcc92ae06702c7a48!2sBajawali%2C%20Kec.%20Lariang%2C%20Kab.%20Pasangkayu%2C%20Sulawesi%20Barat!5e0!3m2!1sid!2sid!4v1790131615917!5m2!1sid!2sid";

export const metadata = {
  title: "Kontak & Lokasi Desa Bajawali",
};

export default async function KontakPage() {
  const contact = await getPublicContactInformation()

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-5 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-ink-400">Hubungi Kami</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-ink-950 font-semibold leading-tight mb-8">
            Kontak & Lokasi
          </h1>
          <p className="text-ink-800 text-lg leading-relaxed">
            Pusat pelayanan administrasi dan informasi Desa Bajawali. Silakan hubungi kami atau kunjungi kantor desa pada jam kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-paper-50 border border-paper-200 p-8 rounded-md">
              <h2 className="font-editorial text-2xl text-ink-950 mb-6">Kantor Desa Bajawali</h2>
              
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <MapPin className="text-green-700 mt-1 shrink-0" size={20} />
                  <div>
                    <strong className="block text-ink-950 font-medium mb-1">Alamat</strong>
                    <span className="text-ink-800 text-sm leading-relaxed">
                      {contact.address}
                    </span>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <Mail className="text-green-700 mt-1 shrink-0" size={20} />
                  <div>
                    <strong className="block text-ink-950 font-medium mb-1">Email</strong>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-green-700 hover:text-green-800 transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </li>

                <li className="flex gap-4 items-start">
                  <Phone className="text-green-700 mt-1 shrink-0" size={20} />
                  <div>
                    <strong className="block text-ink-950 font-medium mb-1">Telepon/WhatsApp</strong>
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-700 hover:text-green-800 transition-colors"
                    >
                      {contact.whatsapp}
                    </a>
                  </div>
                </li>
                
                <li className="flex gap-4 items-start">
                  <Clock className="text-green-700 mt-1 shrink-0" size={20} />
                  <div>
                    <strong className="block text-ink-950 font-medium mb-1">Jam Pelayanan</strong>
                    <span className="text-ink-800 text-sm block mb-1">{contact.service_hours}</span>
                    <span className="text-ink-400 text-xs block">Libur pada hari Sabtu, Minggu, dan hari libur nasional</span>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 pt-8 border-t border-paper-200 flex flex-col gap-3">
                {contact.google_maps_url && (
                  <a href={contact.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-green-700 text-white hover:bg-green-800 px-6 py-3 rounded-md font-medium transition-colors w-full">
                  Buka di Google Maps
                  </a>
                )}
                <button className="inline-flex items-center justify-center bg-transparent border border-paper-200 text-ink-800 hover:bg-paper-100 px-6 py-3 rounded-md font-medium transition-colors w-full">
                  Salin Alamat
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7" id="peta">
            <div className="h-[500px] lg:h-full min-h-[500px] w-full bg-paper-200 border border-paper-200 rounded-md overflow-hidden relative">
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
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
