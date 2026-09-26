'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
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

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function StructureImageLightbox({
  images,
  initialIndex,
  children,
}: StructureImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  const activeImage = activeIndex === null ? null : images[activeIndex]
  const isOpen = activeIndex !== null && activeImage !== null

  const close = useCallback(() => {
    setActiveIndex(null)
  }, [])

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
    if (!isOpen) return

    const previouslyFocusedElement = triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPrevious()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        showNext()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      )
      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (!dialogRef.current.contains(activeElement)) {
        event.preventDefault()
        firstElement.focus()
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedElement?.focus()
    }
  }, [close, isOpen, showNext, showPrevious])

  return (
    <>
      <div className="group relative">
        {children}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setActiveIndex(initialIndex)}
          className="absolute inset-0 z-10 cursor-zoom-in rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          aria-label={`Perbesar ${images[initialIndex]?.title ?? 'gambar struktur pemerintahan'}`}
        />
        <span className="pointer-events-none absolute top-3 right-3 z-20 bg-ink-950/75 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">
          Perbesar
        </span>
      </div>

      {typeof document !== 'undefined' && isOpen && activeImage && activeIndex !== null
        ? createPortal(
            <div
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-ink-950 p-3 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  close()
                }
              }}
            >
              <div
                ref={dialogRef}
                tabIndex={-1}
                className="flex max-h-[92dvh] w-full max-w-6xl flex-col focus:outline-none"
              >
                <div className="mb-3 flex shrink-0 items-start justify-between gap-4 text-white">
                  <div className="min-w-0">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-green-300">
                      Struktur Pemerintahan
                    </div>
                    <h2
                      id={titleId}
                      className="font-editorial text-xl font-semibold leading-tight !text-white sm:text-2xl"
                    >
                      {activeImage.title}
                    </h2>
                  </div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={close}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                    aria-label="Tutup tampilan gambar"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>

                <div className="relative h-[62dvh] min-h-[240px] w-full overflow-hidden rounded-md bg-black/20 sm:h-[68dvh]">
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>

                <div className="mt-3 flex shrink-0 items-center justify-between gap-4 text-white">
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
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
