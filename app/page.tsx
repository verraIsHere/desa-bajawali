import Image from 'next/image'
import Link from 'next/link'
import {desaInfo, beritaDummy, galeriDummy} from '@/data/dummy'
import HeroCarousel from '@/components/layout/HeroCarousel'
import { getPublicHeroSlides } from '@/lib/queries/village'
import { getPublishedGallery } from '@/lib/queries/gallery'
import { getPublishedNews } from '@/lib/queries/news'
import HomeScrollEffects from '@/components/animations/HomeScrollEffects'
import StructureImageLightbox from '@/components/gallery/StructureImageLightbox'
import { NavigationChevron } from '@/components/ui/NavigationChevron'

type PerangkatDesa = {
  jabatan: string
  nama: string
  foto?: string
}

const kepalaDesa = {
  jabatan: 'Kepala Desa',
  nama: 'Ketut Langga, S.Ag',
  foto: '/gambar/struktur/kepala-desa-bajawali.webp',
}

const perangkatDesa: PerangkatDesa[] = [
  {jabatan: 'Sekretaris Desa', nama: 'Kadek Wijaya'},
  {
    jabatan: 'Kaur Umum dan Perencanaan',
    nama: 'I Gede Andi Suardika',
    foto: '/gambar/struktur/I GEDE ANDI SUARDIKA.webp',
  },
  {jabatan: 'Kaur Keuangan', nama: 'Andreas Stevanus H'},
  {
    jabatan: 'Kasi Pemerintah',
    nama: 'I Gede Agus Puja',
    foto: '/gambar/struktur/igede Agus puja.webp',
  },
  {
    jabatan: 'Kasi Kesra & Pelayanan',
    nama: 'Meilisa',
    foto: '/gambar/struktur/Meilisa.webp',
  },
  // {
  //   jabatan: 'Staf Kasi Kesra',
  //   nama: 'Ni Made Pipi Saphira',
  //   foto: '/gambar/struktur/NI MADE PIPI SAPHIRA.webp',
  // },
]

const profilDesa = [kepalaDesa, ...perangkatDesa]

const strukturImages = [
  {
    src: '/gambar/struktur/Struktur_Pemerintah_Desa_Bajawali (1).webp',
    alt: 'Bagan struktur organisasi Pemerintah Desa Bajawali',
    title: 'Struktur Pemerintah Desa',
  },
  {
    src: '/gambar/struktur/Struktur_BPD_Bajawali (1) (9).webp',
    alt: 'Bagan struktur organisasi Badan Permusyawaratan Desa Bajawali',
    title: 'Struktur BPD Bajawali',
  },
]

type IconImageProps = {
  src: string
  className?: string
  size?: number
}

function IconImage({ src, className = 'h-6 w-6 object-contain', size = 40 }: IconImageProps) {
  return <Image src={src} alt="" width={size} height={size} className={className} />
}

function SectionLabel({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-ink-400">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-paper-100">
        <IconImage src={icon} className="h-8 w-8 object-contain" />
      </span>
      <span>{label}</span>
    </div>
  )
}

const getInitials = (nama: string) =>
  nama
    .replace(/,.*$/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

export default async function Home() {
  const [publicSlides, publicNews, publicGallery] = await Promise.all([
    getPublicHeroSlides(),
    getPublishedNews(),
    getPublishedGallery(),
  ])
  const heroSlides = publicSlides
    .filter(
      (slide) =>
        slide.primary_action_label &&
        slide.primary_action_href &&
        slide.secondary_action_label &&
        slide.secondary_action_href,
    )
    .map((slide) => ({
      id: slide.id,
      image: slide.image_url || '/gambar/background/background_1.webp',
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      primaryAction: {
        label: slide.primary_action_label as string,
        href: slide.primary_action_href as string,
      },
      secondaryAction: {
        label: slide.secondary_action_label as string,
        href: slide.secondary_action_href as string,
      },
    }))
  const newsList = publicNews.length > 0
    ? publicNews.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        category: item.category,
        date: new Date(item.published_at || item.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        excerpt: item.excerpt,
        image: item.image_url || '/gambar/galeri/galeri_1.webp',
      }))
    : beritaDummy
  const galleryList = publicGallery.length > 0
    ? publicGallery.map((item) => ({
        id: item.id,
        url: item.image_url,
        caption: item.title,
        category: item.category,
      }))
    : galeriDummy
  const featureNews = newsList[0]
  const otherNews = newsList.slice(1, 4)
  const latestGallery = galleryList.slice(0, 5)

  return (
    <div className="flex flex-col">
      {/* Hero Carousel */}
      <HeroCarousel initialSlides={heroSlides.length > 0 ? heroSlides : undefined} />

      {/* Sambutan Kepala Desa */}
      <section className="py-12 md:py-16 border-b border-paper-200">
        <div className="container mx-auto max-w-5xl px-5 lg:px-8">
          <div className="grid md:grid-cols-[220px_1fr] overflow-hidden rounded-4xl border border-paper-200 bg-paper-50">
            <div className="relative aspect-[5/6] bg-paper-200 md:aspect-auto md:min-h-[260px]">
              <Image
                src={kepalaDesa.foto}
                alt={`Foto ${kepalaDesa.nama}, Kepala Desa Bajawali`}
                fill
                sizes="(max-width: 768px) 100vw, 220px"
                className="object-contain object-center md:object-cover md:object-top"
              />
              {/* <div className="absolute top-4 left-4 bg-paper-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink-800 rounded-sm">
                Sambutan
              </div> */}
            </div>

            <div className="flex flex-col justify-center p-5 sm:p-7 md:p-8">
              <div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                {/* <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-green-50">
                  <IconImage src="/gambar/icon/kantor_desa.webp" />
                </span> */}
                <span className="h-px w-8 bg-green-700" />
                Sambutan Kepala Desa
              </div>
              <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-ink-950 leading-tight mb-3">
                Selamat datang di Desa Bajawali.
              </h2>
              <p className="text-base leading-relaxed text-ink-800 max-w-2xl">
                Semoga informasi dalam website ini dapat membantu masyarakat mengenal Desa Bajawali,
                memperoleh informasi tentang layanan, dan mengikuti pembangunan yang berjalan bersama.
              </p>
              <div className="mt-5 pt-4 border-t border-paper-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <div className="font-editorial text-lg text-ink-950">{kepalaDesa.nama}</div>
                  <div className="text-xs text-ink-600 mt-1">{kepalaDesa.jabatan}</div>
                </div>
                <Link
                  href="/profil/struktur-pemerintahan"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
                >
                  Lihat profil <NavigationChevron direction="next" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sekilas Desa */}
      <section className="py-16 md:py-24 border-b border-paper-200">
        <div className="container mx-auto px-5 lg:px-8">
          <SectionLabel label="01 / TENTANG BAJAWALI" icon="/gambar/icon/batas_wilayah.webp" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-ink-950 mb-6 leading-tight">
                Mengenal Desa Bajawali lebih dekat.
              </h2>
              <div className="prose prose-xl prose-p:text-ink-800 prose-p:leading-relaxed max-w-none">
                <p>
                  Desa Bajawali berada di Kecamatan {desaInfo.kecamatan}, Kabupaten{' '}
                  {desaInfo.kabupaten}, Provinsi {desaInfo.provinsi}. Desa Bajawali memiliki luas
                  wilayah {desaInfo.luasWilayah} Ha dengan ketinggian {desaInfo.ketinggian} mdpl,
                  curah hujan {desaInfo.curahHujan}, dan suhu rata-rata {desaInfo.suhu}.
                </p>
                <p>
                  Desa Bajawali dihuni <strong>{desaInfo.penduduk} jiwa</strong> yang tergabung
                  dalam <strong>{desaInfo.kk} kepala keluarga</strong>, tersebar di{' '}
                  {desaInfo.dusun} dusun dan {desaInfo.rt} RT. Nama Bajawali berasal dari kata
                  Sanskerta <strong>JAVA</strong> dan <strong>BALI</strong> yang berarti
                  &quot;Kelahiran dan Tempat Berpijak&quot;, dengan moto desa{' '}
                  <strong>{desaInfo.moto}</strong>.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9 flex flex-col">
              <div className="flex items-start gap-4 border-t border-paper-200 py-5">
                <IconImage
                  src="/gambar/icon/dusun_wilayah.webp"
                  size={64}
                  className="w-22 h-22 md:h-18 md:w-18 shrink-0"
                />
                <div>
                  <div className="font-editorial text-2xl md:text-3xl text-ink-950">
                    {desaInfo.luasWilayah} Ha
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink-600">Luas wilayah</div>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-paper-200 py-5">
                <IconImage
                  src="/gambar/icon/lokasi.webp"
                  size={64}
                  className="w-22 h-22 md:h-18 md:w-18 shrink-0"
                />
                <div>
                  <div className="font-editorial text-2xl md:text-3xl text-ink-950">
                    {desaInfo.kecamatan}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink-600">Kecamatan</div>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-paper-200 py-5">
                <IconImage
                  src="/gambar/icon/kantor_desa.webp"
                  size={64}
                  className="w-22 h-22 md:h-18 md:w-18 shrink-0"
                />
                <div>
                  <div className="font-editorial text-2xl md:text-3xl text-ink-950">
                    {desaInfo.kabupaten}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-ink-600">Kabupaten</div>
                </div>
              </div>

              <div className="border-t border-paper-200 pt-4 text-xs text-ink-400">
                Profil Desa {desaInfo.tahunData}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik Singkat (Rail) */}
      <section className="bg-paper-100 border-b border-paper-200">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-paper-200">
            <div className="relative isolate overflow-hidden bg-paper-50/35 px-4 py-8 md:px-6 md:py-12 flex flex-col items-center text-center">
              <IconImage
                src="/gambar/icon/data_penduduk.webp"
                size={144}
                className="pointer-events-none absolute -right-6 -bottom-8 h-28 w-28 opacity-20 md:-right-7 md:-bottom-10 md:h-36 md:w-36"
              />
              <div className="relative z-10">
                <div className="text-sm font-semibold text-ink-600 mb-2">Penduduk</div>
                <div className="font-editorial text-4xl md:text-5xl font-semibold text-ink-950 mb-2">
                  {desaInfo.penduduk}
                </div>
              </div>
            </div>
            <div className="relative isolate overflow-hidden bg-paper-50/35 px-4 py-8 md:px-6 md:py-12 flex flex-col items-center text-center">
              <IconImage
                src="/gambar/icon/keluarga.webp"
                size={144}
                className="pointer-events-none absolute -right-8 -top-6 h-28 w-28 opacity-20 md:-right-10 md:-top-8 md:h-36 md:w-36"
              />
              <div className="relative z-10">
                <div className="text-sm font-semibold text-ink-600 mb-2">Kepala Keluarga</div>
                <div className="font-editorial text-4xl md:text-5xl font-semibold text-ink-950 mb-2">
                  {desaInfo.kk}
                </div>
              </div>
            </div>
            <div className="relative isolate overflow-hidden bg-paper-50/35 px-4 py-8 md:px-6 md:py-12 flex flex-col items-center text-center">
              <IconImage
                src="/gambar/icon/dusun_wilayah.webp"
                size={144}
                className="pointer-events-none absolute -bottom-8 -left-6 h-28 w-28 opacity-20 md:-bottom-10 md:-left-8 md:h-36 md:w-36"
              />
              <div className="relative z-10">
                <div className="text-sm font-semibold text-ink-600 mb-2">Dusun</div>
                <div className="font-editorial text-4xl md:text-5xl font-semibold text-ink-950 mb-2">
                  {desaInfo.dusun}
                </div>
              </div>
            </div>
            <div className="relative isolate overflow-hidden bg-paper-50/35 border-l border-paper-200 px-4 py-8 md:border-l-0 md:px-6 md:py-12 flex flex-col items-center text-center">
              <IconImage
                src="/gambar/icon/dokumen.webp"
                size={144}
                className="pointer-events-none absolute -right-6 -bottom-8 h-28 w-28 opacity-20 md:-right-7 md:-bottom-10 md:h-36 md:w-36"
              />
              <div className="relative z-10">
                <div className="text-sm font-semibold text-ink-600 mb-2">RT</div>
                <div className="font-editorial text-4xl md:text-5xl font-semibold text-ink-950 mb-2">
                  {desaInfo.rt}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profil Singkat (Grid Modul Asimetris) */}
      <section className="py-16 md:py-24 border-b border-paper-200">
        <div className="container mx-auto px-5 lg:px-8">
          <SectionLabel label="02 / PROFIL SINGKAT" icon="/gambar/icon/dokumen.webp" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8">
            {/* Sejarah */}
            <Link
              href="/profil/sejarah"
              className="md:col-span-7 group block bg-paper-50 border border-paper-200 p-6 md:p-8 hover:border-green-300 transition-colors"
            >
              {/* <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-green-50">
                <IconImage src="/gambar/icon/dokumen.webp" className="h-7 w-7" />
              </div> */}
              <h3 className="font-editorial text-2xl text-ink-950 mb-3 group-hover:text-green-800 transition-colors">
                Sejarah Desa
              </h3>
              <p className="text-ink-600 mb-6">
                Mempelajari asal-usul, perkembangan wilayah, dan dinamika yang membentuk Desa
                Bajawali hingga saat ini.
              </p>
              <div className="text-sm font-semibold text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                Baca selengkapnya <NavigationChevron direction="next" />
              </div>
            </Link>

            {/* Geografis */}
            <Link
              href="/profil/geografis"
              className="md:col-span-5 group block bg-paper-50 border border-paper-200 p-6 md:p-8 hover:border-green-300 transition-colors"
            >
              {/* <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-green-50">
                <IconImage src="/gambar/icon/batas_wilayah.webp" className="h-7 w-7" />
              </div> */}
              <h3 className="font-editorial text-2xl text-ink-950 mb-3 group-hover:text-green-800 transition-colors">
                Geografis
              </h3>
              <p className="text-ink-600 mb-6">
                Kondisi topografi, luasan wilayah, dan batas administrasi.
              </p>
              <div className="text-sm font-semibold text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                Lihat peta & data <NavigationChevron direction="next" />
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Demografi */}
            <Link
              href="/profil/demografi"
              className="md:col-span-5 group block bg-paper-50 border border-paper-200 p-6 md:p-8 hover:border-green-300 transition-colors"
            >
              {/* <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-green-50">
                <IconImage src="/gambar/icon/data_penduduk.webp" className="h-7 w-7" />
              </div> */}
              <h3 className="font-editorial text-2xl text-ink-950 mb-3 group-hover:text-green-800 transition-colors">
                Demografi
              </h3>
              <div className="font-editorial text-3xl text-ink-950 mb-2">
                {desaInfo.penduduk} <span className="text-sm font-sans text-ink-400">Jiwa</span>
              </div>
              <p className="text-ink-600 mb-6">
                Data kependudukan berdasarkan jenis kelamin dan usia.
              </p>
              <div className="text-sm font-semibold text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                Lihat data <NavigationChevron direction="next" />
              </div>
            </Link>

            {/* Pemerintahan */}
            <Link
              href="/profil/struktur-pemerintahan"
              className="md:col-span-7 group block bg-paper-50 border border-paper-200 p-6 md:p-8 hover:border-green-300 transition-colors"
            >
              {/* <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-green-50">
                <IconImage src="/gambar/icon/kantor_desa.webp" className="h-7 w-7" />
              </div> */}
              <h3 className="font-editorial text-2xl text-ink-950 mb-3 group-hover:text-green-800 transition-colors">
                Pemerintahan
              </h3>
              <div className="font-editorial text-3xl text-ink-950 mb-2">
                Ketut Langga, S.Ag <span className="text-sm font-sans text-ink-400">Kepala Desa</span>
              </div>
              <p className="text-ink-600 mb-6">
                Struktur organisasi pemerintahan desa, tokoh masyarakat, dan sistem pelayanan
                administrasi publik.
              </p>
              <div className="text-sm font-semibold text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                Lihat struktur <NavigationChevron direction="next" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Struktur Pemerintahan dan BPD */}
      <section className="py-16 md:py-24 border-b border-paper-200 bg-paper-50">
        <div className="container mx-auto px-5 lg:px-8">
          <SectionLabel label="03 / STRUKTUR PEMERINTAHAN" icon="/gambar/icon/kantor_desa.webp" />
          <div className="max-w-2xl mb-10 md:mb-12">
            <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-ink-950 mb-4 leading-tight">
              Struktur pemerintahan dan BPD.
            </h2>
            <p className="text-ink-800">
              Susunan perangkat Pemerintah Desa Bajawali dan Badan Permusyawaratan Desa (BPD)
              yang menjadi mitra dalam tata kelola dan pelayanan Desa Bajawali.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6 md:gap-8">
            <StructureImageLightbox images={strukturImages} initialIndex={0}>
              <figure className="bg-white border border-paper-200 rounded-md overflow-hidden">
                <div className="p-3 md:p-5 border-b border-paper-200">
                  <Image
                    src={strukturImages[0].src}
                    alt={strukturImages[0].alt}
                    width={920}
                    height={657}
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="p-4 md:p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-green-700 mb-2">
                    01 / Pemerintah Desa
                  </div>
                  <h3 className="font-editorial text-xl md:text-2xl text-ink-950">
                    {strukturImages[0].title}
                  </h3>
                </figcaption>
              </figure>
            </StructureImageLightbox>

            <StructureImageLightbox images={strukturImages} initialIndex={1}>
              <figure className="bg-white border border-paper-200 rounded-md overflow-hidden">
                <div className="p-3 md:p-5 border-b border-paper-200">
                  <Image
                    src={strukturImages[1].src}
                    alt={strukturImages[1].alt}
                    width={572}
                    height={441}
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="p-4 md:p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-green-700 mb-2">
                    02 / Badan Permusyawaratan Desa
                  </div>
                  <h3 className="font-editorial text-xl md:text-2xl text-ink-950">
                    {strukturImages[1].title}
                  </h3>
                </figcaption>
              </figure>
            </StructureImageLightbox>
          </div>

          <div className="mt-8">
            <Link
              href="/profil/struktur-pemerintahan"
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              Lihat struktur lengkap <NavigationChevron direction="next" />
            </Link>
          </div>
        </div>
      </section>

      {/* Kepala Desa dan Perangkat Desa */}
      <section className="py-16 md:py-24 border-b border-paper-200">
        <div className="container mx-auto px-5 lg:px-8">
          <SectionLabel label="04 / PERANGKAT DESA" icon="/gambar/icon/kantor_desa.webp" />

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
            <div className="max-w-2xl">
              <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-ink-950 mb-4 leading-tight">
                Kepala Desa dan Perangkat Desa.
              </h2>
              <p className="text-ink-800">
                Kenali kepala desa dan perangkat atau pelaksana yang menjalankan pemerintahan serta
                pelayanan sehari-hari di Desa Bajawali.
              </p>
            </div>
            <Link
              href="/profil/struktur-pemerintahan"
              className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              Lihat struktur lengkap <NavigationChevron direction="next" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-4 md:gap-6">
            {profilDesa.map((perangkat) => (
              <Link
                key={`${perangkat.jabatan}-${perangkat.nama}`}
                href="/profil/struktur-pemerintahan"
                className="group flex min-h-[168px] overflow-hidden bg-paper-50 border border-paper-200 hover:border-green-300 transition-colors"
              >
                <div className="relative w-28 h-full min-h-[168px] shrink-0 bg-paper-200 sm:w-32">
                  {perangkat.foto ? (
                    <Image
                      src={perangkat.foto}
                      alt={`Foto ${perangkat.nama}`}
                      fill
                      sizes="(max-width: 640px) 112px, 128px"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center font-editorial text-2xl text-ink-600"
                    >
                      {getInitials(perangkat.nama)}
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-4 md:p-5">
                  <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-green-700 mb-2">
                    {perangkat.jabatan}
                  </div>
                  <h3 className="font-editorial text-lg md:text-xl font-semibold text-ink-950 leading-snug">
                    {perangkat.nama}
                  </h3>
                  <div className="mt-auto pt-4 flex items-center gap-1 text-sm font-semibold text-green-700">
                    <span className="border-b border-green-700 group-hover:border-transparent transition-colors">
                      Lihat profil
                    </span>{' '}
                    <span className="transition-transform group-hover:translate-x-1">
                      <NavigationChevron direction="next" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Potensi Desa */}
      <section className="py-16 md:py-24 border-b border-paper-200 bg-paper-50">
        <div className="container mx-auto px-5 lg:px-8">
          <SectionLabel label="05 / POTENSI DESA" icon="/gambar/icon/potensi_desa.webp" />
          <div className="max-w-2xl mb-12">
            <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-ink-950 mb-4 leading-tight">
              Yang tumbuh dari tanah dan kerja masyarakat.
            </h2>
            <p className="text-ink-800">
              Potensi Desa Bajawali bertumpu pada hasil pertanian kelapa sawit sebagai komoditas
              andalan, ditemani berkembangnya usaha mikro, kecil, dan menengah (UMKM), 10 kelompok
              tani, serta partisipasi masyarakat dalam gotong royong dan kegiatan ekonomi desa.
            </p>
          </div>

          {/* Grid Komposisi */}
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[600px]">
            {/* Pertanian (Large) */}
            <Link
              href="/potensi/pertanian"
              className="group md:col-span-8 md:row-span-2 relative block overflow-hidden border border-paper-200 h-[300px] md:h-full"
            >
              <Image
                src="https://images.pexels.com/photos/1576398/pexels-photo-1576398.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Potensi Pertanian"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                  01
                </span>
                <h3 className="font-editorial text-2xl md:text-3xl text-white mb-2">Pertanian</h3>
                <p className="text-white/90 mb-4 max-w-md hidden md:block">
                  Kelapa sawit sebagai komoditas andalan warga, ditopang 10 kelompok tani dan 1
                  Gapoktan.
                </p>
                <div className="text-sm font-semibold text-white flex items-center gap-1">
                  <span className="border-b border-white group-hover:border-transparent transition-colors">
                    Lihat potensi
                  </span>{' '}
                  <span className="transition-transform group-hover:translate-x-1"><NavigationChevron direction="next" /></span>
                </div>
              </div>
            </Link>

            {/* UMKM */}
            <Link
              href="/potensi/umkm"
              className="group md:col-span-4 relative block overflow-hidden border border-paper-200 h-[250px] md:h-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop"
                alt="UMKM"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                  02
                </span>
                <h3 className="font-editorial text-xl md:text-2xl text-white mb-2">UMKM</h3>
                <div className="text-sm font-semibold text-white flex items-center gap-1">
                  <span className="border-b border-white group-hover:border-transparent transition-colors">
                    Lihat potensi
                  </span>{' '}
                  <span className="transition-transform group-hover:translate-x-1"><NavigationChevron direction="next" /></span>
                </div>
              </div>
            </Link>

            {/* Perikanan & Pariwisata Split */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4 md:gap-6 h-[200px] md:h-auto">
              {/* Pariwisata */}
              <Link
                href="/potensi/pariwisata"
                className="group relative block overflow-hidden border border-paper-200"
              >
                <div className="absolute inset-0 bg-paper-100 group-hover:bg-paper-200 transition-colors"></div>
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                  <span className="text-ink-400 text-xs font-bold uppercase tracking-widest mb-1">
                    03
                  </span>
                  <h3 className="font-editorial text-lg text-ink-950 mb-1">Pariwisata</h3>
                  <div className="text-xs font-semibold text-green-700"><NavigationChevron direction="next" /></div>
                </div>
              </Link>

              {/* SDA */}
              <Link
                href="/potensi/sumber-daya-alam"
                className="group relative block overflow-hidden border border-paper-200"
              >
                <div className="absolute inset-0 bg-paper-100 group-hover:bg-paper-200 transition-colors"></div>
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                  <span className="text-ink-400 text-xs font-bold uppercase tracking-widest mb-1">
                    04
                  </span>
                  <h3 className="font-editorial text-lg text-ink-950 mb-1">SDA</h3>
                  <div className="text-xs font-semibold text-green-700"><NavigationChevron direction="next" /></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Berita Terkini */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div>
              <SectionLabel label="06 / KABAR DESA" icon="/gambar/icon/jadwal_kegiatan.webp" />
              <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-ink-950 leading-tight">
                Berita & Kegiatan
              </h2>
            </div>
            <Link
              href="/berita"
              className="hidden md:flex text-sm font-semibold text-green-700 items-center gap-1 hover:text-green-800 transition-colors"
            >
              Lihat semua berita <NavigationChevron direction="next" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Feature Article */}
            <div className="lg:col-span-7">
              <Link href={`/berita/${featureNews.slug}`} className="group block">
                <div className="relative aspect-[16/10] mb-6 overflow-hidden border border-paper-200 rounded-md">
                  <Image
                    src={featureNews.image}
                    alt={featureNews.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                  />
                  <div className="absolute top-4 left-4 bg-paper-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink-800 rounded-sm">
                    {featureNews.category}
                  </div>
                </div>
                <div className="text-sm text-ink-600 mb-2">{featureNews.date}</div>
                <h3 className="font-editorial text-2xl md:text-3xl text-ink-950 font-semibold mb-3 group-hover:text-green-800 transition-colors">
                  {featureNews.title}
                </h3>
                <p className="text-ink-800 line-clamp-2 leading-relaxed">{featureNews.excerpt}</p>
              </Link>
            </div>

            {/* Secondary Articles */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
              {otherNews.map((news) => (
                <Link
                  href={`/berita/${news.slug}`}
                  key={news.id}
                  className="group flex gap-4 md:gap-6 items-start border-t border-paper-200 pt-6 lg:border-t-0 lg:pt-0"
                >
                  <div className="w-1/3 aspect-[4/3] relative rounded-md overflow-hidden border border-paper-200 shrink-0">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded-sm">
                        {news.category}
                      </span>
                    </div>
                    <h4 className="font-editorial text-lg text-ink-950 font-semibold leading-snug group-hover:text-green-800 transition-colors mb-1 line-clamp-2">
                      {news.title}
                    </h4>
                    <div className="text-xs text-ink-400">{news.date}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 md:hidden">
            <Link
              href="/berita"
              className="block text-center border border-paper-200 py-3 rounded-md text-sm font-semibold text-ink-800 hover:bg-paper-100 transition-colors"
            >
              Lihat semua berita
            </Link>
          </div>
        </div>
      </section>

      {/* Galeri Dokumentasi */}
      <section className="py-16 md:py-24 border-t border-paper-200 bg-paper-100">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
            <div>
              <SectionLabel label="07 / GALERI DOKUMENTASI" icon="/gambar/icon/galeri_dokumentasi.webp" />
              <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-ink-950 leading-tight">
                Cerita dalam gambar.
              </h2>
              <p className="text-ink-800 mt-4 max-w-2xl">
                Rekam jejak terbaru kegiatan, pembangunan, dan kehidupan masyarakat Desa Bajawali.
              </p>
            </div>
            <Link
              href="/galeri"
              className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              Lihat semua galeri <NavigationChevron direction="next" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {latestGallery.map((photo, index) => (
              <Link
                key={photo.id}
                href="/galeri"
                className={`group relative overflow-hidden border border-paper-200 bg-paper-50 hover:border-green-300 transition-colors ${
                  index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
              >
                <div
                  className={`relative ${
                    index === 0
                      ? 'aspect-[4/3] md:aspect-auto md:min-h-[420px]'
                      : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption}
                    fill
                    sizes={
                      index === 0
                        ? '(max-width: 639px) 100vw, (max-width: 1023px) 100vw, 50vw'
                        : '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw'
                    }
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute top-3 left-3 right-3">
                    <span className="inline-block max-w-full whitespace-normal break-words bg-paper-50/95 px-2.5 py-1 text-[10px] font-bold uppercase leading-tight tracking-widest text-ink-800 rounded-sm">
                      {photo.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white md:p-5">
                    {/* <h3
                      className={`font-editorial font-semibold leading-snug line-clamp-2 ${
                        index === 0 ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
                      }`}
                    >
                      {photo.caption}
                    </h3> */}
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold md:text-sm">
                      <span className="border-b border-white/80 group-hover:border-transparent transition-colors">
                        Lihat galeri
                      </span>
                      <span className="transition-transform group-hover:translate-x-1">
                        <NavigationChevron direction="next" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Data dan Kontak */}
      <section className="py-16 md:py-24 border-t border-paper-200">
        <div className="container mx-auto px-5 lg:px-8">
          <SectionLabel label="08 / INFORMASI DESA" icon="/gambar/icon/statistik.webp" />
          <div className="max-w-2xl mb-10 md:mb-12">
            <h2 className="font-editorial text-3xl md:text-4xl font-semibold text-ink-950 leading-tight">
              Informasi yang mudah dijangkau.
            </h2>
            <p className="text-ink-800 mt-4">
              Akses data statistik Desa Bajawali atau informasi kontak dan lokasi kantor desa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            <Link
              href="/data-desa"
              className="group lg:col-span-7 flex min-h-[340px] flex-col justify-between bg-green-950 p-6 text-white md:p-8 transition-colors hover:bg-green-900"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-green-300">
                    <IconImage src="/gambar/icon/statistik.webp" className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                    01
                  </span>
                </div>
                <div className="mt-8">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-green-300 mb-2">
                    Data & Statistik
                  </div>
                  <h3 className="!text-white font-editorial text-2xl md:text-3xl font-semibold leading-tight mb-3">
                    Kenali Desa Bajawali melalui data.
                  </h3>
                  <p className="text-white/75 leading-relaxed max-w-xl">
                    Lihat data kependudukan, luas wilayah, dan indikator Desa Bajawali dalam
                    bentuk yang mudah dipahami.
                  </p>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-5">
                  <div>
                    <div className="font-editorial text-2xl !text-white">{desaInfo.penduduk}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/55 mt-1">
                      Jiwa
                    </div>
                  </div>
                  <div>
                    <div className="font-editorial text-2xl !text-white">{desaInfo.dusun}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/55 mt-1">
                      Dusun
                    </div>
                  </div>
                  <div>
                    <div className="font-editorial text-2xl !text-white">{desaInfo.rt}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/55 mt-1">
                      RT
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-green-300">
                  <span className="border-b border-green-300 group-hover:border-transparent transition-colors">
                    Buka data desa
                  </span>{' '}
                  <span className="transition-transform group-hover:translate-x-1">
                    <NavigationChevron direction="next" />
                  </span>
                </div>
              </div>
            </Link>

            <div
              className="group lg:col-span-5 flex min-h-[340px] flex-col justify-between border border-paper-200 bg-paper-50 p-6 md:p-8 transition-colors hover:border-green-300"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-green-50 text-green-700">
                    <IconImage src="/gambar/icon/lokasi.webp" className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-400">
                    02
                  </span>
                </div>
                <div className="mt-8">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-green-700 mb-2">
                    Kontak & Lokasi
                  </div>
                  <h3 className="font-editorial text-2xl md:text-3xl font-semibold text-ink-950 leading-tight mb-3">
                    Kantor Desa Bajawali.
                  </h3>
                  <p className="text-ink-600 leading-relaxed">
                    Informasi pelayanan dan lokasi kantor desa tersedia dalam satu halaman.
                  </p>
                </div>
              </div>

              <div>
                <div className="space-y-3 border-t border-paper-200 pt-5">
                  <div className="flex items-start gap-3 text-sm text-ink-700">
                    <IconImage
                      src="/gambar/icon/lokasi.webp"
                      className="mt-0.5 h-5 w-5 shrink-0"
                    />
                    <span>Desa Bajawali, Kec. Lariang, Kab. Pasangkayu</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-ink-700">
                    <IconImage
                      src="/gambar/icon/jadwal_kegiatan.webp"
                      className="mt-0.5 h-5 w-5 shrink-0"
                    />
                    <span>Senin–Jumat · 08.00–15.00 WITA</span>
                  </div>
                  <a
                    href="mailto:desabajawali2@gmail.com"
                    className="flex items-start gap-3 text-sm text-ink-700 transition-colors hover:text-green-700"
                  >
                    <IconImage
                      src="/gambar/icon/dokumen.webp"
                      className="mt-0.5 h-5 w-5 shrink-0"
                    />
                    <span>
                      <span className="block text-xs font-semibold text-ink-400">Email</span>
                      desabajawali2@gmail.com
                    </span>
                  </a>
                  <a
                    href="https://wa.me/+6285756063460"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-sm text-ink-700 transition-colors hover:text-green-700"
                  >
                    <IconImage
                      src="/gambar/icon/kantor_desa.webp"
                      className="mt-0.5 h-5 w-5 shrink-0"
                    />
                    <span>
                      <span className="block text-xs font-semibold text-ink-400">
                        Telepon/WhatsApp
                      </span>
                      +62 857-5606-3460
                    </span>
                  </a>
                </div>
                <Link
                  href="/kontak"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-green-700 transition-colors hover:text-green-800"
                >
                  <span className="border-b border-green-700 group-hover:border-transparent transition-colors">
                    Lihat kontak & lokasi
                  </span>{' '}
                  <span className="transition-transform group-hover:translate-x-1">
                    <NavigationChevron direction="next" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HomeScrollEffects />
    </div>
  )
}
