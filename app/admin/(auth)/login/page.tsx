'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('Email atau password salah. Silakan coba lagi.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
         
          <h1 className="text-2xl font-bold !text-white tracking-tight" style={{ fontFamily: 'var(--font-editorial), serif' }}>
            DESA BAJAWALI
          </h1>
          <p className="text-green-300/70 text-sm mt-1">
            Sistem Manajemen Konten
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-lg font-semibold text-ink-950 mb-6 text-center">
            Masuk ke CMS
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-ink-800 mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@desabajawali.id"
                className="w-full px-4 py-2.5 border border-paper-200 rounded-md text-ink-950 bg-paper-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow text-sm"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-ink-800 mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-paper-200 rounded-md text-ink-950 bg-paper-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-semibold rounded-md transition-colors text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-green-300/40 text-xs mt-6">
          &copy; {new Date().getFullYear()} Desa Bajawali &middot; Universitas Muhammadiyah Mamuju
        </p>
      </div>
    </div>
  )
}
