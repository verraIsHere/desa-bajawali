'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react'
import ImageUploader from './ImageUploader'
import { NEWS_CATEGORIES, type NewsCategory } from '@/types/database'

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const supabase = createClient()

  let slug = baseSlug
  let counter = 1

  while (true) {
    let query = supabase
      .from('news')
      .select('id')
      .eq('slug', slug)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.single()

    if (!data) break

    counter++
    slug = `${baseSlug}-${counter}`
  }

  return slug
}

interface NewsFormProps {
  initialData?: {
    id: string
    title: string
    excerpt: string
    content: string
    category: NewsCategory
    image_url: string | null
    image_path: string | null
    is_published: boolean
  }
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center flex-wrap gap-1 border-b border-paper-200 bg-paper-100 p-2 rounded-t-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1.5 rounded-md hover:bg-paper-200 transition-colors ${
          editor.isActive('bold') ? 'bg-paper-200 text-ink-950 font-bold' : 'text-ink-600'
        }`}
        type="button"
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded-md hover:bg-paper-200 transition-colors ${
          editor.isActive('italic') ? 'bg-paper-200 text-ink-950' : 'text-ink-600'
        }`}
        type="button"
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <div className="w-px h-5 bg-paper-200 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded-md hover:bg-paper-200 transition-colors ${
          editor.isActive('bulletList') ? 'bg-paper-200 text-ink-950' : 'text-ink-600'
        }`}
        type="button"
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded-md hover:bg-paper-200 transition-colors ${
          editor.isActive('orderedList') ? 'bg-paper-200 text-ink-950' : 'text-ink-600'
        }`}
        type="button"
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </button>
      <div className="w-px h-5 bg-paper-200 mx-1" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-1.5 rounded-md hover:bg-paper-200 transition-colors text-ink-600 disabled:opacity-50"
        type="button"
        title="Undo"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-1.5 rounded-md hover:bg-paper-200 transition-colors text-ink-600 disabled:opacity-50"
        type="button"
        title="Redo"
      >
        <Redo size={16} />
      </button>
    </div>
  )
}

export default function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [title, setTitle] = useState(initialData?.title || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [category, setCategory] = useState<NewsCategory>(
    initialData?.category || 'Pemerintahan'
  )
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null)
  const [imagePath, setImagePath] = useState<string | null>(initialData?.image_path || null)
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialData?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none min-h-[300px] p-4',
      },
    },
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const content = editor?.getHTML() || ''
      if (!title.trim() || !content.trim() || content === '<p></p>') {
        throw new Error('Judul dan isi berita tidak boleh kosong')
      }

      if (!imageUrl || !imagePath) {
        throw new Error('Gambar utama wajib diupload')
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Anda harus login terlebih dahulu')

      const slug = await generateUniqueSlug(title, initialData?.id)
      
      const payload = {
        title,
        slug,
        excerpt,
        content,
        category,
        image_url: imageUrl,
        image_path: imagePath,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      }

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('news')
          .update(payload)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('news')
          .insert({
            ...payload,
            author_id: user.id,
          })

        if (insertError) throw insertError
      }

      router.push('/admin/berita')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan berita')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 border border-paper-200 rounded-lg space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-ink-800 mb-1">
                Judul Berita <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul berita"
                className="w-full px-4 py-2 border border-paper-200 rounded-md bg-paper-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-ink-950"
                required
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-ink-800 mb-1">
                Ringkasan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tulis ringkasan singkat (akan tampil di halaman depan)"
                rows={3}
                className="w-full px-4 py-2 border border-paper-200 rounded-md bg-paper-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-ink-950 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-800 mb-1">
                Isi Berita <span className="text-red-500">*</span>
              </label>
              <div className="border border-paper-200 rounded-md overflow-hidden bg-white">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 border border-paper-200 rounded-lg space-y-4">
            <h3 className="text-sm font-semibold text-ink-950 uppercase tracking-wider mb-2">
              Pengaturan Publikasi
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-ink-800 mb-2">
                Status
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isPublished}
                    onChange={() => setIsPublished(false)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-ink-800">Draft (Simpan sementara)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={isPublished}
                    onChange={() => setIsPublished(true)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-ink-800">Publikasikan</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-ink-800 mb-1">
                Kategori
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="w-full px-4 py-2 border border-paper-200 rounded-md bg-paper-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-ink-950"
              >
                {NEWS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 mt-4 border-t border-paper-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-semibold rounded-md transition-colors text-sm cursor-pointer"
              >
                {loading ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Buat Berita'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 border border-paper-200 rounded-lg">
            <h3 className="text-sm font-semibold text-ink-950 uppercase tracking-wider mb-4">
              Gambar Utama <span className="text-red-500">*</span>
            </h3>
            <ImageUploader
              folder={`berita/${new Date().getFullYear()}`}
              currentImageUrl={imageUrl}
              currentImagePath={imagePath}
              onUploadComplete={(url, path) => {
                setImageUrl(url)
                setImagePath(path)
              }}
              onRemove={() => {
                setImageUrl(null)
                setImagePath(null)
              }}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
