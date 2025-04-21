'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/forms/ImageUploader'

export default function ProfilePage() {
  const [username, setUsername] = useState('test_user')
  const [email, setEmail] = useState('test@example.com')
  const [firstName, setFirstName] = useState('太郎')
  const [lastName, setLastName] = useState('テスト')

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [fileError, setFileError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    setError('')

    if (!username || !email) {
      setError('ユーザー名とメールアドレスは必須です。')
      return
    }

    if (!/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('正しいメールアドレスを入力してください。')
      return
    }

    setSuccess('プロフィールを更新しました。')
  }

  return (
    <Card className="max-w-xl mx-auto mt-12">
      <CardHeader>
        <CardTitle>プロフィール設定</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="space-y-1">
            <Label htmlFor="username">ユーザー名 *</Label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">メールアドレス *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="lastName">姓（任意）</Label>
            <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="firstName">名（任意）</Label>
            <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
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

          <Button type="submit">保存</Button>
        </form>
      </CardContent>
    </Card>
  )
}
