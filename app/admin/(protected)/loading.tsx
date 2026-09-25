import { Loader2 } from 'lucide-react'

export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-label="Memuat dashboard">
      <div className="h-36 animate-pulse rounded-lg bg-green-950/80" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg border border-paper-200 bg-white" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="h-80 animate-pulse rounded-lg border border-paper-200 bg-white xl:col-span-3" />
        <div className="h-80 animate-pulse rounded-lg border border-paper-200 bg-white xl:col-span-2" />
      </div>
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-ink-400">
        <Loader2 size={16} className="animate-spin" />
        Memuat data CMS...
      </div>
    </div>
  )
}
