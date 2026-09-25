'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { NavigationChevron } from '@/components/ui/NavigationChevron'
import type { Profile, UserRole } from '@/types/database'
import {
  Database,
  Globe2,
  Image as ImageIcon,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Sprout,
  User,
  Users,
  X,
} from 'lucide-react'

interface SidebarProps {
  profile: Profile | null
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  section?: string
  roles?: UserRole[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Data Desa',
    href: '/admin/data-desa',
    icon: <Database size={18} />,
    section: 'Konten',
  },
  {
    label: 'Pemerintahan',
    href: '/admin/pemerintahan',
    icon: <Landmark size={18} />,
  },
  {
    label: 'Potensi Desa',
    href: '/admin/potensi',
    icon: <Sprout size={18} />,
  },
  {
    label: 'Berita',
    href: '/admin/berita',
    icon: <Newspaper size={18} />,
  },
  {
    label: 'Galeri',
    href: '/admin/galeri',
    icon: <ImageIcon size={18} />,
  },
  {
    label: 'Profil & Kontak',
    href: '/admin/website',
    icon: <Globe2 size={18} />,
    section: 'Website',
  },
  {
    label: 'Pengguna',
    href: '/admin/pengguna',
    icon: <Users size={18} />,
    section: 'Sistem',
    roles: ['owner', 'developer'],
  },
]

export default function AdminSidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const userRole = profile?.role || 'administrator'

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  )

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-green-800/30">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">DESA BAJAWALI</div>
            <div className="text-[10px] text-green-400/60 uppercase tracking-widest">CMS</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredItems.map((item, index) => {
          const showSection =
            item.section &&
            (index === 0 || filteredItems[index - 1]?.section !== item.section)

          return (
            <div key={item.href}>
              {showSection && (
                <div className="px-3 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-green-400/50">
                  {item.section}
                </div>
              )}
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-700/50 text-white font-medium'
                    : 'text-green-100/70 hover:bg-green-800/40 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-green-800/30 mx-3" />

      {/* Bottom actions */}
      <div className="px-3 py-3 space-y-0.5">
        <Link
          href="/admin/profil"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-green-100/70 hover:bg-green-800/40 hover:text-white transition-colors"
        >
          <User size={18} />
          Profil Saya
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-green-100/70 hover:bg-red-900/30 hover:text-red-300 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-t border-green-800/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {profile?.full_name || 'Pengguna'}
            </div>
            <div className="text-[10px] text-green-400/50 uppercase tracking-wider">
              {userRole}
            </div>
          </div>
        </div>
      </div>

      {/* Back to website */}
      <div className="px-3 pb-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-green-400/50 hover:text-green-300 transition-colors"
        >
          <NavigationChevron direction="previous" className="shrink-0" />
          Kembali ke Website
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-green-900 text-white p-2 rounded-md shadow-lg cursor-pointer"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-green-950 flex flex-col transform transition-transform duration-200 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-green-400/60 hover:text-white cursor-pointer"
          aria-label="Tutup menu"
        >
          <X size={20} />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 bg-green-950 min-h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  )
}
