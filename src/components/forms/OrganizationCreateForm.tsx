'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { authFetch } from '@/lib/fetcher'
import { ImageUploader } from './ImageUploader'

export default function OrganizationCreateForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [subDomain, setSubDomain] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState('')

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setGeneralError('')
    setFormErrors({})

    try {
      const res = await authFetch('/organizations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          sub_domain: subDomain,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (typeof data === 'object') {
          setFormErrors(data)
        } else {
          throw new Error('組織の作成に失敗しました')
        }
        return
      }

      setSuccessMessage('組織を作成しました！ 🎉')
      setName('')
      setDescription('')
      setSubDomain('')
    } catch (err: any) {
      setGeneralError(err.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-xl mx-auto mt-12">
      <CardHeader>
        <CardTitle>組織を作成する</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {successMessage && (
            <Alert variant="default">
              <AlertTitle>成功！</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          {generalError && (
            <Alert variant="destructive">
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">組織名 *</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              // required
              maxLength={100}
              disabled={loading}
            />
            {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明 (任意)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
              disabled={loading}
            />
            {formErrors.description && (
              <p className="text-sm text-red-500">{formErrors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subDomain">サブドメイン *</Label>
            <Input
              id="subDomain"
              value={subDomain}
              onChange={e => setSubDomain(e.target.value)}
              // required
              maxLength={100}
              disabled={loading}
            />
            {formErrors.sub_domain && (
              <p className="text-sm text-red-500">{formErrors.sub_domain}</p>
            )}
          </div>

          <ImageUploader
            label="ロゴ画像 (任意)"
            value={thumbnail}
            onChange={setThumbnail}
            previewUrl={previewUrl}
            onPreviewChange={setPreviewUrl}
            error={fileError}
            onError={setFileError}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            作成する
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
