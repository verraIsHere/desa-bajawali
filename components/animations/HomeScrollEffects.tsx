'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HomeScrollEffects() {
  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    const sections = gsap.utils.toArray<HTMLElement>('main > div > section')
    const context = gsap.context(() => {
      sections.forEach((section) => {
        const content = section.firstElementChild

        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 84%',
              once: true,
            },
          },
        )

        if (content) {
          gsap.fromTo(
            content.children,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              delay: 0.08,
              stagger: 0.06,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 84%',
                once: true,
              },
            },
          )
        }
      })
    })

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('load', refresh)
      context.revert()
    }
  }, [])

  return null
}
