'use client'

import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { NumberInput, TextInput } from '@/components/admin/Form'

export interface LabeledValue {
  label: string
  value: number | null
}

/**
 * Editor untuk kolom JSON berbentuk [{ label, value }] pada tabel
 * desa_demographics. Baris yang labelnya kosong diabaikan saat simpan.
 */
export default function ArrayField({
  legend,
  description,
  items,
  onChange,
  valueMode = 'number',
  valuePlaceholder = '0',
  presets = [],
}: {
  legend: string
  description?: string
  items: LabeledValue[]
  onChange: (items: LabeledValue[]) => void
  valueMode?: 'number' | 'optional-number'
  valuePlaceholder?: string
  presets?: readonly string[]
}) {
  const usedPresets = new Set(items.map((item) => item.label.trim().toLowerCase()))
  const availablePresets = presets.filter((preset) => !usedPresets.has(preset.toLowerCase()))

  function updateRow(index: number, patch: Partial<LabeledValue>) {
    onChange(items.map((item, position) => (position === index ? { ...item, ...patch } : item)))
  }

  function addRow(label = '', value: number | null = 0) {
    onChange([...items, { label, value }])
  }

  function removeRow(index: number) {
    onChange(items.filter((_, position) => position !== index))
  }

  function moveRow(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <fieldset className="space-y-3 border-t border-paper-100 pt-5 first:border-0 first:pt-0">
      <legend className="sr-only">{legend}</legend>

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-green-700">{legend}</h4>
          {description ? <p className="mt-1 text-xs text-ink-400">{description}</p> : null}
        </div>
        <span className="text-xs text-ink-400">{items.length} kelompok</span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-paper-200 px-4 py-6 text-center text-sm text-ink-400">
          Belum ada kelompok. Tambahkan minimal satu baris.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
              <div className="min-w-0 flex-1 basis-56">
                <TextInput
                  value={item.label}
                  onChange={(label) => updateRow(index, { label })}
                  placeholder="Nama kelompok"
                />
              </div>
              <div className="w-28 shrink-0">
                <NumberInput
                  value={item.value === null ? '' : String(item.value)}
                  onChange={(raw) =>
                    updateRow(index, {
                      value:
                        valueMode === 'optional-number' && raw.trim() === ''
                          ? null
                          : Number.isFinite(Number(raw))
                            ? Number(raw)
                            : null,
                    })
                  }
                  placeholder={valuePlaceholder}
                />
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveRow(index, -1)}
                  disabled={index === 0}
                  aria-label={`Naikkan urutan ${item.label || `baris ${index + 1}`}`}
                  className="rounded-md p-1.5 text-ink-400 transition-colors hover:bg-paper-100 hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => moveRow(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label={`Turunkan urutan ${item.label || `baris ${index + 1}`}`}
                  className="rounded-md p-1.5 text-ink-400 transition-colors hover:bg-paper-100 hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  aria-label={`Hapus ${item.label || `baris ${index + 1}`}`}
                  className="rounded-md p-1.5 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => addRow('', valueMode === 'optional-number' ? null : 0)}
          className="inline-flex items-center gap-1.5 rounded-md border border-paper-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-green-300 hover:text-green-700"
        >
          <Plus size={14} />
          Tambah kelompok
        </button>

        {availablePresets.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-ink-400">Cepat:</span>
            {availablePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => addRow(preset, 0)}
                className="rounded-full border border-paper-200 px-2.5 py-1 text-[11px] text-ink-600 transition-colors hover:border-green-300 hover:bg-green-50 hover:text-green-700"
              >
                + {preset}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </fieldset>
  )
}
