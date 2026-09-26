import Image from 'next/image'
import { ExternalLink, Globe2, Images, MapPin, Phone } from 'lucide-react'
import TabsNav, { resolveTabId, type AdminTab } from '@/components/admin/TabsNav'
import ContactForm from '@/components/admin/forms/ContactForm'
import ProfileForm from '@/components/admin/forms/ProfileForm'
import { getContentOverview } from '@/lib/queries/dashboard'

export const metadata = {
  title: 'Kelola Website — CMS Desa Bajawali',
}

export default async function AdminWebsitePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [overview, params] = await Promise.all([getContentOverview(), searchParams])

  const tabs: AdminTab[] = [
    { id: 'profil', label: 'Identitas Desa', icon: <Globe2 size={15} /> },
    { id: 'kontak', label: 'Kontak', icon: <MapPin size={15} /> },
    { id: 'hero', label: 'Hero Banner', icon: <Images size={15} />, badge: overview.heroSlides.length },
  ]

  const activeTab = resolveTabId(tabs, params.tab)
  const profile = overview.profile
  const contact = overview.contact

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-2xl font-bold text-ink-950"
          style={{ fontFamily: 'var(--font-editorial), serif' }}
        >
          Kelola Website
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Identitas desa, informasi kontak, dan hero banner yang tampil di website publik.
        </p>
      </div>

      <TabsNav basePath="/admin/website" tabs={tabs} activeId={activeTab} />

      {activeTab === 'profil' ? <ProfileForm initialData={profile} /> : null}

      {activeTab === 'kontak' ? <ContactForm initialData={contact} /> : null}

      {activeTab === 'hero' ? (
        <div className="space-y-6">
          <section className="rounded-lg border border-paper-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-ink-950">Hero Banner</h3>
                <p className="mt-1 text-xs text-ink-400">
                  {overview.heroSlides.length} slide aktif tampil di beranda
                </p>
              </div>
              <span className="rounded bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                Segera
              </span>
            </div>

            {overview.heroSlides.length === 0 ? (
              <p className="rounded-md border border-dashed border-paper-200 py-8 text-center text-sm text-ink-400">
                Belum ada hero banner aktif.
              </p>
            ) : (
              <ul className="space-y-3">
                {overview.heroSlides.map((slide, index) => (
                  <li
                    key={slide.id}
                    className="flex items-center gap-3 border-b border-paper-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded bg-paper-200">
                      {slide.image_url ? (
                        <Image src={slide.image_url} alt="" fill sizes="80px" className="object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-green-700">Slide {index + 1}</div>
                      <div className="truncate text-sm text-ink-800">{slide.title}</div>
                      <div className="truncate text-xs text-ink-400">{slide.subtitle}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="rounded-md border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            Pengelolaan hero (tambah, ubah, hapus, upload gambar) masuk tahap Sprint 4. Untuk sekarang
            slide masih diisi dari tabel <code>hero_slides</code> di Supabase.
          </div>
        </div>
      ) : null}

      {activeTab === 'kontak' && contact ? (
        <section className="rounded-lg border border-paper-200 bg-white p-6">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink-400">
            Pratinjau publik
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-green-700" />
              <span className="leading-relaxed text-ink-700">{contact.address}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2 text-ink-600">
                <Phone size={16} className="text-green-700" />
                {contact.whatsapp}
              </span>
              <span className="text-ink-600">{contact.service_hours}</span>
              {contact.google_maps_url ? (
                <a
                  href={contact.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-green-700 hover:text-green-800"
                >
                  Buka Google Maps <ExternalLink size={14} />
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
