'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PostgrestError } from '@supabase/supabase-js'

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

type SaveResult = { error: PostgrestError | null }

/**
 * Membungkus penulisan ke Supabase dari Client Component: manages status
 * simpan, pesan error, dan refresh router supaya data server component
 * langsung terbaca ulang.
 */
export function useSaveState() {
  const router = useRouter()
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const save = useCallback(
    async (task: () => Promise<SaveResult>, successMessage = 'Perubahan berhasil disimpan') => {
      setStatus('saving')
      setMessage(null)

      const { error } = await task()

      if (error) {
        setStatus('error')
        setMessage(error.message || 'Gagal menyimpan perubahan')
        return false
      }

      setStatus('success')
      setMessage(successMessage)
      router.refresh()
      return true
    },
    [router],
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setMessage(null)
  }, [])

  return {
    status,
    message,
    saving: status === 'saving',
    save,
    reset,
  }
}
