import Image from 'next/image'
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { getContentOverview } from '@/lib/queries/dashboard'

export const metadata = {
  title: 'Kelola Website — CMS Desa Bajawali',
}

const fallbackProfile = {
  name: 'Desa Bajawali',
  head_name: 'Ketut Langga, S.Ag',
  district: 'Lariang',
  regency: 'Pasangkayu',
  province: 'Sulawesi Barat',
  motto: 'BAJAWALIKU JAYA',
  description:
    'Desa Bajawali berada di Kecamatan Lariang, Kabupaten Pasangkayu, Provinsi Sulawesi Barat.',
  history: 'Data sejarah desa akan ditampilkan di sini.',
  data_year: 2026,
}

const fallbackContact = {
  address: 'Kantor Desa Bajawali, Kecamatan Lariang, Kabupaten Pasangkayu, Provinsi Sulawesi Barat',
  email: 'desabajawali2@gmail.com',
  whatsapp: '+62 857-5606-3460',
  service_hours: 'Senin–Jumat: 08.00–15.00 WITA',
  google_maps_url: 'https://www.google.com/maps/place/Bajawali,+Kec.+Lariang,+Kab.+Pasangkayu,+Sulawesi+Barat',
}

const fallbackSlides = [
  {
    id: 'fallback-1',
    title: 'Selamat Datang di Website Desa Bajawali',
    subtitle: 'DESA BAJAWALI · KECAMATAN LARIANG',
    description: 'Ruang informasi digital untuk mengenal profil desa, kehidupan masyarakat, potensi wilayah, dan perkembangan Desa Bajawali.',
    image_url: '/gambar/background/background_1.webp',
  },
  {
    id: 'fallback-2',
    title: 'Potensi Pertanian & Alam yang Melimpah',
    subtitle: 'KEKAYAAN ALAM DESA',
    description: 'Mendukung ekonomi warga melalui hasil bumi unggulan dan menjaga keseimbangan alam.',
    image_url: '/gambar/background/background_2baru.webp',
  },
  {
    id: 'fallback-3',
    title: 'Gotong Royong Membangun Desa',
    subtitle: 'KEGIATAN MASYARAKAT',
    description: 'Kolaborasi antara pemerintah desa dan warga untuk mewujudkan lingkungan yang aman dan sejahtera.',
    image_url: '/gambar/background/background_3.webp',
  },
]

export default async function AdminWebsitePage() {
  const overview = await getContentOverview()
  const profile = overview.profile ?? fallbackProfile
  const contact = overview.contact ?? fallbackContact
  const slides = overview.heroSlides.length > 0 ? overview.heroSlides : fallbackSlides

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl font-bold text-ink-950"
          style={{ fontFamily: 'var(--font-editorial), serif' }}
        >
          KelOLA Website
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Ringkasan informasi kontak dan hero banner yang tampil di website publik.
        </p>
      </div>

      <section className="rounded-lg border border-paper-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-ink-400">
              Identitas Desa
            </div>
            <h3 className="mt-2 font-editorial text-2xl text-ink-950">{profile.name}</h3>
            <p className="mt-1 text-sm text-ink-500">
              {profile.motto} · Tahun data {profile.data_year}
            </p>
          </div>
          <div className="rounded-md bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
            {profile.head_name}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-paper-100 pt-5 sm:grid-cols-3">
          <ProfileField label="Wilayah" value={`${profile.district}, ${profile.regency}`} />
          <ProfileField label="Provinsi" value={profile.province} />
          <ProfileField label="Deskripsi" value={profile.description} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="rounded-lg border border-paper-200 bg-white p-6 xl:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-green-50 text-green-700">
              <MapPin size={18} />
            </span>
            <div>
              <h3 className="font-semibold text-ink-950">Informasi Kontak</h3>
              <p className="text-xs text-ink-400">Data publik Kantor Desa</p>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-green-700" />
              <span className="leading-relaxed text-ink-700">{contact.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-green-700" />
              <a href={`mailto:${contact.email}`} className="text-green-700 hover:text-green-800">
                {contact.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-green-700" />
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:text-green-800"
              >
                {contact.whatsapp}
              </a>
            </div>
            <p className="border-t border-paper-100 pt-4 text-ink-600">{contact.service_hours}</p>
            {contact.google_maps_url && (
              <a
                href={contact.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800"
              >
                Buka Google Maps <ExternalLink size={14} />
              </a>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-paper-200 bg-white p-6 xl:col-span-3">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-ink-950">Hero Banner</h3>
              <p className="mt-1 text-xs text-ink-400">{slides.length} slide tersedia</p>
            </div>
            <span className="rounded bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
              Publik
            </span>
          </div>
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div key={slide.id} className="flex items-center gap-3 border-b border-paper-100 pb-3 last:border-0 last:pb-0">
                <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded bg-paper-200">
                  {slide.image_url && (
                    <Image
                      src={slide.image_url}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-green-700">Slide {index + 1}</div>
                  <div className="truncate text-sm text-ink-800">{slide.title}</div>
                  <div className="truncate text-xs text-ink-400">{slide.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        Form edit profil, kontak, dan hero akan ditambahkan pada tahap CRUD CMS berikutnya. Halaman
        ini sudah membaca data dari Supabase dan menggunakan fallback lokal apabila tabel belum
        diisi.
      </div>
    </div>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-ink-400">{label}</div>
      <p className="mt-1 text-sm leading-relaxed text-ink-700">{value}</p>
    </div>
  )
}
