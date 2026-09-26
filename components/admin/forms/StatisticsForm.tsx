'use client'

import { useState } from 'react'
import { AlertTriangle, Save } from 'lucide-react'
import { Alert, Field, FieldGroup, FormCard, NumberInput, SubmitButton } from '@/components/admin/Form'
import { useSaveState } from '@/components/admin/useSaveState'
import { requireNumber, saveSingletonRow } from './saveRow'
import type { DesaStatistics } from '@/types/database'

const FIELDS = [
  { key: 'population', label: 'Jumlah Penduduk', hint: 'Total jiwa' },
  { key: 'male_population', label: 'Laki-laki', hint: 'Jumlah jiwa laki-laki' },
  { key: 'female_population', label: 'Perempuan', hint: 'Jumlah jiwa perempuan' },
  { key: 'households', label: 'Kepala Keluarga', hint: 'Jumlah KK' },
  { key: 'dusun', label: 'Dusun', hint: 'Jumlah dusun' },
  { key: 'rt', label: 'RT', hint: 'Jumlah rukun tetangga' },
  { key: 'data_year', label: 'Tahun Data', hint: 'Tahun validity statistik' },
] as const

type FieldKey = (typeof FIELDS)[number]['key']

type FormState = Record<FieldKey, string>

function initialState(data: DesaStatistics | null): FormState {
  return {
    population: data ? String(data.population) : '',
    male_population: data ? String(data.male_population) : '',
    female_population: data ? String(data.female_population) : '',
    households: data ? String(data.households) : '',
    dusun: data ? String(data.dusun) : '',
    rt: data ? String(data.rt) : '',
    data_year: data ? String(data.data_year) : '',
  }
}

export default function StatisticsForm({ initialData }: { initialData: DesaStatistics | null }) {
  const { status, message, saving, save, reset } = useSaveState()

  const [values, setValues] = useState<FormState>(() => initialState(initialData))
  const [validation, setValidation] = useState<string | null>(null)

  function update(key: FieldKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const population = Number(values.population)
  const male = Number(values.male_population)
  const female = Number(values.female_population)
  const hasComposition = values.population && values.male_population && values.female_population
  const compositionMismatch =
    hasComposition && Number.isFinite(population) && male + female !== population

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setValidation(null)
    reset()

    const payload: Partial<Record<FieldKey, number>> = {}
    for (const field of FIELDS) {
      try {
        payload[field.key] = requireNumber(values[field.key], field.label)
      } catch (error) {
        setValidation(error instanceof Error ? error.message : `${field.label} tidak valid`)
        return
      }
    }

    await save(
      () => saveSingletonRow('desa_statistics', initialData?.id ?? null, payload),
      'Statistik desa berhasil disimpan',
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {validation ? <Alert variant="error">{validation}</Alert> : null}
      {status === 'success' && message ? <Alert variant="success">{message}</Alert> : null}
      {status === 'error' && message ? <Alert variant="error">{message}</Alert> : null}

      <FormCard
        title="Statistik Utama"
        description="Angka populasi, KK, dusun, dan RT. Sumber angka ini di beranda, /data-desa, dan /profil/demografi."
      >
        <FieldGroup title="Kependudukan">
          <div className="grid gap-5 sm:grid-cols-3">
            {FIELDS.slice(0, 3).map((field) => (
              <Field key={field.key} label={field.label} htmlFor={`stat-${field.key}`} hint={field.hint} required>
                <NumberInput
                  id={`stat-${field.key}`}
                  min="0"
                  value={values[field.key]}
                  onChange={(value) => update(field.key, value)}
                  placeholder="0"
                />
              </Field>
            ))}
          </div>

          {compositionMismatch ? (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                Laki-laki + perempuan ({male + female}) tidak sama dengan jumlah penduduk ({population}).
                Data tetap bisa disimpan, tetapi sebaiknya konsisten.
              </span>
            </div>
          ) : null}
        </FieldGroup>

        <FieldGroup title="Wilayah dan keluarga">
          <div className="grid gap-5 sm:grid-cols-3">
            {FIELDS.slice(3).map((field) => (
              <Field key={field.key} label={field.label} htmlFor={`stat-${field.key}`} hint={field.hint} required>
                <NumberInput
                  id={`stat-${field.key}`}
                  min="0"
                  value={values[field.key]}
                  onChange={(value) => update(field.key, value)}
                  placeholder="0"
                />
              </Field>
            ))}
          </div>
        </FieldGroup>
      </FormCard>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton saving={saving}>
          <Save size={16} />
          Simpan Perubahan
        </SubmitButton>
        <p className="text-xs text-ink-400">Statistik ini tidak lagi perlu diubah di kode.</p>
      </div>
    </form>
  )
}
