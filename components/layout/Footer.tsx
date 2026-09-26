// import Link from 'next/link'

// export default function Footer() {
//   return (
//     <footer className="border-t border-paper-200 bg-paper-100 mt-24">
//       <div className="container mx-auto px-5 lg:px-8 py-16">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
//           <div className="md:col-span-1">
//             <Link href="/" className="flex flex-col mb-4">
//               <span className="font-editorial text-xl font-semibold tracking-tight text-ink-950">
//                 Desa Bajawali
//               </span>
//               <span className="text-xs font-semibold uppercase tracking-widest text-ink-400">
//                 Lariang, Pasangkayu
//               </span>
//             </Link>
//             <p className="text-sm text-ink-600 mb-6 max-w-sm">
//               Website resmi Desa Bajawali, menyajikan informasi publik, profil, dan dokumentasi
//               perkembangan desa.
//             </p>
//           </div>

//           <div className="md:col-span-1">
//             <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-800 mb-4">
//               Profil
//             </h3>
//             <ul className="flex flex-col gap-3">
//               <li>
//                 <Link
//                   href="/profil/sejarah"
//                   className="text-sm text-ink-600 hover:text-green-700 transition-colors"
//                 >
//                   Sejarah Desa
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/profil/visi-misi"
//                   className="text-sm text-ink-600 hover:text-green-700 transition-colors"
//                 >
//                   Moto & Program
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/profil/geografis"
//                   className="text-sm text-ink-600 hover:text-green-700 transition-colors"
//                 >
//                   Geografis
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/profil/demografi"
//                   className="text-sm text-ink-600 hover:text-green-700 transition-colors"
//                 >
//                   Demografi
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/profil/struktur-pemerintahan"
//                   className="text-sm text-ink-600 hover:text-green-700 transition-colors"
//                 >
//                   Struktur Pemerintahan
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div className="md:col-span-1">
//             <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-800 mb-4">
//               Informasi
//             </h3>
//             <ul className="flex flex-col gap-3">
//               <li>
//                 <Link
//                   href="/berita"
//                   className="text-sm text-ink-600 hover:text-green-700 transition-colors"
//                 >
//                   Berita & Kegiatan
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/potensi"
//                   className="text-sm text-ink-600 hover:text-green-700 transition-colors"
//                 >
//                   Potensi Desa
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/data-desa"
//                   className="text-sm text-ink-600 hover:text-green-700 transition-colors"
//                 >
//                   Data Desa
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/galeri"
//                   className="text-sm text-ink-600 hover:text-green-700 transition-colors"
//                 >
//                   Galeri Dokumentasi
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div className="md:col-span-1">
//             <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-800 mb-4">
//               Kontak
//             </h3>
//             <ul className="flex flex-col gap-3 text-sm text-ink-600">
//               <li>Kantor Desa Bajawali</li>
//               <li>Kec. Lariang, Kab. Pasangkayu</li>
//               <li>Sulawesi Barat</li>
//               <li className="mt-2">
//                 <Link
//                   href="/kontak"
//                   className="text-green-700 hover:text-green-800 font-medium transition-colors"
//                 >
//                   Hubungi Kami &rarr;
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="mt-16 pt-8 border-t border-paper-200 flex flex-col md:flex-row justify-between items-center gap-4">
//           <p className="text-xs text-ink-400">
//             &copy; {new Date().getFullYear()} Dikembangkan oleh Universitas Muhammadiyah Mamuju, Posko Desa Bajawali.
//           </p>
//           <div className="flex items-center gap-4">{/* Social links placeholder if needed */}</div>
//         </div>
//       </div>
//     </footer>
//   )
// }

import Link from 'next/link'
import Image from 'next/image'
import { NavigationChevron } from '@/components/ui/NavigationChevron'
import {
  getPublicContactInformation,
  getPublicVillageProfile,
} from '@/lib/queries/village'

export default async function Footer() {
  const [contact, profile] = await Promise.all([
    getPublicContactInformation(),
    getPublicVillageProfile(),
  ])

  return (
    <footer className="border-t border-paper-200 bg-paper-100 mt-24">
      <div className="container mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/gambar/logo_pasangkayu.png"
                alt="Lambang Kabupaten Pasangkayu"
                width={728}
                height={800}
                sizes="48px"
                className="h-12 w-auto shrink-0"
              />
              <span className="flex flex-col">
                <span className="font-editorial text-xl font-semibold tracking-tight text-ink-950">
                  {profile.name}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                  {profile.district}, {profile.regency}
                </span>
              </span>
            </Link>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/gambar/logo_unimaju.webp"
                alt="Lambang Universitas Muhammadiyah Mamuju"
                width={728}
                height={800}
                sizes="48px"
                className="h-12 w-auto shrink-0"
              />
              <span className="flex flex-col">
                <span className="font-editorial text-xl font-semibold tracking-tight text-ink-950">
                  Posko Bajawali
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-400">
                  Universitas Muhammadiyah Mamuju
                </span>
              </span>
            </Link>
            <p className="text-sm text-ink-600 mb-6 max-w-sm">
              Website resmi Desa Bajawali, menyajikan informasi publik, profil, dan dokumentasi
              perkembangan desa.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-800 mb-4">
              Profil
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/profil/sejarah"
                  className="text-sm text-ink-600 hover:text-green-700 transition-colors"
                >
                  Sejarah Desa
                </Link>
              </li>
              <li>
                <Link
                  href="/profil/visi-misi"
                  className="text-sm text-ink-600 hover:text-green-700 transition-colors"
                >
                  Moto & Program
                </Link>
              </li>
              <li>
                <Link
                  href="/profil/geografis"
                  className="text-sm text-ink-600 hover:text-green-700 transition-colors"
                >
                  Geografis
                </Link>
              </li>
              <li>
                <Link
                  href="/profil/demografi"
                  className="text-sm text-ink-600 hover:text-green-700 transition-colors"
                >
                  Demografi
                </Link>
              </li>
              <li>
                <Link
                  href="/profil/struktur-pemerintahan"
                  className="text-sm text-ink-600 hover:text-green-700 transition-colors"
                >
                  Struktur Pemerintahan
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-800 mb-4">
              Informasi
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/berita"
                  className="text-sm text-ink-600 hover:text-green-700 transition-colors"
                >
                  Berita & Kegiatan
                </Link>
              </li>
              <li>
                <Link
                  href="/potensi"
                  className="text-sm text-ink-600 hover:text-green-700 transition-colors"
                >
                  Potensi Desa
                </Link>
              </li>
              <li>
                <Link
                  href="/data-desa"
                  className="text-sm text-ink-600 hover:text-green-700 transition-colors"
                >
                  Data Desa
                </Link>
              </li>
              <li>
                <Link
                  href="/galeri"
                  className="text-sm text-ink-600 hover:text-green-700 transition-colors"
                >
                  Galeri Dokumentasi
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-800 mb-4">
              Kontak
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-ink-600">
              <li>{contact.address}</li>
              {contact.email ? <li>{contact.email}</li> : null}
              {contact.whatsapp ? <li>{contact.whatsapp}</li> : null}
              {contact.service_hours ? <li>{contact.service_hours}</li> : null}
              <li className="mt-2">
                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-800 font-medium transition-colors"
                >
                  Hubungi Kami <NavigationChevron direction="next" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Footer */}
        <div className="mt-16 pt-8 border-t border-paper-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-400">
          <p>
            &copy; {new Date().getFullYear()} Dikembangkan oleh Universitas Muhammadiyah Mamuju, Posko Desa Bajawali.
          </p>
          <p>
            Developer:{' '}
            <a
              href="https://makbuln.web.id"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-600 hover:text-green-700 transition-colors underline underline-offset-2"
            >
              Muhammad Makbul N
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}