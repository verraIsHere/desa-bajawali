import { createClient } from '@/lib/supabase/server'
import type { GalleryItem } from '@/types/database'

async function getClient() {
  try {
    return await createClient()
  } catch {
    return null
  }
}

/**
 * Get published gallery items for public pages
 */
export async function getPublishedGallery(): Promise<GalleryItem[]> {
  const supabase = await getClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching published gallery:', error)
    return []
  }

  return (data || []) as GalleryItem[]
}

/**
 * Get all gallery items for admin CMS
 */
export async function getAllGallery(): Promise<GalleryItem[]> {
  const supabase = await getClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('gallery')
    .select('*, creator:profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all gallery:', error)
    return []
  }

  return (data || []) as unknown as GalleryItem[]
}

/**
 * Get a single gallery item by ID (admin)
 */
export async function getGalleryById(id: string): Promise<GalleryItem | null> {
  const supabase = await getClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('gallery')
    .select('*, creator:profiles(full_name)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching gallery by id:', error)
    return null
  }

  return data as unknown as GalleryItem
}

/**
 * Get count of gallery items
 */
export async function getGalleryCount(): Promise<number> {
  const supabase = await getClient()
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('gallery')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting gallery:', error)
    return 0
  }

  return count || 0
}
