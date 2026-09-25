'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { NavigationChevron } from '@/components/ui/NavigationChevron'

export type StructureImage = {
  src: string
  alt: string
  title: string
}

type StructureImageLightboxProps = {
  images: StructureImage[]
  initialIndex: number
  children: ReactNode
}

export default function StructureImageLightbox({
  images,
  initialIndex,
  children,
}: StructureImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const activeImage = activeIndex === null ? null : images[activeIndex]

  const showPrevious = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null
      return (currentIndex - 1 + images.length) % images.length
    })
  }, [images.length])

  const showNext = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return null
      return (currentIndex + 1) % images.length
    })
  }, [images.length])

  useEffect(() => {
    if (activeIndex === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      }

      if (event.key === 'ArrowLeft') {
        showPrevious()
      }

      if (event.key === 'ArrowRight') {
        showNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, showNext, showPrevious])

  return (
    <div className="group relative">
      {children}
      <button
        type="button"
        onClick={() => setActiveIndex(initialIndex)}
        className="absolute inset-0 z-10 cursor-zoom-in rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        aria-label={`Perbesar ${images[initialIndex]?.title ?? 'gambar struktur pemerintahan'}`}
      />
      <span className="pointer-events-none absolute top-3 right-3 z-20 bg-ink-950/75 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">
        Perbesar
      </span>

      {activeIndex !== null && activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/95 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="structure-image-modal-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveIndex(null)
            }
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col">
            <div className="mb-3 flex items-start justify-between gap-4 text-white">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-green-300 mb-1">
                  Struktur Pemerintahan
                </div>
                <h2
                  id="structure-image-modal-title"
                  className="font-editorial text-xl sm:text-2xl font-semibold leading-tight"
                >
                  {activeImage.title}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setActiveIndex(null)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                aria-label="Tutup tampilan gambar"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="relative h-[62vh] min-h-[240px] w-full overflow-hidden rounded-md bg-black/20 sm:h-[68vh]">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-white">
              <button
                type="button"
                onClick={showPrevious}
                disabled={images.length < 2}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Gambar sebelumnya"
              >
                <NavigationChevron direction="previous" size={18} />
              </button>
              <span className="text-xs font-semibold tracking-widest">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={showNext}
                disabled={images.length < 2}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Gambar berikutnya"
              >
                <NavigationChevron direction="next" size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
