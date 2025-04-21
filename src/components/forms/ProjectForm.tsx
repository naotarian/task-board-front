'use client'

import { useState, FormEvent } from 'react'
import { ImageUploader } from '@/components/forms/ImageUploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'

export type ProjectFormValues = {
  name: string
  description: string
  thumbnail: File | null
}

type Props = {
  onSubmit: (values: ProjectFormValues) => Promise<Record<string, string[]> | null>
  isSubmitting?: boolean
}

export const ProjectForm = ({ onSubmit, isSubmitting = false }: Props) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormErrors({})
    const errors = await onSubmit({ name, description, thumbnail })
    if (errors) setFormErrors(errors)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">プロジェクト名 *</Label>
        <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
        {formErrors.name && <p className="text-sm text-red-500">{formErrors.name[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">説明 (任意)</Label>
        <Textarea
          id="description"
          rows={4}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {formErrors.description && (
          <p className="text-sm text-red-500">{formErrors.description[0]}</p>
        )}
      </div>

      <ImageUploader
        label="プロフィール画像"
        value={thumbnail}
        onChange={setThumbnail}
        previewUrl={previewUrl}
        onPreviewChange={setPreviewUrl}
        error={fileError}
        onError={setFileError}
      />

      {fileError && <Alert variant="destructive">{fileError}</Alert>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        作成する
      </Button>
    </form>
  )
}
