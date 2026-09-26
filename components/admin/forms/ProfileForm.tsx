'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { Alert, Field, FieldGroup, FormCard, SubmitButton, TextArea, TextInput } from '@/components/admin/Form'
import { useSaveState } from '@/components/admin/useSaveState'
import { saveSingletonRow } from './saveRow'
import type { DesaProfile } from '@/types/database'

export default function ProfileForm({ initialData }: { initialData: DesaProfile | null }) {
  const { status, message, saving, save, reset } = useSaveState()

  const [name, setName] = useState(initialData?.name ?? '')
  const [headName, setHeadName] = useState(initialData?.head_name ?? '')
  const [district, setDistrict] = useState(initialData?.district ?? '')
  const [regency, setRegency] = useState(initialData?.regency ?? '')
  const [province, setProvince] = useState(initialData?.province ?? '')
  const [motto, setMotto] = useState(initialData?.motto ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [history, setHistory] = useState(initialData?.history ?? '')
  const [dataYear, setDataYear] = useState(String(initialData?.data_year ?? ''))
  const [validation, setValidation] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setValidation(null)
    reset()

    if (!name.trim()) {
      setValidation('Nama desa wajib diisi')
      return
    }
    if (!dataYear.trim() || !Number.isFinite(Number(dataYear))) {
      setValidation('Tahun data harus berupa angka')
      return
    }

    await save(
      () =>
        saveSingletonRow('desa_profile', initialData?.id ?? null, {
          name: name.trim(),
          head_name: headName.trim(),
          district: district.trim(),
          regency: regency.trim(),
          province: province.trim(),
          motto: motto.trim(),
          description: description.trim(),
          history: history.trim(),
          data_year: Number(dataYear),
        }),
      'Profil desa berhasil disimpan',
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {validation ? <Alert variant="error">{validation}</Alert> : null}
      {status === 'success' && message ? <Alert variant="success">{message}</Alert> : null}
      {status === 'error' && message ? <Alert variant="error">{message}</Alert> : null}

      <FormCard
        title="Identitas Desa"
        description="Data ini tampil di beranda, halaman profil, dan footer website."
      >
        <FieldGroup title="Nama dan wilayah">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama Desa" htmlFor="profile-name" required>
              <TextInput id="profile-name" value={name} onChange={setName} placeholder="Desa Bajawali" />
            </Field>
            <Field label="Nama Kepala Desa" htmlFor="profile-head" hint="Kosongkan bila belum diketahui">
              <TextInput
                id="profile-head"
                value={headName}
                onChange={setHeadName}
                placeholder="Ketut Langga, S.Ag"
              />
            </Field>
            <Field label="Kecamatan" htmlFor="profile-district">
              <TextInput id="profile-district" value={district} onChange={setDistrict} placeholder="Lariang" />
            </Field>
            <Field label="Kabupaten" htmlFor="profile-regency">
              <TextInput
                id="profile-regency"
                value={regency}
                onChange={setRegency}
                placeholder="Pasangkayu"
              />
            </Field>
            <Field label="Provinsi" htmlFor="profile-province">
              <TextInput
                id="profile-province"
                value={province}
                onChange={setProvince}
                placeholder="Sulawesi Barat"
              />
            </Field>
            <Field label="Moto Desa" htmlFor="profile-motto">
              <TextInput id="profile-motto" value={motto} onChange={setMotto} placeholder="BAJAWALIKU JAYA" />
            </Field>
          </div>
        </FieldGroup>

        <FieldGroup title="Narasi">
          <Field label="Deskripsi Singkat" htmlFor="profile-description" hint="Ringkasan 1–3 kalimat">
            <TextArea
              id="profile-description"
              rows={3}
              value={description}
              onChange={setDescription}
              placeholder="Deskripsi singkat Desa Bajawali"
            />
          </Field>
          <Field label="Sejarah Desa" htmlFor="profile-history" hint="Tampil di halaman /profil/sejarah">
            <TextArea
              id="profile-history"
              rows={6}
              value={history}
              onChange={setHistory}
              placeholder="Asal-usul dan perkembangan Desa Bajawali"
            />
          </Field>
        </FieldGroup>

        <FieldGroup title="Data dasar">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Tahun Data" htmlFor="profile-year" required hint="Tahun validity data desa">
              <TextInput
                id="profile-year"
                type="number"
                value={dataYear}
                onChange={setDataYear}
                placeholder="2026"
              />
            </Field>
          </div>
        </FieldGroup>
      </FormCard>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton saving={saving}>
          <Save size={16} />
          Simpan Perubahan
        </SubmitButton>
        <p className="text-xs text-ink-400">
          Perubahan langsung tampil di website publik tanpa rebuild.
        </p>
      </div>
    </form>
  )
}
