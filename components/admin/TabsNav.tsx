import Link from 'next/link'
import type { ReactNode } from 'react'

export interface AdminTab {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
}

/**
 * Membaca nilai ?tab= dari searchParams dan memvalidasi terhadap daftar tab.
 * Nilai yang tidak dikenal jatuh ke tab pertama.
 */
export function resolveTabId(
  tabs: AdminTab[],
  value: string | string[] | undefined,
): string {
  const requested = typeof value === 'string' ? value : undefined
  if (requested && tabs.some((tab) => tab.id === requested)) {
    return requested
  }
  return tabs[0]?.id ?? ''
}

/**
 * Navigasi tab berbasis URL (?tab=) supaya tab bisa di-bookmark dan tetap
 * aktif setelah refresh. Halaman server yang menentukan tab aktif.
 */
export default function TabsNav({
  basePath,
  tabs,
  activeId,
}: {
  basePath: string
  tabs: AdminTab[]
  activeId: string
}) {
  return (
    <div className="mb-6 -mx-6 overflow-x-auto px-6">
      <nav className="inline-flex min-w-full gap-1 rounded-lg border border-paper-200 bg-white p-1 shadow-sm">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId
          return (
            <Link
              key={tab.id}
              href={`${basePath}?tab=${tab.id}`}
              scroll={false}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-700 text-white'
                  : 'text-ink-600 hover:bg-paper-100 hover:text-ink-950'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined ? (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-paper-100 text-ink-500'
                  }`}
                >
                  {tab.badge}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
