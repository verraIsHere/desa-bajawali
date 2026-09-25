// =============================================
// Data Source Configuration
// =============================================
// Controls whether a module reads from local data or Supabase.
// When a module is migrated to Supabase, change its source here.

export const DATA_SOURCE = {
  news: 'supabase' as const,
  gallery: 'supabase' as const,
  profile: 'supabase' as const,
  demographic: 'supabase' as const,
  infrastructure: 'supabase' as const,
  government: 'supabase' as const,
  potential: 'supabase' as const,
  website: 'supabase' as const,
}

export type DataSourceModule = keyof typeof DATA_SOURCE

export function isSupabaseSource(module: DataSourceModule): boolean {
  return DATA_SOURCE[module] === 'supabase'
}
