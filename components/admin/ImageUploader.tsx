'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  compressImage,
  validateImageFile,
  formatFileSize,
  type CompressionResult,
} from '@/lib/compression/image'

interface ImageUploaderProps {
  bucket?: string
  folder: string // e.g. "berita/2026" or "galeri/2026"
  currentImageUrl?: string | null
  currentImagePath?: string | null
  onUploadComplete: (url: string, path: string) => void
  onRemove?: () => void
  maxWidth?: number
  quality?: number
}

export default function ImageUploader({
  bucket = 'desa-bajawali',
  folder,
  currentImageUrl,
  currentImagePath,
  onUploadComplete,
  onRemove,
  maxWidth = 1600,
  quality = 0.8,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null)
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'compressing' | 'uploading' | 'done'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null)
      setCompressionInfo(null)

      // Validate
      const validationError = validateImageFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setUploading(true)
      setUploadProgress('compressing')

      try {
        // Compress
        const result = await compressImage(file, {
          maxWidth,
          quality,
          format: 'image/webp',
        })

        setCompressionInfo(result)

        // Preview compressed image
        const previewUrl = URL.createObjectURL(result.blob)
        setPreview(previewUrl)

        setUploadProgress('uploading')

        // Generate filename
        const timestamp = Date.now()
        const safeName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-z0-9]/gi, '-')
          .toLowerCase()
        const filePath = `${folder}/${safeName}-${timestamp}.webp`

        // Upload to Supabase Storage
        const supabase = createClient()

        // Delete old image if exists
        if (currentImagePath) {
          await supabase.storage.from(bucket).remove([currentImagePath])
        }

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, result.blob, {
            contentType: 'image/webp',
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Upload gagal: ${uploadError.message}`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath)

        setUploadProgress('done')
        onUploadComplete(urlData.publicUrl, filePath)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat upload')
        setPreview(currentImageUrl || null)
      } finally {
        setUploading(false)
      }
    },
    [bucket, folder, currentImagePath, currentImageUrl, maxWidth, quality, onUploadComplete]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleRemove = async () => {
    if (currentImagePath) {
      const supabase = createClient()
      await supabase.storage.from(bucket).remove([currentImagePath])
    }
    setPreview(null)
    setCompressionInfo(null)
    setUploadProgress('idle')
    if (inputRef.current) inputRef.current.value = ''
    onRemove?.()
  }

  return (
    <div className="space-y-2">
      {preview ? (
        /* Image Preview */
        <div className="relative rounded-lg overflow-hidden border border-paper-200 bg-paper-100">
          {/* Preview memakai blob URL lokal sehingga tidak dapat dioptimalkan oleh next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {uploadProgress === 'done' && (
              <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 size={12} />
                Uploaded
              </span>
            )}
            <button
              onClick={handleRemove}
              className="bg-red-600 text-white p-1.5 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              type="button"
              aria-label="Hapus gambar"
            >
              <X size={14} />
            </button>
          </div>

          {/* Compression info */}
          {compressionInfo && (
            <div className="px-3 py-2 bg-paper-50 border-t border-paper-200 text-xs text-ink-600 flex items-center gap-4">
              <span>{compressionInfo.width} × {compressionInfo.height}px</span>
              <span>WebP</span>
              <span>
                {formatFileSize(compressionInfo.originalSize)} → {formatFileSize(compressionInfo.compressedSize)}
              </span>
              <span className="text-green-700 font-medium">
                −{compressionInfo.ratio}%
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Drop Zone */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            uploading
              ? 'border-green-300 bg-green-50/50'
              : 'border-paper-200 hover:border-green-400 hover:bg-green-50/30'
          }`}
        >
          {uploading ? (
            <div className="space-y-2">
              <div className="flex justify-center">
                <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-sm text-green-700 font-medium">
                {uploadProgress === 'compressing'
                  ? 'Mengompresi gambar...'
                  : 'Mengupload...'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-paper-100 flex items-center justify-center">
                  <Upload size={20} className="text-ink-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-800">
                  Klik atau seret gambar ke sini
                </p>
                <p className="text-xs text-ink-400 mt-1">
                  JPEG, PNG, atau WebP &middot; Maks. 10 MB &middot; Auto-compress ke WebP
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X size={14} />
          {error}
        </p>
      )}
    </div>
  )
}
