import type { Metadata } from 'next'
import NotFoundContent from '@/components/ui/NotFoundContent'

export const metadata: Metadata = {
  title: 'Halaman tidak ditemukan — Website Desa Bajawali',
}

/**
 * Menangani URL yang tidak cocok dengan route mana pun. Halaman ini dirender
 * di dalam root layout (tanpa navbar/footer publik), jadi isinya dibuat
 * mandiri: sudah menyediakan tautan kembali ke beranda.
 */
export default function NotFound() {
  return <NotFoundContent />
}
