'use client'

import { useState } from 'react'
import { Image as ImageIcon, Pencil, Plus, Power, Save, Trash2, X } from 'lucide-react'
import {
  Alert,
  Field,
  FieldGroup,
  FormCard,
  NumberInput,
  SelectInput,
  SubmitButton,
  TextArea,
  TextInput,
  Toggle,
} from '@/components/admin/Form'
import ConfirmDelete from '@/components/admin/ConfirmDelete'
import ImageUploader from '@/components/admin/ImageUploader'
import { useSaveState } from '@/components/admin/useSaveState'
import { createClient } from '@/lib/supabase/client'
import type { VillageBpdMember, VillageOfficial } from '@/types/database'

type Kind = 'officials' | 'bpd'
type Scope = 'kepala-desa' | 'perangkat' | 'kepala-dusun' | 'bpd'

const POSITION_OPTIONS = [
  'Sekretaris Desa',
  'Kaur Umum dan Perencanaan',
  'Kaur Keuangan',
  'Kasi Pemerintah',
  'Kasi Kesra & Pelayanan',
  'Staf Kaur Keuangan',
  'Staf Kasi Kesra',
] as const

const FIXED_POSITION: Record<Scope, string> = {
  'kepala-desa': 'Kepala Desa',
  'perangkat': 'Sekretaris Desa',
  'kepala-dusun': 'Kepala Dusun',
  bpd: 'Anggota',
}

type Item = VillageOfficial | VillageBpdMember

interface StructureManagerProps {
  kind: Kind
  scope: Scope
  items: Item[]
  description: string
}

function getInitials(name: string) {
  return name
    .replace(/,.*$/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function inScope(item: VillageOfficial | VillageBpdMember, kind: Kind, scope: Scope) {
  if (kind === 'bpd') return true
  const position = (item as VillageOfficial).position
  if (scope === 'kepala-desa') return position === 'Kepala Desa'
  if (scope === 'kepala-dusun') return position === 'Kepala Dusun'
  return position !== 'Kepala Desa' && position !== 'Kepala Dusun'
}

export default function StructureManager({
  kind,
  scope,
  items,
  description,
}: StructureManagerProps) {
  const table = kind === 'bpd' ? 'village_bpd' : 'village_officials'
  const rows = items.filter((item) => inScope(item, kind, scope))
  const { status, message, saving, save, reset } = useSaveState()

  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<Item | null>(null)
  const [listError, setListError] = useState<string | null>(null)

  // state form
  const [id, setId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [position, setPosition] = useState<string>(FIXED_POSITION[scope])
  const [dusun, setDusun] = useState('')
  const [period, setPeriod] = useState('')
  const [welcomeText, setWelcomeText] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoPath, setPhotoPath] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [validation, setValidation] = useState<string | null>(null)

  function loadItem(item: Item | null) {
    const official = item as VillageOfficial | null
    const member = item as VillageBpdMember | null
    setId(member?.id ?? null)
    setName(item?.name ?? '')
    setPosition(official?.position ?? FIXED_POSITION[scope])
    setDusun(official?.dusun ?? '')
    setPeriod(official?.period ?? '')
    setWelcomeText(official?.welcome_text ?? '')
    setPhotoUrl(item?.photo_url ?? null)
    setPhotoPath(item?.photo_path ?? null)
    setSortOrder(String(item?.sort_order ?? rows.length + 1))
    setIsActive(item?.is_active ?? true)
    setValidation(null)
    reset()
  }

  function startAdd() {
    setId(null)
    loadItem(null)
    setAdding(true)
    setEditing(null)
  }

  function startEdit(item: Item) {
    loadItem(item)
    setAdding(false)
    setEditing(item.id)
  }

  function closeForm() {
    setAdding(false)
    setEditing(null)
    reset()
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setValidation(null)
    reset()

    if (!name.trim()) {
      setValidation('Nama wajib diisi')
      return
    }
    if (scope === 'kepala-dusun' && !dusun.trim()) {
      setValidation('Nama dusun wajib diisi untuk kepala dusun')
      return
    }
    if (kind === 'bpd' && !position.trim()) {
      setValidation('Jabatan wajib diisi')
      return
    }

    const parsedSortOrder = Number(sortOrder)
    const basePayload: Record<string, unknown> = {
      name: name.trim(),
      photo_url: photoUrl,
      photo_path: photoPath,
      sort_order: Number.isFinite(parsedSortOrder) ? parsedSortOrder : 0,
      is_active: isActive,
    }

    if (kind === 'bpd') {
      basePayload.position = position.trim()
    } else {
      basePayload.position = position
      basePayload.dusun = scope === 'kepala-dusun' ? dusun.trim() : null
      basePayload.period = period.trim() || null
      basePayload.welcome_text = welcomeText.trim() || null
    }

    const supabase = createClient()

    const saved = await save(async () => {
      if (id) {
        return supabase.from(table).update(basePayload).eq('id', id)
      }

      // Ganti kepala desa: nonaktifkan YY lama supaya hanya satu yang aktif.
      if (kind === 'officials' && scope === 'kepala-desa') {
        await supabase
          .from('village_officials')
          .update({ is_active: false })
          .eq('position', 'Kepala Desa')
          .eq('is_active', true)
      }

      return supabase.from(table).insert(basePayload)
    }, id ? 'Perubahan berhasil disimpan' : 'Data baru berhasil ditambahkan')

    if (saved) {
      closeForm()
    }
  }

  async function toggleActive(item: Item) {
    const supabase = createClient()
    setListError(null)

    const { error } = await supabase
      .from(table)
      .update({ is_active: !item.is_active })
      .eq('id', item.id)

    if (error) {
      setListError(error.message || 'Gagal mengubah status aktif')
      return
    }
  }

  async function handleDelete() {
    if (!deleting) return
    const supabase = createClient()
    setListError(null)

    if (deleting.photo_path) {
      await supabase.storage.from('desa-bajawali').remove([deleting.photo_path])
    }

    const { error } = await supabase.from(table).delete().eq('id', deleting.id)

    if (error) {
      setListError(error.message || 'Gagal menghapus data')
      return
    }

    setDeleting(null)
    if (editing === deleting.id) closeForm()
  }

  const isFormOpen = adding || editing !== null

  return (
    <div className="space-y-6">
      {status === 'success' && message ? <Alert variant="success">{message}</Alert> : null}
      {status === 'error' && message ? <Alert variant="error">{message}</Alert> : null}
      {listError ? <Alert variant="error">{listError}</Alert> : null}

      {!isFormOpen ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={startAdd}
            className="inline-flex items-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800"
          >
            <Plus size={16} />
            Tambah
          </button>
        </div>
      ) : null}

      {isFormOpen ? (
        <form onSubmit={handleSubmit}>
          <FormCard
            title={adding ? 'Tambah Data Baru' : 'Ubah Data'}
            description={description}
            footer={
              <>
                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex items-center gap-2 rounded-md border border-paper-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400"
                >
                  <X size={16} />
                  Batal
                </button>
                <SubmitButton saving={saving}>
                  <Save size={16} />
                  Simpan
                </SubmitButton>
              </>
            }
          >
            {validation ? <Alert variant="error">{validation}</Alert> : null}

            <FieldGroup title="Identitas">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nama" htmlFor="structure-name" required>
                  <TextInput
                    id="structure-name"
                    value={name}
                    onChange={setName}
                    placeholder="Nama lengkap dan gelar"
                  />
                </Field>

                {kind === 'bpd' ? (
                  <Field label="Jabatan" htmlFor="structure-position" required>
                    <TextInput
                      id="structure-position"
                      value={position}
                      onChange={setPosition}
                      placeholder="Ketua"
                    />
                  </Field>
                ) : scope === 'perangkat' ? (
                  <Field label="Jabatan" htmlFor="structure-position" required>
                    <SelectInput
                      id="structure-position"
                      value={position}
                      onChange={setPosition}
                      options={Array.from(new Set([position, ...POSITION_OPTIONS]))}
                    />
                  </Field>
                ) : (
                  <Field label="Jabatan" htmlFor="structure-position">
                    <TextInput
                      id="structure-position"
                      value={position}
                      onChange={setPosition}
                      disabled
                    />
                  </Field>
                )}

                {kind === 'officials' && scope === 'kepala-dusun' ? (
                  <Field label="Dusun" htmlFor="structure-dusun" required hint="Contoh: Kerta">
                    <TextInput
                      id="structure-dusun"
                      value={dusun}
                      onChange={setDusun}
                      placeholder="Kerta"
                    />
                  </Field>
                ) : null}

                {kind === 'officials' ? (
                  <Field
                    label="Periode"
                    htmlFor="structure-period"
                    hint={scope === 'kepala-desa' ? 'Contoh: 2025–2030' : 'Boleh dikosongkan'}
                  >
                    <TextInput
                      id="structure-period"
                      value={period}
                      onChange={setPeriod}
                      placeholder="2025–2030"
                    />
                  </Field>
                ) : null}

                <Field label="Urutan tampil" htmlFor="structure-sort" hint="Angka kecil tampil lebih dulu">
                  <NumberInput
                    id="structure-sort"
                    min="0"
                    value={sortOrder}
                    onChange={setSortOrder}
                    placeholder="1"
                  />
                </Field>
              </div>

              {kind === 'officials' && scope === 'kepala-desa' ? (
                <Field
                  label="Sambutan Kepala Desa"
                  htmlFor="structure-welcome"
                  hint="Tampil di kartu kepala desa pada halaman struktur pemerintahan"
                >
                  <TextArea
                    id="structure-welcome"
                    rows={5}
                    value={welcomeText}
                    onChange={setWelcomeText}
                    placeholder="Memimpin penyelenggaraan pemerintahan desa…"
                  />
                </Field>
              ) : null}
            </FieldGroup>

            <FieldGroup title="Foto">
              <div className="max-w-sm">
                <ImageUploader
                  folder="pemerintahan"
                  currentImageUrl={photoUrl}
                  currentImagePath={photoPath}
                  maxWidth={800}
                  onUploadComplete={(url, path) => {
                    setPhotoUrl(url)
                    setPhotoPath(path)
                  }}
                  onRemove={() => {
                    setPhotoUrl(null)
                    setPhotoPath(null)
                  }}
                />
              </div>
              <p className="text-xs text-ink-400">
                Foto memakai kotak lingkaran di halaman publik, jadi foto potret menghadap depan lebih
                baik.
              </p>
            </FieldGroup>

            <FieldGroup title="Status">
              <Toggle
                id="structure-active"
                checked={isActive}
                onChange={setIsActive}
                label="Tampilkan di website"
                description="Nonaktifkan untuk menyembunyikan tanpa menghapus data."
              />
            </FieldGroup>
          </FormCard>
        </form>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-paper-200 bg-white py-10 text-center">
          <ImageIcon size={20} className="mx-auto mb-2 text-ink-400" />
          <p className="text-sm text-ink-400">Belum ada data pada bagian ini.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((item) => {
            const official = item as VillageOfficial
            const isEditing = editing === item.id
            return (
              <li
                key={item.id}
                className={`rounded-lg border bg-white p-4 transition-colors ${
                  item.is_active ? 'border-paper-200' : 'border-paper-100 bg-paper-50/60'
                }`}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white bg-paper-200 shadow-sm">
                    {item.photo_url ? (
                      // Foto diunggah runtime dengan path dinamis sehingga tidak dapat
                      // dioptimalkan oleh next/image.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.photo_url}
                        alt={item.name}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-editorial text-sm text-ink-500">
                        {getInitials(item.name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-950">{item.name}</p>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {kind === 'officials' && scope === 'kepala-dusun' && official.dusun
                        ? `Kadus ${official.dusun}`
                        : item.position}
                      {kind === 'officials' && official.period ? ` · Periode ${official.period}` : ''}
                    </p>
                  </div>

                  <span
                    className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      item.is_active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-paper-200 text-ink-500'
                    }`}
                  >
                    {item.is_active ? 'Tampil' : 'Disembunyikan'}
                  </span>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      title="Ubah"
                      aria-label={`Ubah ${item.name}`}
                      className="rounded-md p-2 text-ink-400 transition-colors hover:bg-green-50 hover:text-green-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(item)}
                      title={item.is_active ? 'Sembunyikan' : 'Tampilkan'}
                      aria-label={`${item.is_active ? 'Sembunyikan' : 'Tampilkan'} ${item.name}`}
                      className="rounded-md p-2 text-ink-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Power size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(item)}
                      title="Hapus"
                      aria-label={`Hapus ${item.name}`}
                      className="rounded-md p-2 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isEditing && adding === false ? (
                  <p className="mt-3 border-t border-paper-100 pt-3 text-xs text-green-700">
                    Mode ubah aktif. Gunakan tombol Simpan di formulir di atas, atau klik Batal.
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}

      {deleting ? (
        <ConfirmDelete
          title="Hapus Data"
          message={`Apakah Anda yakin ingin menghapus "${deleting.name}"? Data yang dihapus tidak dapat dikembalikan.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      ) : null}
    </div>
  )
}
