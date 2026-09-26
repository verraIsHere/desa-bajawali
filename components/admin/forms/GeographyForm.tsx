'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { Alert, Field, FieldGroup, FormCard, NumberInput, SubmitButton, TextInput } from '@/components/admin/Form'
import { useSaveState } from '@/components/admin/useSaveState'
import { parseNumber, requireNumber, saveSingletonRow } from './saveRow'
import type { DesaGeography } from '@/types/database'

export default function GeographyForm({ initialData }: { initialData: DesaGeography | null }) {
  const { status, message, saving, save, reset } = useSaveState()

  const [areaHa, setAreaHa] = useState(initialData ? String(initialData.area_ha) : '')
  const [elevation, setElevation] = useState(initialData?.elevation ?? '')
  const [rainfall, setRainfall] = useState(initialData?.rainfall ?? '')
  const [temperature, setTemperature] = useState(initialData?.temperature ?? '')
  const [north, setNorth] = useState(initialData?.north_boundary ?? '')
  const [east, setEast] = useState(initialData?.east_boundary ?? '')
  const [south, setSouth] = useState(initialData?.south_boundary ?? '')
  const [west, setWest] = useState(initialData?.west_boundary ?? '')
  const [latitude, setLatitude] = useState(
    initialData?.latitude != null ? String(initialData.latitude) : '',
  )
  const [longitude, setLongitude] = useState(
    initialData?.longitude != null ? String(initialData.longitude) : '',
  )
  const [validation, setValidation] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setValidation(null)
    reset()

    let area: number
    try {
      area = requireNumber(areaHa, 'Luas wilayah')
    } catch (error) {
      setValidation(error instanceof Error ? error.message : 'Luas wilayah tidak valid')
      return
    }

    const parsedLatitude = parseNumber(latitude)
    const parsedLongitude = parseNumber(longitude)
    if ((latitude.trim() && parsedLatitude === null) || (longitude.trim() && parsedLongitude === null)) {
      setValidation('Latitude dan longitude harus berupa angka desimal')
      return
    }

    await save(
      () =>
        saveSingletonRow('desa_geography', initialData?.id ?? null, {
          area_ha: area,
          elevation: elevation.trim(),
          rainfall: rainfall.trim(),
          temperature: temperature.trim(),
          north_boundary: north.trim(),
          east_boundary: east.trim(),
          south_boundary: south.trim(),
          west_boundary: west.trim(),
          latitude: parsedLatitude,
          longitude: parsedLongitude,
        }),
      'Data geografis berhasil disimpan',
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {validation ? <Alert variant="error">{validation}</Alert> : null}
      {status === 'success' && message ? <Alert variant="success">{message}</Alert> : null}
      {status === 'error' && message ? <Alert variant="error">{message}</Alert> : null}

      <FormCard
        title="Data Geografis"
        description="Wilayah, iklim, batas, dan koordinat. Dipakai oleh /profil/geografis, /kontak, dan peta."
      >
        <FieldGroup title="Wilayah dan iklim">
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Luas Wilayah (Ha)" htmlFor="geo-area" required>
              <NumberInput
                id="geo-area"
                step="0.001"
                value={areaHa}
                onChange={setAreaHa}
                placeholder="7125.816"
              />
            </Field>
            <Field label="Ketinggian" htmlFor="geo-elevation" hint="Contoh: 0–150 mdpl">
              <TextInput
                id="geo-elevation"
                value={elevation}
                onChange={setElevation}
                placeholder="0-150 mdpl"
              />
            </Field>
            <Field label="Suhu" htmlFor="geo-temperature" hint="Contoh: 26–32 °C">
              <TextInput
                id="geo-temperature"
                value={temperature}
                onChange={setTemperature}
                placeholder="26-32 °C"
              />
            </Field>
            <Field label="Curah Hujan" htmlFor="geo-rainfall" hint="Contoh: 1.500–2.000 mm/tahun">
              <TextInput
                id="geo-rainfall"
                value={rainfall}
                onChange={setRainfall}
                placeholder="1500-2000 mm/tahun"
              />
            </Field>
          </div>
        </FieldGroup>

        <FieldGroup title="Batas wilayah">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Batas Utara" htmlFor="geo-north">
              <TextInput
                id="geo-north"
                value={north}
                onChange={setNorth}
                placeholder="Desa Parabu"
              />
            </Field>
            <Field label="Batas Timur" htmlFor="geo-east">
              <TextInput
                id="geo-east"
                value={east}
                onChange={setEast}
                placeholder="Desa Karave, Kecamatan Bulutaba"
              />
            </Field>
            <Field label="Batas Selatan" htmlFor="geo-south">
              <TextInput
                id="geo-south"
                value={south}
                onChange={setSouth}
                placeholder="HGU PT Unggul Widya Tek"
              />
            </Field>
            <Field label="Batas Barat" htmlFor="geo-west">
              <TextInput
                id="geo-west"
                value={west}
                onChange={setWest}
                placeholder="Desa Singgani"
              />
            </Field>
          </div>
        </FieldGroup>

        <FieldGroup title="Koordinat" description="Titik pusat desa, dipakai untuk peta dan tautan Google Maps">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Latitude" htmlFor="geo-latitude" hint="Contoh: -1.4904673">
              <NumberInput
                id="geo-latitude"
                step="0.0000001"
                value={latitude}
                onChange={setLatitude}
                placeholder="-1.4904673"
              />
            </Field>
            <Field label="Longitude" htmlFor="geo-longitude" hint="Contoh: 119.3656846">
              <NumberInput
                id="geo-longitude"
                step="0.0000001"
                value={longitude}
                onChange={setLongitude}
                placeholder="119.3656846"
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
        <p className="text-xs text-ink-400">Perubahan langsung tampil di halaman geografis publik.</p>
      </div>
    </form>
  )
}
