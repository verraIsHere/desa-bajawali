import { createClient } from '@/lib/supabase/client'

type Row = Record<string, unknown>

/**
 * Semua tabel data inti (desa_profile, desa_geography, desa_statistics,
 * desa_demographics, contact_information) bersifat singleton: satu baris
 * per domain. Update bila baris sudah ada, insert bila tabel masih kosong.
 */
export async function saveSingletonRow(table: string, id: number | null, values: Row) {
  const supabase = createClient()

  if (id) {
    return supabase.from(table).update(values).eq('id', id)
  }

  return supabase.from(table).insert(values).select('id').single()
}

export function parseNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : null
}

export function requireNumber(value: string, fieldLabel: string): number {
  const parsed = Number(value.trim())
  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldLabel} harus berupa angka`)
  }
  return parsed
}
