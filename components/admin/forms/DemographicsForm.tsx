'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { Alert, FormCard, SubmitButton } from '@/components/admin/Form'
import { useSaveState } from '@/components/admin/useSaveState'
import ArrayField, { type LabeledValue } from './ArrayField'
import { saveSingletonRow } from './saveRow'
import type { DesaDemographics } from '@/types/database'

type SectionKey =
  | 'age_groups'
  | 'religions'
  | 'ethnicities'
  | 'marital_statuses'
  | 'occupations'
  | 'dusun_distribution'

const PRESETS: Record<SectionKey, readonly string[]> = {
  age_groups: ['0-14', '15-24', '25-54', '55-64', '65+'],
  religions: ['Islam', 'Hindu', 'Kristen', 'Katholik', 'Buddha', 'Konghucu'],
  ethnicities: ['Bali', 'Bugis', 'Jawa', 'Tator', 'Mandar', 'Minahasa'],
  marital_statuses: ['Kawin', 'Belum Kawin', 'Cerai Hidup', 'Cerai Mati'],
  occupations: [
    'Petani Pekebun',
    'Peternak',
    'Pedagang',
    'Buruh Tani',
    'Kontruksi',
    'Pegawai',
    'Nelayan',
  ],
  dusun_distribution: ['Kerta', 'Makmur', 'Lestari', 'Mandiri'],
}

function toItems(rows: unknown): LabeledValue[] {
  if (!Array.isArray(rows)) return []
  return rows
    .filter((row): row is { label: string; value: number | null } => !!row && typeof row === 'object')
    .map((row) => ({
      label: String(row.label ?? ''),
      value: typeof row.value === 'number' ? row.value : null,
    }))
}

function toPayload(items: LabeledValue[]) {
  return items
    .filter((item) => item.label.trim() !== '')
    .map((item) => ({ label: item.label.trim(), value: item.value }))
}

export default function DemographicsForm({ initialData }: { initialData: DesaDemographics | null }) {
  const { status, message, saving, save, reset } = useSaveState()

  const [ageGroups, setAgeGroups] = useState<LabeledValue[]>(() => toItems(initialData?.age_groups))
  const [religions, setReligions] = useState<LabeledValue[]>(() => toItems(initialData?.religions))
  const [ethnicities, setEthnicities] = useState<LabeledValue[]>(() => toItems(initialData?.ethnicities))
  const [maritalStatuses, setMaritalStatuses] = useState<LabeledValue[]>(() =>
    toItems(initialData?.marital_statuses),
  )
  const [occupations, setOccupations] = useState<LabeledValue[]>(() => toItems(initialData?.occupations))
  const [dusunDistribution, setDusunDistribution] = useState<LabeledValue[]>(() =>
    toItems(initialData?.dusun_distribution),
  )

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    reset()

    await save(
      () =>
        saveSingletonRow('desa_demographics', initialData?.id ?? null, {
          age_groups: toPayload(ageGroups),
          religions: toPayload(religions),
          ethnicities: toPayload(ethnicities),
          marital_statuses: toPayload(maritalStatuses),
          occupations: toPayload(occupations),
          dusun_distribution: toPayload(dusunDistribution),
        }),
      'Data demografi berhasil disimpan',
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'success' && message ? <Alert variant="success">{message}</Alert> : null}
      {status === 'error' && message ? <Alert variant="error">{message}</Alert> : null}

      <FormCard
        title="Data Demografi"
        description="Kelompok umur, agama, suku, status pernikahan, mata pencaharian, dan distribusi dusun. Chart di /data-desa mengikuti data ini secara otomatis."
      >
        <ArrayField
          legend="Kelompok umur"
          description="Jumlah jiwa per kelompok umur"
          items={ageGroups}
          onChange={setAgeGroups}
          presets={PRESETS.age_groups}
        />
        <ArrayField
          legend="Agama dan kepercayaan"
          description="Jumlah jiwa per agama/kepercayaan"
          items={religions}
          onChange={setReligions}
          presets={PRESETS.religions}
        />
        <ArrayField
          legend="Suku"
          description="Jumlah jiwa per suku"
          items={ethnicities}
          onChange={setEthnicities}
          presets={PRESETS.ethnicities}
        />
        <ArrayField
          legend="Status pernikahan"
          description="Jumlah jiwa per status pernikahan"
          items={maritalStatuses}
          onChange={setMaritalStatuses}
          presets={PRESETS.marital_statuses}
        />
        <ArrayField
          legend="Mata pencaharian"
          description="Kosongkan jumlah bila belum ada data"
          items={occupations}
          onChange={setOccupations}
          valueMode="optional-number"
          valuePlaceholder="—"
          presets={PRESETS.occupations}
        />
        <ArrayField
          legend="Distribusi penduduk per dusun"
          description="Jumlah jiwa per dusun"
          items={dusunDistribution}
          onChange={setDusunDistribution}
          presets={PRESETS.dusun_distribution}
        />
      </FormCard>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton saving={saving}>
          <Save size={16} />
          Simpan Perubahan
        </SubmitButton>
        <p className="text-xs text-ink-400">Baris tanpa nama akan diabaikan saat disimpan.</p>
      </div>
    </form>
  )
}
