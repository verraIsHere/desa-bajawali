// 'use client'

// import React, {useState, useEffect} from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import {ArrowRight} from 'lucide-react'

// const slides = [
//   {
//     id: 1,
//     image:
//       'https://images.pexels.com/photos/18934158/pexels-photo-18934158.jpeg?auto=compress&cs=tinysrgb&w=2000',
//     title: 'Selamat Datang di Website Desa Bajawali',
//     subtitle: 'DESA BAJAWALI · KECAMATAN LARIANG',
//     description:
//       'Ruang informasi digital untuk mengenal profil desa, kehidupan masyarakat, potensi wilayah, dan perkembangan Desa Bajawali secara transparan dan aktual.',
//     primaryAction: {label: 'Profil Desa', href: '/profil'},
//     secondaryAction: {label: 'Informasi Desa', href: '/data-desa'},
//   },
//   {
//     id: 2,
//     image:
//       'https://images.pexels.com/photos/1576398/pexels-photo-1576398.jpeg?auto=compress&cs=tinysrgb&w=2000',
//     title: 'Potensi Pertanian & Alam yang Melimpah',
//     subtitle: 'KEKAYAAN ALAM DESA',
//     description:
//       'Mendukung perekonomian warga melalui hasil bumi unggulan dan menjaga keseimbangan alam untuk kehidupan yang berkelanjutan.',
//     primaryAction: {label: 'Lihat Potensi', href: '/potensi/pertanian'},
//     secondaryAction: {label: 'Galeri Desa', href: '/galeri'},
//   },
//   {
//     id: 3,
//     image:
//       'https://images.pexels.com/photos/6252573/pexels-photo-6252573.jpeg?auto=compress&cs=tinysrgb&w=2000',
//     title: 'Gotong Royong Membangun Desa',
//     subtitle: 'KEGIATAN MASYARAKAT',
//     description:
//       'Kolaborasi antara pemerintah desa dan warga untuk mewujudkan lingkungan yang aman, bersih, dan sejahtera bagi semua.',
//     primaryAction: {label: 'Kabar Desa', href: '/berita'},
//     secondaryAction: {label: 'Hubungi Kami', href: '/kontak'},
//   },
// ]

// export default function HeroCarousel() {
//   const [currentSlide, setCurrentSlide] = useState(0)

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
//     }, 6000) // Change slide every 6 seconds for a slower, premium feel

//     return () => clearInterval(timer)
//   }, [])

//   return (
//     <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-ink-950">
//       {/* Slides */}
//       {slides.map((slide, index) => {
//         const isActive = index === currentSlide
//         return (
//           <div
//             key={slide.id}
//             className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
//               isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
//             }`}
//           >
//             {/* Background Image */}
//             <Image
//               src={slide.image}
//               alt={slide.title}
//               fill
//               priority={index === 0} // Ensure first slide loads instantly for good LCP
//               className={`object-cover transition-transform duration-[10000ms] ease-linear ${
//                 isActive ? 'scale-105' : 'scale-100'
//               }`}
//             />

//             {/* Gradient Overlay for Text Readability */}
//             <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/50 to-transparent"></div>

//             {/* Content Container */}
//             <div className="absolute inset-0 z-20 flex flex-col justify-end pb-24 md:pb-32">
//               <div className="container mx-auto px-5 lg:px-8">
//                 <div className="max-w-3xl">
//                   {/* Subtitle */}
//                   <div
//                     className={`mb-4 overflow-hidden transition-all duration-700 delay-300 ${
//                       isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//                     }`}
//                   >
//                     <span className="text-xs font-bold uppercase tracking-widest text-green-300">
//                       {slide.subtitle}
//                     </span>
//                   </div>

//                   {/* Title */}
//                   <h1
//                     className={`font-editorial text-4xl md:text-5xl lg:text-7xl drop-shadow-lg text-white font-semibold leading-tight mb-6 transition-all duration-700 delay-500 ${
//                       isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//                     }`}
//                   >
//                     {slide.title}
//                   </h1>

//                   {/* Description */}
//                   <p
//                     className={`text-paper-100 text-base md:text-lg lg:text-xl mb-10 leading-relaxed max-w-2xl transition-all duration-700 delay-700 ${
//                       isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//                     }`}
//                   >
//                     {slide.description}
//                   </p>

//                   {/* Actions */}
//                   <div
//                     className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-1000 ${
//                       isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//                     }`}
//                   >
//                     <Link
//                       href={slide.primaryAction.href}
//                       className="inline-flex items-center justify-center bg-green-700 text-white hover:bg-green-800 px-6 py-3.5 rounded-md font-medium transition-colors"
//                     >
//                       {slide.primaryAction.label} <ArrowRight className="ml-2 w-4 h-4" />
//                     </Link>
//                     <Link
//                       href={slide.secondaryAction.href}
//                       className="inline-flex items-center justify-center bg-transparent border border-paper-200/40 text-paper-50 hover:bg-white/10 px-6 py-3.5 rounded-md font-medium transition-colors"
//                     >
//                       {slide.secondaryAction.label}
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )
//       })}

//       {/* Navigation Indicators */}
//       <div className="absolute bottom-8 left-0 right-0 z-30">
//         <div className="container mx-auto px-5 lg:px-8">
//           <div className="flex items-center gap-3">
//             {slides.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setCurrentSlide(index)}
//                 aria-label={`Go to slide ${index + 1}`}
//                 className={`transition-all duration-500 ease-out h-1 rounded-full ${
//                   index === currentSlide ? 'w-12 bg-green-500' : 'w-4 bg-white/40 hover:bg-white/70'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

'use client'

import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { NavigationChevron } from '@/components/ui/NavigationChevron'

export type HeroSlideData = {
  id: string | number
  image: string
  title: string
  subtitle: string
  description: string
  primaryAction: { label: string; href: string }
  secondaryAction: { label: string; href: string }
}

const fallbackSlides: HeroSlideData[] = [
  {
    id: 1,
    image:
      '/gambar/background/background_1.webp',
    title: 'Selamat Datang di Website Desa Bajawali',
    subtitle: 'DESA BAJAWALI · KECAMATAN LARIANG',
    description:
      'Ruang informasi digital untuk mengenal profil desa, kehidupan masyarakat, potensi wilayah, dan perkembangan Desa Bajawali secara transparan dan aktual.',
    primaryAction: {label: 'Profil Desa', href: '/profil'},
    secondaryAction: {label: 'Informasi Desa', href: '/data-desa'},
  },
  {
    id: 2,
    image:
      '/gambar/background/background_2baru.webp',
    title: 'Potensi Pertanian & Alam yang Melimpah',
    subtitle: 'KEKAYAAN ALAM DESA',
    description:
      'Mendukung perekonomian warga melalui hasil bumi unggulan dan menjaga keseimbangan alam untuk kehidupan yang berkelanjutan.',
    primaryAction: {label: 'Lihat Potensi', href: '/potensi/pertanian'},
    secondaryAction: {label: 'Galeri Desa', href: '/galeri'},
  },
  {
    id: 3,
    image:
      '/gambar/background/background_3.webp',
    title: 'Gotong Royong Membangun Desa',
    subtitle: 'KEGIATAN MASYARAKAT',
    description:
      'Kolaborasi antara pemerintah desa dan warga untuk mewujudkan lingkungan yang aman, bersih, dan sejahtera bagi semua.',
    primaryAction: {label: 'Kabar Desa', href: '/berita'},
    secondaryAction: {label: 'Hubungi Kami', href: '/kontak'},
  },
]

export default function HeroCarousel({
  initialSlides,
}: {
  initialSlides?: HeroSlideData[]
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = initialSlides && initialSlides.length > 0 ? initialSlides : fallbackSlides

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 6000)

    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-slate-950">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className={`object-cover transition-transform duration-[10000ms] ease-linear ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* OVERLAY LAYER 1: Overall Tint untuk meredam foto terang */}
            <div className="absolute inset-0 bg-slate-950/30 z-10" />

            {/* OVERLAY LAYER 2: Gradient Pekat dari Bawah */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent z-10" />

            {/* Content Container */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end pb-24 md:pb-32">
              <div className="container mx-auto px-5 lg:px-8">
                <div className="max-w-3xl">
                  {/* Subtitle - Badge Style */}
                  {/* <div
                    className={`mb-4 overflow-hidden transition-all duration-700 delay-300 ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-300 bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 rounded-full shadow-lg">
                      {slide.subtitle}
                    </span>
                  </div> */}

                  {/* Title - Strong Shadow */}
                  <h1
                    className={`font-editorial text-4xl md:text-5xl lg:text-7xl text-white !text-green-500 font-semibold leading-tight mb-6 [text-shadow:_0_4px_4px_rgba(0,0,0,0.9)] transition-all duration-700 delay-500 ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {slide.title}
                  </h1>

                  {/* Description - Semi-transparent background panel / strong text shadow */}
                  <p
                    className={`text-slate-100 text-base md:text-lg lg:text-xl mb-10 leading-relaxed max-w-2xl [text-shadow:_0_2px_10px_rgba(0,0,0,0.9)] transition-all duration-700 delay-700 ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {slide.description}
                  </p>

                  {/* Actions */}
                  <div
                    className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-1000 ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <Link
                      href={slide.primaryAction.href}
                      className="inline-flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-3.5 rounded-md font-medium transition-colors shadow-lg shadow-emerald-950/50"
                    >
                      {slide.primaryAction.label}{' '}
                      <NavigationChevron direction="next" size={16} className="ml-2 shrink-0" />
                    </Link>
                    <Link
                      href={slide.secondaryAction.href}
                      className="inline-flex items-center justify-center bg-slate-900/60 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-6 py-3.5 rounded-md font-medium transition-colors"
                    >
                      {slide.secondaryAction.label}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-500 ease-out h-1.5 rounded-full ${
                  index === currentSlide
                    ? 'w-12 bg-emerald-400'
                    : 'w-4 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
