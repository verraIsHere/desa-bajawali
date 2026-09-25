import { createClient } from '@/lib/supabase/server'
import type { News } from '@/types/database'

async function getClient() {
  try {
    return await createClient()
  } catch {
    return null
  }
}

/**
 * Get published news for public pages, ordered by published_at desc
 */
export async function getPublishedNews(): Promise<News[]> {
  const supabase = await getClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('news')
    .select('*, author:profiles(full_name)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching published news:', error)
    return []
  }

  return (data || []) as unknown as News[]
}

/**
 * Get a single news article by slug (public — only published)
 */
export async function getNewsBySlug(slug: string): Promise<News | null> {
  const supabase = await getClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('news')
    .select('*, author:profiles(full_name)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('Error fetching news by slug:', error)
    return null
  }

  return data as unknown as News
}

/**
 * Get all news for admin CMS (includes drafts)
 */
export async function getAllNews(): Promise<News[]> {
  const supabase = await getClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('news')
    .select('*, author:profiles(full_name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all news:', error)
    return []
  }

  return (data || []) as unknown as News[]
}

/**
 * Get a single news by ID (admin — includes drafts)
 */
export async function getNewsById(id: string): Promise<News | null> {
  const supabase = await getClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('news')
    .select('*, author:profiles(full_name)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching news by id:', error)
    return null
  }

  return data as unknown as News
}

/**
 * Get count of news articles
 */
export async function getNewsCount(): Promise<number> {
  const supabase = await getClient()
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting news:', error)
    return 0
  }

  return count || 0
}
