'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="max-w-md rounded-lg border border-red-100 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={22} />
        </span>
        <h2 className="mt-4 font-editorial text-2xl text-ink-950">Data belum dapat dimuat</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Terjadi masalah saat mengambil data CMS. Periksa konfigurasi Supabase atau coba kembali.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-800"
        >
          <RefreshCw size={16} />
          Coba lagi
        </button>
      </div>
    </div>
  )
}
