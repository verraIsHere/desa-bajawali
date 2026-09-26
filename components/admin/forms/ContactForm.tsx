'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { Alert, Field, FieldGroup, FormCard, SubmitButton, TextArea, TextInput } from '@/components/admin/Form'
import { useSaveState } from '@/components/admin/useSaveState'
import { parseNumber, saveSingletonRow } from './saveRow'
import type { ContactInformation } from '@/types/database'

export default function ContactForm({ initialData }: { initialData: ContactInformation | null }) {
  const { status, message, saving, save, reset } = useSaveState()

  const [address, setAddress] = useState(initialData?.address ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? '')
  const [serviceHours, setServiceHours] = useState(initialData?.service_hours ?? '')
  const [latitude, setLatitude] = useState(
    initialData?.latitude != null ? String(initialData.latitude) : '',
  )
  const [longitude, setLongitude] = useState(
    initialData?.longitude != null ? String(initialData.longitude) : '',
  )
  const [googleMapsUrl, setGoogleMapsUrl] = useState(initialData?.google_maps_url ?? '')
  const [validation, setValidation] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setValidation(null)
    reset()

    if (!address.trim()) {
      setValidation('Alamat kantor desa wajib diisi')
      return
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidation('Format email belum benar')
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
        saveSingletonRow('contact_information', initialData?.id ?? null, {
          address: address.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          service_hours: serviceHours.trim(),
          latitude: parsedLatitude,
          longitude: parsedLongitude,
          google_maps_url: googleMapsUrl.trim() || null,
        }),
      'Informasi kontak berhasil disimpan',
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {validation ? <Alert variant="error">{validation}</Alert> : null}
      {status === 'success' && message ? <Alert variant="success">{message}</Alert> : null}
      {status === 'error' && message ? <Alert variant="error">{message}</Alert> : null}

      <FormCard
        title="Informasi Kontak"
        description="Data ini dipakai bersama oleh beranda, halaman /kontak, footer, dan peta."
      >
        <FieldGroup title="Kantor Desa">
          <Field label="Alamat" htmlFor="contact-address" required>
            <TextArea
              id="contact-address"
              rows={2}
              value={address}
              onChange={setAddress}
              placeholder="Kantor Desa Bajawali, Kecamatan Lariang, Kabupaten Pasangkayu"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Email" htmlFor="contact-email">
              <TextInput
                id="contact-email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="desabajawali2@gmail.com"
              />
            </Field>
            <Field label="WhatsApp" htmlFor="contact-whatsapp" hint="Format +62xxx">
              <TextInput
                id="contact-whatsapp"
                type="tel"
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="+62 857-5606-3460"
              />
            </Field>
            <Field label="Jam Pelayanan" htmlFor="contact-hours">
              <TextInput
                id="contact-hours"
                value={serviceHours}
                onChange={setServiceHours}
                placeholder="Senin–Jumat: 08.00–15.00 WITA"
              />
            </Field>
          </div>
        </FieldGroup>

        <FieldGroup title="Lokasi dan peta">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Latitude" htmlFor="contact-latitude">
              <TextInput
                id="contact-latitude"
                value={latitude}
                onChange={setLatitude}
                placeholder="-1.4904673"
              />
            </Field>
            <Field label="Longitude" htmlFor="contact-longitude">
              <TextInput
                id="contact-longitude"
                value={longitude}
                onChange={setLongitude}
                placeholder="119.3656846"
              />
            </Field>
          </div>
          <Field
            label="Link Google Maps"
            htmlFor="contact-maps"
            hint="Tautan yang dibuka pengunjung dari halaman kontak"
          >
            <TextInput
              id="contact-maps"
              type="url"
              value={googleMapsUrl}
              onChange={setGoogleMapsUrl}
              placeholder="https://www.google.com/maps/place/..."
            />
          </Field>
        </FieldGroup>
      </FormCard>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton saving={saving}>
          <Save size={16} />
          Simpan Perubahan
        </SubmitButton>
        <p className="text-xs text-ink-400">Perubahan langsung tampil di beranda dan halaman kontak.</p>
      </div>
    </form>
  )
}
